# Catálogo de Ciudades · cierre en 250 destinos

Por decisión del usuario, esta versión termina la producción de destinos al alcanzar **250**. Las ocho últimas incorporaciones son Sintra, Bagan, San Miguel de Allende, Zanzíbar (Stone Town), Carcasona, Luang Prabang, Jiva y Lalibela. No añadir más destinos para esta versión; las correcciones de las imágenes, los encuadres y los metadatos siguen dentro del mantenimiento autorizado.

Estado: **publicado y verificado**. El catálogo remoto contiene 250 destinos jugables: 241 entradas de ciudades y nueve de lugares históricos. Europa 97, América 57, Asia 59, África 25 y Oceanía 12.

La comprobación con acceso anónimo confirma que las ocho imágenes nuevas coinciden byte a byte con sus exportaciones WebP locales, sus encuadres y nombres ES/EN son los previstos, y las 242 filas anteriores no cambiaron. Las rondas de todos los filtros de continente y dificultad siguen siendo válidas, incluida la relación de alternativas entre Machu Picchu y Chichén Itzá. El [registro de publicación](qa-app/catalogo-250-publicacion.json) conserva las URLs, los hashes y la fecha de comprobación.

El visor contiene 250 imágenes, sin destinos pendientes de generar. Superadas las 18 pruebas de Ciudades, la comprobación de tipos y la validación de selector, cuadrícula, filtros y rutas de imágenes. Se conserva el estado editorial de cada recurso; cerrar el alcance de producción no cambia ese estado.

La app instalada recibe el catálogo al entrar o volver al selector, o al pulsar **Actualizar ciudades** con conexión. No necesita una nueva build para estas incorporaciones. Una ronda ya iniciada conserva su instantánea hasta terminar.

## Texto propuesto para promociones

**ES · principal:** «Nuevo modo Ciudades: reconoce 250 ciudades y lugares emblemáticos del mundo por sus monumentos.»

**ES · corto:** «250 destinos del mundo. ¿Cuántos reconoces?»

**EN · principal:** “New Cities mode: identify 250 cities and iconic places around the world by their landmarks.”

**EN · corto:** “250 destinations around the world. How many can you recognize?”

El recuento incluye ciudades actuales y lugares históricos. Las preguntas usan imágenes fijas de dioramas con aspecto 3D; esta versión no ofrece modelos giratorios. Estos textos están preparados para revisión y no se han publicado en anuncios ni en las tiendas.

## Últimas tandas y referencias

| Tanda | Destino | Hitos principales | Fuentes |
| --- | --- | --- | --- |
| 63 | Sintra | Pena, Palacio Nacional, Castelo dos Mouros y Quinta da Regaleira | [Parques de Sintra](https://www.parquesdesintra.pt/en/parks-monuments/), [Regaleira](https://www.regaleira.pt/media/1004/folhetoen.pdf) |
| 63 | Bagan | Ananda, Thatbyinnyu, Dhammayangyi y Shwezigon | [UNESCO](https://whc.unesco.org/en/list/1588/), [conservación 2025](https://whc.unesco.org/en/soc/4865) |
| 63 | San Miguel de Allende | Parroquia, San Francisco, Las Monjas y Casa de Allende | [INAH](https://lugares.inah.gob.mx/es/node/4794) |
| 63 | Zanzíbar | Old Fort, Antiguo Dispensario, Palacio del Sultán y Christ Church | [UNESCO](https://whc.unesco.org/en/list/173/), [Comisión de Turismo](https://www.zanzibartourism.go.tz/things-to-do) |
| 64 | Carcasona | Doble muralla, Puerta Narbonnaise, Château Comtal y Saint-Nazaire | [UNESCO](https://whc.unesco.org/en/list/345/) |
| 64 | Luang Prabang | Wat Xieng Thong, Palacio Real, Haw Pha Bang y Phousi | [Turismo oficial](https://tourismluangprabang.org/things-to-do/culture-history/national-museum/) |
| 64 | Jiva / Khiva | Kalta Minor, Islam Khodja, Kunya-Ark y madraza de Muhammad Amin Khan | [Turismo de Uzbekistán](https://uzbekistan.travel/en/i/khiva/), [UNESCO](https://whc.unesco.org/en/list/543/) |
| 64 | Lalibela | Biete Giyorgis, Medhane Alem, Amanuel y Mariam | [UNESCO](https://whc.unesco.org/en/list/18/) |

Las composiciones reúnen hitos en un espacio condensado; no son planos a escala. Bagan conserva las siluetas arquitectónicas reconocibles, sin pretender reflejar el estado de cada obra de conservación. Lalibela omite las cubiertas modernas de protección para permitir reconocer las iglesias excavadas. Los prompts y las fuentes completos se conservan en `produccion/<id>.json`; el estado de revisión editorial de los recursos se mantiene.

El [visor de encuadre común](encuadre.html), el [catálogo con filtros](catalogo.html) y el [listado](listado-ciudades.md) comparten los mismos datos. El cierre del alcance de esta versión no limita técnicamente el sistema remoto para futuras versiones.
