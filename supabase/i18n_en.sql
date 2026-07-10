-- ─────────────────────────────────────────────────────────────
-- i18n EN: columnas en inglés para preguntas y tienda (v1.3.0)
-- Pegar en el SQL editor de Supabase. Idempotente.
--
-- IMPORTANTE (preguntas futuras): toda pregunta nueva debe insertarse ya
-- bilingüe (question_en + options_en[4] + context_en) o quedarse active=false
-- hasta traducirse. El cliente cae a español si la traducción EN está
-- incompleta (bloque atómico: pregunta EN + 4 opciones EN no vacías).
-- ─────────────────────────────────────────────────────────────

-- ── questions ───────────────────────────────────────────────
alter table public.questions
  add column if not exists question_en text,
  add column if not exists options_en  jsonb,
  add column if not exists context_en  text;

-- options_en, si está presente, debe ser un array de 4 (espejo de la regla del cliente).
alter table public.questions
  drop constraint if exists questions_options_en_len;
alter table public.questions
  add constraint questions_options_en_len
  check (options_en is null or jsonb_array_length(options_en) = 4);

-- ── shop_items ──────────────────────────────────────────────
alter table public.shop_items
  add column if not exists name_en        text,
  add column if not exists description_en text;

-- Traducciones EN de los 12 items (keyed por item_id, clave estable).
update public.shop_items set name_en = '50/50',        description_en = 'Removes two wrong answers'            where item_id = 'pw_5050';
update public.shop_items set name_en = 'Hint',         description_en = 'Shows a hint for the question'        where item_id = 'pw_hint';
update public.shop_items set name_en = 'Skip',         description_en = 'Skip the question with no penalty'    where item_id = 'pw_skip';
update public.shop_items set name_en = '+5 seconds',   description_en = 'Adds 5 seconds in Time Attack'        where item_id = 'pw_time';
update public.shop_items set name_en = 'Extra life',   description_en = 'Recover a life in Climb Mode'         where item_id = 'pw_revive';
update public.shop_items set name_en = 'Streak freeze', description_en = 'Protects your streak for a day off'  where item_id = 'streak_freeze';
update public.shop_items set name_en = 'Bronze frame', description_en = 'Bronze avatar frame'                 where item_id = 'frame_bronze';
update public.shop_items set name_en = 'Silver frame', description_en = 'Silver avatar frame'                 where item_id = 'frame_silver';
update public.shop_items set name_en = 'Gold frame',   description_en = 'Gold avatar frame'                   where item_id = 'frame_gold';
update public.shop_items set name_en = 'Neon name',    description_en = 'Neon name color'                     where item_id = 'name_neon';
update public.shop_items set name_en = 'Gold name',    description_en = 'Gold name color'                     where item_id = 'name_gold';
update public.shop_items set name_en = 'Emerald theme', description_en = 'Emerald accent color'               where item_id = 'theme_emerald';

-- ── Cobertura (debe dar missing_en = 0 en activas antes de publicar la ficha EN) ──
select category,
       count(*)                                                                        as total,
       count(question_en)                                                              as with_en,
       count(*) filter (where question_en is not null and jsonb_array_length(options_en) = 4) as complete_en
from public.questions
group by category
order by category;

select count(*) as missing_en
from public.questions
where active and (question_en is null or options_en is null);
