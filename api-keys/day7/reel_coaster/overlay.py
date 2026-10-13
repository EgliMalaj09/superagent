#!/usr/bin/env python3
"""Interactive 'game' overlay for the coaster reel. Writes raw RGBA 1080x1920 @24fps to stdout.
All timings are in seconds and land on the 120 BPM grid of music.py (beat = 0.5s)."""
import math, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H, FPS, DUR = 1080, 1920, 24, 26.9
FONT = "/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf"
f_big = ImageFont.truetype(FONT, 78)
f_huge = ImageFont.truetype(FONT, 230)
f_mid = ImageFont.truetype(FONT, 60)
WHITE, BLACK = (255, 255, 255, 255), (0, 0, 0, 255)
CYAN, GREEN, YELLOW, RED = (40, 220, 230, 235), (60, 230, 90, 235), (255, 214, 0, 255), (240, 40, 40, 255)
LT, RT = (330, 1600), (800, 1600)   # thumb circle centres (over the hands)
RAD = 165
TEXT_Y = 470

# Beat cues: (hit_time, side) — side L = tilt left (cyan, counter-clockwise), R = tilt right (green, clockwise)
CUES = [(10, "R"), (11, "L"), (12, "L"), (13, "L"), (14, "R"), (15, "R"),
        (17, "L"), (17.5, "R"), (18, "L"),
        (20, "R"), (21, "L"), (22, "R"),
        (24.5, "L"), (25, "R")]
WARN = [(15.4, 16.6, "WATCH OUT!", "up"),      # rock arch
        (18.4, 19.4, "DUCK!", "down"),         # tunnel
        (22.6, 24.0, "HOLD ON!", "up")]        # final drop / splash
FALL = 1.0  # seconds a bar takes to fall to the circle


def text(d, xy, s, font, fill=WHITE, stroke=8, anchor="mm"):
    d.text(xy, s, font=font, fill=fill, stroke_width=stroke, stroke_fill=BLACK, anchor=anchor)


def dashed_circle(d, c, r, alpha=200, width=6, n=28):
    for i in range(n):
        if i % 2: continue
        a0, a1 = 360 * i / n, 360 * (i + 1) / n
        d.arc([c[0] - r, c[1] - r, c[0] + r, c[1] + r], a0, a1, fill=(255, 255, 255, alpha), width=width)


def fingerprint(d, c, alpha):
    for k in range(9):
        r = 25 + k * 13
        d.arc([c[0] - r * 0.8, c[1] - r, c[0] + r * 0.8, c[1] + r], 200 + k * 4, 520 - k * 6,
              fill=(255, 255, 255, alpha), width=5)


def rot_arrow(d, c, size, cw, fill):
    r = size
    box = [c[0] - r, c[1] - r, c[0] + r, c[1] + r]
    d.arc(box, 40, 320, fill=fill, width=10)
    ang = math.radians(320 if cw else 40)
    tip = (c[0] + r * math.cos(ang), c[1] + r * math.sin(ang))
    s = 1 if cw else -1
    d.polygon([(tip[0] - 22, tip[1] - 6 * s), (tip[0] + 22, tip[1] - 6 * s), (tip[0], tip[1] + 24 * s)], fill=fill)


def phone(img, c, angle, alpha):
    p = Image.new("RGBA", (200, 320), (0, 0, 0, 0))
    pd = ImageDraw.Draw(p)
    pd.rounded_rectangle([20, 20, 180, 300], 28, outline=(255, 255, 255, alpha), width=10)
    pd.rounded_rectangle([75, 40, 125, 52], 6, fill=(255, 255, 255, alpha))
    p = p.rotate(angle, resample=Image.BICUBIC, expand=True)
    img.alpha_composite(p, (int(c[0] - p.width / 2), int(c[1] - p.height / 2)))


def bar(img, side, y_bottom, glow):
    col = CYAN if side == "L" else GREEN
    x = 90 if side == "L" else W - 90
    bw, bh = 120, 260
    b = Image.new("RGBA", (bw + 80, bh + 80), (0, 0, 0, 0))
    bd = ImageDraw.Draw(b)
    bd.rounded_rectangle([40, 40, 40 + bw, 40 + bh], 26, fill=col)
    rot_arrow(bd, (40 + bw / 2, 40 + bh / 2), 34, side == "R", BLACK)
    if glow:
        g = b.filter(ImageFilter.GaussianBlur(18)); img.alpha_composite(g, (int(x - bw / 2 - 40), int(y_bottom - bh - 40)))
    img.alpha_composite(b, (int(x - bw / 2 - 40), int(y_bottom - bh - 40)))


