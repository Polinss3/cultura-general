# Auth rollout

## Supabase Auth

1. En `Authentication > URL Configuration`, añade estas redirect URLs:
   - `culturalgeneral://auth/callback`
   - `culturalgeneral://update-password`
2. Activa `Google` en `Authentication > Providers` y usa el callback que indique Supabase para tu proyecto.
3. Activa `Apple` en `Authentication > Providers` con el `Service ID` y la clave de Apple correspondientes.
4. Aplica el SQL de [supabase/auth_social_username.sql](/Users/pablobrasero/Desktop/Proyectos/Cultura General/supabase/auth_social_username.sql).

## Resend SMTP

Configura `Authentication > SMTP Settings` en Supabase con:

- Host: `smtp.resend.com`
- Port: `465` o `587`
- Username: `resend`
- Password: tu API key de Resend
- Sender name / from: el remitente con tu dominio verificado en Resend

## iOS

1. Rebuild con EAS para que entre `usesAppleSignIn`.
2. Prueba `Apple` en dispositivo real.
3. Verifica que el callback de Google y la confirmación por email vuelven a la app.
