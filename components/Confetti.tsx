import { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

const { width: W, height: H } = Dimensions.get('window');

// Colores de las partículas: los acentos de la marca, válidos en claro y
// oscuro (van sobre el contenido, no sobre el fondo).
const COLORS = ['#F0A93B', '#E07A3E', '#3F9E6C', '#7B57BE', '#3E77B4'];
const COUNT = 60;

interface Particle {
  x: Animated.Value;
  y: Animated.Value;
  rot: Animated.Value;
  scale: Animated.Value;
  color: string;
  size: number;
  startX: number;
}

function makeParticle(): Particle {
  return {
    x: new Animated.Value(0),
    y: new Animated.Value(0),
    rot: new Animated.Value(0),
    scale: new Animated.Value(1),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 6 + Math.random() * 6,
    startX: Math.random() * W,
  };
}

interface ConfettiProps {
  active: boolean;
}

export function Confetti({ active }: ConfettiProps) {
  const reducedMotion = useReducedMotion();
  const particles = useRef<Particle[]>(
    Array.from({ length: COUNT }, makeParticle),
  ).current;

  useEffect(() => {
    if (!active || reducedMotion) return;

    const anims = particles.map(p => {
      p.x.setValue(0);
      p.y.setValue(0);
      p.rot.setValue(0);
      p.scale.setValue(1);

      const delay = Math.random() * 600;
      const duration = 1800 + Math.random() * 1200;
      const targetX = (Math.random() - 0.5) * 200;

      return Animated.parallel([
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(p.x, { toValue: targetX, duration, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(p.y, { toValue: H * 0.85, duration, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(p.rot, { toValue: (Math.random() > 0.5 ? 1 : -1) * 720, duration, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.delay(delay + duration * 0.6),
          Animated.timing(p.scale, { toValue: 0, duration: duration * 0.4, useNativeDriver: true }),
        ]),
      ]);
    });

    Animated.parallel(anims).start();
  }, [active, particles, reducedMotion]);

  if (!active || reducedMotion) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p, i) => {
        const rotate = p.rot.interpolate({
          inputRange: [0, 720],
          outputRange: ['0deg', '720deg'],
        });
        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              left: p.startX,
              top: H * 0.1,
              width: p.size,
              height: p.size,
              borderRadius: p.size / 4,
              backgroundColor: p.color,
              transform: [
                { translateX: p.x },
                { translateY: p.y },
                { rotate },
                { scale: p.scale },
              ],
            }}
          />
        );
      })}
    </View>
  );
}
