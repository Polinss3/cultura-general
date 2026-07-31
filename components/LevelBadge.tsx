import { Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { rankForLevel } from '@/lib/leveling';
import { useTheme } from '@/constants/colors';
import { Font } from '@/constants/theme';

export function LevelBadge({ level, size = 46 }: { level: number; size?: number }) {
  const rank = rankForLevel(level);
  const { isDark } = useTheme();

  return (
    <LinearGradient
      colors={[rank.color, rank.color2]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.34,
        alignItems: 'center',
        justifyContent: 'center',
        // En claro, un halo suave del propio rango; en oscuro, sin sombra.
        ...(isDark
          ? {}
          : {
              shadowColor: rank.color,
              shadowOpacity: 0.4,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 5 },
              elevation: 3,
            }),
      }}
    >
      <Text
        style={{
          // Blanco sobre el gradiente del rango, en los dos esquemas.
          color: '#FFFFFF',
          fontFamily: Font.black,
          fontSize: size * 0.42,
          textShadowColor: 'rgba(0,0,0,0.25)',
          textShadowRadius: 3,
          textShadowOffset: { width: 0, height: 1 },
        }}
      >
        {level}
      </Text>
    </LinearGradient>
  );
}
