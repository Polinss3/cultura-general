import { Image, type ImageRef } from 'expo-image';
import { createCityImageQueue } from './cityImageQueue';
import type { CityQuestion } from './cityCatalog';

// ImageRef holds decoded native pixels. Rendering it does not start a URL load.
export const cityImages = createCityImageQueue<ImageRef>(url =>
  Image.loadAsync({ uri: url }, { maxWidth: 1024, maxHeight: 1024 }), 8, 3);
export function warmCityImages(round: CityQuestion[], index: number, count = 4) {
  for (const q of round.slice(index, index + count)) {
    void cityImages.ensure(q.answer.image_url!).catch(() => {});
  }
}
