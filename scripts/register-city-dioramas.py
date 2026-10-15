"""Register a visually checked batch, preserve prompts, measure and rebuild docs.

Usage: python3 scripts/register-city-dioramas.py /path/to/batch.json
Input: {"batch": 4, "cities": [{"id", "source", "prompt", "sources", ...}]}.
Each item must explicitly set checkedForGallery=true after visual inspection.
This is a gallery check, not architectural/editorial approval for the game.
Requires Pillow. Never overwrites an existing city image.
"""
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / "docs/ciudades"


def read(path):
    return json.loads(path.read_text())


def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def sheet(ids, framing, names, target, columns):
    image = Image.new("RGB", (360 * columns, 390 * ((len(ids) + columns - 1) // columns)), "#f8f5ef")
    draw = ImageDraw.Draw(image)
    font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 13)
    for index, city_id in enumerate(ids):
        profile = framing["images"][city_id]
        layout = profile["normalized"]
        source = Image.open(ART / profile["file"]).convert("RGB")
        source = source.resize((round(layout["width"] * 360), round(layout["height"] * 360)), Image.Resampling.LANCZOS)
        frame = Image.new("RGB", (360, 360), framing["frame"]["background"])
        frame.paste(source, (round(layout["left"] * 360), round(layout["top"] * 360)))
        x, y = index % columns * 360, index // columns * 390
        image.paste(frame, (x, y))
        draw.text((x + 12, y + 365), names[city_id], font=font, fill="#292c39")
    image.save(target)


batch = read(Path(sys.argv[1]))
catalog_path = ART / "catalogo-propuesto.json"
framing_path = ROOT / "constants/cityDioramaFraming.json"
catalog, framing = read(catalog_path), read(framing_path)
cities = {city["id"]: city for city in catalog["cities"]}
prepared = []
for item in batch["cities"]:
    city_id = item["id"]
    city = cities[city_id]
    assert item.get("checkedForGallery") is True, f"Visual check required: {city_id}"
    assert not city.get("conceptImage"), f"Already illustrated: {city_id}"
    assert item.get("prompt") and item.get("sources"), f"Prompt/references missing: {city_id}"
    assert item.get("landmarks") or city.get("landmarks"), f"Landmarks missing: {city_id}"
    source = Image.open(item["source"]).convert("RGB")
    assert source.size == (1254, 1254), (city_id, source.size)
    bottom = max(max(range(970, 1100), key=lambda y: sum((source.getpixel((x, y - 2))[i] - source.getpixel((x, y + 2))[i]) ** 2 for i in range(3))) for x in range(555, 696, 5))
    assert abs(bottom - 1041) <= 15, f"Base needs review: {city_id}, bottom={bottom}"
    left, right = item.get("baseLeft", 33), item.get("baseRight", 1225)
    scale = framing["frame"]["baseWidth"] * 1254 / (right - left)
    profile = {"file": f"normalizadas/{city_id}-v1.png", "sourceWidth": 1254, "sourceHeight": 1254, "baseLeft": left, "baseRight": right, "baseBottom": bottom,
               "normalized": {"left": framing["frame"]["baseCenterX"] - scale * (left + right) / 2508, "top": framing["frame"]["baseBottom"] - scale * bottom / 1254, "width": scale, "height": scale}}
    assert not (ART / profile["file"]).exists(), f"Will not overwrite {city_id}"
    prepared.append((item, profile))

for item, profile in prepared:
    city_id = item["id"]
    shutil.copyfile(item["source"], ART / profile["file"])
    cities[city_id].update(status="concept-needs-review", landmarkStatus="candidate", conceptImage=profile["file"], originalConceptImage=profile["file"], framingProfile=city_id, sources=item["sources"])
    if item.get("landmarks"):
        cities[city_id]["landmarks"] = item["landmarks"]
    framing["images"][city_id] = profile
    write(ART / "produccion" / f"{city_id}.json", {"id": city_id, "batch": batch["batch"], "tool": "ImageGen integrada", "reference": "normalizadas/base-comun-v2.png", "output": profile["file"], "generatedFile": Path(item["source"]).name, "prompt": item["prompt"], "sources": item["sources"], "galleryCheck": "visually-checked", "editorialStatus": "needs-review"})

bottoms = [profile["baseBottom"] for profile in framing["images"].values()]
framing["measurement"]["sourceBaselineSpread"] = max(bottoms) - min(bottoms)
write(catalog_path, catalog)
write(framing_path, framing)
measurement_path = ART / "mediciones-encuadre.json"
measurements = {"version": read(measurement_path)["version"] + 1, "images": []}
for city_id, profile in framing["images"].items():
    layout = profile["normalized"]
    with Image.open(ART / profile["file"]) as image:
        assert image.size == (profile["sourceWidth"], profile["sourceHeight"])
    anchors = {"registeredLeft": layout["left"] + layout["width"] * profile["baseLeft"] / 1254, "registeredRight": layout["left"] + layout["width"] * profile["baseRight"] / 1254, "registeredBottom": layout["top"] + layout["height"] * profile["baseBottom"] / 1254}
    for key, target in [("registeredLeft", .08), ("registeredRight", .92), ("registeredBottom", .92)]:
        assert abs(anchors[key] - target) < 1e-10, (city_id, key)
    measurements["images"].append({"id": city_id, "file": profile["file"], "width": 1254, "height": 1254, "bytes": (ART / profile["file"]).stat().st_size, "baseLeft": profile["baseLeft"], "baseRight": profile["baseRight"], "baseBottom": profile["baseBottom"], **anchors})
write(measurement_path, measurements)
names = {city_id: city["name"]["es"] for city_id, city in cities.items()}
batch_ids = [city["id"] for city in catalog["cities"] if city["batch"] == batch["batch"] and city.get("conceptImage")]
sheet(batch_ids, framing, names, ART / "verificacion" / f"tanda-{batch['batch']:02d}.png", 2)
sheet(list(framing["images"]), framing, names, ART / "verificacion/coleccion-actual.png", 3)
subprocess.run([os.environ.get("CITY_NODE", "node"), str(ROOT / "scripts/build-city-framing-preview.mjs")], cwd=ROOT, check=True)
print(f"Tanda {batch['batch']}: {len(prepared)} ciudades registradas; {len(framing['images'])} imágenes en el visor.")
