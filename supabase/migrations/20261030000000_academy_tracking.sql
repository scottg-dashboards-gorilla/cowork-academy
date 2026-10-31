-- Cowork Academy progress tracking (project: cowork-academy-tracking, ref dptmmtqiedggqzmfsvdh).
-- Captured from the live database on 2026-10-30 so the backend can be rebuilt from this repo.

create table if not exists public.academy_users (
  email       text primary key,
  name        text not null default '',
  progress    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  last_active timestamptz not null default now()
);

-- RLS on with no policies: browsers can't read or write the table directly.
-- Learners write only through academy_upsert; the admin report reads with the service role.
alter table public.academy_users enable row level security;

create or replace function public.academy_upsert(p_email text, p_name text, p_progress jsonb)
returns void
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  insert into public.academy_users (email, name, progress, last_active)
  values (lower(trim(p_email)), coalesce(p_name,''), coalesce(p_progress,'{}'::jsonb), now())
  on conflict (email) do update
    set name = excluded.name,
        progress = excluded.progress,
        last_active = now();
end;
$$;

-- Intentionally callable with the public key: this is the course's only write path.
grant execute on function public.academy_upsert(text, text, jsonb) to anon, authenticated;
