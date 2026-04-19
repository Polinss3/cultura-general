-- ─────────────────────────────────────────────────────────────
-- Cultura General — Supabase schema (idempotente, re-ejecutable)
-- ─────────────────────────────────────────────────────────────

create extension if not exists "uuid-ossp";

-- ─── TABLAS ──────────────────────────────────────────────────

create table if not exists public.profiles (
  id              uuid references auth.users(id) on delete cascade primary key,
  username        text unique not null,
  avatar_url      text,
  streak          int default 0,
  best_streak     int default 0,
  total_correct   int default 0,
  total_answered  int default 0,
  speed_record    int default 0,
  created_at      timestamptz default now()
);

create table if not exists public.questions (
  id           uuid default uuid_generate_v4() primary key,
  category     text not null check (category in ('historia','geografia','ciencia','arte','filosofia')),
  question     text not null,
  options      jsonb not null,
  answer_index int  not null check (answer_index between 0 and 3),
  context      text,
  difficulty   text default 'medium' check (difficulty in ('easy','medium','hard')),
  active       boolean default true,
  created_at   timestamptz default now()
);

create table if not exists public.daily_questions (
  id          uuid default uuid_generate_v4() primary key,
  question_id uuid references public.questions(id) not null,
  date        date unique not null default current_date
);

create table if not exists public.user_answers (
  id             uuid default uuid_generate_v4() primary key,
  user_id        uuid references auth.users(id) on delete cascade not null,
  question_id    uuid references public.questions(id) not null,
  selected_index int  not null,
  is_correct     boolean not null,
  mode           text not null check (mode in ('daily','speed','learn')),
  answered_at    timestamptz default now()
);

create table if not exists public.daily_rankings (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  date        date not null default current_date,
  score       int  default 0,
  answered_at timestamptz,
  unique (user_id, date)
);

create table if not exists public.friendships (
  id         uuid default uuid_generate_v4() primary key,
  user_id    uuid references auth.users(id) on delete cascade not null,
  friend_id  uuid references auth.users(id) on delete cascade not null,
  status     text default 'pending' check (status in ('pending','accepted')),
  created_at timestamptz default now(),
  unique (user_id, friend_id)
);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────

alter table public.profiles        enable row level security;
alter table public.questions       enable row level security;
alter table public.daily_questions enable row level security;
alter table public.user_answers    enable row level security;
alter table public.daily_rankings  enable row level security;
alter table public.friendships     enable row level security;

-- Policies (drop first so re-runs no fallen)
do $$ begin

  -- profiles
  drop policy if exists "Profiles viewable by all"   on public.profiles;
  drop policy if exists "Users insert own profile"   on public.profiles;
  drop policy if exists "Users update own profile"   on public.profiles;
  -- questions
  drop policy if exists "Questions readable by authenticated" on public.questions;
  -- daily_questions
  drop policy if exists "Daily questions readable by authenticated" on public.daily_questions;
  -- user_answers
  drop policy if exists "Users read own answers"   on public.user_answers;
  drop policy if exists "Users insert own answers" on public.user_answers;
  -- daily_rankings
  drop policy if exists "Rankings readable by authenticated" on public.daily_rankings;
  drop policy if exists "Users upsert own ranking"           on public.daily_rankings;
  drop policy if exists "Users update own ranking"           on public.daily_rankings;
  -- friendships
  drop policy if exists "Users see own friendships"    on public.friendships;
  drop policy if exists "Users create friend requests" on public.friendships;
  drop policy if exists "Users accept friend requests" on public.friendships;

end $$;

create policy "Profiles viewable by all"   on public.profiles for select using (true);
create policy "Users insert own profile"   on public.profiles for insert with check (auth.uid() = id);
create policy "Users update own profile"   on public.profiles for update using (auth.uid() = id);

create policy "Questions readable by authenticated" on public.questions
  for select using (auth.role() = 'authenticated');

create policy "Daily questions readable by authenticated" on public.daily_questions
  for select using (auth.role() = 'authenticated');

create policy "Users read own answers"   on public.user_answers for select using (auth.uid() = user_id);
create policy "Users insert own answers" on public.user_answers for insert with check (auth.uid() = user_id);

create policy "Rankings readable by authenticated" on public.daily_rankings
  for select using (auth.role() = 'authenticated');
create policy "Users upsert own ranking" on public.daily_rankings
  for insert with check (auth.uid() = user_id);
create policy "Users update own ranking" on public.daily_rankings
  for update using (auth.uid() = user_id);

create policy "Users see own friendships"    on public.friendships
  for select using (auth.uid() = user_id or auth.uid() = friend_id);
create policy "Users create friend requests" on public.friendships
  for insert with check (auth.uid() = user_id);
create policy "Users accept friend requests" on public.friendships
  for update using (auth.uid() = friend_id);

-- ─── FUNCIONES ───────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.update_streak(p_user_id uuid)
returns void language plpgsql security definer as $streak_fn$
begin
  if (
    select max(dr.date)
      from public.daily_rankings dr
     where dr.user_id = p_user_id
       and dr.score > 0
       and dr.date < current_date
  ) = current_date - 1 then
    update public.profiles
       set streak      = streak + 1,
           best_streak = greatest(best_streak, streak + 1)
     where id = p_user_id;
  else
    update public.profiles
       set streak = 1
     where id = p_user_id;
  end if;
end;
$streak_fn$;
