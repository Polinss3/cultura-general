-- ─────────────────────────────────────────────────────────────
-- Cultura General — que el alta no se caiga por el nombre de usuario
--
-- QUÉ ARREGLA: `handle_new_user`, el trigger que crea el perfil al registrarse,
-- mete el nombre directamente sin comprobar nada:
--
--     insert into public.profiles (id, username)
--     values (new.id, coalesce(new.raw_user_meta_data->>'username',
--                              split_part(new.email, '@', 1)));
--
-- Como `profiles.username` es `unique not null`, eso revienta el insert, que
-- revienta el insert en `auth.users`, y la persona ve un
-- "Database error saving new user" en vez de un mensaje que entienda.
--
-- Fallos reproducidos contra Postgres 16 con este mismo trigger:
--   · 23505 — se registra con un nombre que ya existe.
--   · 23502 — proveedor social sin email y sin nombre en los metadatos: el
--             `coalesce` da NULL y la columna es `not null`.
-- Y dos problemas silenciosos que no rompen pero ensucian:
--   · "Pablo" y "pablo" son perfiles distintos, indistinguibles en un ranking.
--   · Un correo tipo `jo@x.com` crea el usuario "jo", de dos letras, que las
--     propias reglas de la app (`lib/authValidation.ts`, 3-20) rechazan.
--
-- QUÉ HACE: el trigger pasa a delegar en `generate_profile_username`, que ya
-- resuelve todo eso — es lo que pretendía `auth_social_username.sql`, que nunca
-- llegó a aplicarse. Se crean también sus dos auxiliares para que este fichero
-- no dependa de ninguna migración anterior.
--
-- QUÉ NO HACE: no toca ni una fila. Nada de DELETE, DROP TABLE, TRUNCATE ni
-- UPDATE de datos. Los perfiles actuales se quedan como están, con sus
-- nombres actuales, aunque alguno no cumpla las reglas nuevas: solo se valida
-- lo que entra a partir de ahora.
--
-- COMPATIBILIDAD: total con la 1.3.0 publicada y con la 2.0.0. El cliente no
-- se entera: sigue mandando `username` y `manual_username` en los metadatos
-- igual que ahora, y si el nombre está libre —el caso normal, porque la app ya
-- lo comprueba antes— se usa tal cual.
--
-- Idempotente y transaccional. Al final hay VERIFICACIÓN y ROLLBACK, este con
-- la definición EXACTA del trigger que había antes.
-- ─────────────────────────────────────────────────────────────

begin;

-- ── Auxiliares ─────────────────────────────────────────────────────
-- Van aquí para que el fichero se sostenga solo. Son las mismas definiciones
-- de schema.sql / auth_social_username.sql / security_hardening.sql, ninguna
-- de las cuales llegó a aplicarse en esta base.

create or replace function public.normalize_username(p_username text)
returns text language sql immutable as $$
  select nullif(regexp_replace(btrim(coalesce(p_username, '')), '\s+', ' ', 'g'), '');
$$;

create or replace function public.is_valid_username(p_username text)
returns boolean language sql immutable as $$
  select p_username is not null
    and char_length(p_username) between 3 and 20
    and p_username = btrim(p_username)
    and p_username !~ '\s{2,}';
$$;

-- ── Generación del nombre ──────────────────────────────────────────

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
  v_suffix text := upper(substr(replace(coalesce(p_user_id::text, gen_random_uuid()::text), '-', ''), 1, 6));
  v_attempt int := 0;
begin
  -- ── Registro manual ────────────────────────────────────────
  -- El nombre elegido manda, pero solo si está libre. Si no, se le pega el
  -- sufijo en vez de reventar: "Pablo" pasa a "Pablo A1B2C3", que sigue siendo
  -- reconocible para quien lo eligió. Si ni así hay hueco, o el nombre no vale,
  -- se cae al camino genérico — nunca se devuelve NULL.
  if coalesce((p_meta->>'manual_username')::boolean, false) then
    v_manual := public.normalize_username(p_meta->>'username');

    if public.is_valid_username(v_manual) then
      if not exists (
        select 1 from public.profiles
         where lower(username) = lower(v_manual) and id <> p_user_id
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
             where lower(username) = lower(v_candidate) and id <> p_user_id
          ) then
          return v_candidate;
        end if;

        exit when v_attempt > 50;
      end loop;
    end if;

    v_attempt := 0;  -- sin salida por aquí: sigue al camino genérico
  end if;

  -- ── Camino genérico (social, o sin nombre elegido) ──────────
  -- La comparación es `lower()` a propósito: "Pablo" y "pablo" son dos perfiles
  -- distintos para la base pero la misma persona a la vista en un ranking.
  foreach v_candidate in array v_candidates loop
    if public.is_valid_username(v_candidate)
      and not exists (
        select 1 from public.profiles
         where lower(username) = lower(v_candidate) and id <> p_user_id
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
      select 1 from public.profiles
       where lower(username) = lower(v_candidate) and id <> p_user_id
    ) then
      return v_candidate;
    end if;

    if v_attempt > 50 then
      return left('Jugador ' || substr(upper(replace(gen_random_uuid()::text, '-', '')), 1, 10), 20);
    end if;
  end loop;
