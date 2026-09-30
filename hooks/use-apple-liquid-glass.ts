import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
import { isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect';

/** El vidrio personalizado se activa desde iOS 27 por defecto. La barra del
 * iPad en iOS 26 puede pedirlo explícitamente; la barra nativa la controla UIKit. */
export function useAppleLiquidGlass(minimumIOSVersion = 27): boolean {
  const [reduceTransparency, setReduceTransparency] = useState<boolean | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'ios' || Number.parseInt(String(Platform.Version), 10) < minimumIOSVersion) return;
    let active = true;
    AccessibilityInfo.isReduceTransparencyEnabled().then(enabled => {
      if (active) setReduceTransparency(enabled);
    }).catch(() => {});
    const subscription = AccessibilityInfo.addEventListener('reduceTransparencyChanged', setReduceTransparency);
    return () => {
      active = false;
      subscription.remove();
    };
  }, [minimumIOSVersion]);

  return Platform.OS === 'ios'
    && Number.parseInt(String(Platform.Version), 10) >= minimumIOSVersion
    && reduceTransparency === false
    && isLiquidGlassAvailable()
    && isGlassEffectAPIAvailable();
}
