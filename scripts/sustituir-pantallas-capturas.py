#!/usr/bin/env python3
"""Sustituye las pantallas de los móviles dentro de las capturas ya montadas.

No redibuja nada del diseño: parte de la PNG de V3 y solo reemplaza el
contenido de cada pantalla. Fondo, titular, badge, marco, sombras y brillo
quedan exactamente como estaban.

Cómo encuentra cada pantalla:

  1. La Dynamic Island es un rectángulo negro puro de 88×26 (en unidades del
     diseño) colocado a 10 del borde superior de la pantalla y centrado. Se
     detecta por componentes conexas y da la posición con precisión de píxel.
  2. La escala se afina comparando contra la captura ORIGINAL que usó V3: se
     prueba un rango estrecho y se queda con la que menos difiere.
  3. Si la original encaja bien —diferencia baja—, la nueva va exactamente en
     su sitio.

Lo usa scripts/generar-capturas-v-final.py, que trae el plan de qué
pantalla va en cada móvil.
"""

import math
import sys
from collections import deque
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

# Proporciones del marco, en unidades del diseño (IPhone17 del bundle de Figma).
FRAME_W, FRAME_H = 260.0, 562.0
ISLAND_W, ISLAND_H, ISLAND_TOP, ISLAND_R = 88.0, 26.0, 10.0, 13.0
SCREEN_R = 44.0
# Distancia del centro de la pantalla al centro de la isla, en unidades de escala.
ISLAND_DY = FRAME_H / 2 - (ISLAND_TOP + ISLAND_H / 2)     # 281 - 23 = 258


