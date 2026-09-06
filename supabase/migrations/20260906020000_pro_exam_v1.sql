-- Modo Examen (CG PRO): histórico de notas y percentil.
-- Aditiva e idempotente. No toca ninguna función existente.
begin;

create table if not exists public.exam_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  correct int not null check (correct >= 0),
  total int not null check (total > 0),
  grade numeric(3,1) not null check (grade >= 0 and grade <= 10),
  duration_ms int not null check (duration_ms >= 0),
  created_at timestamptz not null default now()
);

create index if not exists exam_results_user_idx
  on public.exam_results (user_id, created_at desc);
-- Sirve al cálculo de percentil, que agrupa por usuario y ordena por nota.
create index if not exists exam_results_grade_idx
  on public.exam_results (user_id, grade desc);

alter table public.exam_results enable row level security;

drop policy if exists "Users read own exam results" on public.exam_results;
create policy "Users read own exam results"
  on public.exam_results for select
  using (auth.uid() = user_id);

grant select on public.exam_results to authenticated;
revoke insert, update, delete, truncate, references, trigger
  on public.exam_results from anon, authenticated;

-- Guarda una nota y devuelve el percentil frente al resto.
--
-- El percentil compara MEJORES notas por usuario, no intentos sueltos: si se
-- compararan intentos, quien repita mucho se hundiría en la tabla por sus
-- propios exámenes malos, que es justo al revés de lo que uno espera.
create or replace function public.save_exam_result(
  p_correct int,
  p_total int,
  p_duration_ms int
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $exam$
declare
  v_uid uuid := auth.uid();
  v_grade numeric(3,1);
  v_best numeric(3,1);
  v_attempts int;
  v_better int;
  v_players int;
  v_percentile int;
begin
  if v_uid is null then raise exception 'unauthorized'; end if;
  if not public.is_premium(v_uid) then raise exception 'premium required'; end if;
  if p_total is null or p_total <= 0 or p_total > 200 then
    raise exception 'invalid exam length';
  end if;
  if p_correct is null or p_correct < 0 or p_correct > p_total then
    raise exception 'invalid exam score';
  end if;
  if p_duration_ms is null or p_duration_ms < 0 then
    raise exception 'invalid exam duration';
  end if;

  v_grade := round((p_correct::numeric / p_total) * 10, 1);

  insert into public.exam_results (user_id, correct, total, grade, duration_ms)
  values (v_uid, p_correct, p_total, v_grade, greatest(0, p_duration_ms));

  select max(grade), count(*) into v_best, v_attempts
  from public.exam_results where user_id = v_uid;

  with bests as (
    select user_id, max(grade) as best from public.exam_results group by user_id
  )
  select
    count(*) filter (where best < v_best),
    count(*)
  into v_better, v_players
  from bests;

  -- Con muy pocos jugadores el percentil no dice nada: se devuelve null y la
  -- pantalla se calla en vez de anunciar un "mejor que el 100%" vacío.
  v_percentile := case
    when v_players >= 20 then round((v_better::numeric / v_players) * 100)::int
    else null
  end;

  return jsonb_build_object(
    'grade', v_grade,
    'best', v_best,
    'attempts', v_attempts,
    'percentile', v_percentile
  );
end;
$exam$;

grant execute on function public.save_exam_result(int, int, int) to authenticated;

commit;
