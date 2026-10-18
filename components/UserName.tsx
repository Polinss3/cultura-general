import { View, Text, TextStyle } from 'react-native';
import { ResolvedCosmetics, themedName } from '@/lib/cosmetics';
import { ProBadge } from './ProBadge';
import { useTheme } from '@/constants/colors';
import { Font } from '@/constants/theme';

interface Props {
  name: string;
  cosmetics?: ResolvedCosmetics;
  suffix?: string;            // p.ej. " (tú)"
  isPro?: boolean;            // añade el sello PRO detrás del nombre
  color?: string;             // color por defecto si no hay cosmético de color
  fontFamily?: string;
  fontSize?: number;
  style?: TextStyle;
}

// Nombre de usuario con cosméticos: icono/emoji delante, color y estilo.
// Si no hay cosméticos, se comporta como un <Text> normal.
export function UserName({ name, cosmetics, suffix = '', isPro, color, fontFamily = Font.semi, fontSize = 14, style }: Props) {
  const { C, isDark } = useTheme();
  const c = cosmetics ?? {};
  const themed = themedName(c, isDark);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 1 }}>
      {c.nameIcon ? <Text style={{ fontSize }}>{c.nameIcon}</Text> : null}
      <Text
        numberOfLines={1}
        style={[{ color: themed.color ?? color ?? C.text, fontFamily, fontSize }, themed.style, style]}
      >
        {name}{suffix}
      </Text>
      {isPro ? <ProBadge /> : null}
    </View>
  );
}
