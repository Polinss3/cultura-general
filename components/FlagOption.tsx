import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import { feedback } from '@/lib/feedback';
import { AnswerState } from '@/types';
import { useColors } from '@/constants/colors';
import { Font } from '@/constants/theme';

interface Props {
  /** Emoji de la bandera. */
  flag: string;
  state: AnswerState;
  onPress: () => void;
  /** Apaga las que no son ni la elegida ni la correcta, tras responder. */
  dimmed?: boolean;
  disabled?: boolean;
}

/**
 * Celda de bandera para la rejilla 2×2 (pregunta "nombre → bandera"). El emoji
 * va grande y sin texto, que es justo lo que hace que la rejilla funcione: las
 * banderas ocupan poco y se comparan de un vistazo.
 */
export function FlagOption({ flag, state, onPress, dimmed, disabled = false }: Props) {
  const C = useColors();
  const scale = useRef(new Animated.Value(1)).current;
  const pressLocked = useRef(false);

  useEffect(() => {
    if (!disabled && state === null) pressLocked.current = false;
  }, [disabled, state]);

  useEffect(() => {
    if (state === 'correct') {
      feedback.correct();
      scale.setValue(0.9);
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.04, duration: 240, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 160, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]).start();
    } else if (state === 'wrong') {
      feedback.wrong();
      Animated.sequence([
        Animated.timing(scale, { toValue: 0.97, duration: 60, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1.01, duration: 60, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 5, tension: 120, useNativeDriver: true }),
      ]).start();
    }
  }, [state, scale]);

  const revealed = state === 'correct' || state === 'wrong';

  const borderColor =
    state === 'correct' ? C.correct :
    state === 'wrong'   ? C.wrong : C.borderStrong;

  const bg =
    state === 'correct' ? C.correctTint :
    state === 'wrong'   ? C.wrongTint : C.surface;

  return (
    <Animated.View style={{ width: '48.5%', transform: [{ scale }], opacity: dimmed ? 0.55 : 1 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => {
          if (pressLocked.current) return;
          pressLocked.current = true;
          feedback.tap();
          onPress();
        }}
        style={{
          // El grosor no cambia al revelar: 0,5 pt por lado bastan para que la
          // bandera se desplace un pelo. Lo que distingue el estado es el color.
          borderWidth: 2,
          borderColor,
          backgroundColor: bg,
          borderRadius: 18,
          paddingVertical: 14,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 104,
          gap: 4,
        }}
      >
        <Text style={{ fontSize: 54 }}>{flag}</Text>
        {/* La marca se pinta siempre y solo se hace visible al revelar: si se
            montara al responder, la tarjeta crecería y recolocaría la rejilla
            entera justo cuando el usuario está mirando el resultado. */}
        <Text
          style={{
            color: state === 'correct' ? C.correctText : C.wrongText,
            fontSize: 16,
            fontFamily: Font.black,
            opacity: revealed ? 1 : 0,
          }}
        >
          {state === 'wrong' ? '✗' : '✓'}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
