import AsyncStorage from '@react-native-async-storage/async-storage';

export const GUEST_STORAGE_KEY = 'guest_mode_v1';
export const GUEST_SPEED_RECORD_KEY = 'guest_speed_record_v1';
export const GUEST_LADDER_BEST_KEY = 'guest_ladder_best_v1';
// Récord de Contrarreloj guardado en el dispositivo para partidas jugadas sin
// conexión (usuarios con cuenta que juegan offline). No se sincroniza.
export const LOCAL_SPEED_RECORD_KEY = 'local_speed_record_v1';
export const LOCAL_LADDER_BEST_KEY = 'local_ladder_best_v1';

type Listener = (isGuest: boolean) => void;
const listeners = new Set<Listener>();

export async function isGuest(): Promise<boolean> {
  const value = await AsyncStorage.getItem(GUEST_STORAGE_KEY);
  return value === 'true';
}

export async function setGuestMode(enabled: boolean): Promise<void> {
  if (enabled) {
    await AsyncStorage.setItem(GUEST_STORAGE_KEY, 'true');
  } else {
    await AsyncStorage.removeItem(GUEST_STORAGE_KEY);
  }
  listeners.forEach(l => l(enabled));
}

export function subscribeGuestMode(listener: Listener): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export async function getGuestSpeedRecord(): Promise<number> {
  const raw = await AsyncStorage.getItem(GUEST_SPEED_RECORD_KEY);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) ? n : 0;
}

export async function setGuestSpeedRecord(score: number): Promise<void> {
  await AsyncStorage.setItem(GUEST_SPEED_RECORD_KEY, String(score));
}

// ─── Récord local (modo sin conexión, usuario con cuenta) ─────

export async function getLocalSpeedRecord(): Promise<number> {
  const raw = await AsyncStorage.getItem(LOCAL_SPEED_RECORD_KEY);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) ? n : 0;
}

export async function setLocalSpeedRecord(score: number): Promise<void> {
  await AsyncStorage.setItem(LOCAL_SPEED_RECORD_KEY, String(score));
}

// ─── Récord de Modo Ascenso (invitado / offline) ──────────────

export async function getGuestLadderBest(): Promise<number> {
  const raw = await AsyncStorage.getItem(GUEST_LADDER_BEST_KEY);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) ? n : 0;
}

export async function setGuestLadderBest(floor: number): Promise<void> {
  await AsyncStorage.setItem(GUEST_LADDER_BEST_KEY, String(floor));
}

export async function getLocalLadderBest(): Promise<number> {
  const raw = await AsyncStorage.getItem(LOCAL_LADDER_BEST_KEY);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) ? n : 0;
}

export async function setLocalLadderBest(floor: number): Promise<void> {
  await AsyncStorage.setItem(LOCAL_LADDER_BEST_KEY, String(floor));
}

export async function clearGuestData(): Promise<void> {
  await AsyncStorage.multiRemove([GUEST_STORAGE_KEY, GUEST_SPEED_RECORD_KEY, GUEST_LADDER_BEST_KEY]);
  listeners.forEach(l => l(false));
}
