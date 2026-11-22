from PIL import Image
from collections import deque

def remove_checkerboard(img):
    # img is RGB
    rgba = img.convert('RGBA')
    w, h = rgba.size
    pixels = rgba.load()
    
    # We want to identify the checkerboard pixels starting from the outer boundary
    # A pixel (r, g, b) is on the checkerboard if:
    # 1. abs(r - g) < 8 and abs(g - b) < 8 and abs(r - b) < 8 (it is neutral gray/white)
    # 2. r > 185 (the checkerboard is either ~200 or ~254, but sticker shadows can be darker)
    
    visited = set()
    queue = deque()
    
    # Push all border pixels
    for x in range(w):
        queue.append((x, 0))
        queue.append((x, h - 1))
    for y in range(h):
        queue.append((0, y))
        queue.append((w - 1, y))
        
    def is_checker(r, g, b):
        diff = max(abs(r - g), abs(g - b), abs(r - b))
        # checkerboard pixels are very neutral gray/white
        if diff <= 8 and r >= 180:
            return True
        return False

    while queue:
        x, y = queue.popleft()
        if (x, y) in visited:
            continue
        visited.add((x, y))
        
        r, g, b, a = pixels[x, y]
        if is_checker(r, g, b):
            pixels[x, y] = (0, 0, 0, 0)
            for nx, ny in [(x+1, y), (x-1, y), (x, y+1), (x, y-1)]:
                if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited:
                    queue.append((nx, ny))
                    
    return rgba

img = Image.open('reference/wishlist_heart_raw.png')
out = remove_checkerboard(img)
out.save('reference/wishlist_heart_test.png')
print('Saved test')
