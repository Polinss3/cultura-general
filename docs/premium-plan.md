# CG PRO — Plan de suscripción premium

> Objetivo de versión: **2.2.0**. Documento de decisiones y alcance.
> Estado: implementación en curso en `feature/premium-pro`, actualizado el 2026-09-08.

## Contexto y restricción principal

> **Actualización 2026-09-12:** esta restricción ya no aplica. Desde la 2.2.0 los anuncios
> los sirve In-House Ads (ver `docs/ads-inhouse.md`), el perfil `production` va en
> `EXPO_PUBLIC_ADS_MODE=live`, y **"Sin anuncios" es un beneficio del PRO** (segundo de la
> lista del paywall). El texto que sigue se conserva como contexto de las decisiones.

**No hay proveedor de anuncios operativo.** `EXPO_PUBLIC_ADS_MODE=off` en el perfil de
producción de `eas.json` y la rama `ads/appodeal` está a medias. Esto tiene dos
consecuencias que condicionan todo el plan:

1. **"Sin anuncios" no puede aparecer en el paywall.** Es el argumento nº1 de compra en
   trivia y no lo tenemos. El PRO debe sostenerse **solo con contenido y utilidad**, lo
   que sube el listón: no basta con quitar fricción, hay que dar algo que no existe.
2. **El tier gratuito no genera ingresos.** Cada usuario gratis es coste puro de Supabase.
   Es asumible al volumen actual, pero refuerza que el PRO tiene que convertir bien.

La 2.2.0 se plantea como producto freemium + CG PRO. La infraestructura publicitaria
inactiva no forma parte de la propuesta de valor ni se comunica al usuario. Si en el futuro
existe un proveedor, será una decisión de producto y privacidad separada.

---

## Decisiones cerradas

| Tema | Decisión |
|---|---|
| SDK de compras | **RevenueCat** (`react-native-purchases`), ya conocido de otros proyectos |
| Precios | Mensual **3,99 €** · Anual **19,99 €** · Lifetime **29,99 €** |
| Prueba gratuita | **3 días** en mensual y anual (el lifetime no admite). Configurada en ASC; el paywall lee la duración del producto, no la trae codificada |
| Aventura gratis | **Capítulos 1 y 2** (niveles 1-40). Capítulos 3-20 son PRO |
| Usuarios existentes | **Grandfathering**: conserva los capítulos 3-10 ya publicados; los nuevos 11-20 son PRO |
| Catálogo de preguntas | 2.000 base para todos + 2.000 nuevas exclusivas de PRO en Aprender y Aventura 201-400 |
| Pregunta diaria | Usa solo el catálogo base de 2.000 preguntas |
| Insignia PRO | **Confirmada**, junto al nombre en rankings y ligas |
| Métricas | Sección **visible para todos**, con datos **borrosos + CTA** para los gratuitos |
| Modos exclusivos | **Los dos**: Repaso inteligente y Examen, en una pantalla dedicada |
| Otros beneficios | Estipendio de monedas, streak freeze automático, cosméticos PRO |

### Regla de diseño transversal: el patrón "borroso + CTA"

La decisión de mostrar las métricas borrosas a los gratuitos se convierte en **el lenguaje
de paywall de toda la app**. Un componente único, `<ProGate>`, que envuelve contenido,
lo difumina, lo hace no interactivo y superpone un mensaje + botón. Se usa en:

- la sección de métricas del perfil,
- el mapa general de Aventura y otras previsualizaciones PRO,
- las tarjetas de la Sala PRO.

Ver siempre lo que te pierdes convierte mucho mejor que un candado opaco, y usar **el
mismo gesto visual en los tres sitios** hace que el usuario aprenda qué significa.

---

## 1. Aventura: el ancla del PRO

La Aventura de la 2.2.0 pasa a 400 niveles, 20 capítulos de 20, silueta de
camino propia por capítulo (`ADVENTURE_PATH_PATTERNS`), 16 motivos temáticos, 25 acentos
cromáticos, estrellas por tiempo, finales de capítulo y sincronización idempotente.

**Lo que le falta no es mecánica, es *sentido de viaje y recompensa*.** Si vamos a cobrar
por 18 de los 20 capítulos, el usuario tiene que sentir que compra una campaña, no 360
niveles más de lo mismo. Cuatro añadidos, ninguno de ellos caro:

### 1.A — Mapa del viaje (pantalla de conjunto) · esfuerzo medio

Hoy solo se ve un capítulo a la vez (swipe + `ChapterPickerModal`). Falta el plano
general. Una pantalla que muestre los 20 capítulos como un único recorrido, con estrellas
y progreso de cada uno, hace tres cosas a la vez:

