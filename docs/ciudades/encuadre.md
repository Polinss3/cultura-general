# Registro común de las ciudades

La preferencia del usuario es conservar bases de contorno irregular. No hay que convertirlas en cuadrados perfectos. Se registra su presentación para que el tamaño y la posición no cambien al pasar de una pregunta a otra.

El visor contiene las fuentes vigentes de 1254 × 1254 px registradas en la calibración. El recuento actual y la cola de producción aparecen en el catálogo. Madrid v3 conserva los edificios aprobados mediante composición sobre la base común. Las líneas inferiores medidas de cada fuente están en `mediciones-encuadre.json`; el registro compensa sus pequeñas diferencias. La presentación utiliza una tarjeta cuadrada de tamaño fijo y:

- Centro horizontal de la base: 50 % del ancho de la tarjeta.
- Anchura visible del diorama: 84 %; márgenes laterales: 8 %.
- Línea inferior de la base: 92 % del alto; margen inferior: 8 %.
- Escala uniforme en ambos ejes, calculada a partir del ancho medido de cada base, sin deformar edificios o monumentos.
- Corrección horizontal y vertical individual según los extremos y el anclaje medidos en cada PNG. Todas las bases y monumentos quedan dentro de la tarjeta, incluidas las agujas de Nueva York y Tokio. Solo puede quedar fuera parte del fondo vacío inferior de la fuente.

La altura de los edificios sigue siendo propia de cada ciudad: un Coliseo y una torre no deben tener artificialmente la misma altura. Todos caben en el mismo marco, con la base en la misma posición. Las nuevas bases comparten la referencia de contorno, perspectiva y grosor. La generación no garantiza geometría idéntica al píxel: el registro fija numéricamente el ancho, centro y línea inferior; los anclajes de las fuentes tienen una tolerancia de medición aproximada de 2 px, inferior a 1 px en una tarjeta de 360 px. No se estiran los edificios para compensar variaciones del dibujo.

## Archivos

- `constants/cityDioramaFraming.json`: única calibración para todas las fuentes y el marco común.
- `components/city-diorama.tsx`: componente Expo preparado para mostrar los recursos con esa calibración. El padre define el ancho de la tarjeta; el alto permanece igual al ancho y no depende de la ciudad. No recalcula el tamaño a partir de la altura del monumento ni usa transiciones entre preguntas. Las fuentes RGBA se muestran sobre el fondo de la pantalla, sin tarjeta coloreada ni fundidos añadidos; se usa `react-native-svg`, ya incluido en la app, sin añadir dependencias.
- [Comparador visual](encuadre.html): selección de ciudad, vista original/alineada, guías de centro y base, y todas las ciudades con imagen juntas. No modifica los PNG y no necesita un servidor para abrirse.

Las coordenadas se vinculan a las versiones indicadas en `constants/cityDioramaFraming.json`: si una imagen se regenera, hay que medirla de nuevo. Los nombres de ciudad de la vista de revisión no se mostrarán en la pregunta. El componente recibe una descripción accesible de los hitos, sin desvelar la respuesta.

Después de actualizar la calibración, ejecutar `node scripts/build-city-framing-preview.mjs` para sincronizar el comparador con la misma configuración que importa el componente nativo.

Verificación de v2: dimensiones de las seis fuentes, cálculo de extremos y anclaje, TypeScript y comparador en navegador de escritorio y móvil; tarjeta estable, botones y guías funcionales, sin desbordamiento horizontal. Para Madrid v3 se han vuelto a comprobar las dimensiones, los anclajes numéricos de las seis fuentes, TypeScript, los píxeles preservados y la lámina `verificacion/ciudades-v3.png`. La recarga automática de la página local queda bloqueada por la política del navegador, por lo que esta revisión no confirma una nueva ejecución del comparador en navegador. Tampoco sustituye la prueba del componente en iOS/Android durante la futura integración del modo.

Los PNG originales se conservan. Las posiciones son porcentajes y se mantienen al cambiar el tamaño de la pantalla. La integración jugable se documenta en [Integración en la app](integracion-app.md); este registro proporciona el marco común de las preguntas.

