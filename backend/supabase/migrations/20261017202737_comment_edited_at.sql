-- Track when a comment was last edited, so the UI can mark it as "edited" for everyone.

alter table public.comments add column edited_at timestamptz;

-- Set by the database, not the client, so an edit can't be hidden by sending edited_at = null.
-- Also pins the columns an edit must never change (which post/thread it belongs to, who wrote it, when).
create function public.handle_comment_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.post_id := old.post_id;
  new.parent_id := old.parent_id;
  new.author_id := old.author_id;
  new.created_at := old.created_at;
  if new.body is distinct from old.body then
    new.edited_at := now();
  else
    new.edited_at := old.edited_at;
  end if;
  return new;
end;
$$;

create trigger on_comment_update
  before update on public.comments
  for each row execute function public.handle_comment_update();
