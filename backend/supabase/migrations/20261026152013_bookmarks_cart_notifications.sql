-- Marketplace extras: bookmarks (saved listings), a shopping bag (cart_items, no checkout or payments),
-- and in-app notifications created automatically by triggers. Also locks down which listing columns users may write.

-- ---------------------------------------------------------------------------
-- listings: column privileges (same approach as posts/comments in create_votes)
-- ---------------------------------------------------------------------------
-- RLS decides WHICH rows a user may touch; these grants decide WHICH columns.
-- Without them a seller could rewrite created_at or move a listing to another seller_id through the API.
revoke insert, update on public.listings from anon, authenticated;
grant insert (seller_id, title, description, price, condition, category, contact_info, image_urls) on public.listings to authenticated;
grant update (title, description, price, condition, category, contact_info, image_urls, status) on public.listings to authenticated;

-- ---------------------------------------------------------------------------
-- bookmarks: listings a user saved (the heart). Private: only the owner sees their own.
-- ---------------------------------------------------------------------------
create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  listing_id uuid not null references public.listings (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, listing_id)
);

create index bookmarks_listing_id_idx on public.bookmarks (listing_id);

alter table public.bookmarks enable row level security;

create policy "Users can see their own bookmarks"
  on public.bookmarks for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can bookmark as themselves"
  on public.bookmarks for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can remove their own bookmarks"
  on public.bookmarks for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- cart_items: the shopping bag. Items can be added and counted, but there is no checkout or payment.
-- ---------------------------------------------------------------------------
create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  listing_id uuid not null references public.listings (id) on delete cascade,
  quantity smallint not null default 1 check (quantity between 1 and 10),
  created_at timestamptz not null default now(),
  -- One row per listing; adding it again changes the quantity instead.
  unique (user_id, listing_id)
);

create index cart_items_listing_id_idx on public.cart_items (listing_id);

alter table public.cart_items enable row level security;

create policy "Users can see their own bag"
  on public.cart_items for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- You can't put your own listing in your bag.
create policy "Users can add other people's listings to their own bag"
  on public.cart_items for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and not exists (
      select 1 from public.listings l where l.id = listing_id and l.seller_id = (select auth.uid())
    )
  );

create policy "Users can change quantities in their own bag"
  on public.cart_items for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can remove items from their own bag"
  on public.cart_items for delete
  to authenticated
  using ((select auth.uid()) = user_id);

revoke update on public.cart_items from anon, authenticated;
grant update (quantity) on public.cart_items to authenticated;

-- ---------------------------------------------------------------------------
-- notifications: one row per recipient per event. Only triggers create them (no insert policy);
-- users can read, mark as read and delete their own.
-- ---------------------------------------------------------------------------
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles (id) on delete cascade,
  -- Who caused it (the voter, commenter, seller…).
  actor_id uuid references public.profiles (id) on delete cascade,
  -- Add new types here (e.g. 'message' when private messages arrive) together with a trigger that creates them.
  type text not null check (type in (
    'post_vote', 'comment_vote', 'post_comment', 'comment_reply',
    'new_listing', 'listing_bookmarked', 'listing_in_cart'
  )),
  -- What it is about; the frontend links to the post or listing. Deleting the target deletes the notification.
  post_id uuid references public.posts (id) on delete cascade,
  comment_id uuid references public.comments (id) on delete cascade,
  listing_id uuid references public.listings (id) on delete cascade,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- The bell lists a user's newest notifications and counts the unread ones.
create index notifications_recipient_id_created_at_idx on public.notifications (recipient_id, created_at desc);

alter table public.notifications enable row level security;

create policy "Users can see their own notifications"
  on public.notifications for select
  to authenticated
  using ((select auth.uid()) = recipient_id);

create policy "Users can mark their own notifications as read"
  on public.notifications for update
  to authenticated
  using ((select auth.uid()) = recipient_id)
  with check ((select auth.uid()) = recipient_id);

create policy "Users can delete their own notifications"
  on public.notifications for delete
  to authenticated
  using ((select auth.uid()) = recipient_id);

revoke insert, update on public.notifications from anon, authenticated;
grant update (read_at) on public.notifications to authenticated;

-- ---------------------------------------------------------------------------
-- notification triggers
-- security definer: the person acting has no insert rights on notifications (and can't read the recipient's rows).
-- Nobody is notified about their own actions.
-- ---------------------------------------------------------------------------

-- Upvotes on your post or comment (downvotes stay silent).
create function public.notify_on_vote()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  recipient uuid;
  comment_post uuid;
begin
  if new.value <> 1 then
    return null;
  end if;

  if new.post_id is not null then
    select author_id into recipient from public.posts where id = new.post_id;
    if recipient is distinct from new.user_id then
      insert into public.notifications (recipient_id, actor_id, type, post_id)
      values (recipient, new.user_id, 'post_vote', new.post_id);
    end if;
  else
    select author_id, post_id into recipient, comment_post from public.comments where id = new.comment_id;
    if recipient is distinct from new.user_id then
      insert into public.notifications (recipient_id, actor_id, type, post_id, comment_id)
      values (recipient, new.user_id, 'comment_vote', comment_post, new.comment_id);
    end if;
  end if;
  return null;
end;
$$;

-- Insert, or a change from down to up. (Toggling off and on again notifies again; fine at this scale.)
create trigger on_vote_notify
  after insert or update of value on public.votes
  for each row execute function public.notify_on_vote();

-- A new top-level comment notifies the post's author; a reply notifies the parent comment's author.
create function public.notify_on_comment()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  recipient uuid;
begin
  if new.parent_id is null then
    select author_id into recipient from public.posts where id = new.post_id;
  else
    select author_id into recipient from public.comments where id = new.parent_id;
  end if;

  if recipient is distinct from new.author_id then
    insert into public.notifications (recipient_id, actor_id, type, post_id, comment_id)
    values (recipient, new.author_id, case when new.parent_id is null then 'post_comment' else 'comment_reply' end,
            new.post_id, new.id);
  end if;
  return null;
end;
$$;

create trigger on_comment_notify
  after insert on public.comments
  for each row execute function public.notify_on_comment();

-- A new listing notifies every other user (one row each). Fine for a small community; revisit if it grows.
create function public.notify_on_listing()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.notifications (recipient_id, actor_id, type, listing_id)
  select p.id, new.seller_id, 'new_listing', new.id
  from public.profiles p
  where p.id <> new.seller_id;
  return null;
end;
$$;

create trigger on_listing_notify
  after insert on public.listings
  for each row execute function public.notify_on_listing();

-- Someone saved your listing, or put it in their bag. TG_ARGV[0] is the notification type.
create function public.notify_seller()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  seller uuid;
begin
  select seller_id into seller from public.listings where id = new.listing_id;
  if seller is distinct from new.user_id then
    insert into public.notifications (recipient_id, actor_id, type, listing_id)
    values (seller, new.user_id, tg_argv[0], new.listing_id);
  end if;
  return null;
end;
$$;

create trigger on_bookmark_notify
  after insert on public.bookmarks
  for each row execute function public.notify_seller('listing_bookmarked');

create trigger on_cart_item_notify
  after insert on public.cart_items
  for each row execute function public.notify_seller('listing_in_cart');
