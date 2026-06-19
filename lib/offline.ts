// Estado global de "modo sin conexión".
//
// En memoria (no se persiste): refleja si la app está operando sin acceso al
// backend durante esta sesión. Replica el patrón ligero de `guest.ts`
// (módulo + listeners) para que cualquier pantalla pueda leerlo vía `useOffline`.

type Listener = (offline: boolean) => void;
const listeners = new Set<Listener>();

let offline = false;

export function isOffline(): boolean {
  return offline;
}

export function setOffline(value: boolean): void {
  if (offline === value) return;
  offline = value;
  listeners.forEach(l => l(value));
}

export function subscribeOffline(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// ─── Sonda de conectividad ────────────────────────────────────
//
// Hace un fetch ligero al endpoint de salud de Supabase con timeout. Devuelve
// `true` si el backend es alcanzable. Evita añadir dependencias nativas
// (NetInfo) y mide lo que realmente importa: si podemos hablar con el servidor.

export async function probeConnection(timeoutMs = 8000): Promise<boolean> {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const apikey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!url) return false;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Cualquier respuesta HTTP (incluso 4xx/5xx) implica que hay red; solo un
    // fallo de red o el timeout (abort) cuentan como "sin conexión".
    await fetch(`${url}/auth/v1/health`, {
      method: 'GET',
      headers: apikey ? { apikey } : undefined,
      signal: controller.signal,
    });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}
