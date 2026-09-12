# Publicidad propia (In-House Ads)

Desde la 2.2.0 la publicidad de CG Trivia la sirve **In-House Ads**, el servicio
propio de `inhouseads.pablobrasero.com`. Sustituye por completo a AppLovin MAX,
que se retiró en esta misma versión: dependencia, plugin, claves, lista
SKAdNetwork y `app.config.ts` incluidos.

La diferencia de fondo no es de proveedor, es de naturaleza: **solo se anuncian
apps y webs propias**. No hay puja, ni mediación, ni identificadores
publicitarios, ni cookies, ni almacenamiento persistente del SDK. El cliente
vive en memoria y muere con el proceso.

## Estado actual

| Condición | Valor hoy | Dónde se cambia |
|---|---|---|
| `EXPO_PUBLIC_ADS_MODE` | `test` en `development`/`preview`/`testflight`, **`live` en `production`** (desde 2026-09-12) | [eas.json](../eas.json) |
| App y ubicaciones del panel | creadas y habilitadas | panel de In-House Ads |
| Campañas | solo las internas de prueba (`Prueba — …`); **faltan las reales antes de publicar** | panel de In-House Ads |
| `EXPO_PUBLIC_REWARDED_ADS` | `true` en todos los perfiles | [eas.json](../eas.json) |
| `EXPO_PUBLIC_BANNER_ADS` | `false` a propósito, ver más abajo | [eas.json](../eas.json) |

El sistema es *fail-closed*: cualquier valor de `EXPO_PUBLIC_ADS_MODE` ausente o
distinto de `off`/`test`/`live` se interpreta como `off`, y sin URL, sin app ID o
sin ninguna ubicación configurada `adsConfigured()` devuelve `false` y no se
monta ni siquiera el aviso de edad.

`test` no restringe la entrega: marca los eventos como pruebas para que el panel
los separe bajo el filtro **Pruebas**. Quien decide qué se entrega es la campaña.

## Identificadores del panel

Son **públicos** por diseño: el servidor decide la disponibilidad y firma las
autorizaciones de evento, redirección y recompensa. No hay ninguna clave
secreta que guardar en la app.

- **Aplicación** `cultura-general` → `485e0aab-572e-4051-879a-85a60ef978da`
- **SDK** `@inhouse/mobile-sdk` 1.1.3, empaquetado en
  [`vendor/inhouse-mobile-sdk-1.1.3.tgz`](../vendor). La cuenta atrás de vídeo
  usa su duración completa y el visor ya no duplica el estado de recompensa en
  una franja inferior. El vídeo comienza silenciado sin detener audio externo,
  y toda la creatividad abre el destino del anuncio. Visor con Liquid Glass en
  iOS 26+ vía `expo-glass-effect` (módulo nativo: exige build nueva; sin él o
  en iOS anterior dibuja superficies translúcidas equivalentes).

| Variable | Ubicación | Formato | UUID |
|---|---|---|---|
| `EXPO_PUBLIC_INHOUSE_PLACEMENT_DAILY_RESULT` | Resultado de la pregunta del día | intersticial | `be2c2b30-49f0-43df-b914-3300dabd99e9` |
| `EXPO_PUBLIC_INHOUSE_PLACEMENT_SPEED_RESULT` | Fin de partida de Contrarreloj | intersticial | `e2b4e80b-dfce-4185-a553-61589cbed236` |
| `EXPO_PUBLIC_INHOUSE_PLACEMENT_LADDER_RESULT` | Fin de escalada de Ascenso | intersticial | `acdc4aa7-2e95-4c09-bd6a-c8e91d3d715d` |
| `EXPO_PUBLIC_INHOUSE_PLACEMENT_FLAGS_RESULT` | Fin de ronda de Mundo | intersticial | `00f7e7e9-32a4-48a9-b6fc-be93751e5fdf` |
| `EXPO_PUBLIC_INHOUSE_PLACEMENT_YEARS_RESULT` | Fin de ronda de Años | intersticial | `58a2d748-9ca2-4f5b-aeb3-579ab5a10da0` |
| `EXPO_PUBLIC_INHOUSE_PLACEMENT_SHOP_COINS` | Monedas por anuncio en la Tienda | recompensado | `8bd87ce0-3407-4fc9-b732-48539589e3ef` |
| `EXPO_PUBLIC_INHOUSE_PLACEMENT_LADDER_REVIVE` | Revivir en Ascenso | recompensado | `a9dbc3d6-bee7-4a08-bc0a-fa1b2c5d24af` |
| `EXPO_PUBLIC_INHOUSE_PLACEMENT_BANNER` | Pie de las pantallas de juego | banner | `348a3903-529b-478f-9ac1-d88e58906bd8` |

Límites configurados en el panel (SDK 1.1: el presupuesto de la app solo
gobierna al intersticial; recompensados y banners obedecen solo a su
ubicación): app e intersticiales, 20 por sesión, 20 por hora y 30 s de
enfriamiento; recompensados, 20 por sesión, 30 por hora y sin enfriamiento;
banner, 50 por sesión, 60 por hora y sin enfriamiento.

## Reglas del host

Las tres primeras son nuestras y no dependen del servidor, que además las
vuelve a comprobar por su cuenta.

1. **Edad.** Solo `adult` pide anuncios. Sin decisión guardada el tramo es
   `unknown` y no sale ninguna petición. El corte está en 16 años
   ([`stores/adsConsentStore.ts`](../stores/adsConsentStore.ts)).
2. **CG PRO.** `lib/ads.native.ts` se suscribe a `lib/premium.ts`: al activarse
   la suscripción se llama a `updateContext({isPremium: true})`, que invalida al
   instante lo que hubiera cargado y vacía cola y caché. Un PRO no llega a
   emitir una sola petición. Desde 2026-09-12 es un beneficio anunciado en el
   paywall y en la Sala PRO ("Sin anuncios"), así que es un compromiso con el
   usuario, no solo una cortesía.