- transmite **escala** ("esto es largo, merece la pena"),
- da el momento **"mira lo lejos que he llegado"**,
- es **una superficie natural del paywall** para previsualizar los capítulos bloqueados.

### 1.B — Reliquias: la colección · esfuerzo medio-bajo, **sin backend**

Una **reliquia por capítulo**, temática (el papiro de Raíces, el astrolabio de Cosmos…),
en tres grados:

| Grado | Condición |
|---|---|
| 🥉 Bronce | Capítulo completado |
| 🥈 Plata | Media de 2⭐ en el capítulo |
| 🥇 Oro | 3⭐ en los 20 niveles |

**Todo es derivable de `progress.stars`, que ya existe y ya se sincroniza.** Cero estado
nuevo en servidor, cero migración. Es la mejor relación valor/esfuerzo de todo el plan:
convierte las estrellas de un número en una **colección**, que es lo que genera el impulso
de completar. Se expone en una vitrina que encaja con la sección de títulos equipables que
ya tiene el perfil.

### 1.C — Guardianes: los finales de capítulo con identidad · esfuerzo bajo-medio

Los niveles 20, 40, …, 400 son finales diferenciados por la configuración
`20260829030000_adventure_chapter_finals_v2.sql`, pero solo mecánicamente. Darles **nombre,
retrato y reglas propias** los convierte en un evento:

- 15 preguntas en vez de 10, mezclando las categorías del capítulo,
- sin power-ups,
- pantalla de presentación y de victoria propias,
- la reliquia del capítulo se entrega aquí.

Es casi todo copy, i18n y UI sobre lógica que ya existe.

### 1.D — Lore de capítulo · esfuerzo muy bajo, efecto alto

Dos o tres líneas al entrar en un capítulo y una de cierre al terminarlo. Como es una app
de cultura general, **el lore puede ser educativo**: "Ideas recorre el camino de Tales a
Turing". Es solo texto en i18n y transforma la percepción de "400 niveles generados" a
"un recorrido comisariado". Muy barato, muy rentable.

### Reparto gratis / PRO

- **Capítulos 1-2 (niveles 1-40)**: gratis y **completos** — con reliquias, guardianes y
  lore. La demo tiene que ser buena, no mutilada.
- **Capítulos 3-20**: PRO. Un capítulo bloqueado muestra directamente el mensaje y CTA,
  sin un lienzo desplazable vacío.
- **Grandfathering**: en el primer arranque de la 2.2.0, si `unlockedLevel > 40` o hay
  niveles completados por encima del 40, se marca `profiles.adventure_legacy = true` (y su
  equivalente local para invitados) vía RPC. Ese flag conserva los niveles 41-200 que ya
  existían en la 2.1.0; los nuevos niveles 201-400 siguen siendo exclusivos de PRO.

### Extras opcionales (no en 2.2.0)

- **Desafío del capítulo**: rejugar un capítulo completo con una vida y tiempo cronometrado.
- **Progreso de Aventura en Home**: tarjeta con el siguiente nivel. Re-enganche barato.
- **Recompensa de capítulo**: los 40 🪙 actuales (`REWARDS.adventureChapter`) se quedan
  cortos frente a precios de tienda de 60-140 🪙. Subir al entregar la reliquia.

---

## 2. Sala PRO: los modos exclusivos

Pantalla dedicada (`app/premium.tsx`), accesible desde Home y Perfil. **Los usuarios
gratuitos también entran**: ven las tarjetas con `<ProGate>`. Es a la vez el escaparate y
el paywall.

Contiene: Repaso inteligente · Examen · Métricas · Vitrina de reliquias · Beneficios.

### 2.A — Repaso inteligente · **el motor de renovación**

Repetición espaciada sobre las preguntas que has fallado: reaparecen a 1, 3, 7, 21 y 60
días hasta que las clavas.

- Es lo que convierte la app de juego en **herramienta de estudio**, que es exactamente el
  perfil que paga una suscripción (opositores, concursantes, docentes).
- Genera un **motivo diario de volver** ("tienes 12 preguntas para repasar hoy"), enlazable
  con las notificaciones que ya existen (`lib/notificationPlan.ts`).
- **Es la razón por la que alguien renueva el mes 2.** Sin esto, el PRO es una compra única
  disfrazada de suscripción.

Necesita algo de backend: tabla `review_items(user_id, question_id, box, due_at,
last_result)` y un par de RPC. Es el único añadido de servidor no trivial del plan.

### 2.B — Examen · **el motor de adquisición**

