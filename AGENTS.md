# Visor del modo Ciudades

Por petición del usuario, `docs/ciudades/encuadre.html` es el visor de referencia de todas las ciudades. Cada vez que se añada una ciudad o se actualice su imagen:

- Actualizar el catálogo y su perfil en `constants/cityDioramaFraming.json` para que apunten a la versión vigente.
- Ejecutar `node scripts/build-city-framing-preview.mjs` y guardar también el HTML generado en el mismo cambio.
- Comprobar que la ciudad aparece en el selector y en la cuadrícula con el encuadre común. Conservar las versiones anteriores para comparación.

No dar por terminada una actualización de ciudades dejando el visor desactualizado. El generador obtiene automáticamente las ciudades y sus nombres del perfil de encuadre y del catálogo.

El mismo generador actualiza `docs/ciudades/catalogo.html` y `docs/ciudades/listado-ciudades.md`, a partir de `catalogo-propuesto.json`. Mantener el orden de producción y los estados reales: una entrada pendiente no se presenta como imagen creada ni como modo integrado. El catálogo es ampliable. El usuario autoriza ciudades antiguas y yacimientos con carácter urbano, incluidos Machu Picchu, Petra y Chichén Itzá; las respuestas usan sus nombres propios. Evitar duplicar un monumento aislado y su ciudad como respuestas válidas al mismo diorama.

El usuario ha cerrado el alcance de esta versión en **250 destinos**, incluyendo las últimas ocho incorporaciones: Sintra, Bagan, San Miguel de Allende, Zanzíbar (Stone Town), Carcasona, Luang Prabang, Jiva y Lalibela. No producir ni publicar más destinos para esta versión. Se permiten correcciones de imágenes, encuadres y metadatos de los 250 existentes. Cualquier ampliación posterior pertenece a otra versión y requiere una nueva petición del usuario.
