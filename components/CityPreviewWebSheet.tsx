import { Pressable, View, useWindowDimensions, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { ReduceMotion, runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

/** Web counterpart of the native stack's form sheet. */
export function CityPreviewWebSheet({ children, onClose, style }: { children: ReactNode; onClose: () => void; style: ViewStyle }) {
  const { height } = useWindowDimensions();
  const { t } = useTranslation();
  const offset = useSharedValue(0);
  const animated = useAnimatedStyle(() => ({ transform: [{ translateY: offset.value }] }));
  const drag = Gesture.Pan().activeOffsetY(10).failOffsetX([-20, 20])
    .onUpdate(e => { offset.value = Math.max(0, e.translationY); })
    .onEnd(e => {
      if (e.translationY > 80 || e.velocityY > 700) runOnJS(onClose)();
      else offset.value = withSpring(0, { duration: 300, dampingRatio: 0.8, velocity: e.velocityY, reduceMotion: ReduceMotion.System });
    });
  return <View style={{ flex: 1, justifyContent: 'flex-end' }}>
    <Pressable accessibilityRole="button" accessibilityLabel={t('cities.closePreview')} onPress={onClose}
      style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)' }} />
    <GestureDetector gesture={drag}>
      <Animated.View accessibilityViewIsModal style={[{ width: '100%', maxWidth: 760, alignSelf: 'center', maxHeight: height * 0.9, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' }, style, animated]}>
        {children}
      </Animated.View>
    </GestureDetector>
  </View>;
}