3. **Pausas naturales.** [`utils/adPolicy.ts`](../utils/adPolicy.ts): un
   intersticial al acabar cada partida, nunca sin resultado, con 30 s de
   enfriamiento (para no encadenar dos en partidas de diez segundos), 20 por
   hora y una ventana compartida de 15 s tras cualquier anuncio a pantalla
   completa. Las pantallas lo esperan **antes** de enseñar el resultado
   (`await showResultInterstitial(...)` y después `setPhase('done')`), con un
   plazo de 4 s: si la red tarda más, el resultado sale sin anuncio y el que
   llegue tarde se descarta. Así no puede caer en mitad de la siguiente ronda.
4. **Recompensados voluntarios.** Nunca se piden solos. El efecto se aplica una
   sola vez por recibo firmado a través de
   [`lib/adRewards.ts`](../lib/adRewards.ts); cerrar antes de tiempo, un no-fill
   o un error no conceden nada.
5. **Continuidad.** `request()` devuelve `null` ante exclusión, error, red
   caída, caducidad, límite de frecuencia o falta de campaña, y la app sigue su
   flujo sin dejar ningún hueco bloqueante.

## Dónde aparecen

Intersticiales, en la pausa, nunca durante una pregunta: resultado de la
pregunta del día, fin de Contrarreloj, fin de Ascenso, fin de Mundo y fin de
Años. Los recompensados salen de una elección explícita: «Ver anuncio» en la
Tienda (+30 monedas) y «Ver anuncio para revivir» en el game over de Ascenso.

El visor es un `Modal` a pantalla completa que monta
[`components/AdFullscreenHost.native.tsx`](../components/AdFullscreenHost.native.tsx)
en el layout raíz, fuera del `Stack`: la pantalla que pide el anuncio muchas
veces está navegando justo en ese momento y no puede ser su dueña.

## El banner sigue apagado, pero ya no hay razón técnica

El hueco existe en seis pantallas y el código funciona. Con el SDK 1.1 el
banner es tradicional (50/90 dp, sin chrome) y queda fuera del presupuesto de
frecuencia de la app, así que las dos razones por las que se apagó han
desaparecido. `EXPO_PUBLIC_BANNER_ADS` sigue en `false` solo porque nadie ha
decidido encenderlo: es una decisión de producto, no una limitación. El único
matiz técnico que queda es que el cliente admite una sola presentación activa,
por lo que `lib/ads.native.ts` retira el banner antes de pedir un anuncio a
pantalla completa.

## El aviso pregunta solo la edad

Con AppLovin, «anuncios personalizados» significaba a la vez *ads* y *tracking*,
y el aviso pedía consentimiento. Con publicidad propia no hay nada que consentir:
el SDK no trata identificadores ni datos personales, así que ni el RGPD ni ATT
entran en juego. Lo único que se pregunta es el **tramo de edad**, y solo porque
el SDK exige `adult` y deja al host determinarlo.

AppsFlyer, el SDK de Meta y `expo-tracking-transparency` se retiraron en el
mismo cambio: no hay campañas de captación que atribuir, y eran lo único que
justificaba una segunda pregunta («¿nos dejas medir?») y el diálogo de ATT. Si
algún día vuelven, vuelve también esa pregunta, porque sí son *tracking* en el
sentido de Apple y sí necesitan consentimiento en la UE.

## Inventario de prueba disponible

Las campañas internas `Prueba — Peakly`, `Prueba — 101 Juegos Offline` y
`Prueba — Miko` tienen ahora a Cultura General entre sus aplicaciones y las ocho
ubicaciones de arriba entre sus ubicaciones, así que hay relleno en los tres
formatos y en los dos idiomas. `Prueba — Cultura General` se dejó fuera a
propósito: no tiene sentido anunciar la propia app dentro de ella.

**Sus creatividades son `platform: ios`.** En iOS hay relleno; en Android
`request()` devolverá `null` y la app seguirá su curso sin anuncio, que es el
comportamiento correcto pero no sirve para probar. Para probar en Android hay
que subir al panel creatividades con plataforma `android` o `all` y un destino
que tenga sentido fuera de la App Store.

## Lo que falta antes de producción

1. Build interna o de TestFlight y prueba en dispositivo real, no en simulador.
2. Intersticial en las cinco pausas, recompensado en las dos acciones, cierre
   normal y cierre anticipado con su confirmación.
3. Recompensa concedida exactamente una vez, incluida la reapertura de la app
   entre ganarla y aplicarla.
4. Menor, edad desconocida, PRO, sin conexión, no-fill y compra de PRO durante
   una carga.
5. Fondo/foco, rotación y VoiceOver/TalkBack sobre el anuncio.
6. Comprobar en el panel que el tráfico aparece bajo el filtro **Pruebas**.
7. Inspeccionar el IPA/AAB para confirmar que no queda nada de AppLovin.

El perfil `production` ya va en `live` con todas las variables (2026-09-12).
Antes de publicar la 2.2.0 quedan los puntos 1-6 de arriba y **crear las
campañas reales** en el panel: hoy solo hay las de prueba, así que una build de
producción pediría anuncios y recibiría relleno de prueba o `null`.

## Documentación del servicio

- Guía para agentes: <https://inhouseads.pablobrasero.com/llms.txt>
- SDK: <https://inhouseads.pablobrasero.com/docs/sdk.md>
- Checklist de integración: <https://inhouseads.pablobrasero.com/docs/integration-checklist.md>
- Contrato OpenAPI: <https://inhouseads.pablobrasero.com/api/openapi.json>
