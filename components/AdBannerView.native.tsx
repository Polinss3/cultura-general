import { useEffect, useState } from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import {
  APPODEAL_PLACEMENTS,
  isBannerEnabled,
  subscribeAdsState,
} from '@/lib/ads';
import { useTheme } from '@/constants/colors';

type AdsModule = typeof import('react-native-appodeal');

type Props = {
  focused: boolean;
  // Etiqueta de superficie que traen las pantallas de Aventura. Appodeal solo
  // tiene dado de alta `gameplay_banner` en el dashboard, asi que no se reenvia
  // al SDK: mandar un placement inexistente lo degrada al de por defecto.
  placement?: string;
};

let modTried = false;
let mod: AdsModule | null = null;

function getAdsModule(): AdsModule | null {
  if (!modTried) {
    modTried = true;
    try {
      // Este componente solo se monta cuando consentimiento + SDK están listos.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      mod = require('react-native-appodeal');
    } catch {
      mod = null;
    }
  }
  return mod;
}

export function AdBannerView({ focused }: Props) {
  const { height, width } = useWindowDimensions();
  const { C } = useTheme();
  const [, setRevision] = useState(0);

  useEffect(() => subscribeAdsState(() => setRevision(value => value + 1)), []);

  const tablet = width >= 768;
  const reservedHeight = tablet ? 90 : 50;
  const enabled = focused && height >= 500 && isBannerEnabled();
  const m = enabled ? getAdsModule() : null;

  if (!focused || height < 500) return null;
  if (!enabled || !m) {
    return __DEV__ ? (
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        pointerEvents="none"
        style={{
          height: reservedHeight,
          alignItems: 'center',
          justifyContent: 'center',
          borderTopWidth: 1,
          borderTopColor: C.border,
        }}
      >
        <Text style={{ opacity: 0.35, fontSize: 11 }}>Appodeal test banner</Text>
      </View>
    ) : null;
  }

  const Banner = m.AppodealBanner;
  return (
    <View style={{
      height: reservedHeight,
      width: '100%',
      alignItems: 'center',
      overflow: 'hidden',
      borderTopWidth: 1,
      borderTopColor: C.border,
      backgroundColor: C.bg,
    }}>
      <Banner
        adSize={tablet ? 'tablet' : 'phone'}
        placement={APPODEAL_PLACEMENTS.gameplayBanner}
        usesSmartSizing
        style={{ width: '100%', height: '100%' }}
      />
    </View>
  );
}
