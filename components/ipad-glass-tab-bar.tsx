import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassView } from 'expo-glass-effect';
import { SymbolView } from 'expo-symbols';
import { alpha, useTheme } from '@/constants/colors';
import { Font, Radius } from '@/constants/theme';
import { useAppleLiquidGlass } from '@/hooks/use-apple-liquid-glass';

const TABS = {
  index: { label: 'tabs.home', icon: 'house', selectedIcon: 'house.fill' },
  daily: { label: 'tabs.daily', icon: 'trophy', selectedIcon: 'trophy.fill' },
  challenges: { label: 'tabs.challenges', icon: 'target', selectedIcon: 'target' },
  adventure: { label: 'tabs.adventure', icon: 'safari', selectedIcon: 'safari.fill' },
  learn: { label: 'tabs.learn', icon: 'books.vertical', selectedIcon: 'books.vertical.fill' },
} as const;

/** iPadOS 26 coloca NativeTabs arriba. Esta barra conserva los cinco destinos
 * y los símbolos de iPhone, con vidrio nativo pero posición inferior fija. */
export function IPadGlassTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const glassAvailable = useAppleLiquidGlass(26);

  return (
    <View style={{ alignItems: 'center', paddingHorizontal: 16, paddingTop: 6, paddingBottom: Math.max(insets.bottom, 12), backgroundColor: C.bg }}>
      <View style={{ width: '100%', maxWidth: 540, borderRadius: Radius.pill, borderCurve: 'continuous', boxShadow: isDark ? '0 6px 18px rgba(0,0,0,0.32)' : '0 8px 24px rgba(61,43,27,0.16)' }}>
        <View style={{ height: 72, borderRadius: Radius.pill, borderCurve: 'continuous', overflow: 'hidden', borderWidth: 1, borderColor: alpha(C.surface, isDark ? 0.35 : 0.8), backgroundColor: glassAvailable ? 'transparent' : C.surface2 }}>
          {glassAvailable && (
            <GlassView
              pointerEvents="none"
              glassEffectStyle="regular"
              colorScheme={isDark ? 'dark' : 'light'}
              style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, borderRadius: Radius.pill }}
            />
          )}
          <View style={{ flex: 1, flexDirection: 'row', padding: 5 }}>
            {state.routes.map((route, index) => {
              const tab = TABS[route.name as keyof typeof TABS];
              if (!tab) return null;
              const selected = state.index === index;
              const label = t(tab.label);
              const options = descriptors[route.key].options;

              return (
                <Pressable
                  key={route.key}
                  accessibilityRole="tab"
                  accessibilityState={{ selected }}
                  accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
                  testID={options.tabBarButtonTestID}
                  onPress={() => {
                    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                    if (!selected && !event.defaultPrevented) navigation.navigate(route.name, route.params);
                  }}
                  onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
                  style={{ flex: 1, minHeight: 60, alignItems: 'center', justifyContent: 'center', gap: 3, borderRadius: Radius.pill, backgroundColor: selected ? alpha(C.brand, isDark ? 0.26 : 0.16) : 'transparent' }}
                >
                  <SymbolView name={selected ? tab.selectedIcon : tab.icon} size={24} tintColor={selected ? C.brandDeep : C.textMuted} />
                  <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85} style={{ color: selected ? C.brandDeep : C.textMuted, fontFamily: selected ? Font.extra : Font.bold, fontSize: 12 }}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}
