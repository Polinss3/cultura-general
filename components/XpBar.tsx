import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { progressToNext } from '@/lib/leveling';

interface Props {
  xp: number;
  showLabel?: boolean;
  height?: number;
}

export function XpBar({ xp, showLabel = true, height = 8 }: Props) {
  const p = progressToNext(xp);
  return (
    <View>
      {showLabel && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text style={{ color: p.rank.color, fontFamily: 'Outfit_700Bold', fontSize: 13 }}>
            {p.rank.name}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Outfit_400Regular', fontSize: 12 }}>
            {p.toNext} XP para nivel {p.level + 1}
          </Text>
        </View>
      )}
      <View style={{ height, backgroundColor: '#000', borderRadius: 99, overflow: 'hidden' }}>
        <LinearGradient
          colors={[p.rank.color, p.rank.color2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            height: '100%',
            width: `${Math.max(4, p.pct * 100)}%`,
            borderRadius: 99,
          }}
        />
      </View>
    </View>
  );
}
