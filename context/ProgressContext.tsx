import { createContext, useContext, useRef, useState, useCallback, ReactNode } from 'react';
import { Animated, Text, View, StyleSheet } from 'react-native';
import { AwardResult } from '@/lib/gamification';
import { LevelUpModal } from '@/components/LevelUpModal';
import { logLevelAchieved } from '@/lib/appsflyer';

interface ProgressContextValue {
  // Muestra el feedback "+XP / +🪙" y, si subió de nivel, la celebración.
  celebrate: (award: AwardResult | null | undefined) => void;
}

const ProgressContext = createContext<ProgressContextValue>({ celebrate: () => {} });

export function useProgress() {
  return useContext(ProgressContext);
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [banner, setBanner] = useState<{ xp: number; coins: number } | null>(null);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const anim = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showBanner = useCallback((xp: number, coins: number) => {
    if (timer.current) clearTimeout(timer.current);
    setBanner({ xp, coins });
    anim.setValue(0);
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 7 }).start();
    timer.current = setTimeout(() => {
      Animated.timing(anim, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => setBanner(null));
    }, 2200);
  }, [anim]);

  const celebrate = useCallback((award: AwardResult | null | undefined) => {
    if (!award) return;
    if (award.gainedXp > 0 || award.gainedCoins > 0) {
      showBanner(award.gainedXp, award.gainedCoins);
    }
    if (award.leveledUp) {
      logLevelAchieved(award.level);
      // Damos un instante para que el banner no choque con el modal.
      setTimeout(() => setLevelUp(award.level), 400);
    }
  }, [showBanner]);

  return (
    <ProgressContext.Provider value={{ celebrate }}>
      {children}

      {banner && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.banner,
            {
              opacity: anim,
              transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-24, 0] }) }],
            },
          ]}
        >
          {banner.xp > 0 && (
            <View style={styles.chip}>
              <Text style={styles.chipText}>+{banner.xp} XP</Text>
            </View>
          )}
          {banner.coins > 0 && (
            <View style={[styles.chip, styles.coinChip]}>
              <Text style={styles.coinText}>+{banner.coins} 🪙</Text>
            </View>
          )}
        </Animated.View>
      )}

      <LevelUpModal visible={levelUp !== null} level={levelUp ?? 1} onClose={() => setLevelUp(null)} />
    </ProgressContext.Provider>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 64,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    zIndex: 9998,
  },
  chip: {
    backgroundColor: 'rgba(48,168,232,0.95)',
    borderRadius: 99,
    paddingVertical: 6,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  coinChip: {
    backgroundColor: 'rgba(232,160,48,0.95)',
  },
  chipText: {
    color: '#fff',
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
  },
  coinText: {
    color: '#1a1000',
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
  },
});
