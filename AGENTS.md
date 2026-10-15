# Visor del modo Ciudades

Por petición del usuario, `docs/ciudades/encuadre.html` es el visor de referencia de todas las ciudades. Cada vez que se añada una ciudad o se actualice su imagen:

- Actualizar el catálogo y su perfil en `constants/cityDioramaFraming.json` para que apunten a la versión vigente.
- Ejecutar `node scripts/build-city-framing-preview.mjs` y guardar también el HTML generado en el mismo cambio.
- Comprobar que la ciudad aparece en el selector y en la cuadrícula con el encuadre común. Conservar las versiones anteriores para comparación.

No dar por terminada una actualización de ciudades dejando el visor desactualizado. El generador obtiene automáticamente las ciudades y sus nombres del perfil de encuadre y del catálogo.
