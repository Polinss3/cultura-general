-- ═══════════════════════════════════════════════════════════════════════════
-- Precios de power-ups v2 (subida moderada)
-- ═══════════════════════════════════════════════════════════════════════════
-- Aditivo e idempotente: solo actualiza el precio de filas existentes de
-- shop_items. Los precios son server-authoritative (buy_item los lee de aquí),
-- así que apps nuevas y antiguas ven el precio actualizado sin cambios de código.
-- Seguro de re-ejecutar.

update public.shop_items set price = 45  where item_id = 'pw_hint';
update public.shop_items set price = 40  where item_id = 'pw_skip';
update public.shop_items set price = 50  where item_id = 'pw_time';
update public.shop_items set price = 65  where item_id = 'pw_5050';
update public.shop_items set price = 90  where item_id = 'pw_revive';
update public.shop_items set price = 180 where item_id = 'streak_freeze';
