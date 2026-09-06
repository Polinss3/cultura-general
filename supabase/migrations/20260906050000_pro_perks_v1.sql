-- Ventajas de CG PRO: racha protegida y cosméticos exclusivos.
-- Aditiva e idempotente.
begin;

-- ─── Racha protegida ─────────────────────────────────────────────────────────
-- `update_streak` ya sabía perdonar un día consumiendo un "Congelar racha".
-- Con PRO ese perdón es automático y no gasta objeto: es el beneficio más
-- emocional de la suscripción ("tu racha nunca se rompe") y el que más se nota
-- en el día a día.
--
-- Se reproduce la función entera porque hay que insertar una rama en medio.
-- El resto del cuerpo es idéntico al de gamification.sql, más un
-- `set search_path` que le faltaba.

create or replace function public.update_streak(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $streak_fn$
declare
  v_last_date  date;
  v_freeze_qty int;
begin
  if auth.uid() is null or auth.uid() <> p_user_id then
    raise exception 'unauthorized';
  end if;

  select max(dr.date) into v_last_date
    from public.daily_rankings dr
   where dr.user_id = p_user_id
     and dr.score > 0
     and dr.date < current_date;

  if v_last_date = current_date - 1 then
    update public.profiles
       set streak      = streak + 1,
           best_streak = greatest(best_streak, streak + 1)
     where id = p_user_id;
    return;
  end if;

  -- Faltó exactamente un día.
  if v_last_date = current_date - 2 then
    -- PRO: perdón automático, sin gastar nada. Se comprueba ANTES que el
    -- inventario para no consumirle un objeto a quien no lo necesita.
    if public.is_premium(p_user_id) then
      update public.profiles
         set streak      = streak + 1,
             best_streak = greatest(best_streak, streak + 1)
       where id = p_user_id;
      return;
    end if;

    select coalesce(quantity,0) into v_freeze_qty
      from public.user_items
     where user_id = p_user_id and item_id = 'streak_freeze' for update;

    if coalesce(v_freeze_qty, 0) > 0 then
      update public.user_items
         set quantity = quantity - 1, updated_at = now()
       where user_id = p_user_id and item_id = 'streak_freeze';
      update public.profiles
         set streak      = streak + 1,
             best_streak = greatest(best_streak, streak + 1)
       where id = p_user_id;
      return;
    end if;
  end if;

  update public.profiles set streak = 1 where id = p_user_id;
end;
$streak_fn$;

-- ─── Cosméticos exclusivos ───────────────────────────────────────────────────

alter table public.shop_items
  add column if not exists pro_only boolean not null default false;

comment on column public.shop_items.pro_only is
  'Solo comprable con CG PRO activo. Se sigue pagando con monedas: la exclusividad es de acceso, no de precio.';

-- El candado va en un TRIGGER sobre user_items y no reescribiendo `buy_item`,
-- por la misma razón que en Aventura: no tocar una función ya verificada en
-- producción, y que la protección valga sea cual sea el camino de entrada.
create or replace function public.enforce_pro_only_item()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if exists (
    select 1 from public.shop_items s
    where s.item_id = new.item_id and s.pro_only
  ) and not public.is_premium(new.user_id) then
    raise exception 'item requires premium';
  end if;
  return new;
end;
$$;

-- Solo en INSERT: quien compró un cosmético siendo PRO se lo queda aunque
-- luego cancele. Retirarle algo que ya pagó con sus monedas sería un castigo,
-- no una exclusividad.
drop trigger if exists trg_user_items_pro_only on public.user_items;
create trigger trg_user_items_pro_only
  before insert on public.user_items
  for each row execute function public.enforce_pro_only_item();

insert into public.shop_items
  (item_id, name, description, name_en, description_en, price, type, icon, sort, slot, active, pro_only)
values
  ('frame_pro',  'Marco PRO',    'Marco violeta reservado a CG PRO',
                 'PRO frame',    'Violet frame reserved for CG PRO',
                 400, 'cosmetic', '🟣', 210, 'frame', true, true),
  ('name_pro',   'Nombre PRO',   'Color de nombre reservado a CG PRO',
                 'PRO name',     'Name colour reserved for CG PRO',
                 400, 'cosmetic', '🔮', 310, 'name_color', true, true),
  ('icon_gem',   'Gema',         'Una gema delante de tu nombre',
                 'Gem',          'A gem in front of your name',
                 350, 'cosmetic', '💎', 410, 'name_icon', true, true),
  ('style_pro',  'Aura PRO',     'Tu nombre con un halo violeta',
                 'PRO aura',     'Your name with a violet halo',
                 450, 'cosmetic', '✨', 510, 'name_style', true, true)
on conflict (item_id) do update set
  price = excluded.price,
  slot = excluded.slot,
  active = excluded.active,
  pro_only = excluded.pro_only;

commit;
