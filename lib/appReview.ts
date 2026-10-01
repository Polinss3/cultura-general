import AsyncStorage from '@react-native-async-storage/async-storage';
import { isReviewGateOpen, requestReviewIfAllowed } from './reviewGate';

const STORAGE_KEY_PREFIX = 'store_review_daily_v1_';

type ReviewCadence = 3 | 4;

/**
 * How long to wait after the ranking screen appears before showing the native
 * dialog. The screen has to be mounted and still — iOS silently drops the
 * prompt while a transition or another modal is on top — and the "+XP / +coins"
 * banner lasts 2.2s, so we let it finish first.
 */
export const REVIEW_PROMPT_DELAY_MS = 2600;

/**
 * Minimum daily streak. The per-day counter below already implies commitment,
 * but an active streak is the strongest signal that the habit stuck.
 */
const MIN_STREAK = 3;

interface ReviewState {
  lastCompletionDate: string | null;
  completionDaysSincePrompt: number;
  nextPromptAfterDays: ReviewCadence;
}

interface DailyReviewSignals {
  correct: boolean;
  /** Current daily streak, or undefined when it could not be read. */
  streak?: number;
  /** A level-up opens its own modal; iOS will not stack the prompt on top. */
  leveledUp?: boolean;
}

function randomCadence(): ReviewCadence {
  return Math.random() < 0.5 ? 3 : 4;
}

function emptyState(): ReviewState {
  return {
    lastCompletionDate: null,
    completionDaysSincePrompt: 0,
    nextPromptAfterDays: randomCadence(),
  };
}

