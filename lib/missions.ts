// ─── Misiones diarias ─────────────────────────────────────────
// Set determinístico por fecha (mismo para todos). El progreso y el
// reclamo viven en el servidor (user_missions); aquí solo definimos
// el catálogo y la selección del día.

export type MissionKind =
  | 'learn_answer'
  | 'learn_correct'
  | 'speed_correct'
  | 'speed_play'
  | 'daily_play'
  | 'ladder_floor'
  | 'ladder_play'
  | 'coins_earned';

export interface Mission {
  id: string;
  title: string;
  icon: string;
  goal: number;
  kind: MissionKind;
}

const POOL: Mission[] = [
  { id: 'm_learn_10',       title: 'Responde 10 en Aprender',        icon: '📚', goal: 10, kind: 'learn_answer' },
  { id: 'm_learn_correct8', title: 'Acierta 8 en Aprender',          icon: '✅', goal: 8,  kind: 'learn_correct' },
  { id: 'm_speed_6',        title: 'Acierta 6 en Contrarreloj',      icon: '⚡', goal: 6,  kind: 'speed_correct' },
  { id: 'm_speed_play2',    title: 'Juega 2 Contrarrelojs',          icon: '🎮', goal: 2,  kind: 'speed_play' },
  { id: 'm_daily',          title: 'Juega la pregunta diaria',       icon: '🏆', goal: 1,  kind: 'daily_play' },
  { id: 'm_ladder_5',       title: 'Llega al piso 5 en Ascenso',     icon: '🪜', goal: 5,  kind: 'ladder_floor' },
  { id: 'm_ladder_play',    title: 'Juega una partida de Ascenso',   icon: '🧗', goal: 1,  kind: 'ladder_play' },
  { id: 'm_coins_100',      title: 'Gana 100 monedas',               icon: '🪙', goal: 100, kind: 'coins_earned' },
];

// RNG determinístico (Mulberry32 sembrado por la fecha).
function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed || 1;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

// 3 misiones del día, determinísticas por fecha.
export function pickDailyMissions(dateSeed = todayStr(), count = 3): Mission[] {
  const rand = mulberry32(hashSeed(dateSeed));
  const pool = [...POOL];
  // Fisher–Yates con RNG sembrado.
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

export function missionsByKind(kind: MissionKind, dateSeed = todayStr()): Mission[] {
  return pickDailyMissions(dateSeed).filter(m => m.kind === kind);
}
