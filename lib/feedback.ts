// ─── Feedback jugoso: haptics (+ sonido futuro) centralizados ──────────────
//
// Un único punto de entrada para el feedback táctil/sonoro de toda la app, de
// forma que:
//   1. los ajustes on/off vivan en un solo sitio (persistidos),
//   2. las llamadas sean síncronas y "fire-and-forget" (no bloquean la UI),
//   3. el sonido pueda enchufarse más adelante (expo-audio, nuevo build) sin
//      tocar los sitios que ya llaman a esta API.
//
// Uso: `import { feedback } from '@/lib/feedback'` y luego `feedback.correct()`.

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

const HAPTICS_KEY = 'feedback_haptics_v1';
const SOUND_KEY = 'feedback_sound_v1';

// Caché en memoria para permitir llamadas síncronas. Se hidrata en initFeedback()
// al arrancar; por defecto ambos activos.
let hapticsEnabled = true;
let soundEnabled = true;

// Hidrata los flags desde disco. Llamar una vez al arrancar (app/_layout).
export async function initFeedback(): Promise<void> {
  try {
    const [h, s] = await Promise.all([
      AsyncStorage.getItem(HAPTICS_KEY),
      AsyncStorage.getItem(SOUND_KEY),
    ]);
    // null (nunca configurado) => se mantiene el default true.
    if (h !== null) hapticsEnabled = h === 'true';
    if (s !== null) soundEnabled = s === 'true';
  } catch {
    // Si falla la lectura, seguimos con los defaults en memoria.
  }
}

export function isHapticsEnabled(): boolean {
  return hapticsEnabled;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export async function setHapticsEnabled(value: boolean): Promise<void> {
  hapticsEnabled = value;
  try {
    await AsyncStorage.setItem(HAPTICS_KEY, value ? 'true' : 'false');
  } catch {
    // best-effort: el valor en memoria ya está aplicado para esta sesión.
  }
}

export async function setSoundEnabled(value: boolean): Promise<void> {
  soundEnabled = value;
  try {
    await AsyncStorage.setItem(SOUND_KEY, value ? 'true' : 'false');
  } catch {
    // best-effort.
  }
}

// ─── Sonido (stub) ─────────────────────────────────────────────────────────
// De momento no-op: no hay dependencia de audio en el binario. Cuando se añada
// expo-audio + assets, implementar aquí la reproducción y respetar soundEnabled.
export type SoundName = 'tap' | 'correct' | 'wrong' | 'combo' | 'reward' | 'levelup';

function playSound(_name: SoundName): void {
  if (!soundEnabled) return;
  // TODO(sonido): reproducir el clip `_name` con expo-audio (requiere build nativo).
}

// ─── Haptics (activos ya) ──────────────────────────────────────────────────
function tapHaptic(style: Haptics.ImpactFeedbackStyle): void {
  if (!hapticsEnabled) return;
  Haptics.impactAsync(style).catch(() => {});
}

function notifyHaptic(type: Haptics.NotificationFeedbackType): void {
  if (!hapticsEnabled) return;
  Haptics.notificationAsync(type).catch(() => {});
}

// ─── API semántica ─────────────────────────────────────────────────────────
// Cada método combina el haptic apropiado con el sonido (futuro) equivalente.
// Los sitios de la app llaman a estos verbos, no a Haptics directamente.
export const feedback = {
  // Pulsación de un elemento interactivo (opción, botón).
  tap(): void {
    tapHaptic(Haptics.ImpactFeedbackStyle.Light);
    playSound('tap');
  },
  // Selección/cambio de estado ligero (chips, toggles).
  select(): void {
    if (!hapticsEnabled) return;
    Haptics.selectionAsync().catch(() => {});
  },
  // Respuesta correcta.
  correct(): void {
    notifyHaptic(Haptics.NotificationFeedbackType.Success);
    playSound('correct');
  },
  // Respuesta incorrecta.
  wrong(): void {
    notifyHaptic(Haptics.NotificationFeedbackType.Error);
    playSound('wrong');
  },
  // Combo de aciertos consecutivos (más contundente cuanto mayor el combo).
  combo(count: number): void {
    tapHaptic(
      count >= 5
        ? Haptics.ImpactFeedbackStyle.Heavy
        : Haptics.ImpactFeedbackStyle.Medium,
    );
    playSound('combo');
  },
  // Recompensa (cofre, misión, recompensa inicial).
  reward(): void {
    notifyHaptic(Haptics.NotificationFeedbackType.Success);
    playSound('reward');
  },
  // Subida de nivel.
  levelUp(): void {
    notifyHaptic(Haptics.NotificationFeedbackType.Success);
    playSound('levelup');
  },
};
