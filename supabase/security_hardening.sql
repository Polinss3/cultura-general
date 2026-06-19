-- ─────────────────────────────────────────────────────────────
-- Cultura General — Security hardening
-- Idempotente, re-ejecutable. Aplicar en Supabase SQL Editor.
-- ─────────────────────────────────────────────────────────────

-- ─── C1: update_streak debe validar auth.uid() ───────────────
-- Antes: cualquiera con anon key podía manipular la racha de
-- cualquier usuario pasando p_user_id arbitrario.
create or replace function public.update_streak(p_user_id uuid)
returns void language plpgsql security definer as $streak_fn$
begin
  if auth.uid() is null or auth.uid() <> p_user_id then
    raise exception 'unauthorized';
  end if;

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

-- ─── C2: DELETE policy en friendships ────────────────────────
-- Sin esta policy, removeFriend() fallaba silenciosamente.
do $$ begin
  drop policy if exists "Users delete own friendships" on public.friendships;
end $$;

create policy "Users delete own friendships" on public.friendships
  for delete using (auth.uid() = user_id or auth.uid() = friend_id);

-- ─── C3: RPC atómica para incrementar stats del perfil ───────
-- Evita race conditions entre partidas concurrentes (daily + speed).
create or replace function public.increment_profile_stats(
  p_answered int,
  p_correct int,
  p_speed_record int default null
)
returns void language plpgsql security definer as $stats_fn$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'unauthorized';
  end if;

  if p_answered < 0 or p_correct < 0 or p_correct > p_answered then
    raise exception 'invalid stats payload';
  end if;

  update public.profiles
     set total_answered = coalesce(total_answered, 0) + p_answered,
         total_correct  = coalesce(total_correct, 0) + p_correct,
         speed_record   = case
           when p_speed_record is not null and p_speed_record > coalesce(speed_record, 0)
             then p_speed_record
           else speed_record
         end
   where id = v_uid;
end;
$stats_fn$;

-- ─── C4: CHECK constraint para selected_index ────────────────
-- Antes: un cliente malicioso podía insertar -1, 999, etc.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'user_answers_selected_index_check'
  ) then
    alter table public.user_answers
      add constraint user_answers_selected_index_check
      check (selected_index between 0 and 3);
  end if;
end $$;

create or replace function public.normalize_username(p_username text)
returns text language sql immutable as $$
  select nullif(regexp_replace(btrim(coalesce(p_username, '')), '\s+', ' ', 'g'), '');
$$;

create or replace function public.is_valid_username(p_username text)
returns boolean language sql immutable as $$
  select p_username is not null
    and char_length(p_username) between 3 and 20
    and p_username = btrim(p_username)
    and p_username !~ '\s{2,}';
$$;

create or replace function public.generate_profile_username(
  p_user_id uuid,
  p_email text,
  p_meta jsonb default '{}'::jsonb
)
returns text language plpgsql security definer as $$
declare
  v_candidate text;
  v_candidates text[] := array[
    public.normalize_username(p_meta->>'username'),
    public.normalize_username(p_meta->>'full_name'),
    public.normalize_username(p_meta->>'name'),
    public.normalize_username(split_part(coalesce(p_email, ''), '@', 1))
  ];
  v_suffix text := upper(substr(replace(coalesce(p_user_id::text, uuid_generate_v4()::text), '-', ''), 1, 6));
  v_attempt int := 0;
begin
  if coalesce((p_meta->>'manual_username')::boolean, false) then
    return public.normalize_username(p_meta->>'username');
  end if;

  foreach v_candidate in array v_candidates loop
    if public.is_valid_username(v_candidate)
      and not exists (
        select 1
          from public.profiles
         where username = v_candidate
           and id <> p_user_id
      ) then
      return v_candidate;
    end if;
  end loop;

  loop
    v_attempt := v_attempt + 1;
    v_candidate := left(
      'Jugador ' || v_suffix || case when v_attempt = 1 then '' else v_attempt::text end,
      20
    );

    if not exists (
      select 1
        from public.profiles
       where username = v_candidate
         and id <> p_user_id
    ) then
      return v_candidate;
    end if;

    if v_attempt > 50 then
      return left('Jugador ' || substr(upper(replace(uuid_generate_v4()::text, '-', '')), 1, 10), 20);
    end if;
  end loop;
end;
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    public.generate_profile_username(new.id, new.email, coalesce(new.raw_user_meta_data, '{}'::jsonb))
  );
  return new;
end;
$$;

-- ─── Extra: CHECK de longitud y formato de username ──────────
-- Permitimos espacios internos en el nombre público, pero no al
-- principio/final ni repetidos. Usamos NOT VALID para no romper
-- filas existentes; aplica a partir de ahora en INSERT/UPDATE.
do $$
begin
  if exists (
    select 1 from pg_constraint
    where conname = 'profiles_username_format_check'
  ) then
    alter table public.profiles
      drop constraint profiles_username_format_check;
  end if;

  alter table public.profiles
    add constraint profiles_username_format_check
    check (public.is_valid_username(username))
    not valid;
end $$;

-- Opcional: ver qué perfiles antiguos NO cumplen la regla.
-- Ejecuta esta query para listarlos y limpiarlos cuando quieras:
--
--   select id, username
--     from public.profiles
--    where not (
--      public.is_valid_username(username)
--    );
--
-- Una vez limpios, podrás "promocionar" la constraint a estricta:
--   alter table public.profiles validate constraint profiles_username_format_check;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Índice útil para checkDailyAnswered ─────────────────────
create index if not exists daily_rankings_user_date_idx
  on public.daily_rankings (user_id, date);
