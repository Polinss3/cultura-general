// ─── CG PRO: estado de suscripción ───────────────────────────────────────────
//
// RevenueCat es la fuente de la verdad del derecho de compra; Supabase guarda
// un espejo (`profiles.premium_tier`) que escribe el webhook y que usa el
// servidor para blindar recompensas.
//
// Dos reglas de diseño:
//
//  1. **El gate de contenido se resuelve en local.** Aventura precarga las 2.000
//     preguntas para jugar sin conexión: si el candado dependiera de la red, un
//     usuario PRO sin cobertura se quedaría fuera de lo que ha pagado. Por eso
//     el último estado conocido se cachea y se da por bueno mientras no haya
//     una respuesta más reciente.
//  2. **El SDK se carga de forma diferida.** `react-native-purchases` es un
//     módulo nativo: hasta que no salga un build nuevo de EAS no existe en el
//     bundle. Si no se puede cargar, la app funciona entera en modo gratuito en
//     vez de reventar al arrancar.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export type PremiumTier = 'none' | 'monthly' | 'annual' | 'lifetime';

export interface PremiumState {
  isPro: boolean;
  tier: PremiumTier;
  /** ISO. `null` en lifetime (no caduca) y en gratuito. */
  expiresAt: string | null;
  /** `true` cuando ya se ha resuelto al menos una vez (de red o de caché). */
  ready: boolean;
  /** `true` si el SDK nativo no está disponible en este build. */
  unavailable: boolean;
}

export const PRO_ENTITLEMENT = 'pro';

export const PRO_PRODUCTS = {
  monthly: 'cg_pro_monthly',
  annual: 'cg_pro_annual',
  lifetime: 'cg_pro_lifetime',
} as const;

const CACHE_KEY = 'premium_state_v1';

const FREE_STATE: PremiumState = {
  isPro: false,
  tier: 'none',
  expiresAt: null,
  ready: false,
  unavailable: false,
};

let state: PremiumState = { ...FREE_STATE };
let sdk: any = null;
let sdkChecked = false;
let configured = false;
let configuringFor: string | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function setState(next: Partial<PremiumState>) {
  const merged = { ...state, ...next };
  if (
    merged.isPro === state.isPro &&
    merged.tier === state.tier &&
    merged.expiresAt === state.expiresAt &&
    merged.ready === state.ready &&
    merged.unavailable === state.unavailable
  ) return;
  state = merged;
  emit();
}

export function getPremiumState(): PremiumState {
  return state;
}

export function subscribeToPremium(listener: () => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

// ─── SDK ─────────────────────────────────────────────────────────────────────

function loadSdk(): any {
  if (sdkChecked) return sdk;
  sdkChecked = true;
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') return null;
  try {
    // Import diferido a propósito: ver la nota de cabecera.
    const mod = require('react-native-purchases');
    sdk = mod?.default ?? mod ?? null;
  } catch {
    sdk = null;
  }
  if (!sdk) setState({ unavailable: true, ready: true });
  return sdk;
}

function apiKey(): string | null {
  const key = Platform.OS === 'ios'
    ? process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY
    : process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;
  const trimmed = key?.trim();
  return trimmed ? trimmed : null;
}

function tierFromCustomerInfo(info: any): { tier: PremiumTier; expiresAt: string | null } {
  const entitlement = info?.entitlements?.active?.[PRO_ENTITLEMENT];
  if (!entitlement) return { tier: 'none', expiresAt: null };

  const productId: string = entitlement.productIdentifier ?? '';
  const expiresAt: string | null = entitlement.expirationDate ?? null;

  // Sin fecha de caducidad = no consumible = lifetime.
  if (!expiresAt) return { tier: 'lifetime', expiresAt: null };
  if (productId.includes('annual') || productId.includes('yearly')) {
    return { tier: 'annual', expiresAt };
  }
  return { tier: 'monthly', expiresAt };
}

function applyCustomerInfo(info: any) {
  const { tier, expiresAt } = tierFromCustomerInfo(info);
  const isPro = tier !== 'none';
  setState({ isPro, tier, expiresAt, ready: true });
  void AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ isPro, tier, expiresAt }))
    .catch(() => {});
}

async function restoreFromCache() {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) return;
    const cached = JSON.parse(raw) as Partial<PremiumState>;
    if (typeof cached?.isPro !== 'boolean') return;
    // Una suscripción caducada no se da por buena aunque esté cacheada.
    if (cached.tier !== 'lifetime' && cached.expiresAt) {
      if (new Date(cached.expiresAt).getTime() <= Date.now()) return;
    }
    setState({
      isPro: cached.isPro,
      tier: (cached.tier as PremiumTier) ?? 'none',
      expiresAt: cached.expiresAt ?? null,
    });
  } catch {
    // Una caché ilegible solo significa empezar en gratuito.
  }
}

