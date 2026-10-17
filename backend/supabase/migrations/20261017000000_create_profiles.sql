-- Profiles: one public profile per auth user (auth.users holds email/password, this holds what others see).

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  -- Lowercase-only so uniqueness is effectively case-insensitive ("Bob" and "bob" can't both exist).
  username text not null unique check (username ~ '^[a-z0-9_]{3,20}$'),
  avatar_url text,
  bio text check (char_length(bio) <= 500),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  to anon, authenticated
  using (true);

-- (select auth.uid()) is evaluated once per query instead of once per row.
create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- No insert/delete policies: rows are created by the trigger below and removed by the cascade from auth.users.

-- Creates the profile automatically on sign-up, so a user can never exist without one.
-- The client passes the chosen username in signUp({ options: { data: { username } } }).
-- security definer: the trigger runs as the auth service, which has no insert policy on profiles.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(
      lower(new.raw_user_meta_data ->> 'username'),
      -- Fallback for sign-ups without a username (e.g. created in the dashboard); user can rename later.
      'user_' || left(replace(new.id::text, '-', ''), 12)
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
