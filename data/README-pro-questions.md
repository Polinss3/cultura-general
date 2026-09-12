# Catálogo de preguntas CG PRO

El archivo definitivo debe llamarse `questions-pro-v1-2000.json` y contener
exactamente 2.000 objetos con la misma estructura bilingüe que el banco actual:

```json
{
  "category": "historia",
  "question": "Pregunta en español",
  "options": ["A", "B", "C", "D"],
  "answer_index": 0,
  "context": "Explicación en español",
  "difficulty": "medium",
  "question_en": "Question in English",
  "options_en": ["A", "B", "C", "D"],
  "context_en": "Explanation in English"
}
```

`npm run build:questions:pro` valida cantidad, bilingüismo, opciones, respuestas,
duplicados normalizados dentro del catálogo y coincidencias con el banco core.
También comprueba que el reparto easy/medium/hard permite construir diez preguntas
en cada nivel. Si todo es correcto genera
`supabase/pro_questions_seed_v1.sql`, fuera del directorio de migraciones.

Antes del rollout también hay que comparar semánticamente este catálogo con las
2.000 preguntas core de producción; la ausencia de duplicados exactos no basta.

## Flujo de trabajo (2026-09-12)

Las preguntas se escriben por categoría y por lotes en `data/pro/<categoria>-N.json`
(mismo formato que arriba). `node scripts/assemble-pro-questions.mjs --report`
valida cada lote: esquema, coherencia ES/EN, duplicados exactos y **aproximados**
(Jaccard sobre pregunta + respuesta) contra el core de producción
(`questions-core-prod-2000.json`, volcado del 2026-09-12) y dentro del propio
catálogo PRO, y el reparto de dificultad por categoría (objetivo en `TARGET`).
Sin `--report`, cuando las 13 categorías están completas y sin errores, escribe
`questions-pro-v1-2000.json`, que es lo que consume `npm run build:questions:pro`.

Reparto objetivo: 154 por categoría (153 en ciencia y mitología), con
31 easy / 69 medium / 54 hard (30 easy en las de 153). Total 401 / 897 / 702,
más exigente que el core porque alimenta los niveles 201-400.
