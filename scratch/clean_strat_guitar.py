from PIL import Image
from collections import deque

img = Image.open('assets/stickers/y2k-strat-guitar.png').convert('RGBA')
w, h = img.size
pix = img.load()

# First erase the bottom right area (x > 550, y > 450) where screenshot UI icons were
for x in range(550, w):
    for y in range(450, h):
        pix[x, y] = (255, 255, 255, 255)

# Flood fill from borders to make pure white transparent
visited = set()
queue = deque([(0, 0), (w-1, 0), (0, h-1), (w-1, h-1)])

for x in range(w):
    queue.append((x, 0))
    queue.append((x, h-1))
for y in range(h):
    queue.append((0, y))
    queue.append((w-1, y))

while queue:
    x, y = queue.popleft()
    if (x, y) in visited:
        continue
    visited.add((x, y))
    
    r, g, b, a = pix[x, y]
    # The background is white (r > 240, g > 240, b > 240)
    # The sticker has a black outer outline (r < 80)!
    if r > 230 and g > 230 and b > 230:
        pix[x, y] = (0, 0, 0, 0)
        for nx, ny in [(x+1, y), (x-1, y), (x, y+1), (x, y-1)]:
            if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited:
                queue.append((nx, ny))

bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)

img.save('assets/stickers/y2k-strat-guitar.png', 'PNG')
print('Pristine transparent y2k-strat-guitar.png saved with size:', img.size)
