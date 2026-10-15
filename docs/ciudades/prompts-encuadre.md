# Prompts del encuadre común

Herramienta: ImageGen integrada. Los originales v1 se conservan; las nuevas fuentes están en `normalizadas/*-v2.png`. Las primeras variantes con dos referencias se descartaron porque arrastraban el encuadre anterior. Se conserva la plantilla de base y las seis versiones producidas utilizando solo esa plantilla.

## Plantilla de base

```text
Use case: precise-object-edit.
Asset type: shared base-only registration template for six miniature city quiz images.
Input: the supplied New York diorama, used as reference for organic irregular base contour, soft sandstone material and isometric camera.
Create ONE EMPTY BASE ONLY, no city. Remove ALL buildings, trees, bridges, statue, park and streets. Retain a cohesive organic irregular island-shaped solid sandstone plinth inspired by this image, with smooth rounded corners and subtly wavy/notched edges, NOT a square, circle or perfect rectangle. Its top surface is plain matte warm ivory stone with no water or markings. The base is one single continuous slab of UNIFORM THICKNESS, 65 pixels at its forward-facing edge in a 1254x1254 reference canvas. Orthographic isometric camera 35 degrees above ground, front tip centered horizontally.
Registration is crucial: plain warm ivory background matching the input. The entire base is fully visible. Horizontal outer bounds approximately x=70 to x=1184. Ground's furthest rear point y=530. Front floor edge y=1085. Absolute lowest base point y=1150. The left and right extremities around y=795. All corners inside frame. Centered symmetrical visual balance but deliberately softly irregular organic outline. Soft warm light from upper-left, very subtle shadow below. No text, labels, dimensions, guide lines, buildings, objects or people. One base only, as a reusable visual template.
```

## Roma

```text
Use case: precise-object-edit. EDIT THE PROVIDED EMPTY BASE by ADDING a miniature Rome city onto its existing top surface. Treat the input as a locked canvas: KEEP THE ENTIRE IRREGULAR BASE, its outline, location, size, thickness, angle, rim, sandstone surface material, shadows and surrounding ivory background IDENTICAL. Change only the empty upper surface by adding landmarks, small streets and restrained greenery. DO NOT generate a different base; do not zoom or move the existing base. The base's bottom must stay where it is in the input, well ABOVE the canvas bottom, leaving the existing empty margin intact. Preserve the organic curved scalloped outline and slight side notches exactly.
Add a polished softened miniature architectural Rome with five recognizable landmarks: oval partially ruined Colosseum at rear-left, Pantheon with column portico and low broad dome at front-left, Trevi Fountain with sculpture facade and turquoise pool at front-center, Forum ruined columns at center, cylindrical Castel Sant'Angelo with small angel at rear-right. Small muted coral terracotta local buildings and umbrella pines. Keep every landmark INSIDE the supplied floor boundary and above the existing base rim. Use the provided ground plane's fixed orthographic isometric perspective. Tallest building fully inside canvas with generous empty top margin. Matte pale stone and muted brick, fine but softly beveled toy-like architecture, gentle upper-left daylight. No people, lettering, flags, labels, city name, watermark, guides, or second plinth. One scene on the SAME existing organic base.
```

## madrid

```text
Use case: precise-object-edit.
EDIT THE PROVIDED EMPTY BASE by ADDING a miniature city onto its existing top surface. Treat this as a LOCKED CANVAS: keep the ENTIRE IRREGULAR BASE, its outer contour, side notches, exact location, width, projected floor depth, thickness, angle, sandstone material, rim, shadows and surrounding warm ivory background IDENTICAL. Change only the empty upper surface by adding the following landmarks, small streets and restrained greenery. DO NOT create a new base, zoom or move the existing base. Its lowest point must remain where it is in the input, well above the bottom of the canvas, leaving its empty margin intact. Preserve the scalloped organic outline exactly. Single continuous plinth.
City and landmarks: Madrid: add the bear leaning upright on the strawberry tree at the foreground, Puerta del Sol's red-and-cream Real Casa de Correos with central clock tower, exactly FOUR Cuatro Torres skyscrapers at the back, Atocha's iron-and-glass arched train shed and brick facade, and Puerta de Alcalá's five openings. No flags.
Use the EXISTING ground plane's fixed orthographic isometric perspective. Every landmark fits INSIDE the supplied floor boundary and above its rim. Buildings: refined softened miniature architecture with matte pale stone, muted coral brick, slate blue glass, sage foliage, fine detail and smoothly beveled edges. Dominant landmarks recognizable, separated and unoccluded, fewer filler blocks. Sculptures readable in the foreground. All tall towers and spires fit entirely inside the canvas with at least 65 pixels of top margin. Adjust ONLY building size to fit the shared footprint; NEVER move or rescale the base. Match the existing soft upper-left daylight. Water goes on top of the same ground surface and NEVER cuts or changes the base contour.
No people, lettering, city name, flags, labels, watermarks, guides, weather or extra plinth. ONE city on the SAME EXISTING ORGANIC BASE. Preserve its lower margin and the exact same silhouette and position as the input.
```

