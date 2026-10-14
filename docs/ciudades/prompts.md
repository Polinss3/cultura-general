# Prompts del piloto

Herramienta: ImageGen integrada, sin CLI ni llamadas API propias. Los PNG son conceptos sin aprobar. Las referencias aportadas por el usuario no se incorporan al repositorio.

## Madrid, generación inicial

Referencia de estilo: primera imagen adjunta del usuario (Singapur).

Use case: stylized-concept.
Asset type: pilot image for a city-identification quiz, square 1024x1024.
Primary request: Create one polished miniature isometric diorama of Madrid, using the attached Singapore image ONLY as an artistic reference for softened 3D architecture, rounded square plinth, toy-like scale, matte materials and soft studio lighting. Do not copy Singapore's buildings or lettering.
Scene: A single cohesive Madrid city miniature on a square sandstone plinth with softly rounded corners, on a plain warm ivory background. Fixed orthographic three-quarter camera, all corners and all landmarks fully visible, approximately 35-degree elevation. Entire diorama centered filling 85% of image with equal generous margins.
Mandatory Madrid landmarks with accurate recognizable silhouettes: Puerta del Sol with the red-and-cream Real Casa de Correos facade and its central clock tower; a clearly readable little bronze bear standing upright leaning front paws on a green strawberry tree on a pedestal in the front foreground; exactly FOUR distinctive Cuatro Torres skyscrapers grouped at the rear, visually different heights and crowns; Atocha station's large iron-and-glass arched train-shed and red-brick facade; Puerta de Alcalá with its five arch openings. Small Retiro-like green planting and small linking streets.
Composition is a curated landmark collage, not a geographically accurate map. Keep every key landmark unoccluded and separate. Larger monuments, fewer filler buildings, clear at mobile question-card size. Light beige stone, muted brick coral, pale slate-blue glass, sage greenery. Soft bevels and rounded edges, refined architectural detail but smooth miniature illustration feel. Warm daylight upper-left, ambient occlusion and subtle grounded shadows. No people, weather, sky elements, captions, labels, lettering, city name, logos or watermarks. No collage panels. Bear and tree must be visibly recognizable; no text anywhere.

## Madrid, corrección

Entrada: generación inicial. Corrección dirigida: eliminar la torre alta inclinada situada detrás de la torre central más baja para pasar de cinco a cuatro rascacielos; conservar resto de edificios, cámara, luz y paleta. Resultado guardado como madrid-v1.png. Pendiente eliminar bandera, ampliar márgenes y revisar siluetas con fotografías.

## Nueva York

Referencia de estilo: Madrid corregida.

Use case: stylized-concept. Asset type: pilot square city-identification quiz image. Generate ONE New York City miniature diorama. Input image is ONLY a style reference: precisely match its softened architectural 3D miniature style, matte sandstone rounded square plinth, warm ivory background, fixed orthographic isometric three-quarter camera, angle, lighting, pastel palette and scale. Replace ALL Madrid buildings and monuments with New York landmarks. Curated landmark collage, not a literal geographic map. Mandatory unmistakable landmarks: a clearly visible large green-patina Statue of Liberty with crown and torch standing on her stone pedestal in the front-left foreground, on a small island surrounded by muted blue water; Empire State Building with its stepped Art Deco silhouette and thin spire, at rear center; Chrysler Building with its metallic terraced pointed crown at rear right; a long Central Park patch with trees, curving pathways and small pond at center; Brooklyn Bridge spanning a small water channel to front-right, with two Gothic stone towers and suspension cables; a small simplified Grand Central Terminal facade with its three arched windows at front center. A few muted Manhattan blocks connect the scenery without crowding it. Every landmark visible and unoccluded. Smooth bevels, soft edges, refined architectural miniature details readable at mobile size. Warm daylight from upper-left, soft ambient occlusion. Light stone, muted coral brick, slate-blue glass, sage green vegetation. Entire square diorama centered with all corners inside frame and 8 percent margins. No bear or Madrid architecture. No people, text, lettering, captions, city names, labels, weather, skies, watermarks or logos. One image, no montage.

Pendiente restaurar contorno cuadrado de la base, ampliar márgenes, reducir relleno y revisar arquitectura.


## Ampliación del piloto: Barcelona, Roma, París y Tokio

Referencia de estilo para las cuatro ciudades: `piloto/madrid-v1.png`. Herramienta integrada ImageGen, una generación independiente por ciudad; sin CLI. Son muestras conceptuales pendientes de revisión editorial.

### Barcelona

Recurso: `piloto/barcelona-v1.png`.

