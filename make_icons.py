"""Generate DV Trainer app icons (PNG + ICO) with the DeltaV amber 'DV' mark."""
import os

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    raise SystemExit("PIL_MISSING")

folder = os.path.dirname(os.path.abspath(__file__))
icons_dir = os.path.join(folder, "icons")
os.makedirs(icons_dir, exist_ok=True)

BG1 = (245, 166, 35)   # amber
BG2 = (255, 140, 66)   # orange
DARK = (13, 17, 23)

def make(size):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # rounded dark tile
    r = int(size * 0.22)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=r, fill=DARK)
    # amber inner panel
    m = int(size * 0.14)
    d.rounded_rectangle([m, m, size - 1 - m, size - 1 - m], radius=int(r * 0.7),
                        fill=BG1)
    # "DV" text
    txt = "DV"
    fsize = int(size * 0.42)
    font = None
    for name in ("segoeuib.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf"):
        try:
            font = ImageFont.truetype(name, fsize)
            break
        except Exception:
            continue
    if font is None:
        font = ImageFont.load_default()
    bbox = d.textbbox((0, 0), txt, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.text(((size - tw) / 2 - bbox[0], (size - th) / 2 - bbox[1]), txt,
           font=font, fill=DARK)
    return img

sizes = [16, 32, 48, 64, 128, 192, 256, 512]
imgs = {s: make(s) for s in sizes}

imgs[192].save(os.path.join(icons_dir, "icon-192.png"))
imgs[512].save(os.path.join(icons_dir, "icon-512.png"))
imgs[256].save(os.path.join(icons_dir, "icon.png"))

# Multi-resolution ICO for the Windows shortcut
imgs[256].save(os.path.join(icons_dir, "dvtrainer.ico"),
               sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])

print("ICONS_OK")
