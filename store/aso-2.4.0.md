# Cultura General 2.4.0 — análisis y plan de ASO

Fecha de auditoría: 16 de octubre de 2026. Objetivo: aumentar descubrimiento y primeras descargas en App Store, conservando «Cultura General» en español. Preparación local; no se han cambiado los metadatos publicados.

## Diagnóstico con datos actuales

Lectura directa de App Store Connect, mismo periodo para ambas apps: **17 de septiembre–14 de octubre de 2026, 28 días**. El 14 era el último día disponible en el selector. ASC informa días en UTC. Todos los territorios y dispositivos, sin filtro de fuente; el desglose siguiente separa los canales. No se ha confirmado si hubo Apple Ads: «Búsqueda» no debe etiquetarse como exclusivamente orgánica hasta comprobarlo. [Datos de referencia guardados](2.4.0/baseline-asc-2026-10-16.json).

| Indicador | Cultura General | 101 Juegos |
|---|---:|---:|
| Impresiones totales en 28 días | 3.798 | 8.371 |
| Impresiones/día, media de 28 días | 135,6 | 299,0 |
| Impresiones/día, últimos 7 disponibles (8–14 oct.) | 128,1 | 454,0 |
| Impresiones de búsqueda | 3.279 | 8.183 |
| Primeras descargas de búsqueda | 99 | 53 |
| Conversión de búsqueda mostrada por ASC, promedio diario | 4,48 % | 0,78 % |
| Primeras descargas totales | 234 | 67 |

El recuerdo de 500–600 impresiones de 101 Juegos se aproxima a algunos días recientes: 527 el 12 de octubre y 534 el 11. Su promedio de la última semana es 454, bastante mayor que el promedio de 28 días. No es correcto presentar 500–600 como su media de todo el periodo.

### El tráfico de Cultura General tiene dos comportamientos muy distintos

| Fuente | Impresiones totales | Primeras descargas | Conversión de ASC, promedio diario |
|---|---:|---:|---:|
| Búsqueda en App Store | 3.279 | 99 | 4,48 % |
| Navegación en App Store | 321 | 18 | 13,44 % |
| Referencia de app | 186 | 111 | 73,89 % |
| Referencia de web | 12 | 6 | 60,00 % |

El **86,3 % de las impresiones** procede de búsqueda, pero las referencias de apps aportan el **47,4 % de las primeras descargas**. La búsqueda aporta el 42,3 % de las primeras descargas. Esto identifica dos prioridades: ampliar búsquedas relevantes y preservar el canal de referencias.

El desglose adicional «Referencia de app» identifica **ChatGPT: 179 impresiones y 109 primeras descargas**, frente a 186 y 111 en el agregado del canal. Por tanto, casi todas esas nuevas descargas están atribuidas por ASC a ChatGPT, **no a 101 Juegos**. La tabla no identifica todos los registros del agregado. Esto no permite saber qué conversación, recomendación o enlace originó cada descarga, ni demostrar que fueran recomendaciones espontáneas.

