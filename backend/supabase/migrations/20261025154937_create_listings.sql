-- Marketplace listings (terrarium supplies for sale) and the storage bucket for their photos.
-- No payments: buyers reach the seller through contact_info and arrange the rest themselves.

-- ---------------------------------------------------------------------------
-- listings
-- ---------------------------------------------------------------------------
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  -- References profiles (not auth.users) so the API can embed the seller's username in one query.
  -- Defaults to the caller, so the client doesn't have to send it; the insert policy still enforces it.
  seller_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 3 and 100),
  description text check (char_length(description) <= 2000),
  -- Whole Danish kroner; nobody haggles over øre for moss.
  price integer not null check (price between 0 and 100000),
  condition text not null check (condition in ('new', 'like_new', 'used')),
  -- Fixed list for now (mirrors listingCategories in the frontend); a categories table can replace it if it grows.
  category text not null check (category in ('starter-kits', 'plants-moss', 'decorations', 'equipment')),
  -- Free text written by the seller (email, phone…). auth.users emails are not readable from the frontend.
  contact_info text not null check (char_length(contact_info) between 3 and 200),
  -- Public URLs of the photos in the listing-images bucket; the first one is the cover photo.
  image_urls text[] not null default '{}' check (cardinality(image_urls) <= 5),
  status text not null default 'active' check (status in ('active', 'sold')),
  created_at timestamptz not null default now()
);

-- The shop grid lists active listings newest-first, optionally within one category.
create index listings_status_category_created_at_idx on public.listings (status, category, created_at desc);
create index listings_seller_id_idx on public.listings (seller_id);

alter table public.listings enable row level security;

-- Logged-in users only (not anon, unlike posts): rows include the seller's contact_info,
-- and RLS can't hide a single column, so the whole table stays out of reach of the public anon key.
create policy "Listings are viewable by logged-in users"
  on public.listings for select
  to authenticated
  using (true);

create policy "Users can create listings as themselves"
  on public.listings for insert
  to authenticated
  with check ((select auth.uid()) = seller_id);

create policy "Users can update their own listings"
  on public.listings for update
  to authenticated
  using ((select auth.uid()) = seller_id)
  with check ((select auth.uid()) = seller_id);

create policy "Users can delete their own listings"
  on public.listings for delete
  to authenticated
  using ((select auth.uid()) = seller_id);

-- ---------------------------------------------------------------------------
-- listing-images storage bucket
-- ---------------------------------------------------------------------------
-- Public bucket: photos load through plain public URLs (no select policy needed).
-- Size and type limits are enforced by Storage itself, on top of the client-side check.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('listing-images', 'listing-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']);

-- File paths are {user_id}/{uuid}.{ext}, so the first folder name says who owns the file.
create policy "Users can upload listing images to their own folder"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'listing-images' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- Storage's remove() reads the object before deleting it, so owners need select on their own files too.
create policy "Users can read their own listing images"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'listing-images' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Users can delete their own listing images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'listing-images' and (storage.foldername(name))[1] = (select auth.uid())::text);
