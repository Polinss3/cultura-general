-- ─────────────────────────────────────────────────────────────
-- Cultura General — Supabase schema
-- Run this in the Supabase SQL editor (project > SQL Editor > New query)
-- ─────────────────────────────────────────────────────────────

create extension if not exists "uuid-ossp";

-- ─── PROFILES ────────────────────────────────────────────────
-- Extends auth.users with app-specific data
create table public.profiles (
  id           uuid references auth.users(id) on delete cascade primary key,
  username     text unique not null,
  avatar_url   text,
  streak       int  default 0,
  best_streak  int  default 0,
  total_correct   int default 0,
  total_answered  int default 0,
  speed_record    int default 0,   -- best score in 30s mode
  created_at   timestamptz default now()
);

-- ─── QUESTIONS ───────────────────────────────────────────────
create table public.questions (
  id           uuid default uuid_generate_v4() primary key,
  category     text not null check (category in ('historia','geografia','ciencia','arte','filosofia')),
  question     text not null,
  options      jsonb not null,      -- ["opt A","opt B","opt C","opt D"]
  answer_index int  not null check (answer_index between 0 and 3),
  context      text,                -- shown when user answers wrong in Learn mode
  difficulty   text default 'medium' check (difficulty in ('easy','medium','hard')),
  active       boolean default true,
  created_at   timestamptz default now()
);

-- ─── DAILY QUESTIONS ─────────────────────────────────────────
-- One question per calendar day; set via cron or manually
create table public.daily_questions (
  id          uuid default uuid_generate_v4() primary key,
  question_id uuid references public.questions(id) not null,
  date        date unique not null default current_date
);

-- ─── USER ANSWERS ────────────────────────────────────────────
create table public.user_answers (
  id             uuid default uuid_generate_v4() primary key,
  user_id        uuid references auth.users(id) on delete cascade not null,
  question_id    uuid references public.questions(id) not null,
  selected_index int  not null,
  is_correct     boolean not null,
  mode           text not null check (mode in ('daily','speed','learn')),
  answered_at    timestamptz default now()
);

-- ─── DAILY RANKINGS ──────────────────────────────────────────
-- One row per user per day; score = 100 if correct, 0 if wrong
-- answered_at used for tie-breaking (faster = better)
create table public.daily_rankings (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  date        date not null default current_date,
  score       int  default 0,
  answered_at timestamptz,
  unique (user_id, date)
);

-- ─── FRIENDSHIPS ─────────────────────────────────────────────
create table public.friendships (
  id        uuid default uuid_generate_v4() primary key,
  user_id   uuid references auth.users(id) on delete cascade not null,
  friend_id uuid references auth.users(id) on delete cascade not null,
  status    text default 'pending' check (status in ('pending','accepted')),
  created_at timestamptz default now(),
  unique (user_id, friend_id)
);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────
alter table public.profiles       enable row level security;
alter table public.questions      enable row level security;
alter table public.daily_questions enable row level security;
alter table public.user_answers   enable row level security;
alter table public.daily_rankings enable row level security;
alter table public.friendships    enable row level security;

-- profiles
create policy "Profiles viewable by all"     on public.profiles for select using (true);
create policy "Users insert own profile"     on public.profiles for insert with check (auth.uid() = id);
create policy "Users update own profile"     on public.profiles for update using (auth.uid() = id);

-- questions (read-only for users)
create policy "Questions readable by authenticated" on public.questions
  for select using (auth.role() = 'authenticated');

-- daily_questions
create policy "Daily questions readable by authenticated" on public.daily_questions
  for select using (auth.role() = 'authenticated');

-- user_answers
create policy "Users read own answers"   on public.user_answers for select using (auth.uid() = user_id);
create policy "Users insert own answers" on public.user_answers for insert with check (auth.uid() = user_id);

-- daily_rankings
create policy "Rankings readable by authenticated" on public.daily_rankings
  for select using (auth.role() = 'authenticated');
create policy "Users upsert own ranking" on public.daily_rankings
  for insert with check (auth.uid() = user_id);
create policy "Users update own ranking" on public.daily_rankings
  for update using (auth.uid() = user_id);

-- friendships
create policy "Users see own friendships" on public.friendships
  for select using (auth.uid() = user_id or auth.uid() = friend_id);
create policy "Users create friend requests" on public.friendships
  for insert with check (auth.uid() = user_id);
create policy "Users accept friend requests" on public.friendships
  for update using (auth.uid() = friend_id);

-- ─── TRIGGER: auto-create profile on signup ──────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── FUNCTION: update streak on daily answer ─────────────────
create or replace function public.update_streak(p_user_id uuid)
returns void language plpgsql security definer as $$
declare
  last_date date;
  cur_streak int;
begin
  select max(date) into last_date
  from public.daily_rankings
  where user_id = p_user_id and score > 0 and date < current_date;

  select streak into cur_streak from public.profiles where id = p_user_id;

  if last_date = current_date - 1 then
    update public.profiles
    set streak      = streak + 1,
        best_streak = greatest(best_streak, streak + 1)
    where id = p_user_id;
  elsif last_date < current_date - 1 or last_date is null then
    update public.profiles set streak = 1 where id = p_user_id;
  end if;
end;
$$;
