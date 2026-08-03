import { useEffect, useState } from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import { AdFormat, AdView, type AdInfo } from 'react-native-applovin-max';
import {
  getBannerAdUnitId,
  handleAdRevenue,
  isBannerEnabled,
  subscribeAdsState,
} from '@/lib/ads';
import { useTheme } from '@/constants/colors';

type Props = {
  focused: boolean;
};

export function AdBannerView({ focused }: Props) {
  const { height, width } = useWindowDimensions();
  const { C } = useTheme();
  const [revision, setRevision] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => subscribeAdsState(() => setRevision(value => value + 1)), []);

  const adUnitId = getBannerAdUnitId();
  const tablet = width >= 768;
  const reservedHeight = tablet ? 90 : 50;
  const enabled = focused && height >= 500 && isBannerEnabled() && Boolean(adUnitId);
  void revision;

  if (!focused || height < 500) return null;
  if (!enabled || !adUnitId) {
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
        <Text style={{ opacity: 0.35, fontSize: 11 }}>MAX banner placeholder</Text>
      </View>
    ) : null;
  }

  // Separado del contenido por un borde: el hueco es suyo y el usuario ve
  // dónde acaba la pantalla y dónde empieza la publicidad.
  return (
    <View style={{
      height: reservedHeight, width: '100%', alignItems: 'center', overflow: 'hidden',
      borderTopWidth: 1, borderTopColor: C.border, backgroundColor: C.bg,
    }}>
      <AdView
        adUnitId={adUnitId}
        adFormat={AdFormat.BANNER}
        placement="game_screen"
        autoRefresh={false}
        loadOnMount
        style={{ width: tablet ? 728 : 320, height: reservedHeight, opacity: loaded ? 1 : 0 }}
        onAdLoaded={() => setLoaded(true)}
        onAdLoadFailed={() => setLoaded(false)}
        onAdRevenuePaid={(info: AdInfo) => handleAdRevenue(info)}
      />
    </View>
  );
}

