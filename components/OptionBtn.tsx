import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import { feedback } from '@/lib/feedback';
import { AnswerState } from '@/types';
import { useColors } from '@/constants/colors';
import { Font, Radius } from '@/constants/theme';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface Props {
  text: string;
  letter: string;
  state: AnswerState;
  onPress: () => void;
  /** Apaga las opciones que no son la elegida ni la correcta, tras responder. */
  dimmed?: boolean;
  /** Estado verbal añadido a VoiceOver, por ejemplo «respuesta correcta». */
  accessibilityStatus?: string;
  accessibilitySelected?: boolean;
  /** Permite que una pantalla coordine un único háptico por respuesta. */
  feedbackDisabled?: boolean;
}

export function OptionBtn({
  text,
  letter,
  state,
  onPress,
  dimmed,
  accessibilityStatus,
  accessibilitySelected,
  feedbackDisabled = false,
}: Props) {
  const C = useColors();
  const reducedMotion = useReducedMotion();
  const scale = useRef(new Animated.Value(1)).current;

  // Haptic feedback when answer is revealed
  useEffect(() => {
    if (state === 'correct') {
      if (!feedbackDisabled) feedback.correct();
      if (reducedMotion) {
        scale.setValue(1);
        return;
      }
      // Pop de entrada al revelar la correcta: 0.9 → 1.04 → 1 (~400 ms).
      scale.setValue(0.9);
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.04, duration: 240, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 160, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]).start();
    } else if (state === 'wrong') {
      if (!feedbackDisabled) feedback.wrong();
      if (reducedMotion) {
        scale.setValue(1);
        return;
      }
      // Sacudida sutil al fallar.
      Animated.sequence([
        Animated.timing(scale, { toValue: 0.97, duration: 60, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1.01, duration: 60, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 5, tension: 120, useNativeDriver: true }),
      ]).start();
    }
  }, [feedbackDisabled, reducedMotion, state, scale]);

  const handlePressIn = () => {
    if (reducedMotion) return;
    Animated.timing(scale, { toValue: 0.97, duration: 90, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    if (reducedMotion) return;
    Animated.spring(scale, { toValue: 1, friction: 5, tension: 120, useNativeDriver: true }).start();
  };

  const handlePress = () => {
    if (!feedbackDisabled) feedback.tap();
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
        accessibilityRole="button"
        accessibilityLabel={`${letter}. ${text}${accessibilityStatus ? `. ${accessibilityStatus}` : ''}`}
        accessibilityState={{ selected: accessibilitySelected ?? state === 'selected' }}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          // Constante: si engordara al revelar, el texto perdería 1 pt de
          // ancho y un nombre largo podría saltar a dos líneas.
          borderWidth: 2,
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
        {/* Hueco reservado: la marca aparece por opacidad, no montándose, para
            que la etiqueta no cambie de ancho ni reajuste sus líneas. */}
        <Text
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{ fontSize: 16, width: 18, textAlign: 'right', opacity: revealed ? 1 : 0 }}
        >
          {state === 'wrong' ? '✗' : '✓'}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