40 preguntas, 20 minutos, mezcla de categorías, **nota sobre 10**, percentil frente al
resto y **tarjeta compartible**.

- Reutiliza el banco entero, casi sin lógica nueva.
- Lo compartible trae usuarios gratis: una nota es contenido social, una racha no.
- Alimenta las métricas PRO con una serie histórica de notas.
- Variantes: examen general y examen por categoría.

---

## 3. Métricas (visibles para todos, borrosas para gratuitos)

Ya se calcula dominio por categoría (`lib/mastery.ts`), rachas, precisión y el histórico
está en `user_answers` **con `answered_at`**, así que casi todo es derivable sin snapshots.

| Métrica | Gratis | PRO |
|---|---|---|
| Dominio por categoría (foto actual) | ✅ ya existe | ✅ |
| Evolución del dominio en el tiempo | 🔒 borroso | ✅ |
| Precisión por dificultad y por categoría | 🔒 borroso | ✅ |
| Histórico completo de falladas con su explicación | 🔒 borroso (solo última partida) | ✅ |
| Comparativa con la media global | 🔒 borroso | ✅ |
| Historial de notas de Examen | 🔒 borroso | ✅ |
| Exportar / compartir informe | 🔒 | ✅ |

**Detalle importante del borroso**: dejar **un dato real visible** como cebo (p. ej. "tu
mejor categoría es Historia") y difuminar el resto. Un panel enteramente borroso no
comunica valor; uno con una pista sí.

---

## 4. Estatus y beneficios

### Insignia PRO — confirmada

Junto al nombre en los cuatro rankings, en la liga y en el perfil. El sistema ya lo
soporta: `profiles.cosmetics` (jsonb, espejo por slot) y `components/UserName.tsx` ya
pintan icono, color y estilo de cualquier usuario en cualquier lista. La insignia es un
slot más. **Coste casi nulo, efecto de conversión alto**: se paga por que se vea.

### Cosméticos exclusivos

Marcos y colores de nombre **no comprables con monedas**, solo PRO. Reutiliza `equip_item`
y el catálogo de `shop_items` con un flag `pro_only`.

### Estipendio de monedas

~300 🪙/mes, concedidas por `award_progress` con `source = 'pro_stipend'` y guarda de
una-vez-al-mes, siguiendo el patrón de topes diarios que ya usa la economía.

### Streak freeze automático

`streak_freeze` está **definido a 300 🪙 y sin cablear** (pendiente conocido del bloque 3
de gamificación). Convertirlo en el beneficio estrella del PRO — *"tu racha nunca se
rompe"* — resuelve un pendiente antiguo y da el beneficio más emocional de la lista.
También entra aquí la recuperación de racha con monedas, gratis para PRO.

### Lo que NO se hace

- ❌ **Multiplicador de XP**. Hay ligas con ascenso y descenso por puesto y cuatro rankings
  públicos: un booster de pago convierte la liga en *pay-to-win* y mata el pique, que es el
  motor de retención. **Ningún beneficio PRO puede afectar al XP ni a las clasificaciones.**
- ❌ Límites diarios de partidas en Aprender o Contrarreloj.
- ❌ Pregunta del Día de pago: es el gancho de retorno diario, tiene que ser universal.

---

## 5. Integración técnica

### Productos y entitlement

| Producto | ID | Tipo |
|---|---|---|
| Mensual | `cg_pro_monthly` | Auto-renewable, grupo "CG PRO" |
| Anual | `cg_pro_annual` | Auto-renewable, mismo grupo |
| Lifetime | `cg_pro_lifetime` | No consumible |

Entitlement único: **`pro`**. Los tres productos lo conceden, así que el cliente solo
pregunta por el entitlement y nunca por el producto.

### Arquitectura

Sigue el patrón que ya usa el proyecto (espejo denormalizado en `profiles` +
`SECURITY DEFINER` para lo que toca economía):

1. **Cliente** lee `customerInfo` de RevenueCat → `isPro`, para pintar UI y desbloquear
   contenido local. Se cachea en AsyncStorage: **Aventura tiene que funcionar sin
   conexión** (ya precarga las 2.000 preguntas), así que el gate no puede depender de red.
2. **Webhook** de RevenueCat → Edge Function `revenuecat-webhook` (ya existe
   `supabase/functions/`, con `delete-account` como referencia) → actualiza
   `profiles.premium_tier`, `premium_until`, `premium_since`. Verificar el header de
   autorización con secreto compartido.
3. **Servidor manda en todo lo que da recompensa**: helper SQL `is_premium(uid)` usado
   dentro de `award_progress` (estipendio) y `claim_adventure_reward` (guarda de capítulo
   > 2). Si alguien juega el capítulo 5 sin conexión con la suscripción caducada, juega
   pero no cobra. Es el compromiso correcto.

### Esquema

```sql
alter table public.profiles
  add column if not exists premium_tier text not null default 'none'
    check (premium_tier in ('none','monthly','annual','lifetime')),
  add column if not exists premium_until timestamptz,
  add column if not exists premium_since timestamptz,
  add column if not exists adventure_legacy boolean not null default false;
```

### Modo invitado

La compra vive en el Apple ID, no en la cuenta. RevenueCat permite ID anónimo + `logIn()`
para hacer alias, pero **lo limpio es exigir cuenta para comprar**: evita el caso "compré
como invitado, reinstalé, lo perdí", que es un 1★ garantizado. El invitado que pulsa
comprar pasa primero por registro.

### Requisitos de App Store (bloqueantes de revisión)

Apple rechaza por la guideline 3.1.2 si falta algo de esto:

- [x] Botón **"Restaurar compras"** visible en el paywall.
- [x] Precio, duración y **renovación automática** indicados en el propio paywall.
- [x] **Duración de la prueba gratuita** anunciada en el punto de compra, con el
      precio al que se convierte.
- [x] Enlaces a **Términos (EULA)** y Privacidad desde el paywall. La página de
      términos se publicó con una sección de suscripción (§7) el 2026-09-12.
- [x] Enlace a gestionar suscripción (`itms-apps://apps.apple.com/account/subscriptions`).
- [ ] Ficha de App Store actualizada con la información de suscripción.
- [ ] Inscripción en el **App Store Small Business Program** (comisión 15 % en vez de 30 %).

Usar `react-native-purchases-ui` para el paywall permite reconfigurar precios y copy
**desde el panel de RevenueCat sin publicar build**, que para probar precios vale mucho.

---

## 6. Fases

| Fase | Contenido | Esfuerzo |
|---|---|---|
| **1 — Fundamentos** | RevenueCat, productos en ASC, esquema, webhook, paywall, restaurar compras, página de términos en la web | ~1 semana |
| **2 — Gates y estatus** | Componente `<ProGate>`, insignia PRO, gate de Aventura 3-20, grandfathering 41-200 | ~3 días |
| **3 — Revamp Aventura** | Mapa del viaje, reliquias, guardianes, lore | ~1,5 semanas |
| **4 — Sala PRO** | Pantalla + Examen + Repaso inteligente | ~1,5 semanas |
| **5 — Métricas** | Panel completo con borroso + CTA | ~4 días |
| **6 — Beneficios** | Estipendio, streak freeze, cosméticos PRO | ~3 días |

Total ~5-6 semanas. Las fases 1 y 2 son bloqueantes del resto; 3, 4, 5 y 6 son paralelas
entre sí.

**Si hay que recortar para llegar**: sale **Examen** (fase 4), no Repaso inteligente.
Examen es el más barato de añadir después y funciona muy bien como gancho de una 2.2.1;
Repaso es lo que hace que la gente **renueve**, y sin anuncios no podemos permitirnos que
el PRO parezca una compra única.

---

## 6.1 Estado de implementación

Rama `feature/premium-pro`. Actualizado el 2026-09-12.

| Pieza | Estado |
|---|---|
| Migración `20260906010000_premium_pro_v1.sql` | ✅ aplicada en producción (verificado 2026-09-12) |
| Edge Function `revenuecat-webhook` | ✅ desplegada el 2026-09-12 con `--no-verify-jwt` y secreto configurado — **falta darla de alta en el panel de RevenueCat** |
| `lib/premium.ts` + `hooks/usePremium.ts` | ✅ |
| `components/ProGate.tsx` (borroso + CTA) | ✅ |
| `app/paywall.tsx` | ✅ |
| Insignia PRO en rankings, liga y perfil | ✅ |
| Candado de Aventura cap. 3-20 + grandfathering limitado a 41-200 | ✅ cliente; SQL de rollout diferido |
| Aventura 400 niveles / 20 capítulos | ✅ cliente y contenido de capítulo; SQL de rollout diferido |
| Catálogo base/PRO en Aprender | ✅ cliente; faltan autoría y revisión de las 2.000 preguntas PRO |
| Manifiesto Aventura 201-400 | ✅ generador; se genera al completar el catálogo PRO |
| Reliquias y vitrina | ✅ |
| Lore de capítulo | ✅ |
| Guardianes (finales de capítulo) | ✅ |
| Mapa del viaje | ✅ |
| Sala PRO + Examen + Repaso inteligente | ✅ (migraciones aplicadas) |
| Métricas con borroso | ✅ (migración aplicada) |
| Estipendio | ✅ (recogible desde la Sala PRO) |
| Streak freeze automático, cosméticos PRO | ✅ (migración aplicada; ojo: el hotfix de racha del 09-10 pisó `update_streak` y se reaplicó la versión PRO el 09-12) |

### Pendientes que bloquean el rollout completo

Revisado el 2026-09-12. Todo lo de servidor y tienda está hecho y verificado; lo
que queda es **contenido** (el catálogo PRO) y los pasos de rollout que dependen de él.

**Hecho y verificado**

- Migraciones `premium_pro_v1`, `pro_exam_v1`, `pro_review_v1`, `pro_stats_v1` y
  `pro_perks_v1`: aplicadas y registradas en el historial de producción (las tres
  `20260829*` de Aventura también, no hace falta `migration repair`).
- Webhook `revenuecat-webhook`: desplegado, secreto compartido en Supabase y en
  RevenueCat, y consulta la API v1 de RevenueCat (`REVENUECAT_API_KEY`, clave
  `supabase-webhook`) para resolver el tier real. Verificado con compras sandbox
  (lifetime y anual con trial).
- Productos en ASC y RevenueCat: `cg_pro_monthly`, `cg_pro_annual`, `cg_pro_lifetime`;
  entitlement `pro`; offering `default` current; IAP key y ASC API key válidas.
- `EXPO_PUBLIC_REVENUECAT_IOS_KEY` en el entorno `production` de EAS (lo usan
  `testflight` y `production`). Android aparcado: no hay clave Android a propósito.
- Build 92 (TestFlight) con `react-native-purchases` y el paywall completo; compra
  sandbox probada de extremo a extremo.
- Páginas de términos y privacidad publicadas con la sección de suscripción.
- Anuncios: perfil `production` en `live` con todos los placements; "Sin anuncios" es
  beneficio PRO (ver `docs/ads-inhouse.md`).

**Bloqueante: el catálogo PRO**

1. Escribir y revisar el catálogo bilingüe de **2.000 preguntas PRO** en
   `data/questions-pro-v1-2000.json` (estructura en `data/README-pro-questions.md`) y
   ejecutar `npm run build:questions:pro`, que valida y genera
   `supabase/pro_questions_seed_v1.sql`.
2. Generar el manifiesto de Aventura 201-400 (`npm run build:adventure:400`).
3. Aplicar a mano, en este orden y solo cuando la 2.2.0 esté lista para enviar:
   `supabase/pro_question_catalog_v1.sql` → `supabase/pro_questions_seed_v1.sql` →
   `supabase/adventure_400_rollout.sql`. Viven fuera de `migrations/` a propósito;
   nunca con `db push`. Las builds 2.1.x siguen operando dentro de 1-200.
4. `supabase/pro_adventure_enforcement.sql` (candado de servidor sobre las recompensas
   de Aventura) se aplica **después**, cuando la 2.2.0 lleve tiempo publicada: mientras
   haya gente en la 2.1.x su app no sabe pedir el grandfathering. Hoy no hay ningún
   usuario por encima del nivel 21, así que el riesgo real es mínimo.

**Pendientes que no son de código (los hace Pablo antes de enviar)**

- ASC: captura de revisión en los tres productos (→ "Ready to Submit"), adjuntar las
  suscripciones a la versión 2.2.0, App Privacy (Tracking: No; Purchase History
  añadido), Age Rating con compras, inscripción en el Small Business Program.
- In-House Ads: campañas reales en el panel (hoy solo `Prueba — …`) y la checklist de
  dispositivo de `docs/ads-inhouse.md` con una cuenta que no sea PRO.
- Capturas nuevas para la ficha (paywall, Sala PRO, mapa del viaje, estadísticas).
- Merge a `main`, `eas build --profile production` (autoIncrement → commitear
  `app.json`), `eas submit`.

## 7. Expectativas realistas

- Conversión esperable en trivia: **1-3 %**. Sin anuncios, todos los ingresos vienen de ahí.
- **El anual es el producto que hay que vender** (19,99 € ≈ 1,67 €/mes, 58 % de ahorro
  frente al mensual). Debe ser la opción preseleccionada y destacada en el paywall.
- El lifetime a 29,99 € equivale a 18 meses de anual: es un precio agresivo que convertirá
  bien pero **cierra el ingreso recurrente de ese usuario**. Merece la pena vigilarlo en los
  primeros meses; si se lleva demasiada cuota frente al anual, subirlo.
