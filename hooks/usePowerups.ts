import { useState, useEffect, useCallback } from 'react';
import { fetchInventoryMap, consumeItem } from '@/lib/shop';

// Inventario de power-ups para las pantallas de juego. Carga el mapa item→cantidad
// y expone `consume` (descuento optimista local + consumo en servidor) y `refresh`.
// `enabled` = usuario con cuenta y online (los invitados/offline no usan power-ups).
export function usePowerups(enabled: boolean, userId?: string) {
  const [inventory, setInventory] = useState<Record<string, number>>({});

  const refresh = useCallback(() => {
    if (enabled && userId) fetchInventoryMap(userId).then(setInventory);
  }, [enabled, userId]);

  useEffect(() => { refresh(); }, [refresh]);

  const consume = useCallback((id: string) => {
    setInventory(inv => ({ ...inv, [id]: Math.max(0, (inv[id] ?? 0) - 1) }));
    consumeItem(id);
  }, []);

  return { inventory, consume, refresh };
}
