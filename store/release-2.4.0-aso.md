# 2.4.0 — publicación y medición del ASO

Actualizado: 16 de octubre de 2026. Estado: textos guardados y verificados en el borrador de App Store Connect de la 2.4.0; no enviado a revisión ni publicado. Novedades aplazadas por petición expresa del usuario.

Textos completos guardados: [copia de los tres idiomas](2.4.0/metadata-filled-2026-10-16.json). Se han mantenido los nombres, subtítulos y keywords acordados, sin aplicar las variantes opcionales. Nombre y subtítulo se han guardado en «Información de la app»; texto promocional, descripción, keywords y enlaces, en la versión 2.4.0. Verificación mediante reapertura de las localizaciones.

El usuario indica que los encabezados y creativos de búsqueda siguen pendientes de aprobación. Esta tarea no ha modificado esos componentes, la compilación, las capturas ni la configuración de publicación.

## Antes de enviar la versión

- [x] Registrar la decisión de conservar «Cultura General» y recuperar los snippets originales.
- [x] Guardar los metadatos base de ES-ES, ES-MX y EN-US en `2.4.0/metadata-aso.json`.
- [ ] Capturar el estado actual de ASC: nombre, subtítulo, keywords, idiomas, categorías, disponibilidad territorial y páginas personalizadas.
- [x] Guardar una base comparable de 28 días (17 sep.–14 oct.) con impresiones, primeras descargas y conversión por fuente de ambas apps, y territorios principales de Cultura General: `2.4.0/baseline-asc-2026-10-16.json`.
- [ ] Completar los cruces fuente/territorio, dispositivos únicos totales y redescargas para la medición fina. Los únicos por fuente de la base son promedios diarios redondeados.
- [ ] Comprobar si hay tráfico de Apple Ads antes de interpretar Search como orgánico.
- [x] Elegir y guardar la base original de keywords acordada (ES: 95; EN: 93 caracteres), sin aplicar las variantes opcionales.
- [x] Guardar y verificar los nuevos nombres y subtítulos en ASC y comprobar los límites de todos los campos de texto.
- [ ] Contrastar la descripción con el contenido final del binario de la 2.4.0; el texto guardado describe funciones ya publicadas, sin anunciar Ciudades.
- [x] Comprobar las categorías reales en ASC: Juegos, subcategoría Trivia y secundaria Educación. No se han modificado.
- [x] Confirmar localizaciones publicadas en el selector de ASC: ES-ES y EN-US.
- [x] Añadir ES-MX tanto en la información de la app como en la versión 2.4.0, con nombre, subtítulo, texto promocional, descripción, keywords y enlaces.
- [ ] Revisar la cobertura de los recursos gráficos para ES-MX cuando estén aprobados los componentes pendientes.
- [ ] Coordinar las keywords aprobadas con las páginas personalizadas. No dar por disponibles en la selección de ASC términos de la propuesta anterior que se hayan eliminado.
- [ ] Revisar la petición de reseñas: en `components/ReviewNudgeSheet.tsx` existe una solicitud propia que dirige «Me encanta» a la tienda y «Tengo sugerencias» al correo. Priorizar la API nativa y una opción de soporte independiente antes del envío; ver análisis y norma de Apple.
- [ ] Mantener capturas como control si siguen describiendo la 2.4.0. Actualizar las que sean inexactas y registrar el cambio para interpretar resultados.
- [ ] Escribir novedades de la 2.4.0 desde su contenido final. Aplazado por petición del usuario; campo vacío en los tres idiomas.
- [ ] Si hay una novedad sustancial, preparar un In-App Event y valorar una nominación editorial con sus fechas reales. No publicar un evento genérico de «pregunta diaria».
- [x] Cargar y verificar los textos en ASC de ES-ES, EN-US y ES-MX.
- [ ] Revisar la vista previa final con los recursos aprobados y la compilación seleccionada antes de enviar.

## Al publicar

- [ ] Registrar fecha y hora de disponibilidad efectiva de la 2.4.0, países e idiomas, capturas, páginas personalizadas, icono y textos exactos.
- [ ] Comprobar las fichas públicas de España, México y EE. UU. y las funciones promocionadas en dispositivo.
- [ ] Revisar la asignación de keywords a páginas personalizadas tras la aprobación; necesitan estar aprobadas y visibles.
- [ ] No reiniciar las valoraciones acumuladas como táctica de ASO.

## Después de publicar

- [ ] D+7: comprobar descubrimiento, territorios y errores de configuración. No declarar un ganador por unos pocos días.
- [ ] D+14: revisar medias de 7 días y primeras descargas. Investigar pérdidas sostenidas por fuente y territorio.
- [ ] D+28: comparar con los 28 días completos previos, mismos filtros y días de semana. Registrar cambios de producto, campañas y eventos que impidan atribuir todo al ASO.
- [ ] Iniciar una prueba PPO de un solo tratamiento de capturas si hay tráfico suficiente y no interfiere con otros cambios. No usar PPO para comparar títulos o keywords.
- [ ] Si no hay suficiente información, mantener la prueba o cerrarla como inconclusa; no dar por ganador al tratamiento con una diferencia pequeña.
- [ ] Decidir la siguiente iteración de keywords con visibilidad y primeras descargas, no solo con conversión global.

## Registro de decisiones de publicación

| Dato | Valor |
|---|---|
| Fecha/hora de disponibilidad | Pendiente |
| Metadatos base o variante aplicada | Pendiente |
| Capturas e icono usados | Pendiente |
| Páginas personalizadas y keywords | Pendiente |
| Evento y ventana, si corresponde | Pendiente |
| Campañas/referrals activos | Pendiente |
| Periodo de referencia y filtros | Pendiente |

Plan y fuentes: [análisis ASO](aso-2.4.0.md).
