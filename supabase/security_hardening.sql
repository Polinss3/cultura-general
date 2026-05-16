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

-- ─── Extra: CHECK de longitud y formato de username ──────────
-- Evita usernames vacíos, con espacios o demasiado largos en
-- inserciones/updates futuras. Usamos NOT VALID para no romper
-- filas existentes (p.ej. usernames generados por el trigger
-- handle_new_user a partir del email pueden tener caracteres
-- fuera del patrón). La validación se aplica a partir de ahora
-- en cualquier INSERT/UPDATE.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_username_format_check'
  ) then
    alter table public.profiles
      add constraint profiles_username_format_check
      check (
        char_length(username) between 3 and 20
        and username ~ '^[A-Za-z0-9_.-]+$'
      ) not valid;
  end if;
end $$;

-- Opcional: ver qué perfiles antiguos NO cumplen la regla.
-- Ejecuta esta query para listarlos y limpiarlos cuando quieras:
--
--   select id, username
--     from public.profiles
--    where not (
--      char_length(username) between 3 and 20
--      and username ~ '^[A-Za-z0-9_.-]+$'
--    );
--
-- Una vez limpios, podrás "promocionar" la constraint a estricta:
--   alter table public.profiles validate constraint profiles_username_format_check;

-- ─── Índice útil para checkDailyAnswered ─────────────────────
create index if not exists daily_rankings_user_date_idx
  on public.daily_rankings (user_id, date);
