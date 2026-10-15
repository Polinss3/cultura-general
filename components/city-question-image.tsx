import { View } from 'react-native';
import { Image, type ImageRef } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import type { City } from '@/lib/cityCatalog';
import { cityImageLayout } from '@/lib/cityImageLayout';

export function CityQuestionImage({ city, image, size, cropTop }: { city: City; image: ImageRef; size: number; cropTop?: number }) {
  const { t } = useTranslation();
  const f = city.framing!;
  const layout = cityImageLayout(f, size, cropTop);
  return <View style={{ width: layout.width, height: layout.height, overflow: 'hidden', backgroundColor: f.background, borderRadius: 24 }}>
    <View style={{ position: 'absolute', ...layout.image }}>
      <Image source={image} contentFit="contain" cachePolicy="memory-disk" transition={0}
        accessible accessibilityLabel={t('cities.imageDescription')} style={{ width: '100%', height: '100%' }} />
      <LinearGradient pointerEvents="none" colors={[f.background, `${f.background}00`, `${f.background}00`, f.background]}
        locations={[0, 0.02, 0.98, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ position: 'absolute', inset: 0 }} />
      <LinearGradient pointerEvents="none" colors={[f.background, `${f.background}00`, `${f.background}00`, f.background]}
        locations={[0, 0.02, 0.98, 1]} style={{ position: 'absolute', inset: 0 }} />
    </View>
  </View>;
}
