# Aventura 2.1.0

## Arquitectura entregada

- `lib/adventure.ts` contiene las reglas puras y el contrato `AdventureQuestionProvider`: 400 niveles, 20 regiones de 20 niveles, diez preguntas por nivel, bloqueos, pleno requerido, rejugabilidad y recompensa única.
- `lib/adventure-progress.ts` define `AdventureProgressRepository`. El primer proveedor usa `AsyncStorage` y separa el progreso por usuario o invitado.
- El mapa y la sesión consumen esos contratos; no conocen la implementación de almacenamiento.
- Las monedas y el XP se conceden mediante `award_progress`, la economía existente. El inventario y el consumo de ayudas siguen usando `user_items`, `buy_item` y `consume_item`.

## Fallback local

La versión demostrable funciona sin un backend nuevo. Los 49 enunciados bilingües empaquetados forman un manifiesto determinista y se distribuyen en niveles de diez. Todos los clientes de esta versión reciben el mismo nivel; dentro de cada nivel no se repite ninguna pregunta. Al recorrer los 400 niveles el catálogo vuelve a reutilizar enunciados.

## Pendiente para producción

1. Publicar un manifiesto versionado con 4.000 IDs de pregunta únicos y su asignación inmutable a los 400 niveles.
2. Implementar un repositorio Supabase que sincronice `unlockedLevel`, mejores resultados y niveles completados, conservando el proveedor local como caché/offline.
3. Hacer idempotente la recompensa en servidor por `(user_id, source)`, donde la fuente ya se envía como `adventure_level_<n>`. El cliente evita recompensas repetidas en su estado local, pero una interrupción de red durante el RPC requiere garantía transaccional del backend.
4. Migrar el progreso local al servidor al iniciar sesión y resolver el máximo progreso de ambos lados.
