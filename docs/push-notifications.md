# Notificaciones push reales (2.3.0)

Hasta la 2.2.0 los avisos eran locales: el móvil se programaba a sí mismo un
aviso a las 9:00 y otro a las 20:00 sin saber nada del servidor. Desde la 2.3.0
el servidor manda avisos de verdad a través de Expo Push, con hora local y
sabiendo si ya has jugado. Los locales siguen existiendo como respaldo para
quien no tiene push (simulador, sin permiso, registro fallido).

## Qué se envía

| Aviso | Cuándo (hora local del móvil) | A quién |
|---|---|---|
| Nueva pregunta del día | 9:00 | Quien no la ha respondido |
| Racha en peligro / recordatorio | 20:00 | Quien no la ha respondido (texto de racha si racha ≥ 2) |
| Tu liga cierra mañana | Domingo 18:00 | Quien está en una liga esta semana: puesto y XP que faltan |
| Resultado de liga | Lunes 10:00 | Quien jugó la liga la semana pasada: ascenso / descenso / se queda |
| Un amigo te ha superado | Al momento (cola, ≤ 15 min) | Máximo 1 al día |

Textos en `supabase/functions/send-push/index.ts` (ES/EN según el idioma del
dispositivo al registrar el token).

## Piezas

- **App**: `lib/push.ts` registra el token (`register_push_token`) al arrancar y
  al volver a primer plano con sesión; lo da de baja al apagar los avisos, cerrar
  sesión, pausar o borrar la cuenta. Con push activo, `lib/notifications.ts` no
  programa los avisos locales.
- **Base de datos**: `supabase/migrations/20260921040000_push_notifications_v1.sql`
  (tablas `push_tokens`, `push_log`, `push_queue`, funciones `push_due_*`, trigger
  de "amigo te ha superado").
- **Edge Function**: `supabase/functions/send-push` (protegida por la cabecera
  `x-push-secret`).
- **Cron**: `supabase/push_cron_setup.sql` (pg_cron + pg_net, cada 15 min).

## Puesta en marcha (una sola vez, en este orden)

1. **Clave APNs en EAS** (sin esto iOS no entrega nada):
   `eas credentials` → iOS → Push Notifications → *Set up a Push Key*. Se
   genera y sube sola con la cuenta de desarrollador. `app.json` ya lleva
   `aps-environment: production`; hace falta un build nuevo.
2. **Migración**: aplicar `20260921040000_push_notifications_v1.sql` en
   producción (a mano, como las demás de la 2.3.0).
3. **Secreto**: `openssl rand -hex 32` →
   `supabase secrets set PUSH_CRON_SECRET=<secreto>`.
4. **Función**: `supabase functions deploy send-push --no-verify-jwt`.
5. **Cron**: editar `supabase/push_cron_setup.sql` con el secreto y ejecutarlo
   (SQL editor o `supabase db query --linked -f supabase/push_cron_setup.sql`).
6. **Prueba manual**:
   ```bash
   curl -X POST https://xjzsrbcmldbgwwabnmug.supabase.co/functions/v1/send-push -H "x-push-secret: <secreto>"
   ```
   Devuelve `{"sent":N,"attempted":M,"disabled":K}`. Para forzar un aviso a un
   usuario concreto sin esperar a las 9:00, insertar en `push_queue`:
   ```sql
   insert into push_queue (user_id, kind, payload)
   values ('<uuid>', 'friend_overtaken', '{"friend":"Prueba","score":1}');
   ```
   y llamar a la función.

## Comprobar que va

- `select count(*) from push_tokens where disabled_at is null;` → dispositivos.
- `select kind, count(*) from push_log where sent_at > now() - interval '1 day' group by 1;`
- `select * from net._http_response order by created desc limit 5;` → respuestas del cron.
- Logs de la función en el panel de Supabase → Edge Functions → send-push.

## Cosas a saber

- Un token es de un solo usuario: si en el mismo móvil entra otra cuenta, el
  token pasa a ella.
- El "día" de la pregunta es UTC en toda la app; la hora de envío es local. A
  un usuario de América a las 20:00 locales ya le espera la pregunta del día
  siguiente (UTC), y el aviso es correcto igualmente.
- Expo devuelve `DeviceNotRegistered` cuando la app se desinstala: el token
  se marca `disabled_at` y deja de usarse.
