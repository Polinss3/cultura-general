import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category } from '@/types';
import { awardProgress, AwardResult } from './gamification';
import { REWARDS } from './economy';

export const ONBOARDED_STORAGE_KEY = 'onboarded_v1';
export const INTERESTS_STORAGE_KEY = 'onboarding_interests_v1';
// Versión del flujo de onboarding. Subirla obliga a repetirlo en la primera
// apertura tras actualizar. v2 (app 2.0.0) añade la elección de tema
// claro/oscuro y el aviso obligatorio de edad y publicidad.
export const ONBOARDING_VERSION = 2;
// La recompensa de bienvenida se marca "pendiente" al terminar el onboarding y
// se concede vía servidor la primera vez que hay sesión (así el invitado que
// luego crea cuenta también la recibe, exactamente una vez).
export const WELCOME_REWARD_PENDING_KEY = 'welcome_reward_pending_v1';

/**
 * Versión del onboarding que el usuario completó; 0 si nunca lo hizo.
 * El valor legado `'true'` (apps anteriores a 2.0.0) equivale a la v1.
 */
export async function getCompletedOnboardingVersion(): Promise<number> {
  const value = await AsyncStorage.getItem(ONBOARDED_STORAGE_KEY);
  if (value === 'true') return 1;
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export async function getOnboardingCompleted(): Promise<boolean> {
  return (await getCompletedOnboardingVersion()) >= ONBOARDING_VERSION;
}

export async function setOnboardingCompleted(completed: boolean): Promise<void> {
  await AsyncStorage.setItem(ONBOARDED_STORAGE_KEY, completed ? String(ONBOARDING_VERSION) : '0');
}

// ─── Intereses (categorías favoritas elegidas en el onboarding) ────────────
// Se usan para personalizar la experiencia (p. ej. futuro hub diario). Guardar
// como JSON; tolerar valores corruptos devolviendo lista vacía.
export async function getInterests(): Promise<Category[]> {
  try {
    const raw = await AsyncStorage.getItem(INTERESTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function setInterests(cats: Category[]): Promise<void> {
  await AsyncStorage.setItem(INTERESTS_STORAGE_KEY, JSON.stringify(cats));
}

// ─── Recompensa de bienvenida ──────────────────────────────────────────────
export async function markWelcomeRewardPending(): Promise<void> {
  await AsyncStorage.setItem(WELCOME_REWARD_PENDING_KEY, 'true');
}

export async function isWelcomeRewardPending(): Promise<boolean> {
  return (await AsyncStorage.getItem(WELCOME_REWARD_PENDING_KEY)) === 'true';
}

export async function clearWelcomeRewardPending(): Promise<void> {
  await AsyncStorage.removeItem(WELCOME_REWARD_PENDING_KEY);
}

// Concede la recompensa de bienvenida si está pendiente y hay sesión activa.
// Devuelve el AwardResult para celebrarlo, o null si no había nada que dar o
// no se pudo (invitado / offline): en ese caso el flag sigue pendiente y se
// reintentará más adelante (p. ej. al entrar a la home ya autenticado).
export async function grantWelcomeRewardIfPending(): Promise<AwardResult | null> {
  if (!(await isWelcomeRewardPending())) return null;
  const award = await awardProgress(
    REWARDS.welcomeBonus.xp,
    REWARDS.welcomeBonus.coins,
    false, // sin multiplicador: aún no hay racha
    'onboarding_welcome',
  );
  if (award) await clearWelcomeRewardPending();
  return award;
}
