// ─── Repaso inteligente (CG PRO) ─────────────────────────────────────────────
//
// Repetición espaciada sobre las preguntas falladas. Es la pieza que convierte
// la app de juego en herramienta de estudio y, sobre todo, la razón por la que
// alguien renueva la suscripción el segundo mes: da un motivo concreto de
// abrir la app hoy ("tienes 12 para repasar") en vez de uno genérico.
//
// El algoritmo es el clásico de cajas de Leitner, deliberadamente simple: cada
// acierto sube de caja y espacia más el siguiente repaso; un fallo devuelve a
// la primera. No hace falta SM-2 ni factores de facilidad para un banco de
// 2.000 preguntas de opción múltiple.

/** Caja máxima. Superarla significa que la pregunta ya está aprendida. */
export const REVIEW_MAX_BOX = 5;

/** Días hasta el siguiente repaso, por caja. */
export const REVIEW_INTERVALS_DAYS = [1, 3, 7, 21, 60] as const;

/** Preguntas por sesión: una tanda corta que se pueda hacer en una espera. */
export const REVIEW_SESSION_SIZE = 15;

export function reviewIntervalDays(box: number): number {
  const index = Math.max(1, Math.min(REVIEW_MAX_BOX, Math.trunc(box) || 1)) - 1;
  return REVIEW_INTERVALS_DAYS[index];
}

/**
 * Caja siguiente. Un acierto sube una; un fallo devuelve a la primera, no a la
 * anterior: si has fallado, el intervalo largo que habías ganado ya ha
 * demostrado que era demasiado largo.
 */
export function nextReviewBox(box: number, correct: boolean): number {
  if (!correct) return 1;
  return Math.min(REVIEW_MAX_BOX, Math.max(1, Math.trunc(box) || 1) + 1);
}

/** `true` cuando la pregunta ya no vuelve a la cola. */
export function isReviewMastered(box: number, correct: boolean): boolean {
  return correct && Math.trunc(box) >= REVIEW_MAX_BOX;
}

export function nextReviewDate(box: number, correct: boolean, now = new Date()): Date {
  const days = reviewIntervalDays(nextReviewBox(box, correct));
  return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
}

export interface ReviewItem {
  questionId: string;
  box: number;
  dueAt: string;
}

/** Cuántas de la cola tocan ya, con la fecha como referencia. */
export function dueReviewItems(items: ReviewItem[], now = new Date()): ReviewItem[] {
  const limit = now.getTime();
  return items.filter(item => new Date(item.dueAt).getTime() <= limit);
}

/**
 * Ordena la sesión: primero lo más atrasado, y a igualdad de atraso, la caja
 * más baja (lo que peor te sabes). Así una cola grande empieza por lo que más
 * falta hace.
 */
export function sortReviewQueue(items: ReviewItem[]): ReviewItem[] {
  return [...items].sort((a, b) => {
    const byDue = new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
    if (byDue !== 0) return byDue;
    return a.box - b.box;
  });
}
