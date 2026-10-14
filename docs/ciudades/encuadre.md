# Registro común de las ciudades

La preferencia del usuario es conservar bases de contorno irregular. No hay que convertirlas en cuadrados perfectos. Se registra su presentación para que el tamaño y la posición no cambien al pasar de una pregunta a otra.

Las seis fuentes miden 1254 × 1254 px. Se detectó un desplazamiento de 13 px entre las líneas inferiores del piloto v1. Se han generado seis versiones v2 usando la base irregular como única referencia. Aun así, la generación dejó una diferencia de 19 px entre sus líneas inferiores; la presentación la compensa con una tarjeta cuadrada de tamaño fijo y:

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

Las coordenadas se vinculan a las versiones `normalizadas/*-v2.png`: si una imagen se regenera, hay que medirla de nuevo. Los nombres de ciudad de la vista de revisión no se mostrarán en la pregunta. El componente recibe una descripción accesible de los hitos, sin desvelar la respuesta.

Después de actualizar la calibración, ejecutar `node scripts/build-city-framing-preview.mjs` para sincronizar el comparador con la misma configuración que importa el componente nativo.

Verificación realizada: dimensiones de las seis fuentes, cálculo de extremos y anclaje, comprobación de TypeScript y comparador en navegador de escritorio y móvil. La tarjeta no cambia de tamaño al seleccionar las seis ciudades; funcionan la vista original/alineada y las guías, y no hay desbordamiento horizontal en móvil. Esta revisión del comparador no sustituye la prueba del componente en un dispositivo iOS/Android durante la futura integración del modo.

Los PNG originales se conservan. Las posiciones son porcentajes y se mantienen al cambiar el tamaño de la pantalla. El modo jugable sigue pendiente de integración; esta rama ya proporciona el marco que deberá utilizar para todas sus preguntas.
