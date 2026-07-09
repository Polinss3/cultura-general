import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

interface TabIconProps {
  label: string;
  icon: string;
  focused: boolean;
}

function TabIcon({ label, icon, focused }: TabIconProps) {
  return (
    <View style={{ alignItems: 'center', gap: 2, paddingTop: 6 }}>
      <Text style={{ fontSize: 20 }}>{icon}</Text>
      <Text numberOfLines={1} style={{
        fontSize: 9,
        fontFamily: focused ? 'Outfit_600SemiBold' : 'Outfit_400Regular',
        color: focused ? '#fff' : 'rgba(255,255,255,0.28)',
      }}>
        {label}
      </Text>
      {focused && (
        <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#fff' }} />
      )}
    </View>
  );
}

export default function TabLayout() {
  const { t } = useTranslation();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111',
          borderTopColor: 'rgba(255,255,255,0.06)',
          height: 70,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label={t('tabs.home')} icon="🏠" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="daily"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label={t('tabs.daily')} icon="🏆" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="arena"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label={t('tabs.arena')} icon="🎮" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label={t('tabs.learn')} icon="📚" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label={t('tabs.friends')} icon="👥" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
