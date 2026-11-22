from PIL import Image

src = r'C:\Users\Amrut\.gemini\antigravity\brain\560e1010-0db4-4a70-9040-e0fccf57345d\.user_uploaded\media_1795360281281_58fe7f82.jpg'
master = Image.open(src).convert('RGBA')

# Crop puffy star: x: 760..975, y: 220..425
star = master.crop((760, 220, 975, 425))
spix = star.load()
sw, sh = star.size
for x in range(sw):
    for y in range(sh):
        r, g, b, a = spix[x, y]
        # remove wireframe grid on the left if present (red grid on black)
        if x < 40 and r > 30 and g < 20 and b < 20:
            spix[x, y] = (0, 0, 0, 0)
        elif r < 12 and g < 12 and b < 12:
            spix[x, y] = (0, 0, 0, 0)
        elif r < 30 and g < 30 and b < 30:
            spix[x, y] = (r, g, b, int((r/30.0)*255))

sbbox = star.getbbox()
if sbbox:
    star = star.crop(sbbox)
star.save('assets/y2k/chrome_puffy_star.png')
print('Puffy chrome star extracted with size:', star.size)

# Download dialog clean up:
dialog = master.crop((170, 362, 340, 452))
dialog.save('assets/y2k/download_dialog.png')
print('Download dialog saved')
