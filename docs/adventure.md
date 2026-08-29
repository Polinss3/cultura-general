# Aventura 2.1.0

## Arquitectura entregada

- `lib/adventure.ts` contiene las reglas puras: 200 niveles, 10 regiones de 20 niveles, diez preguntas por nivel, bloqueos, pleno requerido, rejugabilidad y recompensa única.
- `lib/adventure-questions.ts` descarga la asignación inmutable desde Supabase y precarga en segundo plano las 2.000 preguntas bilingües (1,29 MiB) para jugar cualquier nivel sin conexión.
- `lib/adventure-progress.ts` define `AdventureProgressRepository`: guarda primero en `AsyncStorage` y fusiona después con Supabase cuando hay red, separando el progreso por usuario o invitado.
- El mapa y la sesión consumen esos contratos; no conocen la implementación de almacenamiento.
- Las monedas y el XP de Aventura se conceden mediante `claim_adventure_reward`, con cantidades del servidor y clave única por usuario, nivel e hito. El inventario y el consumo de ayudas siguen usando `user_items`, `buy_item` y `consume_item`.

## Banco y asignación de preguntas

Producción contiene 2.000 preguntas activas y bilingües. La migración
`20260829010000_adventure_sync_rewards_v2.sql` asigna cada ID una sola vez a la
versión 2 de Aventura: 200 niveles de 10 preguntas, sin repeticiones entre niveles y con dificultad creciente. La versión 1 se conserva para builds anteriores. La
restricción `unique (version, question_id)` impide reutilizar un ID y el
validador `scripts/verify-question-bank.mjs` comprueba el manifiesto completo.

No se usa un banco circular offline. Al abrir el mapa con conexión, la app
precarga el manifiesto completo en dos páginas y lo guarda por nivel. La
pantalla no espera a esta tarea y una descarga interrumpida conserva los niveles
ya escritos hasta el siguiente reintento.

## Sincronización y recompensas cerradas

> Aventura y notificaciones son bloqueos de lanzamiento de la 2.1.0. La decisión
> de alcance, los números actualizados y los criterios de aceptación están en
> [`docs/release-2.1.0-blockers.md`](./release-2.1.0-blockers.md).

1. `sync_adventure_progress` fusiona niveles, estrellas, puntuaciones y mejores tiempos entre dispositivos sin regresiones.
2. `claim_adventure_reward` y `adventure_reward_claims` hacen cada recompensa transaccional e idempotente.
3. El progreso invitado se fusiona con la cuenta antes de eliminar la copia local; si no hay red se conserva para reintentarlo.
4. `claim_pending_adventure_rewards` liquida una sola vez las recompensas ganadas offline al volver a conectarse.

## Sesión, aprendizaje y medición

- Las diez estadísticas de una partida se envían juntas al terminar; responder
  ya no provoca diez RPC independientes.
- El pleno de 10/10 se mantiene. Las explicaciones aparecen tanto al acertar
  como al fallar y el resultado enumera las preguntas falladas con la respuesta
  elegida, la correcta y su contexto.
- Los objetivos parten de 65/110 segundos para 3/2 estrellas en el capítulo 1
  y bajan gradualmente hasta 51,5/92 segundos en el capítulo 10. Las estrellas
  previamente guardadas nunca se degradan.
- Salir durante una partida pide confirmación y pausa el cronómetro mientras el
  diálogo está abierto. Cada respuesta produce un solo háptico.
- AppsFlyer registra inicio, reintento, abandono confirmado, error por pregunta,
  uso de ayuda y finalización con tiempo y estrellas cuando el usuario ha
  habilitado la medición personalizada.

## Misiones y logros

El catálogo diario incluye intentos, plenos y estrellas de Aventura sin añadir
una cuarta misión diaria. La migración
`20260829020000_adventure_engagement_v2.sql` añade cinco logros validados contra
el progreso canónico de Supabase. Sus recompensas suman 400 monedas a lo largo
de los 200 niveles y no incluyen todavía premios especiales de final de
capítulo.
