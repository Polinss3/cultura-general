import { Platform, Text, View, useWindowDimensions } from 'react-native';
import { useIsDark } from '@/constants/colors';
import { MAX_CONTENT_WIDTH } from '@/constants/layout';

export type TabletDecoratedSection =
  | 'home' | 'daily' | 'exam' | 'speed' | 'ladder' | 'adventure'
  | 'learn' | 'challenges' | 'premium' | 'shop' | 'general';

// Los márgenes del iPad son parte del escenario, mientras que la navegación y
// las tarjetas siguen limitadas a la columna de contenido.
const SECTION_ICONS: Record<TabletDecoratedSection, readonly string[]> = {
  home: ['✨', '🏆', '📚', '🧠', '⚡', '🎯', '🗺️', '🎁', '💡', '⭐', '🪙', '🌍', '📜', '🪜', '🎨', '🔥'],
  daily: ['✨', '⭐', '🧩', '🎯', '❓', '💡', '📚', '⏱️', '🏆', '🌟', '🎉', '🧠', '✦', '🎯', '⭐', '📚'],
  exam: ['✦', '🧠', '⭐', '📝', '🎓', '📚', '⏱️', '💡', '📖', '⭐', '🎓', '🧠', '✨', '📝', '⏱️', '📚'],
  speed: ['⚡', '⏱️', '🎯', '🧠', '⭐', '🏆', '🪙', '✨', '💡', '⚡', '⏱️', '🎯', '🏅', '🧩', '📚', '🌟'],
  ladder: ['🪜', '🏛️', '❤️', '🪙', '⛰️', '🛡️', '⭐', '👑', '🏆', '🧗', '☁️', '💎', '📜', '🌄', '🔭', '✨'],
  adventure: ['🏺', '🧭', '🗺️', '📜', '🏰', '🔭', '📚', '⭐', '🌍', '🗝️', '🏛️', '🧪', '💎', '🧭', '📖', '✨'],
  learn: ['📚', '🌍', '🧠', '🎨', '🧬', '🎬', '🎵', '📜', '💡', '⚽', '🔬', '🗺️', '📖', '🎭', '🏛️', '✨'],
  challenges: ['🎯', '🏆', '⏱️', '🌍', '🗓️', '🧩', '⚡', '⭐', '🏰', '🧠', '🏅', '🗺️', '🎲', '💡', '⏳', '✨'],
  premium: ['💎', '✨', '🪙', '🛡️', '👑', '🎨', '📊', '⭐', '🔁', '🏆', '📝', '💜', '🎁', '🌟', '🧠', '💎'],
  shop: ['🪙', '⚡', '🎨', '💎', '🛡️', '🎁', '👑', '✨', '🧩', '⏱️', '🏆', '🛒', '🌟', '💡', '🎯', '🪙'],
  general: ['✨', '📚', '🧠', '🌍', '⭐', '🎯', '🏆', '💡', '🎨', '🗺️', '🧩', '📜', '🎵', '🔭', '💎', '🌟'],
};

const SPOTS = [
  { side: 'left', x: 0.24, y: 0.14, size: 34, rotate: -15 },
  { side: 'left', x: 0.72, y: 0.24, size: 29, rotate: 11 },
  { side: 'left', x: 0.31, y: 0.34, size: 37, rotate: -9 },
  { side: 'left', x: 0.77, y: 0.45, size: 32, rotate: 14 },
  { side: 'left', x: 0.18, y: 0.56, size: 31, rotate: -12 },
  { side: 'left', x: 0.68, y: 0.67, size: 36, rotate: 13 },
  { side: 'left', x: 0.28, y: 0.77, size: 30, rotate: -8 },
  { side: 'left', x: 0.76, y: 0.87, size: 33, rotate: 16 },
  { side: 'right', x: 0.71, y: 0.17, size: 35, rotate: 12 },
  { side: 'right', x: 0.24, y: 0.28, size: 30, rotate: -13 },
  { side: 'right', x: 0.76, y: 0.38, size: 34, rotate: 9 },
  { side: 'right', x: 0.3, y: 0.49, size: 37, rotate: -16 },
  { side: 'right', x: 0.77, y: 0.6, size: 29, rotate: 15 },
  { side: 'right', x: 0.22, y: 0.7, size: 32, rotate: -9 },
  { side: 'right', x: 0.7, y: 0.81, size: 36, rotate: 12 },
  { side: 'right', x: 0.29, y: 0.9, size: 31, rotate: -14 },
] as const;

export function TabletGutterDecorations({ section }: { section: TabletDecoratedSection | null }) {
  const { width, height } = useWindowDimensions();
  const isDark = useIsDark();

  if (Platform.OS !== 'ios' || !Platform.isPad || !section) return null;

  const gutterWidth = Math.max(0, (width - MAX_CONTENT_WIDTH) / 2);
  if (gutterWidth < 30) return null;

  const scale = Math.min(1.25, Math.max(0.7, gutterWidth / 150));
  const icons = SECTION_ICONS[section];

  return (
    <View pointerEvents="none" accessible={false} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
      {(['left', 'right'] as const).map(side => (
        <View key={side} style={{ position: 'absolute', top: 0, bottom: 0, [side]: 0, width: gutterWidth, overflow: 'hidden' }}>
          {SPOTS.map((spot, index) => {
            if (spot.side !== side) return null;
            const size = Math.round(spot.size * scale);
            return (
              <Text
                key={index}
                accessible={false}
                importantForAccessibility="no-hide-descendants"
                style={{
                  position: 'absolute',
                  left: Math.round(gutterWidth * spot.x - size / 2),
                  top: Math.round(height * spot.y - size / 2),
                  fontSize: size,
                  opacity: isDark ? 0.22 : 0.34,
                  transform: [{ rotate: `${spot.rotate}deg` }],
                }}
              >
                {icons[index]}
              </Text>
            );
          })}
        </View>
      ))}
    </View>
  );
}
