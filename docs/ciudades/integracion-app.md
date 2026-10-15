# Ciudades dentro de la app

El modo está integrado en **Retos → Ciudades**, junto a Banderas y Años, en `codex/ciudades`. La pregunta siempre es una imagen fija del diorama con aspecto 3D; las cuatro opciones son nombres. Se conserva la escala y la calibración del visor sobre un lienzo cuadrado virtual; la tarjeta jugable recorta únicamente el fondo vacío superior e inferior. El encuadre y la altura de tarjeta se fijan para toda la ronda, sin reducir edificios ni la base. La incorporación a la versión distribuida requiere una primera actualización de la app; las altas, correcciones, traducciones y retiradas posteriores de contenido no requieren build ni EAS Update.

## Contenido remoto

- Tabla `public.city_catalog`, migración `20261015120000_city_catalog.sql`.
- Imágenes en el bucket público `city-dioramas`. Los objetos tienen una URL por versión (hash del WebP) y se conservan los anteriores.
- Lectura pública de filas con `is_published=true`, también como invitado. Sin permisos de escritura para `anon` ni `authenticated`. La herramienta de publicación usa credenciales de operador fuera de la app.
- Una fila con imagen y encuadre puede ser pregunta; una fila sin ambos puede ser alternativa. Una ciudad no entra como pregunta hasta tener tres alternativas arquitectónicas distintas.
- La app consulta de nuevo al abrir Ciudades, al volver al selector o con **Actualizar ciudades**. Pagina el catálogo; no queda limitada a las primeras 1.000 filas. Una ronda ya iniciada conserva una instantánea.
- Guarda el catálogo en AsyncStorage. Expo Image conserva imágenes descargadas en disco y memoria; sin conexión solo se pueden ver las que sigan en esa caché. En primera instalación hace falta conexión. Una imagen fallida muestra reintento y mantiene las respuestas bloqueadas.

## Incorporar ciudades desde este repositorio

1. El chat de producción añade la imagen, la entrada en `catalogo-propuesto.json` y el perfil en `constants/cityDioramaFraming.json`, siguiendo `AGENTS.md` y regenerando los visores.
2. Añadir su grupo de arquitectura y, cuando convenga, tres o más ciudades similares en `data/city-architecture.json`. Completar los nombres ES/EN en el catálogo o en `overrides.name`. La dificultad (1–3) mide reconocimiento del diorama.
3. Validar sin escribir:

   ```sh
   npm run cities:publish
   ```

4. Publicar:

   ```sh
   npm run cities:publish -- --publish
   ```

   Requiere Python con Pillow y Supabase CLI autenticada en el proyecto vinculado. Alternativamente, proporcionar `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` al proceso de operador. Nunca usar la clave de servicio en una variable `EXPO_PUBLIC_*`.

El publicador optimiza a WebP de hasta 1024 × 1024, sin recortar ni cambiar proporciones, sube las imágenes, comprueba su disponibilidad y solo después actualiza las filas en una operación. Repetirlo es seguro; se reutilizan los objetos ya existentes. No borra ciudades remotas ajenas al catálogo local. Las imágenes sin metadatos de arquitectura se indican como pendientes y no se publican automáticamente. Publicar un concepto para probarlo en esta rama no equivale a aprobar su fidelidad arquitectónica para lanzamiento.

## Incorporar directamente desde Supabase o una herramienta externa

No es necesario editar código ni los JSON locales para que la app reconozca una nueva ciudad. Subir el recurso a Storage y crear una fila con este contrato:

```json
{
  "id": "nueva-ciudad",
  "name": { "es": "Nombre español", "en": "English name" },
  "continent": "europa",
  "difficulty": 2,
  "architecture_tags": ["iberian-historic"],
  "similar_city_ids": ["madrid", "lisboa", "sevilla"],
  "image_url": "https://<proyecto>.supabase.co/storage/v1/object/public/city-dioramas/<archivo>.webp",
  "framing": { "left": 0.05, "top": 0.18, "width": 0.88, "height": 0.88, "background": "#fef0d9" },
  "is_published": true
}
```

El encuadre debe medirse para la imagen concreta; los números del ejemplo no son una calibración universal. Los continentes admitidos son `europa`, `america`, `africa`, `asia` y `oceania`. Los ids similares deben corresponder a filas publicadas, que pueden tener `image_url` y `framing` a `null` si solo son alternativas.

Se priorizan las similitudes editoriales (en ambas direcciones), después los rasgos arquitectónicos compartidos y, para desempatar, el continente. Nunca se completa una pregunta con tres ciudades al azar sin parecido. Los nombres se deduplican en ambos idiomas. La dificultad o continente elegidos limitan las preguntas; las alternativas pueden provenir de otras zonas para mantener la dificultad visual.

Para retirar contenido, poner `is_published=false`; desaparece en la siguiente actualización correcta del catálogo. No se alteran partidas ya iniciadas ni la última copia de un dispositivo que permanece sin conexión. El publicador local vuelve a publicar sus filas cuando se ejecuta: mantener las retiradas editoriales fuera de esa entrada local o gestionar esas filas directamente en la base de datos.

