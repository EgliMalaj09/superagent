import sys, os
from PIL import Image, ImageDraw, ImageFont
H = os.path.dirname(os.path.abspath(__file__))
items = [("01_hook","00:00 HOOK · zyra"),("02_window","00:06 DRITARJA"),("03_father","00:12 KUJTIM · babai"),
 ("04_clause","00:30 KUSHTI"),("05_thirdfloor","00:36 KATI I TRETË"),("06_elevator","00:40 IKJA · ashensori"),
 ("07_car_rain","00:44 MAKINA · shiu"),("08_return","00:49 KTHIMI"),("09_sign","00:52 FIRMA"),("10_message","00:56 MESAZHI")]
W, Hh, cols, pad, lab = 360, 640, 5, 16, 44
font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 22)
rows = (len(items)+cols-1)//cols
img = Image.new("RGB", (cols*W+(cols+1)*pad, rows*(Hh+lab)+(rows+1)*pad), (14,14,16))
d = ImageDraw.Draw(img)
for i,(k,t) in enumerate(items):
    x = pad+(i%cols)*(W+pad); y = pad+(i//cols)*(Hh+lab+pad)
    img.paste(Image.open(os.path.join(H,k+".png")).convert("RGB").resize((W,Hh)), (x,y))
    d.text((x+4,y+Hh+10), t, font=font, fill=(225,225,225))
img.save(os.path.join(H,"MOODBOARD_EP1.jpg"), quality=90); print("ok", img.size)
