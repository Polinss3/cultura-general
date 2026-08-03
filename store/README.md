# Fichas de tienda ES/EN — v2.0.0

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
4. **Privacy Policy URL** ✅ ya cambiada: EN → `https://cg-trivia.pablobrasero.com/en/privacy`;
   ES → `https://cg-trivia.pablobrasero.com/privacy`.
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

## Checklist de la 2.0.0

- [x] `supabase/i18n_en.sql` aplicado.
- [x] `supabase/questions_en.sql` aplicado, cobertura EN al 100 %.
- [x] Web legal publicada en `https://cg-trivia.pablobrasero.com`.
- [x] Privacy Policy URL apuntando al dominio propio en ASC.
- [x] Textos ES/EN reescritos para la 2.0.0 (Mundo, tema claro/oscuro, 13 categorías).
- [ ] **Capturas nuevas** con el diseño "Papel cálido", un set por idioma. Las que hay
      son del diseño oscuro anterior y ya no se parecen a la app.
- [ ] Pegar los textos en App Store Connect y en Google Play Console.

> Los recuentos que aparecen en las fichas ("más de 1.500 preguntas", "13 categorías")
> salen de la base de datos real: 1.589 activas tras `supabase/questions_dedup.sql`.
> Si se amplía el banco, conviene revisarlos.
>
> Las descripciones **no mencionan publicidad**, porque la 2.0.0 se publica con los
> anuncios apagados. Cuando se activen (ver `docs/ads-applovin-activation.md`) hay que
> añadir la mención en los cuatro ficheros.
