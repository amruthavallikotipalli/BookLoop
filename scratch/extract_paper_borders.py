from PIL import Image, ImageFilter
from collections import deque

master = Image.open('reference/guitar_reference.png').convert('RGB')

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

def extract_with_paper_border(raw_crop):
    # raw_crop is RGB
    w, h = raw_crop.size
    pix = raw_crop.load()
    
    # We want to identify the sticker mask.
    # The sticker consists of:
    # 1. Internal graphic (books, heart, etc.)
    # 2. White paper border (bright white ~240-255, surrounding the graphic)
    # 3. Outer dark drop shadow (dark gray / black, surrounding the paper border)
    
    # Outside the drop shadow is ONLY the checkerboard!
    # Let's flood fill from the borders.
    # To prevent leaking into the white paper border:
    # The floodfill MUST NEVER cross the drop shadow!
    # The drop shadow has brightness (r+g+b)/3 < 165!
    # Let's check: is the entire perimeter of the sticker surrounded by shadow?
    # YES! Every single sticker in this reference image has a dark drop shadow cast onto the checkerboard!
    
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
        
        r, g, b = pix[x, y][:3]
        brightness = (r + g + b) // 3
        diff = max(abs(r - g), abs(g - b), abs(r - b))
        
        # Stop at drop shadow! Drop shadow brightness is < 170.
        # Background is checkerboard: brightness >= 180 and diff <= 12.
        # But even if diff is slightly higher (up to 20) due to JPEG/PNG compression artifacts on the checkerboard,
        # AS LONG AS brightness >= 175, it is checkerboard!
        if brightness >= 175 and diff <= 22:
            is_bg[x][y] = True
            for nx, ny in [(x+1, y), (x-1, y), (x, y+1), (x, y-1)]:
                if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited:
                    queue.append((nx, ny))

    rgba = raw_crop.convert('RGBA')
    r_pix = rgba.load()
    for x in range(w):
        for y in range(h):
            if is_bg[x][y]:
                r_pix[x, y] = (0, 0, 0, 0)
                
    # Remove any isolated speckles on the outside
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
        # Only keep component if it's large (> 20% of main)
        for c in components[1:]:
            if len(c) > len(components[0]) * 0.2:
                main_comp.update(c)
        for x in range(w):
            for y in range(h):
                if (x, y) not in main_comp:
                    r_pix[x, y] = (0, 0, 0, 0)
                    
    # Smooth outer drop shadow transparency:
    # Pixels in the outer drop shadow fringe (touching transparent pixels) can have gentle alpha fade
    for x in range(w):
        for y in range(h):
            if r_pix[x, y][3] > 0:
                # check if within 2px of transparent
                r, g, b, _ = r_pix[x, y]
                brightness = (r + g + b) // 3
                # If it's a shadow pixel (r < 170) touching transparent:
                touches_empty = any(0 <= x+dx < w and 0 <= y+dy < h and r_pix[x+dx, y+dy][3] == 0 for dx, dy in [(1,0),(-1,0),(0,1),(0,-1)])
                if touches_empty and brightness > 150:
                    r_pix[x, y] = (0, 0, 0, 0)

    bbox = rgba.getbbox()
    if bbox:
        rgba = rgba.crop(bbox)
    return rgba

for name, x0, y0, x1, y1 in stickers_def:
    cropped = master.crop((x0, y0, x1, y1))
    cleaned = extract_with_paper_border(cropped)
    out_path = f'assets/stickers/{name}.png'
    cleaned.save(out_path, 'PNG')
    print(f'Extracted with paper border: {name} -> {out_path} ({cleaned.size})')

print('Done extracting all 8 stickers with paper borders!')
