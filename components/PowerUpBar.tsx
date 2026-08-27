import { Pressable, View, Text } from 'react-native';
import { useColors } from '@/constants/colors';
import { Font, Radius } from '@/constants/theme';

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
  const C = useColors();
  if (items.length === 0) return null;

  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      {items.map(it => {
        const usable = !disabled && it.count > 0;
        return (
          <Pressable
            key={it.id}
            accessibilityRole="button"
            accessibilityLabel={`${it.label}, ${it.count}`}
            accessibilityState={{ disabled: !usable }}
            disabled={!usable}
            onPress={() => usable && onUse(it.id)}
            style={{
              flex: 1,
              backgroundColor: usable ? C.surface : C.surfaceSunk,
              borderRadius: Radius.row,
              paddingVertical: 11,
              paddingHorizontal: 12,
              minHeight: 46,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              borderWidth: 1,
              borderColor: C.border,
              opacity: usable ? 1 : 0.55,
            }}
          >
            <Text style={{ fontSize: 18 }}>{it.icon}</Text>
            <Text numberOfLines={1} style={{ flex: 1, color: C.text, fontFamily: Font.extra, fontSize: 13 }}>
              {it.label}
            </Text>
            <Text style={{ color: usable ? C.brandDeep : C.textFaint, fontFamily: Font.black, fontSize: 13 }}>
              ×{it.count}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
