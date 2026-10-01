-- Cosméticos PRO nuevos (2.3.0). Aditiva e idempotente.
-- La app los traduce a efectos en lib/cosmetics.ts; una app antigua que no
-- conozca el item_id no pinta nada (resolveCosmetics ignora ids desconocidos),
-- así que se crean OCULTOS (active = false): en la tienda de la 2.2.0 un PRO
-- pagaría por algo invisible. Activar al publicar la 2.3.0 con:
--   update public.shop_items set active = true
--    where item_id in ('frame_pro_glow','icon_pro_owl','name_pro_ember');
-- El on conflict no toca `active`, así que reaplicar no los reactiva ni oculta.
begin;

insert into public.shop_items
  (item_id, name, description, name_en, description_en, price, type, icon, sort, slot, active, pro_only)
values
  ('frame_pro_glow', 'Marco con halo', 'Marco violeta con halo luminoso, solo CG PRO',
                     'Halo frame',     'Violet frame with a glowing halo, CG PRO only',
                     600, 'cosmetic', '🟪', 215, 'frame', false, true),
  ('icon_pro_owl',   'Búho PRO',       'Un búho sabio delante de tu nombre',
                     'PRO owl',        'A wise owl in front of your name',
                     400, 'cosmetic', '🦉', 415, 'name_icon', false, true),
  ('name_pro_ember', 'Nombre ámbar PRO', 'Color ámbar reservado a CG PRO',
                     'PRO ember name',   'Ember colour reserved for CG PRO',
                     400, 'cosmetic', '🟠', 315, 'name_color', false, true)
on conflict (item_id) do update set
  price = excluded.price,
  slot = excluded.slot,
  pro_only = excluded.pro_only;

commit;
