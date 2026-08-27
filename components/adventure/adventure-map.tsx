import { memo, useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import {
  ADVENTURE_LEVELS_PER_REGION,
  adventureLevelStatus,
  type AdventureProgress,
  type AdventureRegion,
} from '@/lib/adventure';
import { alpha, useTheme } from '@/constants/colors';
import { Font, HIT_MIN, Radius } from '@/constants/theme';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface Props {
  width: number;
  region: AdventureRegion;
  progress: AdventureProgress;
  onLevelPress: (level: number) => void;
}

const STEP_Y = 96;
const MAP_PADDING = 30;
const NODE_SIZE = 62;
const X_PATTERN = [0.16, 0.42, 0.76, 0.86, 0.58, 0.24, 0.12, 0.43, 0.8, 0.7] as const;

function pointFor(level: number, region: AdventureRegion, width: number) {
  const offset = level - region.startLevel;
  const usableWidth = Math.max(220, width - MAP_PADDING * 2 - NODE_SIZE);
  return {
    x: MAP_PADDING + NODE_SIZE / 2 + X_PATTERN[offset % X_PATTERN.length] * usableWidth,
    y: MAP_PADDING + (ADVENTURE_LEVELS_PER_REGION - 1 - offset) * STEP_Y + NODE_SIZE / 2,
  };
}

export const AdventureMap = memo(function AdventureMap({
  width,
  region,
  progress,
  onLevelPress,
}: Props) {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const reducedMotion = useReducedMotion();
  const height = MAP_PADDING * 2 + NODE_SIZE + (ADVENTURE_LEVELS_PER_REGION - 1) * STEP_Y;
  const levels = useMemo(
    () => Array.from(
      { length: region.endLevel - region.startLevel + 1 },
      (_, index) => region.startLevel + index,
    ),
    [region.startLevel, region.endLevel],
  );
  const path = levels
    .map((level, index) => {
      const point = pointFor(level, region, width);
      return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
    })
    .join(' ');

  return (
    <View
      accessibilityRole="list"
      style={{ width, height, overflow: 'hidden' }}
    >
      <Svg width={width} height={height} style={{ position: 'absolute' }} pointerEvents="none">
        {Array.from({ length: 34 }, (_, index) => (
          <Circle
            key={index}
            cx={18 + ((index * 71) % Math.max(40, width - 36))}
            cy={22 + index * 55}
            r={index % 4 === 0 ? 3 : 1.8}
            fill={index % 3 === 0 ? region.accent : C.borderStrong}
            opacity={isDark ? 0.18 : 0.24}
          />
        ))}
        <Path
          d={path}
          fill="none"
          stroke={C.surface}
          strokeWidth={18}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d={path}
          fill="none"
          stroke={alpha(region.accent, isDark ? 0.72 : 0.5)}
          strokeWidth={8}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="2 16"
        />
      </Svg>

      {levels.map(level => {
        const point = pointFor(level, region, width);
        const status = adventureLevelStatus(level, progress);
        const completed = status === 'completed';
        const current = status === 'current';
        const locked = status === 'locked';
        const size = current ? 72 : NODE_SIZE;
        const best = progress.bestScores[String(level)] ?? 0;

        return (
          <Pressable
            key={level}
            accessibilityRole="button"
            accessibilityLabel={t(`adventure.levelA11y.${status}`, { level, score: best })}
            accessibilityState={{ disabled: locked, selected: current }}
            disabled={locked}
            hitSlop={8}
            onPress={() => onLevelPress(level)}
            style={({ pressed }) => ({
              position: 'absolute',
              left: point.x - size / 2,
              top: point.y - size / 2,
              width: size,
              height: size,
              minWidth: HIT_MIN,
              minHeight: HIT_MIN,
              borderRadius: Radius.pill,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: completed ? C.correct : current ? region.accent : C.surfaceSunk,
              borderWidth: current ? 5 : 3,
              borderColor: current ? C.surface : completed ? C.correctTint : C.borderStrong,
              opacity: pressed ? 0.72 : locked ? 0.82 : 1,
              transform: [{ scale: pressed && !reducedMotion ? 0.97 : 1 }],
              shadowColor: current ? region.accent : '#2B2621',
              shadowOpacity: current ? (isDark ? 0.55 : 0.3) : completed && !isDark ? 0.15 : 0,
              shadowRadius: current ? 16 : 8,
              shadowOffset: { width: 0, height: 5 },
              elevation: current ? 7 : completed ? 2 : 0,
            })}
          >
            {locked ? (
              <>
                <Text maxFontSizeMultiplier={1.4} style={{ fontSize: 16, lineHeight: 19 }}>🔒</Text>
                <Text
                  maxFontSizeMultiplier={1.4}
                  style={{ color: C.textFaint, fontFamily: Font.black, fontSize: 12, lineHeight: 14 }}
                >
                  {level}
                </Text>
              </>
            ) : (
              <>
                <Text
                  maxFontSizeMultiplier={1.5}
                  style={{ color: C.onBrand, fontFamily: Font.black, fontSize: current ? 21 : 18 }}
                >
                  {completed ? '✓' : level}
                </Text>
                {completed && (
                  <Text
                    maxFontSizeMultiplier={1.3}
                    style={{ color: C.onBrand, fontFamily: Font.bold, fontSize: 11, lineHeight: 13 }}
                  >
                    {level}
                  </Text>
                )}
              </>
            )}
          </Pressable>
        );
      })}
    </View>
  );
});
