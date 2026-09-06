import { useSyncExternalStore } from 'react';
import { getPremiumState, subscribeToPremium, type PremiumState } from '@/lib/premium';

/**
 * Estado PRO del usuario. Lee del store del módulo `lib/premium`, que se
 * mantiene al día con el listener de RevenueCat, así que una compra o una
 * restauración se propaga a toda la app sin recargar pantallas.
 */
export function usePremium(): PremiumState {
  return useSyncExternalStore(subscribeToPremium, getPremiumState, getPremiumState);
}

/** Atajo para el caso mayoritario: solo interesa si tiene PRO o no. */
export function useIsPro(): boolean {
  return usePremium().isPro;
}
