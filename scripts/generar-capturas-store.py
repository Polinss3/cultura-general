#!/usr/bin/env python3
"""Genera las capturas promocionales 2.0.0 en español e inglés."""

from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parent
CANVAS = (1242, 2688)
FONT_PATH = "/System/Library/Fonts/SFNSRounded.ttf"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    result = ImageFont.truetype(FONT_PATH, size=size)
    try:
        result.set_variation_by_name("Bold" if bold else "Regular")
    except (AttributeError, OSError):
        pass
    return result


def fit_font(text: str, max_width: int, start: int, minimum: int, bold: bool) -> ImageFont.FreeTypeFont:
    probe = ImageDraw.Draw(Image.new("RGB", (10, 10)))
    for size in range(start, minimum - 1, -2):
        candidate = font(size, bold=bold)
        lines = text.split("\n")
        if max(probe.textbbox((0, 0), line, font=candidate)[2] for line in lines) <= max_width:
            return candidate
    return font(minimum, bold=bold)


def add_centered_copy(
    canvas: Image.Image,
    title: str,
    subtitle: str,
    *,
    title_fill: str,
    subtitle_fill: str,
    accent: str,
    dark_stroke: bool = False,
) -> None:
    overlay = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    title_font = fit_font(title, 1090, 116, 82, True)
    subtitle_font = fit_font(subtitle, 1030, 49, 36, False)

    title_box = draw.multiline_textbbox((0, 0), title, font=title_font, spacing=8, align="center")
    title_w = title_box[2] - title_box[0]
    title_h = title_box[3] - title_box[1]
    x = (CANVAS[0] - title_w) // 2
    y = 125
    shadow_color = (0, 0, 0, 100) if dark_stroke else (80, 40, 15, 65)
    stroke_fill = "#171310" if dark_stroke else None
    stroke_width = 2 if dark_stroke else 0

    draw.multiline_text(
        (x + 5, y + 8),
        title,
        font=title_font,
        fill=shadow_color,
        spacing=8,
        align="center",
        stroke_width=stroke_width,
        stroke_fill=stroke_fill,
    )
    draw.multiline_text(
        (x, y),
        title,
        font=title_font,
        fill=title_fill,
        spacing=8,
        align="center",
        stroke_width=stroke_width,
        stroke_fill=stroke_fill,
    )

    subtitle_y = y + title_h + 50
    subtitle_box = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    subtitle_w = subtitle_box[2] - subtitle_box[0]
    subtitle_x = (CANVAS[0] - subtitle_w) // 2
    if dark_stroke:
        draw.text(
            (subtitle_x, subtitle_y),
            subtitle,
            font=subtitle_font,
            fill=subtitle_fill,
            stroke_width=2,
            stroke_fill="#171310",
        )
    else:
        draw.text((subtitle_x, subtitle_y), subtitle, font=subtitle_font, fill=subtitle_fill)

    line_y = subtitle_y + (subtitle_box[3] - subtitle_box[1]) + 35
    draw.rounded_rectangle(
        ((CANVAS[0] - 92) // 2, line_y, (CANVAS[0] + 92) // 2, line_y + 10),
        radius=5,
        fill=accent,
    )
    canvas.alpha_composite(overlay)


def make_phone(path: Path, width: int, angle: float = 0.0) -> Image.Image:
    screenshot = Image.open(path).convert("RGBA")
    frame = 16
    margin = 52
    inner_width = width - frame * 2
    inner_height = round(inner_width * screenshot.height / screenshot.width)
    phone_height = inner_height + frame * 2
    layer = Image.new("RGBA", (width + margin * 2, phone_height + margin * 2 + 26), (0, 0, 0, 0))

    shadow = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rounded_rectangle(
        (margin + 8, margin + 26, margin + width + 8, margin + phone_height + 26),
        radius=64,
        fill=(0, 0, 0, 165),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(28))
    layer.alpha_composite(shadow)

    draw = ImageDraw.Draw(layer)
    body_box = (margin, margin, margin + width, margin + phone_height)
    draw.rounded_rectangle(body_box, radius=64, fill="#0A0A0C", outline="#4B4743", width=5)
    draw.rounded_rectangle(
        (margin + 7, margin + 7, margin + width - 7, margin + phone_height - 7),
        radius=57,
        outline=(255, 255, 255, 75),
        width=2,
    )

    screen = screenshot.resize((inner_width, inner_height), Image.Resampling.LANCZOS)
    screen_mask = Image.new("L", screen.size, 0)
    ImageDraw.Draw(screen_mask).rounded_rectangle(
        (0, 0, inner_width, inner_height), radius=49, fill=255
    )
    layer.paste(screen, (margin + frame, margin + frame), screen_mask)

    if angle:
        layer = layer.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)
    return layer


