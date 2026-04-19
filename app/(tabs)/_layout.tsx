import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';

interface TabIconProps {
  label: string;
  icon: string;
  focused: boolean;
}

function TabIcon({ label, icon, focused }: TabIconProps) {
  return (
    <View style={{ alignItems: 'center', gap: 2, paddingTop: 6 }}>
      <Text style={{ fontSize: 20 }}>{icon}</Text>
      <Text style={{
        fontSize: 10,
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
            <TabIcon label="Inicio" icon="🏠" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="daily"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Diario" icon="🏆" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="speed"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Rápido" icon="⚡" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Aprender" icon="📚" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Amigos" icon="👥" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
