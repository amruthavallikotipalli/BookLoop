import os
from PIL import Image

src = r'C:\Users\Amrut\.gemini\antigravity\brain\560e1010-0db4-4a70-9040-e0fccf57345d\.user_uploaded\media_1795360281281_58fe7f82.jpg'
master = Image.open(src).convert('RGB')
w, h = master.size

os.makedirs('assets/y2k', exist_ok=True)

# List of regions to crop from Image 1:
regions = {
    'torus_rings': (260, 20, 580, 540),
    'chrome_puffy_star': (745, 380, 955, 520),
    'download_dialog': (168, 360, 342, 455),
    'retro_window': (700, 30, 930, 195),
    'chrome_blob': (10, 345, 185, 510),
    'cd_disc': (450, 400, 625, 580),
}

def black_to_transparent(crop_img):
    rgba = crop_img.convert('RGBA')
    pix = rgba.load()
    cw, ch = rgba.size
    for x in range(cw):
        for y in range(ch):
            r, g, b, a = pix[x, y]
            brightness = (r + g + b) / 3.0
            if brightness < 8:
                pix[x, y] = (0, 0, 0, 0)
            elif brightness < 30:
                # Smooth alpha transition
                alpha = int(((brightness - 8) / 22.0) * 255)
                pix[x, y] = (r, g, b, alpha)
    bbox = rgba.getbbox()
    if bbox:
        rgba = rgba.crop(bbox)
    return rgba

for name, box in regions.items():
    cropped = master.crop(box)
    if name in ['download_dialog', 'retro_window']:
        # Dialogs have their own rectangular borders, preserve opaque
        rgba = cropped.convert('RGBA')
        pix = rgba.load()
        cw, ch = rgba.size
        # Just trim black outside the window border
        for x in range(cw):
            for y in range(ch):
                r, g, b, a = pix[x, y]
                if r < 10 and g < 10 and b < 10:
                    pix[x, y] = (0, 0, 0, 0)
        bbox = rgba.getbbox()
        if bbox:
            rgba = rgba.crop(bbox)
        out_path = f'assets/y2k/{name}.png'
        rgba.save(out_path, 'PNG')
    else:
        cleaned = black_to_transparent(cropped)
        out_path = f'assets/y2k/{name}.png'
        cleaned.save(out_path, 'PNG')
    print(f'Extracted {name} -> {out_path}')

print('All Y2K decorative assets extracted from reference image!')
