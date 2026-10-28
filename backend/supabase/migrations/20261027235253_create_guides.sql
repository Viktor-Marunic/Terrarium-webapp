-- Guides: how-to articles any logged-in user can write (with an optional cover photo), plus likes (the heart)
-- and private bookmarks. No comments on guides.

-- ---------------------------------------------------------------------------
-- guides
-- ---------------------------------------------------------------------------
create table public.guides (
  id uuid primary key default gen_random_uuid(),
  -- References profiles so the API can embed the author's username/avatar; defaults to the caller (insert policy enforces it).
  author_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  category text not null check (category in ('getting_started', 'build', 'plant_care', 'troubleshooting', 'show_tell')),
  title text not null check (char_length(title) between 3 and 120),
  body text not null check (char_length(body) between 20 and 20000),
  -- Public URL in the guide-images bucket; null = placeholder.
  image_url text,
  -- Kept in sync by the guide_likes trigger below, so the list never counts likes in the client.
  like_count integer not null default 0,
  created_at timestamptz not null default now()
);
-- The guides page lists newest first.
create index guides_created_at_idx on public.guides (created_at desc);
create index guides_author_id_idx on public.guides (author_id);
alter table public.guides enable row level security;
-- Logged-in users only, like events: the whole app sits behind login.
create policy "Guides are viewable by logged-in users"
  on public.guides for select
  to authenticated
  using (true);
create policy "Users can write guides as themselves"
  on public.guides for insert
  to authenticated
  with check ((select auth.uid()) = author_id);
create policy "Authors can update their own guides"
  on public.guides for update
  to authenticated
  using ((select auth.uid()) = author_id)
  with check ((select auth.uid()) = author_id);
create policy "Authors can delete their own guides"
  on public.guides for delete
  to authenticated
  using ((select auth.uid()) = author_id);
-- Column privileges (same approach as events): no faking like_count, rewriting created_at or handing a guide to someone else.
revoke insert, update on public.guides from anon, authenticated;
grant insert (author_id, category, title, body, image_url) on public.guides to authenticated;
grant update (category, title, body, image_url) on public.guides to authenticated;
-- ---------------------------------------------------------------------------
-- guide_likes: the heart. Private like votes: embedding guide_likes in a guides query
-- returns only the current user's own like, which the UI uses to fill the heart.
-- ---------------------------------------------------------------------------
create table public.guide_likes (
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  guide_id uuid not null references public.guides (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, guide_id)
);
-- Used by the cascade when a guide is deleted.
create index guide_likes_guide_id_idx on public.guide_likes (guide_id);
alter table public.guide_likes enable row level security;
create policy "Users can see their own guide likes"
  on public.guide_likes for select
  to authenticated
  using ((select auth.uid()) = user_id);
create policy "Users can like guides as themselves"
  on public.guide_likes for insert
  to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Users can remove their own guide likes"
  on public.guide_likes for delete
  to authenticated
  using ((select auth.uid()) = user_id);
-- A like is there or it isn't.
revoke update on public.guide_likes from anon, authenticated;
-- security definer: likers may not update other people's guides, but their like must still move the count.
create function public.handle_guide_like_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    update public.guides set like_count = like_count + 1 where id = new.guide_id;
  else
    update public.guides set like_count = like_count - 1 where id = old.guide_id;
  end if;
  return null;
end;
$$;
create trigger on_guide_like_change
  after insert or delete on public.guide_likes
  for each row execute function public.handle_guide_like_change();
-- ---------------------------------------------------------------------------
-- guide_bookmarks: guides a user saved. Private: only the owner sees their own.
-- ---------------------------------------------------------------------------
create table public.guide_bookmarks (
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  guide_id uuid not null references public.guides (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, guide_id)
);
create index guide_bookmarks_guide_id_idx on public.guide_bookmarks (guide_id);
alter table public.guide_bookmarks enable row level security;
create policy "Users can see their own guide bookmarks"
  on public.guide_bookmarks for select
  to authenticated
  using ((select auth.uid()) = user_id);
create policy "Users can bookmark guides as themselves"
  on public.guide_bookmarks for insert
  to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Users can remove their own guide bookmarks"
  on public.guide_bookmarks for delete
  to authenticated
  using ((select auth.uid()) = user_id);
revoke update on public.guide_bookmarks from anon, authenticated;
-- ---------------------------------------------------------------------------
-- guide-images storage bucket (same rules as event-images)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('guide-images', 'guide-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']);
-- File paths are {user_id}/{uuid}.{ext}, so the first folder name says who owns the file.
create policy "Users can upload guide images to their own folder"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'guide-images' and (storage.foldername(name))[1] = (select auth.uid())::text);
-- Storage's remove() reads the object before deleting it, so owners need select on their own files too.
create policy "Users can read their own guide images"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'guide-images' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Users can delete their own guide images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'guide-images' and (storage.foldername(name))[1] = (select auth.uid())::text);
