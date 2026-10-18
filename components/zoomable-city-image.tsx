import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { cancelAnimation, ReduceMotion, useAnimatedStyle, useSharedValue, withDecay, withSpring } from 'react-native-reanimated';
import type { ImageRef } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { CityQuestionImage } from './city-question-image';
import type { City } from '@/lib/cityCatalog';
import { cityImageLayout } from '@/lib/cityImageLayout';
import { CITY_DETAIL_ZOOM, CITY_MAX_ZOOM, cityZoomBounds, cityZoomOffset, clampCityOffset, resistCityOffset } from '@/lib/cityZoom';
import { useTheme } from '@/constants/colors';
import { Font, Radius, Space } from '@/constants/theme';

const settle = { duration: 400, dampingRatio: 1, reduceMotion: ReduceMotion.System };

export function ZoomableCityImage({ city, image }: { city: City; image: ImageRef }) {
  const { t } = useTranslation();
  const { C } = useTheme();
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const ratio = cityImageLayout(city.framing!, 1).height;
  const side = Math.max(1, Math.min(viewport.width - 24, (viewport.height - 24) / ratio, 1024));
  const imageHeight = side * ratio;
  const scale = useSharedValue(1);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const originScale = useSharedValue(1);
  const originX = useSharedValue(0);
  const originY = useSharedValue(0);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const panX = useSharedValue(0);
  const panY = useSharedValue(0);

  const reset = useCallback(() => {
    scale.set(withSpring(1, settle));
    x.set(withSpring(0, settle));
    y.set(withSpring(0, settle));
  }, [scale, x, y]);

  // Rotation and a different image both start with the whole city visible.
  useEffect(() => {
    scale.set(1); x.set(0); y.set(0);
  }, [city.id, viewport.width, viewport.height, scale, x, y]);

  const zoom = useCallback((factor: number) => {
    const previous = scale.get();
    const next = Math.max(1, Math.min(CITY_MAX_ZOOM, previous * factor));
    const bounds = cityZoomBounds(side, imageHeight, viewport.width, viewport.height, next);
    x.set(withSpring(clampCityOffset(x.get() * next / previous, bounds.x), settle));
    y.set(withSpring(clampCityOffset(y.get() * next / previous, bounds.y), settle));
    scale.set(withSpring(next, settle));
  }, [imageHeight, scale, side, viewport, x, y]);

  const gestures = useMemo(() => {
    const pinch = Gesture.Pinch()
      .onStart(e => {
        cancelAnimation(scale); cancelAnimation(x); cancelAnimation(y);
        originScale.set(scale.get()); originX.set(x.get()); originY.set(y.get());
        focalX.set(e.focalX - viewport.width / 2);
        focalY.set(e.focalY - viewport.height / 2);
      })
      .onUpdate(e => {
        const next = Math.max(1, Math.min(CITY_MAX_ZOOM, originScale.get() * e.scale));
        const bounds = cityZoomBounds(side, imageHeight, viewport.width, viewport.height, next);
        const ratio = next / originScale.get();
        x.set(clampCityOffset(cityZoomOffset(originX.get(), focalX.get(), e.focalX - viewport.width / 2, ratio), bounds.x));
        y.set(clampCityOffset(cityZoomOffset(originY.get(), focalY.get(), e.focalY - viewport.height / 2, ratio), bounds.y));
        scale.set(next);
      });
    const pan = Gesture.Pan().maxPointers(1).minDistance(8)
      .onStart(() => {
        cancelAnimation(x); cancelAnimation(y);
        panX.set(x.get()); panY.set(y.get());
      })
      .onUpdate(e => {
        if (scale.get() <= 1) return;
        const bounds = cityZoomBounds(side, imageHeight, viewport.width, viewport.height, scale.get());
        x.set(bounds.x ? resistCityOffset(panX.get() + e.translationX, bounds.x, viewport.width) : 0);
        y.set(bounds.y ? resistCityOffset(panY.get() + e.translationY, bounds.y, viewport.height) : 0);
      })
      .onEnd(e => {
        const bounds = cityZoomBounds(side, imageHeight, viewport.width, viewport.height, scale.get());
        x.set(bounds.x ? withDecay({ velocity: e.velocityX, clamp: [-bounds.x, bounds.x], rubberBandEffect: true, reduceMotion: ReduceMotion.System }) : withSpring(0, settle));
        y.set(bounds.y ? withDecay({ velocity: e.velocityY, clamp: [-bounds.y, bounds.y], rubberBandEffect: true, reduceMotion: ReduceMotion.System }) : withSpring(0, settle));
      });
    const doubleTap = Gesture.Tap().numberOfTaps(2).maxDistance(12)
      .onEnd((e, success) => {
        if (!success) return;
        const next = scale.get() > 1.1 ? 1 : CITY_DETAIL_ZOOM;
        const bounds = cityZoomBounds(side, imageHeight, viewport.width, viewport.height, next);
        const ratio = next / scale.get();
        const px = e.x - viewport.width / 2;
        const py = e.y - viewport.height / 2;
        x.set(withSpring(clampCityOffset(cityZoomOffset(x.get(), px, px, ratio), bounds.x), settle));
        y.set(withSpring(clampCityOffset(cityZoomOffset(y.get(), py, py, ratio), bounds.y), settle));
        scale.set(withSpring(next, settle));
      });
    return Gesture.Simultaneous(pinch, pan, doubleTap);
  }, [focalX, focalY, imageHeight, originScale, originX, originY, panX, panY, scale, side, viewport, x, y]);

  const transformed = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() }, { translateY: y.get() }, { scale: scale.get() }] }));
  const control = (label: string, glyph: string, onPress: () => void) => (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}
      style={({ pressed }) => ({ minWidth: 48, minHeight: 48, paddingHorizontal: 16, borderRadius: Radius.pill, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.65 : 1 })}>
      <Text style={{ color: C.text, fontFamily: Font.extra, fontSize: glyph === '−' || glyph === '+' ? 24 : 14 }}>{glyph}</Text>
    </Pressable>
  );

  return <View style={{ flex: 1, backgroundColor: C.bg }}>
    <GestureDetector gesture={gestures} touchAction="none">
      <View onLayout={e => setViewport({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
        style={{ flex: 1, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
        {viewport.width > 0 && <Animated.View pointerEvents="none" style={transformed}>
          <CityQuestionImage city={city} image={image} size={side} />
        </Animated.View>}
      </View>
    </GestureDetector>
    <View style={{ padding: Space.screen, gap: 10, alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {control(t('cities.zoomOut'), '−', () => zoom(1 / 1.5))}
        {control(t('cities.resetZoom'), t('cities.resetZoom'), reset)}
        {control(t('cities.zoomIn'), '+', () => zoom(1.5))}
      </View>
      <Text style={{ color: C.textMuted, fontFamily: Font.regular, fontSize: 13, lineHeight: 18, textAlign: 'center' }}>{t('cities.zoomHint')}</Text>
    </View>
  </View>;
}
