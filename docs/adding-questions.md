# Añadir preguntas (bilingüe ES/EN)

Desde v1.3.0 la app es bilingüe. **Toda pregunta nueva debe nacer bilingüe.**

## Regla

Al insertar en `public.questions`, rellena también las columnas EN:

```sql
insert into public.questions
  (category, question, options, answer_index, context, difficulty,
   question_en, options_en, context_en)
values
  ('historia', '¿…?', '["..",".."]', 1, '…', 'medium',
   'English question?', '["..",".."]'::jsonb, 'English context');
```

- `options_en` debe tener exactamente **4** opciones y **el mismo orden** que `options`
  (el `answer_index` es compartido).
- Si una pregunta aún no está traducida, déjala **`active = false`** hasta traducirla,
  o el cliente la mostrará en español (fallback atómico: solo usa EN si hay
  `question_en` + 4 `options_en` no vacías).

## Pipeline de traducción masiva (banco existente)

1. `node scripts/extract-questions.mjs` → genera `translations/questions.es.json`
   (todas las preguntas del repo, numeradas por categoría con `i`).
2. Traducir cada categoría a `translations/en/<categoria>.json`:
   `[ { "i": 0, "question_en": "...", "options_en": ["..","..","..",".."], "context_en": "..." }, … ]`
   (mismo `i` que el maestro; `options_en` posicional, sin `answer_index`).
3. `node scripts/build-questions-en-sql.mjs` → genera `supabase/questions_en.sql`
   (UPDATEs keyed por `category` + texto ES exacto, dollar-quoted). Flag `--split`
   para trocear por categoría en `supabase/questions_en/*.sql`.
4. Pegar el SQL en el editor de Supabase. La query de cobertura al final debe dar
   `missing_en = 0` en preguntas activas antes de publicar la ficha EN.

Es **resumible**: `build-questions-en-sql.mjs` solo procesa las categorías que ya
tengan su fichero en `translations/en/`.
