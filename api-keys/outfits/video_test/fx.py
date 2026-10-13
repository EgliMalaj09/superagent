#!/usr/bin/env python3
"""Edited version: zoom punch on cuts, flash + RGB split on set changes, light grain, vignette, gentle grade.
Reads final_outfit_swap.mp4, writes raw 1080x1920 RGB frames to stdout."""
import subprocess, sys, os, numpy as np
from PIL import Image

SRC, W, H, FPS = "final_outfit_swap.mp4", 1080, 1920, 24
CUTS = [2.417, 4.042, 4.625, 6.125, 7.583, 8.333, 9.458, 10.042, 10.542, 11.25, 11.625]
SET = [4.625, 9.458]          # outfit colour changes (white->burgundy happens at the 9.458 cut)
rng = np.random.default_rng(1)

yy, xx = np.mgrid[0:H, 0:W]
vig = 1 - 0.28 * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) ** 1.4
vig = np.clip(vig, 0.6, 1)[..., None].astype(np.float32)

dec = subprocess.Popen(["ffmpeg", "-v", "error", "-i", SRC, "-vf", f"scale={W}:{H}:flags=lanczos+accurate_rnd+full_chroma_int", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
out = sys.stdout.buffer
i = 0
while True:
    buf = dec.stdout.read(W * H * 3)
    if len(buf) < W * H * 3: break
    t = i / FPS
    im = Image.frombuffer("RGB", (W, H), buf)
    # zoom punch: 1.07 -> 1.0 ease-out over 0.3s after each cut
    z = 1.0
    for c in CUTS:
        d = t - c
        if 0 <= d < 0.3:
            z = max(z, 1 + 0.07 * (1 - d / 0.3) ** 2)
    if z > 1.001:
        cw, ch = W / z, H / z
        im = im.crop(((W - cw) / 2, (H - ch) / 2, (W + cw) / 2, (H + ch) / 2)).resize((W, H), Image.BICUBIC)
    a = np.asarray(im).astype(np.float32)
    # set change: RGB split for 3 frames + white flash decaying over 0.2s
    for c in SET:
        d = t - c
        if -1 / FPS <= d < 3 / FPS:
            s = 14
            a[..., 0] = np.roll(a[..., 0], s, axis=1); a[..., 2] = np.roll(a[..., 2], -s, axis=1)
        if 0 <= d < 0.2:
            k = 0.75 * (1 - d / 0.2) ** 2
            a = a * (1 - k) + 255 * k
    # gentle grade: slight contrast, lifted blacks, warm mids
    a = (a / 255.0)
    a = np.clip((a - 0.5) * 1.08 + 0.5, 0, 1) * 0.96 + 0.025
    a[..., 0] *= 1.02; a[..., 2] *= 0.98
    a = a * vig
    if os.environ.get('GRAIN', '1') == '1':
        a += rng.normal(0, 0.018, (H, W, 1)).astype(np.float32)   # film grain
    out.write((np.clip(a, 0, 1) * 255).astype(np.uint8).tobytes())
    i += 1
dec.wait()
