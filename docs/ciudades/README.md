# Ciudades: catálogo visual e integración

## Alcance de esta versión

El usuario ha fijado el cierre en **250 destinos**, tras las tandas 63 y 64. No incorporar más destinos para esta versión; se mantiene el mantenimiento de imágenes, encuadres y metadatos. El [documento de cierre](cierre-catalogo-250.md) recoge las últimas incorporaciones, la verificación de publicación y los textos propuestos para promociones.

Decisión del usuario: imágenes fijas con aspecto 3D. La pregunta siempre es el diorama; las cuatro respuestas son nombres de ciudades actuales o antiguas, o de yacimientos urbanos autorizados, como Machu Picchu, Petra y Chichén Itzá. No invertir la dirección como hace Banderas.

Base: `origin/main`, commit `4cabf66be5062e1d0385237362584f7663d17e9c`, «Merge: versión 2.3.0 (build 113)». Rama de trabajo: `codex/ciudades`. El usuario identifica main con la última versión subida a la App Store; no se ha consultado App Store Connect para verificar su publicación.

## Resultado de la investigación

El piloto permitió fijar una dirección artística común y producir el catálogo integrado en Retos. La selección y revisión de los hitos, las correcciones de generación y el registro del encuadre se documentan por destino. La revisión visual y técnica no equivale a una aprobación de todos los detalles arquitectónicos. La [galería del piloto](galeria.md) conserva las primeras pruebas; el [encuadre común](encuadre.html) muestra la colección vigente.

Se han generado mediante la herramienta integrada de ImageGen:

- [Madrid](piloto/madrid-v1.png): oso y madroño, Real Casa de Correos en Sol, Cuatro Torres, Atocha y Puerta de Alcalá. La primera generación tenía cinco rascacielos; se corrigió a cuatro. La fidelidad de fachadas, coronaciones y monumentos sigue pendiente de revisión con referencias arquitectónicas.
- [Nueva York](piloto/nueva-york-v1.png): Estatua de la Libertad, Empire State, Chrysler, Central Park, puente de Brooklyn y Grand Central. Su base irregular fue adoptada después como dirección común y normalizada en v2.
- [Barcelona](piloto/barcelona-v1.png): Sagrada Familia, Park Güell, Casa Batlló, Torre Glòries y Arco de Triunfo.
- [Roma](piloto/roma-v1.png): Coliseo, Panteón, Fontana di Trevi, Foro Romano y Castel Sant'Angelo.
- [París](piloto/paris-v1.png): Torre Eiffel, Notre-Dame, Louvre, Arco de Triunfo y Sacré-Cœur.
- [Tokio](piloto/tokio-v1.png): Tokyo Tower, Skytree, Sensō-ji, Kaminarimon y cruce de Shibuya con tren elevado.

La primera ampliación añade [Venecia](normalizadas/venecia-v1.png), [Ámsterdam](normalizadas/amsterdam-v1.png), [Londres](normalizadas/londres-v1.png) y [Berlín](normalizadas/berlin-v1.png). Se han generado sobre la plantilla común; [prompts y decisiones](prompts-ampliacion-01.md).

La segunda ampliación incorpora [Dublín](normalizadas/dublin-v1.png), [Edimburgo](normalizadas/edimburgo-v1.png), [Moscú](normalizadas/moscu-v1.png) y [San Petersburgo](normalizadas/san-petersburgo-v1.png). [Prompts y corrección de San Petersburgo](prompts-ampliacion-02.md).

Son conceptos, no recursos aprobados para producción. Tampoco son modelos 3D editables. Sus proporciones y ubicaciones forman un collage reconocible, no un mapa exacto. La integración jugable en Retos y la publicación del catálogo remoto se documentan en [Integración en la app](integracion-app.md).

## Pauta artística común

