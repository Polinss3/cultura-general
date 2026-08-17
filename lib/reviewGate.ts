// ─── Portero global de la valoración en tienda ──────────────────────────────
//
// iOS solo muestra el diálogo de `SKStoreReviewController` 3 veces por año y
// por instalación, y `requestReview()` NO informa de si llegó a verse: cada
// llamada gasta un intento aunque el usuario no vea nada. Por eso el listón
// para pedirla es alto y vive aquí, centralizado, en vez de en cada pantalla
// que quiera pedirla: así dos sitios distintos nunca se pisan el turno.
//
// El estado es por dispositivo (no por usuario), porque el límite de la
// plataforma también lo es: cambiar de cuenta no debe regalar intentos.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import * as StoreReview from 'expo-store-review';

const STORAGE_KEY = 'review_gate_v1';

const DAY_MS = 86_400_000;
const YEAR_MS = 365 * DAY_MS;

// Días de vida de la instalación antes de pedir nada: quien lleva menos de una
// semana todavía no sabe si la app le gusta.
const MIN_DAYS_SINCE_FIRST_OPEN = 7;
// Separación entre peticiones. Con 3 intentos anuales, 120 días los reparte sin
// riesgo de agotarlos en un mes.
const MIN_DAYS_BETWEEN_REQUESTS = 120;
const MAX_REQUESTS_PER_YEAR = 3;
// Enfriamiento tras una señal negativa (reportar una pregunta, por ejemplo):
// quien acaba de avisarnos de un fallo no es a quien pedirle 5 estrellas.
const NEGATIVE_SIGNAL_COOLDOWN_DAYS = 14;

interface GateState {
  firstOpenAt: number | null;
  requestedAt: number[];   // marcas de tiempo, la más reciente al final
  blockedUntil: number;
}

function emptyState(): GateState {
  return { firstOpenAt: null, requestedAt: [], blockedUntil: 0 };
}

function parseState(raw: string | null): GateState {
  if (!raw) return emptyState();
  try {
    const parsed = JSON.parse(raw) as Partial<GateState>;
    return {
      firstOpenAt: typeof parsed.firstOpenAt === 'number' ? parsed.firstOpenAt : null,
      requestedAt: Array.isArray(parsed.requestedAt)
        ? parsed.requestedAt.filter((n): n is number => typeof n === 'number')
        : [],
      blockedUntil: typeof parsed.blockedUntil === 'number' ? parsed.blockedUntil : 0,
    };
  } catch {
    return emptyState();
  }
}

async function loadState(): Promise<GateState> {
  return parseState(await AsyncStorage.getItem(STORAGE_KEY));
}

async function saveState(state: GateState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function isEligible(state: GateState, now: number): boolean {
  if (state.blockedUntil > now) return false;

  // Sin fecha de primera apertura no sabemos la antigüedad: mejor no pedir.
  if (state.firstOpenAt === null) return false;
  if (now - state.firstOpenAt < MIN_DAYS_SINCE_FIRST_OPEN * DAY_MS) return false;

  const lastYear = state.requestedAt.filter(ts => now - ts < YEAR_MS);
  if (lastYear.length >= MAX_REQUESTS_PER_YEAR) return false;

  const last = lastYear[lastYear.length - 1];
  if (last !== undefined && now - last < MIN_DAYS_BETWEEN_REQUESTS * DAY_MS) return false;

  return true;
}

/**
 * Registra la primera apertura de la app. Idempotente: solo escribe la primera
 * vez. Se llama al arrancar para que "días desde la instalación" sea real y no
 * dependa de cuándo se consultó el portero por primera vez.
 */
export async function noteAppOpen(): Promise<void> {
  try {
    const state = await loadState();
    if (state.firstOpenAt !== null) return;
    await saveState({ ...state, firstOpenAt: Date.now() });
  } catch {
    // Best-effort: el portero simplemente no abrirá hasta que se registre.
  }
}

/**
 * Aplaza cualquier petición durante unos días tras una señal negativa (reportar
 * una pregunta, por ejemplo).
 */
export async function noteReviewBlocker(
  days = NEGATIVE_SIGNAL_COOLDOWN_DAYS,
): Promise<void> {
  try {
    const state = await loadState();
    const until = Date.now() + days * DAY_MS;
    if (state.blockedUntil >= until) return;
    await saveState({ ...state, blockedUntil: until });
  } catch {
    // Best-effort.
  }
}

/**
 * ¿Permite el portero pedir la valoración ahora mismo? Solo consulta, no gasta
 * intento. Sirve para decidir por adelantado (por ejemplo, para suprimir un
 * intersticial que competiría con el diálogo) antes de pedirla de verdad.
 */
export async function isReviewGateOpen(): Promise<boolean> {
  try {
    return isEligible(await loadState(), Date.now());
  } catch {
    return false;
  }
}

/**
 * Pide la valoración si el portero lo permite y la app está en primer plano.
 * Devuelve `true` si se llegó a llamar a la API nativa (que es lo máximo que se
 * puede saber: el sistema decide si el diálogo se ve).
 */
export async function requestReviewIfAllowed(): Promise<boolean> {
  try {
    // El diálogo solo tiene sentido con la app delante; si no, gastaríamos un
    // intento en balde.
    if (AppState.currentState !== 'active') return false;

    const now = Date.now();
    const state = await loadState();
    if (!isEligible(state, now)) return false;
    if (!(await StoreReview.isAvailableAsync())) return false;

    await StoreReview.requestReview();

    await saveState({
      ...state,
      requestedAt: [...state.requestedAt.filter(ts => now - ts < YEAR_MS), now],
    });
    return true;
  } catch {
    // Pedir valoración es best-effort y nunca debe romper el flujo que la llama.
    return false;
  }
}
