# Pasada de iPad antes de enviar a revisión

Unos 15-20 minutos. No es una QA general: son los caminos por los que Apple ya
ha rechazado la app, más lo que cambió en esta tanda.

## Por qué iPad y no iPhone

`supportsTablet` está en `false`, así que en iPad la app corre en modo
compatibilidad. Los **dos rechazos que hay documentados fueron los dos en
iPadOS 26.5**:

- **2.1(a)** — "App launched on a splash screen": al actualizar sobre una
  versión con sesión guardada y el backend inaccesible, la app se quedaba
  clavada. De ahí los dos plazos de arranque de `app/_layout.tsx` (5 s ofrece
  el modo sin conexión, 10 s entra igualmente).
- **ATT** — el diálogo de seguimiento no llegaba a aparecer porque se pedía con
  la app aún no `active`. De ahí el `waitForActive()` de `lib/tracking.ts`.

Es donde te miran. Merece los veinte minutos.

## Dónde hacerla

**En la build de EAS**, no en una local de desarrollo. El bloque A depende de
tiempos de arranque, y una build Debug sirviendo el bundle desde Metro no se
parece en nada a una Release: la splash se comporta distinto y el bloque A no
probaría lo que dice probar. Los bloques B, C y D sí valen en cualquiera.

```bash
xcrun simctl list devices available | grep -i ipad   # elige uno
xcrun simctl boot <UDID>
xcrun simctl install <UDID> <ruta>/CGTrivia.app       # o instala por TestFlight
```

---

## A. Arranque — los dos rechazos

- [ ] **Arranque en frío, con red.** Instalación limpia. Entra sin quedarse en
      la splash.
- [ ] **Arranque con sesión guardada y sin red.** Es el caso exacto del 2.1(a):
      inicia sesión, cierra la app, **pon el iPad en modo avión**, vuelve a
      abrir. A los 5 s tiene que aparecer "Continuar sin conexión"; a los 10 s
      como muy tarde, entrar igualmente. No debe quedarse en la splash **nunca**.
- [ ] **Arranque con red muy lenta.** En el simulador:
      `xcrun simctl status_bar <UDID> override --cellularBars 1`, o usa Network
      Link Conditioner. Mismo resultado: entra o da salida, no se cuelga.
- [ ] **Sin conexión, sin sesión.** Debe pedir "Continuar sin conexión" y dejar
      jugar a Contrarreloj, Ascenso, Retos y Aprender.

## B. Onboarding — lo que cambió en esta tanda

Borra la app entre pruebas para repetirlo (`xcrun simctl uninstall <UDID>
com.polinss3.culturalgeneral`).

- [ ] **No aparece ninguna pantalla de anuncios.** Es el cambio de `9802cea`:
      con `ADS_MODE=off` no se pregunta la edad ni la elección publicitaria.
      Idioma y tema → intereses → notificaciones → **directo a la app**.
- [ ] **No aparece el diálogo de seguimiento (ATT).** Si sale, algo va mal:
      significa que `adsConfigured()` devolvió `true`.
- [ ] **"Ahora no" en notificaciones también entra directo**, sin pantalla
      intermedia. Es el otro camino que se tocó.
- [ ] **Actualizando sobre una instalación previa**, el onboarding se repite
      (`ONBOARDING_VERSION = 2`) pero **no vuelve a dar el regalo de bienvenida**.
- [ ] **Perfil → pie de pantalla**: dice `v2.1.0 (NN)`, no `v1.0.0`.
- [ ] **Perfil → Ajustes**: no hay fila "Privacidad y anuncios".

## C. Los arreglos de esta tanda

- [ ] **Pregunta del día**: se responde y aparece el ranking. Repítelo otro día
      —o cambia la fecha del simulador— y comprueba que **la pregunta cambia**.
- [ ] **Guardado que falla**: responde la pregunta del día con el iPad en modo
      avión. Debe salir el aviso "No hemos podido guardar tu respuesta" y
      **volver a la pregunta**, no enseñar el ranking.
- [ ] **Aprender → Sorpréndeme**: el contador de arriba dice algo como `1 / 90`,
      no `1 / 1883`, y entrar al tema es inmediato.
- [ ] **Aprender**: entre la trivia caen preguntas de bandera y de año.
- [ ] **Inicio**: bajo el botón de la pregunta del día no hay un número de
      jugadores inventado; con pocos jugadores sale la frase sin cifra.
- [ ] **Retos**: las dos tarjetas héroe, cambiar entre Banderas y Años, y que
      cada una recuerde el modo al volver.

## D. Compatibilidad de iPad

- [ ] **Rotar el iPad.** La app está bloqueada en vertical; en modo
      compatibilidad debe seguir siendo usable y no romper el diseño.
- [ ] **Los cinco iconos de la barra caben** y las etiquetas no se cortan
      ("Aprender" y "Amigos" son las que menos margen tienen).
- [ ] **Los modales llegan bien**: el de ligas ("cómo funcionan") y las alertas
      de la zona peligrosa del perfil.
- [ ] **Teclado**: al escribir el nombre de usuario en Perfil, el campo no se
      queda tapado.

---

## Si algo del bloque A falla

No lo parchees a ojo. Los plazos están en `app/_layout.tsx`
(`BOOT_OFFLINE_HINT_MS`, `BOOT_HARD_DEADLINE_MS`) y la salida de emergencia es
`bootExpired`, que entra **sin depender de `authResolved`** justamente porque
eso es lo que puede quedarse a medias. Antes de tocar nada, mira qué promesa se
quedó colgada.
