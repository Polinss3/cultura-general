import { useEffect, useState } from 'react';
import { isOffline, subscribeOffline } from '@/lib/offline';

export function useOffline() {
  const [offline, setOffline] = useState<boolean>(isOffline());

  useEffect(() => {
    setOffline(isOffline());
    return subscribeOffline(setOffline);
  }, []);

  return offline;
}