function localDateString(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseState(raw: string | null): ReviewState {
  if (!raw) return emptyState();

  try {
    const parsed = JSON.parse(raw) as Partial<ReviewState>;
    const nextPromptAfterDays = parsed.nextPromptAfterDays === 4 ? 4 : 3;
    return {
      lastCompletionDate: typeof parsed.lastCompletionDate === 'string'
        ? parsed.lastCompletionDate
        : null,
      completionDaysSincePrompt: Number.isInteger(parsed.completionDaysSincePrompt)
        && (parsed.completionDaysSincePrompt ?? 0) >= 0
        ? parsed.completionDaysSincePrompt as number
        : 0,
      nextPromptAfterDays,
    };
  } catch {
    return emptyState();
  }
}

/**
 * Records one completed question-of-the-day per local calendar day and decides
 * whether this is the moment to ask for a rating.
 *
 * It never shows the dialog itself: it returns a trigger the caller fires once
 * the ranking screen has settled (see REVIEW_PROMPT_DELAY_MS), or null when the
 * moment is not right. Deciding up front lets the caller suppress the
 * interstitial that would otherwise compete with the native dialog.
 *
 * The ask requires all of: a correct answer, the randomized 3-4 day cadence
 * elapsed, a live streak, no level-up modal in the way, and the global
 * `reviewGate` allowing it. A wrong answer never triggers the dialog; it simply
 * defers the request until a later correct daily answer.
 */
export async function planReviewAfterDailyCompletion(
  userId: string,
  signals: DailyReviewSignals,
  completionDate = localDateString(),
): Promise<(() => Promise<void>) | null> {
  const storageKey = STORAGE_KEY_PREFIX + userId;

  try {
    const state = parseState(await AsyncStorage.getItem(storageKey));

    // Protect against duplicate calls or reopening today's completed quiz.
    if (state.lastCompletionDate === completionDate) return null;

    const completedState: ReviewState = {
      ...state,
      lastCompletionDate: completionDate,
      completionDaysSincePrompt: state.completionDaysSincePrompt + 1,
    };

    // Persist before anything else so today's completion stays idempotent even
    // if the app is backgrounded before the prompt fires.
    await AsyncStorage.setItem(storageKey, JSON.stringify(completedState));

    const isDue = completedState.completionDaysSincePrompt >= completedState.nextPromptAfterDays;
    // An unknown streak must not block the ask: the per-day counter above is
    // already a commitment signal on its own.
    const streakOk = (signals.streak ?? MIN_STREAK) >= MIN_STREAK;
    if (!signals.correct || !isDue || !streakOk || signals.leveledUp) return null;

    // The cadence is deliberately NOT reset when the gate is closed, so the ask
    // happens on the next completed day once the gate opens again.
    if (!(await isReviewGateOpen())) return null;

    return async () => {
      try {
        if (!(await requestReviewIfAllowed())) return;

        // A fresh randomized cadence prevents a rigid, predictable interruption.
        await AsyncStorage.setItem(storageKey, JSON.stringify({
          lastCompletionDate: completionDate,
          completionDaysSincePrompt: 0,
          nextPromptAfterDays: randomCadence(),
        } satisfies ReviewState));
      } catch {
        // Rating is best-effort and must never interrupt the quiz.
      }
    };
  } catch {
    // Rating is best-effort and must never interrupt completion of the quiz.
    return null;
  }
}

// ─── Otros momentos: Aventura y Retos ────────────────────────────────────────
//
// La pregunta del día es el mejor momento, pero mucha gente vive en Aventura o
// en los Retos. Cada hito pasa por el mismo `reviewGate`, así que entre los
// tres nunca se piden más de lo que iOS permite; lo único que cambia es la
// cadencia local de cada uno (cuántos hitos "buenos" seguidos hacen falta).

export type ReviewMilestone = 'adventure' | 'challenge';

const MILESTONE_KEY_PREFIX = 'store_review_milestone_v1_';

// Hitos que cualifican (3 estrellas, guardián vencido, ronda casi perfecta o
// récord) antes de preguntar. Aleatorio dentro del rango para que no se sienta
// mecánico.
const MILESTONE_CADENCE: Record<ReviewMilestone, [number, number]> = {
  adventure: [2, 3],
  challenge: [3, 4],
};

interface MilestoneState {
  count: number;
  nextAfter: number;
}

function randomBetween(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function parseMilestoneState(raw: string | null, kind: ReviewMilestone): MilestoneState {
  const [min, max] = MILESTONE_CADENCE[kind];
  const fallback = { count: 0, nextAfter: randomBetween(min, max) };
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as Partial<MilestoneState>;
    const count = Number.isInteger(parsed.count) && (parsed.count ?? 0) >= 0 ? parsed.count as number : 0;
    const nextAfter = Number.isInteger(parsed.nextAfter) && (parsed.nextAfter ?? 0) >= min
      ? parsed.nextAfter as number
      : fallback.nextAfter;
    return { count, nextAfter };
  } catch {
    return fallback;
  }
}

interface MilestoneSignals {
  /** El hito ha sido de los buenos (3 estrellas, guardián, ronda ≥ 80 %, récord). */
  qualifies: boolean;
  /** Algo va a tapar la pantalla (subida de nivel, modal de capítulo). */
  blocked?: boolean;
}

/**
 * Cuenta un hito bueno de Aventura o Retos y devuelve el disparador si toca
 * pedir valoración (o null). Mismo contrato que
 * `planReviewAfterDailyCompletion`: se decide antes de lanzar un intersticial
 * y se dispara con la pantalla de resultado quieta (REVIEW_PROMPT_DELAY_MS).
 * El contador es por dispositivo, como el portero.
 */
export async function planReviewAfterMilestone(
  kind: ReviewMilestone,
  signals: MilestoneSignals,
): Promise<(() => Promise<void>) | null> {
  if (!signals.qualifies) return null;
  const storageKey = MILESTONE_KEY_PREFIX + kind;

  try {
    const state = parseMilestoneState(await AsyncStorage.getItem(storageKey), kind);
    const counted: MilestoneState = { ...state, count: state.count + 1 };
    await AsyncStorage.setItem(storageKey, JSON.stringify(counted));

    if (counted.count < counted.nextAfter || signals.blocked) return null;
    if (!(await isReviewGateOpen())) return null;

    return async () => {
      try {
        if (!(await requestReviewIfAllowed())) return;
        const [min, max] = MILESTONE_CADENCE[kind];
        await AsyncStorage.setItem(storageKey, JSON.stringify({
          count: 0,
          nextAfter: randomBetween(min, max),
        } satisfies MilestoneState));
      } catch {
        // Best-effort: nunca interrumpe el juego.
      }
    };
  } catch {
    return null;
  }
}
