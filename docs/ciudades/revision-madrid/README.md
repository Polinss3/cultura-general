# Revisión de la base de Madrid

Solución seleccionada: recorte y composición, autorizado por el usuario. No se han regenerado los edificios.

- Fuente aprobada: `../normalizadas/madrid-v2.png`.
- Soporte: `../normalizadas/base-comun-v2.png`.
- Máscara editable: `mascara-ciudad.png`, en coordenadas de salida.
- Resultado: `../normalizadas/madrid-v3.png`.
- [Antes y después](index.html), con Barcelona como referencia.

La ciudad se traslada 20 px hacia abajo, sin escalar ni interpolar sus píxeles. La nueva calibración compensa prácticamente ese traslado en pantalla. El perímetro y la franja exterior de pavimento se integran con un suavizado de 2,5 px. El soporte visible conserva los píxeles de la plantilla. La máscara no modifica los monumentos interiores.

Reproducir con `python3 scripts/compose-madrid-base.py` (requiere Pillow). El script verifica cinco regiones interiores de los hitos sin diferencias de píxeles. También se ha comprobado que los 105.888 píxeles identificados como pared cálida del soporte (y > 600, R-G > 35, G-B > 20) son idénticos a la plantilla y que todos los píxeles con máscara cero permanecen intactos.

Las candidatas generativas anteriores se descartaron porque alteraban edificios o no igualaban la base. El catálogo, la calibración y el comparador principal utilizan v3. Las otras cinco ciudades no cambian.
