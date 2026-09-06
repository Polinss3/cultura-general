// ─── CG PRO: identidad y reglas de acceso ────────────────────────────────────
// Módulo hoja, sin dependencias de red: lo importan tanto la UI como la lógica
// pura de Aventura, y también los tests.

/**
 * Violeta profundo. Es el único color de la app que significa "PRO": no se usa
 * para nada más. Va más saturado y más oscuro que el violeta de Contrarreloj
 * (`C.speed`) para que no se confundan cuando aparecen en la misma pantalla.
 */
export const PRO_ACCENT = '#6D3FC4';

export const PRO_ENTITLEMENT_LABEL = 'PRO';

/** Capítulos de Aventura jugables sin pagar. Niveles 1-40. */
export const ADVENTURE_FREE_CHAPTERS = 2;

/**
 * Acceso a Aventura de un usuario concreto.
 *
 * `legacy` son las cuentas que ya habían pasado del nivel 40 antes de la 2.2.0.
 * Conservan la Aventura completa para siempre: quitar contenido ya publicado
 * sin respetar esto es la vía rápida a una tanda de reseñas de 1★.
 */
export interface AdventureAccess {
  isPro: boolean;
  legacy: boolean;
}

export const FULL_ADVENTURE_ACCESS: AdventureAccess = { isPro: true, legacy: true };
export const FREE_ADVENTURE_ACCESS: AdventureAccess = { isPro: false, legacy: false };

export function hasFullAdventureAccess(access: AdventureAccess): boolean {
  return access.isPro || access.legacy;
}

/** Lista de beneficios del PRO, en el orden en que se muestran en el paywall. */
export const PRO_BENEFITS = [
  'adventure',
  'review',
  'exam',
  'stats',
  'badge',
  'stipend',
  'streakFreeze',
  'cosmetics',
] as const;

export type ProBenefit = (typeof PRO_BENEFITS)[number];

export const PRO_BENEFIT_ICONS: Record<ProBenefit, string> = {
  adventure: '🗺️',
  review: '🔁',
  exam: '📝',
  stats: '📊',
  badge: '✨',
  stipend: '🪙',
  streakFreeze: '🛡️',
  cosmetics: '🎨',
};

/**
 * Lee el sello PRO de otro usuario a partir de `profiles.premium_tier`.
 *
 * Solo se consulta el tier, nunca `premium_until`: para pintar una insignia
 * basta con saber que la tiene, y la fecha exacta de caducidad de la
 * suscripción de otra persona no es asunto de nadie. El webhook de RevenueCat
 * pone el tier a 'none' al expirar, así que la columna basta.
 */
export function isProTier(tier: unknown): boolean {
  return typeof tier === 'string' && tier.length > 0 && tier !== 'none';
}
