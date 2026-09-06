// Supabase Edge Function — revenuecat-webhook
//
// Recibe los eventos de RevenueCat y mantiene al día el espejo
// `profiles.premium_tier` / `premium_until`, que es lo que consultan las
// funciones de servidor (`is_premium`) para blindar recompensas.
//
// RevenueCat sigue siendo la fuente de la verdad: este espejo existe para que
// Postgres pueda decidir sin salir a la red, no para sustituirlo.
//
// Despliegue:
//   supabase functions deploy revenuecat-webhook --no-verify-jwt
//
// El `--no-verify-jwt` es obligatorio: quien llama es RevenueCat, no un usuario
// con sesión. La autenticación se hace con el secreto compartido de abajo, que
// hay que configurar en el panel de RevenueCat (Integrations > Webhooks >
// Authorization header) y como secreto de la función:
//   supabase secrets set REVENUECAT_WEBHOOK_SECRET=...
//
// Secrets requeridos:
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//   REVENUECAT_WEBHOOK_SECRET

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type PremiumTier = 'none' | 'monthly' | 'annual' | 'lifetime';

/** Eventos que conceden o mantienen el acceso. */
const GRANTING = new Set([
  'INITIAL_PURCHASE',
  'RENEWAL',
  'UNCANCELLATION',
  'NON_RENEWING_PURCHASE',
  'SUBSCRIPTION_EXTENDED',
  'PRODUCT_CHANGE',
  'TRANSFER',
]);

/** Eventos que lo retiran de inmediato. */
const REVOKING = new Set([
  'EXPIRATION',
  'REFUND',
  'SUBSCRIPTION_PAUSED',
]);

// CANCELLATION no se incluye a propósito: cancelar significa "no renovar", pero
// el acceso dura hasta `expiration_at_ms`. Retirarlo en ese momento sería
// quitarle al usuario algo que ya ha pagado.

function tierFor(productId: string, expiresAtMs: number | null): PremiumTier {
  const id = (productId || '').toLowerCase();
  if (id.includes('lifetime') || expiresAtMs === null) return 'lifetime';
  if (id.includes('annual') || id.includes('yearly')) return 'annual';
  if (id.includes('monthly')) return 'monthly';
  return 'monthly';
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const secret = Deno.env.get('REVENUECAT_WEBHOOK_SECRET');
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!secret || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: 'Server misconfigured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (req.headers.get('Authorization') !== secret) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const event = payload?.event ?? {};
  const type: string = event.type ?? '';

  // El app_user_id es el uuid de Supabase porque el cliente exige cuenta para
  // comprar. Un id anónimo de RevenueCat (prefijo $RCAnonymousID:) no
  // corresponde a ningún perfil: se acepta sin hacer nada para que RevenueCat
  // no lo reintente en bucle.
  const appUserId: string = event.app_user_id ?? '';
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    .test(appUserId);

  if (!isUuid) {
    return new Response(JSON.stringify({ ok: true, skipped: 'anonymous user' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let tier: PremiumTier;
  let until: string | null = null;

  if (GRANTING.has(type)) {
    const expiresAtMs: number | null = event.expiration_at_ms ?? null;
    tier = tierFor(event.product_id ?? '', expiresAtMs);
    until = expiresAtMs ? new Date(expiresAtMs).toISOString() : null;
  } else if (REVOKING.has(type)) {
    tier = 'none';
  } else {
    // TEST, CANCELLATION, BILLING_ISSUE y demás: nada que cambiar.
    return new Response(JSON.stringify({ ok: true, ignored: type }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { error } = await admin.rpc('apply_premium_status', {
    p_user_id: appUserId,
    p_tier: tier,
    p_until: until,
  });

  if (error) {
    // Devolver 500 hace que RevenueCat reintente, que es lo que queremos ante
    // un fallo transitorio de base de datos.
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true, type, tier }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
