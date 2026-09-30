# Material de tienda — versión 2.3.0

La app muestra «Cultura General» en español y «CG Trivia» en inglés. Los
textos de este directorio son borradores para App Store Connect y Google Play;
subir un binario con EAS no actualiza las fichas ni la declaración de privacidad.
El IPA local `build-testflight.ipa` contiene la versión 2.3.0 (110), generada el
28-09-2026 con el SDK de In-House Ads 1.1.4. Es una compilación local de
TestFlight; antes de App Review hay que probarla en dispositivo y generar la
compilación definitiva con el perfil `production` (`EXPO_PUBLIC_ADS_MODE=live`).

| Material | Archivos |
|---|---|
| App Store ES/EN | [app-store-es.md](app-store-es.md), [app-store-en.md](app-store-en.md) |
| Google Play ES/EN | [google-play-es.md](google-play-es.md), [google-play-en.md](google-play-en.md) |
| Novedades y notas de revisión | [release-2.3.0.md](release-2.3.0.md), [app-review-notes.md](app-review-notes.md) |
| Política publicada | `https://cg-trivia.pablobrasero.com/privacy` y `/en/privacy` |

## Privacidad que debe revisarse antes de enviar la 2.3.0

La 2.3.0 introduce notificaciones remotas. Con permiso, el servidor guarda un
token de Expo asociado a la cuenta, más plataforma, idioma, zona horaria y
versión de la app. Expo retransmite los avisos a Apple o Google. Es un cambio
respecto al texto anterior que describía las notificaciones como solo locales.
La política de `website/build.mjs` y la política dentro de la app ya se han
corregido; publicar la web y revisar **App Privacy** en App Store Connect antes
de enviar la versión a revisión. El token es un identificador del dispositivo
usado para la funcionalidad de la app, no para seguimiento publicitario. La
categoría concreta de Apple y su estado publicado se deben confirmar en la
ficha antes de cambiarla. La 2.2.0 publicada debe seguir descrita con sus
prácticas reales hasta que la 2.3.0 esté disponible.

La elección de edad para anuncios se guarda en el dispositivo. Si el usuario
es elegible, una solicitud al servicio publicitario propio envía un indicador
de mayoría de edad, idioma, plataforma, versión y un identificador temporal de
sesión. La política anterior decía que nada de esto salía del dispositivo.

## Capturas

Las capturas de `Capturas App Store/2.2.0/` son de una interfaz anterior y no
sirven como set definitivo para la 2.3.0. Hay 36 capturas reales y verificadas
de la nueva app, en español e inglés, para iPhone de 6,9 y 6,3 pulgadas e iPad
de 13 pulgadas. El set de 6,9 pulgadas y el de iPad cubren los tamaños
requeridos por Apple; el de 6,3 pulgadas es adicional. Los PNG son RGB sin
alfa, de tamaño nativo y sin datos personales. Las de iPad muestran el menú
inferior y la decoración de los márgenes. No reutilizar la composición de la
2.2.0 que superpone una barra de pestañas antigua sobre la pantalla.

Material previo: [README de capturas 2.2.0](../Capturas%20App%20Store/2.2.0/README.md).
Preparación actual: [capturas 2.3.0](../Capturas%20App%20Store/2.3.0/README.md).

## Antes de publicar

- [x] Borradores ES/EN de las fichas actualizados a 2.3.0.
- [x] Política web y política incluida en la app alineadas con notificaciones y anuncios propios.
- [x] Publicar la web actualizada y verificar los dos idiomas en el dominio (28-09-2026).
- [x] Generar una compilación local con los cambios y el SDK In-House Ads 1.1.4: 2.3.0 (110).
- [ ] Probar la 110 en dispositivo físico y generar/subir la compilación definitiva con el perfil `production`.
- [ ] Confirmar campañas reales en In-House Ads; el inventario documentado sigue siendo de prueba.
- [ ] Activar los tres cosméticos PRO nuevos en `shop_items` al publicar la 2.3.0 (la migración los crea ocultos para proteger a los clientes 2.2.0).
- [ ] Revisar y actualizar App Privacy en App Store Connect para la 2.3.0.
- [x] Crear y revisar visualmente el nuevo set de capturas de iPhone y iPad en ES/EN.
- [ ] Cargar los textos y las capturas en las consolas correspondientes (lo hará el propietario).
- [ ] Comprobar que el número de build de la nota de revisión es el de la compilación elegida.
