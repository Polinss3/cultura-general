// ─── Recuperar la racha con monedas ──────────────────────────────────────────
//
// El servidor manda: `update_streak` anota en `profiles.lost_streak` la racha
// que se rompió y `recover_streak()` la devuelve cobrando. Aquí solo vive la
// lógica pura para decidir qué enseñar (precio, ventana, si merece la pena),
// de modo que la home y la pantalla del día cuenten lo mismo que la base.
//
// Dos momentos distintos:
//  · "rota": la racha ya se reinició (hay lost_streak en el perfil) y se puede
//    pagar ahora mismo.
//  · "en peligro": aún no se ha reiniciado porque el reinicio ocurre al
//    responder, pero el usuario lleva 2+ días sin jugar, así que ni el perdón
//    PRO ni un "Congelar racha" (ambos cubren un solo día) van a salvarla.
//    Se avisa para que responda hoy y la recupere después.

// Espejo de streak_recovery_price() en el servidor: 10 🪙 por día, 50-500.
export const STREAK_RECOVERY_COIN_PER_DAY = 10;
export const STREAK_RECOVERY_MIN_PRICE = 50;
export const STREAK_RECOVERY_MAX_PRICE = 500;
export const STREAK_RECOVERY_WINDOW_HOURS = 48;

export function streakRecoveryPrice(lostStreak: number): number {
  const raw = Math.max(0, Math.floor(lostStreak)) * STREAK_RECOVERY_COIN_PER_DAY;
  return Math.min(STREAK_RECOVERY_MAX_PRICE, Math.max(STREAK_RECOVERY_MIN_PRICE, raw));
}

export interface StreakRecoveryOffer {
  kind: 'broken';
  lostStreak: number;
  price: number;
  /** Racha resultante si paga ahora (la perdida + la que lleva desde entonces). */
  recoveredStreak: number;
  expiresAt: number;
  canAfford: boolean;
}

export interface StreakAtRiskNotice {
  kind: 'at_risk';
  streak: number;
  price: number;
}

interface ProfileStreakFields {
  streak: number;
  coins: number;
  lost_streak?: number | null;
  lost_streak_at?: string | null;
}

/**
 * Oferta de recuperación si el perfil tiene una racha rota dentro de la
 * ventana de 48 h; null si no hay nada que recuperar.
 */
export function getStreakRecoveryOffer(
  profile: ProfileStreakFields | null | undefined,
  now = Date.now(),
): StreakRecoveryOffer | null {
  if (!profile) return null;
  const lost = profile.lost_streak ?? 0;
  if (lost <= 0 || !profile.lost_streak_at) return null;

  const lostAt = Date.parse(profile.lost_streak_at);
  if (!Number.isFinite(lostAt)) return null;
  const expiresAt = lostAt + STREAK_RECOVERY_WINDOW_HOURS * 3_600_000;
  if (expiresAt <= now) return null;

  const price = streakRecoveryPrice(lost);
  return {
    kind: 'broken',
    lostStreak: lost,
    price,
    recoveredStreak: lost + Math.max(0, profile.streak ?? 0),
    expiresAt,
    canAfford: (profile.coins ?? 0) >= price,
  };
}

/**
 * Aviso de racha en peligro: racha de 2+ días, hoy sin responder y ayer y
 * anteayer tampoco. `answeredDates` son fechas YYYY-MM-DD (UTC, como el resto
 * de la app) de los últimos días; `today` idem.
 */
export function getStreakAtRiskNotice(
  profile: Pick<ProfileStreakFields, 'streak'> | null | undefined,
  answeredDates: Iterable<string>,
  today: string,
): StreakAtRiskNotice | null {
  if (!profile || (profile.streak ?? 0) < 2) return null;

  const answered = new Set(answeredDates);
  const dayBefore = (iso: string, n: number) => {
    const d = new Date(`${iso}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() - n);
    return d.toISOString().slice(0, 10);
  };

  if (answered.has(today)) return null;
  if (answered.has(dayBefore(today, 1))) return null;
  if (answered.has(dayBefore(today, 2))) return null;

  return { kind: 'at_risk', streak: profile.streak, price: streakRecoveryPrice(profile.streak) };
}
