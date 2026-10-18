import { useCallback, useEffect } from 'react';
import { Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useCityPreview } from '@/context/CityPreviewContext';
import { ZoomableCityImage } from '@/components/zoomable-city-image';
import { useTheme } from '@/constants/colors';
import { Font } from '@/constants/theme';

export default function CityPreviewScreen() {
  const { preview, endPreview } = useCityPreview();
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

  return <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['bottom']}>
    <Stack.Screen options={{
      headerShown: true,
      headerBackVisible: false,
      headerLeft: () => null,
      headerShadowVisible: false,
      headerStyle: { backgroundColor: C.bg },
      headerTintColor: C.text,
      headerTitleStyle: { fontFamily: Font.black },
      title: t('cities.previewTitle'),
      headerRight: () => <Pressable onPress={close} accessibilityRole="button" accessibilityLabel={t('cities.closePreview')}
        style={{ minWidth: 44, minHeight: 44, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: C.brandDeep, fontSize: 15, fontFamily: Font.bold }}>{t('common.close')}</Text>
      </Pressable>,
    }} />
    <ZoomableCityImage city={preview.city} image={preview.image} />
  </SafeAreaView>;
}