1. Una sola base de **contorno orgánico irregular**, según la preferencia del usuario, con borde y material beige mate comunes. Usar `normalizadas/base-comun-v2.png` como única plantilla de suelo, perspectiva y grosor; los ríos y costas permanecen dentro de ese contorno. No convertirla en un cuadrado perfecto.
2. Imagen fuente cuadrada de 1254 × 1254 px y vista isométrica de tres cuartos. La presentación usa siempre una tarjeta cuadrada y el [registro común](encuadre.md): centro al 50 %, base con anchura del 84 %, márgenes laterales del 8 % y borde inferior al 92 % del alto. No cambiar el tamaño de la tarjeta según el skyline.
3. Piedra clara, ladrillo coral apagado, vidrio azul pizarra y vegetación verde salvia. Conservar los colores característicos de los hitos. Bordes suavizados, detalle arquitectónico suficiente para reconocerlos y acabado de maqueta.
4. Fondo marfil uniforme, luz suave desde arriba a la izquierda y sombras discretas. Una única estación y hora; sin clima, nieve, nubes ni efectos diferentes por ciudad.
5. Entre tres y cinco grupos de hitos principales; al menos dos deben identificarse sin ampliar la imagen. Eliminar edificios de relleno cuando compitan con los monumentos. Exagerar moderadamente el tamaño de esculturas pequeñas.
6. Nunca incluir nombres de ciudades, rótulos, letras, leyendas, logos ni marcas de agua. Tampoco banderas que conviertan el país en una pista innecesaria. Usar el mismo fondo en modos claro y oscuro inicialmente.

Los originales se conservan como referencia. Las versiones vigentes están en `normalizadas/`; el [comparador](encuadre.html) aplica las correcciones de escala y posición del componente `CityDiorama`. Madrid v3 conserva los edificios de v2 mediante recorte y composición sobre la plantilla común, con máscara editable y sin regeneración. La forma irregular está aceptada y no es un defecto. La publicación genera las exportaciones WebP optimizadas; el estado de revisión arquitectónica se conserva por recurso.

## Ciudades históricas

Se admiten antiguas ciudades y yacimientos urbanos como Petra y Chichén Itzá, además de Machu Picchu. El [criterio editorial](criterio-ciudades-historicas.md) recoge los límites y las alternativas. El [cierre de esta versión](cierre-catalogo-250.md) incluye las últimas tandas autorizadas.

## Producción por lotes

El [encuadre común](encuadre.html) es el visor de referencia del usuario. Debe actualizarse en cada alta o modificación de una ciudad, en el mismo cambio que sus imágenes y datos. Ejecutar `node scripts/build-city-framing-preview.mjs`: incorpora automáticamente al selector y a la cuadrícula todas las ciudades con perfil de encuadre, obtiene sus nombres del catálogo y comprueba que las imágenes existen. No mantener una lista manual de ciudades en el HTML. Si una ciudad aún no tiene imagen anterior, la vista original utiliza su fuente actual sin calibrar.

- Catálogo de ciudades actuales, ciudades antiguas y yacimientos urbanos reconocibles, cerrado en 250 destinos para esta versión. El recuento vigente se genera desde los datos del catálogo. [Listado completo](listado-ciudades.md) y [vista con filtros](catalogo.html).
- El [catálogo con filtros](catalogo.html) muestra el recuento vigente de imágenes, estados y próximas tandas. Todos los conceptos disponibles aparecen en el [encuadre común](encuadre.html).
- Las tandas autorizadas conservan prompts, referencias y mediciones; se incorporan al visor tras revisar su composición y mantienen su estado editorial. La autorización de ampliar este catálogo termina al alcanzar los 250 destinos.
- El orden y los estados se guardan en el catálogo. Las nuevas propuestas se reservan para otra versión y requieren una nueva petición del usuario.

Para cada ciudad: fijar 3–5 grupos de hitos y referencias → añadir la ciudad usando la plantilla irregular como única imagen de referencia → comprobar siluetas, número de elementos y ausencia de texto → medir extremos y anclaje de la base y registrar el perfil de presentación → revisar a tamaño de móvil y junto a las demás ciudades → exportar el recurso optimizado → marcarlo como aprobado. Los [prompts de v2](prompts-encuadre.md) y la [primera ampliación](prompts-ampliacion-01.md) documentan el procedimiento. Guardar versión, prompt, fuentes y estado editorial. La imagen de referencia del usuario guía el estilo; no debe redistribuirse como recurso del juego.

Las listas de hitos del manifiesto son candidatas editoriales, no contenido ya verificado. Aún hay que confirmar las referencias, las siluetas y los límites del municipio cuando un monumento cercano pueda inducir a error. Cada imagen debe representar una sola ciudad de manera inequívoca.

## Peso y coste

Los PNG maestros miden 1254 × 1254 px y se conservan en el repositorio. El publicador los exporta a WebP de hasta 1024 × 1024, con calidad 88 y método 6, sin recortar ni alterar proporciones. Las imágenes se sirven desde Storage con una URL por hash; los registros de publicación en `qa-app/` contienen los bytes medidos de cada incorporación. Los PNG maestros no se empaquetan como recursos finales de la app.

