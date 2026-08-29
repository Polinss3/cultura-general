import { memo, useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import {
  ADVENTURE_LEVELS_PER_REGION,
  adventureLevelStatus,
  isAdventureChapterFinal,
  type AdventureProgress,
  type AdventureRegion,
} from '@/lib/adventure';
import {
  adventureDecorationsForChapter,
  adventurePathPatternForChapter,
} from '@/lib/adventure-map-design';
import { alpha, useTheme } from '@/constants/colors';
import { Font, HIT_MIN, Radius } from '@/constants/theme';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { AdventureStars } from '@/components/adventure/adventure-stars';

interface Props {
  width: number;
  region: AdventureRegion;
  progress: AdventureProgress;
  onLevelPress: (level: number) => void;
}

const STEP_Y = 96;
const MAP_PADDING = 30;
const NODE_SIZE = 62;

function pointFor(
  level: number,
  region: AdventureRegion,
  width: number,
  pattern: readonly number[],
) {
  const offset = level - region.startLevel;
  const usableWidth = Math.max(220, width - MAP_PADDING * 2 - NODE_SIZE);
  return {
    x: MAP_PADDING + NODE_SIZE / 2 + pattern[offset % pattern.length] * usableWidth,
    y: MAP_PADDING + (ADVENTURE_LEVELS_PER_REGION - 1 - offset) * STEP_Y + NODE_SIZE / 2,
  };
}

function smoothPath(points: readonly { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  const commands = [`M ${points[0].x} ${points[0].y}`];
  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[index - 1] ?? points[index];
    const current = points[index];
    const next = points[index + 1];
    const following = points[index + 2] ?? next;
    const control1 = {
      x: current.x + (next.x - previous.x) / 6,
      y: current.y + (next.y - previous.y) / 6,
    };
    const control2 = {
      x: next.x - (following.x - current.x) / 6,
      y: next.y - (following.y - current.y) / 6,
    };
    commands.push(
      `C ${control1.x} ${control1.y} ${control2.x} ${control2.y} ${next.x} ${next.y}`,
    );
  }
  return commands.join(' ');
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
  const pattern = adventurePathPatternForChapter(region.number);
  const decorations = adventureDecorationsForChapter(region.theme, region.number);
  const levels = useMemo(
    () => Array.from(
      { length: region.endLevel - region.startLevel + 1 },
      (_, index) => region.startLevel + index,
    ),
    [region.startLevel, region.endLevel],
  );
  const points = levels.map(level => pointFor(level, region, width, pattern));
  const path = smoothPath(points);

  return (
    <View
      accessibilityRole="list"
      style={{ width, height, overflow: 'hidden' }}
    >
      {decorations.map((decoration, index) => (
        <Text
          key={`${decoration.symbol}-${index}`}
          accessible={false}
          importantForAccessibility="no-hide-descendants"
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: decoration.x * width - decoration.size / 2,
            top: decoration.y * height - decoration.size / 2,
            color: region.accent,
            fontSize: decoration.size,
            lineHeight: decoration.size * 1.2,
            opacity: isDark ? 0.36 : 0.28,
            transform: [{ rotate: `${decoration.rotation}deg` }],
          }}
        >
          {decoration.symbol}
        </Text>
      ))}

      <Svg width={width} height={height} style={{ position: 'absolute' }} pointerEvents="none">
        {Array.from({ length: 34 }, (_, index) => (
          <Circle
            key={index}
            cx={18 + ((index * (61 + region.number * 7)) % Math.max(40, width - 36))}
            cy={22 + index * 55 + ((region.number * 19 + index * 11) % 31)}
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
        const point = pointFor(level, region, width, pattern);
        const status = adventureLevelStatus(level, progress);
        const completed = status === 'completed';
        const current = status === 'current';
        const locked = status === 'locked';
        const size = current ? 72 : NODE_SIZE;
        const best = progress.bestScores[String(level)] ?? 0;
        const stars = progress.stars[String(level)] ?? 0;
        const chapterFinal = isAdventureChapterFinal(level);

        return (
          <View
            key={level}
            pointerEvents="box-none"
            style={{
              position: 'absolute',
              left: point.x - size / 2,
              top: point.y - size / 2,
              width: size,
              alignItems: 'center',
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t(`adventure.levelA11y.${status}`, {
                level,
                score: best,
                stars: stars || (completed ? 1 : 0),
              })}
              accessibilityState={{ disabled: locked, selected: current }}
              disabled={locked}
              hitSlop={8}
              onPress={() => onLevelPress(level)}
              style={({ pressed }) => ({
                width: size,
                height: size,
                minWidth: HIT_MIN,
                minHeight: HIT_MIN,
                borderRadius: Radius.pill,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: completed
                  ? C.correct
                  : current
                    ? region.accent
                    : alpha(region.accent, isDark ? 0.2 : 0.13),
                borderWidth: current || chapterFinal ? 5 : 3,
                borderColor: current
                  ? C.surface
                  : chapterFinal
                    ? '#F5C84C'
                  : completed
                    ? C.correctTint
                    : alpha(region.accent, isDark ? 0.66 : 0.5),
                opacity: pressed ? 0.72 : 1,
                transform: [{ scale: pressed && !reducedMotion ? 0.97 : 1 }],
                shadowColor: current ? region.accent : '#2B2621',
                shadowOpacity: current ? (isDark ? 0.55 : 0.3) : completed && !isDark ? 0.15 : 0,
                shadowRadius: current ? 16 : 8,
                shadowOffset: { width: 0, height: 5 },
                elevation: current ? 7 : completed ? 2 : 0,
              })}
            >
              {chapterFinal && (
                <Text
                  accessible={false}
                  style={{ position: 'absolute', top: -19, fontSize: 22, zIndex: 4 }}
                >
                  👑
                </Text>
              )}
              {locked ? (
                <>
                  <Text maxFontSizeMultiplier={1.4} style={{ fontSize: 18, lineHeight: 21 }}>🔒</Text>
                  <Text
                    maxFontSizeMultiplier={1.4}
                    style={{ color: C.textBody, fontFamily: Font.black, fontSize: 14, lineHeight: 16 }}
                  >
                    {level}
                  </Text>
                </>
              ) : (
                <Text
                  maxFontSizeMultiplier={1.5}
                  style={{ color: C.onBrand, fontFamily: Font.black, fontSize: current ? 21 : 19 }}
                >
                  {level}
                </Text>
              )}
            </Pressable>
            {completed && (
              <View style={{ marginTop: -2, minWidth: 62, alignItems: 'center', zIndex: 3 }}>
                <AdventureStars count={stars || 1} size={19} />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
});
