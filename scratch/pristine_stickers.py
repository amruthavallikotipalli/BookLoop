from PIL import Image
from collections import deque
import os

os.makedirs('assets/stickers', exist_ok=True)
master = Image.open('reference/guitar_reference.png').convert('RGB')
w, h = master.size
pix = master.load()

# Step 1: Flood fill from 4 outer edges of master image
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
    
    r, g, b = pix[x, y]
    diff = max(abs(r-g), abs(g-b), abs(r-b))
    brightness = (r + g + b) // 3
    
    if brightness >= 175 and diff <= 12:
        is_bg[x][y] = True
        for nx, ny in [(x+1, y), (x-1, y), (x, y+1), (x, y-1)]:
            if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited:
                queue.append((nx, ny))

rgba_master = master.convert('RGBA')
r_pix = rgba_master.load()

for x in range(w):
    for y in range(h):
        if is_bg[x][y]:
            r_pix[x, y] = (0, 0, 0, 0)

# Sticker definitions: (name, x0, y0, x1, y1)
stickers_def = [
    ('home', 15, 30, 400, 455),
    ('books', 380, 80, 800, 455),
    ('search', 790, 50, 1140, 460),
    ('cart', 1110, 60, 1530, 460),
    ('user', 15, 500, 430, 930),
    ('heart', 420, 530, 810, 915),
    ('bookmark', 810, 500, 1130, 920),
    ('gear', 1130, 530, 1530, 915),
]

for name, x0, y0, x1, y1 in stickers_def:
    crop = rgba_master.crop((x0, y0, x1, y1))
    cw, ch = crop.size
    cpix = crop.load()
    
    # Remove any small disconnected noise components (< 500 pixels)
    c_visited = set()
    components = []
    for cx in range(cw):
        for cy in range(ch):
            if cpix[cx, cy][3] > 0 and (cx, cy) not in c_visited:
                comp = []
                cq = deque([(cx, cy)])
                c_visited.add((cx, cy))
                while cq:
                    px, py = cq.popleft()
                    comp.append((px, py))
                    for nx, ny in [(px+1, py), (px-1, py), (px, py+1), (px, py-1)]:
                        if 0 <= nx < cw and 0 <= ny < ch and (nx, ny) not in c_visited and cpix[nx, ny][3] > 0:
                            c_visited.add((nx, ny))
                            cq.append((nx, ny))
                components.append(comp)
                
    if components:
        components.sort(key=len, reverse=True)
        # The main sticker is components[0]
        # Any component with fewer than 500 pixels is noise speckle
        for comp in components[1:]:
            if len(comp) < 500:
                for cx, cy in comp:
                    cpix[cx, cy] = (0, 0, 0, 0)
                    
    # Autocrop to tight bounding box with 6px padding
    bbox = crop.getbbox()
    if bbox:
        bx0 = max(0, bbox[0] - 6)
        by0 = max(0, bbox[1] - 6)
        bx1 = min(cw, bbox[2] + 6)
        by1 = min(ch, bbox[3] + 6)
        crop = crop.crop((bx0, by0, bx1, by1))
        
    out_path = f'assets/stickers/{name}.png'
    crop.save(out_path, 'PNG')
    print(f'Saved pristine {name} -> {out_path} ({crop.size})')

print('All 8 stickers pristine and saved!')