def cover(src, w, h):
    """object-fit: cover — recorta al centro y llena la caja."""
    sw, sh = src.size
    k = max(w / sw, h / sh)
    nw, nh = max(1, round(sw * k)), max(1, round(sh * k))
    im = src.resize((nw, nh), Image.LANCZOS)
    return im.crop(((nw - w) // 2, (nh - h) // 2, (nw - w) // 2 + w, (nh - h) // 2 + h))


def rounded_mask(w, h, r):
    m = Image.new("L", (w, h), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, w - 1, h - 1), radius=r, fill=255)
    return m


@dataclass
class Phone:
    scale: float      # px de lienzo por unidad de diseño
    css_deg: float    # rotación CSS (positiva = horaria)
    cx: float         # centro de la pantalla en el lienzo
    cy: float

    def screen(self, src, glare=True):
        w, h = round(FRAME_W * self.scale), round(FRAME_H * self.scale)
        s = cover(src, w, h).convert("RGBA")
        s.putalpha(rounded_mask(w, h, round(SCREEN_R * self.scale)))

        d = ImageDraw.Draw(s)
        iw, ih = round(ISLAND_W * self.scale), round(ISLAND_H * self.scale)
        x0, y0 = (w - iw) // 2, round(ISLAND_TOP * self.scale)
        d.rounded_rectangle((x0, y0, x0 + iw, y0 + ih),
                            radius=round(ISLAND_R * self.scale), fill=(0, 0, 0, 255))

        if glare:
            # linear-gradient(135deg, rgba(255,255,255,.07) 0%, transparent 50%)
            yy, xx = np.mgrid[0:h, 0:w]
            t = np.clip((xx / w + yy / h) / 2.0, 0, 1) / 0.5
            a = np.clip((1 - t) * 0.07, 0, 1)
            g = np.zeros((h, w, 4), dtype=np.uint8)
            g[..., :3] = 255
            g[..., 3] = (a * 255).astype(np.uint8)
            s = Image.alpha_composite(s, Image.fromarray(g, "RGBA"))
            s.putalpha(rounded_mask(w, h, round(SCREEN_R * self.scale)))
            d = ImageDraw.Draw(s)
            d.rounded_rectangle((x0, y0, x0 + iw, y0 + ih),
                                radius=round(ISLAND_R * self.scale), fill=(0, 0, 0, 255))

        return s.rotate(-self.css_deg, resample=Image.BICUBIC, expand=True)

    def paste(self, canvas, src):
        rot = self.screen(src)
        x = round(self.cx - rot.width / 2)
        y = round(self.cy - rot.height / 2)
        canvas.paste(rot.convert("RGB"), (x, y), rot.split()[3])

    def diff(self, canvas_np, src):
        rot = self.screen(src)
        x = round(self.cx - rot.width / 2)
        y = round(self.cy - rot.height / 2)
        H, W = canvas_np.shape[:2]
        x0, y0 = max(0, x), max(0, y)
        x1, y1 = min(W, x + rot.width), min(H, y + rot.height)
        if x1 <= x0 or y1 <= y0:
            return 1e9
        sub = canvas_np[y0:y1, x0:x1].astype(np.float32)
        r = np.asarray(rot.convert("RGB"), np.float32)[y0 - y:y1 - y, x0 - x:x1 - x]
        m = (np.asarray(rot.split()[3], np.float32)[y0 - y:y1 - y, x0 - x:x1 - x] > 250)
        # Nos quedamos con el interior: el borde lo domina el antialias del marco.
        m[:6, :] = m[-6:, :] = False
        m[:, :6] = m[:, -6:] = False
        if m.sum() < 5000:
            return 1e9
        return float((np.abs(sub - r).mean(axis=2) * m).sum() / m.sum())


def find_islands(img):
    """Rectángulos negros con proporción de Dynamic Island, de izquierda a derecha."""
    a = np.asarray(img.convert("RGB")).astype(int)
    black = a.sum(axis=2) < 30
    H, W = black.shape
    seen = np.zeros_like(black)
    found = []
    for y in range(int(H * 0.30), int(H * 0.78)):
        for x in range(0, W, 3):
            if not black[y, x] or seen[y, x]:
                continue
            q, pix = deque([(y, x)]), []
            seen[y, x] = 1
            while q:
                cy, cx = q.popleft()
                pix.append((cy, cx))
                if len(pix) > 200000:
                    break
                for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    ny, nx = cy + dy, cx + dx
                    if 0 <= ny < H and 0 <= nx < W and black[ny, nx] and not seen[ny, nx]:
                        seen[ny, nx] = 1
                        q.append((ny, nx))
            if 3000 < len(pix) < 120000:
                ys = [p[0] for p in pix]
                xs = [p[1] for p in pix]
                w, h = max(xs) - min(xs) + 1, max(ys) - min(ys) + 1
                if 2.5 < w / h < 4.5:
                    found.append((min(xs) + w / 2, min(ys) + h / 2, w))
    return sorted(found)


def locate(canvas, islands, css_degs, old_srcs):
    """Deduce la colocación de cada móvil y afina la escala contra la original."""
    canvas_np = np.asarray(canvas.convert("RGB"))
    phones = []
    for (icx, icy, iw), deg, src in zip(islands, css_degs, old_srcs):
        rad = math.radians(deg)
        # Ancho de la caja envolvente de la isla girada -> escala aproximada.
        bbox_w = ISLAND_W * abs(math.cos(rad)) + ISLAND_H * abs(math.sin(rad))
        s0 = iw / bbox_w

        best, best_c = None, 1e9
        for ds in [x / 1000 for x in range(-90, 91, 5)]:
            s = s0 + ds
            cx = icx - ISLAND_DY * s * math.sin(rad)
            cy = icy + ISLAND_DY * s * math.cos(rad)
            p = Phone(s, deg, cx, cy)
            c = p.diff(canvas_np, src)
            if c < best_c:
                best_c, best = c, p
        # Segunda pasada fina alrededor del mejor.
        s0 = best.scale
        for ds in [x / 1000 for x in range(-6, 7)]:
            s = s0 + ds
            cx = icx - ISLAND_DY * s * math.sin(rad)
            cy = icy + ISLAND_DY * s * math.cos(rad)
            p = Phone(s, deg, cx, cy)
            c = p.diff(canvas_np, src)
            if c < best_c:
                best_c, best = c, p
        phones.append((best, best_c))
    return phones