```text
Use case: stylized-concept.
Asset type: square image for a mobile city-identification quiz.
Reference image role: artistic style reference ONLY. Match the Madrid reference's refined softened 3D miniature architecture, matte surfaces, warm ivory background, soft upper-left daylight, pale sandstone, muted coral brick, slate-blue glass and sage greenery. Replace all Madrid architecture with the requested city's landmarks.
Composition: ONE cohesive miniature city on a geometrically SQUARE sandstone plinth with FOUR gently rounded corners, straight outer edges and uniform thickness. Fixed orthographic isometric three-quarter camera approximately 35 degrees above the ground. Zoom out sufficiently: the complete base, every corner, every spire and every landmark must be INSIDE the image with at least 10 percent empty margin on ALL four sides. Background is uniform warm ivory. Water and parks stay WITHIN the square footprint; no irregular edges, islands protruding from the base or circular plinth.
Landmarks: 4–6 accurate distinctive architectural silhouettes, unoccluded, larger than filler buildings and clearly legible on a phone. This is a curated architectural collage, not a literal map. Add only a FEW small local buildings and connecting streets. Strong priority on recognizable landmark silhouettes and smooth beveled edges, polished toy-like miniature detail. Consistent camera, lighting, base and artistic scale across the collection.
Constraints: no city name, NO TEXT OR LETTERS ANYWHERE, labels, inscriptions, captions, road lettering, banners, flags, watermarks, people, weather symbols, clouds, snow or decorative objects outside the plinth. Do not copy the reference's bear, station, arch or skyscrapers. One image, no montage.

City: BARCELONA. Mandatory landmarks: Sagrada Família as the dominant rear centerpiece with its unmistakable sculptural sand-colored tapering spires and organic basilica facades, NOT a generic Gothic cathedral; Park Güell with the colorful mosaic salamander prominently visible at the front and flowing serpentine mosaic bench above it; Casa Batlló with undulating facade, oval windows, skeletal balconies and dragon-like blue-green tiled roof; Torre Glòries as a single rounded bullet-shaped glass tower; Barcelona's red-brick Arc de Triomf with one large central arch. Keep Casa Batlló and the salamander easy to identify. Retain mosaic details without overpowering the shared muted palette.
```

### Roma

Recurso: `piloto/roma-v1.png`.

```text
Use case: stylized-concept.
Asset type: square image for a mobile city-identification quiz.
Reference image role: artistic style reference ONLY. Match the Madrid reference's refined softened 3D miniature architecture, matte surfaces, warm ivory background, soft upper-left daylight, pale sandstone, muted coral brick, slate-blue glass and sage greenery. Replace all Madrid architecture with the requested city's landmarks.
Composition: ONE cohesive miniature city on a geometrically SQUARE sandstone plinth with FOUR gently rounded corners, straight outer edges and uniform thickness. Fixed orthographic isometric three-quarter camera approximately 35 degrees above the ground. Zoom out sufficiently: the complete base, every corner, every spire and every landmark must be INSIDE the image with at least 10 percent empty margin on ALL four sides. Background is uniform warm ivory. Water and parks stay WITHIN the square footprint; no irregular edges, islands protruding from the base or circular plinth.
Landmarks: 4–6 accurate distinctive architectural silhouettes, unoccluded, larger than filler buildings and clearly legible on a phone. This is a curated architectural collage, not a literal map. Add only a FEW small local buildings and connecting streets. Strong priority on recognizable landmark silhouettes and smooth beveled edges, polished toy-like miniature detail. Consistent camera, lighting, base and artistic scale across the collection.
Constraints: no city name, NO TEXT OR LETTERS ANYWHERE, labels, inscriptions, captions, road lettering, banners, flags, watermarks, people, weather symbols, clouds, snow or decorative objects outside the plinth. Do not copy the reference's bear, station, arch or skyscrapers. One image, no montage.

City: ROME. Mandatory landmarks: the Colosseum as the dominant rear-left centerpiece, an unmistakably oval amphitheater with three rows of exterior arches and the recognizable partially missing upper wall; the Pantheon with a classical columned portico attached to a broad low hemispherical dome with a small open oculus; Trevi Fountain, a wide ornate stone Baroque facade with a central monumental arch, classical sculptures and a clearly visible turquoise pool in the foreground; Roman Forum represented by a few freestanding ruined classical columns and broken stone structures; Castel Sant'Angelo as a cylindrical stone fortress on a broad circular drum with a small bronze angel statue on top. All five landmarks separate, visible and distinguishable; sparse warm terracotta-roofed buildings and a few umbrella pines. Do not add Vatican landmarks or anything outside Rome. Do not turn the Colosseum into a complete modern stadium.
```

### París

Recurso: `piloto/paris-v1.png`.

