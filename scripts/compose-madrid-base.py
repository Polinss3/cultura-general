"""Rebuild Madrid from its approved pixels and the shared plinth (requires Pillow).

Run from any directory: python3 scripts/compose-madrid-base.py
The grayscale mask is an editable art asset in output coordinates. Only the
perimeter is feathered; landmarks are copied without resampling or generation.
"""
from pathlib import Path

from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / "docs/ciudades"
CITY_OFFSET_Y = 20

source = Image.open(ART / "normalizadas/madrid-v2.png").convert("RGB")
base = Image.open(ART / "normalizadas/base-comun-v2.png").convert("RGB")
mask = Image.open(ART / "revision-madrid/mascara-ciudad.png").convert("L")
assert source.size == base.size == mask.size == (1254, 1254)

city = Image.new("RGB", source.size, (254, 240, 217))
city.paste(source, (0, CITY_OFFSET_Y))
result = Image.composite(city, base, mask)

# Interior landmark regions must retain the exact approved source pixels.
regions = {
    "torres": (518, 206, 810, 431),
    "sol": (135, 450, 585, 647),
    "atocha": (725, 490, 1055, 593),
    "alcala": (810, 630, 1085, 725),
    "oso": (489, 646, 626, 821),
}
for name, (left, top, right, bottom) in regions.items():
    original = source.crop((left, top, right, bottom))
    composed = result.crop((left, top + CITY_OFFSET_Y, right, bottom + CITY_OFFSET_Y))
    assert ImageChops.difference(original, composed).getbbox() is None, name

target = ART / "normalizadas/madrid-v3.png"
result.save(target)
print(f"Madrid compuesto: {target}; cinco regiones de hitos sin cambios de píxeles.")
