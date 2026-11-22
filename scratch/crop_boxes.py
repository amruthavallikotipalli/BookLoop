from PIL import Image

img = Image.open('reference/guitar_reference.png')
w, h = img.size

# The 8 stickers are laid out in 2 rows of 4:
# Row 1 (top):
# 1. House: left ~0..380, top ~40..450
# 2. Books stack: left ~390..780, top ~100..450
# 3. Magnifying glass: left ~790..1120, top ~40..450
# 4. Shopping cart: left ~1120..1520, top ~70..450

# Row 2 (bottom):
# 5. User profile bust: left ~20..420, top ~500..920
# 6. Chrome heart: left ~430..800, top ~540..900
# 7. Bookmark ribbon: left ~820..1120, top ~500..920
# 8. Chrome gear: left ~1140..1520, top ~540..900

boxes = {
    'home_house': (20, 40, 390, 450),
    'books_catalog': (390, 90, 780, 450),
    'search_magnifier': (790, 60, 1130, 450),
    'cart_trolley': (1120, 70, 1520, 450),
    'user_avatar': (30, 520, 420, 910),
    'wishlist_heart': (430, 550, 800, 900),
    'bookmark_ribbon': (830, 500, 1130, 910),
    'gear_settings': (1140, 540, 1520, 900),
}

for name, box in boxes.items():
    cropped = img.crop(box)
    cropped.save(f'reference/{name}_raw.png')
    print(f'Saved {name}_raw.png with size {cropped.size}')