## Corrección de Madrid

La base de Madrid v2 tenía distinta profundidad. En v3 se utiliza `base-comun-v2.png` como capa inferior y una máscara de recorte del Madrid aprobado como capa superior. La ciudad se traslada 20 px hacia abajo en la fuente, sin cambiar su escala ni regenerar edificios; la nueva calibración compensa prácticamente ese traslado en pantalla. El suavizado se limita al perímetro y al pavimento exterior. El contorno exterior y la pared del soporte proceden de la plantilla común.

Se conservan v2, la máscara editable y `scripts/compose-madrid-base.py` (requiere Pillow). El script verifica que cinco regiones interiores de los hitos mantienen exactamente sus píxeles. La [comparativa de Madrid](revision-madrid/index.html) muestra antes, después y Barcelona como referencia.

## Primera ampliación

Venecia, Ámsterdam, Londres y Berlín añaden cuatro fuentes `normalizadas/*-v1.png`, ya registradas en la calibración y en el visor. Se revisaron las diez imágenes y sus anclajes numéricos (8 %, 92 %, 92 %), con tolerancia de unos 2 px en la medición de bordes. Láminas de revisión: `verificacion/ampliacion-01.png` y `verificacion/ciudades-v4.png`. Las pruebas de scripts comprueban también el selector, la cuadrícula, los enlaces por ciudad y los filtros del catálogo sin acceder al navegador del usuario. Los nuevos conceptos requieren revisión editorial.

## Segunda ampliación · tanda 3

Dublín, Edimburgo, Moscú y San Petersburgo añaden cuatro fuentes `normalizadas/*-v1.png`, con línea inferior en y=1041 y perfiles propios de bordes laterales. La primera variante de San Petersburgo se descartó porque añadía una plataforma exterior; la seleccionada mantiene cinco hitos sobre una sola base. Las catorce imágenes comparten los anclajes del marco. Láminas: `verificacion/ampliacion-02.png` y `verificacion/ciudades-v5.png`. Las nuevas imágenes siguen pendientes de revisión editorial; su presencia en el visor no implica publicación en el catálogo remoto.

## Transparencia y visor ampliado · 16 de octubre de 2026

Las 250 fuentes vigentes están en `transparentes/*-v1.png`, con alfa real y el
mismo lienzo de 1254 × 1254 px. `opaqueSource` conserva la ruta del PNG opaco en
cada perfil. No se han regenerado edificios: los RGB de los píxeles conservados
son exactamente los de la fuente. El contorno exterior cerrado se obtiene con
OpenCV a resolución original; solo se suaviza la cobertura de su borde.

Para reproducirlo: instalar Pillow, numpy y opencv-python-headless en un entorno
Python (`pip install -r scripts/city-cutout-requirements.txt`) y ejecutar
`python scripts/cutout-city-backgrounds.py --apply`, seguido de
`node scripts/build-city-framing-preview.mjs`. El script no sobrescribe imágenes
distintas y solo actualiza el catálogo cuando pasan las comprobaciones de las
250. `verificacion/transparencia/manifest.json` registra fuentes, hashes y límites;
las diez láminas muestran cada ciudad sobre claro y oscuro. El comparador usa un
fondo de damero para hacer visible el alfa y mantiene la comparación con los
originales opacos.

El publicador conserva la resolución completa y el alfa en WebP, con URLs por
hash: las imágenes anteriores siguen disponibles. El color hexadecimal del
perfil permanece como metadato compatible con catálogos anteriores; los
componentes ya no lo pintan como fondo.

Al tocar una ciudad se abre un visor a pantalla completa con cabecera opaca y
botón Cerrar. Permite pellizcar (1–4×), doble toque (2,5×), arrastrar con límites,
botones de acercar/alejar y Ajustar. Usa la misma imagen ya decodificada y pausa
el avance de respuesta hasta cerrarse. La presentación nativa no tiene el gesto
de arrastre para cerrar de una hoja, para que no compita con explorar la imagen.
