# Notas para App Review y App Privacy — 2.0.0 (sin anuncios)

La 2.0.0 se publica **sin un solo anuncio** y **sin pedir ATT**: con
`EXPO_PUBLIC_ADS_MODE=off`, `adsConfigured()` devuelve false y no se monta el
aviso publicitario, no se pide el permiso de seguimiento y no arrancan AppsFlyer
ni Meta. A cambio, esta versión no tiene atribución de campañas.

**Ojo con el historial**: las notas de la versión anterior decían que la app
añadía intersticiales de Google AdMob y que pedía ATT. Eso ya no es cierto, así
que las notas de abajo lo dicen explícitamente — si el revisor busca los
anuncios que anunciaba la ficha anterior y no los encuentra, es peor que
habérselo aclarado.

---

## Notas para el revisor (App Review Information → Notes)

En inglés, que es como estaban las anteriores. **Sin credenciales**: el usuario y
la contraseña van en los campos de "Información de inicio de sesión" de la propia
pantalla, no aquí.

```
This update replaces the previous release's advertising integration:
this version displays no advertising at all.

The advertising SDKs are still bundled but are disabled at build time
(the production build sets the ad mode to "off"), so they are never
initialised and no ad request is ever made. As a result the app does
not present the App Tracking Transparency prompt, and no advertising
or attribution SDK is started. The App Privacy answers for this
version declare no tracking.

WHAT'S NEW IN THIS VERSION
A new "Challenges" tab with two games: Flags, covering all 196
countries, and Years, where you place 98 historical events on the
timeline. The app has also been redesigned with a light and a dark
theme, and there is a new global ranking.

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

The app is free and has no in-app purchases.
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
| Crash Data | Sí | Sí (se adjunta el user id a Sentry) | App Functionality |
| Performance Data | Sí | Sí | App Functionality |
| Other Diagnostic Data | Sí | Sí | App Functionality |

No se recogen: ubicación, contactos, fotos, salud, financieros, historial de
navegación, búsquedas ni contenido de mensajes.

> Ojo: *Crash Data* va marcado como **vinculado a identidad** porque
> `lib/sentry.ts` llama a `setSentryUser(session.user.id)`. Si algún día se
> quita esa llamada, pasa a "no vinculado".

## App Privacy — NO aplica hoy: cómo quedaría al encender los anuncios

Todo lo anterior **más**:

| Tipo de dato | Se recoge | Vinculado | *Used to Track You* | Propósito |
|---|---|---|---|---|
| Device ID (IDFA) | Sí | Sí | **Sí** | Analytics, Developer's Advertising |
| Coarse Location / IP (AppsFlyer) | Sí | Sí | **Sí** | Analytics |
| Product Interaction | Sí | Sí | **Sí** | Analytics, Developer's Advertising |

Y hay que responder **SÍ** a "Does this app use the Advertising Identifier?",
justificando: *"Attribute this app installation to a previously served
advertisement"* y *"Attribute an action taken within this app to a previously
served advertisement"*. Las dos casillas de "display advertisements" se dejan
**sin marcar** mientras no haya anuncios.

---

## Otros campos de App Store Connect

- **Age Rating**: 4+. No hay contenido sensible, ni chat libre, ni compras.
  El corte de 16 años del aviso publicitario es una decisión de privacidad
  interna, no una clasificación de contenido.
- **Privacy Policy URL**: ES `https://cg-trivia.pablobrasero.com/privacy`,
  EN `https://cg-trivia.pablobrasero.com/en/privacy`. Ya configuradas.
- **Content Rights**: no se usa contenido de terceros.
- **Export Compliance**: `ITSAppUsesNonExemptEncryption: false` ya está en
  `app.json`, así que no debería preguntar.
- **Sign in with Apple**: está implementado, y como también hay Google es
  obligatorio tenerlo (guideline 4.8). ✅
- **Account deletion**: obligatorio desde 2022 y está implementado. ✅
