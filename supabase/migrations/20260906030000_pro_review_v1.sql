-- Repaso inteligente (CG PRO): cola de repetición espaciada.
-- Aditiva e idempotente. Los intervalos son espejo de lib/review.ts.
begin;

create table if not exists public.review_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  box int not null default 1 check (box between 1 and 5),
  due_at timestamptz not null default now(),
  mastered_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, question_id)
);

-- La consulta caliente es "lo que me toca hoy", así que el índice cubre
-- exactamente eso y deja fuera lo ya aprendido.
create index if not exists review_items_due_idx
  on public.review_items (user_id, due_at)
  where mastered_at is null;

alter table public.review_items enable row level security;

drop policy if exists "Users read own review items" on public.review_items;
create policy "Users read own review items"
  on public.review_items for select
  using (auth.uid() = user_id);

grant select on public.review_items to authenticated;
revoke insert, update, delete, truncate, references, trigger
  on public.review_items from anon, authenticated;

-- Días hasta el siguiente repaso por caja. Mismo reparto que
-- REVIEW_INTERVALS_DAYS en el cliente; si uno cambia, cambian los dos.
create or replace function public.review_interval_days(p_box int)
returns int
language sql
immutable
as $$
  select case greatest(1, least(5, coalesce(p_box, 1)))
    when 1 then 1
    when 2 then 3
    when 3 then 7
    when 4 then 21
    else 60
  end;
$$;

-- Siembra la cola con lo que ya se ha fallado alguna vez y todavía no está en
-- ella. Es lo que hace que el modo tenga contenido desde el primer minuto en
-- vez de estar vacío hasta que falles algo nuevo.
create or replace function public.seed_review_items()
returns int
language plpgsql
security definer
set search_path = public, pg_temp
as $seed$
declare
  v_uid uuid := auth.uid();
  v_inserted int;
begin
  if v_uid is null then raise exception 'unauthorized'; end if;
  if not public.is_premium(v_uid) then raise exception 'premium required'; end if;

  insert into public.review_items (user_id, question_id, box, due_at)
  select v_uid, a.question_id, 1, now()
  from (
    select distinct question_id
    from public.user_answers
    where user_id = v_uid and is_correct = false
  ) a
  on conflict (user_id, question_id) do nothing;

  get diagnostics v_inserted = row_count;
  return v_inserted;
end;
$seed$;

-- Cola de hoy: lo más atrasado primero y, a igualdad, la caja más baja.
create or replace function public.fetch_review_queue(p_limit int default 15)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $queue$
declare
  v_uid uuid := auth.uid();
  v_items jsonb;
  v_due int;
begin
  if v_uid is null then raise exception 'unauthorized'; end if;
  if not public.is_premium(v_uid) then raise exception 'premium required'; end if;

  select count(*) into v_due
  from public.review_items
  where user_id = v_uid and mastered_at is null and due_at <= now();

  select coalesce(jsonb_agg(item order by item->>'dueAt', (item->>'box')::int), '[]'::jsonb)
  into v_items
  from (
    select jsonb_build_object(
      'questionId', question_id,
      'box', box,
      'dueAt', due_at
    ) as item
    from public.review_items
    where user_id = v_uid and mastered_at is null and due_at <= now()
    order by due_at, box
    limit greatest(1, least(50, coalesce(p_limit, 15)))
  ) picked;

  return jsonb_build_object('items', v_items, 'due', v_due);
end;
$queue$;

-- Registra una respuesta de repaso y reprograma la pregunta.
create or replace function public.record_review_answer(
  p_question_id uuid,
  p_correct boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $record$
declare
  v_uid uuid := auth.uid();
  v_box int;
  v_next_box int;
  v_mastered boolean := false;
begin
  if v_uid is null then raise exception 'unauthorized'; end if;
  if not public.is_premium(v_uid) then raise exception 'premium required'; end if;
  if p_question_id is null or p_correct is null then
    raise exception 'invalid review answer';
  end if;

  select box into v_box
  from public.review_items
  where user_id = v_uid and question_id = p_question_id
  for update;

  -- Fallar una pregunta que no estaba en la cola la mete: es exactamente el
  -- caso de uso, venga de donde venga el fallo.
  if v_box is null then
    if p_correct then
      return jsonb_build_object('box', null, 'mastered', false, 'tracked', false);
    end if;
    v_box := 1;
    insert into public.review_items (user_id, question_id, box, due_at)
    values (v_uid, p_question_id, 1, now() + make_interval(days => public.review_interval_days(1)))
    on conflict (user_id, question_id) do nothing;
    return jsonb_build_object('box', 1, 'mastered', false, 'tracked', true);
  end if;

  if p_correct then
    v_next_box := least(5, v_box + 1);
    v_mastered := v_box >= 5;
  else
    v_next_box := 1;
  end if;

  update public.review_items
  set box = v_next_box,
      due_at = now() + make_interval(days => public.review_interval_days(v_next_box)),
      mastered_at = case when v_mastered then now() else null end,
      updated_at = now()
  where user_id = v_uid and question_id = p_question_id;

  return jsonb_build_object('box', v_next_box, 'mastered', v_mastered, 'tracked', true);
end;
$record$;

grant execute on function public.seed_review_items() to authenticated;
grant execute on function public.fetch_review_queue(int) to authenticated;
grant execute on function public.record_review_answer(uuid, boolean) to authenticated;

commit;
