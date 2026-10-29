-- Structured guides (mockup): a difficulty level, a "What you'll need" list and numbered steps.
-- The existing body column stays as the guide's intro, so guides written before this keep their text.

alter table public.guides
  add column level text not null default 'beginner' check (level in ('beginner', 'intermediate', 'advanced')),
  -- One item per entry, e.g. 'Glass jar with a lid (about 2 litres)'.
  add column materials text[] not null default '{}' check (cardinality(materials) <= 30),
  -- [{ "title": "Add drainage", "text": "Spread 2–3 cm of lava rock…" }, …] in order.
  add column steps jsonb not null default '[]' check (jsonb_typeof(steps) = 'array' and jsonb_array_length(steps) <= 30);

-- The guides table uses column grants (see create_guides), so authors may only write the new columns explicitly.
grant insert (level, materials, steps) on public.guides to authenticated;
grant update (level, materials, steps) on public.guides to authenticated;
