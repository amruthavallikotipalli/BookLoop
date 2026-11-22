from PIL import Image
from collections import deque

master = Image.open('reference/guitar_reference.png').convert('RGB')
w, h = master.size
pix = master.load()

# Test floodfill on the FULL image starting from (0, 0)
visited = set()
queue = deque([(0, 0), (w-1, 0), (0, h-1), (w-1, h-1)])

is_bg = [[False]*h for _ in range(w)]

# Drop shadow threshold:
# Drop shadow on the reference image has brightness < 170.
# The checkerboard has brightness:
# light square: ~254
# dark square: ~201
# So brightness >= 180 and color diff <= 12 is checkerboard!
while queue:
    x, y = queue.popleft()
    if (x, y) in visited:
        continue
    visited.add((x, y))
    
    r, g, b = pix[x, y]
    diff = max(abs(r-g), abs(g-b), abs(r-b))
    brightness = (r + g + b) // 3
    
    # We only propagate through neutral checkerboard pixels (brightness >= 175, diff <= 10)
    if brightness >= 175 and diff <= 10:
        is_bg[x][y] = True
        for nx, ny in [(x+1, y), (x-1, y), (x, y+1), (x, y-1)]:
            if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited:
                queue.append((nx, ny))

print('Flood fill completed on full master image!')
# Check if (500, 200) (inside books sticker) is marked as bg
print('Is (500, 200) bg?', is_bg[500][200])
# Check if (550, 650) (inside heart sticker) is marked as bg
print('Is (550, 650) bg?', is_bg[550][650])

# Now create full transparent master:
rgba_master = master.convert('RGBA')
r_pix = rgba_master.load()

for x in range(w):
    for y in range(h):
        if is_bg[x][y]:
            r_pix[x, y] = (0, 0, 0, 0)

# Save cropped heart to test
test_heart = rgba_master.crop((420, 530, 810, 915))
test_heart.save('reference/heart_full_flood_test.png')
test_books = rgba_master.crop((380, 80, 800, 455))
test_books.save('reference/books_full_flood_test.png')
print('Saved test crops!')
