# Appodeal — integración segura de CG Trivia

Estado técnico: 30-ago-2026. Esta guía describe la migración desde el proveedor anterior, lo que queda implementado en `ads/appodeal` y las acciones externas necesarias antes de activar tráfico real. No autoriza publicar con `live`.

## Fuentes oficiales vigentes

- [Appodeal React Native](https://github.com/appodeal/react-native-appodeal)
- [Appodeal iOS 4.3](https://docs.appodeal.com/ios/get-started)
- [Appodeal Android](https://docs.appodeal.com/android/get-started)
- [Protección de datos y CMP](https://docs.appodeal.com/ios/data-protection/gdpr-and-ccpa)
- [Pruebas iOS](https://docs.appodeal.com/ios/advanced/testing)
- [Placements](https://docs.appodeal.com/ad-server/placements)
- [App privacy de iOS](https://docs.appodeal.com/ios/data-protection/app-privacy-details)
- [app-ads.txt](https://docs.appodeal.com/advanced/app-ads)
- [Terms of Service](https://appodeal.com/terms-of-service/), [SDK License](https://appodeal.com/sdk-license-agreement/) y [Privacy Policy](https://appodeal.com/privacy-policy/)
- [Apple ATT](https://developer.apple.com/documentation/apptrackingtransparency), [Privacy Manifest](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files) y [AdAttributionKit](https://developer.apple.com/documentation/adattributionkit)

Revisar estas fuentes el día de cada publicación. No copiar listas de atribución, adapters ni requisitos desde tutoriales antiguos.

## Versiones y puente temporal

El wrapper oficial más reciente es `react-native-appodeal@4.2.0`, pero el SDK nativo vigente es 4.3.0 y el wrapper todavía no expone `setNonPersonalized()`. Por eso se mantiene de forma deliberada `patches/react-native-appodeal+4.2.0.patch`, igual que en 101 Offline Games.

El parche:

1. enlaza Appodeal iOS/Android 4.3.0;
2. expone `setNonPersonalized(boolean)` en TypeScript, TurboModules, puente clásico, Objective-C, Java y Kotlin;
3. instala solo BidMachine 3.8.0.0 como fuente de demanda;
4. mantiene IAB 3.5.2.0 en iOS y 1.8.1.0 en Android.

Cada actualización de Expo, React Native o Appodeal exige reinstalar desde cero, comprobar que `patch-package` aplica, ejecutar prebuild/Pods y compilar ambas plataformas. En cuanto el wrapper oficial incluya nativo 4.3+ y `setNonPersonalized()`, se debe retirar el parche.

## Adapters incluidos y excluidos

Incluidos:

- Appodeal core 4.3.0;
- Appodeal BidMachine adapter 3.8.0.0;
- Appodeal IAB adapter 3.5.2.0/1.8.1.0;
- Stack Consent Manager transitivo de Appodeal.

Excluidos:

- integración directa y adapters del proveedor anterior;
- AdMob/Google Mobile Ads y cualquier `GADApplicationIdentifier`;
- adapter AppsFlyer de Appodeal, porque el callback ILRD manual es la única fuente de ingresos;
- Meta Audience Network, LevelPlay, Bidon y cualquier red no revisada.

Añadir una red exige revisar sus términos, CMP, Privacy Manifest, Data Safety, atribución y `app-ads.txt`.

## Variables y modos

```dotenv
EXPO_PUBLIC_ADS_MODE=off
EXPO_PUBLIC_APPODEAL_IOS_APP_KEY=
EXPO_PUBLIC_APPODEAL_ANDROID_APP_KEY=
EXPO_PUBLIC_BANNER_ADS=true
EXPO_PUBLIC_REWARDED_HINTS=true
```

- Un modo ausente o inválido equivale a `off`.
- `off` no carga, inicializa ni solicita Appodeal.
- `test` llama `setTesting(true)` antes del CMP y de `initialize()`.
- `live` bajo `__DEV__` se convierte en `test`.
- iOS no arranca sin `EXPO_PUBLIC_APPODEAL_IOS_APP_KEY`.
- Android no arranca sin su propia App Key; la clave iOS nunca se reutiliza.
- Claves reales solo en EAS Environment o un gestor de secretos.

El perfil EAS `testflight` hereda producción, pero fuerza `EXPO_PUBLIC_ADS_MODE=test` y habilita banner/rewarded. Producción continúa en `off` hasta autorización explícita.

## Edad, CMP y ATT

Cada superficie gobierna una decisión distinta:

```text
tramo de edad propio
├─ menor de 18 → ningún SDK publicitario, AppsFlyer ni Meta
└─ adulto
   └─ CMP oficial Appodeal → ATT solo iOS → Appodeal
                                      └─ si ATT concedido: AppsFlyer/Meta
```

- La app solo guarda tramo, fecha, idioma y versión del aviso.
- La personalización la decide el CMP de Appodeal y la transmite mediante IAB TCF.
- `AppodealConsentStatus.OBTAINED` significa que el flujo tiene respuesta, no que el usuario aceptó; no se interpreta como permiso.
- Si la consulta del CMP falla, se fuerza `setNonPersonalized(true)`.
- Denegar ATT no desactiva anuncios; desactiva IDFA y atribución AppsFlyer/Meta.
- Retirar la elegibilidad corta caché, banners, futuras solicitudes y medición. Para no reutilizar un SDK ya inicializado, volver a adulto requiere reiniciar.

## Formatos y placements

Todos los nombres viven en `APPODEAL_PLACEMENTS` de `lib/ads.native.ts` y su stub web.

| Superficie de producto | Formato | Placement |
|---|---|---|
| pie de Contrarreloj, Ascenso, Banderas, Años y Aprender | banner | `gameplay_banner` |
| resultado de Pregunta diaria | interstitial | `daily_result_interstitial` |
| resultado de Contrarreloj | interstitial | `speed_result_interstitial` |
| resultado de Ascenso | interstitial | `ladder_result_interstitial` |
| resultado de Banderas | interstitial | `flags_result_interstitial` |
| resultado de Años | interstitial | `years_result_interstitial` |
| monedas solicitadas en Tienda | rewarded | `shop_coins_rewarded` |
| revivir en Ascenso | rewarded | `ladder_revive_rewarded` |
| tiempo extra en Contrarreloj | rewarded | `speed_time_rewarded` |

Los nueve placements deben existir y estar habilitados en el dashboard de cada plataforma. Appodeal usa estos nombres; no existen IDs de unidad por formato en el código.

Protecciones de intersticial:

- tres resultados completados;
- 90 segundos de sesión;
- 120 segundos entre intersticiales automáticos;
- ventana compartida de 25 segundos tras cerrar cualquier fullscreen;
- máximo móvil de ocho intersticiales automáticos por hora;
- retraso de 600 ms después de mostrar el resultado.

Los rewarded solo conceden la recompensa tras el callback `REWARD`.

## AppsFlyer e ingresos

La única fuente ILRD es `AppodealSdkEvents.AD_REVENUE`:

- solo se reporta con modo efectivo `live`;
- solo si AppsFlyer ya arrancó después de ATT;
- importe finito, no negativo y en USD;
- conserva red, formato, placement, unidad y precisión;
- usa `MEDIATION_NETWORK.APPODEAL`;
- no se instala ni activa otro reenvío Appodeal→AppsFlyer.

El tráfico de prueba nunca se reporta como ingreso real.

## Configuración nativa reproducible

`app.config.ts` genera:

- ATS requerido por Appodeal;
- 256 IDs SKAdNetwork y 7 IDs AdAttributionKit obtenidos de los endpoints oficiales;
- Privacy Manifest de la aplicación y dominios ATT de AppsFlyer;
- iOS 15.1 con frameworks estáticos;
- Android minSdk 24.

Los snapshots viven en `config/appodealAttributionIds.js`. Actualizarlos desde:

- `https://neo-mw-backend.appodeal.com/v4/skadn/ids`
- `https://neo-mw-backend.appodeal.com/v4/aak/ids`

No editar únicamente `ios/` o `android/` generados.

## Perfil TestFlight

Configurar en el environment de producción de EAS:

```bash
eas env:create production --name EXPO_PUBLIC_APPODEAL_IOS_APP_KEY --value "<APP KEY IOS>"
```

Crear y subir la build de prueba:

```bash
eas build --profile testflight --platform ios
eas submit --profile production --platform ios --latest
```

El perfil `testflight` usa el environment de producción para leer la clave, pero fuerza anuncios de prueba. No usar el perfil `production` para validar anuncios: permanece `off`.

Prueba manual en un dispositivo controlado:

1. confirmar que el log indica Appodeal 4.3.0 y testing activo;
2. elegir menor de 18 y verificar que no se carga ningún SDK/anuncio;
3. elegir adulto, completar CMP y ATT;
4. generar una sola impresión test de cada formato, sin clicar anuncios;
5. verificar callbacks y placements en logs/dashboard;
6. reabrir las opciones Appodeal desde Perfil > Ajustes > Privacidad y anuncios;
7. cerrar la app.

No automatizar impresiones ni clics y no usar demanda real en QA.

## Dashboard y acciones externas pendientes

1. Registrar iOS con bundle `com.polinss3.culturalgeneral` y guardar su App Key en EAS.
2. Registrar Android por separado con package `com.polinss3.culturalgeneral`; no reutilizar la clave iOS.
3. Crear/habilitar los nueve placements de la tabla.
4. Configurar Stack Consent Manager para GDPR/TCF y normativas estatales de EE. UU.
5. Habilitar solo las redes realmente incluidas en el binario.
6. Desactivar cualquier reenvío ILRD automático a AppsFlyer que duplique el callback.
7. Obtener del dashboard la lista exacta de `app-ads.txt`, guardarla en `APPODEAL_APP_ADS_TXT` o `website/src/app-ads.txt`, desplegar y verificar por HTTPS.
8. Actualizar App Privacy/Data Safety y las notas de revisión según el binario final.
9. Marcar “SDK implemented” y formatos solo después de las pruebas manuales reales.

## Condiciones antes de `live`

- términos y políticas revisados ese día;
- app, formatos y placements aprobados/configurados;
- CMP y Privacy Entry Point probados por región;
- App Privacy/Data Safety y políticas web sincronizadas;
- `app-ads.txt` literal desplegado y validado;
- Appodeal reconoce SDK 4.3.0 y los formatos mediante impresiones test manuales;
- listas de atribución comparadas con los endpoints oficiales;
- typecheck, tests, Expo Doctor, prebuild, Pods y compilación física en verde;
- cero integración directa del proveedor anterior y cero ILRD duplicado;
- autorización explícita del propietario para cambiar producción a `live`.

Si una condición falla, mantener `EXPO_PUBLIC_ADS_MODE=off` o `test`.
