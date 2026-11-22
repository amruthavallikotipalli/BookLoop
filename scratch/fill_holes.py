from PIL import Image
from collections import deque

def fill_hole(path, seed_points):
    img = Image.open(path).convert('RGBA')
    w, h = img.size
    pix = img.load()
    
    for sx, sy in seed_points:
        if sx < 0 or sx >= w or sy < 0 or sy >= h:
            continue
        queue = deque([(sx, sy)])
        visited = set()
        while queue:
            x, y = queue.popleft()
            if (x, y) in visited:
                continue
            visited.add((x, y))
            r, g, b, a = pix[x, y]
            diff = max(abs(r-g), abs(g-b), abs(r-b))
            brightness = (r + g + b) // 3
            if brightness >= 175 and diff <= 12:
                pix[x, y] = (0, 0, 0, 0)
                for nx, ny in [(x+1, y), (x-1, y), (x, y+1), (x, y-1)]:
                    if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited:
                        queue.append((nx, ny))
    img.save(path)
    print(f'Filled inner holes for {path}')

fill_hole('assets/stickers/gear.png', [(150, 140)])
fill_hole('assets/stickers/user.png', [(85, 140)])
