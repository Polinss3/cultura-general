# Página de producto en iOS 27: cabecera, búsqueda, páginas personalizadas y pruebas

> Octubre de 2026. Apple activó el 5 de octubre los **componentes creativos** (cabecera y
> resultados de búsqueda), la **Biblioteca de componentes** y la vista previa de la página.
> Solo se ven en iOS 27 / iPadOS 27 o posterior. Son opcionales y conviven con las capturas.

## Nuevo lote visual 2.4.0

El material actualizado está en `Capturas App Store/2.4.0/Creativos/`: 42 PNG, siete temas (incluida una variante adicional de Ciudades), dos formatos y tres mercados. Véase [el registro de producción](2.4.0/creativos.md). La generación es local y no cambia asignaciones, pruebas ni publicaciones en ASC. El material y los estados de 2.3.0 que siguen se conservan como referencia histórica.

## Material generado

Generador: `Capturas App Store/2.3.0/source` (fuera de git). Código en `src/app/Creative.tsx`.

```bash
node scripts/export.mjs --device header   # cabeceras 21:9, 3840 × 1646
node scripts/export.mjs --device search   # búsqueda 3:2, 3840 × 2560
```

Salida en `Capturas App Store/2.3.0/Creativos/{cabecera-3840x1646,busqueda-3840x2560}/{ES,EN}/`.
PNG RGB sin transparencia. Para revisar la zona segura: añade `&guides=1` a la URL de exportación.

| Formato | Tamaño | Zona segura (centrada) | Qué lleva |
|---|---|---|---|
| Cabecera | 3840 × 1646 (21:9) | 1646 × 661 | Una frase en la zona segura; móviles y fichas a los lados (pueden recortarse) |
| Búsqueda | 3840 × 2560 (3:2) | 2168 × 1030 | Icono, título, 3 fichas y dos móviles con la app real |

Reglas de Apple que cumplen: sin precios ni descuentos, sin URLs, sin ©, sin premios, sin logos de
otras plataformas, apto 4+, una idea por pieza y texto localizado.

## Estado (2026-10-17)

- Las 24 piezas, aprobadas el 2026-10-17. Cabecera y búsqueda `01-principal` **publicadas** en la 2.3.0
  (ES y EN) y puestas también en la 2.4.0 en preparación, para que no se pierdan al publicarla.
- Las 5 páginas personalizadas (02–06) y la prueba A/B, **enviadas a revisión** el 2026-10-17 en un
  solo envío. Todas se crearon copiando la página de la 2.3.0; en cada idioma, la captura de la página va
  primera y el resto en el orden de siempre (iPhone 6,5" e iPad 13"; los demás tamaños lo heredan).
- Prueba A/B: control = principal, A = cabecera Aventura, B = cabecera Pregunta del Día. Solo cambia la
  cabecera. 66 % del tráfico (un tercio por versión), ES y EN. Hay que **iniciarla** cuando Apple la apruebe.

### Palabras clave reales (las del campo de la 2.3.0, no las de `app-store-es.md`)

ES: trivia, preguntas, quiz, cultura, historia, geografía, banderas, juego, aprender, concurso, reto, diario, test.
EN: trivia, quiz, questions, general knowledge, history, geography, flags, brain, learn, daily, game, test.

| Página | ES | EN |
|---|---|---|
| Principal (sin asignar) | trivia, preguntas, quiz, cultura, juego | trivia, quiz, questions, general knowledge, game |
| 02 Aventura | reto | — |
| 03 Amigos | concurso | — |
| 04 Pregunta del Día | diario | daily |
| 05 Banderas y Años | banderas, geografía, historia | flags, geography, history |
| 06 Estudia | aprender, test | learn, test, brain |

## Las 6 páginas

> Las palabras clave de cada página que aparecen abajo eran el plan inicial; las que se usaron de verdad
> están en la tabla de arriba.

Las palabras clave de una página personalizada **solo pueden salir del campo de palabras clave de la
última versión aprobada**, y cada combinación debe ir a una sola página. Las que están en el campo
de la 2.3.0 se reparten así; la página principal se queda con `trivia, cultura general, preguntas, quiz`.

El orden de capturas usa los 10 PNG de la 2.3.0 (`ES/`, `EN/`, `iPad/`), solo cambia el orden.

### 01 · Página principal
- Cabecera ES «¿Cuánto sabes de verdad?» · EN «How much do you really know?»
- Búsqueda ES «Trivia diaria y 13 temas» · EN «Daily trivia, 13 topics»
- Capturas: las de siempre (1 → 10). Texto promocional: el de la 2.3.0.

