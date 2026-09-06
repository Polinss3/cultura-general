import { View, Text } from 'react-native';
import { alpha, useTheme } from '@/constants/colors';
import { Font, Radius } from '@/constants/theme';
import { PRO_ACCENT } from '@/lib/pro';

interface Props {
  /** 'mini' = solo el sello, para filas de ranking. 'chip' = sello con texto. */
  variant?: 'mini' | 'chip';
}

/**
 * Sello PRO. Aparece junto al nombre en rankings, liga, amigos y perfil.
 *
 * Es deliberadamente pequeño y de un solo color: compite por espacio con la
 * insignia de liga y los cosméticos de nombre, así que tiene que leerse de un
 * vistazo sin robarles sitio.
 */
export function ProBadge({ variant = 'mini' }: Props) {
  const { C, isDark } = useTheme();

  return (
    <View
      accessibilityLabel="PRO"
      style={{
        backgroundColor: isDark ? alpha(PRO_ACCENT, 0.28) : alpha(PRO_ACCENT, 0.14),
        borderColor: alpha(PRO_ACCENT, isDark ? 0.6 : 0.4),
        borderWidth: 1,
        borderRadius: Radius.pill,
        paddingHorizontal: variant === 'mini' ? 6 : 10,
        paddingVertical: variant === 'mini' ? 1 : 4,
      }}
    >
      <Text style={{
        color: isDark ? '#C4A8F5' : PRO_ACCENT,
        fontFamily: Font.black,
        fontSize: variant === 'mini' ? 10 : 12,
        letterSpacing: 0.8,
      }}>
        PRO
      </Text>
    </View>
  );
}
