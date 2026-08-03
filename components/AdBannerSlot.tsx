import { AdBannerView } from '@/components/AdBannerView';
import { useIsScreenFocused } from '@/hooks/useIsScreenFocused';

/**
 * Hueco del banner al pie de una pantalla de juego.
 *
 * Va como último hijo del contenedor de pantalla, nunca superpuesto: el
 * contenido ocupa `flex: 1` y el banner vive por debajo, en su propio hueco
 * reservado y separado por un borde, de modo que no puede tapar ningún
 * control. Si la publicidad está apagada no renderiza nada (fuera de `__DEV__`)
 * y la pantalla queda exactamente igual que antes.
 */
export function AdBannerSlot() {
  const focused = useIsScreenFocused();
  return <AdBannerView focused={focused} />;
}