### 02 · Aventura
- Cabecera «Tu gran Aventura» / «Your great Adventure» · Búsqueda «400 niveles, 20 capítulos»
- Capturas: 2, 1, 3, 5, 4, 8, 9, 6, 7, 10
- Palabras clave: ninguna del campo actual encaja → añadir `aventura` / `adventure` en la próxima versión.
- Promocional ES: Recorre 20 capítulos, supera a sus guardianes y reúne reliquias. Los dos primeros capítulos son gratis.
- Promocional EN: Travel through 20 chapters, beat their guardians and collect relics. The first two chapters are free.

### 03 · Jugar con amigos
- Cabecera «Juega con tus amigos» / «Play with your friends» · Búsqueda «5 modos para jugar en grupo»
- Capturas: 9, 4, 1, 3, 8, 2, 5, 6, 7, 10
- Palabras clave: ninguna encaja → añadir `amigos,fiesta,multijugador` / `friends,party,multiplayer`.
- Promocional ES: Pasa el Móvil, Marcador, Duelo 1vs1, Superviviente y Trivia Night: cinco modos para jugar en grupo con un solo móvil.
- Promocional EN: Pass the Phone, Scoreboard, 1v1 Duel, Survivor and Trivia Night: five ways to play together on one phone.
- Uso extra: enlace para compartir desde la propia app («invita a tus amigos») y para redes.

### 04 · Pregunta del Día
- Cabecera «Una pregunta. Todo el mundo.» / «One question. Everyone.» · Búsqueda «Una pregunta nueva cada día»
- Capturas: 4, 1, 9, 3, 2, 8, 5, 6, 7, 10
- Palabras clave: `diaria` / `daily`
- Promocional ES: Cada día, la misma pregunta para todo el mundo. Responde cuando quieras, mantén tu racha y sube en el ranking y en las ligas semanales.
- Promocional EN: Every day, the same question for everyone. Answer when you're ready, keep your streak and climb the rankings and weekly leagues.

### 05 · Banderas y Años
- Cabecera «196 banderas. ¿Cuántas sabes?» / «196 flags. How many?» · Búsqueda «Banderas y Años»
- Capturas: 8, 3, 4, 1, 2, 9, 5, 6, 7, 10
- Palabras clave: `banderas, paises, años, fechas, historia` / `flags, countries, years, dates, history`
- Promocional ES: 196 banderas de todos los continentes y 98 hechos históricos para adivinar el año. Partidas rápidas para entrenar la memoria.
- Promocional EN: 196 flags from every continent and 98 historical events to date. Quick rounds to sharpen your memory.

### 06 · Estudia jugando
- Cabecera «Aprende sin darte cuenta» / «Learn without noticing» · Búsqueda «Una explicación en cada fallo»
- Capturas: 3, 6, 7, 5, 1, 2, 4, 8, 9, 10
- Palabras clave: `aprender, ciencia` / `learn, science`
- Promocional ES: 2.000 preguntas gratis en 13 temas, con una explicación en cada fallo. Con PRO: Examen, Repaso inteligente y estadísticas.
- Promocional EN: 2,000 free questions across 13 topics, with an explanation for every miss. With PRO: Exam, Smart Review and stats.

## Orden de trabajo en App Store Connect

1. **Biblioteca de componentes** → subir las 24 piezas (6 cabeceras + 6 búsquedas × ES/EN) y
   enviarlas a revisión **por separado**, sin versión nueva (Apple las revisa contra la 2.3.0).
2. **Versión 2.3.0 → Información de la página del producto → Encabezado / Resultados de la búsqueda**:
   «Explorar componentes» → elegir `01-principal` en cada idioma. Revisar con **Vista previa**
   (iPhone, iPad, claro/oscuro, vertical/horizontal) antes de publicar.
3. **Páginas del producto personalizadas** → crear las 5 (02–06): capturas en su orden, cabecera
   y búsqueda de su número, texto promocional y palabras clave. Marcarlas como visibles.
4. **Optimización de la página del producto** → una prueba de cabecera en la página principal
   (ver abajo).
5. A los 14 días, mirar Análisis → Adquisición → Páginas del producto (cada página necesita al
   menos 5 primeras descargas para mostrar datos).

## Prueba de cabecera (PPO)

- Control: `01-principal` · Tratamiento A: cabecera `02-aventura` · Tratamiento B: `04-pregunta-del-dia`.
- Cambiar **solo la cabecera** (mismas capturas e icono) para saber qué movió la conversión.
- Con nuestro tráfico, si a las 2–3 semanas no hay confianza, quitar un tratamiento.

## Pendiente (siguientes pasos)

- **Vídeo de cabecera** 21:9 (5–30 s, 30/60 fps, en bucle y sin depender del audio).
- **Capturas de iPhone Duo**: el dispositivo sale el 23 de octubre; obligatorias desde abril de 2027.
- **Accesibilidad de la app** (etiquetas en ASC): rellenarla con lo que soporta la app.
- Palabras clave nuevas (`aventura`, `amigos`, `multijugador`…) en la próxima versión, para poder
  asignarlas a las páginas 02 y 03.
