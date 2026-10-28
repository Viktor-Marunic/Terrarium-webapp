-- Optional display name ("Alex Larsen") and location ("Aarhus, Denmark") for the profile card.
-- Both are optional: when empty the profile shows just @username, like before.
-- The existing "Users can update their own profile" policy already lets each user edit only their own row.

alter table public.profiles
  add column display_name text check (char_length(display_name) between 1 and 50),
  add column location text check (char_length(location) between 1 and 60);
