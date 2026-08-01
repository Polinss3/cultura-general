import { useRef, useState, useEffect } from 'react';
import { Pressable, View, Text, Animated, Easing } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { feedback } from '@/lib/feedback';
import { Confetti } from './Confetti';
import { useTheme } from '@/constants/colors';
import { Font, Radius, warmGradient } from '@/constants/theme';

interface Props {
  available: boolean;
  // Devuelve las monedas ganadas, o null si falló.
  onClaim: () => Promise<number | null>;
  // Se llama al terminar la animación (para refrescar el saldo).
  onClaimed?: () => void;
}

export function DailyChest({ available, onClaim, onClaimed }: Props) {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const [busy, setBusy] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [reward, setReward] = useState<number | null>(null);
  const [confetti, setConfetti] = useState(false);

  const bob = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(0)).current;
  const rewardY = useRef(new Animated.Value(0)).current;
  const rewardOpacity = useRef(new Animated.Value(0)).current;

  const showClaimed = claimed || !available;

  // Balanceo suave del cofre mientras está disponible.
  useEffect(() => {
    if (showClaimed) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 850, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: 850, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [showClaimed, bob]);

  const handlePress = async () => {
    if (busy || showClaimed) return;
    setBusy(true);
    const r = await onClaim();
    setBusy(false);
    if (r == null) return;

    feedback.reward();
    setReward(r);
    setConfetti(true);

    // Rebote del cofre.
    pop.setValue(0);
    Animated.sequence([
      Animated.timing(pop, { toValue: 1, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.spring(pop, { toValue: 0, friction: 3.5, tension: 80, useNativeDriver: true }),
    ]).start();

    // Recompensa que flota hacia arriba.
    rewardY.setValue(0);
    rewardOpacity.setValue(0);
    Animated.parallel([
      Animated.timing(rewardOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(rewardY, { toValue: -70, duration: 1300, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start(() => {
      Animated.timing(rewardOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    });

    setTimeout(() => {
      setConfetti(false);
      setClaimed(true);
      onClaimed?.();
    }, 1700);
  };

  const bobY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });
  const popScale = pop.interpolate({ inputRange: [0, 1], outputRange: [1, 1.4] });
  const popRotate = pop.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-12deg'] });

  return (
    <View style={{ marginBottom: 10 }}>
      {confetti && <Confetti active />}

      {showClaimed ? (
        <View
          style={{
            borderRadius: Radius.cardLg,
            padding: 12,
            backgroundColor: C.surfaceSunk,
            borderWidth: 1,
            borderColor: C.border,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <Text style={{ fontSize: 26, opacity: 0.45 }}>🎁</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: C.textMuted, fontFamily: Font.black, fontSize: 16 }}>
              {t('components.dailyChest.title')}
            </Text>
            <Text style={{ color: C.textMuted, fontFamily: Font.regular, fontSize: 13, marginTop: 2 }}>
              {t('components.dailyChest.claimedSub')}
            </Text>
          </View>
        </View>
      ) : (
        <Pressable onPress={handlePress} disabled={busy}>
          <LinearGradient
            colors={warmGradient(isDark)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: Radius.cardLg,
              padding: 12,
              borderWidth: 1.5,
              borderColor: C.borderWarm,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              overflow: 'visible',
            }}
          >
            <Animated.Text
              style={{
                fontSize: 34,
                transform: [{ translateY: bobY }, { scale: popScale }, { rotate: popRotate }],
              }}
            >
              🎁
            </Animated.Text>

            {/* Recompensa flotante */}
            <Animated.View
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: 30,
                top: 10,
                opacity: rewardOpacity,
                transform: [{ translateY: rewardY }],
              }}
            >
              <Text style={{ color: C.brandDeep, fontFamily: Font.black, fontSize: 22 }}>
                +{reward} 🪙
              </Text>
            </Animated.View>

            <View style={{ flex: 1 }}>
              <Text style={{ color: C.text, fontFamily: Font.black, fontSize: 16 }}>
                {t('components.dailyChest.title')}
              </Text>
              <Text style={{ color: C.textMuted, fontFamily: Font.regular, fontSize: 13, marginTop: 2 }}>
                {t('components.dailyChest.availableSub')}
              </Text>
            </View>

            <View style={{ backgroundColor: C.brand, borderRadius: Radius.pill, paddingVertical: 9, paddingHorizontal: 18 }}>
              <Text style={{ color: C.onBrand, fontFamily: Font.extra, fontSize: 14 }}>
                {busy ? '…' : t('components.dailyChest.open')}
              </Text>
            </View>
          </LinearGradient>
        </Pressable>
      )}
    </View>
  );
}
