import { useEffect, useRef } from 'react';
import { Animated, Easing, type ViewStyle } from 'react-native';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  /** Repite el pop cada vez que cambia este valor. */
  trigger?: unknown;
}

/**
 * Pop de entrada: scale 0.9 → 1.04 → 1 en ~400 ms. Se usa al revelar la
 * respuesta correcta y en la cabecera de resultado del Diario.
 */
export function Pop({ children, style, trigger }: Props) {
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    scale.setValue(0.9);
    opacity.setValue(0);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 160,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.04,
          duration: 240,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 160,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [trigger, scale, opacity]);

  return (
    <Animated.View style={[style, { opacity, transform: [{ scale }] }]}>
      {children}
    </Animated.View>
  );
}
