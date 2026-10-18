import assert from 'node:assert/strict';
import test from 'node:test';
import { cityZoomBounds, cityZoomOffset, clampCityOffset } from './cityZoom';

test('pinch and double tap keep the same image detail beneath the finger', () => {
  const previousScale = 1.5;
  const nextScale = 3;
  const oldOffset = -45;
  const startFocal = 70;
  const movedFocal = 85;
  const detail = (startFocal - oldOffset) / previousScale;
  const offset = cityZoomOffset(oldOffset, startFocal, movedFocal, nextScale / previousScale);
  assert.equal(detail * nextScale + offset, movedFocal);
});

test('fitting and zooming a portrait or landscape viewport never exposes an empty edge', () => {
  for (const viewport of [{ width: 393, height: 600 }, { width: 800, height: 260 }]) {
    const ratio = 0.79;
    const side = Math.min(viewport.width - 24, (viewport.height - 24) / ratio);
    const fitted = cityZoomBounds(side, side * ratio, viewport.width, viewport.height, 1);
    assert.deepEqual(fitted, { x: 0, y: 0 });
    for (const scale of [1.5, 2.5, 4]) {
      const bounds = cityZoomBounds(side, side * ratio, viewport.width, viewport.height, scale);
      const x = clampCityOffset(10000, bounds.x);
      const y = clampCityOffset(-10000, bounds.y);
      if (bounds.x) assert(x - side * scale / 2 <= -viewport.width / 2);
      if (bounds.y) assert(y + side * ratio * scale / 2 >= viewport.height / 2);
    }
  }
});
