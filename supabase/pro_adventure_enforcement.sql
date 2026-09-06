-- ⚠️ APLICAR A MANO, Y SOLO CUANDO LA 2.2.0 LLEVE TIEMPO PUBLICADA.
--
-- Vive FUERA de supabase/migrations/ a propósito, junto al resto de SQL que se
-- aplica a mano (leagues.sql, cosmetics_v2.sql...). Si estuviera en migrations/
-- un `supabase db push` lo aplicaría junto con todo lo demás, que es justo lo
-- que no puede pasar.
--
-- Activa el candado de servidor sobre las recompensas de los capítulos de pago
-- de Aventura. Va aparte del resto a propósito.
--
-- Mientras haya gente en la 2.1.x, su app NO sabe pedir el grandfathering ni
-- entiende el paywall: si el candado ya estuviera puesto, un usuario que va por
-- el nivel 51 con la app antigua vería fallar la recompensa de un nivel que
-- para él siempre ha sido gratis. Es decir, romperíamos la app en producción
-- para arreglar un agujero que solo puede explotar un cliente modificado.
--
-- El orden correcto es:
--   1. Aplicar las demás migraciones (que ya marcan legacy a los usuarios
--      antiguos existentes).
--   2. Publicar la 2.2.0 y esperar a que la adopción sea alta.
--   3. Aplicar esta.
--
-- Aditiva e idempotente. Para revertirla basta con hacer los dos DROP TRIGGER.
begin;

drop trigger if exists trg_adventure_reward_premium on public.adventure_reward_claims;
create trigger trg_adventure_reward_premium
  before insert on public.adventure_reward_claims
  for each row execute function public.enforce_adventure_premium_level();

drop trigger if exists trg_adventure_chapter_reward_premium on public.adventure_chapter_reward_claims;
create trigger trg_adventure_chapter_reward_premium
  before insert on public.adventure_chapter_reward_claims
  for each row execute function public.enforce_adventure_premium_level();

commit;
