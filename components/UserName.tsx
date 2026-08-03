import { View, Text, TextStyle } from 'react-native';
import { ResolvedCosmetics } from '@/lib/cosmetics';
import { useColors } from '@/constants/colors';
import { Font } from '@/constants/theme';

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
export function UserName({ name, cosmetics, suffix = '', color, fontFamily = Font.semi, fontSize = 14, style }: Props) {
  const C = useColors();
  const c = cosmetics ?? {};
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 1 }}>
      {c.nameIcon ? <Text style={{ fontSize }}>{c.nameIcon}</Text> : null}
      <Text
        numberOfLines={1}
        style={[{ color: c.nameColor ?? color ?? C.text, fontFamily, fontSize }, c.nameStyle, style]}
      >
        {name}{suffix}
      </Text>
    </View>
  );
}
