// Mantener este plazo alineado con claim_pro_stipend() en Supabase.
const CLAIM_INTERVAL_MS = 28 * 24 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

/** null = nunca cobrado o fecha inválida; 0 = ya se puede cobrar. */
export function daysUntilNextProStipend(lastClaimedAt: string | null | undefined, nowMs: number): number | null {
  if (!lastClaimedAt) return null;
  const lastMs = Date.parse(lastClaimedAt);
  if (!Number.isFinite(lastMs)) return null;
  return Math.ceil(Math.max(0, lastMs + CLAIM_INTERVAL_MS - nowMs) / DAY_MS);
}
