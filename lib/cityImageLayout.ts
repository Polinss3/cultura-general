import type { CityFraming } from './cityCatalog';
/** Remove empty canvas, keeping exactly the original virtual-square scale. */
export function cityImageLayout(f: CityFraming, side: number, sharedCropTop?: number) {
  const cropTop = Math.min(sharedCropTop ?? 0.18, Math.max(0, f.top - 0.01));
  const bottom = 0.97;
  return {
    width: side, height: side * (bottom - cropTop),
    image: { left: f.left * side, top: (f.top - cropTop) * side, width: f.width * side, height: f.height * side },
  };
}
