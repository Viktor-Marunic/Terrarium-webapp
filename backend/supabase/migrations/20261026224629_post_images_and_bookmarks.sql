-- Photos on posts (post-images storage bucket; posts.image_urls already exists) and post bookmarks (saved posts).

-- ---------------------------------------------------------------------------
-- post-images storage bucket (same rules as listing-images)
-- ---------------------------------------------------------------------------
-- Public bucket: photos load through plain public URLs (no select policy needed).
-- Size and type limits are enforced by Storage itself, on top of the client-side check.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('post-images', 'post-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']);

-- File paths are {user_id}/{uuid}.{ext}, so the first folder name says who owns the file.
create policy "Users can upload post images to their own folder"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'post-images' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- Storage's remove() reads the object before deleting it, so owners need select on their own files too.
create policy "Users can read their own post images"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'post-images' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Users can delete their own post images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'post-images' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- ---------------------------------------------------------------------------
-- post_bookmarks: posts a user saved. Private: only the owner sees their own.
-- Separate from `bookmarks` (listings), which also notifies the seller; saving a post notifies nobody.
-- ---------------------------------------------------------------------------
create table public.post_bookmarks (
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  post_id uuid not null references public.posts (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

-- Used by the cascade when a post is deleted.
create index post_bookmarks_post_id_idx on public.post_bookmarks (post_id);

alter table public.post_bookmarks enable row level security;

create policy "Users can see their own post bookmarks"
  on public.post_bookmarks for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can bookmark posts as themselves"
  on public.post_bookmarks for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can remove their own post bookmarks"
  on public.post_bookmarks for delete
  to authenticated
  using ((select auth.uid()) = user_id);
