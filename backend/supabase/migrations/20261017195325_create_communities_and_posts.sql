-- Communities (like subreddits) and the posts inside them.

-- ---------------------------------------------------------------------------
-- communities
-- ---------------------------------------------------------------------------
create table public.communities (
  id uuid primary key default gen_random_uuid(),
  -- Used in the URL: /communities/<slug>
  slug text not null unique check (slug ~ '^[a-z0-9-]{2,30}$'),
  name text not null check (char_length(name) between 2 and 50),
  description text check (char_length(description) <= 300),
  created_at timestamptz not null default now()
);

alter table public.communities enable row level security;

create policy "Communities are viewable by everyone"
  on public.communities for select
  to anon, authenticated
  using (true);

-- No insert/update/delete policies: for now communities are managed only through migrations.

insert into public.communities (slug, name, description) values
  ('tropical', 'Tropical', 'Humid, lush builds with ferns, fittonias and other jungle plants.'),
  ('desert', 'Desert', 'Arid setups with succulents, cacti and sand.'),
  ('moss', 'Moss', 'Moss-focused builds, from tiny jars to full forest floors.'),
  ('paludarium', 'Paludarium', 'Half land, half water: builds with streams, pools and waterfalls.'),
  ('beginners', 'Beginners', 'New to terrariums? Ask anything here.');

-- ---------------------------------------------------------------------------
-- posts
-- ---------------------------------------------------------------------------
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  -- References profiles (not auth.users) so the API can embed the author's username in one query.
  -- Defaults to the caller, so the client doesn't have to send it; the insert policy still enforces it.
  author_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  type text not null check (type in ('showcase', 'question')),
  title text not null check (char_length(title) between 3 and 300),
  body text check (char_length(body) <= 10000),
  image_urls text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- Community feeds are listed newest-first.
create index posts_community_id_created_at_idx on public.posts (community_id, created_at desc);
create index posts_author_id_idx on public.posts (author_id);

alter table public.posts enable row level security;

create policy "Posts are viewable by everyone"
  on public.posts for select
  to anon, authenticated
  using (true);

create policy "Users can create posts as themselves"
  on public.posts for insert
  to authenticated
  with check ((select auth.uid()) = author_id);

create policy "Users can update their own posts"
  on public.posts for update
  to authenticated
  using ((select auth.uid()) = author_id)
  with check ((select auth.uid()) = author_id);

create policy "Users can delete their own posts"
  on public.posts for delete
  to authenticated
  using ((select auth.uid()) = author_id);
