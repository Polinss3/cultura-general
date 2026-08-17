#!/usr/bin/env python3
"""Genera V_FINAL: las capturas de V3 con las pantallas nuevas dentro."""

import sys
from pathlib import Path

from PIL import Image

from importlib import import_module
sys.path.insert(0, str(Path(__file__).resolve().parent))
_c = import_module("sustituir-pantallas-capturas".replace("-", "_")) if False else None
from importlib.util import spec_from_file_location, module_from_spec
_spec = spec_from_file_location("compose", Path(__file__).resolve().parent / "sustituir-pantallas-capturas.py")
_mod = module_from_spec(_spec); _spec.loader.exec_module(_mod)
find_islands, locate = _mod.find_islands, _mod.locate

REPO = Path(__file__).resolve().parent.parent
ASSETS = REPO / "Capturas App Store" / "2.0.0"
V3 = ASSETS / "V3"
FIG = Path.home() / "Downloads" / "Crear capturas para App Store" / "src" / "imports"
NEW = ASSETS / "_nuevas"
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else ASSETS / "V_FINAL"

# Por diapositiva: fichero de V3, rotaciones CSS (izq→der), la captura ORIGINAL
# que usó V3 (para localizar la pantalla) y la NUEVA que la sustituye.
# `None` como nueva = esa pantalla se deja igual.
PLAN = {
    "es": [
        ("01-rediseno",            [0],      ["image-7.png"],                    ["01-home-claro-es.webp"]),
        ("02-banderas-del-mundo",  [-4, 3],  ["image-2.png", "image-3.png"],     [None, None]),
        ("03-mas-de-1500-preguntas", [-4, 3], ["image-5.png", "image-4.png"],    ["07-aprender-temas-es.webp", "08-aprender-arte-es.webp"]),
        ("04-pregunta-del-dia",    [0],      ["image-1.png"],                    ["03-diario-es.webp"]),
        ("05-multijugador",        [0],      ["image-6.png"],                    ["11-amigos-es.webp"]),
        ("06-claro-oscuro",        [-4, 3],  ["image-9-light-es.webp", "image-9-dark-es.webp"],
                                                                                 ["01-home-claro-es.webp", "05-home-oscuro-es.webp"]),
    ],
    "en": [
        ("01-redesigned",          [0],      ["image-7-en.webp"],                ["02-home-claro-en.webp"]),
        ("02-world-flags",         [-4, 3],  ["image-2-en.webp", "image-3-en.webp"], [None, None]),
        ("03-over-1500-questions", [-4, 3],  ["image-5-en.webp", "image-4-en.webp"],
                                                                                 ["09-aprender-temas-en.webp", "10-aprender-ohm-en.webp"]),
        ("04-question-of-the-day", [0],      ["image-1-en.webp"],                ["04-diario-en.webp"]),
        ("05-multiplayer",         [0],      ["image-6-en.webp"],                ["12-amigos-en.webp"]),
        ("06-light-dark",          [-4, 3],  ["image-9-light-en.webp", "image-9-dark-en.webp"],
                                                                                 ["02-home-claro-en.webp", "06-home-oscuro-en.webp"]),
    ],
}

# Por encima de esto la original no encaja y no me fío de la localización.
UMBRAL = 14.0

fallos = 0
for lang, slides in PLAN.items():
    d = OUT / lang.upper()
    d.mkdir(parents=True, exist_ok=True)
    print(f"\n═══ {lang.upper()} ═══")
    for name, degs, olds, news in slides:
        canvas = Image.open(V3 / lang.upper() / f"{name}.png").convert("RGB")
        islands = find_islands(canvas)
        if len(islands) != len(degs):
            print(f"  ✗ {name}: esperaba {len(degs)} móvil(es), detecté {len(islands)}")
            fallos += 1
            continue

        old_imgs = [Image.open(FIG / o) for o in olds]
        phones = locate(canvas, islands, degs, old_imgs)

        estados = []
        for i, ((p, c), new) in enumerate(zip(phones, news)):
            estados.append(f"móvil{i + 1} dif={c:.1f}")
            if c > UMBRAL:
                print(f"  ✗ {name}: el móvil {i + 1} no cuadra (dif={c:.1f}), no lo toco")
                fallos += 1
                continue
            if new is not None:
                p.paste(canvas, Image.open(NEW / new))

        canvas.save(d / f"{name}.png")
        cambiados = sum(1 for n in news if n)
        print(f"  ✓ {name}  [{' · '.join(estados)}]  {cambiados} pantalla(s) sustituida(s)")

print(f"\n{'sin problemas' if not fallos else str(fallos) + ' problemas'}")
sys.exit(1 if fallos else 0)
