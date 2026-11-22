import os
from PIL import Image
from collections import deque

os.makedirs('assets/stickers', exist_ok=True)
master = Image.open('reference/guitar_reference.png').convert('RGB')

stickers_def = [
    ('home', 15, 30, 400, 450),
    ('books', 380, 80, 800, 450),
    ('search', 790, 50, 1140, 460),
    ('cart', 1110, 60, 1530, 460),
    ('user', 15, 500, 430, 930),
    ('heart', 420, 530, 810, 910),
    ('bookmark', 810, 500, 1130, 920),
    ('gear', 1130, 530, 1530, 910),
]

def clean_sticker(cropped):
    rgba = cropped.convert('RGBA')
    w, h = rgba.size
    pixels = rgba.load()

    # Step 1: Flood fill from borders to identify outer checkerboard
    visited = set()
    queue = deque()

    for x in range(w):
        queue.append((x, 0))
        queue.append((x, h - 1))
    for y in range(h):
        queue.append((0, y))
        queue.append((w - 1, y))

    def is_bg(r, g, b):
        diff = max(abs(r - g), abs(g - b), abs(r - b))
        # Checkerboard squares are either ~195-205 or ~250-255, and neutral
        if diff <= 12 and r >= 170:
            return True
        return False

    is_transparent = [[False]*h for _ in range(w)]

    while queue:
        x, y = queue.popleft()
        if (x, y) in visited:
            continue
        visited.add((x, y))

        r, g, b, a = pixels[x, y]
        if is_bg(r, g, b):
            is_transparent[x][y] = True
            for nx, ny in [(x+1, y), (x-1, y), (x, y+1), (x, y-1)]:
                if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited:
                    queue.append((nx, ny))

    # Apply transparency
    for x in range(w):
        for y in range(h):
            if is_transparent[x][y]:
                pixels[x, y] = (0, 0, 0, 0)

    # Step 2: Remove isolated specks (pixels with alpha > 0 surrounded mostly by transparent)
    for x in range(w):
        for y in range(h):
            if pixels[x, y][3] > 0:
                # count opaque neighbors in 5x5 window
                opaque_count = 0
                for dx in range(-2, 3):
                    for dy in range(-2, 3):
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < w and 0 <= ny < h:
                            if pixels[nx, ny][3] > 0:
                                opaque_count += 1
                if opaque_count <= 4:
                    pixels[x, y] = (0, 0, 0, 0)

    # Step 3: Autocrop bounding box
    bbox = rgba.getbbox()
    if bbox:
        # add 4px padding
        x0 = max(0, bbox[0] - 4)
        y0 = max(0, bbox[1] - 4)
        x1 = min(w, bbox[2] + 4)
        y1 = min(h, bbox[3] + 4)
        rgba = rgba.crop((x0, y0, x1, y1))

    return rgba

for name, x0, y0, x1, y1 in stickers_def:
    cropped = master.crop((x0, y0, x1, y1))
    cleaned = clean_sticker(cropped)
    out_path = f'assets/stickers/{name}.png'
    cleaned.save(out_path, 'PNG')
    print(f'Processed {name} -> {out_path} ({cleaned.size})')

print('All 8 stickers extracted successfully!')
