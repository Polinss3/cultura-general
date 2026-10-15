import { useCallback, useEffect, useState } from 'react';
import { Platform, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useCityPreview } from '@/context/CityPreviewContext';
import { CityQuestionImage } from '@/components/city-question-image';
import { CityPreviewWebSheet } from '@/components/CityPreviewWebSheet';
import { useTheme } from '@/constants/colors';
import { cityImageLayout } from '@/lib/cityImageLayout';

export default function CityPreviewScreen() {
  const { preview, endPreview } = useCityPreview();
  const { width, height } = useWindowDimensions();
  const [sheetWidth, setSheetWidth] = useState(Math.min(width, 540));
  const { C } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const close = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/challenges');
  }, [router]);
  useEffect(() => () => endPreview(), [endPreview]);
  useEffect(() => { if (!preview) close(); }, [preview, close]);
  if (!preview) return null;
  // SDK 54 form sheets need explicit content height. The same decoded pixels
  // are displayed at a larger scale without revealing the city's name.
  const ratio = cityImageLayout(preview.city.framing!, 1).height;
  const side = Math.max(100, Math.min(sheetWidth - 24, 700, (height * 0.82 - 106) / ratio));
  const content = <View onLayout={e => setSheetWidth(e.nativeEvent.layout.width)} style={{ backgroundColor: C.bg, paddingTop: Platform.OS === 'web' ? 12 : 26, paddingBottom: 28, alignItems: 'center' }}>
    {Platform.OS === 'web' && <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: C.textFaint, marginBottom: 8 }} />}
    <View style={{ width: '100%', alignItems: 'flex-end', paddingHorizontal: 12, marginBottom: 8 }}>
      <Pressable onPress={close} accessibilityRole="button" accessibilityLabel={t('common.close')}
        hitSlop={4} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 26, color: C.textMuted }}>×</Text>
      </Pressable>
    </View>
    <CityQuestionImage city={preview.city} image={preview.image} size={side} />
  </View>;
  return Platform.OS === 'web'
    ? <CityPreviewWebSheet onClose={close} style={{ backgroundColor: C.bg }}>{content}</CityPreviewWebSheet>
    : content;
}
