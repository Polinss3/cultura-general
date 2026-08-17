-- ─────────────────────────────────────────────────────────────
-- Diagnóstico de las funciones de nombre de usuario. SOLO LECTURA.
-- No crea, no modifica y no borra nada. Ejecútalo antes de nada.
-- ─────────────────────────────────────────────────────────────

select
  'Funciones presentes' as bloque,
  coalesce(string_agg(p.proname || '(' || pg_get_function_arguments(p.oid) || ')',
                      E'\n' order by p.proname), '(ninguna)') as detalle
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('normalize_username', 'is_valid_username', 'generate_profile_username')

union all

select
  'Faltan',
  coalesce((
    select string_agg(f, ', ')
    from unnest(array['normalize_username', 'is_valid_username', 'generate_profile_username']) f
    where not exists (
      select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.proname = f
    )
  ), '(ninguna: están las tres)')

union all

select
  '¿En qué esquema viven?',
  coalesce((
    select string_agg(distinct n.nspname, ', ')
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where p.proname in ('normalize_username', 'is_valid_username')
  ), '(en ninguno)')

union all

select
  'Trigger de alta',
  case when to_regclass('auth.users') is null then '(no hay tabla auth.users)'
       else coalesce((
         select string_agg(tgname, ', ') from pg_trigger
         where tgrelid = to_regclass('auth.users') and not tgisinternal
       ), '(sin trigger)')
  end

union all

select
  'Perfiles existentes',
  (select count(*)::text from public.profiles);
