# Cultura General — Descripción completa de la aplicación

## Resumen ejecutivo

**Cultura General** es una aplicación móvil educativa de trivia, construida con **React Native + Expo** y respaldada por **Supabase** (PostgreSQL + Auth). Ofrece más de 850 preguntas en 5 categorías con múltiples modos de juego, sistema de racha diaria, 12 logros desbloqueables, rankings en 4 niveles y 4 modos multijugador local.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | React Native 0.81.5 + Expo 54.0.0 |
| Lenguaje | TypeScript 5.3.0 |
| Enrutamiento | Expo Router 6.0.23 (estructura de carpetas tipo Next.js) |
| Backend / Auth | Supabase 2.45.4 (PostgreSQL + Auth) |
| Almacenamiento local | AsyncStorage 2.2.0 |
| UI / Animaciones | expo-linear-gradient, Animated API nativa, expo-haptics |
| Notificaciones | expo-notifications 0.32.16 |
| Ads | react-native-google-mobile-ads 16.3.3 (AdMob interstitial preparado en pregunta diaria, contrarreloj y aprendizaje) |
| Tipografía | Outfit (Google Fonts, 6 pesos) |
| Builds | EAS (Expo Application Services) |

---

## Estructura de directorios

```
/
├── app/                        # Rutas y pantallas (Expo Router)
│   ├── (auth)/
│   │   ├── login.tsx           # Login y registro
│   │   └── _layout.tsx
│   ├── (tabs)/
│   │   ├── index.tsx           # Pantalla de inicio
│   │   ├── daily.tsx           # Pregunta diaria + rankings
│   │   ├── speed.tsx           # Modo contrarreloj 30 seg
│   │   ├── learn.tsx           # Aprendizaje por categoría
│   │   ├── friends.tsx         # Modos multijugador
│   │   └── _layout.tsx
│   ├── profile.tsx             # Perfil de usuario
│   ├── friends-list.tsx        # Gestión de amigos
│   ├── onboarding.tsx          # Flujo de bienvenida
│   ├── privacy.tsx             # Política de privacidad
│   └── _layout.tsx             # Layout raíz con autenticación
├── lib/
│   ├── db.ts                   # Servicios Supabase + lógica de datos
│   ├── supabase.ts             # Cliente Supabase
│   ├── notifications.ts        # Notificaciones locales
│   ├── achievements.ts         # Lógica de logros
│   └── utils.ts                # Utilidades (shuffle, etc.)
├── hooks/
│   ├── useAuth.ts              # Hook de autenticación
│   └── useProfile.ts           # Hook de perfil
├── context/
│   └── ToastContext.tsx        # Notificaciones emergentes (toast)
├── components/
│   ├── OptionBtn.tsx           # Botón de opción con estados
│   ├── ErrorBoundary.tsx       # Capturador de errores
│   ├── Confetti.tsx            # Animación de confeti
│   └── CategoryBadge.tsx       # Badge de categoría
├── constants/
│   ├── questions.ts            # Base de datos local de preguntas (fallback)
│   └── colors.ts               # Paleta de colores
├── types/
│   └── index.ts                # Tipos TypeScript globales
├── supabase/
│   ├── schema.sql              # Esquema de base de datos
│   ├── seed.sql                # Datos iniciales
│   ├── questions.sql           # Preguntas Vol. 1
│   ├── questions2.sql          # Preguntas Vol. 2
│   └── friends_and_reports.sql # Tablas de amigos y reportes
└── assets/                     # Íconos y splash
```

---

## Flujo de autenticación y navegación

```
Sin sesión        →  /(auth)/login
Con sesión
  └─ No onboarded →  /onboarding  (solicita permiso de notificaciones)
  └─ Onboarded    →  /(tabs)
```

La navegación principal usa **5 tabs** en la barra inferior:

| Tab | Pantalla | Descripción |
|---|---|---|
| 🏠 Inicio | `(tabs)/index.tsx` | Dashboard con estadísticas y accesos rápidos |
| 🏆 Diario | `(tabs)/daily.tsx` | Pregunta del día + 4 rankings |
| ⚡ Rápido | `(tabs)/speed.tsx` | Contrarreloj de 30 segundos |
| 📚 Aprender | `(tabs)/learn.tsx` | Aprendizaje por categoría y dificultad |
| 👥 Amigos | `(tabs)/friends.tsx` | Modos multijugador locales |