def place_phone(canvas: Image.Image, path: Path, x: int, y: int, width: int, angle: float = 0.0) -> None:
    phone = make_phone(path, width, angle)
    canvas.alpha_composite(phone, (x - 52, y - 52))


def open_background(name: str) -> Image.Image:
    source = Image.open(ROOT / "_fondos" / name).convert("RGB")
    return ImageOps.fit(source, CANVAS, method=Image.Resampling.LANCZOS).convert("RGBA")


def export(
    language: str,
    filename: str,
    background: str,
    title: str,
    subtitle: str,
    phones: Iterable[tuple[str, int, int, int, float]],
    *,
    title_fill: str,
    subtitle_fill: str,
    accent: str,
    dark_stroke: bool = False,
) -> None:
    canvas = open_background(background)
    add_centered_copy(
        canvas,
        title,
        subtitle,
        title_fill=title_fill,
        subtitle_fill=subtitle_fill,
        accent=accent,
        dark_stroke=dark_stroke,
    )
    for source, x, y, width, angle in phones:
        place_phone(canvas, ROOT / "_capturas" / source, x, y, width, angle)
    output = ROOT / language / filename
    canvas.convert("RGB").save(output, "PNG", optimize=True)


def build_language(language: str) -> None:
    is_es = language == "ES"

    export(
        language,
        "01-tema-claro-oscuro.png" if is_es else "01-light-dark-themes.png",
        "01-estilos.png",
        "Elige tu estilo" if is_es else "Choose your style",
        "Tema claro y oscuro" if is_es else "Light & dark themes",
        [
            ("01-inicio-claro.png", 55, 875, 535, -1.2),
            ("02-inicio-oscuro.png", 652, 875, 535, 1.2),
        ],
        title_fill="#FFFFFF",
        subtitle_fill="#FFF4DF",
        accent="#F2BF26",
        dark_stroke=True,
    )

    export(
        language,
        "02-banderas-del-mundo.png" if is_es else "02-world-flags.png",
        "02-banderas.png",
        "Domina todas\nlas banderas" if is_es else "Master every flag",
        "196 banderas. Dos formas de jugar." if is_es else "196 flags. Two ways to play.",
        [
            ("03-banderas-menu.png", 52, 950, 430, -3.0),
            ("05-banderas-eleccion.png", 760, 950, 430, 3.0),
            ("04-banderas-pais.png", 406, 1090, 430, 0.0),
        ],
        title_fill="#231D19",
        subtitle_fill="#665A51",
        accent="#EA7A36",
    )

    export(
        language,
        "03-nuevo-diseno-preguntas.png" if is_es else "03-new-design-questions.png",
        "03-rediseño.png",
        "Una app totalmente\nrenovada" if is_es else "A fresh new look",
        "Nuevas preguntas. Más por descubrir." if is_es else "New questions. More to discover.",
        [("06-aprender.png", 241, 735, 760, -1.2)],
        title_fill="#231D19",
        subtitle_fill="#665A51",
        accent="#EA7A36",
    )

    export(
        language,
        "04-jugar-con-amigos.png" if is_es else "04-play-with-friends.png",
        "04-amigos.png",
        "Jugar juntos\nes más fácil" if is_es else "Better with friends",
        "Cinco modos para disfrutar con amigos" if is_es else "Five easy ways to play together",
        [("07-amigos.png", 241, 735, 760, 1.2)],
        title_fill="#FFFFFF",
        subtitle_fill="#FFF7F0",
        accent="#F2BF26",
        dark_stroke=False,
    )

    export(
        language,
        "05-niveles-recompensas.png" if is_es else "05-levels-rewards.png",
        "05-progreso.png",
        "Juega. Sube de nivel.\nRepite." if is_es else "Play. Level up.\nRepeat.",
        "Pregunta diaria, recompensas y mucho más" if is_es else "Daily questions, rewards and more",
        [("08-progreso.png", 241, 735, 760, -1.0)],
        title_fill="#402411",
        subtitle_fill="#6A4427",
        accent="#EA7A36",
    )

    export(
        language,
        "06-ligas.png" if is_es else "06-leagues.png",
        "06-ligas.png",
        "Sube de liga" if is_es else "Rise through\nthe leagues",
        "Compite cada semana. Llega a lo más alto." if is_es else "Compete weekly. Reach the top.",
        [("09-ligas.png", 241, 735, 760, 1.0)],
        title_fill="#FFFFFF",
        subtitle_fill="#EAF2FF",
        accent="#F2BF26",
        dark_stroke=False,
    )


if __name__ == "__main__":
    build_language("ES")
    build_language("EN")
    print("Generadas 12 capturas en ES/ y EN/ a 1242 × 2688 px.")
