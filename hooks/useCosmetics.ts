import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { fetchEquippedCosmetics, EquippedCosmetics } from '@/lib/cosmetics';

// Cosméticos equipados del usuario propio (marco de avatar / color de nombre).
// Se refresca al enfocar la pantalla (para reflejar cambios hechos en la tienda).
export function useCosmetics(enabled: boolean, userId?: string) {
  const [cosmetics, setCosmetics] = useState<EquippedCosmetics>({});

  useFocusEffect(
    useCallback(() => {
      if (enabled && userId) fetchEquippedCosmetics(userId).then(setCosmetics);
    }, [enabled, userId]),
  );

  return cosmetics;
}
