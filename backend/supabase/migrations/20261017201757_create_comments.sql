-- Threaded comments on posts. A comment with parent_id = null is top-level; otherwise it's a reply.

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  -- References profiles so the API can embed the author's username; defaults to the caller (insert policy enforces it).
  author_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  parent_id uuid,
  body text not null check (char_length(body) between 1 and 5000),
  created_at timestamptz not null default now(),
  -- Target for the composite foreign key below.
  unique (id, post_id),
  -- A reply must belong to the same post as its parent. Skipped automatically when parent_id is null.
  foreign key (parent_id, post_id) references public.comments (id, post_id) on delete cascade
);

-- A post's comments are loaded together, oldest first.
create index comments_post_id_created_at_idx on public.comments (post_id, created_at);
create index comments_parent_id_idx on public.comments (parent_id);
create index comments_author_id_idx on public.comments (author_id);

alter table public.comments enable row level security;

create policy "Comments are viewable by everyone"
  on public.comments for select
  to anon, authenticated
  using (true);

create policy "Users can comment as themselves"
  on public.comments for insert
  to authenticated
  with check ((select auth.uid()) = author_id);

create policy "Users can update their own comments"
  on public.comments for update
  to authenticated
  using ((select auth.uid()) = author_id)
  with check ((select auth.uid()) = author_id);

create policy "Users can delete their own comments"
  on public.comments for delete
  to authenticated
  using ((select auth.uid()) = author_id);