La app consulta el catálogo remoto, prepara imágenes para la ronda y limita la concurrencia y la caché decodificada; no descarga toda la colección al abrir el modo. El comportamiento de precarga, reintentos y uso sin conexión se documenta en [Integración en la app](integracion-app.md). La fluidez final en dispositivo mantiene su seguimiento en TestFlight; los dioramas no se generan durante la partida.

No se presupone una única generación por ciudad: los archivos de producción conservan los prompts y las correcciones necesarias. Las futuras ampliaciones quedan fuera del alcance cerrado de esta versión.

## Plan inicial de integración (histórico)

La siguiente propuesta corresponde al piloto. La implementación vigente, sus rutas, el catálogo remoto, los filtros y las verificaciones se describen en [Integración en la app](integracion-app.md).

La copia revisada usa Expo SDK 54 y ya incluye `expo-image`. No hace falta un visor 3D. Para conservar el diorama completo, usar una tarjeta cuadrada con `contentFit="contain"`; [documentación oficial de Expo Image para SDK 54](https://docs.expo.dev/versions/v54.0.0/sdk/image/) explica el ajuste y los formatos disponibles.

- `app/(tabs)/challenges.tsx`: añadir `cities` al tipo de modo, al selector, a la restauración del modo guardado y al parámetro de navegación; actualmente solo acepta `flags` y `years`.
- `components/games/CitiesGame.tsx`: reutilizar `RoundHud`, `OptionBtn` y `RoundResult`, siguiendo selector → ronda → resultado. Imagen siempre arriba; cuatro nombres debajo. Ajustar la altura en pantallas pequeñas para que no quede oculta ninguna respuesta.
- `constants/cities.ts`: catálogo aprobado con ID estable, nombres ES/EN, continente, dificultad, hitos y referencia estática al recurso local. El manifiesto editorial no entra directamente al juego.
- `lib/cities.ts`: ronda de hasta 10 ciudades sin repetición, cuatro IDs únicos por pregunta y exactamente una respuesta correcta. Preferir distractores plausibles por arquitectura o región; los distractores también deben ser ciudades. No copiar la alternancia `flagToName`/`nameToFlag` de `lib/flags.ts`.
- Récords propios: `city_records_v1`; no mezclar con Banderas o Años. Mantener reglas de invitado/offline, ruta diaria y cierre único de ronda.
- Revisar `lib/economy.ts`, `lib/gamification.ts`, `lib/ads.ts`, política de anuncios, puntos de entrada de Inicio y traducciones ES/EN para registrar el nuevo modo sin reutilizar identificadores de Banderas.

El plan inicial condicionaba los filtros a disponer de suficientes alternativas. La implementación actual calcula las preguntas jugables de cada filtro y genera rondas con cuatro nombres distintos; el contrato remoto se comprueba antes de cerrar la publicación.

## Criterios para pasar a implementación

1. Seis imágenes piloto aprobadas con base, márgenes, iluminación y escala coherentes; arquitectura revisada contra referencias.
2. Reconocimiento y lectura de opciones comprobados en una tarjeta real de móvil, en pantalla pequeña y con texto grande. La accesibilidad debe describir los elementos visibles sin revelar la ciudad; el nombre solo se anuncia después de responder.
3. Recursos finales optimizados con pesos medidos, sin nombres incrustados, y cuatro o más ciudades por filtro habilitado.
4. Al implementar: comprobar que todas las preguntas contienen imagen y cuatro nombres únicos, que el acierto aparece exactamente una vez, que no se repiten preguntas y que filtros insuficientes quedan deshabilitados. Verificar offline y que una ronda no concede dos recompensas ni dos anuncios.

Esta rama reúne el catálogo visual y la integración jugable documentada en [Integración en la app](integracion-app.md). La aprobación arquitectónica y la validación en iOS/Android tienen su propio seguimiento. La disponibilidad remota se acredita en los registros de publicación, además de la presencia de la imagen en el visor.

## Revisión editorial

La [hoja de revisión editorial](revision-editorial.md) reúne los puntos detectados durante la inspección visual y distingue composición revisada de fidelidad arquitectónica aprobada.

## Registro de nuevas tandas

`python3 scripts/register-city-dioramas.py /ruta/al/lote.json` registra únicamente imágenes ya revisadas visualmente para la galería. Conserva el prompt y las referencias por ciudad en `produccion/`, verifica dimensiones y anclajes, actualiza mediciones y regenera el visor y el listado. Requiere Pillow y Node. No sustituye la revisión editorial o la integración en el modo de juego.
