export const CITY_MAX_ZOOM = 4;
export const CITY_DETAIL_ZOOM = 2.5;

export function cityZoomBounds(imageWidth: number, imageHeight: number, viewportWidth: number, viewportHeight: number, scale: number) {
  'worklet';
  return {
    x: Math.max(0, (imageWidth * scale - viewportWidth) / 2),
    y: Math.max(0, (imageHeight * scale - viewportHeight) / 2),
  };
}

export function clampCityOffset(value: number, limit: number) {
  'worklet';
  return Math.max(-limit, Math.min(limit, value));
}

/** Preserve the image point under the finger while scale or focal position changes. */
export function cityZoomOffset(offset: number, startFocal: number, focal: number, ratio: number) {
  'worklet';
  return focal - (startFocal - offset) * ratio;
}

export function resistCityOffset(value: number, limit: number, dimension: number) {
  'worklet';
  if (Math.abs(value) <= limit) return value;
  const overshoot = Math.abs(value) - limit;
  return Math.sign(value) * (limit + (overshoot * dimension * 0.55) / (dimension + 0.55 * overshoot));
}
