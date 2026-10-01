import { View, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import type { ResolvedCosmetics } from '@/lib/cosmetics';

interface Props {
  cosmetics?: ResolvedCosmetics | null;
  /** Radio del avatar que envuelve; el marco suma el padding y el borde. */
  radius: number;
  /** Grosor del borde (2 en filas, 3 en el perfil). */
  width?: number;
  style?: ViewStyle;
  children: ReactNode;
}

// Marco de avatar según el cosmético equipado (color y, en los PRO con halo,
// una sombra del mismo color). Sin marco, devuelve el avatar tal cual para que
// las filas sin cosméticos no cambien de tamaño.
export function AvatarFrame({ cosmetics, radius, width = 2, style, children }: Props) {
  const color = cosmetics?.frameColor;
  if (!color) return style ? <View style={style}>{children}</View> : <>{children}</>;
  const pad = width >= 3 ? 3 : 1.5;
  return (
    <View style={[
      { borderWidth: width, borderColor: color, borderRadius: radius + pad + width, padding: pad },
      cosmetics?.frameGlow
        ? { shadowColor: color, shadowOpacity: 0.85, shadowRadius: 8, shadowOffset: { width: 0, height: 0 }, elevation: 6 }
        : null,
      style,
    ]}>
      {children}
    </View>
  );
}
