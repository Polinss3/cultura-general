# Aventura 2.1.0

## Arquitectura entregada

- `lib/adventure.ts` contiene las reglas puras: 200 niveles, 10 regiones de 20 niveles, diez preguntas por nivel, bloqueos, pleno requerido, rejugabilidad y recompensa única.
- `lib/adventure-questions.ts` descarga la asignación inmutable de cada nivel desde Supabase y conserva cada nivel descargado en caché bilingüe para poder rejugarlo sin conexión.
- `lib/adventure-progress.ts` define `AdventureProgressRepository`. El primer proveedor usa `AsyncStorage` y separa el progreso por usuario o invitado.
- El mapa y la sesión consumen esos contratos; no conocen la implementación de almacenamiento.
- Las monedas y el XP se conceden mediante `award_progress`, la economía existente. El inventario y el consumo de ayudas siguen usando `user_items`, `buy_item` y `consume_item`.

## Banco y asignación de preguntas

Producción contiene 2.000 preguntas activas y bilingües. La migración
`20260828020000_questions_v5_2000.sql` asigna cada ID una sola vez a la versión
1 de Aventura: 200 niveles de 10 preguntas, sin repeticiones entre niveles. La
restricción `unique (version, question_id)` impide reutilizar un ID y el
validador `scripts/verify-question-bank.mjs` comprueba el manifiesto completo.

No se usa un banco circular offline: un nivel debe descargarse al menos una vez
antes de jugarlo sin conexión. Esta decisión evita mostrar preguntas repetidas
si el backend no está disponible.

## Pendiente fuera del banco de preguntas

> Aventura y notificaciones son bloqueos de lanzamiento de la 2.1.0. La decisión
> de alcance, los números actualizados y los criterios de aceptación están en
> [`docs/release-2.1.0-blockers.md`](./release-2.1.0-blockers.md).

1. Implementar un repositorio Supabase que sincronice `unlockedLevel`, mejores resultados y niveles completados.
2. Hacer idempotente la recompensa en servidor por `(user_id, source)`, donde la fuente ya se envía como `adventure_level_<n>`. El cliente evita recompensas repetidas en su estado local, pero una interrupción de red durante el RPC requiere garantía transaccional del backend.
3. Migrar el progreso local al servidor al iniciar sesión y resolver el máximo progreso de ambos lados.
