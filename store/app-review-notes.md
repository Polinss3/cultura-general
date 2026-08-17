# Notas para App Review y App Privacy — 2.0.0 (sin anuncios)

Todo lo de aquí depende de una decisión previa: **qué hace la 2.0.0 con el aviso
publicitario y con ATT**, dado que esta versión no muestra ni un solo anuncio.
Ver `AUDITORIA` / la sección "Bloqueante 1" del informe.

- **Opción A (recomendada)**: con `EXPO_PUBLIC_ADS_MODE=off` no se muestra el
  aviso, no se pide ATT y no arrancan AppsFlyer ni Meta. Pierdes la atribución
  de campañas en esta versión, pero la ficha de privacidad queda limpia y no hay
  nada que un revisor pueda cuestionar.
- **Opción B**: mantienes el aviso y ATT para conservar la atribución de Meta /
  AppsFlyer. Entonces hay que reescribir la copia del aviso y de la política
  para que hable de **medición y atribución**, no de anuncios que no existen.

---

## Notas para el revisor (App Review Information → Notes)

### Español

> La app se puede usar sin crear cuenta: en la pantalla de inicio de sesión hay
> un botón "Continuar como invitado" que da acceso inmediato a Contrarreloj,
> Ascenso, Retos (Banderas y Años) y Aprender.
>
> Las funciones sociales (pregunta del día, rankings, amigos, ligas y perfil)
> requieren cuenta porque guardan progreso compartido entre usuarios. Se puede
> crear una con correo, con Apple o con Google desde la misma pantalla.
>
> Cuenta de prueba, por si prefieren no crear una:
> usuario: <RELLENAR>  ·  contraseña: <RELLENAR>
>
> La app es gratuita, no tiene compras integradas y **esta versión no muestra
> publicidad**. Los SDK publicitarios están integrados pero desactivados en
> compilación (`EXPO_PUBLIC_ADS_MODE=off`): no se inicializan y no se realiza
> ninguna petición de anuncios.
>
> Borrado de cuenta: Perfil → Zona peligrosa → Eliminar cuenta, con doble
> confirmación y sin salir de la app.

### English

> The app can be used without an account: the sign-in screen has a "Continue as
> guest" button that gives immediate access to Time Attack, Climb Mode,
> Challenges (Flags and Years) and Learn.
>
> Social features (daily question, rankings, friends, leagues and profile)
> require an account because they store progress shared between users. One can
> be created with email, Apple or Google from the same screen.
>
> Demo account, in case you prefer not to create one:
> username: <FILL IN>  ·  password: <FILL IN>
>
> The app is free, has no in-app purchases and **this version shows no ads**.
> The advertising SDKs are bundled but disabled at build time
> (`EXPO_PUBLIC_ADS_MODE=off`): they are never initialised and no ad request is
> ever made.
>
> Account deletion: Profile → Danger zone → Delete account, with a double
> confirmation, without leaving the app.

---

## App Privacy (ficha de privacidad) — Opción A, sin ATT

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

## App Privacy — Opción B, con ATT y atribución

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
