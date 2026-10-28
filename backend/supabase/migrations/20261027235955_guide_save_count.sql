-- "328 saves" on guide cards. Bookmarks are private (RLS), so the client can't count them;
-- the database keeps a save_count instead, the same way like_count works.
-- Not in the guides column grants, so users can't write it themselves.
alter table public.guides add column save_count integer not null default 0;
-- Guides saved before this migration.
update public.guides g
set save_count = (select count(*) from public.guide_bookmarks b where b.guide_id = g.id);
-- security definer: savers may not update other people's guides, but their bookmark must still move the count.
create function public.handle_guide_bookmark_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    update public.guides set save_count = save_count + 1 where id = new.guide_id;
  else
    update public.guides set save_count = save_count - 1 where id = old.guide_id;
  end if;
  return null;
end;
$$;
create trigger on_guide_bookmark_change
  after insert or delete on public.guide_bookmarks
  for each row execute function public.handle_guide_bookmark_change();
