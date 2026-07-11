import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import { feedback } from '@/lib/feedback';
import { AnswerState } from '@/types';

interface Props {
  text: string;
  letter: string;
  state: AnswerState;
  onPress: () => void;
}

export function OptionBtn({ text, letter, state, onPress }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  // Haptic feedback when answer is revealed
  useEffect(() => {
    if (state === 'correct') {
      feedback.correct();
      // Pop de celebración al revelar la correcta.
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.04, duration: 140, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 4, tension: 90, useNativeDriver: true }),
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

  const borderColor =
    state === 'correct' ? '#2ec87a' :
    state === 'wrong'   ? '#e83060' :
    state === 'selected'? '#fff'    : 'rgba(255,255,255,0.12)';

  const bg =
    state === 'correct' ? 'rgba(46,200,122,0.1)'  :
    state === 'wrong'   ? 'rgba(232,48,96,0.1)'   :
    state === 'selected'? 'rgba(255,255,255,0.08)' : 'transparent';

  const color =
    state === 'correct' ? '#2ec87a' :
    state === 'wrong'   ? '#e83060' : '#fff';

  const badgeBg =
    state === 'correct' ? 'rgba(46,200,122,0.2)'  :
    state === 'wrong'   ? 'rgba(232,48,96,0.2)'   :
    state === 'selected'? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)';

  const badgeColor =
    state === 'correct' ? '#2ec87a' :
    state === 'wrong'   ? '#e83060' : 'rgba(255,255,255,0.6)';

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          borderWidth: 1.5,
          borderColor,
          backgroundColor: bg,
          borderRadius: 14,
          paddingVertical: 14,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <View style={{
          width: 26, height: 26, borderRadius: 8,
          backgroundColor: badgeBg,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ color: badgeColor, fontSize: 12, fontFamily: 'Outfit_700Bold' }}>
            {letter}
          </Text>
        </View>
        <Text style={{ color, fontSize: 15, fontFamily: 'Outfit_500Medium', flex: 1 }}>
          {text}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