---

## Pantallas y funcionalidades

### Inicio (`index.tsx`)
- Saludo personalizado con fecha y hora
- Widget de racha 🔥 con contador
- Estadísticas en tiempo real (respondidas, precisión, racha)
- 4 tarjetas de acceso rápido a los modos de juego
- Acceso a logros desbloqueados

### Pregunta diaria (`daily.tsx`)
- Una única pregunta diaria sincronizada para todos los usuarios
- 4 opciones de respuesta con retroalimentación inmediata
- Contexto educativo si la respuesta es incorrecta
- Confeti animado si se acierta
- Botón para compartir el resultado
- Reporte de preguntas problemáticas (botón ⚑)
- 4 Rankings:
  - 🗓️ **Hoy**: puntos del día (0 o 100)
  - 📅 **Semana**: suma acumulativa semanal
  - 🌍 **Global**: total histórico de aciertos
  - 👥 **Amigos**: solo usuarios con relación de amistad aceptada
  - Medallas 🥇🥈🥉 para el top 3, top 50 visible

### Contrarreloj (`speed.tsx`)
- Timer de 30 segundos
- Responder el máximo de preguntas posibles
- Almacena el récord personal (`speed_record`)
- Preguntas de todas las categorías mezcladas
- Fallback a base local si no hay conexión
- Transición suave entre preguntas (500 ms)

### Aprender (`learn.tsx`)
- Selección de categoría: Historia, Geografía, Ciencia, Arte, Filosofía
- Filtro de dificultad: Todas / Fácil / Media / Difícil
- Explicaciones detalladas (`context`) cuando se falla
- Pool infinito (cicla las preguntas)
- Acumula estadísticas de aprendizaje

### Amigos — Modos multijugador (`friends.tsx`)
| Modo | Descripción |
|---|---|
| 📱 Pasa el Móvil | 30 seg por jugador, mismas preguntas |
| ⚔️ Duelo 1vs1 | El primero en acertar gana |
| 💀 Superviviente | Eliminación gradual, el último gana |
| 🧩 Trivia Night | Equipos alternados, 20 preguntas |

### Gestión de amigos (`friends-list.tsx`)
- Búsqueda de usuarios por nombre (mín. 2 caracteres)
- Estados: ninguno / solicitud enviada / solicitud recibida / aceptado
- Enviar, aceptar y rechazar solicitudes

### Perfil (`profile.tsx`)
- Avatar + nombre de usuario editable
- Estadísticas globales (respondidas, precisión, racha actual, mejor racha)
- 12 logros desbloqueables con progreso visual
- Historial de las últimas 15 respuestas
- Gráfico de categorías por aciertos / total
- Toggle de notificaciones diarias
- Cerrar sesión

---

## Sistema de racha

- Se incrementa si se responde correctamente la pregunta diaria
- Se mantiene en 1 si se responde pero se falla
- Se resetea a 0 si se salta un día
- `streak` = racha actual, `best_streak` = máxima histórica
- Actualización automática mediante función SQL `update_streak(p_user_id)`

---

## Sistema de logros (12 en total)

| Categoría | Logro | Condición |
|---|---|---|
| Preguntas respondidas | Primera | 1 pregunta |
| | Estudiante | 10 preguntas |
| | Erudito | 100 preguntas |
| | Genio | 500 preguntas |
| Racha | En racha | 3 días |
| | Imparable | 7 días |
| | Leyenda | 30 días |
| Precisión | Preciso | 80 % de aciertos (mín. 20 resp.) |
| | Perfeccionista | 95 % de aciertos (mín. 50 resp.) |
| Velocidad | Velocista | 5 aciertos en 30 seg |
| | Cohete | 10 aciertos en 30 seg |
| | Campeón | 20 aciertos en 30 seg |

---

## Base de datos (Supabase PostgreSQL)

### Tablas principales

**`profiles`** — Extiende `auth.users`
```sql
id            UUID (PK → auth.users)
username      TEXT UNIQUE
avatar_url    TEXT
streak        INT
best_streak   INT
total_correct INT
total_answered INT
speed_record  INT
created_at    TIMESTAMPTZ
```