## nueva-york

```text
Use case: precise-object-edit.
EDIT THE PROVIDED EMPTY BASE by ADDING a miniature city onto its existing top surface. Treat this as a LOCKED CANVAS: keep the ENTIRE IRREGULAR BASE, its outer contour, side notches, exact location, width, projected floor depth, thickness, angle, sandstone material, rim, shadows and surrounding warm ivory background IDENTICAL. Change only the empty upper surface by adding the following landmarks, small streets and restrained greenery. DO NOT create a new base, zoom or move the existing base. Its lowest point must remain where it is in the input, well above the bottom of the canvas, leaving its empty margin intact. Preserve the scalloped organic outline exactly. Single continuous plinth.
City and landmarks: New York: add Statue of Liberty and pedestal in foreground, Empire State Building, Chrysler Building, Central Park with pond, Brooklyn Bridge over a contained water channel, and Grand Central Terminal. All water remains INSIDE the common base contour; it does not reshape the outline.
Use the EXISTING ground plane's fixed orthographic isometric perspective. Every landmark fits INSIDE the supplied floor boundary and above its rim. Buildings: refined softened miniature architecture with matte pale stone, muted coral brick, slate blue glass, sage foliage, fine detail and smoothly beveled edges. Dominant landmarks recognizable, separated and unoccluded, fewer filler blocks. Sculptures readable in the foreground. All tall towers and spires fit entirely inside the canvas with at least 65 pixels of top margin. Adjust ONLY building size to fit the shared footprint; NEVER move or rescale the base. Match the existing soft upper-left daylight. Water goes on top of the same ground surface and NEVER cuts or changes the base contour.
No people, lettering, city name, flags, labels, watermarks, guides, weather or extra plinth. ONE city on the SAME EXISTING ORGANIC BASE. Preserve its lower margin and the exact same silhouette and position as the input.
```

## barcelona

```text
Use case: precise-object-edit.
EDIT THE PROVIDED EMPTY BASE by ADDING a miniature city onto its existing top surface. Treat this as a LOCKED CANVAS: keep the ENTIRE IRREGULAR BASE, its outer contour, side notches, exact location, width, projected floor depth, thickness, angle, sandstone material, rim, shadows and surrounding warm ivory background IDENTICAL. Change only the empty upper surface by adding the following landmarks, small streets and restrained greenery. DO NOT create a new base, zoom or move the existing base. Its lowest point must remain where it is in the input, well above the bottom of the canvas, leaving its empty margin intact. Preserve the scalloped organic outline exactly. Single continuous plinth.
City and landmarks: Barcelona: add Sagrada Família with unmistakable sand-colored spires, Park Güell with mosaic salamander and serpentine bench, Casa Batlló's organic facade and dragon roof, rounded bullet-shaped Torre Glòries, and red-brick Arc de Triomf.
Use the EXISTING ground plane's fixed orthographic isometric perspective. Every landmark fits INSIDE the supplied floor boundary and above its rim. Buildings: refined softened miniature architecture with matte pale stone, muted coral brick, slate blue glass, sage foliage, fine detail and smoothly beveled edges. Dominant landmarks recognizable, separated and unoccluded, fewer filler blocks. Sculptures readable in the foreground. All tall towers and spires fit entirely inside the canvas with at least 65 pixels of top margin. Adjust ONLY building size to fit the shared footprint; NEVER move or rescale the base. Match the existing soft upper-left daylight. Water goes on top of the same ground surface and NEVER cuts or changes the base contour.
No people, lettering, city name, flags, labels, watermarks, guides, weather or extra plinth. ONE city on the SAME EXISTING ORGANIC BASE. Preserve its lower margin and the exact same silhouette and position as the input.
```

