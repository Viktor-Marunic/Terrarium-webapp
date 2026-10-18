-- Up/down votes on posts and comments. Each post/comment keeps a `score` that the database updates on every vote,
-- so feeds can sort by "Top" without the client ever loading individual votes.

-- ---------------------------------------------------------------------------
-- score columns
-- ---------------------------------------------------------------------------
alter table public.posts add column score integer not null default 0;
alter table public.comments add column score integer not null default 0;

-- "Top" feeds: all communities, and per community.
create index posts_score_created_at_idx on public.posts (score desc, created_at desc);
create index posts_community_id_score_idx on public.posts (community_id, score desc, created_at desc);

-- ---------------------------------------------------------------------------
-- votes
-- ---------------------------------------------------------------------------
create table public.votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  post_id uuid references public.posts (id) on delete cascade,
  comment_id uuid references public.comments (id) on delete cascade,
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  -- A vote is on exactly one thing: a post or a comment.
  check (num_nonnulls(post_id, comment_id) = 1),
  -- One vote per user per post / per comment (nulls don't clash, so the two constraints don't interfere).
  unique (user_id, post_id),
  unique (user_id, comment_id)
);

-- Used by the cascades when a post or comment is deleted.
create index votes_post_id_idx on public.votes (post_id);
create index votes_comment_id_idx on public.votes (comment_id);

alter table public.votes enable row level security;

-- Votes are private, like on Reddit: you only ever see your own. This also means embedding votes(value)
-- in a posts/comments query returns just the current user's vote, which the UI uses to highlight the arrow.
create policy "Users can see their own votes"
  on public.votes for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can vote as themselves"
  on public.votes for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can change their own votes"
  on public.votes for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can remove their own votes"
  on public.votes for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- keep score in sync
-- ---------------------------------------------------------------------------
-- security definer: voters may not update other people's posts/comments, but their vote must still move the score.
create function public.handle_vote_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  delta integer;
  target_post uuid;
  target_comment uuid;
begin
  if tg_op = 'INSERT' then
    delta := new.value;
    target_post := new.post_id;
    target_comment := new.comment_id;
  elsif tg_op = 'UPDATE' then
    -- Only `value` can change (see grants below), so the target stays the same.
    delta := new.value - old.value;
    target_post := new.post_id;
    target_comment := new.comment_id;
  else
    delta := -old.value;
    target_post := old.post_id;
    target_comment := old.comment_id;
  end if;

  if target_post is not null then
    update public.posts set score = score + delta where id = target_post;
  else
    update public.comments set score = score + delta where id = target_comment;
  end if;
  return null;
end;
$$;

create trigger on_vote_change
  after insert or update or delete on public.votes
  for each row execute function public.handle_vote_change();

-- ---------------------------------------------------------------------------
-- column privileges: users may only write the columns the app actually edits
-- ---------------------------------------------------------------------------
-- Without this anyone could set their own post's score (or fake created_at / edited_at) through the API.
-- RLS decides WHICH rows a user may touch; these grants decide WHICH columns.
revoke insert, update on public.posts from anon, authenticated;
grant insert (author_id, community_id, type, title, body, image_urls) on public.posts to authenticated;
grant update (type, title, body, image_urls) on public.posts to authenticated;

revoke insert, update on public.comments from anon, authenticated;
grant insert (post_id, author_id, parent_id, body) on public.comments to authenticated;
grant update (body) on public.comments to authenticated;

revoke update on public.votes from anon, authenticated;
grant update (value) on public.votes to authenticated;
