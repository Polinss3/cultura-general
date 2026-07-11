# Fichas de tienda ES/EN — v1.3.0

La app pasa a marca localizada: dispositivos en español ven **"Cultura General"**,
el resto **"CG Trivia"**. Estas fichas hay que crearlas/actualizarlas a mano en las
consolas (EAS solo sube los binarios, no gestiona metadatos).

## App Store Connect (iOS)

1. App → **General → App Information**: el nombre por defecto NO cambia el binario;
   el nombre bajo el icono lo controla `CFBundleDisplayName` (ya localizado vía
   `expo.locales`, se genera en el build).
2. App → pestaña de la versión → **⊕ junto a "App Store Localizations"**:
   - **Spanish (Mexico/Spain)**: pega `app-store-es.md`.
   - **English (U.S.)**: pega `app-store-en.md`.
3. Campos por idioma: Name, Subtitle, Promotional Text, Description, Keywords, What's New.
4. **Privacy Policy URL**: EN → `https://<usuario>.github.io/.../privacy-en.html`;
   ES → la actual `privacy.html`.
5. Capturas: subir un set por idioma (pendiente, tarea manual).

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

## Checklist antes de publicar la ficha EN

- [ ] `supabase/i18n_en.sql` aplicado.
- [ ] `supabase/questions_en.sql` aplicado y `missing_en = 0` (cobertura 100%).
- [ ] `docs/privacy-en.html` publicado en GitHub Pages.
- [ ] Capturas EN subidas.
