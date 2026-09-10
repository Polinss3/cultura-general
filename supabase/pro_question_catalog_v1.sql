-- CG PRO 2.2.0 — catálogo adicional de preguntas.
--
-- ⚠️ APLICAR A MANO COMO PARTE DEL ROLLOUT DE LA 2.2.0.
-- Vive fuera de supabase/migrations para que `supabase db push` no cambie el
-- backend que siguen usando las builds 2.1.x. Todo lo creado aquí es aditivo:
-- `questions` y `adventure_question_assignments` permanecen intactas.
-- Requiere que `20260906010000_premium_pro_v1.sql` ya haya creado
-- `public.is_premium(uuid)`; no ejecutar antes de esa base.
begin;

create table if not exists public.pro_questions (
  id uuid default uuid_generate_v4() primary key,
  category text not null check (category in (
    'historia','geografia','ciencia','arte','filosofia','deportes','biologia',
    'cine','musica','literatura','tecnologia','mitologia','astronomia'
  )),
  question text not null,
  options jsonb not null,
  answer_index int not null check (answer_index between 0 and 3),
  context text not null,
  difficulty text not null default 'medium' check (difficulty in ('easy','medium','hard')),
  question_en text not null,
  options_en jsonb not null,
  context_en text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists pro_questions_question_normalized_idx
  on public.pro_questions (lower(btrim(question)));
create unique index if not exists pro_questions_question_en_normalized_idx
  on public.pro_questions (lower(btrim(question_en)));

create table if not exists public.pro_adventure_question_assignments (
  version int not null,
  level int not null check (level between 201 and 400),
  slot int not null check (slot between 1 and 10),
  question_id uuid not null references public.pro_questions(id),
  primary key (version, level, slot),
  unique (version, question_id)
);

create table if not exists public.pro_question_reports (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.pro_questions(id) on delete cascade,
  reason text not null default 'incorrect'
    check (reason in ('incorrect','confusing','duplicate','other')),
  created_at timestamptz not null default now(),
  unique (user_id, question_id)
);

alter table public.pro_questions enable row level security;
alter table public.pro_adventure_question_assignments enable row level security;
alter table public.pro_question_reports enable row level security;

drop policy if exists "PRO users read PRO questions" on public.pro_questions;
create policy "PRO users read PRO questions"
  on public.pro_questions for select
  using (public.is_premium(auth.uid()));

drop policy if exists "PRO users read PRO adventure assignments"
  on public.pro_adventure_question_assignments;
create policy "PRO users read PRO adventure assignments"
  on public.pro_adventure_question_assignments for select
  using (public.is_premium(auth.uid()));

drop policy if exists "PRO users report PRO questions" on public.pro_question_reports;
create policy "PRO users report PRO questions"
  on public.pro_question_reports for insert
  with check (auth.uid() = user_id and public.is_premium(auth.uid()));

drop policy if exists "Users update own PRO question reports" on public.pro_question_reports;
create policy "Users update own PRO question reports"
  on public.pro_question_reports for update
  using (auth.uid() = user_id and public.is_premium(auth.uid()))
  with check (auth.uid() = user_id and public.is_premium(auth.uid()));

drop policy if exists "Users read own PRO question reports" on public.pro_question_reports;
create policy "Users read own PRO question reports"
  on public.pro_question_reports for select
  using (auth.uid() = user_id);

grant select on public.pro_questions to authenticated;
grant select on public.pro_adventure_question_assignments to authenticated;
grant select, insert, update on public.pro_question_reports to authenticated;
revoke insert, update, delete, truncate, references, trigger
  on public.pro_questions from anon, authenticated;
revoke insert, update, delete, truncate, references, trigger
  on public.pro_adventure_question_assignments from anon, authenticated;

comment on table public.pro_questions is
  'Las 2.000 preguntas adicionales de CG PRO. Separada de questions para no alterar clientes 2.1.x.';
comment on table public.pro_adventure_question_assignments is
  'Manifiesto inmutable de los niveles PRO 201-400.';

commit;
