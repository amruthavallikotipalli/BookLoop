from PIL import Image

img = Image.open('reference/guitar_reference.png')
w, h = img.size

# Check exact phase and period of grid:
# From our printout:
# y in 0..8 is row 0
# y in 9..17 is row 1 (9 px high)
# y in 18..26 is row 2 (9 px high)
# x in 0..8 is col 0 (around 8-9 px wide)
# Let's test difference image between actual image and expected checkerboard

# Let's sample a pure background region, e.g. x in 0..200, y in 0..100
for test_period in [8.5, 8.6, 8.7, 8.8, 8.9, 9.0, 9.1]:
    pass

# Even simpler: A pixel is part of the sticker if:
# 1) It has color (saturation > 10, i.e. max(r,g,b) - min(r,g,b) > 10) -> definite object
# 2) It is dark (r < 185) -> definite object or shadow
# 3) It is within the closed paper border contour surrounding the object!

# Let's find the sticker mask by:
# Foreground seed: all pixels with r < 185 or saturation > 12.
# Then dilate / close by the paper border width (~18-25 pixels) to cover the white border!
# Then mask with non-checkerboard.
print("Checking method...")
