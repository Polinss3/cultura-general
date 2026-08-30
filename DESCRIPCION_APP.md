# Cultura General / CG Trivia — Descripción de la aplicación

> Actualizado para la **versión 2.0.0** (agosto de 2026).

## Resumen

App móvil de preguntas de cultura general hecha con **React Native + Expo** y respaldada
por **Supabase**. Ofrece **1.589 preguntas activas repartidas en 13 categorías**, seis
formas de jugar, progresión con niveles y monedas, ligas semanales y multijugador local.
Bilingüe español/inglés, con tema claro, oscuro o el del sistema.

El nombre visible depende del idioma del dispositivo: **Cultura General** en español,
**CG Trivia** en el resto.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | React Native 0.81.5 + Expo 54 |
| Lenguaje | TypeScript 5.3 |
| Enrutamiento | Expo Router 6 (rutas por carpetas, tipadas) |
| Backend / Auth | Supabase 2.45 (PostgreSQL + Auth) |
| Almacenamiento local | AsyncStorage |
| i18n | i18next + react-i18next + expo-localization |
| Tipografía | **Nunito** (5 pesos) |
| Publicidad | Appodeal — producción **apagada**, TestFlight en prueba; ver `docs/APPODEAL_SAFE_INTEGRATION.md` |
| Atribución | AppsFlyer + Meta SDK, solo después del CMP y ATT concedido |
| Errores | Sentry |
| Builds | EAS |

**Identificadores**: bundle `com.polinss3.culturalgeneral` · App Store `6766927114` ·
EAS project `c320cb92-68f2-4474-9414-750921c2ac79` · web `cg-trivia.pablobrasero.com`

---

## Navegación

Cinco pestañas:

| Pestaña | Ruta | Contenido |
|---|---|---|
| 🏠 Inicio | `(tabs)/index.tsx` | Saludo, racha, misiones del día, accesos a los modos |
| 📅 Diario | `(tabs)/daily.tsx` | Pregunta del día, ruta diaria y los cuatro rankings |
| 🎯 Retos | `(tabs)/challenges.tsx` | Banderas (196 países) y Años (98 hechos), con conmutador propio |
| 📚 Aprender | `(tabs)/learn.tsx` | Práctica por categoría y dificultad, con banderas y años intercalados |
| 👥 Amigos | `(tabs)/friends.tsx` | Multijugador local |

Pantallas apiladas: `speed` (Contrarreloj), `ladder` (Modo Ascenso), `leagues`, `shop`,
`profile`, `friends-list`, `onboarding`, `privacy` y el grupo `(auth)`.

**Acceso**: correo y contraseña, Apple y Google, más un **modo invitado** que permite
jugar sin cuenta. Las pantallas con datos de servidor (Diario, Ligas, Amigos) quedan tras
una invitación a registrarse.

---

## Modos de juego

| Modo | Descripción |
|---|---|
| **Pregunta del día** | Una pregunta compartida por todos, con explicación al fallar y cuatro rankings: hoy, semana, global y amigos |
| **Contrarreloj** | 30 segundos, tantas respuestas como se pueda. Guarda récord personal |
| **Modo Ascenso** | Dificultad creciente por pisos, 3 vidas, checkpoints cada 5 pisos y un bote que se puede asegurar o arriesgar |
| **Retos: Banderas** | Banderas de 196 países, por continente o mundial, en dos sentidos: bandera → país y país → bandera |
| **Retos: Años** | 98 hechos históricos por épocas (hasta 1900, s. XX, s. XXI), en dos sentidos: hecho → año y año → hecho |
| **Aprender** | Categoría y dificultad a elección, con el contexto explicativo al fallar. Es el modo "todo": mezcla la trivia del banco con banderas y años |
| **Amigos** | Cinco modos locales en un solo dispositivo: Pasa el Móvil (2-8), Marcador (2-8), Duelo 1vs1, Superviviente (3-8) y Trivia Night (4-10, por equipos) |

---

## Progresión y economía

