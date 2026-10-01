# Notas para App Review y App Privacy

## Estado actual — 25 de septiembre de 2026

La 2.2.0 (94) está publicada. La 2.3.0 se ha probado en iPhone con iOS 26 y
27 y en iPad; aún hay que elegir la compilación definitiva para App Review.
Las novedades preparadas están en [release-2.3.0.md](release-2.3.0.md).

**Revisión de privacidad para 2.3.0:** la app registra un token de Expo
vinculado a la cuenta cuando se activan notificaciones remotas. Ese token
identifica el dispositivo destinatario y se usa para funcionalidad, no para
seguimiento publicitario. La 2.2.0 había eliminado «ID del dispositivo» de
App Privacy; antes de enviar 2.3.0 hay que revisar la clasificación de este
token en App Store Connect y actualizar las respuestas si corresponde. La
política web y la incluida en la app ya describen el flujo remoto. No afirmar
en las notas de 2.3.0 que la app carece de cualquier ID de dispositivo.

El texto siguiente conserva el historial de 2.2.0 como referencia y no debe
copiarse sin revisión a la ficha de 2.3.0.

## Historial del rechazo de 2.2.0 (94) — resuelto

Los párrafos siguientes conservan el diagnóstico y los pasos de la incidencia
original. Las referencias a la ficha con ID del dispositivo y a la versión
rechazada describen el estado anterior a su publicación y corrección.

## Corrección del rechazo del 22 de septiembre de 2026 — Guideline 5.1.2(i)

Apple ha encontrado una contradicción entre el binario 2.2.0 (94), que no pide
permiso ATT, y la ficha **App Privacy** de App Store Connect, que aún marca
**Device ID** como **Used to Track You**. La solución para esta build es corregir
la ficha, porque la app no usa datos para seguimiento entre apps o webs de otros
desarrolladores. No se debe añadir un diálogo ATT sin un uso real de seguimiento.
La ficha pública de la versión 2.1.0 todavía muestra **Datos usados para
rastrearte → Identificadores**, de modo que el cambio aún no está publicado.

En **App Store Connect → Cultura General: Trivia → App Privacy**:

1. En **Data Types → Edit**, desmarcar **Device ID** por completo y conservar
   **User ID**. La aplicación actual no llama a `collectDeviceIdentifiers()` de
   RevenueCat, no lee IDFA/IDFV en su código y ya no incluye SDKs de atribución.
   No se debe confundir el UUID de cuenta ni el token temporal de cada anuncio
   con un identificador persistente del dispositivo.
2. Revisar el resto de tipos de datos y verificar que **ninguno** esté marcado
   **Used for Tracking**. Mantener los datos que sí recoge la app para cuentas,
   progreso, compras y diagnósticos; no responder que la app no recopila datos.
3. Revisar la vista previa: no debe aparecer **Data Used to Track You**.
   Pulsar **Publish** para que el cambio de la ficha surta efecto. Este paso
   requiere rol Account Holder, Admin o App Manager y una confirmación de Apple
   sobre la exactitud de las respuestas.
4. Responder al rechazo en **App Review** una vez publicada la ficha. Texto
   sugerido en inglés:

   > Hello App Review, thank you for pointing out the inconsistency. We have
   > updated and published the App Privacy information in App Store Connect.
   > Version 2.2.0 (94) does not track users across apps or websites owned by
   > other companies. We removed the former attribution and third-party ad
   > SDKs (AppsFlyer, Meta and AppLovin). Our current in-house ads promote only
   > our own apps and websites and do not use IDFA or persistent device IDs.
   > RevenueCat is used for purchase entitlement management and Sentry for
   > diagnostics; neither is used by us for cross-app advertising tracking.
   > Consequently, the app does not request ATT permission. Please review the
   > updated privacy answers with the resubmission.

Intento del 22 de septiembre: en App Store Connect se desmarcó **ID del
dispositivo** en **Tipos de datos**, pero al pulsar **Publicar** Apple bloqueó
el cambio con el error «Tu app contiene NSUserTrackingUsageDescription…».
La ficha publicada sigue indicando **ID del dispositivo → seguimiento** y la
versión 2.2.0 (94) sigue rechazada. No se ha reenviado todavía. El siguiente
paso es pedir al equipo de App Review que aclare o desbloquee esta validación;
no declarar seguimiento que la compilación no realiza solo para superar el
formulario. Si Apple exige otra compilación, generarla con un número de build
nuevo y comprobar el `Info.plist` del IPA antes de subirla.

Se envió una respuesta al equipo de App Review en el envío
`603657c8-bbe1-445a-a793-c7bae91dc22f` el 22 de septiembre a las 23:56,
explicando el bloqueo, las comprobaciones del IPA 2.2.0 (94) y solicitando
indicaciones sobre publicar la ficha o reenviar la compilación. App Store
Connect muestra el mensaje en **Mensajes (2)**. Queda pendiente su respuesta;
la ficha y el envío siguen sin corregirse.

