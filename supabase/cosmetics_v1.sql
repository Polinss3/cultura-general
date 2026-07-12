-- ═══════════════════════════════════════════════════════════════════════════
-- Cosméticos v1
-- ═══════════════════════════════════════════════════════════════════════════
-- Activa los cosméticos con efecto visual (marcos de avatar + color de nombre)
-- y desactiva theme_emerald hasta que tenga efecto. Idempotente y seguro de
-- re-ejecutar. Sin cambios de esquema.

update public.shop_items set active = true
  where item_id in ('frame_bronze', 'frame_silver', 'frame_gold', 'name_neon', 'name_gold');

-- Tema de acento: todavía sin efecto en la app → no venderlo aún.
update public.shop_items set active = false where item_id = 'theme_emerald';
