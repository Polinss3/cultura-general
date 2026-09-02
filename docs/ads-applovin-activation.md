# Activar los anuncios (AppLovin MAX)

Todo el código publicitario de la 2.0.0 está escrito, probado y desplegado, pero
**apagado**. La app se compila y se publica sin pedir un solo anuncio hasta que
existan las credenciales de AppLovin. Este documento es la lista exacta de lo que
hay que hacer el día que lleguen.

## Por qué ahora mismo no sale ningún anuncio

El sistema es *fail-closed*: hacen falta tres condiciones a la vez, y hoy no se
cumple ninguna.

| Condición | Estado actual | Dónde se cambia |
|---|---|---|
| `EXPO_PUBLIC_ADS_MODE` vale `test` o `live` | `off` en el perfil de producción | [eas.json](../eas.json) |
| Hay SDK key y al menos una unidad de anuncio | No existe ninguna variable de AppLovin en EAS | EAS Environment |
| El usuario es adulto y ha elegido | **No se pregunta**: sin las dos de arriba no hay aviso | — |

Cualquier valor ausente o distinto de `off`/`test`/`live` se interpreta como
`off` ([lib/ads.native.ts:59](../lib/ads.native.ts#L59)). Sin SDK key o sin
unidades, `initializeAds()` sale antes de inicializar el SDK. Y a quien declara
menos de 16 años no se le inicializa AppLovin, AppsFlyer ni Meta, pase lo que
pase con las variables.

## El aviso solo aparece si puede haber anuncios

Las dos primeras condiciones se resumen en `adsConfigured()`
([lib/ads.native.ts](../lib/ads.native.ts)), y de ahí cuelga toda la pantalla de
edad y elección publicitaria: el paso final del onboarding, el modal de red de
seguridad del layout raíz, la fila "Privacidad y anuncios" del perfil y la
propia `applyAdvertisingDecision`.

Con los anuncios apagados, la 2.0.0 **no pregunta nada, no pide ATT y no arranca
AppsFlyer ni Meta**. Preguntar por una elección publicitaria que no puede tener
efecto confunde al usuario, no cuadra con la ficha de tienda —que no menciona
publicidad— y en el camino "personalizados" acabaría pidiendo permiso de
seguimiento para medir anuncios que no existen.

Dos consecuencias prácticas:

- **El flujo no se puede probar en local.** Sin `EXPO_PUBLIC_ADS_MODE` en el
  entorno, `parseMode()` cae a `off` y el aviso no sale. Hay que usar el perfil
  `preview`, que ya lleva `ADS_MODE=test` (paso 3 de aquí abajo).
- **Al encender los anuncios no hay que deshacer nada.** En cuanto existan la
  SDK key y una unidad, `adsConfigured()` pasa a `true` y el aviso vuelve solo.
  Lo que sí hay que hacer es quitar el "sin anuncios" de las cuatro fichas de
  `store/` **antes** de subir esa build.

## Pasos para activarlo

### 1. Crear las variables en EAS

Desde la raíz del proyecto, una por una (o desde expo.dev → Environment
variables → production):

```bash
eas env:create production --name EXPO_PUBLIC_APPLOVIN_SDK_KEY --value "<SDK key de MAX>"
```

Las unidades de anuncio se crean igual. Como mínimo hace falta el intersticial
de la plataforma que se vaya a publicar:

| Variable | Necesaria para |
|---|---|
| `EXPO_PUBLIC_APPLOVIN_SDK_KEY` | Imprescindible |
| `EXPO_PUBLIC_APPLOVIN_IOS_INTERSTITIAL` | Intersticiales en iOS |
| `EXPO_PUBLIC_APPLOVIN_ANDROID_INTERSTITIAL` | Intersticiales en Android |
| `EXPO_PUBLIC_APPLOVIN_IOS_REWARDED` | Recompensados en iOS |
| `EXPO_PUBLIC_APPLOVIN_ANDROID_REWARDED` | Recompensados en Android |
| `EXPO_PUBLIC_APPLOVIN_IOS_BANNER` | Banner en iOS |
| `EXPO_PUBLIC_APPLOVIN_ANDROID_BANNER` | Banner en Android |

> Las dos variables muertas de AdMob que quedaron de antes de la migración ya se
> borraron el 2026-08-03. El entorno de producción solo tiene lo de Supabase,
> AppsFlyer y Sentry.

### 2. Encender los formatos que quieras

Banner y pistas con recompensa van detrás de su propio interruptor, aparte de
necesitar su unidad de anuncio. Si no los pones, solo salen intersticiales:

```bash
eas env:create production --name EXPO_PUBLIC_BANNER_ADS --value true
eas env:create production --name EXPO_PUBLIC_REWARDED_HINTS --value true
```

El banner se monta al pie de Contrarreloj, Ascenso, Retos (Banderas y Años),
Aprender y las pausas naturales de Aventura (preparación y resultado del nivel),
en un hueco reservado por debajo del contenido: nunca se superpone a un control.
Durante las preguntas de Aventura no se monta ningún banner.

### 3. Probar en un dispositivo real antes de ir a producción

```bash
# eas.json ya deja EXPO_PUBLIC_ADS_MODE=test en los perfiles development y preview
eas build --profile preview --platform ios
```

En modo `test` el SDK activa el log verboso y solo sirve anuncios si el
dispositivo está dado de alta como test device en MAX. Si no lo está, registra
su IDFA/GAID en `EXPO_PUBLIC_APPLOVIN_TEST_DEVICE_IDS` (separados por comas):
se comunican a MAX antes de `initialize()`.

Qué comprobar en el dispositivo:

- Elegir "menor de 16" en el onboarding → no aparece ningún anuncio, nunca.
- Elegir "contextual" → hay anuncios, pero no se pide ATT ni arrancan
  AppsFlyer/Meta.
- Elegir "personalizados" → primero sale el diálogo oficial de ATT y después el
  anuncio.
- Cambiar de personalizados a contextual en Perfil → Ajustes → Privacidad y
  anuncios corta las solicitudes hasta el siguiente arranque.

### 4. Poner `live` en producción

En [eas.json](../eas.json), perfil `production`:

```json
"env": { "SENTRY_ALLOW_FAILURE": "true", "EXPO_PUBLIC_ADS_MODE": "live" }
```

### 5. Publicar app-ads.txt

AppLovin da el bloque literal en **MAX → Account → General → app-ads.txt**. No
se inventan seller IDs ni `DIRECT`/`RESELLER`.

```bash
# pega el bloque tal cual
$EDITOR website/src/app-ads.txt
cd website && npm run build && npm test
cd .. && ./website/deploy/deploy.sh
```

Queda servido en `https://cg-trivia.pablobrasero.com/app-ads.txt`. Mientras el
fichero no tenga entradas, el build publica un placeholder solo con comentarios,
que es válido y mejor que un 404. Los tests de la web rechazan cualquier línea
que no tenga forma de entrada real.

Recuerda apuntar ese dominio en el campo de la ficha de App Store Connect
(*App Information → Marketing URL / app-ads.txt domain*) para que los
verificadores lo encuentren.

### 6. Subir la versión

Sube el número de versión y compila con el perfil de producción. Los anuncios
solo aparecen en esa build; nada de esto afecta a las que ya están publicadas.

## Cuántos anuncios ve un jugador

Los límites están en [utils/adPolicy.ts](../utils/adPolicy.ts) y hay tests en
[utils/adPolicy.test.ts](../utils/adPolicy.test.ts) (`npm run test:ads`):

- Los **3 primeros resultados** de la sesión no llevan intersticial.
- Tampoco los **primeros 90 segundos** de sesión.
- **120 segundos** de espera entre intersticiales automáticos.
- **25 segundos** de margen después de cerrar cualquier pantalla completa,
  incluidos los recompensados que pide el jugador.
- Máximo **8 intersticiales automáticos por hora**.
- Los intersticiales solo salen en pausas naturales: resultado de la pregunta
  diaria, fin de Contrarreloj, fin de Ascenso y fin de una ronda de Banderas o de Años.

Si se relajan estos números hay que tocar también la política de privacidad de
la web, que describe el comportamiento real.

## Orden de inicialización (no se puede alterar)

```
elección de edad + publicidad
  └─ menor de 16 ──────────────→ nada se inicializa
  └─ contextual ───────────────→ MAX con setHasUserConsent(false) + setDoNotSell(true)
  └─ personalizada ────────────→ ATT → MAX → AppsFlyer → Meta
```

Está implementado en [lib/advertising.ts](../lib/advertising.ts). ATT siempre va
antes que MAX, y AppsFlyer/Meta siempre después: invertirlo incumple las reglas
de Apple y las del propio MAX.
