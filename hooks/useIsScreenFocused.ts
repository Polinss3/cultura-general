import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

/**
 * `true` mientras la pantalla está enfocada. El banner lo necesita para
 * cumplir la regla de "solo en pantalla de juego enfocada": al navegar fuera
 * se desmonta el AdView y se detiene la unidad.
 */
export function useIsScreenFocused(): boolean {
  const [focused, setFocused] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => setFocused(false);
    }, []),
  );

  return focused;
}