## Comprobaciones

```sh
npm run test:cities
npm run typecheck
node scripts/check-i18n.mjs
node scripts/check-cities-live.mjs
```

La comprobación remota usa acceso anónimo y verifica el contrato, el acceso a todas las imágenes, las combinaciones de zona/dificultad y el rechazo de escritura anónima. Los récords son locales, separados por continente, dificultad y longitud de ronda. Las recompensas usan la fuente `cities`, con los mismos importes por acierto y límites diarios que Banderas y Años.

Revisión realizada en el navegador de la app a 390 × 844: selector, imagen remota, opciones, acierto, resultado, récord y vuelta al selector. También se ha comprobado la interfaz en inglés, la cancelación del avance al salir de la pestaña y un fallo de descarga de imagen seguido de un reintento correcto mediante un servidor temporal de prueba. La prueba nativa en iOS/Android y una ronda con sesión autenticada quedan pendientes; no se han generado ni enviado builds a las tiendas.


## Fluidez y espacio en la versión de pruebas

La cabecera de Banderas/Años/Ciudades pertenece a un único contenedor estable. Cambiar de modo no reemplaza su área segura ni sus tarjetas nativas, y los selectores desactivan el ajuste automático de márgenes del ScrollView. Se reserva el espacio de la barra flotante de iOS para que los últimos controles sigan siendo accesibles.

Ciudades prepara tres imágenes al mostrar el selector. Antes de iniciar una ronda prepara las dos primeras y solicita hasta cinco en total; al avanzar mantiene las cuatro siguientes en preparación. Una cola limita el trabajo a tres cargas simultáneas y conserva hasta ocho referencias de imágenes decodificadas, con un máximo de 1024 px. La caché de disco de Expo Image sigue disponible en iOS/Android. No se descargan las 235 imágenes de la colección al abrir la app.

La siguiente pregunta solo se muestra cuando están disponibles sus píxeles. Si la red es lenta, se conserva la ciudad respondida y se indica que se está preparando la siguiente; ante un error se ofrece reintento. Los cambios de opciones y de imagen se realizan juntos, sin fundidos, sin reiniciar la imagen a una tarjeta vacía y sin revelar nombres antes de responder. Salir cancela temporizadores y evita que una respuesta pendiente altere el nuevo modo.

Verificado: pruebas de deduplicación, concurrencia, reintento, caducidad y tamaño de caché; recorte seguro y escala preservada en los 235 perfiles; cabecera en la misma posición al cambiar entre los tres modos; ronda y cuatro opciones en navegador a tamaño de iPhone. La fluidez final y los márgenes de la barra nativa deben comprobarse en la siguiente build de TestFlight, especialmente alternando modos rápidamente y jugando con conexión lenta.

## Ampliación y catálogo completo (15 de octubre de 2026)

Publicados los **235 dioramas** terminados en `city_catalog`, con nombres ES/EN, encuadres vigentes y 75 grupos de similitud visual: Europa 94, América 53, África 23, Asia 53 y Oceanía 12. Los estados editoriales de los originales se conservan. La app instalada recibe este contenido al volver al selector o pulsar **Actualizar ciudades**, sin una nueva build. Las URL WebP siguen siendo inmutables y la ronda descarga solo sus siguientes imágenes.

La imagen de una pregunta abre `/city-preview`, una `formSheet` nativa de Expo Router. Incluye una X, indicador de arrastre y cierre nativo por gesto o toque en el fondo. Usa la misma referencia de Expo Image ya decodificada, sin descargar otra copia ni revelar el nombre. Se conserva la ronda al perder foco por esta hoja y se pausa el tiempo restante antes de avanzar; al cerrar continúa la misma pregunta o su avance pendiente. En web se ofrece una hoja equivalente con fondo pulsable y gesto de arrastre. El tamaño se adapta al ancho real de la hoja, también en iPad.

El selector solo dice «Reconoce la ciudad por sus monumentos.»; al responder desaparece el texto «Es [ciudad]». Ambos cambios incluyen inglés. Los avisos de red y reintentos siguen disponibles. El recuento de ciudades jugables se calcula una vez por catálogo y dificultad para evitar trabajo repetido al mostrar los cinco continentes.

Comprobados en navegador a 402 × 874: catálogo remoto completo, ronda de África, cierre por X, toque fuera y arrastre, conservación de pregunta y pausa del avance con una respuesta ya marcada. Capturas en `qa-app/catalogo-235-es.jpg` y `qa-app/ciudad-ampliada-es.jpg`. La presentación y los gestos nativos de la hoja requieren la siguiente build de TestFlight para verificarse en dispositivo; esta sesión no genera ni envía una build.

Comprobación remota final superada con acceso anónimo: 235 nombres bilingües y 235 dioramas jugables; las 235 imágenes devuelven WebP accesible, todos los originales terminados coinciden con sus nombres y encuadres publicados, todas las combinaciones de continente/dificultad generan rondas válidas y la escritura anónima sigue denegada. También se verifica que salir a Inicio tras responder cancela el avance pendiente y que volver a Retos conserva el selector de 235 ciudades.
