# Notas para App Review y App Privacy — 2.2.0 (CG PRO)

La 2.2.0 introduce compras opcionales de CG PRO. La app no lleva SDKs de
atribución (AppsFlyer y Meta se retiraron) ni solicita ATT: la publicidad es
propia (In-House Ads, solo apps y webs del mismo desarrollador) y no trata
identificadores. Los usuarios gratuitos ven anuncios propios en pausas del
juego; con CG PRO no se pide ni se muestra ninguno, y así se anuncia en el
paywall ("Sin anuncios").

---

## Notas para el revisor (App Review Information → Notes)

En inglés, que es como estaban las anteriores. **Sin credenciales**: el usuario y
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
The App Privacy answers for this version declare no tracking.
```

## App Privacy — lo que hay que rellenar (sin ATT)

**"Does this app use the Advertising Identifier (IDFA)?" → NO.**
Y entonces ningún tipo de dato se marca como *Used to Track You*.

| Tipo de dato | Se recoge | Vinculado a identidad | Propósito |
|---|---|---|---|
| Email Address | Sí | Sí | App Functionality, Account Management |
| Name (nombre de usuario) | Sí | Sí | App Functionality |
| User ID | Sí | Sí | App Functionality, Analytics |
| Product Interaction (respuestas, rachas, puntuaciones) | Sí | Sí | App Functionality, Analytics |
| Purchase History (estado de CG PRO gestionado por RevenueCat) | Sí | Sí | App Functionality |
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
