# Ciudades: viabilidad y piloto visual

Decisión del usuario: imágenes fijas con aspecto 3D. La pregunta siempre es el diorama; las cuatro respuestas siempre son nombres de ciudades. No invertir la dirección como hace Banderas.

Base: `origin/main`, commit `4cabf66be5062e1d0385237362584f7663d17e9c`, «Merge: versión 2.3.0 (build 113)». Rama de trabajo: `codex/ciudades`. El usuario identifica main con la última versión subida a la App Store; no se ha consultado App Store Connect para verificar su publicación.

## Resultado de la investigación

Es viable producir una colección amplia de imágenes de dioramas. Las seis muestras demuestran una dirección artística comparable; todavía no demuestran calidad editorial, legibilidad en dispositivos ni consistencia de un catálogo completo. La parte que más trabajo requiere es seleccionar y revisar los hitos de cada ciudad, corregir errores de generación y mantener la composición entre lotes. Se pueden comparar juntas en la [galería del piloto](galeria.md).

Se han generado mediante la herramienta integrada de ImageGen:

- [Madrid](piloto/madrid-v1.png): oso y madroño, Real Casa de Correos en Sol, Cuatro Torres, Atocha y Puerta de Alcalá. La primera generación tenía cinco rascacielos; se corrigió a cuatro. La fidelidad de fachadas, coronaciones y monumentos sigue pendiente de revisión con referencias arquitectónicas.
- [Nueva York](piloto/nueva-york-v1.png): Estatua de la Libertad, Empire State, Chrysler, Central Park, puente de Brooklyn y Grand Central. La base ha adquirido un contorno irregular junto al agua; debe volver a ser un cuadrado de esquinas redondeadas antes de aprobarla para el catálogo.
- [Barcelona](piloto/barcelona-v1.png): Sagrada Familia, Park Güell, Casa Batlló, Torre Glòries y Arco de Triunfo.
- [Roma](piloto/roma-v1.png): Coliseo, Panteón, Fontana di Trevi, Foro Romano y Castel Sant'Angelo.
- [París](piloto/paris-v1.png): Torre Eiffel, Notre-Dame, Louvre, Arco de Triunfo y Sacré-Cœur.
- [Tokio](piloto/tokio-v1.png): Tokyo Tower, Skytree, Sensō-ji, Kaminarimon y cruce de Shibuya con tren elevado.

Son conceptos, no recursos aprobados para producción. Tampoco son modelos 3D editables. Sus proporciones y ubicaciones forman un collage reconocible, no un mapa exacto. No se han conectado a las pantallas del juego.

## Pauta artística común

1. Una sola base de **contorno orgánico irregular**, según la preferencia del usuario, con borde y material beige mate comunes. Usar `normalizadas/base-comun-v2.png` como única plantilla de suelo, perspectiva y grosor; los ríos y costas permanecen dentro de ese contorno. No convertirla en un cuadrado perfecto.
2. Imagen fuente cuadrada de 1254 × 1254 px y vista isométrica de tres cuartos. La presentación usa siempre una tarjeta cuadrada y el [registro común](encuadre.md): centro al 50 %, base con anchura del 84 %, márgenes laterales del 8 % y borde inferior al 92 % del alto. No cambiar el tamaño de la tarjeta según el skyline.
3. Piedra clara, ladrillo coral apagado, vidrio azul pizarra y vegetación verde salvia. Conservar los colores característicos de los hitos. Bordes suavizados, detalle arquitectónico suficiente para reconocerlos y acabado de maqueta.
4. Fondo marfil uniforme, luz suave desde arriba a la izquierda y sombras discretas. Una única estación y hora; sin clima, nieve, nubes ni efectos diferentes por ciudad.
5. Entre cuatro y seis hitos principales; al menos dos deben identificarse sin ampliar la imagen. Eliminar edificios de relleno cuando compitan con los monumentos. Exagerar moderadamente el tamaño de esculturas pequeñas.
6. Nunca incluir nombres de ciudades, rótulos, letras, leyendas, logos ni marcas de agua. Tampoco banderas que conviertan el país en una pista innecesaria. Usar el mismo fondo en modos claro y oscuro inicialmente.

Los originales v1 se conservan como referencia. Las versiones v2 están en `normalizadas/` y se han generado sobre la misma plantilla irregular; el [comparador](encuadre.html) aplica las correcciones de escala y posición que usará el componente `CityDiorama`. La forma irregular está aceptada y no es un defecto. La revisión arquitectónica y las exportaciones optimizadas siguen pendientes.

## Producción por lotes

- Piloto artístico: Madrid, Nueva York, Barcelona, Roma, París y Tokio. Las seis tienen concepto generado, pendiente de revisión editorial y ajuste de encuadre. Son casos distintos de skyline, escultura, arquitectura histórica y parques.
- Primer catálogo jugable: 24 ciudades de los cinco continentes, a partir de las candidatas de `catalogo-propuesto.json`. No seleccionar por cantidad: aceptar solo imágenes reconocibles y revisadas.
- Ampliación: 48 candidatas en el manifiesto inicial; después 100 o más si cada nueva ciudad aporta hitos distintivos. No generar todo antes de estabilizar el piloto.

