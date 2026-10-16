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

## Publicar correcciones de ciudades existentes

Usar versiones nuevas de los PNG, conservar los anteriores y recalibrar sus perfiles. Para actualizar únicamente determinadas filas se puede filtrar la publicación; la validación de alternativas sigue usando todo el catálogo:

```sh
npm run cities:publish -- --cities=abu-dabi,sao-paulo,recife,montevideo,san-juan,santo-domingo,san-jose,la-valeta
npm run cities:publish -- --publish --cities=abu-dabi,sao-paulo,recife,montevideo,san-juan,santo-domingo,san-jose,la-valeta
```

La primera orden solo valida. Los ids desconocidos o una selección vacía se rechazan antes de subir archivos. Cada imagen corregida obtiene una nueva URL por hash, por lo que la caché de la versión anterior no sustituye la nueva. La app recoge las URLs al entrar o volver al selector, o al pulsar **Actualizar ciudades**. Las rondas en curso y los dispositivos sin conexión conservan su copia hasta una actualización correcta.

Las ocho correcciones v2 están documentadas en [Revisión editorial](revision-editorial.md), junto con sus fuentes, prompts y comparaciones. La publicación se verificó mediante lectura anónima y descarga de las ocho URLs nuevas: el hash de los bytes servidos coincide con la exportación WebP de cada v2 local, el encuadre coincide y las otras 227 filas permanecen sin cambios. El [registro de publicación](qa-app/correcciones-ocho-publicacion.json) conserva URLs, hashes y fecha de comprobación.

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

## Petra y Chichén Itzá (16 de octubre de 2026)

Publicados los dos nuevos dioramas, sus encuadres y nombres ES/EN: el catálogo contiene **237 destinos jugables**, incluidas tres ciudades históricas o yacimientos urbanos (Machu Picchu, Petra y Chichén Itzá). Los originales, los prompts y el encuadre común están actualizados. El [criterio editorial](criterio-ciudades-historicas.md) define esta ampliación y evita duplicar monumentos y sus ciudades como respuestas al mismo diorama.

Chichén Itzá y Machu Picchu pueden aparecer como alternativas entre sí. Se actualizaron los metadatos de Machu Picchu conservando su imagen y URL. La lectura anónima del catálogo publicado confirma los 237 destinos jugables, la relación de alternativas y que las otras 234 filas no cambiaron. Las imágenes descargadas de Petra y Chichén Itzá coinciden byte a byte con sus exportaciones locales; el [registro de publicación](qa-app/ciudades-historicas-publicacion.json) conserva las URLs y los hashes.

La app recibe esta ampliación al entrar o volver al selector, o al pulsar **Actualizar ciudades** con conexión. No requiere una nueva build; una ronda ya iniciada conserva su catálogo hasta terminar. Las comprobaciones locales de tipos, las 18 pruebas de Ciudades y el visor con sus 237 entradas han superado la validación. Los nuevos dioramas conservan su estado de concepto pendiente de revisión editorial.

## Pompeya, Teotihuacán, Tikal, Éfeso y Persépolis (16 de octubre de 2026)

Publicadas las cinco incorporaciones de las tandas 61 y 62: **242 destinos jugables**, con 234 ciudades actuales y ocho destinos históricos. Distribución: Europa 95, América 56, Asia 56, África 23 y Oceanía 12. Las nuevas entradas tienen nombres ES/EN y dificultad inicial 2; los grupos y alternativas curatoriales están documentados en el [criterio de ciudades históricas](criterio-ciudades-historicas.md).

Los cinco originales seleccionados están guardados en `normalizadas/`, con sus prompts y fuentes en `produccion/`. Se corrigió la profundidad de la base de Éfeso y se eligió una composición más compacta de Teotihuacán para conservar la plantilla común. Los perfiles registrados mantienen los límites horizontales del 8 % y 92 %, y el borde inferior al 92 %. El visor, el catálogo, las mediciones y las láminas de ambas tandas están actualizados. Se conserva el estado editorial de concepto pendiente de revisión.

La publicación se limitó a estas cinco filas. La comprobación con lectura anónima confirma 242 destinos jugables, las cinco imágenes servidas idénticas byte a byte a las exportaciones WebP locales y las **237 filas anteriores sin cambios**. La relación de alternativas entre Machu Picchu y Chichén Itzá sigue funcionando. El [registro de verificación](qa-app/ciudades-historicas-tandas-61-62.json) conserva URLs, hashes y fecha.

Superadas las 18 pruebas de Ciudades, la comprobación de tipos y la validación del visor con sus 242 entradas, selector, cuadrícula, controles y rutas de imágenes. La app instalada recibe el contenido al volver al selector o pulsar **Actualizar ciudades** con conexión, sin nueva build. Una ronda ya iniciada conserva su instantánea.

## Cierre de esta versión en 250 destinos

Publicadas las ocho incorporaciones finales: **Sintra, Bagan, San Miguel de Allende, Zanzíbar (Stone Town), Carcasona, Luang Prabang, Jiva y Lalibela**. El catálogo contiene 250 destinos jugables: Europa 97, América 57, Asia 59, África 25 y Oceanía 12. La publicación se limitó a estas ocho filas; las 242 anteriores permanecen sin cambios.

La lectura anónima y la descarga de los ocho WebP confirman nombres ES/EN, encuadres y hashes idénticos a las exportaciones locales. Todos los filtros de continente y dificultad generan rondas válidas y la relación entre Machu Picchu y Chichén Itzá sigue funcionando. El [registro de publicación](qa-app/catalogo-250-publicacion.json) contiene el resultado verificable.

Las tandas 63 y 64 están en el visor con las mediciones comunes y sus láminas de comprobación. Se retiraron las cúpulas inventadas del Old Fort de Stone Town. Lalibela utiliza cuatro excavaciones compactas para conservar la base y se corrigió la columnata de Medhane Alem. Los prompts de ImageGen integrada y las correcciones están guardados por destino en `produccion/`; el estado editorial de los recursos se conserva.

Por petición del usuario, no se producirán ni publicarán más destinos para esta versión. `releaseCatalog` fija el cierre en 250 y el generador del catálogo rechaza un cierre con un recuento distinto o imágenes pendientes. Las correcciones de los destinos existentes siguen autorizadas; la capacidad del catálogo remoto para futuras versiones se conserva. El [documento de cierre](cierre-catalogo-250.md) incluye los textos propuestos para promociones en español e inglés.

Superadas las 18 pruebas de Ciudades, la comprobación de tipos y la validación del visor con sus 250 entradas. La app recibe este contenido al volver al selector o pulsar **Actualizar ciudades** con conexión, sin nueva build; las rondas en curso conservan su catálogo.
