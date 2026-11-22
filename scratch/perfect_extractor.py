from PIL import Image, ImageFilter
from collections import deque

def extract_perfect_sticker(raw_img):
    # raw_img is RGB crop
    w, h = raw_img.size
    pix = raw_img.load()
    
    # 1. Identify background using floodfill from edges with a conservative threshold:
    # Any pixel reachable from borders that is either:
    # - light gray (r >= 235 and diff <= 10)
    # - dark gray checker (r in 190..220 and diff <= 10)
    # AND is not blocked by drop shadow (drop shadow has r < 185)
    
    visited = set()
    queue = deque()
    for x in range(w):
        queue.append((x, 0))
        queue.append((x, h - 1))
    for y in range(h):
        queue.append((0, y))
        queue.append((w - 1, y))
        
    is_outer_bg = [[False]*h for _ in range(w)]
    
    while queue:
        x, y = queue.popleft()
        if (x, y) in visited:
            continue
        visited.add((x, y))
        
        r, g, b = pix[x, y][:3]
        diff = max(abs(r - g), abs(g - b), abs(r - b))
        
        # A pixel is background if it is neutral checkerboard (either white square ~250 or gray square ~200)
        # Note: drop shadow is r < 180!
        if diff <= 12 and r >= 185:
            is_outer_bg[x][y] = True
            for nx, ny in [(x+1, y), (x-1, y), (x, y+1), (x, y-1)]:
                if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited:
                    queue.append((nx, ny))
                    
    # The drop shadow itself: between the white paper border and is_outer_bg.
    # Notice: inside is_outer_bg == False, we have:
    # - the drop shadow (r < 185)
    # - the white paper border (r > 240, inside the drop shadow!)
    # - the sticker content!
    # Because the white paper border is INSIDE the drop shadow, the floodfill STOPPED at the drop shadow!
    # It NEVER reaches the white paper border!
    
    # What about the outer drop shadow fringe where r blends into the checkerboard (r > 185)?
    # To get a super clean cutout with the irregular paper border:
    # We can create a mask:
    rgba = raw_img.convert('RGBA')
    r_pix = rgba.load()
    for x in range(w):
        for y in range(h):
            if is_outer_bg[x][y]:
                r_pix[x, y] = (0, 0, 0, 0)
                
    # Now remove any stray pixels outside the main sticker
    # Main sticker is the largest contiguous component
    opaque_visited = set()
    components = []
    for x in range(w):
        for y in range(h):
            if r_pix[x, y][3] > 0 and (x, y) not in opaque_visited:
                comp = []
                cqueue = deque([(x, y)])
                opaque_visited.add((x, y))
                while cqueue:
                    cx, cy = cqueue.popleft()
                    comp.append((cx, cy))
                    for nx, ny in [(cx+1, cy), (cx-1, cy), (cx, cy+1), (cx, cy-1)]:
                        if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in opaque_visited and r_pix[nx, ny][3] > 0:
                            opaque_visited.add((nx, ny))
                            cqueue.append((nx, ny))
                components.append(comp)

    if components:
        components.sort(key=len, reverse=True)
        main_comp = set(components[0])
        for c in components[1:]:
            if len(c) > len(components[0]) * 0.05:
                main_comp.update(c)
        for x in range(w):
            for y in range(h):
                if (x, y) not in main_comp:
                    r_pix[x, y] = (0, 0, 0, 0)

    # Let's clean the outer border fringe:
    # If a pixel has alpha > 0, but is adjacent to alpha == 0 and has r in 190..215 and diff <= 10 (gray checker square), clear it:
    for _ in range(4):
        to_clear = []
        for x in range(w):
            for y in range(h):
                if r_pix[x, y][3] > 0:
                    r, g, b, _ = r_pix[x, y]
                    diff = max(abs(r - g), abs(g - b), abs(r - b))
                    if diff <= 12 and 185 <= r <= 220:
                        # Check if it touches transparency
                        has_trans = any(0 <= x+dx < w and 0 <= y+dy < h and r_pix[x+dx, y+dy][3] == 0 for dx, dy in [(1,0),(-1,0),(0,1),(0,-1)])
                        if has_trans:
                            to_clear.append((x, y))
        for x, y in to_clear:
            r_pix[x, y] = (0, 0, 0, 0)

    bbox = rgba.getbbox()
    if bbox:
        rgba = rgba.crop(bbox)
    return rgba

img = Image.open('reference/wishlist_heart_raw.png')
out = extract_perfect_sticker(img)
out.save('reference/heart_perfect_test.png')
print('Saved heart_perfect_test.png with size', out.size)