- **XP y niveles**: umbral acumulado `20·(L² − 1)`, es decir `nivel = ⌊√(xp/20 + 1)⌋`. La
  misma fórmula vive en el cliente y en SQL, para que nunca discrepen.
- **7 rangos** por nivel: Novato, Aprendiz, Conocedor, Erudito, Maestro, Sabio y Leyenda.
- **Racha diaria** con multiplicador de XP de ×1,0 a ×2,0 (`min(1 + 0,1·racha, 2)`).
- **Monedas** con libro de movimientos (`coin_ledger`) y topes diarios por fuente.
- **Tienda**: 5 power-ups consumibles (pista, saltar, tiempo, 50/50, revivir) y 5
  cosméticos (3 marcos de avatar, 2 colores de nombre).
- **21 logros** y **9 títulos** equipables.
- **8 misiones diarias**, de las que cada día se ofrecen 3, elegidas por semilla de fecha.
- **Cofre diario** cuya recompensa escala con la racha.
- **Ligas semanales** en 4 divisiones (Bronce, Plata, Oro, Diamante) con ascensos,
  descensos y premios por puesto.

---

## Datos

Las escrituras sensibles **no van por la tabla**: pasan por funciones `SECURITY DEFINER`
(`award_progress`, `claim_achievement`, `buy_item`, `equip_item`, `save_ladder_run`,
`increment_profile_stats`…). Desde el cliente, `profiles` solo acepta escritura en
`username`, y el resto de tablas tienen RLS de lectura propia.

**Tablas principales**: `profiles`, `questions`, `daily_questions`, `user_answers`,
`daily_rankings`, `friendships`, `question_reports`, `user_items`, `user_achievements`,
`user_missions`, `coin_ledger`, `daily_award_caps`, `shop_items`, `weekly_xp`,
`league_members`.

Las preguntas guardan las dos lenguas en la misma fila (`question` / `question_en`,
`options` / `options_en`, `context` / `context_en`). Si falta la traducción inglesa
completa, el cliente cae a español.

**Caché offline**: 6 horas en AsyncStorage, guardando las filas crudas para que cambiar de
idioma no obligue a volver a descargar. Si la red falla, se recurre al banco local de
`constants/questions.ts`. Las descargas van paginadas de 1.000 en 1.000, porque PostgREST
corta ahí y sin paginar no se veía el catálogo entero.

---

## Privacidad y publicidad

Antes de cargar nada se pide el tramo de edad. **Por debajo de 18 años no se carga
Appodeal, AppsFlyer ni Meta**, y se juega sin anuncios. Para adultos, el orden es
obligatorio: edad → CMP de Appodeal → ATT → Appodeal → AppsFlyer/Meta si ATT se concede.

La política de privacidad de la app tiene las **mismas 13 secciones** que la publicada en
`cg-trivia.pablobrasero.com/privacy`, y un test lo comprueba en cada build de la web.

---

## Comandos

```bash
npm start            # servidor de desarrollo
npm run ios          # simulador / dispositivo iOS
npm run android      # emulador / dispositivo Android
npm run typecheck    # tsc --noEmit
npm run test:ads     # política de frecuencia publicitaria
node scripts/check-i18n.mjs   # paridad ES/EN
cd website && npm run build && npm test   # web oficial
./website/deploy/deploy.sh                # publicar la web
```

**Variables de entorno**: ver `.env.example`. Las de producción viven en EAS Environment.

---

## Documentación relacionada

- `docs/APPODEAL_SAFE_INTEGRATION.md` — dashboard, TestFlight y activación segura
- `docs/adding-questions.md` — añadir preguntas (siempre bilingües)
- `docs/appsflyer-meta-setup.md` — atribución
- `store/README.md` — fichas de App Store y Google Play
- `website/README.md` — web oficial
- `supabase/security_hardening_v2.sql` — blindaje del backend (fase 1, aplicada)
- `supabase/questions_dedup.sql` — limpieza de preguntas duplicadas