## paris

```text
Use case: precise-object-edit.
EDIT THE PROVIDED EMPTY BASE by ADDING a miniature city onto its existing top surface. Treat this as a LOCKED CANVAS: keep the ENTIRE IRREGULAR BASE, its outer contour, side notches, exact location, width, projected floor depth, thickness, angle, sandstone material, rim, shadows and surrounding warm ivory background IDENTICAL. Change only the empty upper surface by adding the following landmarks, small streets and restrained greenery. DO NOT create a new base, zoom or move the existing base. Its lowest point must remain where it is in the input, well above the bottom of the canvas, leaving its empty margin intact. Preserve the scalloped organic outline exactly. Single continuous plinth.
City and landmarks: Paris: add Eiffel Tower's four-legged lattice silhouette, Notre-Dame with two square front towers and flying buttresses and slender spire, Louvre palace and main glass pyramid, Arc de Triomphe, Sacré-Cœur white domed basilica, restrained mansard-roof buildings and small Seine.
Use the EXISTING ground plane's fixed orthographic isometric perspective. Every landmark fits INSIDE the supplied floor boundary and above its rim. Buildings: refined softened miniature architecture with matte pale stone, muted coral brick, slate blue glass, sage foliage, fine detail and smoothly beveled edges. Dominant landmarks recognizable, separated and unoccluded, fewer filler blocks. Sculptures readable in the foreground. All tall towers and spires fit entirely inside the canvas with at least 65 pixels of top margin. Adjust ONLY building size to fit the shared footprint; NEVER move or rescale the base. Match the existing soft upper-left daylight. Water goes on top of the same ground surface and NEVER cuts or changes the base contour.
No people, lettering, city name, flags, labels, watermarks, guides, weather or extra plinth. ONE city on the SAME EXISTING ORGANIC BASE. Preserve its lower margin and the exact same silhouette and position as the input.
```

## tokio

```text
Use case: precise-object-edit.
EDIT THE PROVIDED EMPTY BASE by ADDING a miniature city onto its existing top surface. Treat this as a LOCKED CANVAS: keep the ENTIRE IRREGULAR BASE, its outer contour, side notches, exact location, width, projected floor depth, thickness, angle, sandstone material, rim, shadows and surrounding warm ivory background IDENTICAL. Change only the empty upper surface by adding the following landmarks, small streets and restrained greenery. DO NOT create a new base, zoom or move the existing base. Its lowest point must remain where it is in the input, well above the bottom of the canvas, leaving its empty margin intact. Preserve the scalloped organic outline exactly. Single continuous plinth.
City and landmarks: Tokyo: add red-and-white Tokyo Tower, slim silver Tokyo Skytree with two observation decks, red Sensō-ji temple and five-story pagoda, Kaminarimon's plain red lantern without lettering, Shibuya crossing and short elevated rail line and small train. No people.
Use the EXISTING ground plane's fixed orthographic isometric perspective. Every landmark fits INSIDE the supplied floor boundary and above its rim. Buildings: refined softened miniature architecture with matte pale stone, muted coral brick, slate blue glass, sage foliage, fine detail and smoothly beveled edges. Dominant landmarks recognizable, separated and unoccluded, fewer filler blocks. Sculptures readable in the foreground. All tall towers and spires fit entirely inside the canvas with at least 65 pixels of top margin. Adjust ONLY building size to fit the shared footprint; NEVER move or rescale the base. Match the existing soft upper-left daylight. Water goes on top of the same ground surface and NEVER cuts or changes the base contour.
No people, lettering, city name, flags, labels, watermarks, guides, weather or extra plinth. ONE city on the SAME EXISTING ORGANIC BASE. Preserve its lower margin and the exact same silhouette and position as the input.
```

## Madrid v3: composición autorizada

Tras la revisión del usuario, se sustituye solo el soporte mediante recorte y composición. No se usa un nuevo prompt ni se regeneran edificios. Entradas: Madrid v2, base común v2 y máscara editable en `revision-madrid/mascara-ciudad.png`. Reproducción: `python3 scripts/compose-madrid-base.py`. Resultado: `normalizadas/madrid-v3.png`. Detalles en [la revisión de Madrid](revision-madrid/README.md).
