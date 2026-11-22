import os
from PIL import Image
from collections import deque

items = [
    (r'C:\Users\Amrut\.gemini\antigravity\brain\560e1010-0db4-4a70-9040-e0fccf57345d\sticker_adventure_compass_1795356791278.jpg', 'assets/stickers/adventure-compass.png'),
    (r'C:\Users\Amrut\.gemini\antigravity\brain\560e1010-0db4-4a70-9040-e0fccf57345d\sticker_horror_skull_1795356811423.jpg', 'assets/stickers/horror-skull.png'),
    (r'C:\Users\Amrut\.gemini\antigravity\brain\560e1010-0db4-4a70-9040-e0fccf57345d\sticker_fantasy_grimoire_1795356831023.jpg', 'assets/stickers/fantasy-grimoire.png'),
]

for src, dst in items:
    img = Image.open(src).convert('RGBA')
    w, h = img.size
    pix = img.load()
    
    visited = set()
    queue = deque()
    for x in range(w):
        queue.append((x, 0))
        queue.append((x, h - 1))
    for y in range(h):
        queue.append((0, y))
        queue.append((w - 1, y))
        
    while queue:
        x, y = queue.popleft()
        if (x, y) in visited:
            continue
        visited.add((x, y))
        r, g, b, a = pix[x, y]
        # White background
        if r > 240 and g > 240 and b > 240:
            pix[x, y] = (0, 0, 0, 0)
            for nx, ny in [(x+1, y), (x-1, y), (x, y+1), (x, y-1)]:
                if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited:
                    queue.append((nx, ny))
                    
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(dst, 'PNG')
    print(f'Saved {dst} ({img.size})')

print('All 3 genre stickers transparent and saved!')
