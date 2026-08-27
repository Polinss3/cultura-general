import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme, type Palette } from '@/constants/colors';
import { Font, Radius } from '@/constants/theme';

interface TabIconProps {
  label: string;
  icon: string;
  focused: boolean;
  C: Palette;
}

function TabIcon({ label, icon, focused, C }: TabIconProps) {
  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      paddingVertical: 6,
      // Con 5 pestañas y la etiqueta a 12 px (el suelo), más holgura que esta
      // corta "Aprender" y "Amigos".
      paddingHorizontal: 8,
      borderRadius: Radius.row,
      backgroundColor: focused ? C.brandTint : 'transparent',
      // Las inactivas se apagan al 55 %, sin puntito de selección.
      opacity: focused ? 1 : 0.55,
    }}>
      <Text style={{ fontSize: 20 }}>{icon}</Text>
      <Text numberOfLines={1} style={{
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

  return (
    <Tabs
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
        tabBarIconStyle: { width: '100%', height: 52 },
        animation: 'none',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label={t('tabs.home')} icon="🏠" focused={focused} C={C} />
          ),
        }}
      />
      <Tabs.Screen
        name="daily"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label={t('tabs.daily')} icon="🏆" focused={focused} C={C} />
          ),
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label={t('tabs.challenges')} icon="🎯" focused={focused} C={C} />
          ),
        }}
      />
      <Tabs.Screen
        name="adventure"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label={t('tabs.adventure')} icon="🧭" focused={focused} C={C} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label={t('tabs.learn')} icon="📚" focused={focused} C={C} />
          ),
        }}
      />
      <Tabs.Screen name="friends" options={{ href: null }} />
    </Tabs>
  );
}
