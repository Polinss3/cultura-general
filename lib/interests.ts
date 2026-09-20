// ─── Intereses: un empujón sutil, no un filtro ───────────────────────────────
//
// Las categorías favoritas del onboarding hacen que sus preguntas salgan con el
// doble de probabilidad en los modos "de todo" (Aprender → Aleatorio y
// Contrarreloj). El resto sigue apareciendo: con 4 temas favoritos de 13, más
// o menos la mitad de la tanda es de ellos y la otra mitad del resto. Aventura,
// Pregunta del día y Examen no lo usan a propósito: son iguales para todos.

import type { Category } from '@/types';

export const INTEREST_WEIGHT = 2;

/** Peso de barajado por categoría: favoritas ×2, el resto ×1. */
export function interestWeight(
  interests: ReadonlySet<Category> | readonly Category[],
): (q: { category?: Category }) => number {
  const set = interests instanceof Set ? interests : new Set(interests);
  if (set.size === 0) return () => 1;
  return q => (q.category && set.has(q.category) ? INTEREST_WEIGHT : 1);
}
