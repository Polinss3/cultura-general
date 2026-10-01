import { Tabs } from 'expo-router';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Platform, Text, View, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme, type Palette } from '@/constants/colors';
import { Font, Radius } from '@/constants/theme';
import { IPadGlassTabBar } from '@/components/ipad-glass-tab-bar';

interface TabIconProps {
  label: string;
  icon: string;
  focused: boolean;
  C: Palette;
  pillWidth: number;
}

function TabIcon({ label, icon, focused, C, pillWidth }: TabIconProps) {
  return (
    <View style={{
      width: pillWidth,
      height: 64,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      paddingHorizontal: 4,
      borderRadius: Radius.row,
      backgroundColor: focused ? C.brandTint : 'transparent',
      // Las inactivas se apagan al 55 %, sin puntito de selección.
      opacity: focused ? 1 : 0.55,
    }}>
      <Text style={{ fontSize: 20 }}>{icon}</Text>
      <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.9} style={{
        fontSize: 12,
        fontFamily: focused ? Font.extra : Font.bold,
        color: focused ? C.brandDeep : C.textMuted,
      }}>
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const { t } = useTranslation();
  const { C } = useTheme();
  const { width } = useWindowDimensions();
  // La píldora ocupa siempre la anchura de «Aventura»; en móviles estrechos
  // se reduce toda la serie por igual para que no invada las pestañas vecinas.
  const pillWidth = Math.min(72, width / 5 - 4);
  const iosVersion = Platform.OS === 'ios' ? Number.parseInt(String(Platform.Version), 10) : 0;
  const iPadOS26 = Platform.OS === 'ios' && Platform.isPad && iosVersion === 26;

  if (Platform.OS === 'ios' && iosVersion >= 26 && !iPadOS26) {
    // La barra nativa sigue igual en iPhone (iOS 26+) y en iOS 27.
    // En iPadOS 26 UIKit la coloca arriba; allí usamos la barra inferior.
    return (
      <NativeTabs tintColor={C.brand} minimizeBehavior="never">
        <NativeTabs.Trigger name="index">
          <Icon sf={{ default: 'house', selected: 'house.fill' }} />
          <Label>{t('tabs.home')}</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="daily">
          <Icon sf={{ default: 'trophy', selected: 'trophy.fill' }} />
          <Label>{t('tabs.daily')}</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="challenges">
          <Icon sf={{ default: 'target', selected: 'target' }} />
          <Label>{t('tabs.challenges')}</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="adventure">
          <Icon sf={{ default: 'safari', selected: 'safari.fill' }} />
          <Label>{t('tabs.adventure')}</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="learn">
          <Icon sf={{ default: 'books.vertical', selected: 'books.vertical.fill' }} />
          <Label>{t('tabs.learn')}</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  return (
    <Tabs
      tabBar={iPadOS26 ? props => <IPadGlassTabBar {...props} /> : undefined}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: C.surface2,
          borderTopColor: C.border,
          borderTopWidth: 1,
          // 58 de contenido + el hueco del indicador de inicio. Por debajo de
          // esto la píldora y la etiqueta se recortan.
          height: 92,
          paddingTop: 8,
        },
        tabBarShowLabel: false,
        // Sin esto el icono va a una caja fija más baja que la píldora.
        tabBarIconStyle: { width: '100%', height: 64 },
        animation: 'none',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label={t('tabs.home')} icon="🏠" focused={focused} C={C} pillWidth={pillWidth} />
          ),
        }}
      />
      <Tabs.Screen
        name="daily"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label={t('tabs.daily')} icon="🏆" focused={focused} C={C} pillWidth={pillWidth} />
          ),
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label={t('tabs.challenges')} icon="🎯" focused={focused} C={C} pillWidth={pillWidth} />
          ),
        }}
      />
      <Tabs.Screen
        name="adventure"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label={t('tabs.adventure')} icon="🧭" focused={focused} C={C} pillWidth={pillWidth} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label={t('tabs.learn')} icon="📚" focused={focused} C={C} pillWidth={pillWidth} />
          ),
        }}
      />
    </Tabs>
  );
}
