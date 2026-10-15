import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
/** Native iOS tabs float over content. Reserve their full footprint once. */
export function useChallengeBottomInset() {
  const insets = useSafeAreaInsets();
  const floating = Platform.OS === 'ios' && Number.parseInt(String(Platform.Version), 10) >= 26 &&
    !(Platform.isPad && Number.parseInt(String(Platform.Version), 10) === 26);
  return floating ? Math.max(insets.bottom, 100) : 20;
}
