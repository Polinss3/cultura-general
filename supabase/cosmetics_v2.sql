-- ═══════════════════════════════════════════════════════════════════════════
-- Cosméticos v2  —  visibles para todos + nuevos tipos + precios
-- ═══════════════════════════════════════════════════════════════════════════
-- Aditivo, retro-compatible y re-ejecutable. Cambios:
--  · profiles.cosmetics (jsonb): espejo de lo equipado por SLOT, para pintar los
--    cosméticos de CUALQUIER usuario en los rankings (no solo el propio).
--  · shop_items.slot (text): a qué "ranura" pertenece cada cosmético
--    (frame / name_color / name_style / name_icon). Uno equipado por slot.
--  · equip_item() reescrito: exclusivo por slot + actualiza profiles.cosmetics.
--  · Nuevos cosméticos: iconos de nombre (emoji delante) y estilos de nombre.
--  · Subida de precios de power-ups y marcos/nombres.
--  · Backfill de profiles.cosmetics con lo que ya estuviera equipado.
--
-- IMPORTANTE: tras aplicar esto, RE-APLICA también supabase/leagues.sql
-- (get_league ahora devuelve las cosméticas para pintarlas en la liga).

-- ─── 1. Columnas nuevas ─────────────────────────────────────
alter table public.profiles    add column if not exists cosmetics jsonb not null default '{}'::jsonb;
alter table public.shop_items  add column if not exists slot text;
alter table public.shop_items  add column if not exists name_en text;
alter table public.shop_items  add column if not exists description_en text;

-- ─── 2. Slots de los cosméticos existentes ──────────────────
update public.shop_items set slot = 'frame'      where item_id in ('frame_bronze', 'frame_silver', 'frame_gold');
update public.shop_items set slot = 'name_color' where item_id in ('name_neon', 'name_gold');

-- ─── 3. Precios (subida) ────────────────────────────────────
update public.shop_items set price = 60   where item_id = 'pw_hint';
update public.shop_items set price = 55   where item_id = 'pw_skip';
update public.shop_items set price = 70   where item_id = 'pw_time';
update public.shop_items set price = 90   where item_id = 'pw_5050';
update public.shop_items set price = 140  where item_id = 'pw_revive';
update public.shop_items set price = 300  where item_id = 'streak_freeze';
update public.shop_items set price = 200  where item_id = 'frame_bronze';
update public.shop_items set price = 500  where item_id = 'frame_silver';
update public.shop_items set price = 1200 where item_id = 'frame_gold';
update public.shop_items set price = 350  where item_id = 'name_neon';
update public.shop_items set price = 700  where item_id = 'name_gold';

-- ─── 4. Nuevos cosméticos: iconos de nombre y estilos ───────
insert into public.shop_items
  (item_id, name, description, name_en, description_en, price, type, icon, sort, active, slot) values
  ('icon_fire',    'Icono llama',      'Añade 🔥 antes de tu nombre',   'Flame icon',      'Adds 🔥 before your name',    300, 'cosmetic', '🔥', 130, true, 'name_icon'),
  ('icon_star',    'Icono estrella',   'Añade ⭐ antes de tu nombre',   'Star icon',       'Adds ⭐ before your name',    300, 'cosmetic', '⭐', 131, true, 'name_icon'),
  ('icon_crown',   'Icono corona',     'Añade 👑 antes de tu nombre',   'Crown icon',      'Adds 👑 before your name',    450, 'cosmetic', '👑', 132, true, 'name_icon'),
  ('icon_rocket',  'Icono cohete',     'Añade 🚀 antes de tu nombre',   'Rocket icon',     'Adds 🚀 before your name',    300, 'cosmetic', '🚀', 133, true, 'name_icon'),
  ('style_italic', 'Nombre cursiva',   'Tu nombre en cursiva',          'Italic name',     'Your name in italics',        350, 'cosmetic', '𝘐',  140, true, 'name_style'),
  ('style_upper',  'Nombre mayúsculas','Tu nombre en mayúsculas',       'Uppercase name',  'Your name in uppercase',      350, 'cosmetic', '🔠', 141, true, 'name_style'),
  ('style_glow',   'Nombre resplandor','Tu nombre con un brillo',       'Glowing name',    'Your name with a glow',       500, 'cosmetic', '✨', 142, true, 'name_style')
on conflict (item_id) do update set
  name = excluded.name, description = excluded.description,
  name_en = excluded.name_en, description_en = excluded.description_en,
  price = excluded.price, type = excluded.type, icon = excluded.icon,
  sort = excluded.sort, active = excluded.active, slot = excluded.slot;

-- ─── 5. equip_item(): exclusivo por slot + espejo en profiles ───────────────
create or replace function public.equip_item(p_item_id text, p_equipped boolean)
returns void language plpgsql security definer as $equip$
declare
  v_uid  uuid := auth.uid();
  v_slot text;
begin
  if v_uid is null then raise exception 'unauthorized'; end if;

  select slot into v_slot from public.shop_items where item_id = p_item_id;

  if p_equipped then
    -- Solo un cosmético equipado por slot: desequipa los demás del mismo slot.
    if v_slot is not null then
      update public.user_items ui
         set equipped = false, updated_at = now()
        from public.shop_items si
       where ui.user_id = v_uid and ui.item_id = si.item_id
         and si.slot = v_slot and ui.item_id <> p_item_id;
    end if;

    update public.user_items set equipped = true, updated_at = now()
     where user_id = v_uid and item_id = p_item_id and quantity > 0;

    if v_slot is not null then
      update public.profiles
         set cosmetics = jsonb_set(coalesce(cosmetics, '{}'::jsonb), array[v_slot], to_jsonb(p_item_id), true)
       where id = v_uid;
    end if;
  else
    update public.user_items set equipped = false, updated_at = now()
     where user_id = v_uid and item_id = p_item_id;

    if v_slot is not null then
      update public.profiles
         set cosmetics = coalesce(cosmetics, '{}'::jsonb) - v_slot
       where id = v_uid and (cosmetics ->> v_slot) = p_item_id;
    end if;
  end if;
end;
$equip$;

-- ─── 6. Backfill: rellena profiles.cosmetics con lo ya equipado ─────────────
update public.profiles p
   set cosmetics = coalesce(p.cosmetics, '{}'::jsonb) || sub.obj
  from (
    select ui.user_id, jsonb_object_agg(si.slot, ui.item_id) as obj
      from public.user_items ui
      join public.shop_items si on si.item_id = ui.item_id
     where ui.equipped = true and si.slot is not null
     group by ui.user_id
  ) sub
 where p.id = sub.user_id;
