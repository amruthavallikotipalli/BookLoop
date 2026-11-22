from PIL import Image
from collections import deque

img = Image.open('assets/stickers/y2k-strat-guitar.png').convert('RGBA')
w, h = img.size
pix = img.load()

# Connected component filtering to remove any detached specks
visited = set()
components = []
for x in range(w):
    for y in range(h):
        if pix[x, y][3] > 0 and (x, y) not in visited:
            comp = []
            queue = deque([(x, y)])
            visited.add((x, y))
            while queue:
                cx, cy = queue.popleft()
                comp.append((cx, cy))
                for nx, ny in [(cx+1, cy), (cx-1, cy), (cx, cy+1), (cx, cy-1)]:
                    if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited and pix[nx, ny][3] > 0:
                        visited.add((nx, ny))
                        queue.append((nx, ny))
            components.append(comp)

if components:
    components.sort(key=len, reverse=True)
    main_comp = set(components[0])
    for x in range(w):
        for y in range(h):
            if (x, y) not in main_comp:
                pix[x, y] = (0, 0, 0, 0)

bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)

img.save('assets/stickers/y2k-strat-guitar.png', 'PNG')
print('Cleaned y2k-strat-guitar.png successfully!')
