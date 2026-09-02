# Fichas de tienda ES/EN — v2.1.0

La app usa marca localizada: dispositivos en español ven **"Cultura General"**,
el resto **"CG Trivia"**. Estas fichas hay que crearlas/actualizarlas a mano en las
consolas (EAS solo sube los binarios, no gestiona metadatos).

| Fichero | Para |
|---|---|
| [`app-store-es.md`](app-store-es.md) · [`app-store-en.md`](app-store-en.md) | App Store Connect, un idioma por fichero |
| [`google-play-es.md`](google-play-es.md) · [`google-play-en.md`](google-play-en.md) | Play Console, un idioma por fichero |
| [`app-review-notes.md`](app-review-notes.md) | Notas para el revisor y respuestas de App Privacy |

## App Store Connect (iOS)

1. App → **General → App Information**: el nombre por defecto NO cambia el binario;
   el nombre bajo el icono lo controla `CFBundleDisplayName` (ya localizado vía
   `expo.locales`, se genera en el build).
2. App → pestaña de la versión → **⊕ junto a "App Store Localizations"**:
   - **Spanish (Mexico/Spain)**: pega `app-store-es.md`.
   - **English (U.S.)**: pega `app-store-en.md`.
3. Campos por idioma: Name, Subtitle, Promotional Text, Description, Keywords, What's New.
4. **Privacy Policy URL** ✅ ya cambiada: EN → `https://cg-trivia.pablobrasero.com/en/privacy`;
   ES → `https://cg-trivia.pablobrasero.com/privacy`.
5. **App Privacy** y las notas para el revisor: en `app-review-notes.md`.
6. Capturas: un set por idioma, ver más abajo.

> Nota: cambiar el nombre visible puede generar preguntas en revisión. Si
> "CG Trivia: General Knowledge" estuviera cogido en ASC, usar una de las variantes
> fallback listadas en `app-store-en.md`.

## Google Play Console (Android)

1. **Store presence → Main store listing → Manage translations → Add translations**:
   añade **English (United States)** y **Spanish (Spain)**.
2. Por idioma: App name, Short description, Full description → `google-play-*.md`.
3. El nombre bajo el icono en Android lo da `app_name` (localizado vía `expo.locales`
   → `values-b+es/strings.xml`), verificado por prebuild.
4. Gráficos/capturas por idioma: pendiente (tarea manual).

## Capturas

Se montan con [`scripts/generar-capturas-store.py`](../scripts/generar-capturas-store.py),
que es lo único versionado: los materiales (cientos de MB) viven en
`Capturas App Store/2.0.0/`, fuera de git.

```bash
python3 scripts/generar-capturas-store.py            # usa Capturas App Store/2.0.0
python3 scripts/generar-capturas-store.py <carpeta>  # o la que le pases
```

Comprueba que están todos los materiales antes de empezar y, si falta alguno, dice
cuál. Las capturas crudas que espera están listadas en la cabecera del script.

**Pendiente para la 2.1.0**: las tres capturas de la pestaña Retos. Las que hay son
de cuando se llamaba "Mundo" —se ve el nombre viejo en la barra de pestañas— y las
rondas estrenan la barra superior de `components/RoundHud.tsx`:

- `03-retos-menu.png` — el selector con las dos tarjetas héroe.
- `04-banderas-pais.png` — rehacer: la pregunta de bandera, ya con `RoundHud`.
- `10-anos-pregunta.png` — nueva: una pregunta del modo Años.

## Checklist de la 2.1.0

- [x] `supabase/i18n_en.sql` aplicado.
- [x] `supabase/questions_en.sql` aplicado, cobertura EN al 100 %.
- [x] Web legal publicada en `https://cg-trivia.pablobrasero.com`.
- [x] Privacy Policy URL apuntando al dominio propio en ASC.
- [x] Textos ES/EN alineados con la 2.1.0: siete modos, Retos (Banderas y
      Años), ranking global y "sin anuncios" como argumento.
- [ ] **Capturas de Retos** (las tres de arriba), un set por idioma.
- [ ] Pegar los textos en App Store Connect y en Google Play Console.
- [ ] Rellenar App Privacy y las notas del revisor (`app-review-notes.md`).

> Los recuentos que aparecen en las fichas ("más de 1.500 preguntas", "13 categorías",
> "196 países", "98 hechos históricos") salen de los datos reales: 1.589 preguntas
> activas tras `supabase/questions_dedup.sql`, `constants/flags.ts` y
> `constants/years.ts`. Si se amplía alguno, conviene revisarlos.
>
> Las descripciones **no mencionan publicidad**, porque la 2.1.0 se publica con los
> anuncios apagados —y ahora además sin pedir consentimiento ni ATT, ver
> `adsConfigured()` en `lib/ads`—. Cuando se activen (ver
> `docs/APPODEAL_SAFE_INTEGRATION.md`) hay que quitar el "sin anuncios" de los cuatro
> ficheros **antes** de subir esa build.
