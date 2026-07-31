import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import { feedback } from '@/lib/feedback';
import { AnswerState } from '@/types';
import { useColors } from '@/constants/colors';
import { Font, Radius } from '@/constants/theme';

interface Props {
  text: string;
  letter: string;
  state: AnswerState;
  onPress: () => void;
  /** Apaga las opciones que no son la elegida ni la correcta, tras responder. */
  dimmed?: boolean;
}

export function OptionBtn({ text, letter, state, onPress, dimmed }: Props) {
  const C = useColors();
  const scale = useRef(new Animated.Value(1)).current;

  // Haptic feedback when answer is revealed
  useEffect(() => {
    if (state === 'correct') {
      feedback.correct();
      // Pop de entrada al revelar la correcta: 0.9 → 1.04 → 1 (~400 ms).
      scale.setValue(0.9);
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.04, duration: 240, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 160, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]).start();
    } else if (state === 'wrong') {
      feedback.wrong();
      // Sacudida sutil al fallar.
      Animated.sequence([
        Animated.timing(scale, { toValue: 0.97, duration: 60, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1.01, duration: 60, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 5, tension: 120, useNativeDriver: true }),
      ]).start();
    }
  }, [state, scale]);

  const handlePressIn = () => {
    Animated.timing(scale, { toValue: 0.97, duration: 90, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, friction: 5, tension: 120, useNativeDriver: true }).start();
  };

  const handlePress = () => {
    feedback.tap();
    onPress();
  };

  const revealed = state === 'correct' || state === 'wrong';

  const borderColor =
    state === 'correct' ? C.correct :
    state === 'wrong'   ? C.wrong :
    state === 'selected'? C.brand : C.borderStrong;

  const bg =
    state === 'correct' ? C.correctTint :
    state === 'wrong'   ? C.wrongTint :
    state === 'selected'? C.brandTint : C.surface;

  const color =
    state === 'correct' ? C.correctText :
    state === 'wrong'   ? C.wrongText : C.text;

  const badgeBg =
    state === 'correct' ? C.correct :
    state === 'wrong'   ? C.wrong :
    state === 'selected'? C.brand : C.surfaceSunk;

  const badgeColor = revealed || state === 'selected' ? C.onBrand : C.textFaint;

  return (
    <Animated.View style={{ transform: [{ scale }], opacity: dimmed ? 0.55 : 1 }}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          borderWidth: revealed ? 2 : 1.5,
          borderColor,
          backgroundColor: bg,
          borderRadius: 18,
          paddingVertical: 16,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 13,
          minHeight: 60,
        }}
      >
        <View style={{
          width: 30, height: 30, borderRadius: 10,
          backgroundColor: badgeBg,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ color: badgeColor, fontSize: 13, fontFamily: Font.black }}>
            {letter}
          </Text>
        </View>
        <Text style={{ color, fontSize: 16, fontFamily: revealed ? Font.extra : Font.semi, flex: 1 }}>
          {text}
        </Text>
        {revealed && (
          <Text style={{ fontSize: 16 }}>{state === 'correct' ? '✓' : '✗'}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}
