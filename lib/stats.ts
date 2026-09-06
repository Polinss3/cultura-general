// ─── Estadísticas avanzadas (CG PRO) ─────────────────────────────────────────
// Cálculos puros sobre lo que devuelve `fetch_pro_stats`. Sin red y sin React,
// para que se puedan probar solos.

export interface DifficultyStat {
  difficulty: 'easy' | 'medium' | 'hard';
  answered: number;
  correct: number;
}

export interface WeeklyStat {
  week: string;
  answered: number;
  correct: number;
}

export interface ExamRecord {
  grade: number;
  correct: number;
  total: number;
  createdAt: string;
}

export interface ProStats {
  byDifficulty: DifficultyStat[];
  weekly: WeeklyStat[];
  exams: ExamRecord[];
  accuracy: { mine: number | null; global: number | null };
}

export const EMPTY_PRO_STATS: ProStats = {
  byDifficulty: [],
  weekly: [],
  exams: [],
  accuracy: { mine: null, global: null },
};

/** Porcentaje de aciertos, 0-100 con un decimal. `null` si no hay respuestas. */
export function accuracy(correct: number, answered: number): number | null {
  if (!answered || answered <= 0) return null;
  return Math.round((correct / answered) * 1000) / 10;
}

export const DIFFICULTY_ORDER: DifficultyStat['difficulty'][] = ['easy', 'medium', 'hard'];

/** Ordena por dificultad real y no alfabéticamente ('easy' < 'hard' < 'medium'). */
export function sortByDifficulty(stats: DifficultyStat[]): DifficultyStat[] {
  return [...stats].sort(
    (a, b) => DIFFICULTY_ORDER.indexOf(a.difficulty) - DIFFICULTY_ORDER.indexOf(b.difficulty),
  );
}

/**
 * Rellena las semanas sin actividad.
 *
 * El servidor solo devuelve semanas con respuestas, así que pintar esa lista
 * tal cual comprime los huecos y dibuja una racha continua donde hubo un mes
 * sin abrir la app. La gráfica tiene que enseñar los huecos.
 */
export function fillWeeks(weekly: WeeklyStat[], count = 12, now = new Date()): WeeklyStat[] {
  const byWeek = new Map(weekly.map(item => [item.week, item]));
  const monday = startOfWeek(now);
  const weeks: WeeklyStat[] = [];

  for (let offset = count - 1; offset >= 0; offset -= 1) {
    const date = new Date(monday.getTime() - offset * 7 * 24 * 60 * 60 * 1000);
    const key = date.toISOString().slice(0, 10);
    weeks.push(byWeek.get(key) ?? { week: key, answered: 0, correct: 0 });
  }
  return weeks;
}

/** Lunes de la semana de `date`, en UTC (coherente con `todayStr`). */
export function startOfWeek(date: Date): Date {
  const copy = new Date(Date.UTC(
    date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
  ));
  // getUTCDay: 0 = domingo. La semana ISO empieza el lunes.
  const shift = (copy.getUTCDay() + 6) % 7;
  copy.setUTCDate(copy.getUTCDate() - shift);
  return copy;
}

export type Trend = 'up' | 'down' | 'flat' | 'unknown';

/**
 * Compara la precisión de las últimas `window` semanas con las anteriores.
 * Exige un mínimo de respuestas en los dos tramos: con cuatro preguntas de un
 * lado, cualquier variación es ruido y anunciarla como "vas mejorando" es
 * mentir con datos de verdad.
 */
export function accuracyTrend(
  weekly: WeeklyStat[],
  window = 4,
  minAnswers = 20,
): { trend: Trend; delta: number | null } {
  if (weekly.length < window * 2) return { trend: 'unknown', delta: null };

  const recent = weekly.slice(-window);
  const previous = weekly.slice(-window * 2, -window);
  const sum = (items: WeeklyStat[]) => items.reduce(
    (acc, item) => ({
      answered: acc.answered + item.answered,
      correct: acc.correct + item.correct,
    }),
    { answered: 0, correct: 0 },
  );

  const a = sum(recent);
  const b = sum(previous);
  if (a.answered < minAnswers || b.answered < minAnswers) return { trend: 'unknown', delta: null };

  const recentAccuracy = accuracy(a.correct, a.answered) ?? 0;
  const previousAccuracy = accuracy(b.correct, b.answered) ?? 0;
  const delta = Math.round((recentAccuracy - previousAccuracy) * 10) / 10;

  if (delta >= 2) return { trend: 'up', delta };
  if (delta <= -2) return { trend: 'down', delta };
  return { trend: 'flat', delta };
}

/** Mejor categoría por precisión, entre las que tengan recorrido suficiente. */
export function bestCategory<T extends { category: string; total: number; correct: number }>(
  stats: T[],
  minAnswers = 10,
): T | null {
  const eligible = stats.filter(stat => stat.total >= minAnswers);
  if (eligible.length === 0) return null;
  return eligible.reduce((best, stat) =>
    (stat.correct / stat.total) > (best.correct / best.total) ? stat : best);
}