Para cada ciudad: fijar 4–6 hitos y referencias → añadir la ciudad usando la plantilla irregular como única imagen de referencia → comprobar siluetas, número de elementos y ausencia de texto → medir extremos y anclaje de la base y registrar el perfil de presentación → revisar a tamaño de móvil y junto a las demás ciudades → exportar el recurso optimizado → marcarlo como aprobado. Los [prompts de v2](prompts-encuadre.md) documentan el procedimiento. Guardar versión, prompt, fuentes y estado editorial. La imagen de referencia del usuario guía el estilo; no debe redistribuirse como recurso del juego.

Las listas de hitos del manifiesto son candidatas editoriales, no contenido ya verificado. Aún hay que confirmar las referencias, las siluetas y los límites del municipio cuando un monumento cercano pueda inducir a error. Cada imagen debe representar una sola ciudad de manera inequívoca.

## Peso y coste

Los originales del piloto miden 1254 × 1254 px: Madrid pesa 2.270.022 bytes y Nueva York 2.412.721 bytes. Conservarlos como archivos maestros. Para el juego, medir exportaciones de 768 y 1024 px y comparar WebP/JPEG en dispositivos. Objetivo inicial de peso: 150–350 KB por ciudad, sujeto a la calidad visual; no es una medición de exportaciones de estas muestras. Con ese objetivo, 24 imágenes sumarían 3,6–8,4 MB y 100 sumarían 15–35 MB. Los PNG maestros no deben empaquetarse como recursos finales de la app.

No se ha medido el consumo de memoria, el tiempo de carga ni el peso de una compilación. Cargar únicamente la pregunta actual y, como máximo, preparar la siguiente. No generar imágenes durante la partida. Para el primer catálogo, empaquetar los recursos facilita el juego offline como Banderas y Años; evaluar descargas de paquetes solo si el peso medido de futuras ampliaciones lo justifica.

No hay una estimación económica o de calendario fiable mientras el piloto siga sin aprobar. Registrar tiempo de revisión, número de generaciones/correcciones y bytes finales del lote de seis; usar esos datos para presupuestar 24, 48 y 100 ciudades. Madrid ya requirió una corrección, por lo que no debe suponerse una generación final por ciudad.

## Encaje con la app existente

La copia revisada usa Expo SDK 54 y ya incluye `expo-image`. No hace falta un visor 3D. Para conservar el diorama completo, usar una tarjeta cuadrada con `contentFit="contain"`; [documentación oficial de Expo Image para SDK 54](https://docs.expo.dev/versions/v54.0.0/sdk/image/) explica el ajuste y los formatos disponibles.

- `app/(tabs)/challenges.tsx`: añadir `cities` al tipo de modo, al selector, a la restauración del modo guardado y al parámetro de navegación; actualmente solo acepta `flags` y `years`.
- `components/games/CitiesGame.tsx`: reutilizar `RoundHud`, `OptionBtn` y `RoundResult`, siguiendo selector → ronda → resultado. Imagen siempre arriba; cuatro nombres debajo. Ajustar la altura en pantallas pequeñas para que no quede oculta ninguna respuesta.
- `constants/cities.ts`: catálogo aprobado con ID estable, nombres ES/EN, continente, dificultad, hitos y referencia estática al recurso local. El manifiesto editorial no entra directamente al juego.
- `lib/cities.ts`: ronda de hasta 10 ciudades sin repetición, cuatro IDs únicos por pregunta y exactamente una respuesta correcta. Preferir distractores plausibles por arquitectura o región; los distractores también deben ser ciudades. No copiar la alternancia `flagToName`/`nameToFlag` de `lib/flags.ts`.
- Récords propios: `city_records_v1`; no mezclar con Banderas o Años. Mantener reglas de invitado/offline, ruta diaria y cierre único de ronda.
- Revisar `lib/economy.ts`, `lib/gamification.ts`, `lib/ads.ts`, política de anuncios, puntos de entrada de Inicio y traducciones ES/EN para registrar el nuevo modo sin reutilizar identificadores de Banderas.

No ofrecer filtros continentales o de dificultad hasta tener un mínimo de cuatro ciudades aprobadas en cada pool habilitado. Los seis conceptos siguen sin aprobar, por lo que no existe todavía un catálogo jugable validado.

## Criterios para pasar a implementación

1. Seis imágenes piloto aprobadas con base, márgenes, iluminación y escala coherentes; arquitectura revisada contra referencias.
2. Reconocimiento y lectura de opciones comprobados en una tarjeta real de móvil, en pantalla pequeña y con texto grande. La accesibilidad debe describir los elementos visibles sin revelar la ciudad; el nombre solo se anuncia después de responder.
3. Recursos finales optimizados con pesos medidos, sin nombres incrustados, y cuatro o más ciudades por filtro habilitado.
4. Al implementar: comprobar que todas las preguntas contienen imagen y cuatro nombres únicos, que el acierto aparece exactamente una vez, que no se repiten preguntas y que filtros insuficientes quedan deshabilitados. Verificar offline y que una ronda no concede dos recompensas ni dos anuncios.

Esta rama prepara la investigación y los recursos del piloto. La integración jugable, el resto de imágenes y las pruebas en iOS/Android están pendientes.
