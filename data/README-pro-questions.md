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
