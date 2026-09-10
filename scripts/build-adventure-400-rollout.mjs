import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const syncSource = fs.readFileSync(
  path.join(root, 'supabase/migrations/20260829010000_adventure_sync_rewards_v2.sql'),
  'utf8',
);
const chapterSource = fs.readFileSync(
  path.join(root, 'supabase/migrations/20260829030000_adventure_chapter_finals_v2.sql'),
  'utf8',
);

function extractFunction(source, name) {
  const marker = `create or replace function public.${name}`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`No se encuentra ${name}`);
  const tagMatch = source.slice(start).match(/\bas (\$[a-z_]*\$)/);
  if (!tagMatch) throw new Error(`No se encuentra el delimitador de ${name}`);
  const tag = tagMatch[1];
  const bodyStart = start + tagMatch.index + tagMatch[0].length;
  const end = source.indexOf(`${tag};`, bodyStart);
  if (end < 0) throw new Error(`No se encuentra el final de ${name}`);
  return source.slice(start, end + tag.length + 1);
}

const expandLevels = sql => sql
  .replaceAll('1..200', '1..400')
  .replaceAll('least(200, v_prefix + 1)', 'least(400, v_prefix + 1)')
  .replaceAll('p_level > 200', 'p_level > 400')
  .replaceAll('octet_length(p_progress::text) > 200000', 'octet_length(p_progress::text) > 400000');

const expandChapters = sql => sql
  .replaceAll('p_chapter > 10', 'p_chapter > 20')
  .replaceAll('1..10', '1..20');

const functions = [
  expandLevels(extractFunction(syncSource, 'merge_adventure_progress')),
  expandLevels(extractFunction(syncSource, 'sync_adventure_progress')),
  expandLevels(extractFunction(syncSource, 'claim_adventure_reward')),
  expandLevels(extractFunction(syncSource, 'claim_pending_adventure_rewards')),
  expandChapters(extractFunction(chapterSource, 'claim_adventure_chapter_reward')),
  expandChapters(extractFunction(chapterSource, 'claim_pending_adventure_chapter_rewards')),
];

const sql = `-- Generado por scripts/build-adventure-400-rollout.mjs.
-- ⚠️ APLICAR A MANO DURANTE EL ROLLOUT DE LA 2.2.0, NUNCA CON db push.
--
-- Amplía límites y funciones de progreso de 200 a 400 niveles. Las builds
-- 2.1.x siguen operando dentro de 1-200 y no cambian de comportamiento.
begin;

alter table public.adventure_reward_claims
  drop constraint if exists adventure_reward_claims_level_check;
alter table public.adventure_reward_claims
  add constraint adventure_reward_claims_level_check check (level between 1 and 400);

alter table public.adventure_chapter_reward_claims
  drop constraint if exists adventure_chapter_reward_claims_chapter_check;
alter table public.adventure_chapter_reward_claims
  add constraint adventure_chapter_reward_claims_chapter_check check (chapter between 1 and 20);
alter table public.adventure_chapter_reward_claims
  drop constraint if exists adventure_chapter_reward_claims_level_check;
alter table public.adventure_chapter_reward_claims
  add constraint adventure_chapter_reward_claims_level_check
    check (level between 20 and 400 and level % 20 = 0);

create or replace function public.adventure_level_unlocked(
  p_user_id uuid,
  p_level int
)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select p_level between 1 and 40
      or public.is_premium(p_user_id)
      or (
        p_level between 41 and 200
        and coalesce(
          (select p.adventure_legacy from public.profiles p where p.id = p_user_id),
          false
        )
      );
$$;

${functions.join('\n\n')}

commit;
`;

const output = path.join(root, 'supabase/adventure_400_rollout.sql');
fs.writeFileSync(output, sql);
console.log(`Generado ${path.relative(root, output)}`);
