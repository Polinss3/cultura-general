import { Pressable, View, Text } from 'react-native';

export interface PowerUpButton {
  id: string;
  icon: string;
  label: string;
  count: number;
}

interface Props {
  items: PowerUpButton[];
  onUse: (id: string) => void;
  disabled?: boolean;
}

export function PowerUpBar({ items, onUse, disabled }: Props) {
  if (items.length === 0) return null;
  return (
    <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
      {items.map(it => {
        const usable = !disabled && it.count > 0;
        return (
          <Pressable
            key={it.id}
            onPress={() => usable && onUse(it.id)}
            style={{
              flex: 1,
              backgroundColor: '#151515',
              borderRadius: 12,
              paddingVertical: 8,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: usable ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
              opacity: usable ? 1 : 0.4,
            }}
          >
            <Text style={{ fontSize: 18 }}>{it.icon}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Outfit_500Medium', fontSize: 10, marginTop: 2 }}>
              {it.label}
            </Text>
            <Text style={{ color: usable ? '#e8a030' : 'rgba(255,255,255,0.3)', fontFamily: 'Outfit_700Bold', fontSize: 11, marginTop: 1 }}>
              ×{it.count}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
