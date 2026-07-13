import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';

const STORAGE_KEY_PREFIX = 'store_review_daily_v1_';

type ReviewCadence = 3 | 4;

interface ReviewState {
  lastCompletionDate: string | null;
  completionDaysSincePrompt: number;
  nextPromptAfterDays: ReviewCadence;
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
 * Records one completed question-of-the-day per local calendar day. Once the
 * randomized 3-4 day cadence has elapsed, it requests the native rating dialog
 * only after a correct answer. A wrong answer never triggers the dialog; it
 * simply defers the request until a later correct daily answer.
 *
 * The OS ultimately decides whether the native dialog is displayed. Returning
 * true means the app requested it, so callers can avoid showing another modal
 * (such as an interstitial) at the same time.
 */
export async function requestReviewAfterDailyCompletion(
  userId: string,
  correct: boolean,
  completionDate = localDateString(),
): Promise<boolean> {
  const storageKey = STORAGE_KEY_PREFIX + userId;

  try {
    const state = parseState(await AsyncStorage.getItem(storageKey));

    // Protect against duplicate calls or reopening today's completed quiz.
    if (state.lastCompletionDate === completionDate) return false;

    const completedState: ReviewState = {
      ...state,
      lastCompletionDate: completionDate,
      completionDaysSincePrompt: state.completionDaysSincePrompt + 1,
    };

    // Persist before invoking the native UI so today's completion stays
    // idempotent even if the app is backgrounded by the store dialog.
    await AsyncStorage.setItem(storageKey, JSON.stringify(completedState));

    const isDue = completedState.completionDaysSincePrompt >= completedState.nextPromptAfterDays;
    if (!correct || !isDue || !(await StoreReview.isAvailableAsync())) return false;

    await StoreReview.requestReview();

    // A fresh randomized cadence prevents a rigid, predictable interruption.
    await AsyncStorage.setItem(storageKey, JSON.stringify({
      lastCompletionDate: completionDate,
      completionDaysSincePrompt: 0,
      nextPromptAfterDays: randomCadence(),
    } satisfies ReviewState));

    return true;
  } catch {
    // Rating is best-effort and must never interrupt completion of the quiz.
    return false;
  }
}
