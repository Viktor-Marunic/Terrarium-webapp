-- Community events (workshops, plant swaps, meetups), who's going, their photos,
-- and a "new event" notification for everyone else. Prices are display-only: no payments (pay at the door).

-- ---------------------------------------------------------------------------
-- events
-- ---------------------------------------------------------------------------
create table public.events (
  id uuid primary key default gen_random_uuid(),
  -- References profiles so the API can embed the host's username/avatar; defaults to the caller (insert policy enforces it).
  host_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  type text not null check (type in ('workshop', 'plant_swap', 'meetup')),
  title text not null check (char_length(title) between 3 and 100),
  description text check (char_length(description) <= 2000),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  place text not null check (char_length(place) between 2 and 100),
  address text check (char_length(address) <= 200),
  -- Whole Danish kroner; 0 = free.
  price integer not null default 0 check (price between 0 and 10000),
  -- Max number of people going; null = no limit.
  capacity integer check (capacity between 1 and 1000),
  -- Public URL in the event-images bucket; null = placeholder.
  image_url text,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

-- The events page lists upcoming events soonest first, optionally one type.
create index events_type_starts_at_idx on public.events (type, starts_at);
create index events_starts_at_idx on public.events (starts_at);
create index events_host_id_idx on public.events (host_id);

alter table public.events enable row level security;

-- Logged-in users only, like listings: the whole app sits behind login and addresses are semi-private.
create policy "Events are viewable by logged-in users"
  on public.events for select
  to authenticated
  using (true);

create policy "Users can host events as themselves"
  on public.events for insert
  to authenticated
  with check ((select auth.uid()) = host_id);

create policy "Hosts can update their own events"
  on public.events for update
  to authenticated
  using ((select auth.uid()) = host_id)
  with check ((select auth.uid()) = host_id);

create policy "Hosts can delete their own events"
  on public.events for delete
  to authenticated
  using ((select auth.uid()) = host_id);

-- Column privileges (same approach as posts/listings): no rewriting created_at or handing an event to someone else.
revoke insert, update on public.events from anon, authenticated;
grant insert (host_id, type, title, description, starts_at, ends_at, place, address, price, capacity, image_url)
  on public.events to authenticated;
grant update (type, title, description, starts_at, ends_at, place, address, price, capacity, image_url)
  on public.events to authenticated;

-- ---------------------------------------------------------------------------
-- event_attendees: who's going ("I'm going"). Visible to logged-in users (the avatars + "14 going").
-- ---------------------------------------------------------------------------
create table public.event_attendees (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create index event_attendees_user_id_idx on public.event_attendees (user_id);

alter table public.event_attendees enable row level security;

create policy "Attendees are viewable by logged-in users"
  on public.event_attendees for select
  to authenticated
  using (true);

create policy "Users can RSVP as themselves"
  on public.event_attendees for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can cancel their own RSVP"
  on public.event_attendees for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Nothing on an RSVP is editable; you go or you don't.
revoke update on public.event_attendees from anon, authenticated;

-- Refuses RSVPs for full or finished events. Enforced here, not just in the UI, so two people can't grab the last spot.
-- security definer: locking the event row (for update) needs rights an attendee doesn't have.
create function public.check_event_rsvp()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  event_capacity integer;
  event_ends_at timestamptz;
  going integer;
begin
  -- Lock the event so simultaneous RSVPs are counted one after the other.
  select capacity, ends_at into event_capacity, event_ends_at
  from public.events where id = new.event_id
  for update;

  if event_ends_at < now() then
    raise exception 'This event has already ended';
  end if;

  if event_capacity is not null then
    select count(*) into going from public.event_attendees where event_id = new.event_id;
    if going >= event_capacity then
      raise exception 'This event is full';
    end if;
  end if;
  return new;
end;
$$;

create trigger before_event_rsvp
  before insert on public.event_attendees
  for each row execute function public.check_event_rsvp();

-- ---------------------------------------------------------------------------
-- event-images storage bucket (same rules as listing-images)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('event-images', 'event-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']);

-- File paths are {user_id}/{uuid}.{ext}, so the first folder name says who owns the file.
create policy "Users can upload event images to their own folder"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'event-images' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- Storage's remove() reads the object before deleting it, so owners need select on their own files too.
create policy "Users can read their own event images"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'event-images' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Users can delete their own event images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'event-images' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- ---------------------------------------------------------------------------
-- notifications: a new event notifies every other user
-- ---------------------------------------------------------------------------
alter table public.notifications
  add column event_id uuid references public.events (id) on delete cascade;

-- Re-create the type list with 'new_event' added (the constraint got its default name in the earlier migration).
alter table public.notifications drop constraint notifications_type_check;
alter table public.notifications add constraint notifications_type_check check (type in (
  'post_vote', 'comment_vote', 'post_comment', 'comment_reply',
  'new_listing', 'listing_bookmarked', 'listing_in_cart',
  'new_event'
));

-- One row per other user, like new listings. Fine for a small community; revisit if it grows.
create function public.notify_on_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.notifications (recipient_id, actor_id, type, event_id)
  select p.id, new.host_id, 'new_event', new.id
  from public.profiles p
  where p.id <> new.host_id;
  return null;
end;
$$;

create trigger on_event_notify
  after insert on public.events
  for each row execute function public.notify_on_event();