La conversión global no se puede trasladar al tráfico nuevo de búsquedas. Además, ASC calcula su conversión con descargas totales —incluidas redescargas— sobre impresiones de dispositivos únicos; en este informe la tabla muestra promedios diarios. No equivale a primeras descargas divididas por impresiones totales. La tabla de dispositivos únicos por fuente también mostraba **promedio diario**: búsqueda 86, navegación 7 y referencias de apps 6, no totales del periodo. [Definiciones de Apple](https://developer.apple.com/help/app-store-connect-analytics/reference/metrics-definitions).

### Territorios

Impresiones de todas las fuentes: España 1.574, México 538, Estados Unidos 390, Colombia 266 y Chile 159. Primeras descargas en esos territorios: 145, 12, 15, 5 y 15, respectivamente. España, México y Colombia suman el 62,6 % de las impresiones. Por volumen observado, priorizar español de España y Latinoamérica; mantener una segunda línea de trabajo en inglés para EE. UU. Los datos de país mezclan fuentes y no prueban por sí solos mejor ASO en España.

**ASC solo ofrece ES-ES y EN-US en las localizaciones publicadas de la 2.3.0.** ES-MX está preparado como incorporación para la 2.4.0; no existe todavía como localización independiente en el selector comprobado.

## Auditoría de la ficha

La ficha pública muestra:

| Mercado | Nombre | Subtítulo |
|---|---|---|
| España / México | Cultura General: Trivia | Preguntas y trivia cada día |
| Estados Unidos | CG Trivia: General Knowledge | Daily quiz & trivia challenge |

La versión pública consultada es 2.3.0. España muestra 4 valoraciones con 5,0; EE. UU. y México no muestran suficientes valoraciones para un resumen. Son observaciones por territorio, no una nota global. [España](https://apps.apple.com/es/app/cultura-general-trivia/id6766927114), [México](https://apps.apple.com/mx/app/cultura-general-trivia/id6766927114), [EE. UU.](https://apps.apple.com/us/app/cg-trivia-general-knowledge/id6766927114).

En ASC, el campo español publicado de la 2.3.0 es:

```text
trivia,preguntas,quiz,cultura,historia,geografía,banderas,juego,aprender,concurso,reto,diario,test
```

Repite palabras del título y subtítulo (`trivia`, `preguntas`, `cultura`) e incluye el genérico `juego`. `quiz` no está en el título público actual: la propuesta de 2.4.0 lo traslada al nombre y libera ese espacio. El valor exacto del campo no contiene una coma final: el primer volcado de accesibilidad añadía una coma al separar la propiedad siguiente. La mejora concreta es cubrir intenciones distintas con el espacio disponible, no llenar caracteres por llenar.

Keywords inglesas publicadas, también leídas directamente del campo de ASC:

```text
trivia,quiz,questions,general knowledge,history,geography,flags,brain,learn,daily,game,test
```

`trivia`, `quiz`, `general knowledge` y `daily` ya están en el nombre o subtítulo inglés actuales. Se puede aprovechar ese espacio para cubrir contenido adicional.

Apple identifica relevancia de título, subtítulo, keywords y categorías, además de señales de comportamiento. Recomienda evitar duplicados y términos excesivamente genéricos. No publica una fórmula que permita prometer una subida determinada. El texto promocional no cambia el ranking de búsqueda. [Búsqueda en App Store](https://developer.apple.com/app-store/search/).

### Lo que permite concluir la competencia

Las fichas de [Quible](https://apps.apple.com/es/app/quible-quiz-cultura-general/id6808972988) y [Trivia: Preguntas y Respuestas](https://apps.apple.com/es/app/trivia-preguntas-y-respuestas/id1313123448) usan términos como cultura general, preguntas, respuestas, banderas y capitales en sus textos visibles. Esto aporta vocabulario y confirma competencia semántica; **no demuestra volumen, dificultad ni rankings de esas keywords**. Las posiciones de Google tampoco son las posiciones de búsqueda en la App Store.

## Primera iteración de metadatos para la 2.4.0

Conservar como base los [snippets acordados](aso-conclusiones-chatgpt-2026-10-14.md), guardados exactamente en [JSON de referencia](2.4.0/metadata-aso.json). ES-ES y ES-MX comparten inicialmente la propuesta. EN-US conserva la propuesta inglesa. No se ha comprobado aún la disponibilidad de los nuevos nombres en ASC.

La recomendación es aplicar esa base como primera iteración medible, sin un cambio adicional de marca. Su mayor mejora frente a la ficha actual es introducir `quiz` en el nombre español y `banderas` en el subtítulo, y redistribuir el campo oculto. Si el territorio categoriza la app como Trivia, no se repite ese término en el campo de keywords. Mantenerlo en el nombre puede seguir ayudando a explicar el producto a las personas.

Las propuestas previas pierden términos hoy presentes (`diario`, `concurso`, `reto`) o previstos para páginas personalizadas (`años`, `fechas`, `daily`). No dar por hecho que eliminarlos carece de coste. `retos` queda en el subtítulo español; revisar la cobertura por intención y la selección real de keywords de las páginas personalizadas antes del envío.

**Variantes concretas, preparadas para decidir antes del envío, no aplicadas al JSON base:**

1. Español, modificación mínima: añadir `,años` a las keywords acordadas: **100 caracteres**. Conserva todo el conjunto original y da cabida a un modo real.
2. Inglés, modificación mínima: añadir `,daily`: **99 caracteres**. Conserva el hábito diario, que desaparecería del subtítulo propuesto.
3. Español, alternativa orientada a modos y hábito, **98 caracteres**:

```text
test,conocimiento,aprender,historia,geografia,ciencia,capitales,paises,amigos,diario,adivinar,años
```

La tercera sustituye `saber` y `educativo` por términos más ligados a funcionalidades. Es una hipótesis editorial de relevancia, no una prueba de mayor demanda. No se justifica reemplazar toda la lista otra vez a la semana del lanzamiento.

En inglés, `Fun` y `Challenges` son genéricos. Para una iteración posterior se puede probar **Daily Questions, Flags & Facts** (30 caracteres), redistribuyendo las keywords para no repetir `questions`, `flags` y `daily`. No cambiar simultáneamente esa hipótesis, el título y las capturas si se quiere aprender qué funciona.

## Mapa de búsquedas e hipótesis

Prioridad basada en encaje real con el producto y volumen territorial observado, **sin estimaciones inventadas de popularidad**:

| Prioridad | Intención | Consultas para comprobar | Qué la respalda |
|---|---|---|---|
| Alta | Trivia general en español | cultura general; quiz cultura general; preguntas de cultura general; preguntas y respuestas | Catálogo y modos de preguntas |
| Alta | Geografía y banderas | quiz de banderas; adivinar banderas; banderas de países; preguntas de geografía; quiz de capitales | Modo Banderas y contenido de Geografía; no prometer un modo exclusivo de capitales |
| Alta | Hábito diario | quiz diario; preguntas diarias | Pregunta del Día |
| Media | Historia y aprendizaje | preguntas de historia; test de historia; aprender geografía | Años, categorías y explicaciones |
| Media | Juego con amigos | preguntas con amigos; trivia para amigos | Cinco modos en un solo móvil; no prometer multijugador online |
| Media | Inglés específico | general knowledge quiz; daily trivia; flag quiz; geography quiz; history questions | App y catálogo en inglés |
| Condicional | Ciudades | adivina la ciudad; quiz de ciudades | Solo si el modo está incluido y probado en el binario final de 2.4.0 |

Comprobar resultados, sugerencias y posición de la app por mercado/dispositivo; registrar si no aparece entre los primeros 50 resultados, sin inventar una posición. Una herramienta ASO o datos de popularidad de Apple Ads pueden enriquecer la selección si están disponibles. No hace falta comprar tráfico para ejecutar la primera mejora. No se ha autorizado ni iniciado gasto publicitario.

## Páginas personalizadas y capturas

Empezar con **Banderas/Geografía** y **Pregunta del Día**. El plan previo de cinco páginas simultáneas dispersa el tráfico disponible. Aventura y Amigos quedan como siguiente fase cuando existan datos suficientes y contenido adecuado.

Apple permite mostrar una página personalizada en búsqueda para keywords de la última versión aprobada, cuando esa página está aprobada y visible. Una página personalizada presenta mejor una intención; **no garantiza un puesto más alto ni multiplica impresiones por crear más páginas**. Confirmar qué términos ofrece el selector de ASC: no asumir que todo término del título o subtítulo aparece en ese selector. [Configuración de páginas personalizadas](https://developer.apple.com/help/app-store-connect/create-custom-product-pages/configure-multiple-product-page-versions).

El material local revisado tiene una composición consistente. La primera captura vende «Aprende algo nuevo cada día» con la pantalla de Inicio; la tercera explica 4.000 preguntas y aclara 2.000 gratis + 2.000 PRO; Banderas y Años ocupa la octava posición. La pantalla inicial comunica hábito, pero no muestra de inmediato una pregunta jugable. Hipótesis de conversión: enseñar primero la pregunta y una respuesta, y acercar Banderas al inicio.

**Prueba PPO propuesta, una sola variante de orden, con los PNG existentes si siguen siendo fieles a 2.4.0:**

- Control: orden actual 01,02,03,04,05,06,07,08,09,10.
- Tratamiento: 03,08,04,02,09,01,06,07,05,10.
- Métrica: primeras descargas y conversión del tratamiento, con la confianza que informe ASC.
- Mantener el icono y el resto de textos iguales durante esta prueba. Si falta muestra, registrar resultado inconcluso.

Una prueba de capturas trabaja principalmente conversión. No usarla como sustituto del trabajo de cobertura de búsqueda. Si la 2.4.0 cambia las pantallas, producir capturas actuales antes de probarlas. [Página de producto](https://developer.apple.com/app-store/product-page/), [interpretación de PPO](https://developer.apple.com/help/app-store-connect-analytics/acquisition/product-page-optimization).

## Reseñas y otras vías de descubrimiento

La app ya solicita valoraciones mediante `expo-store-review`; no hace falta añadir otra petición más agresiva. Sí hay una corrección concreta que preparar para 2.4.0: `components/ReviewNudgeSheet.tsx` pregunta si gusta la app y ofrece «Me encanta» hacia la tienda y «Tengo sugerencias» hacia el correo. Apple exige su API para solicitar reseñas y rechaza solicitudes propias. Sustituir esa hoja por la petición nativa; conservar soporte como acción independiente y accesible a todos. Revisar también `lib/reviewGate.ts` y sus llamadas. No se han modificado estos archivos en esta auditoría. [Norma 5.6.1](https://developer.apple.com/app-store/review/guidelines/#app-store-reviews).

Para exploración, valorar una **nominación editorial** al tener una novedad sustancial, fecha y materiales finales. Un **In-App Event** sobre un lanzamiento de contenido real puede aportar exposición adicional; no debe ser una promoción genérica o una tarea diaria repetitiva. El posible modo Ciudades sería candidato solo si llega al binario final y el evento describe una experiencia de lanzamiento con fechas reales. No prometer que Apple lo destacará. [Eventos](https://developer.apple.com/app-store/in-app-events/), [nominaciones editoriales](https://developer.apple.com/videos/play/wwdc2024/10063/).

Las referencias de ChatGPT ya aportan adquisición. Mantener información pública coherente sobre nombre, funciones, idiomas y enlaces en la ficha y la web; no atribuir a cambios de keywords esas descargas. Si más adelante se prepara promoción cruzada en 101 Juegos, usar un enlace de campaña identificable y una página apropiada para distinguirla de ChatGPT. No se han cambiado campañas ni publicado anuncios.

## Objetivos y proyección prudente

Tomar **136 impresiones/día** como referencia de 28 días y **128** como referencia reciente. Hitos de trabajo: 200/día y después 300/día sostenidas en medias de 7 días; 500–600/día como objetivo de escala que requerirá evidencia. Son objetivos, no una previsión que el ASO garantice.

La búsqueda obtiene **99 / 3.279 = 3,02 primeras descargas por cada 100 impresiones totales**. Este cociente operativo permite escenarios con la misma unidad que el objetivo de impresiones; no es la tasa de conversión de Apple ni prueba causal.

| Impresiones totales de búsqueda/día | Primeras descargas/día al cociente observado | En 30 días |
|---|---:|---:|
| 200 | 6,0 | 181 |
| 300 | 9,1 | 272 |
| 500 | 15,1 | 453 |
| 600 | 18,1 | 543 |

Son escenarios de búsqueda con mezcla y rendimiento constantes; no incluyen referencias ni garantizan nuevas descargas. Si el objetivo de 500–600 se refiere a impresiones globales, primero hay que repartirlas por fuente. Más alcance puede traer públicos distintos y bajar la conversión. Aun con ese límite, multiplicar las búsquedas relevantes tiene potencial: hoy solo llegan unas 3,5 primeras descargas diarias por ese canal.

## Medición de lanzamiento

Aplicar la [lista de la 2.4.0](release-2.4.0-aso.md). Separar Search, Browse, App Referrer y Web Referrer; España, México, Colombia y EE. UU.; primeras descargas y redescargas; impresiones totales y únicas. No promediar porcentajes por territorio para fabricar una conversión conjunta.

Registrar base de 28 días y revisar D+7, D+14 y D+28 tras disponibilidad efectiva, con los mismos filtros. El éxito principal es aumentar primeras descargas de búsqueda y mantener su rendimiento razonable; una subida de impresiones sin nuevas descargas indica que faltan relevancia, posición o conversión. Las keywords no se validan porque los textos caben en el límite.

Limitaciones pendientes: popularidad y dificultad por keyword, origen exacto de los enlaces dentro de ChatGPT, presencia de campañas Apple Ads, categorías exactas y selector de keywords de páginas personalizadas. No se puede deducir esos datos de la ficha pública ni de un total acumulado.
