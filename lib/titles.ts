// ─── Títulos equipables (perfil aspiracional) ───────────────────────────────
//
// Colección de títulos que el usuario desbloquea al alcanzar hitos. Puede
// equipar uno, que se muestra bajo su nombre en el perfil (la "vitrina"). Todo
// es derivado de las stats que ya tiene el perfil; lo único persistido es el id
// del título equipado (local, no economía).

import AsyncStorage from '@react-native-async-storage/async-storage';

export const EQUIPPED_TITLE_KEY = 'equipped_title_v1';

export interface TitleStats {
  total_answered?: number;
  total_correct?: number;
  best_streak?: number;
  speed_record?: number;
  level?: number;
  ladder_best?: number;
}

export interface Title {
  id: string;      // clave i18n bajo `titles.items.<id>`
  icon: string;
  color: string;
  unlocked: boolean;
}

// Definición de títulos (id, icono, color y condición de desbloqueo).
export function computeTitles(stats: TitleStats | null): Title[] {
  const answered = stats?.total_answered ?? 0;
  const correct = stats?.total_correct ?? 0;
  const bestStreak = stats?.best_streak ?? 0;
  const speedRecord = stats?.speed_record ?? 0;
  const level = stats?.level ?? 1;
  const ladderBest = stats?.ladder_best ?? 0;
  const accuracy = answered > 0 ? correct / answered : 0;

  const list: Title[] = [
    { id: 'curioso',    icon: '🔍', color: '#5b8def', unlocked: answered >= 1 },
    { id: 'estudioso',  icon: '📚', color: '#2ec87a', unlocked: answered >= 100 },
    { id: 'erudito',    icon: '🧠', color: '#a030e8', unlocked: answered >= 500 },
    { id: 'imparable',  icon: '🔥', color: '#e8a030', unlocked: bestStreak >= 7 },
    { id: 'constante',  icon: '📅', color: '#e83060', unlocked: bestStreak >= 30 },
    { id: 'rayo',       icon: '⚡', color: '#a030e8', unlocked: speedRecord >= 15 },
    { id: 'escalador',  icon: '🧗', color: '#30a8e8', unlocked: ladderBest >= 10 },
    { id: 'sabelotodo', icon: '🎓', color: '#2ec87a', unlocked: answered >= 50 && accuracy >= 0.9 },
    { id: 'leyenda',    icon: '👑', color: '#ffd700', unlocked: level >= 50 },
  ];
  return list;
}

export function unlockedTitles(stats: TitleStats | null): Title[] {
  return computeTitles(stats).filter(tt => tt.unlocked);
}

export function findTitle(stats: TitleStats | null, id: string | null): Title | null {
  if (!id) return null;
  return computeTitles(stats).find(tt => tt.id === id) ?? null;
}

// ─── Persistencia del título equipado ───────────────────────────────────────
export async function getEquippedTitle(): Promise<string | null> {
  return AsyncStorage.getItem(EQUIPPED_TITLE_KEY);
}

export async function setEquippedTitle(id: string | null): Promise<void> {
  if (id) await AsyncStorage.setItem(EQUIPPED_TITLE_KEY, id);
  else await AsyncStorage.removeItem(EQUIPPED_TITLE_KEY);
}
