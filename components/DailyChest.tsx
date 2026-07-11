import { useRef, useState, useEffect } from 'react';
import { Pressable, View, Text, Animated, Easing } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { feedback } from '@/lib/feedback';
import { Confetti } from './Confetti';

interface Props {
  available: boolean;
  // Devuelve las monedas ganadas, o null si falló.
  onClaim: () => Promise<number | null>;
  // Se llama al terminar la animación (para refrescar el saldo).
  onClaimed?: () => void;
}

export function DailyChest({ available, onClaim, onClaimed }: Props) {
  const { t } = useTranslation();
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
    <View style={{ marginBottom: 14 }}>
      {confetti && <Confetti active />}

      {showClaimed ? (
        <View
          style={{
            borderRadius: 18,
            padding: 16,
            backgroundColor: '#121212',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.05)',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Text style={{ fontSize: 30, opacity: 0.4 }}>🎁</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Outfit_700Bold', fontSize: 15 }}>
              {t('components.dailyChest.title')}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Outfit_400Regular', fontSize: 12, marginTop: 1 }}>
              {t('components.dailyChest.claimedSub')}
            </Text>
          </View>
        </View>
      ) : (
        <Pressable onPress={handlePress} disabled={busy}>
          <LinearGradient
            colors={['#4a3208', '#2a1c04']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 18,
              padding: 16,
              borderWidth: 1.5,
              borderColor: 'rgba(232,160,48,0.55)',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              shadowColor: '#e8a030',
              shadowOpacity: 0.35,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
              elevation: 6,
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
              <Text style={{ color: '#ffd700', fontFamily: 'Outfit_800ExtraBold', fontSize: 22 }}>
                +{reward} 🪙
              </Text>
            </Animated.View>

            <View style={{ flex: 1 }}>
              <Text style={{ color: '#fff', fontFamily: 'Outfit_800ExtraBold', fontSize: 16 }}>
                {t('components.dailyChest.title')}
              </Text>
              <Text style={{ color: 'rgba(255,236,200,0.65)', fontFamily: 'Outfit_500Medium', fontSize: 12, marginTop: 1 }}>
                {t('components.dailyChest.availableSub')}
              </Text>
            </View>

            <LinearGradient
              colors={['#ffd700', '#e8a030']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: 99, paddingVertical: 9, paddingHorizontal: 18 }}
            >
              <Text style={{ color: '#3a2600', fontFamily: 'Outfit_800ExtraBold', fontSize: 14 }}>
                {busy ? '…' : t('components.dailyChest.open')}
              </Text>
            </LinearGradient>
          </LinearGradient>
        </Pressable>
      )}
    </View>
  );
}
