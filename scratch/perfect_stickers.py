import os
from PIL import Image, ImageFilter
from collections import deque

os.makedirs('assets/stickers', exist_ok=True)

# 1. Clean up electric guitar sticker from pure white background
guitar_jpg_path = r'C:\Users\Amrut\.gemini\antigravity\brain\560e1010-0db4-4a70-9040-e0fccf57345d\electric_guitar_sticker_1795356166405.jpg'
if os.path.exists(guitar_jpg_path):
    g_img = Image.open(guitar_jpg_path).convert('RGBA')
    gw, gh = g_img.size
    g_pix = g_img.load()
    
    # Flood fill from borders: anything with r > 248, g > 248, b > 248 is pure background
    visited = set()
    queue = deque()
    for x in range(gw):
        queue.append((x, 0))
        queue.append((x, gh - 1))
    for y in range(gh):
        queue.append((0, y))
        queue.append((gw - 1, y))
        
    while queue:
        x, y = queue.popleft()
        if (x, y) in visited:
            continue
        visited.add((x, y))
        r, g, b, a = g_pix[x, y]
        # Background is white/light shadow boundary
        if r > 240 and g > 240 and b > 240:
            g_pix[x, y] = (0, 0, 0, 0)
            for nx, ny in [(x+1, y), (x-1, y), (x, y+1), (x, y-1)]:
                if 0 <= nx < gw and 0 <= ny < gh and (nx, ny) not in visited:
                    queue.append((nx, ny))
                    
    bbox = g_img.getbbox()
    if bbox:
        g_img = g_img.crop(bbox)
    g_img.save('assets/stickers/electric-guitar.png', 'PNG')
    print('Saved assets/stickers/electric-guitar.png')

# 2. Perfect the 8 stickers from the reference image
master = Image.open('reference/guitar_reference.png').convert('RGB')

stickers_def = [
    ('home', 20, 40, 395, 450),
    ('books', 385, 90, 795, 450),
    ('search', 795, 60, 1135, 455),
    ('cart', 1120, 70, 1525, 455),
    ('user', 25, 510, 425, 920),
    ('heart', 425, 540, 805, 905),
    ('bookmark', 820, 510, 1125, 915),
    ('gear', 1135, 540, 1525, 905),
]

for name, x0, y0, x1, y1 in stickers_def:
    cropped = master.crop((x0, y0, x1, y1)).convert('RGBA')
    w, h = cropped.size
    pix = cropped.load()

    # We know the checkerboard has neutral color diff <= 12 and r >= 170.
    # But some checkerboard squares under the drop shadow might be slightly darker (~160).
    # Floodfill from borders:
    visited = set()
    queue = deque()
    for x in range(w):
        queue.append((x, 0))
        queue.append((x, h - 1))
    for y in range(h):
        queue.append((0, y))
        queue.append((w - 1, y))

    is_bg = [[False]*h for _ in range(w)]

    while queue:
        x, y = queue.popleft()
        if (x, y) in visited:
            continue
        visited.add((x, y))

        r, g, b, _ = pix[x, y]
        diff = max(abs(r - g), abs(g - b), abs(r - b))
        # Outer background
        if diff <= 14 and r >= 155:
            is_bg[x][y] = True
            for nx, ny in [(x+1, y), (x-1, y), (x, y+1), (x, y-1)]:
                if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited:
                    queue.append((nx, ny))

    for x in range(w):
        for y in range(h):
            if is_bg[x][y]:
                pix[x, y] = (0, 0, 0, 0)

    # Connected component check: keep ONLY the main connected component
    # Find largest component of opaque pixels
    opaque_visited = set()
    components = []
    for x in range(w):
        for y in range(h):
            if pix[x, y][3] > 0 and (x, y) not in opaque_visited:
                comp = []
                cqueue = deque([(x, y)])
                opaque_visited.add((x, y))
                while cqueue:
                    cx, cy = cqueue.popleft()
                    comp.append((cx, cy))
                    for nx, ny in [(cx+1, cy), (cx-1, cy), (cx, cy+1), (cx, cy-1)]:
                        if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in opaque_visited and pix[nx, ny][3] > 0:
                            opaque_visited.add((nx, ny))
                            cqueue.append((nx, ny))
                components.append(comp)

    if components:
        # Sort by size descending
        components.sort(key=len, reverse=True)
        main_comp = set(components[0])
        # If there are components that are substantial (> 5% of main), include them (e.g. detached shadow/accent)
        for c in components[1:]:
            if len(c) > len(components[0]) * 0.05:
                main_comp.update(c)

        for x in range(w):
            for y in range(h):
                if (x, y) not in main_comp:
                    pix[x, y] = (0, 0, 0, 0)

    bbox = cropped.getbbox()
    if bbox:
        cropped = cropped.crop(bbox)
    
    out_path = f'assets/stickers/{name}.png'
    cropped.save(out_path, 'PNG')
    print(f'Perfected {name} -> {out_path} ({cropped.size})')

print('All stickers perfected!')
