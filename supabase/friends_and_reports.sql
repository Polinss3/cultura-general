-- ─────────────────────────────────────────────────────────────
-- Cultura General — friends & question reports migration
-- Run this in the Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────

-- ─── Question reports ─────────────────────────────────────────

create table if not exists public.question_reports (
  id           uuid default uuid_generate_v4() primary key,
  user_id      uuid references auth.users(id) on delete cascade not null,
  question_id  uuid references public.questions(id) not null,
  reason       text default 'incorrect' check (reason in ('incorrect','confusing','duplicate','other')),
  created_at   timestamptz default now(),
  unique (user_id, question_id)
);

alter table public.question_reports enable row level security;

do $$ begin
  drop policy if exists "Users can report questions" on public.question_reports;
  drop policy if exists "Users can see own reports"  on public.question_reports;
end $$;

create policy "Users can report questions" on public.question_reports
  for insert with check (auth.uid() = user_id);

create policy "Users can see own reports" on public.question_reports
  for select using (auth.uid() = user_id);

-- ─── friendships: add insert policy for daily_rankings upsert ─
-- (friendships table already exists from schema.sql)
-- Make sure insert policy exists for friendships
do $$ begin
  drop policy if exists "Users create friend requests" on public.friendships;
end $$;

create policy "Users create friend requests" on public.friendships
  for insert with check (auth.uid() = user_id);

-- ─── Helper: weekly ranking function ─────────────────────────

create or replace function public.get_weekly_ranking()
returns table (
  user_id      uuid,
  username     text,
  streak       int,
  week_score   bigint
) language sql security definer as $$
  select
    dr.user_id,
    p.username,
    p.streak,
    sum(dr.score) as week_score
  from public.daily_rankings dr
  join public.profiles p on p.id = dr.user_id
  where dr.date >= date_trunc('week', current_date)::date
  group by dr.user_id, p.username, p.streak
  order by week_score desc
  limit 50;
$$;
