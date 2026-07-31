import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// `getSession()` no resuelve mientras supabase-js reintenta refrescar un token
// caducado (backoff exponencial), así que sin red puede tardar minutos. El
// arranque no puede depender de eso: pasado este plazo seguimos sin sesión y
// dejamos que `onAuthStateChange` la corrija cuando el refresh termine.
const SESSION_TIMEOUT_MS = 4000;

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let settled = false;
    let timer: ReturnType<typeof setTimeout>;

    // Desbloquea el arranque una sola vez, gane quien gane la carrera.
    const settle = (next: Session | null) => {
      if (cancelled || settled) return;
      settled = true;
      clearTimeout(timer);
      setSession(next);
      setLoading(false);
    };

    timer = setTimeout(() => settle(null), SESSION_TIMEOUT_MS);

    supabase.auth.getSession()
      .then(({ data }) => settle(data.session))
      .catch(() => settle(null));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      settle(session);     // el primer evento también sirve para desbloquear
      setSession(session); // y los siguientes mantienen la sesión al día
    });

    return () => {
      cancelled = true;
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, []);

  return { session, user: session?.user ?? null, loading };
}
