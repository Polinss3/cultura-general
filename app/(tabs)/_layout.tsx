import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { usePendingFriendRequests } from '@/hooks/usePendingFriendRequests';

interface TabIconProps {
  label: string;
  icon: string;
  focused: boolean;
  badge?: number;
}

function TabIcon({ label, icon, focused, badge = 0 }: TabIconProps) {
  return (
    <View style={{ alignItems: 'center', gap: 2, paddingTop: 6 }}>
      <View>
        <Text style={{ fontSize: 20 }}>{icon}</Text>
        {badge > 0 && (
          <View
            style={{
              position: 'absolute',
              top: -4,
              right: -10,
              minWidth: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: '#e83060',
              paddingHorizontal: 4,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1.5,
              borderColor: '#111',
            }}
          >
            <Text style={{ color: '#fff', fontFamily: 'Outfit_700Bold', fontSize: 10 }}>
              {badge > 9 ? '9+' : badge}
            </Text>
          </View>
        )}
      </View>
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
  const { count: pendingRequests } = usePendingFriendRequests();

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
            <TabIcon label="Amigos" icon="👥" focused={focused} badge={pendingRequests} />
          ),
        }}
      />
    </Tabs>
  );
}
