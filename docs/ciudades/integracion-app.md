# Ciudades dentro de la app

El modo está integrado en **Retos → Ciudades**, junto a Banderas y Años, en `codex/ciudades`. La pregunta siempre es una imagen fija del diorama con aspecto 3D; las cuatro opciones son nombres. Se conserva el marco cuadrado y la calibración del visor. La incorporación a la versión distribuida requiere una primera actualización de la app; las altas, correcciones, traducciones y retiradas posteriores de contenido no requieren build ni EAS Update.

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
