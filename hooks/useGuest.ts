import { useEffect, useState } from 'react';
import { isGuest, subscribeGuestMode } from '@/lib/guest';

export function useGuest() {
  const [guest, setGuest] = useState<boolean | null>(null);

  useEffect(() => {
    // Si el storage falla, seguimos como "no invitado": nunca dejamos el
    // arranque colgado esperando esta respuesta.
    isGuest().then(setGuest).catch(() => setGuest(false));
    return subscribeGuestMode(setGuest);
  }, []);

  return { guest: guest ?? false, loading: guest === null };
}
