import { View, Text, TextStyle } from 'react-native';
import { ResolvedCosmetics } from '@/lib/cosmetics';

interface Props {
  name: string;
  cosmetics?: ResolvedCosmetics;
  suffix?: string;            // p.ej. " (tú)"
  color?: string;             // color por defecto si no hay cosmético de color
  fontFamily?: string;
  fontSize?: number;
  style?: TextStyle;
}

// Nombre de usuario con cosméticos: icono/emoji delante, color y estilo.
// Si no hay cosméticos, se comporta como un <Text> normal.
export function UserName({ name, cosmetics, suffix = '', color = '#fff', fontFamily = 'Outfit_600SemiBold', fontSize = 14, style }: Props) {
  const c = cosmetics ?? {};
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 1 }}>
      {c.nameIcon ? <Text style={{ fontSize }}>{c.nameIcon}</Text> : null}
      <Text
        numberOfLines={1}
        style={[{ color: c.nameColor ?? color, fontFamily, fontSize }, c.nameStyle, style]}
      >
        {name}{suffix}
      </Text>
    </View>
  );
}
