# Registro común de las ciudades

La preferencia del usuario es conservar bases de contorno irregular. No hay que convertirlas en cuadrados perfectos. Se registra su presentación para que el tamaño y la posición no cambien al pasar de una pregunta a otra.

Las seis fuentes miden 1254 × 1254 px. Se detectó un desplazamiento de 13 px entre las líneas inferiores del piloto v1. Se han generado seis versiones v2 usando la base irregular como única referencia. La generación dejó una diferencia de 19 px entre sus líneas inferiores. Madrid v3 sustituye su soporte por la plantilla común mediante recorte y composición, conservando los edificios de v2. Las seis fuentes actuales terminan en y=1041. La presentación utiliza una tarjeta cuadrada de tamaño fijo y:

- Centro horizontal de la base: 50 % del ancho de la tarjeta.
- Anchura visible del diorama: 84 %; márgenes laterales: 8 %.
- Línea inferior de la base: 92 % del alto; margen inferior: 8 %.
- Escala uniforme en ambos ejes, calculada a partir del ancho medido de cada base, sin deformar edificios o monumentos.
- Corrección horizontal y vertical individual según los extremos y el anclaje medidos en cada PNG. Todas las bases y monumentos quedan dentro de la tarjeta, incluidas las agujas de Nueva York y Tokio. Solo puede quedar fuera parte del fondo vacío inferior de la fuente.

La altura de los edificios sigue siendo propia de cada ciudad: un Coliseo y una torre no deben tener artificialmente la misma altura. Todos caben en el mismo marco, con la base en la misma posición. Las nuevas bases comparten la referencia de contorno, perspectiva y grosor. La generación no garantiza geometría idéntica al píxel: el registro fija numéricamente el ancho, centro y línea inferior; los anclajes de las fuentes tienen una tolerancia de medición aproximada de 2 px, inferior a 1 px en una tarjeta de 360 px. No se estiran los edificios para compensar variaciones del dibujo.

## Archivos

- `constants/cityDioramaFraming.json`: única calibración para las seis fuentes y el marco común.
- `components/city-diorama.tsx`: componente Expo preparado para mostrar los recursos con esa calibración. El padre define el ancho de la tarjeta; el alto permanece igual al ancho y no depende de la ciudad. No recalcula el tamaño a partir de la altura del monumento ni usa transiciones entre preguntas. Un fundido del 2 % en los bordes vacíos del PNG integra el fondo sin tocar edificios o base; se usa `react-native-svg`, ya incluido en la app, sin añadir dependencias.
- [Comparador visual](encuadre.html): selección de ciudad, vista original/alineada, guías de centro y base, y las seis ciudades juntas. No modifica los PNG y no necesita un servidor para abrirse.

Las coordenadas se vinculan a `normalizadas/madrid-v3.png` y a las otras cinco versiones `normalizadas/*-v2.png`: si una imagen se regenera, hay que medirla de nuevo. Los nombres de ciudad de la vista de revisión no se mostrarán en la pregunta. El componente recibe una descripción accesible de los hitos, sin desvelar la respuesta.

Después de actualizar la calibración, ejecutar `node scripts/build-city-framing-preview.mjs` para sincronizar el comparador con la misma configuración que importa el componente nativo.

Verificación de v2: dimensiones de las seis fuentes, cálculo de extremos y anclaje, TypeScript y comparador en navegador de escritorio y móvil; tarjeta estable, botones y guías funcionales, sin desbordamiento horizontal. Para Madrid v3 se han vuelto a comprobar las dimensiones, los anclajes numéricos de las seis fuentes, TypeScript, los píxeles preservados y la lámina `verificacion/ciudades-v3.png`. La recarga automática de la página local queda bloqueada por la política del navegador, por lo que esta revisión no confirma una nueva ejecución del comparador en navegador. Tampoco sustituye la prueba del componente en iOS/Android durante la futura integración del modo.

Los PNG originales se conservan. Las posiciones son porcentajes y se mantienen al cambiar el tamaño de la pantalla. El modo jugable sigue pendiente de integración; esta rama ya proporciona el marco que deberá utilizar para todas sus preguntas.

## Corrección de Madrid

La base de Madrid v2 tenía distinta profundidad. En v3 se utiliza `base-comun-v2.png` como capa inferior y una máscara de recorte del Madrid aprobado como capa superior. La ciudad se traslada 20 px hacia abajo en la fuente, sin cambiar su escala ni regenerar edificios; la nueva calibración compensa prácticamente ese traslado en pantalla. El suavizado se limita al perímetro y al pavimento exterior. El contorno exterior y la pared del soporte proceden de la plantilla común.

Se conservan v2, la máscara editable y `scripts/compose-madrid-base.py` (requiere Pillow). El script verifica que cinco regiones interiores de los hitos mantienen exactamente sus píxeles. La [comparativa de Madrid](revision-madrid/index.html) muestra antes, después y Barcelona como referencia.
