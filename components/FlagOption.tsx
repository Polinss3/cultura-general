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
}

/**
 * Celda de bandera para la rejilla 2×2 (pregunta "nombre → bandera"). El emoji
 * va grande y sin texto, que es justo lo que hace que la rejilla funcione: las
 * banderas ocupan poco y se comparan de un vistazo.
 */
export function FlagOption({ flag, state, onPress, dimmed }: Props) {
  const C = useColors();
  const scale = useRef(new Animated.Value(1)).current;

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
        onPress={() => { feedback.tap(); onPress(); }}
        style={{
          borderWidth: revealed ? 2 : 1.5,
          borderColor,
          backgroundColor: bg,
          borderRadius: 18,
          paddingVertical: 18,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 104,
          gap: 4,
        }}
      >
        <Text style={{ fontSize: 54 }}>{flag}</Text>
        {revealed && (
          <Text style={{
            color: state === 'correct' ? C.correctText : C.wrongText,
            fontSize: 16, fontFamily: Font.black,
          }}>
            {state === 'correct' ? '✓' : '✗'}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}
