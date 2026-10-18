// Cadencia del aviso "Quitar anuncios" que sale al cerrar un intersticial.
// Lógica pura, sin dependencias, para poder probarla con `tsx --test`.

/** Como mucho una vez al día: más a menudo sería otro anuncio más. */
export const REMOVE_ADS_NUDGE_GAP_MS = 24 * 60 * 60 * 1000;

/** Lo que tarda en irse solo si no se toca. */
export const REMOVE_ADS_NUDGE_VISIBLE_MS = 8000;

export const REMOVE_ADS_NUDGE_STORAGE_KEY = 'remove_ads_nudge_last_v1';

export function shouldShowRemoveAdsNudge(
  lastShownAt: number | null,
  now: number,
  isPro: boolean,
): boolean {
  if (isPro) return false;
  if (lastShownAt === null || !Number.isFinite(lastShownAt)) return true;
  // Un reloj que va hacia atrás no puede dejar el aviso bloqueado para siempre.
  if (lastShownAt > now) return true;
  return now - lastShownAt >= REMOVE_ADS_NUDGE_GAP_MS;
}
