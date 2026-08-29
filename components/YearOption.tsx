import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, Text } from 'react-native';
import { feedback } from '@/lib/feedback';
import { AnswerState } from '@/types';
import { useColors } from '@/constants/colors';
import { Font } from '@/constants/theme';

interface Props {
  /** Año ya formateado ("1989", "44 a.C."). */
  year: string;
  state: AnswerState;
  onPress: () => void;
  /** Apaga los que no son ni el elegido ni el correcto, tras responder. */
  dimmed?: boolean;
  disabled?: boolean;
}

/**
 * Celda de año para la rejilla 2×2 (pregunta "evento → año"). Gemela de
 * FlagOption: una cifra sola se compara de un vistazo, igual que una bandera,
 * y por eso puede ir en rejilla en vez de en columna.
 */
export function YearOption({ year, state, onPress, dimmed, disabled = false }: Props) {
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

  const color =
    state === 'correct' ? C.correctText :
    state === 'wrong'   ? C.wrongText : C.text;

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
          borderWidth: 2,
          borderColor,
          backgroundColor: bg,
          borderRadius: 18,
          paddingVertical: 14,
          paddingHorizontal: 8,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 104,
          gap: 4,
        }}
      >
        {/* Los años a.C. son cinco o seis caracteres; sin el ajuste, "120 a.C."
            se sale de la celda en pantallas estrechas. */}
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          style={{ color, fontSize: 34, fontFamily: Font.black, letterSpacing: -0.5 }}
        >
          {year}
        </Text>
        {/* Igual que en FlagOption: la marca se pinta siempre y solo cambia de
            opacidad, para que la rejilla no se recoloque al responder. */}
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
