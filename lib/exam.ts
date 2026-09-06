// ─── Modo Examen (CG PRO) ────────────────────────────────────────────────────
//
// Cuarenta preguntas, veinte minutos, sin corregir hasta el final. Esa última
// regla es lo que lo separa de Aprender: si cada respuesta se corrige al
// momento, es una partida; si no se corrige ninguna, es un examen, y el
// resultado tiene peso.
//
// Reutiliza el banco entero, así que no añade contenido que mantener.

import type { Category, Question } from '@/types';

export const EXAM_QUESTIONS = 40;
export const EXAM_DURATION_MS = 20 * 60 * 1000;
/** Nota a partir de la cual se aprueba, sobre diez. */
export const EXAM_PASS_MARK = 5;

export type ExamBand = 'fail' | 'pass' | 'good' | 'great' | 'perfect';

export interface ExamAnswer {
  /** Índice elegido, o null si se dejó en blanco. */
  selected: number | null;
}

/** Nota sobre diez con un decimal. */
export function examGrade(correct: number, total = EXAM_QUESTIONS): number {
  if (total <= 0) return 0;
  const raw = (Math.max(0, Math.min(total, correct)) / total) * 10;
  return Math.round(raw * 10) / 10;
}

/**
 * Banda de la nota. Son los tramos del sistema escolar español porque es el
 * marco que la gente ya tiene en la cabeza: no hay que explicar qué significa
 * un 7,5.
 */
export function examBand(grade: number): ExamBand {
  if (grade >= 10) return 'perfect';
  if (grade >= 9) return 'great';
  if (grade >= 7) return 'good';
  if (grade >= EXAM_PASS_MARK) return 'pass';
  return 'fail';
}

export function examPassed(grade: number): boolean {
  return grade >= EXAM_PASS_MARK;
}

/**
 * Recompensa del examen: proporcional a los aciertos, con una prima por
 * aprobar. Deliberadamente modesta comparada con Aventura — el examen se puede
 * repetir a voluntad, así que no puede ser la vía rápida a las monedas.
 */
export function examRewards(correct: number, total = EXAM_QUESTIONS): { xp: number; coins: number } {
  const grade = examGrade(correct, total);
  const xp = correct * 3 + (examPassed(grade) ? 40 : 0);
  const coins = Math.round(correct * 0.5) + (examPassed(grade) ? 15 : 0);
  return { xp, coins };
}

/**
 * Reparte las cuarenta preguntas entre categorías lo más equilibradamente que
 * permita el banco.
 *
 * Un muestreo puramente aleatorio sobre 2.000 preguntas deja exámenes con seis
 * de Historia y ninguna de Música, lo que hace que dos notas no sean
 * comparables entre sí. Se recorre categoría por categoría repartiendo de una
 * en una (round-robin) y solo al final se rellena con lo que sobre.
 */
export function buildExam(
  pool: Question[],
  count = EXAM_QUESTIONS,
  shuffle: <T>(items: T[]) => T[] = defaultShuffle,
): Question[] {
  if (pool.length <= count) return shuffle([...pool]);

  const byCategory = new Map<Category | 'sin', Question[]>();
  for (const question of pool) {
    const key = (question.category ?? 'sin') as Category | 'sin';
    const bucket = byCategory.get(key);
    if (bucket) bucket.push(question);
    else byCategory.set(key, [question]);
  }

  const buckets = shuffle([...byCategory.values()].map(bucket => shuffle([...bucket])));
  const picked: Question[] = [];

  let exhausted = false;
  while (picked.length < count && !exhausted) {
    exhausted = true;
    for (const bucket of buckets) {
      if (picked.length >= count) break;
      const next = bucket.pop();
      if (next) {
        picked.push(next);
        exhausted = false;
      }
    }
  }

  return shuffle(picked);
}

function defaultShuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** `mm:ss` a partir de milisegundos restantes. */
export function formatExamClock(remainingMs: number): string {
  const total = Math.max(0, Math.ceil(remainingMs / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
