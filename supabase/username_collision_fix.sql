-- ─────────────────────────────────────────────────────────────
-- Cultura General — el registro deja de romperse si el nombre está cogido
--
-- QUÉ ARREGLA: `generate_profile_username` tiene una salida temprana para el
-- registro manual que devuelve el nombre pedido TAL CUAL, sin comprobar si
-- está libre. Como `profiles.username` es `unique not null`, un nombre
-- duplicado revienta el insert del trigger `on_auth_user_created`, que a su
-- vez revienta el insert en `auth.users`: el usuario ve un
-- "Database error saving new user" en vez de "ese nombre ya está en uso".
--
-- Hoy eso casi nunca pasa porque el cliente comprueba la disponibilidad ANTES
-- de registrar. Pero esa comprobación:
--   1. tiene una carrera de manual: dos personas registrando el mismo nombre a
--      la vez la pasan las dos, y una se come el 500;
--   2. se hace leyendo `profiles` con el rol `anon`, así que es justo lo que
--      dejaría de funcionar al cerrar la lectura anónima de perfiles (el
--      "bloque E" comentado en security_hardening_v2.sql).
--
-- Con esto aplicado, el servidor deja de depender de que el cliente acierte.
--
-- De paso arregla un segundo camino a 500 en la misma salida temprana: si el
-- nombre pedido llega vacío o no válido, `normalize_username` devuelve NULL y
-- la función devolvía NULL, violando el `not null` de la columna.
--
-- QUÉ NO HACE: no toca ni una fila. No hay DELETE, DROP TABLE, TRUNCATE ni
-- UPDATE de datos. Solo se reemplaza una función.
--
-- COMPATIBILIDAD: total con la 1.3.0 publicada y con la 2.0.0. No cambia la
-- firma ni el comportamiento del camino feliz: si el nombre pedido está libre
-- —que es el 99 % de los registros, porque el cliente ya lo ha comprobado— se
-- devuelve exactamente igual que antes.
--
-- Idempotente y transaccional. Al final hay VERIFICACIÓN y, comentado, el
-- ROLLBACK.
-- ─────────────────────────────────────────────────────────────

begin;

create or replace function public.generate_profile_username(
  p_user_id uuid,
  p_email text,
  p_meta jsonb default '{}'::jsonb
)
returns text language plpgsql security definer as $$
declare
  v_candidate text;
  v_manual    text;
  v_base      text;
  v_tag       text;
  v_candidates text[] := array[
    public.normalize_username(p_meta->>'username'),
    public.normalize_username(p_meta->>'full_name'),
    public.normalize_username(p_meta->>'name'),
    public.normalize_username(split_part(coalesce(p_email, ''), '@', 1))
  ];
  v_suffix text := upper(substr(replace(coalesce(p_user_id::text, uuid_generate_v4()::text), '-', ''), 1, 6));
  v_attempt int := 0;
