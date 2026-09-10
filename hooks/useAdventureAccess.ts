import { useEffect, useState } from 'react';
import { useIsPro } from './usePremium';
import { highestAdventureLevelReached, resolveAdventureLegacy } from '@/lib/adventure-access';
import type { AdventureProgress } from '@/lib/adventure';
import type { AdventureAccess } from '@/lib/pro';

/**
 * Acceso del usuario a Aventura: PRO abre 1-20; la herencia conserva 1-10.
 *
 * El efecto no depende de la identidad del objeto `progress` —cambia en cada
 * carga y sincronización— sino del nivel más alto alcanzado, que es lo único
 * que decide la herencia. Y una vez marcado legacy no se vuelve a preguntar:
 * es una condición irreversible.
 */
export function useAdventureAccess(
  progress: AdventureProgress | null,
  scope: string,
  remoteEnabled: boolean,
): AdventureAccess {
  const isPro = useIsPro();
  const [legacy, setLegacy] = useState(false);
  const reached = progress ? highestAdventureLevelReached(progress) : 0;

  useEffect(() => {
    if (!progress || legacy) return;
    let cancelled = false;
    resolveAdventureLegacy({ scope, progress, remoteEnabled }).then(result => {
      if (!cancelled && result) setLegacy(true);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, remoteEnabled, reached, legacy]);

  return { isPro, legacy };
}
