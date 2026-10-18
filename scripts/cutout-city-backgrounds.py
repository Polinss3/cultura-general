#!/usr/bin/env python3
"""Remove only the exterior backdrop from the existing 250 city paintings.

Requires Pillow, numpy, opencv-python-headless. No generated/redrawn pixels.
Same source canvas/registration; originals are never overwritten. --apply updates
catalog + framing after ALL outputs pass validation. --cities=a,b previews a subset.
Reproducible: full-resolution Canny edges, 3 px gap closing and filled contour.
"""
import argparse
from concurrent.futures import ProcessPoolExecutor
import hashlib
import json
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / 'docs/ciudades'


def extract(item):
    city_id, profile = item
    cv2.setNumThreads(1)
    cv2.setRNGSeed(0)
    source_file = profile.get('opaqueSource', profile['file'])
    source = np.array(Image.open(ART / source_file).convert('RGB'))
    height, width = source.shape[:2]
    assert (width, height) == (profile['sourceWidth'], profile['sourceHeight'])
    # The painted outer rim is a closed, sharp boundary, including where the
    # pale top of the plinth has almost the same color as the backdrop.
    gray = cv2.cvtColor(source, cv2.COLOR_RGB2GRAY)
    edges = cv2.Canny(gray, 25, 60)
    edges = cv2.morphologyEx(edges, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    contour = max(contours, key=cv2.contourArea)
    mask = np.zeros(gray.shape, dtype='uint8')
    cv2.drawContours(mask, [contour], -1, 1, cv2.FILLED)
    # The plinth is solid. A split edge can trace both rims without filling the
    # painted wall between them; bridge that region along each source column.
    lower = mask[650:]
    mask[650:] = np.minimum(np.maximum.accumulate(lower, axis=0),
                            np.maximum.accumulate(lower[::-1], axis=0)[::-1])
    # Subpixel edge coverage only; all fully opaque RGB pixels remain identical.
    alpha = np.round(cv2.GaussianBlur(mask.astype(float), (3, 3), .6) * 255).astype('uint8')
    rgba = np.dstack([source, alpha])
    foreground = alpha > 127
    ys, xs = np.nonzero(foreground)
    coverage = float(foreground.mean())
    assert .15 < coverage < .65, (city_id, coverage)
    assert xs.max() - xs.min() > .9 * (profile['baseRight'] - profile['baseLeft']), (city_id, 'Incomplete plinth')
    assert alpha[:20].max() == alpha[-20:].max() == 0, city_id
    assert alpha[:, :5].max() == alpha[:, -5:].max() == 0, city_id
    output = f'transparentes/{city_id}-v1.png'
    target = ART / output
    target.parent.mkdir(parents=True, exist_ok=True)
    result = Image.fromarray(rgba)
    if target.exists():
        assert np.array_equal(np.array(Image.open(target)), rgba), f'Refusing to overwrite {target}'
    else:
        result.save(target, compress_level=4)
    return {'id': city_id, 'source': source_file, 'file': output,
            'sourceSha256': hashlib.sha256((ART / source_file).read_bytes()).hexdigest(),
            'coverage': round(coverage, 5), 'bounds': [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())]}


def contact_sheets(results):
    font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 14)
    folder = ART / 'verificacion/transparencia'
    folder.mkdir(parents=True, exist_ok=True)
    for page, start in enumerate(range(0, len(results), 25), 1):
        # Each city is shown against BOTH a light and a dark background.
        sheet = Image.new('RGB', (1800, 1600), '#ece9e1')
        draw = ImageDraw.Draw(sheet)
        for i, entry in enumerate(results[start:start + 25]):
            source = Image.open(ART / entry['file'])
            source.thumbnail((180, 285), Image.Resampling.LANCZOS)
            x, y = i % 5 * 360, i // 5 * 320
            for j, color in enumerate(['#f8f5ec', '#252833']):
                frame = Image.new('RGB', (180, 300), color)
                frame.paste(source, (0, (300 - source.height) // 2), source)
                sheet.paste(frame, (x + j * 180, y))
            draw.text((x + 8, y + 301), entry['id'], font=font, fill='#252833')
        sheet.save(folder / f'coleccion-{page:02d}.jpg', quality=90)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--apply', action='store_true')
    parser.add_argument('--cities')
    args = parser.parse_args()
    framing_path = ROOT / 'constants/cityDioramaFraming.json'
    catalog_path = ART / 'catalogo-propuesto.json'
    framing = json.loads(framing_path.read_text())
    catalog = json.loads(catalog_path.read_text())
    profiles = framing['images']
    selected = set(args.cities.split(',')) if args.cities else set(profiles)
    assert selected <= profiles.keys()
    items = [(city_id, profile) for city_id, profile in profiles.items() if city_id in selected]
    with ProcessPoolExecutor(max_workers=4) as pool:
        results = []
        for result in pool.map(extract, items):
            results.append(result)
            print(f'{len(results)}/{len(items)} {result["id"]}', flush=True)
    contact_sheets(results)
    if args.apply:
        assert len(results) == len(profiles) == 250, 'Apply the complete collection together.'
        for result in results:
            profile = profiles[result['id']]
            profile['opaqueSource'] = result['source']
            profile['file'] = result['file']
            city = next(c for c in catalog['cities'] if c['id'] == result['id'])
            city['conceptImage'] = result['file']
            city.setdefault('originalConceptImage', result['source'])
        framing['transparency'] = {'method': 'Local full-resolution exterior edges + solid lower plinth fill; opaque RGB unchanged.', 'version': 1, 'preservesCanvasAndRegistration': True}
        for path, value in [(framing_path, framing), (catalog_path, catalog), (ART / 'verificacion/transparencia/manifest.json', {'version': 1, 'images': results})]:
            path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
