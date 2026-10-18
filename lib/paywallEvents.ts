// ─── CG PRO: medición del paywall ────────────────────────────────────────────
//
// Cada apertura del paywall tiene un `viewId` que agrupa sus eventos, para
// poder contar embudos por origen: cuántos lo ven, cuántos tocan comprar y
// cuántos compran. Escribe en `paywall_events` vía `log_paywall_event()`
// (supabase/migrations/20261018020000_paywall_events.sql).
//
// Fire-and-forget a propósito: medir nunca puede retrasar ni romper el paywall,
// así que no se espera la red ni se reintenta.

import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { supabase } from '@/lib/supabase';
import { getCurrentLang } from '@/lib/i18n';
import type { PremiumTier } from '@/lib/premium';

export type PaywallEvent =
  | 'view'
  | 'select_plan'
  | 'purchase_tap'
  | 'purchased'
  | 'cancelled'
  | 'failed'
  | 'login_required'
  | 'restore'
  | 'no_plans'
  | 'close';

export function newPaywallViewId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function logPaywallEvent(
  viewId: string,
  event: PaywallEvent,
  source: string,
  tier?: PremiumTier | null,
): void {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') return;
  void supabase
    .rpc('log_paywall_event', {
      p_view_id: viewId,
      p_event: event,
      p_source: source,
      p_tier: tier && tier !== 'none' ? tier : null,
      p_platform: Platform.OS,
      p_app_version: Constants.expoConfig?.version ?? null,
      p_lang: getCurrentLang(),
    })
    .then(() => {}, () => {});
}
