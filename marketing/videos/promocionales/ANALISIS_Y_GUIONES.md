# Vídeos promocionales — análisis y guiones

## Formato de campaña

- Formato: vertical 9:16, 1080 × 1920, 30 fps.
- Códecs: H.264 + AAC, `faststart`, compatibles con Reels, TikTok, Stories y Shorts.
- Diseño: gameplay centrado, fondo desenfocado, titulares de lectura inmediata y tarjeta final de descarga.
- Audio: banda electrónica original generada de forma procedural, sin material musical de terceros.

## Selección del material

### `14-17-27`

Muestra el lanzamiento y la pantalla de inicio, pero termina en un error al reclamar el cofre y varios estados de carga. No se usa en las piezas finales.

### `14-18-17`

Contiene la Pregunta del día, una respuesta con explicación, resultado/posición y navegación hacia Arena y Aprender. Se descartan el centro de control inicial, el error de conexión y los estados de carga. Se aprovechan las preguntas de `00:06–00:13`.

### `14-18-49`

Es el clip más completo para el modo Aprender: selector de categorías (`00:00–00:03`), preguntas y XP (`00:03–00:14`) y respuesta con contexto educativo (`00:14–00:20.5`).

### `14-19-24`

Recorrido limpio por los cuatro modos multijugador local: Pasa el móvil, Marcador, Duelo 1vs1, Superviviente y Trivia Night. Se usa completo.

### `14-19-51`

Navegación de Arena a la liga Oro, mostrando posición #1, ascenso a Diamante y premios. Se usa completo.

### `14-20-10`

Incluye ruta diaria completada y recompensa (`00:00–00:03`), Arena, modos, misiones (`00:04–00:11`) y tienda/recompensas (`00:11–00:19`). Es la base de las piezas de hábitos y progresión.

## Piezas exportadas

1. `01_reto_diario.mp4` — hábito diario, pregunta compartida y racha.
2. `02_modo_aprendizaje.mp4` — elegir tema, responder, ganar XP y aprender con contexto.
3. `03_ligas_y_ranking.mp4` — competición semanal, divisiones y clasificación.
4. `04_compite_con_amigos.mp4` — variedad de modos multijugador local.
5. `05_misiones_y_recompensas.mp4` — ruta diaria, monedas, misiones y personalización.
6. `06_descarga_general.mp4` — montaje general de aprendizaje, reto, ligas y amigos con CTA de descarga.

## Reconstrucción

Ejecutar:

```bash
./marketing/videos/promocionales/build_promos.sh
```

El script vuelve a generar las seis piezas a partir de los vídeos y creatividades fuente.

## Campaña V2 — ritmo alterno

La segunda versión responde a una estructura más publicitaria:

1. Creatividad estática con frase de fuerza.
2. Dos clips de acción muy cortos y sin rótulos superpuestos.
3. Segunda creatividad estática como cambio de ritmo.
4. Dos clips breves: respuesta, clasificación o recompensa.
5. Tarjeta final con llamada a la descarga.

Las piezas V2 se encuentran en `promocionales/v2` y se reconstruyen con:

```bash
./marketing/videos/promocionales/build_promos_v2.sh
```