El IPA archivado en `build-production.ipa` es 2.2.0 (94): su `Info.plist` no
contiene `NSUserTrackingUsageDescription`; su
`PrivacyInfo.xcprivacy` declara `NSPrivacyTracking=false`, los manifiestos de
RevenueCat y Sentry también declaran `NSPrivacyTracking=false`, y no contiene
los SDK retirados. La advertencia de App Store Connect sobre
`NSUserTrackingUsageDescription` parece provenir de la versión 2.1.0 que sigue
publicada: su configuración histórica sí incluía esa clave, aunque los anuncios
y la atribución estaban desactivados en el perfil de producción. Verificar si
la consola permite publicar la ficha sin **Device ID**; si la bloquea, responder
al rechazo según la propia indicación de Apple y adjuntar esta explicación.
El proyecto ya está configurado como 2.3.0 y el perfil `production` de EAS
incrementa el número de build. Antes de una nueva subida, comprobar que la
ficha publicada ya no muestra seguimiento y actualizar las notas de revisión
para describir las funciones que incluya realmente la nueva build.

La 2.2.0 introduce compras opcionales de CG PRO. La app no lleva SDKs de
atribución (AppsFlyer y Meta se retiraron) ni solicita ATT: la publicidad es
propia (In-House Ads, solo apps y webs del mismo desarrollador) y no trata
identificadores. Los usuarios gratuitos ven anuncios propios en pausas del
juego; con CG PRO no se pide ni se muestra ninguno, y así se anuncia en el
paywall ("Sin anuncios").

---

## Borrador de notas para el revisor (App Review Information → Notes)

Este borrador parte de las notas de **2.2.0** y debe actualizarse antes de
enviar **2.3.0** para destacar solo sus novedades. En inglés, como estaban las
anteriores. **Sin credenciales**: el usuario y
la contraseña van en los campos de "Información de inicio de sesión" de la propia
pantalla, no aquí.

```
WHAT'S NEW IN THIS VERSION
Adventure now contains 400 levels across 20 themed chapters. The first
40 levels and the base catalogue of 2,000 questions remain free. CG PRO
unlocks all 400 Adventure levels, adds 2,000 questions to Learn, and
includes Smart Review, Exam and advanced insights.

IN-APP PURCHASES
The paywall offers monthly and annual auto-renewable subscriptions and
a non-consumable lifetime purchase. It shows localized StoreKit prices,
trial and renewal terms, Privacy Policy, Terms, Restore Purchases and a
Manage Subscription link. TestFlight purchases use Apple's sandbox and
do not charge the reviewer.

SIGNING IN
An account is not required to use the app. The sign-in screen has a
"Continue as guest" button that gives immediate access to Time Attack,
Climb Mode, Challenges (Flags and Years) and Learn.

Social features — the daily question, rankings, friends, leagues and
profile — require an account because they store progress shared
between users. The demo account in the fields above can be used to
review them.

ACCOUNT DELETION
Profile → Danger zone → Delete account, with a double confirmation,
without leaving the app.

The app can be downloaded and used without purchasing CG PRO.

ADVERTISING
The app ships no attribution SDKs and never requests ATT. Its advertising
is first-party: it only promotes other apps and websites by the same
developer, served from our own server, with no advertising identifiers,
no third-party networks and no cookies. Free users may see an interstitial
at natural breaks (after a round or the daily question) and may opt in to
rewarded ads; users under 16 and CG PRO subscribers see no ads at all.
The App Privacy answers for this version must declare no tracking; confirm the
published App Store Connect preview before resubmitting.
```

## App Privacy — lo que hay que rellenar (sin ATT)

**"Does this app use the Advertising Identifier (IDFA)?" → NO.**
Ningún tipo de dato debe marcarse como *Used to Track You*; en particular,
corregir la respuesta de **Device ID** que causó el rechazo de 2.2.0 (94).

| Tipo de dato | Se recoge | Vinculado a identidad | Propósito |
|---|---|---|---|
| Email Address | Sí | Sí | App Functionality, Account Management |
| Name (nombre de usuario) | Sí | Sí | App Functionality |
| User ID | Sí | Sí | App Functionality, Analytics |
| Product Interaction (respuestas, rachas, puntuaciones) | Sí | Sí | App Functionality, Analytics |
| Purchase History (estado de CG PRO gestionado por RevenueCat) | Sí | Sí | App Functionality, Analytics |
| Crash Data | Sí | Sí (se adjunta el user id a Sentry) | App Functionality |
| Performance Data | Sí | Sí | App Functionality |
| Other Diagnostic Data | Sí | Sí | App Functionality |

No se recogen: ubicación, contactos, fotos, salud, financieros, historial de
navegación, búsquedas ni contenido de mensajes.

> Ojo: *Crash Data* va marcado como **vinculado a identidad** porque
> `lib/sentry.ts` llama a `setSentryUser(session.user.id)`. Si algún día se
> quita esa llamada, pasa a "no vinculado".

## Otros campos de App Store Connect

- **Age Rating**: revisar la declaración para reflejar que existen compras dentro
  de la app; no hay chat libre ni contenido sensible.
- **Privacy Policy URL**: ES `https://cg-trivia.pablobrasero.com/privacy`,
  EN `https://cg-trivia.pablobrasero.com/en/privacy`. Ya configuradas.
- **Content Rights**: no se usa contenido de terceros.
- **Export Compliance**: `ITSAppUsesNonExemptEncryption: false` ya está en
  `app.json`, así que no debería preguntar.
- **Sign in with Apple**: está implementado, y como también hay Google es
  obligatorio tenerlo (guideline 4.8). ✅
- **Account deletion**: obligatorio desde 2022 y está implementado. ✅
