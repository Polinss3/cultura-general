-- Programación del envío de push (2.3.0). A MANO, una sola vez, tras aplicar
-- migrations/20260921040000_push_notifications_v1.sql y desplegar la Edge
-- Function `send-push`. No va en migrations/ porque lleva la URL del proyecto
-- y un secreto.
--
-- Pasos:
--   1. Elegir un secreto largo (p. ej. `openssl rand -hex 32`).
--   2. supabase secrets set PUSH_CRON_SECRET=<secreto>
--   3. supabase functions deploy send-push --no-verify-jwt
--   4. Sustituir <secreto> abajo y ejecutar este fichero (SQL editor o
--      `supabase db query --linked -f supabase/push_cron_setup.sql`).
--
-- Comprobación: `select * from cron.job;` debe listar `send-push`, y
-- `select * from net._http_response order by created desc limit 5;` enseña
-- las respuestas de la función ({"sent":N,...}).
--
-- Para parar: `select cron.unschedule('send-push');`

create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net;

-- El secreto se guarda en Vault (cifrado), no en el texto del cron.
select vault.create_secret('<secreto>', 'push_cron_secret', 'Cabecera x-push-secret de la Edge Function send-push');

-- Cada 15 minutos. Las funciones push_due_* comparan la HORA local del
-- usuario y anotan en push_log, así que dentro de la hora 9:00-9:59 solo
-- la primera pasada envía.
select cron.schedule(
  'send-push',
  '*/15 * * * *',
  $$
  select net.http_post(
    url     := 'https://xjzsrbcmldbgwwabnmug.supabase.co/functions/v1/send-push',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-push-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'push_cron_secret')
    ),
    body    := '{}'::jsonb,
    timeout_milliseconds := 30000
  );
  $$
);
