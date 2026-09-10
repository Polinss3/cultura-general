import { useEffect, useState } from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import { AdView } from '@inhouse/mobile-sdk/react-native';
import type { AdPresentation } from '@inhouse/mobile-sdk';
import {
  isBannerEnabled,
  registerBannerPresentation,
  requestBannerAd,
  subscribeAdsState,
} from '@/lib/ads';
import { useTheme } from '@/constants/colors';

type Props = {
  focused: boolean;
  placement?: string;
};

/**
 * Alto del hueco del banner: 320×50 en móvil y 728×90 en tablet. Desde el SDK
 * 1.1 el banner es tradicional —la creatividad es el anuncio entero, sin
 * etiqueta ni botones fuera— así que el hueco es el de siempre.
 */
function bannerBlockHeight(tablet: boolean) {
  return tablet ? 90 : 50;
}

export function AdBannerView({ focused, placement = 'game_screen' }: Props) {
  const { height, width } = useWindowDimensions();
  const { C } = useTheme();
  const [revision, setRevision] = useState(0);
  const [presentation, setPresentation] = useState<AdPresentation | null>(null);

  useEffect(() => subscribeAdsState(() => setRevision(value => value + 1)), []);

  const tablet = width >= 768;
  const reservedHeight = bannerBlockHeight(tablet);
  // Pantalla corta: el hueco se comería el contenido. Antes que un banner mal
  // puesto, ninguno.
  const roomy = height >= 500;
  void revision;
  const enabled = focused && roomy && isBannerEnabled();

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    let unregister = () => {};

    void requestBannerAd().then(next => {
      // Sin campaña, sin red o con un anuncio a pantalla completa por delante:
      // el hueco se queda vacío y la pantalla sigue igual.
      if (!next) return;
      if (cancelled) {
        next.dismiss();
        return;
      }
      unregister = registerBannerPresentation(next);
      setPresentation(next);
    });

    return () => {
      cancelled = true;
      unregister();
      setPresentation(current => {
        current?.dismiss();
        return null;
      });
    };
  }, [enabled, placement]);

  if (!focused || !roomy) return null;

  if (!presentation) {
    return __DEV__ ? (
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        pointerEvents="none"
        style={{
          height: reservedHeight, alignItems: 'center', justifyContent: 'center',
          borderTopWidth: 1, borderTopColor: C.border,
        }}
      >
        <Text style={{ opacity: 0.35, fontSize: 11 }}>In-House banner placeholder</Text>
      </View>
    ) : null;
  }

  // Separado del contenido por un borde: el hueco es suyo y el usuario ve
  // dónde acaba la pantalla y dónde empieza la publicidad.
  return (
    <View style={{
      height: reservedHeight, width: '100%', overflow: 'hidden',
      borderTopWidth: 1, borderTopColor: C.border, backgroundColor: C.bg,
    }}>
      <AdView
        key={presentation.ad.trackingToken}
        presentation={presentation}
        focused={focused}
        bannerHeight={reservedHeight}
        onClose={() => setPresentation(null)}
      />
    </View>
  );
}
