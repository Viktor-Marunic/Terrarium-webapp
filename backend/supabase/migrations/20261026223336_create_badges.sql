-- Profile badges (the "Achievements" section). `badges` is the catalog, `user_badges` records who earned what.
-- The database awards badges itself (triggers below), so users can't grant themselves one, and an earned badge
-- is kept even if the posts/comments that earned it are later deleted.

-- ---------------------------------------------------------------------------
-- badges (catalog)
-- ---------------------------------------------------------------------------
create table public.badges (
  id text primary key,                 -- stable slug, e.g. 'first-roots'
  title text not null,
  description text not null,
  icon text not null,                  -- key the frontend maps to a Phosphor icon (profiles/badgeIcons.js)
  goal integer not null check (goal > 0),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.badges enable row level security;

create policy "Badges are viewable by everyone"
  on public.badges for select
  to anon, authenticated
  using (true);

-- The catalog itself. New badges = new migration with an insert here plus a case in badge_progress().
insert into public.badges (id, title, description, icon, goal, sort_order) values
  ('first-roots',        'First roots',        'Give your profile a bio.',               'plant',   1, 1),
  ('first-conversation', 'First conversation', 'Start your first community discussion.', 'chat',    1, 2),
  ('proud-builder',      'Proud builder',      'Show off 3 of your terrariums.',         'image',   3, 3),
  ('helping-hand',       'Helping hand',       'Write 10 comments.',                     'chats',  10, 4),
  ('green-thumb',        'Green thumb',        'Earn 10 upvotes on your posts.',         'upvote', 10, 5);

-- ---------------------------------------------------------------------------
-- user_badges (earned)
-- ---------------------------------------------------------------------------
create table public.user_badges (
  user_id uuid not null references public.profiles (id) on delete cascade,
  badge_id text not null references public.badges (id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

alter table public.user_badges enable row level security;

-- Badges are public, like the rest of a profile. There are deliberately no insert/update/delete policies:
-- only award_badges() (security definer) writes here.
create policy "Earned badges are viewable by everyone"
  on public.user_badges for select
  to anon, authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- progress
-- ---------------------------------------------------------------------------
-- A user's current raw progress toward every badge, counted from their profile, posts and comments.
create function public.badge_progress(p_user_id uuid)
returns table (badge_id text, progress integer)
language sql
stable
set search_path = ''
as $$
  select b.id,
    case b.id
      when 'first-roots' then
        (select (coalesce(trim(bio), '') <> '')::int from public.profiles where id = p_user_id)
      when 'first-conversation' then
        (select count(*)::int from public.posts where author_id = p_user_id)
      when 'proud-builder' then
        (select count(*)::int from public.posts where author_id = p_user_id and type = 'showcase')
      when 'helping-hand' then
        (select count(*)::int from public.comments where author_id = p_user_id)
      when 'green-thumb' then
        (select coalesce(sum(score), 0)::int from public.posts where author_id = p_user_id)
      else 0
    end
  from public.badges b;
$$;

-- What the profile page loads (supabase.rpc('get_user_badges')): every badge with progress capped to its goal.
-- An earned badge always shows as full, even if its progress has since dropped.
create function public.get_user_badges(p_user_id uuid)
returns table (id text, title text, description text, icon text, goal integer, progress integer, earned_at timestamptz)
language sql
stable
set search_path = ''
as $$
  select b.id, b.title, b.description, b.icon, b.goal,
    case when ub.earned_at is not null then b.goal else least(greatest(p.progress, 0), b.goal) end,
    ub.earned_at
  from public.badges b
  join public.badge_progress(p_user_id) p on p.badge_id = b.id
  left join public.user_badges ub on ub.badge_id = b.id and ub.user_id = p_user_id
  order by b.sort_order;
$$;

-- ---------------------------------------------------------------------------
-- awarding
-- ---------------------------------------------------------------------------
-- Records every badge the user has reached. Idempotent, so it's safe to call after any activity.
-- security definer: user_badges has no insert policy, so only this function can write to it.
create function public.award_badges(p_user_id uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.user_badges (user_id, badge_id)
  select p_user_id, p.badge_id
  from public.badge_progress(p_user_id) p
  join public.badges b on b.id = p.badge_id
  where p.progress >= b.goal
  on conflict do nothing;
$$;

-- Only the triggers below call it; nobody needs it through the API.
revoke execute on function public.award_badges(uuid) from public, anon, authenticated;

-- Re-checks badges for whoever's activity changed. security definer so it may call award_badges().
create function public.handle_badge_activity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_table_name = 'profiles' then
    perform public.award_badges(new.id);
  else
    perform public.award_badges(new.author_id);
  end if;
  return null;
end;
$$;

-- Bio filled in.
create trigger on_profile_bio_change
  after update of bio on public.profiles
  for each row execute function public.handle_badge_activity();

-- New post, post type changed to showcase, or score changed (votes update posts.score, see create_votes).
create trigger on_post_badge_activity
  after insert or update of type, score on public.posts
  for each row execute function public.handle_badge_activity();

-- New comment.
create trigger on_comment_badge_activity
  after insert on public.comments
  for each row execute function public.handle_badge_activity();

-- Existing users get the badges they've already earned.
select public.award_badges(id) from public.profiles;
