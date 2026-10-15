import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import type { City } from '@/lib/cityCatalog';
import { useTheme } from '@/constants/colors';
import { Font } from '@/constants/theme';

/** Runtime framing uses the same normalized coordinates as the diorama viewer. */
export function CityQuestionImage({ city, onReady }: { city: City; onReady: () => void }) {
  const { t } = useTranslation();
  const { C } = useTheme();
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (status !== 'loading') return;
    timer.current = setTimeout(() => setStatus('error'), 15000);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [attempt, status]);
  const f = city.framing!;
  return (
    <View style={{ width: '100%', aspectRatio: 1, overflow: 'hidden', backgroundColor: f.background, borderRadius: 24 }}>
      <View style={{ position: 'absolute', left: `${f.left * 100}%`, top: `${f.top * 100}%`, width: `${f.width * 100}%`, height: `${f.height * 100}%` }}>
        <Image key={attempt} source={{ uri: city.image_url! }} contentFit="contain" cachePolicy="memory-disk"
          transition={0} recyclingKey={`${city.id}:${attempt}`} accessible accessibilityLabel={t('cities.imageDescription')}
          style={{ width: '100%', height: '100%', opacity: status === 'ready' ? 1 : 0 }}
          onLoad={() => { if (timer.current) clearTimeout(timer.current); setStatus('ready'); onReady(); }} onError={() => { if (timer.current) clearTimeout(timer.current); setStatus('error'); }} />
        {/* Fade only the empty outer 2%, as in the reference SVG renderer. */}
        <LinearGradient pointerEvents="none" colors={[f.background, `${f.background}00`, `${f.background}00`, f.background]}
          locations={[0, 0.02, 0.98, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={{ position: 'absolute', inset: 0 }} />
        <LinearGradient pointerEvents="none" colors={[f.background, `${f.background}00`, `${f.background}00`, f.background]}
          locations={[0, 0.02, 0.98, 1]} style={{ position: 'absolute', inset: 0 }} />
      </View>
      {status !== 'ready' && <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        {status === 'loading' ? <ActivityIndicator color={C.brand} accessibilityLabel={t('cities.loadingImage')} /> : <>
          <Text style={{ color: C.text, fontFamily: Font.bold }}>{t('cities.imageError')}</Text>
          <Pressable accessibilityRole="button" onPress={() => { setStatus('loading'); setAttempt(n => n + 1); }} style={{ padding: 12 }}>
            <Text style={{ color: C.brandDeep, fontFamily: Font.extra }}>{t('cities.retry')}</Text>
          </Pressable>
        </>}
      </View>}
    </View>
  );
}