begin
  -- ── Registro manual ────────────────────────────────────────
  -- El nombre que ha elegido la persona manda, pero solo si está libre. Si no,
  -- se le pega el sufijo en vez de devolverlo a pelo y reventar: "Pablo" pasa
  -- a "Pablo A1B2C3", que sigue siendo reconocible para quien lo eligió.
  -- Si ni así hay hueco, o el nombre no vale, se cae al camino genérico de
  -- abajo — nunca se devuelve NULL.
  if coalesce((p_meta->>'manual_username')::boolean, false) then
    v_manual := public.normalize_username(p_meta->>'username');

    if public.is_valid_username(v_manual) then
      if not exists (
        select 1 from public.profiles
         where username = v_manual and id <> p_user_id
      ) then
        return v_manual;
      end if;

      loop
        v_attempt := v_attempt + 1;
        v_tag := v_suffix || case when v_attempt = 1 then '' else v_attempt::text end;
        -- El recorte reserva sitio para el sufijo y el espacio, así que el
        -- resultado nunca pasa de 20 ni acaba en espacio.
        v_base := btrim(left(v_manual, greatest(3, 20 - char_length(v_tag) - 1)));
        v_candidate := v_base || ' ' || v_tag;

        if public.is_valid_username(v_candidate)
          and not exists (
            select 1 from public.profiles
             where username = v_candidate and id <> p_user_id
          ) then
          return v_candidate;
        end if;

        exit when v_attempt > 50;
      end loop;
    end if;

    -- Sin salida por aquí: sigue al camino genérico.
    v_attempt := 0;
  end if;

  -- ── Camino genérico (social / sin nombre elegido) ───────────
  foreach v_candidate in array v_candidates loop
    if public.is_valid_username(v_candidate)
      and not exists (
        select 1
          from public.profiles
         where username = v_candidate
           and id <> p_user_id
      ) then
      return v_candidate;
    end if;
  end loop;

  loop
    v_attempt := v_attempt + 1;
    v_candidate := left(
      'Jugador ' || v_suffix || case when v_attempt = 1 then '' else v_attempt::text end,
      20
    );

    if not exists (
      select 1
        from public.profiles
       where username = v_candidate
         and id <> p_user_id
    ) then
      return v_candidate;
    end if;

    if v_attempt > 50 then
      return left('Jugador ' || substr(upper(replace(uuid_generate_v4()::text, '-', '')), 1, 10), 20);
    end if;
  end loop;
end;
$$;

commit;


-- ─────────────────────────────────────────────────────────────
-- VERIFICACIÓN — ejecútala después. Todo debe decir OK.
-- No escribe nada: usa un uuid inventado que no existe en profiles.
-- ─────────────────────────────────────────────────────────────

with libre as (
  -- Un nombre que seguro no está cogido.
  select public.generate_profile_username(
    '00000000-0000-0000-0000-000000000001'::uuid,
    'quien@ejemplo.com',
    jsonb_build_object('manual_username', true, 'username', 'Zzq Libre 8421')
  ) as v
),
cogido as (
  -- El nombre de un perfil que YA existe, pidiéndolo desde otro id.
  select public.generate_profile_username(
    '00000000-0000-0000-0000-000000000002'::uuid,
    'otro@ejemplo.com',
    jsonb_build_object('manual_username', true,
                       'username', (select username from public.profiles order by created_at limit 1))
  ) as v
),
vacio as (
  -- Registro manual sin nombre: antes devolvía NULL y rompía el not null.
  select public.generate_profile_username(
    '00000000-0000-0000-0000-000000000003'::uuid,
    'vacio@ejemplo.com',
    jsonb_build_object('manual_username', true, 'username', '')
  ) as v
)
select 'A. nombre libre se respeta' as comprobacion,
       (select v from libre) as resultado,
       case when (select v from libre) = 'Zzq Libre 8421' then 'OK' else 'REVISAR' end as estado
union all
select 'B. nombre cogido recibe sufijo',
       (select v from cogido),
       case when (select v from cogido) is not null
             and (select v from cogido) <> (select username from public.profiles order by created_at limit 1)
             and char_length((select v from cogido)) between 3 and 20
            then 'OK' else 'REVISAR' end
union all
select 'C. nombre vacío ya no devuelve NULL',
       coalesce((select v from vacio), '(NULL)'),
       case when (select v from vacio) is not null then 'OK' else 'REVISAR' end
union all
select 'D. lo devuelto siempre es un username válido',
       'A, B y C',
       case when public.is_valid_username((select v from libre))
             and public.is_valid_username((select v from cogido))
             and public.is_valid_username((select v from vacio))
            then 'OK' else 'REVISAR' end
union all
select 'Datos intactos: perfiles', count(*)::text || ' perfiles', 'INFO'
  from public.profiles;


-- ─────────────────────────────────────────────────────────────
-- ROLLBACK — vuelve a la versión anterior de la función.
-- Tampoco borra datos. Está en supabase/auth_social_username.sql:19-73;
-- para deshacer, reejecuta ese fichero (es `create or replace`).
-- ─────────────────────────────────────────────────────────────