/**
 * Arranca el SDK y deja el estado listo. Idempotente: se puede llamar en cada
 * cambio de sesión. `userId` es null para invitados (ID anónimo de RevenueCat).
 */
export async function initPremium(userId: string | null): Promise<void> {
  await restoreFromCache();

  const purchases = loadSdk();
  if (!purchases) return;

  const key = apiKey();
  if (!key) { setState({ unavailable: true, ready: true }); return; }

  try {
    if (!configured) {
      await purchases.configure({ apiKey: key, appUserID: userId ?? null });
      configured = true;
      configuringFor = userId;
      purchases.addCustomerInfoUpdateListener?.((info: any) => applyCustomerInfo(info));
    } else if (userId && configuringFor !== userId) {
      const { customerInfo } = await purchases.logIn(userId);
      configuringFor = userId;
      applyCustomerInfo(customerInfo);
      return;
    }

    applyCustomerInfo(await purchases.getCustomerInfo());
  } catch {
    // Sin red o con el SDK a medias: se mantiene lo que diga la caché.
    setState({ ready: true });
  }
}

/** Al cerrar sesión, el derecho vuelve a ser el del ID anónimo del dispositivo. */
export async function resetPremiumUser(): Promise<void> {
  const purchases = loadSdk();
  configuringFor = null;
  if (!purchases || !configured) { setState({ ...FREE_STATE, ready: true }); return; }
  try {
    const { customerInfo } = await purchases.logOut();
    applyCustomerInfo(customerInfo);
  } catch {
    setState({ ...FREE_STATE, ready: true });
  }
}

export async function refreshPremium(): Promise<PremiumState> {
  const purchases = loadSdk();
  if (!purchases || !configured) return state;
  try {
    applyCustomerInfo(await purchases.getCustomerInfo());
  } catch {
    // Se conserva el último estado conocido.
  }
  return state;
}

// ─── Ofertas y compra ────────────────────────────────────────────────────────

export interface PremiumPackage {
  identifier: string;
  tier: PremiumTier;
  priceString: string;
  /** Precio mensual equivalente, ya formateado. Solo en el anual. */
  pricePerMonth: string | null;
  raw: any;
}

function tierFromProductId(productId: string): PremiumTier {
  if (productId.includes('lifetime')) return 'lifetime';
  if (productId.includes('annual') || productId.includes('yearly')) return 'annual';
  if (productId.includes('monthly')) return 'monthly';
  return 'none';
}

export async function fetchPremiumPackages(): Promise<PremiumPackage[]> {
  const purchases = loadSdk();
  if (!purchases || !configured) return [];
  try {
    const offerings = await purchases.getOfferings();
    const packages: any[] = offerings?.current?.availablePackages ?? [];
    const order: PremiumTier[] = ['annual', 'monthly', 'lifetime'];

    return packages
      .map(pkg => {
        const product = pkg.product ?? {};
        const tier = tierFromProductId(String(product.identifier ?? ''));
        return {
          identifier: pkg.identifier,
          tier,
          priceString: product.priceString ?? '',
          pricePerMonth: tier === 'annual' && typeof product.price === 'number'
            ? formatPerMonth(product.price, product.currencyCode)
            : null,
          raw: pkg,
        };
      })
      .filter(pkg => pkg.tier !== 'none')
      .sort((a, b) => order.indexOf(a.tier) - order.indexOf(b.tier));
  } catch {
    return [];
  }
}

function formatPerMonth(yearlyPrice: number, currencyCode?: string): string | null {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode || 'EUR',
    }).format(yearlyPrice / 12);
  } catch {
    return null;
  }
}

export type PurchaseOutcome = 'purchased' | 'cancelled' | 'error';

export async function purchasePremium(pkg: PremiumPackage): Promise<PurchaseOutcome> {
  const purchases = loadSdk();
  if (!purchases || !configured) return 'error';
  try {
    const { customerInfo } = await purchases.purchasePackage(pkg.raw);
    applyCustomerInfo(customerInfo);
    return state.isPro ? 'purchased' : 'error';
  } catch (error: any) {
    if (error?.userCancelled) return 'cancelled';
    return 'error';
  }
}

/** Obligatorio en el paywall: Apple rechaza sin botón de restaurar (3.1.2). */
export async function restorePremium(): Promise<boolean> {
  const purchases = loadSdk();
  if (!purchases || !configured) return false;
  try {
    applyCustomerInfo(await purchases.restorePurchases());
    return state.isPro;
  } catch {
    return false;
  }
}
