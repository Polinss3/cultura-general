import { Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { rankForLevel } from '@/lib/leveling';

export function LevelBadge({ level, size = 44 }: { level: number; size?: number }) {
  const rank = rankForLevel(level);
  return (
    <LinearGradient
      colors={[rank.color, rank.color2]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.32,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: rank.color,
        shadowOpacity: 0.55,
        shadowRadius: 9,
        shadowOffset: { width: 0, height: 3 },
        elevation: 8,
      }}
    >
      <Text
        style={{
          color: '#fff',
          fontFamily: 'Outfit_800ExtraBold',
          fontSize: size * 0.44,
          textShadowColor: 'rgba(0,0,0,0.28)',
          textShadowRadius: 3,
          textShadowOffset: { width: 0, height: 1 },
        }}
      >
        {level}
      </Text>
    </LinearGradient>
  );
}
