import { useMemo } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated';

interface AdventureStarsProps {
  count: number;
  size?: number;
  animated?: boolean;
  accessibilityLabel?: string;
}

const STAR_GOLD = '#FFD43B';
const STAR_GLOW = '#FFF1A3';
const STAR_DEPTH = '#B96B00';

export function AdventureStars({
  count,
  size = 19,
  animated = false,
  accessibilityLabel,
}: AdventureStarsProps) {
  const visibleCount = Math.max(0, Math.min(3, Math.floor(count)));
  if (visibleCount === 0) return null;

  return (
    <View
      accessible={Boolean(accessibilityLabel)}
      accessibilityLabel={accessibilityLabel}
      importantForAccessibility={accessibilityLabel ? 'yes' : 'no-hide-descendants'}
      pointerEvents="none"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Math.max(0, Math.round(size * 0.02)),
      }}
    >
      {Array.from({ length: visibleCount }, (_, index) => (
        <StarGlyph key={index} index={index} size={size} animated={animated} />
      ))}
    </View>
  );
}

function StarGlyph({ index, size, animated }: { index: number; size: number; animated: boolean }) {
  const entering = useMemo(
    () => FadeInDown.duration(260).delay(index * 90).reduceMotion(ReduceMotion.System),
    [index],
  );
  const rotation = index % 3 === 0 ? '-5deg' : index % 3 === 2 ? '5deg' : '0deg';
  const style = {
    color: STAR_GOLD,
    fontSize: size,
    lineHeight: size + 5,
    textShadowColor: STAR_GLOW,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: Math.max(3, size * 0.2),
    transform: [{ rotate: rotation }],
    shadowColor: STAR_DEPTH,
    shadowOpacity: 0.92,
    shadowRadius: Math.max(1, size * 0.045),
    shadowOffset: { width: 0, height: Math.max(1, size * 0.06) },
  } as const;

  return animated ? (
    <Animated.Text entering={entering} style={style}>★</Animated.Text>
  ) : (
    <Text style={style}>★</Text>
  );
}