end;
$$;

-- ── El trigger, que ahora delega ───────────────────────────────────

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    public.generate_profile_username(
      new.id, new.email, coalesce(new.raw_user_meta_data, '{}'::jsonb))
  );
  return new;
end;
$$;

-- ── Restricción coherente con el generador y con la app ────────────────
-- La base conservaba el CHECK antiguo `^[A-Za-z0-9_.-]+$`, que rechazaba
-- los espacios aunque `generate_profile_username` los usa tanto en nombres
-- sociales ("Pablo García") como en su fallback ("Jugador A1B2C3"). El
-- trigger terminaba abortando el alta con "Database error saving new user".
alter table public.profiles
  drop constraint if exists profiles_username_format_check;

alter table public.profiles
  add constraint profiles_username_format_check
  check (public.is_valid_username(username))
  not valid;

alter table public.profiles
  validate constraint profiles_username_format_check;

commit;


-- ─────────────────────────────────────────────────────────────
-- VERIFICACIÓN — ejecútala después. Los cinco casos deben decir OK.
-- Es de solo lectura: no inserta nada, solo pregunta qué nombre saldría.
-- ─────────────────────────────────────────────────────────────

with cogido as (select username from public.profiles order by created_at limit 1),
casos as (
  select 'A. nombre libre se respeta' as caso,
         public.generate_profile_username('00000000-0000-0000-0000-000000000001'::uuid,
           'x@y.com', jsonb_build_object('manual_username', true, 'username', 'Zzq Libre 8421')) as v,
         'Zzq Libre 8421' as esperado
  union all
  select 'B. nombre cogido recibe sufijo',
         public.generate_profile_username('00000000-0000-0000-0000-000000000002'::uuid,
           'x@y.com', jsonb_build_object('manual_username', true, 'username', (select username from cogido))),
         null
  union all
  select 'C. mismo nombre en otras mayúsculas también',
         public.generate_profile_username('00000000-0000-0000-0000-000000000003'::uuid,
           'x@y.com', jsonb_build_object('manual_username', true, 'username', lower((select username from cogido)))),
         null
  union all
  select 'D. social sin email ni metadatos',
         public.generate_profile_username('00000000-0000-0000-0000-000000000004'::uuid, null, '{}'::jsonb),
         null
  union all
  select 'E. local-part demasiado corto',
         public.generate_profile_username('00000000-0000-0000-0000-000000000005'::uuid, 'jo@x.com', '{}'::jsonb),
         null
)
select caso, v as resultado,
       case
         when v is null then 'REVISAR: devuelve NULL'
         when not public.is_valid_username(v) then 'REVISAR: nombre inválido'
         when esperado is not null and v <> esperado then 'REVISAR: esperaba ' || esperado
         when esperado is null and exists (
           select 1 from public.profiles where lower(username) = lower(v)
         ) then 'REVISAR: choca con uno existente'
         else 'OK'
       end as estado
from casos
union all
select 'El trigger delega',
       case when pg_get_functiondef(to_regprocedure('public.handle_new_user()')::oid)
                 like '%generate_profile_username%' then 'sí' else 'no' end,
       case when pg_get_functiondef(to_regprocedure('public.handle_new_user()')::oid)
                 like '%generate_profile_username%' then 'OK' else 'REVISAR' end
union all
select 'El CHECK usa is_valid_username',
       pg_get_constraintdef(oid),
       case when pg_get_constraintdef(oid) like '%is_valid_username%'
              and convalidated then 'OK' else 'REVISAR' end
  from pg_constraint
 where conrelid = 'public.profiles'::regclass
   and conname = 'profiles_username_format_check'
union all
select 'Datos intactos', count(*)::text || ' perfiles', 'INFO' from public.profiles;


-- ─────────────────────────────────────────────────────────────
-- ROLLBACK — devuelve el trigger EXACTAMENTE como estaba antes.
-- Copiado literal de la base el 2026-08-17, no reconstruido de memoria.
-- Las tres funciones de arriba pueden quedarse: sin este trigger no las llama
-- nadie, y borrarlas no aporta nada.
--
--   create or replace function public.handle_new_user()
--    returns trigger
--    language plpgsql
--    security definer
--   as $function$
--   begin
--     insert into public.profiles (id, username)
--     values (new.id, coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)));
--     return new;
--   end;
--   $function$;
--
--   alter table public.profiles
--     drop constraint if exists profiles_username_format_check;
--   alter table public.profiles
--     add constraint profiles_username_format_check
--     check (
--       char_length(username) >= 3
--       and char_length(username) <= 20
--       and username ~ '^[A-Za-z0-9_.-]+$'
--     );
-- ─────────────────────────────────────────────────────────────
