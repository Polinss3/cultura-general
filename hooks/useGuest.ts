import { useEffect, useState } from 'react';
import { isGuest, subscribeGuestMode } from '@/lib/guest';

export function useGuest() {
  const [guest, setGuest] = useState<boolean | null>(null);

  useEffect(() => {
    isGuest().then(setGuest);
    return subscribeGuestMode(setGuest);
  }, []);

  return { guest: guest ?? false, loading: guest === null };
}
