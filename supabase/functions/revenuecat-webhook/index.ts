// Supabase Edge Function — revenuecat-webhook
//
// Recibe los eventos de RevenueCat y mantiene al día el espejo
// `profiles.premium_tier` / `premium_until`, que es lo que consultan las
// funciones de servidor (`is_premium`) para blindar recompensas.
//
// RevenueCat sigue siendo la fuente de la verdad: este espejo existe para que
// Postgres pueda decidir sin salir a la red, no para sustituirlo.
//
// El evento solo se usa como AVISO de que algo ha cambiado. El tier se calcula
// consultando el estado real del cliente en la API de RevenueCat, porque un
// evento aislado no basta: quien tiene un lifetime y además una suscripción
// recibiría un EXPIRATION al caducar esta y perdería el acceso que sigue
// teniendo pagado. Con la consulta, el resultado es el mismo llegue el evento
// que llegue y en el orden que llegue.
//
// Si no hay clave de API configurada, se cae al cálculo a partir del evento,
// con dos guardas mínimas (no degradar un lifetime, no revocar por un producto
// distinto del que concede el acceso).
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
// Opcional pero recomendado:
//   REVENUECAT_API_KEY  — clave secreta v1 de RevenueCat (API keys > Secret),
//                         con permiso de lectura de clientes.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type PremiumTier = 'none' | 'monthly' | 'annual' | 'lifetime';

const ENTITLEMENT = 'pro';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

function tierForProduct(productId: string): PremiumTier {
  const id = (productId || '').toLowerCase();
  if (id.includes('lifetime')) return 'lifetime';
  if (id.includes('annual') || id.includes('yearly')) return 'annual';
  return 'monthly';
}

interface Resolved {
  tier: PremiumTier;
  until: string | null;
}

/**
 * Estado real del entitlement `pro` según RevenueCat. Devuelve `null` si la
 * API no está configurada o falla, para que el llamante decida.
 *
 * Cuando varios productos conceden el mismo entitlement, RevenueCat informa
 * del que expira más tarde; un no consumible no tiene `expires_date`, así que
 * el lifetime siempre gana.
 */
async function resolveFromRevenueCat(apiKey: string, appUserId: string): Promise<Resolved | null> {
  try {
    const res = await fetch(
      `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(appUserId)}`,
      // Sin cabecera X-Platform: con ella RevenueCat asume que llama la app y
      // rechaza la clave secreta (error 7243).
      { headers: { Authorization: `Bearer ${apiKey}` } },
    );
    if (!res.ok) return null;
    const body = await res.json();
    const ent = body?.subscriber?.entitlements?.[ENTITLEMENT];
    if (!ent) return { tier: 'none', until: null };

    const expires: string | null = ent.expires_date ?? null;
    if (expires === null) return { tier: 'lifetime', until: null };
    if (new Date(expires).getTime() <= Date.now()) return { tier: 'none', until: null };
    return { tier: tierForProduct(ent.product_identifier ?? ''), until: expires };
  } catch {
    return null;
  }
}

/** Cálculo de respaldo a partir del evento, cuando no se puede consultar la API. */
function resolveFromEvent(
  type: string,
  event: any,
  current: PremiumTier,
): Resolved | null {
  const eventTier = tierForProduct(event.product_id ?? '');

  if (GRANTING.has(type)) {
    const expiresAtMs: number | null = event.expiration_at_ms ?? null;
    const tier: PremiumTier = expiresAtMs === null ? 'lifetime' : eventTier;
    // Un lifetime no se degrada porque el usuario compre además una suscripción.
    if (current === 'lifetime' && tier !== 'lifetime') return null;
    return { tier, until: expiresAtMs ? new Date(expiresAtMs).toISOString() : null };
  }

  if (REVOKING.has(type)) {
    // Solo revoca el producto que concede el acceso actual. Que caduque un
    // mensual antiguo no debe tumbar el anual o el lifetime que lo sustituyó.
    if (eventTier !== current) return null;
    return { tier: 'none', until: null };
  }

  return null;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const secret = Deno.env.get('REVENUECAT_WEBHOOK_SECRET');
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const RC_API_KEY = Deno.env.get('REVENUECAT_API_KEY')?.trim() || null;

  if (!secret || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return json({ error: 'Server misconfigured' }, 500);
  }

  if (req.headers.get('Authorization') !== secret) {
    return json({ error: 'Unauthorized' }, 401);
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const event = payload?.event ?? {};
  const type: string = event.type ?? '';

  if (!GRANTING.has(type) && !REVOKING.has(type)) {
    // TEST, CANCELLATION, BILLING_ISSUE y demás: nada que cambiar.
    return json({ ok: true, ignored: type });
  }

  // El app_user_id es el uuid de Supabase porque el cliente exige cuenta para
  // comprar. Un id anónimo de RevenueCat (prefijo $RCAnonymousID:) no
  // corresponde a ningún perfil: se acepta sin hacer nada para que RevenueCat
  // no lo reintente en bucle. En un TRANSFER hay que refrescar también a quien
  // pierde la compra.
  const candidates: string[] = [event.app_user_id, ...(event.transferred_from ?? [])];
  const userIds = [...new Set(candidates.filter((id) => typeof id === 'string' && UUID_RE.test(id)))];

  if (userIds.length === 0) {
    return json({ ok: true, skipped: 'anonymous user' });
  }

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const results: Record<string, string> = {};

  for (const userId of userIds) {
    const { data: profile, error: readError } = await admin
      .from('profiles')
      .select('premium_tier')
      .eq('id', userId)
      .maybeSingle();

    if (readError) {
      // 500 para que RevenueCat reintente ante un fallo transitorio.
      return json({ error: readError.message }, 500);
    }
    if (!profile) {
      results[userId] = 'no profile';
      continue;
    }

    const current = (profile.premium_tier ?? 'none') as PremiumTier;

    let resolved: Resolved | null = null;
    let source = 'event';
    if (RC_API_KEY) {
      resolved = await resolveFromRevenueCat(RC_API_KEY, userId);
      if (resolved) source = 'api';
    }
    if (!resolved) resolved = resolveFromEvent(type, event, current);

    if (!resolved) {
      results[userId] = `unchanged (${current})`;
      continue;
    }

    const { error } = await admin.rpc('apply_premium_status', {
      p_user_id: userId,
      p_tier: resolved.tier,
      p_until: resolved.until,
    });
    if (error) {
      return json({ error: error.message }, 500);
    }
    results[userId] = `${resolved.tier} via ${source}`;
  }

  return json({ ok: true, type, results });
});