def big_arrows(d, direction, t):
    pulse = 1 + 0.12 * math.sin(t * 2 * math.pi * 4)
    for x in (130, W - 130):
        w2, h2 = 70 * pulse, 160 * pulse
        y = 900
        d.rounded_rectangle([x - w2, y - h2, x + w2, y + h2], 22, fill=YELLOW, outline=(255, 140, 0, 255), width=8)
        if direction == "up":
            d.polygon([(x, y - 90), (x - 45, y - 10), (x + 45, y - 10)], fill=BLACK)
            d.rectangle([x - 14, y - 15, x + 14, y + 80], fill=BLACK)
        else:
            d.polygon([(x, y + 90), (x - 45, y + 10), (x + 45, y + 10)], fill=BLACK)
            d.rectangle([x - 14, y - 80, x + 14, y + 15], fill=BLACK)


def frame(t):
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # thumb circles (strong at start, faint after)
    a = 230 if t < 2 else 120
    for c in (LT, RT):
        dashed_circle(d, c, RAD, a)
    if t < 2.0:
        for c in (LT, RT):
            fingerprint(d, c, int(200 * (0.6 + 0.4 * math.sin(t * 6))))
        text(d, (W / 2, TEXT_Y), "PLACE YOUR", f_big); text(d, (W / 2, TEXT_Y + 90), "THUMBS HERE", f_big)

    elif t < 6.0:
        beat = (t - 2.0) / 0.5
        ang = 25 * math.sin(math.pi * beat)          # rocks left/right on the beat
        phone(img, (W / 2, TEXT_Y - 170), ang, 240)
        text(d, (W / 2, TEXT_Y + 40), "TURN YOUR PHONE", f_big)
        text(d, (W / 2, TEXT_Y + 130), "FOLLOWING THE BEAT", f_big)

    elif t < 9.0:
        n = 3 - int(t - 6.0)
        k = (t - 6.0) % 1.0
        scale = 1.0 + 0.35 * max(0, 1 - k * 4)
        text(d, (W / 2, TEXT_Y - 40), "GET READY", f_big)
        fnt = ImageFont.truetype(FONT, int(230 * scale))
        text(d, (W / 2, TEXT_Y + 170), str(n), fnt, fill=[RED, YELLOW, GREEN][3 - n], stroke=12)

    elif t < 9.9:
        k = (t - 9.0) / 0.9
        fnt = ImageFont.truetype(FONT, int(200 + 120 * k))
        text(d, (W / 2, TEXT_Y + 60), "GO!", fnt, fill=(255, 255, 255, int(255 * (1 - k))), stroke=12)

    # falling beat bars
    for hit, side in CUES:
        if hit - FALL <= t <= hit + 0.25:
            p = min(1.0, (t - (hit - FALL)) / FALL)
            target = LT[1] - RAD + 40
            y = -40 + (target + 40) * p
            bar(img, side, y, glow=t >= hit)
            if hit <= t <= hit + 0.25:   # hit flash on the circle
                c = LT if side == "L" else RT
                k = (t - hit) / 0.25
                r = RAD + 30 * k
                col = CYAN if side == "L" else GREEN
                d.ellipse([c[0] - r, c[1] - r, c[0] + r, c[1] + r], outline=col[:3] + (int(255 * (1 - k)),), width=14)

    # warnings
    for t0, t1, msg, direction in WARN:
        if t0 <= t <= t1:
            big_arrows(d, direction, t)
            text(d, (W / 2, TEXT_Y), msg, f_big, fill=YELLOW)

    # ending
    if t >= 25.6:
        k = min(1, (t - 25.6) / 0.3)
        fnt = ImageFont.truetype(FONT, int(96 * (0.6 + 0.4 * k)))
        text(d, (W / 2, TEXT_Y), "YOU SURVIVED!", fnt, fill=YELLOW, stroke=10)
        text(d, (W / 2, TEXT_Y + 110), "SEND THIS TO A FRIEND", f_mid)
    return img


out = sys.stdout.buffer
for i in range(int(DUR * FPS)):
    out.write(frame(i / FPS).tobytes())