**`questions`** — 850+ preguntas
```sql
id            UUID (PK)
category      TEXT  -- historia | geografia | ciencia | arte | filosofia
question      TEXT
options       JSONB  -- array de 4 opciones
answer_index  INT    -- 0-3
context       TEXT   -- explicación opcional
difficulty    TEXT   -- easy | medium | hard
active        BOOLEAN
created_at    TIMESTAMPTZ
```

**`daily_questions`**
```sql
id            UUID (PK)
question_id   FK → questions
date          DATE UNIQUE
```

**`user_answers`**
```sql
id             UUID (PK)
user_id        FK → auth.users
question_id    FK → questions
selected_index INT
is_correct     BOOLEAN
mode           TEXT  -- daily | speed | learn
answered_at    TIMESTAMPTZ
```

**`daily_rankings`**
```sql
id           UUID (PK)
user_id      FK → auth.users
date         DATE
score        INT  -- 0 o 100
answered_at  TIMESTAMPTZ
UNIQUE (user_id, date)
```

**`friendships`**
```sql
id          UUID (PK)
user_id     FK → auth.users
friend_id   FK → auth.users
status      TEXT  -- pending | accepted
created_at  TIMESTAMPTZ
UNIQUE (user_id, friend_id)
```

**`question_reports`**
```sql
user_id     FK → auth.users
question_id FK → questions
reason      TEXT  -- incorrect | confusing | duplicate | other
UNIQUE (user_id, question_id)
```

### Funciones SQL
- `handle_new_user()` — trigger que crea el perfil al registrarse
- `update_streak(p_user_id)` — incrementa o resetea la racha según fecha
- `get_weekly_ranking()` — RPC que calcula el ranking semanal

### Seguridad
- Row Level Security (RLS) habilitado en todas las tablas
- Cada usuario solo ve y modifica sus propios datos
- Las preguntas y rankings son legibles por todos los usuarios autenticados

---

## Sistema de notificaciones

- Notificación local diaria a las **9:00 AM**
- Permiso solicitado en el onboarding
- Toggle en el perfil para activar/desactivar
- Mensaje: "Tu pregunta del día te espera"
- Canal de Android configurado
- Comportamiento degradado en Expo Go (iOS): notificaciones desactivadas con fallback silencioso

---

## Caché y modo offline

- TTL de **6 horas** para preguntas por categoría en AsyncStorage
- Fallback automático a base de datos local (`constants/questions.ts`) si la API falla
- El modo contrarreloj funciona completamente sin conexión

---

## Diseño visual

| Elemento | Valor |
|---|---|
| Tema | Dark mode obligatorio |
| Fondo | `#0a0a0a` |
| Primario (naranja/dorado) | `#e8a030` |
| Secundario (rosa/rojo) | `#e83060` |
| Éxito (verde) | `#2ec87a` |
| Velocidad (púrpura) | `#a030e8` |
| Amigos (azul) | `#30a8e8` |
| Tipografía | Outfit (Light → ExtraBold) |
| Border radius | 14–20 px |
| Animaciones | Confeti en aciertos, transiciones slide 250 ms |
| Feedback | Haptics (success / error) + Toast notifications |

---

## Variables de entorno necesarias

```env
EXPO_PUBLIC_SUPABASE_URL=<url-del-proyecto-supabase>
EXPO_PUBLIC_SUPABASE_ANON_KEY=<clave-anonima-supabase>
```

---

## Comandos disponibles

```bash
npm run start      # Inicia el servidor de desarrollo Expo
npm run android    # Abre en emulador/dispositivo Android
npm run ios        # Abre en simulador/dispositivo iOS
npm run web        # Abre en navegador web
```

---

## Configuración Expo / EAS

- **Project ID**: `c320cb92-68f2-4474-9414-750921c2ac79`
- **Bundle ID iOS**: `com.pablobrasero.culturageneral`
- **Package Android**: `com.pablobrasero.culturageneral`
- **SDK**: Expo managed workflow
- **Soporte**: iOS 16+, Android 6+

---

## Flujo de datos resumido

```
Login (Supabase Auth)
  └→ useAuth → session
  └→ useProfile → perfil desde DB

Responder una pregunta
  1. Guardar en user_answers
  2. Actualizar total_answered / total_correct en profiles
  3. Si es diario: upsert en daily_rankings + update_streak()
  4. Toast feedback + haptics + confeti (si correcto)
  5. Refrescar UI
```
