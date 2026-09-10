import { useEffect, useState } from 'react';
import { AdView } from '@inhouse/mobile-sdk/react-native';
import { closeFullscreenAd, getFullscreenAd, subscribeFullscreenAd } from '@/lib/ads';

/**
 * Único sitio donde se pinta un anuncio a pantalla completa.
 *
 * Va en el layout raíz, hermano del `Stack`, porque el visor del SDK es un
 * `Modal` a pantalla completa: montarlo dentro de una pantalla lo ataría a su
 * ciclo de vida y el anuncio moriría con la navegación que lo provocó, justo
 * cuando el intersticial acaba de aparecer.
 *
 * `focused` va fijo a `true` porque este modal está por encima de todo lo
 * demás: nada de la app puede taparlo. El SDK ya se encarga por su cuenta de
 * pausar la medición cuando la app pasa a segundo plano o pierde el foco.
 */
export function AdFullscreenHost() {
  const [slot, setSlot] = useState(getFullscreenAd());

  useEffect(() => subscribeFullscreenAd(() => setSlot(getFullscreenAd())), []);

  if (!slot) return null;

  return (
    <AdView
      key={slot.presentation.ad.trackingToken}
      presentation={slot.presentation}
      focused
      onClose={closeFullscreenAd}
      onReward={slot.onReward}
    />
  );
}
