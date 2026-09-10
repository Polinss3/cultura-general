// Tipos compartidos por `lib/ads.ts` (web) y `lib/ads.native.ts`.
//
// TypeScript resuelve `@/lib/ads` siempre al fichero sin sufijo, así que las
// dos implementaciones tienen que coincidir hasta en el tipo de retorno o las
// pantallas verían la firma del stub. Viven aquí para que no puedan separarse.

import type { AdPresentation, RewardResult } from '@inhouse/mobile-sdk';

/** Pausas naturales donde puede aparecer un intersticial. */
export type AdPlacement =
  | 'daily_answered'
  | 'speed_complete'
  | 'ladder_complete'
  | 'flags_complete'
  | 'years_complete';

/** Acciones voluntarias que pueden ofrecer un recompensado. */
export type RewardedPlacement = 'shop_coins' | 'ladder_revive';

export type AdsMode = 'off' | 'test' | 'live';

/** Lo que el host debe aplicar una sola vez por recibo. */
export type RewardGrant = {
  receipt: string;
  reward?: { name: string; amount: number };
};

export type ApplyReward = (grant: RewardGrant) => Promise<void>;

/**
 * Resultado de ofrecer un recompensado.
 *
 * `dismissed` y `unavailable` son cosas distintas para el usuario: una es su
 * propia decisión de no terminar el anuncio y no merece ningún aviso; la otra
 * es que no había anuncio que ofrecerle y sí conviene decírselo.
 */
export type RewardedOutcome = 'granted' | 'dismissed' | 'unavailable';

/** Anuncio a pantalla completa esperando a que `AdFullscreenHost` lo pinte. */
export type FullscreenAdSlot = {
  presentation: AdPresentation;
  format: 'interstitial' | 'rewarded';
  onReward?: (result: RewardResult) => Promise<void>;
  close: () => void;
};

export type AdsDiagnostics = {
  mode: AdsMode;
  initialized: boolean;
  requestsEnabled: boolean;
  testMode: boolean;
  ageBracket: 'adult' | 'minor' | 'unknown';
  isPremium: boolean;
  queuedEvents: number;
};
