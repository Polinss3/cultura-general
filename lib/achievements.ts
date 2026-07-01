import { levelFromXp } from './leveling';

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  desc: string;
  color: string;
  reward: number;     // monedas al reclamar (espejo del servidor)
  unlocked: boolean;
  claimed: boolean;
}

interface ProfileStats {
  total_answered?: number;
  total_correct?: number;
  streak?: number;
  best_streak?: number;
  speed_record?: number;
  xp?: number;
  level?: number;
  coins?: number;
  ladder_best?: number;
}

export function computeAchievements(
  profile: ProfileStats | null,
  claimed?: Set<string>,
): Achievement[] {
  const answered = profile?.total_answered ?? 0;
  const correct = profile?.total_correct ?? 0;
  const bestStreak = profile?.best_streak ?? 0;
  const speedRecord = profile?.speed_record ?? 0;
  const level = profile?.level ?? levelFromXp(profile?.xp ?? 0);
  const coins = profile?.coins ?? 0;
  const ladderBest = profile?.ladder_best ?? 0;
  const accuracy = answered > 0 ? correct / answered : 0;
  const isClaimed = (id: string) => claimed?.has(id) ?? false;

  const defs: Omit<Achievement, 'claimed'>[] = [
    { id: 'first_answer',        icon: '🎯', title: 'Primera respuesta', desc: 'Responde tu primera pregunta',        color: '#e8a030', reward: 50,  unlocked: answered >= 1 },
    { id: 'ten_answers',         icon: '📚', title: 'Estudiante',        desc: '10 preguntas respondidas',             color: '#2ec87a', reward: 50,  unlocked: answered >= 10 },
    { id: 'hundred_answers',     icon: '🏛️', title: 'Erudito',           desc: '100 preguntas respondidas',            color: '#a030e8', reward: 100, unlocked: answered >= 100 },
    { id: 'five_hundred_answers',icon: '🧠', title: 'Genio',             desc: '500 preguntas respondidas',            color: '#e83060', reward: 200, unlocked: answered >= 500 },
    { id: 'streak_3',            icon: '🔥', title: 'En racha',          desc: 'Racha máxima de 3 días',               color: '#e8a030', reward: 50,  unlocked: bestStreak >= 3 },
    { id: 'streak_7',            icon: '⚡', title: 'Imparable',         desc: 'Racha máxima de 7 días',               color: '#a030e8', reward: 100, unlocked: bestStreak >= 7 },
    { id: 'streak_30',           icon: '👑', title: 'Leyenda',           desc: 'Racha máxima de 30 días',              color: '#e8a030', reward: 200, unlocked: bestStreak >= 30 },
    { id: 'accuracy_80',         icon: '🎓', title: 'Precisión',         desc: '80% de aciertos (mín. 20)',            color: '#2ec87a', reward: 50,  unlocked: answered >= 20 && accuracy >= 0.8 },
    { id: 'accuracy_95',         icon: '💎', title: 'Perfeccionista',    desc: '95% de aciertos (mín. 50)',            color: '#30a8e8', reward: 200, unlocked: answered >= 50 && accuracy >= 0.95 },
    { id: 'speed_5',             icon: '🏃', title: 'Velocista',         desc: '5 aciertos en Contrarreloj',           color: '#a030e8', reward: 50,  unlocked: speedRecord >= 5 },
    { id: 'speed_10',            icon: '🚀', title: 'Cohete',            desc: '10 aciertos en Contrarreloj',          color: '#30a8e8', reward: 50,  unlocked: speedRecord >= 10 },
    { id: 'speed_20',            icon: '🏆', title: 'Campeón',           desc: '20 aciertos en Contrarreloj',          color: '#e8a030', reward: 100, unlocked: speedRecord >= 20 },
    // ─ Nuevos: niveles
    { id: 'level_10',            icon: '🌟', title: 'Conocedor',         desc: 'Alcanza el nivel 10',                  color: '#30a8e8', reward: 80,  unlocked: level >= 10 },
    { id: 'level_25',            icon: '✨', title: 'Veterano',          desc: 'Alcanza el nivel 25',                  color: '#a030e8', reward: 120, unlocked: level >= 25 },
    { id: 'level_50',            icon: '🏅', title: 'Eminencia',         desc: 'Alcanza el nivel 50',                  color: '#e83060', reward: 200, unlocked: level >= 50 },
    // ─ Nuevos: monedas
    { id: 'coins_500',           icon: '🪙', title: 'Ahorrador',         desc: 'Acumula 500 monedas',                  color: '#e8a030', reward: 50,  unlocked: coins >= 500 },
    { id: 'coins_2000',          icon: '💰', title: 'Ricachón',          desc: 'Acumula 2000 monedas',                 color: '#e8a030', reward: 150, unlocked: coins >= 2000 },
    // ─ Nuevos: Modo Ascenso
    { id: 'ladder_5',            icon: '🪜', title: 'Escalador',         desc: 'Llega al piso 5 en Ascenso',           color: '#2ec87a', reward: 50,  unlocked: ladderBest >= 5 },
    { id: 'ladder_10',          icon: '🧗', title: 'Alpinista',         desc: 'Llega al piso 10 en Ascenso',          color: '#30a8e8', reward: 100, unlocked: ladderBest >= 10 },
    { id: 'ladder_20',          icon: '⛰️', title: 'Cumbre',            desc: 'Llega al piso 20 en Ascenso',          color: '#e83060', reward: 200, unlocked: ladderBest >= 20 },
    // ─ Nuevos: multiplicador
    { id: 'mult_max',           icon: '🔥', title: 'A tope',            desc: 'Multiplicador máximo (racha ≥10)',     color: '#e8a030', reward: 80,  unlocked: bestStreak >= 10 },
  ];

  return defs.map(d => ({ ...d, claimed: isClaimed(d.id) }));
}

export function unlockedCount(profile: ProfileStats | null): number {
  return computeAchievements(profile).filter(a => a.unlocked).length;
}

// Logros desbloqueados pero aún sin reclamar (para el badge "reclamar").
export function claimableCount(profile: ProfileStats | null, claimed?: Set<string>): number {
  return computeAchievements(profile, claimed).filter(a => a.unlocked && !a.claimed).length;
}
