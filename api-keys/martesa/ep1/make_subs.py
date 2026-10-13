#!/usr/bin/env python3
"""Render subtitle overlays as transparent PNGs (720x1280)."""
from PIL import Image, ImageDraw, ImageFont

W, H = 720, 1280
REG = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
ITAL = "/System/Library/Fonts/Supplemental/Arial Bold Italic.ttf"

def font(sz, italic=False):
    return ImageFont.truetype(ITAL if italic else REG, sz)

def wrap_draw(draw, lines, f, cx, top, fill=(255,255,255,255), outline=(0,0,0,255), ow=4, line_gap=12, align="center"):
    y = top
    for ln in lines:
        bb = draw.textbbox((0,0), ln, font=f)
        tw, th = bb[2]-bb[0], bb[3]-bb[1]
        x = cx - tw//2 if align=="center" else cx
        # outline
        for dx in range(-ow, ow+1):
            for dy in range(-ow, ow+1):
                if dx*dx+dy*dy <= ow*ow:
                    draw.text((x+dx, y+dy-bb[1]), ln, font=f, fill=outline)
        draw.text((x, y-bb[1]), ln, font=f, fill=fill)
        y += th + line_gap
    return y

def dialogue(name, lines, sz=40):
    img = Image.new("RGBA",(W,H),(0,0,0,0))
    d = ImageDraw.Draw(img)
    f = font(sz)
    # total height
    heights=[]
    for ln in lines:
        bb=d.textbbox((0,0),ln,font=f); heights.append(bb[3]-bb[1])
    total = sum(heights)+ (len(lines)-1)*12
    top = H - 210 - total  # sit in lower third
    wrap_draw(d, lines, f, W//2, top)
    img.save(name)

def message(name, header, body, sz=38):
    img = Image.new("RGBA",(W,H),(0,0,0,0))
    d = ImageDraw.Draw(img)
    fh = font(28); fb = font(sz, italic=True)
    # dark translucent panel in center
    pad=40
    lines = body
    hb=[d.textbbox((0,0),l,font=fb) for l in lines]
    bodyh = sum(b[3]-b[1] for b in hb)+(len(lines)-1)*14
    hh = d.textbbox((0,0),header,font=fh); headh = hh[3]-hh[1]
    blockh = headh + 30 + bodyh
    top = H//2 - blockh//2
    # panel
    panel_t = top-pad-10; panel_b = top+blockh+pad
    d.rectangle([40, panel_t, W-40, panel_b], fill=(10,10,12,205), outline=(255,60,60,230), width=3)
    # header (red)
    hb0=d.textbbox((0,0),header,font=fh); hw=hb0[2]-hb0[0]
    d.text((W//2-hw//2, top-hb0[1]), header, font=fh, fill=(255,80,80,255))
    wrap_draw(d, lines, fb, W//2, top+headh+30, fill=(255,255,255,255), ow=3)
    img.save(name)

def endcard(name, text, sz=56):
    img = Image.new("RGBA",(W,H),(0,0,0,0))
    d = ImageDraw.Draw(img)
    f = font(sz)
    bb=d.textbbox((0,0),text,font=f); tw=bb[2]-bb[0]; th=bb[3]-bb[1]
    wrap_draw(d,[text],f,W//2, H//2 - th//2)
    img.save(name)

subs = [
  ("s01", ["Një milion euro.","Vetëm që të bëhesh gruaja ime."]),
  ("s02", ["Më fal?!"]),
  ("s03a",["Ti as nuk më njeh!"]),
  ("s03b",["Di që babai yt ka 48 orë","për të shlyer borxhin.","Përndryshe humbisni shtëpinë."]),
  ("s04", ["Nga i di ti këto?"]),
  ("s05a",["Një vit martesë. Një milion euro.","Pastaj je e lirë."]),
  ("s05b",["Dhe çfarë kërkon nga unë?"]),
  ("s06", ["Të jetosh në shtëpinë time.","Të sillesh si gruaja ime.","Dhe të mos bësh pyetje."]),
  ("s07", ["Pse është shkruar që nuk mund","të hyj në katin e tretë?"]),
  ("s08a",["Sepse ajo pjesë e shtëpisë","nuk të përket ty."]),
  ("s08b",["Çfarë fsheh atje?"]),
  ("s08c",["Firmos ose largohu."]),
  ("s09", ["Në rregull. Pranoj."]),
]
for n, lines in subs:
    dialogue(f"sub_{n}.png", lines, sz=42 if len(lines)<3 else 38)

message("sub_msg.png", "MESAZH I RI", ["Ajo i ngjan fiks","gruas që vrave."])
endcard("sub_end.png", "VAZHDON...")
print("rendered", len(subs)+2, "overlays")
