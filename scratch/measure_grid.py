from PIL import Image

img = Image.open('reference/guitar_reference.png')
# Check top-left 100x100
for y in range(30):
    line = "".join("#" if img.getpixel((x, y))[0] > 230 else "." for x in range(50))
    print(f"{y:02d}: {line}")
