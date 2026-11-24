"""Genera public/images/og-image.jpg (1200x630) y favicons a partir de site.json.
Uso: python scripts/generate_og_image.py
Reglas: logo real, foto real a sangre en un panel, titular grande, sin teléfonos ni listas."""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent.parent
site = json.loads((ROOT / "content/site.json").read_text(encoding="utf-8"))
F = ROOT / "scripts/fonts"
BOLD = ImageFont.truetype(str(F / "SpaceGrotesk-700.ttf"), 60)
REG = ImageFont.truetype(str(F / "SpaceGrotesk-400.ttf"), 30)
SMALL = ImageFont.truetype(str(F / "SpaceGrotesk-700.ttf"), 26)

BG = (20, 18, 17)
ACCENT = (244, 132, 32)
INK = (243, 239, 234)
MUTED = (190, 182, 172)

W, H = 1200, 630
img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# Panel derecho: foto real a sangre
hero = next(s for s in site["sections"] if s["type"] == "hero")
photo = Image.open(ROOT / "public" / hero["image"].lstrip("/")).convert("RGB")
photo = ImageOps.fit(photo, (520, H), Image.LANCZOS, centering=(0.55, 0.5))
img.paste(photo, (W - 520, 0))
d.rectangle([W - 524, 0, W - 520, H], fill=ACCENT)

# Cuadrícula de plano sutil en el panel izquierdo
for x in range(0, W - 524, 40):
    d.line([(x, 0), (x, H)], fill=(32, 30, 28))
for y in range(0, H, 40):
    d.line([(0, y), (W - 524, y)], fill=(32, 30, 28))

# Logo real
logo = Image.open(ROOT / "public/images/logo-go-ingenieria.png").convert("RGBA")
lw = 420
logo = logo.resize((lw, int(logo.height * lw / logo.width)), Image.LANCZOS)
img.paste(logo, (64, 64), logo)

# Titular
lines = ["Del plano a la obra,", "sin sorpresas."]
y = 270
for i, t in enumerate(lines):
    d.text((64, y), t, font=BOLD, fill=INK if i == 0 else ACCENT)
    y += 72
d.text((64, y + 24), "Diseño eléctrico y mecánico en BIM", font=REG, fill=MUTED)
d.text((64, H - 70), "goingenieria.com", font=SMALL, fill=INK)

out = ROOT / "public/images/og-image.jpg"
img.save(out, "JPEG", quality=88, optimize=True, progressive=True)
print("OG:", out)

# Favicons: ícono simplificado (no el logo reducido)
def icon(size: int) -> Image.Image:
    s = size * 4
    im = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    g = ImageDraw.Draw(im)
    g.rounded_rectangle([0, 0, s - 1, s - 1], radius=int(s * 0.22), fill=BG)
    g.rounded_rectangle([int(s*.1), int(s*.1), int(s*.9), int(s*.9)], radius=int(s * 0.16), outline=INK, width=max(2, int(s * 0.06)))
    f = ImageFont.truetype(str(F / "SpaceGrotesk-700.ttf"), int(s * 0.46))
    bbox = g.textbbox((0, 0), "Go", font=f)
    g.text(((s - (bbox[2] - bbox[0])) / 2 - bbox[0], (s - (bbox[3] - bbox[1])) / 2 - bbox[1]), "Go", font=f, fill=ACCENT)
    return im.resize((size, size), Image.LANCZOS)

icon(32).save(ROOT / "public/favicon-32.png")
icon(180).save(ROOT / "public/apple-touch-icon.png")
icon(512).save(ROOT / "public/icon-512.png")
(ROOT / "public/favicon.svg").write_text(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
    '<rect width="64" height="64" rx="14" fill="#141211"/>'
    '<rect x="6.5" y="6.5" width="51" height="51" rx="10" fill="none" stroke="#F3EFEA" stroke-width="4"/>'
    '<text x="32" y="42" text-anchor="middle" font-family="Space Grotesk, Arial, sans-serif" font-weight="700" font-size="29" fill="#F48420">Go</text>'
    '</svg>', encoding="utf-8")
print("Favicons listos")