```text
Use case: stylized-concept.
Asset type: square image for a mobile city-identification quiz.
Reference image role: artistic style reference ONLY. Match the Madrid reference's refined softened 3D miniature architecture, matte surfaces, warm ivory background, soft upper-left daylight, pale sandstone, muted coral brick, slate-blue glass and sage greenery. Replace all Madrid architecture with the requested city's landmarks.
Composition: ONE cohesive miniature city on a geometrically SQUARE sandstone plinth with FOUR gently rounded corners, straight outer edges and uniform thickness. Fixed orthographic isometric three-quarter camera approximately 35 degrees above the ground. Zoom out sufficiently: the complete base, every corner, every spire and every landmark must be INSIDE the image with at least 10 percent empty margin on ALL four sides. Background is uniform warm ivory. Water and parks stay WITHIN the square footprint; no irregular edges, islands protruding from the base or circular plinth.
Landmarks: 4–6 accurate distinctive architectural silhouettes, unoccluded, larger than filler buildings and clearly legible on a phone. This is a curated architectural collage, not a literal map. Add only a FEW small local buildings and connecting streets. Strong priority on recognizable landmark silhouettes and smooth beveled edges, polished toy-like miniature detail. Consistent camera, lighting, base and artistic scale across the collection.
Constraints: no city name, NO TEXT OR LETTERS ANYWHERE, labels, inscriptions, captions, road lettering, banners, flags, watermarks, people, weather symbols, clouds, snow or decorative objects outside the plinth. Do not copy the reference's bear, station, arch or skyscrapers. One image, no montage.

City: PARIS. Mandatory landmarks: Eiffel Tower as the dominant rear-left landmark with recognizable tapering four-legged iron lattice silhouette and clear arch beneath it; Notre-Dame cathedral with exactly two square front towers, Gothic facade, flying buttresses and slender central spire; Louvre glass pyramid prominently visible at front center with a small segment of the Louvre palace behind it; Arc de Triomphe as a broad rectangular stone triumphal arch with one principal central opening in the foreground; Sacré-Cœur as a white domed basilica with its characteristic large rounded dome and smaller surrounding domes. A small Seine strip and a few restrained cream Haussmann buildings with slate-blue mansard roofs. Every landmark visible; keep their facades readable. Eiffel Tower must be fully inside the image, no cropped spire. No duplicate Eiffel Towers or pyramids.
```

### Tokio

Recurso: `piloto/tokio-v1.png`.

```text
Use case: stylized-concept.
Asset type: square image for a mobile city-identification quiz.
Reference image role: artistic style reference ONLY. Match the Madrid reference's refined softened 3D miniature architecture, matte surfaces, warm ivory background, soft upper-left daylight, pale sandstone, muted coral brick, slate-blue glass and sage greenery. Replace all Madrid architecture with the requested city's landmarks.
Composition: ONE cohesive miniature city on a geometrically SQUARE sandstone plinth with FOUR gently rounded corners, straight outer edges and uniform thickness. Fixed orthographic isometric three-quarter camera approximately 35 degrees above the ground. Zoom out sufficiently: the complete base, every corner, every spire and every landmark must be INSIDE the image with at least 10 percent empty margin on ALL four sides. Background is uniform warm ivory. Water and parks stay WITHIN the square footprint; no irregular edges, islands protruding from the base or circular plinth.
Landmarks: 4–6 accurate distinctive architectural silhouettes, unoccluded, larger than filler buildings and clearly legible on a phone. This is a curated architectural collage, not a literal map. Add only a FEW small local buildings and connecting streets. Strong priority on recognizable landmark silhouettes and smooth beveled edges, polished toy-like miniature detail. Consistent camera, lighting, base and artistic scale across the collection.
Constraints: no city name, NO TEXT OR LETTERS ANYWHERE, labels, inscriptions, captions, road lettering, banners, flags, watermarks, people, weather symbols, clouds, snow or decorative objects outside the plinth. Do not copy the reference's bear, station, arch or skyscrapers. One image, no montage.

City: TOKYO. Mandatory landmarks: Tokyo Tower with its unmistakable red-and-white open lattice structure and wide four-legged base; Tokyo Skytree as a much slimmer pale silver tower with two distinctive observation decks and long antenna, clearly distinct from Tokyo Tower; Sensō-ji's red temple buildings and five-story red pagoda; Kaminarimon red gate with a prominent large plain red lantern, without the real lantern's calligraphy or any lettering; Shibuya scramble crossing with clearly recognizable converging zebra crossings and a few mid-rise local buildings, all screens completely blank without signs; a short elevated rail line and small modern train entirely inside the square plinth. Small cherry blossom trees for local character, no decorative floating petals. Both towers must be fully inside the image and the traditional architecture visible in the foreground. Avoid generic Chinese temple silhouettes and avoid making Skytree a second red Tokyo Tower.
```
