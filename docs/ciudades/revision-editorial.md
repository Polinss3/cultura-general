# Revisión editorial de la colección

## Ocho incidencias corregidas · v2 · 16 de octubre de 2026

Las ocho incidencias de la revisión inicial se han corregido con ediciones dirigidas de ImageGen integrada sobre sus imágenes v1. Se revisaron las salidas, las dimensiones, el encuadre y las siluetas señaladas con las referencias siguientes. Las versiones v1 se conservan y la vista «Original» del [encuadre común](encuadre.html) permite compararlas con las vigentes.

| Destino | Corrección de v2 | Referencias consultadas |
| --- | --- | --- |
| Abu Dabi | Grupo Etihad de cinco torres diferenciadas. | [Turismo de Abu Dabi](https://visitabudhabi.ae/en/things-to-do/culture/landmarks-and-architecture/etihad-towers) |
| São Paulo | Cúpula verde sobre el crucero de la Sé, detrás de las dos agujas de la fachada. | [Estudio de la Universidad de São Paulo](https://www.teses.usp.br/teses/disponiveis/3/3144/tde-05052025-134128/publico/KarenNiccoliRamirezDISSERT.pdf) |
| Recife | Centro de la rosa de los vientos sin columna inventada; busto separado hacia el borde de la plaza. | [Prefeitura do Recife](https://www2.recife.pe.gov.br/noticias/11/01/2013/pcr-realiza-caminhada-cultural-pelo-bairro-do-recife), [Visite Recife](https://visite.recife.br/marco-zero-recife/) |
| Montevideo | Solís rectangular, pórtico de ocho columnas, frontón y cubiertas bajas; eliminada la cúpula circular. | [Intendencia de Montevideo](https://montevideo.gub.uy/areas-tematicas/cultura-y-tiempo-libre/teatro-solis), [Teatro Solís](https://www.teatrosolis.org.uy/QUIENES-SOMOS/El-edificio-uc589) |
| San Juan | Fachada colonial baja sin las dos grandes torres inventadas; cúpulas posteriores con nervios blancos y paños rojizos. | [Discover Puerto Rico](https://www.discoverpuertorico.com/profile/catedral-de-san-juan-bautista/8041), galería de la catedral documentada en el archivo de producción |
| Santo Domingo | Catedral de volumen bajo sin gran cúpula ni torres barrocas, portada doble y frontón sencillo. También se corrigieron el Faro a Colón como cruz horizontal escalonada y la cubierta plana del Alcázar. | [Catedral](https://www.godominicanrepublic.com/things-to-do/primatial-cathedral-basilica-of-america), [Faro a Colón](https://www.godominicanrepublic.com/things-to-do/museo-faro-a-colon), [Alcázar](https://es.godominicanrepublic.com/que-hacer/museo-alcazar-de-colon) |
| San José | Catedral neoclásica con pórtico de seis columnas y cúpula proporcionada; Bellavista amarillo ocre con patio y tres torreones conservados. | [Arquidiócesis](https://www.arquisanjose.org/catedralmetropolitana), [Museo Nacional](https://www.museocostarica.go.cr/museo/arquitectura-bellavista/fachada-y-torreones/), [Ministerio de Educación: torreón suroeste demolido](https://www.mep.go.cr/sites/default/files/2025-07/RutaMuroRejas.pdf) |
| La Valeta | San Juan como iglesia rectangular de fachada sobria y dos campanarios, sin la gran cúpula inventada; el grupo de cúpula carmelita y aguja de San Pablo permanece separado. | [Arquidiócesis de Malta](https://church.mt/photos-restoration-of-st-johns-co-cathedrals-facade-is-now-complete/), [San Pablo](https://www.stpaulspromalta.org/history-heritage/iconicspire/) |

Las imágenes vigentes son `normalizadas/<id>-v2.png`. Los prompts exactos, las pasadas de edición y las referencias están en `produccion/<id>.json`; los registros anteriores se conservan en `produccion/<id>-v1.json`. La [lámina antes/después](verificacion/correcciones-ocho-v2.png) reúne las ocho comparaciones.

## Alcance de la revisión

Son miniaturas estilizadas y collages de hitos, con proporciones adaptadas a su reconocimiento. Resolver estas incidencias no equivale a aprobar todos los detalles arquitectónicos de los 235 dioramas para un lanzamiento general. El catálogo conserva `concept-needs-review`; los ocho archivos de producción registran `targeted-correction-reviewed`.

El registro fija centro, anchura y línea inferior de las bases. Las ocho ediciones mantienen la referencia de composición y se han vuelto a medir. La generación no garantiza identidad geométrica al píxel; Madrid v3 utiliza composición sobre la plantilla, documentada por separado.

La publicación remota usa archivos WebP con hash en la URL y conserva las versiones anteriores. La app recibe las correcciones al actualizar el catálogo en el selector de Ciudades, sin una nueva build. Una ronda ya iniciada conserva su instantánea; sin conexión no puede recibir nuevas URLs. El procedimiento y la comprobación de publicación están en [Integración en la app](integracion-app.md).
