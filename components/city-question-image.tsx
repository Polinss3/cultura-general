import { View } from 'react-native';
import { Image, type ImageRef } from 'expo-image';
import { useTranslation } from 'react-i18next';
import type { City } from '@/lib/cityCatalog';
import { cityImageLayout } from '@/lib/cityImageLayout';

export function CityQuestionImage({ city, image, size, cropTop }: { city: City; image: ImageRef; size: number; cropTop?: number }) {
  const { t } = useTranslation();
  const f = city.framing!;
  const layout = cityImageLayout(f, size, cropTop);
  return <View style={{ width: layout.width, height: layout.height, overflow: 'hidden' }}>
    <View style={{ position: 'absolute', ...layout.image }}>
      <Image source={image} contentFit="contain" cachePolicy="memory-disk" transition={0}
        accessible accessibilityLabel={t('cities.imageDescription')} style={{ width: '100%', height: '100%' }} />
    </View>
  </View>;
}
