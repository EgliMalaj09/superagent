"""Fit a parametric grade (black crush, highlight roll-off, teal split-tone,
chroma) so that the outfit video's tone/colour statistics match the reference,
then write it as a 33^3 .cube LUT."""
import numpy as np, subprocess, os

def frames(f, W=180, H=320, step=4):
    p = subprocess.run(["tools/ffmpeg", "-v", "error", "-i", os.path.expanduser(f), "-vf", f"select=not(mod(n\\,{step})),scale={W}:{H}",
                        "-vsync", "0", "-pix_fmt", "rgb24", "-f", "rawvideo", "-"], capture_output=True).stdout
    return np.frombuffer(p, np.uint8).reshape(-1, 3).astype(float) / 255

A = frames("~/Desktop/api-keys/outfits/video_test/final_outfit_swap.mp4")
R = frames("~/Downloads/662abc9f-d5b9-52ff-843f-ca4fdaa7eecc.mp4")

def luma(x): return 0.2126 * x[:, 0] + 0.7152 * x[:, 1] + 0.0722 * x[:, 2]
def stats(x):
    Y = luma(x); out = [np.percentile(Y, 2), np.percentile(Y, 50), np.percentile(Y, 98)]
    for lo, hi in ((0, .25), (.25, .65), (.65, 1.01)):
        m = (Y >= lo) & (Y < hi); c = x[m].mean(0); out += [c[2] - c[0], c[1] - c[0]]
    return np.array(out)

def grade(x, p):
    bk, wt, top, gam, sh_b, sh_g, md_b, md_g, hi_b, hi_g, chroma = p
    Y = luma(x)
    C = x - Y[:, None]                                   # chroma
    y = np.clip((Y - bk) / (wt - bk), 0, 1) ** gam       # crush blacks, set white point
    y = top * (1 - (1 - y) ** 1.6) / (1 - 0) if False else top * y / (1 + (top - 1) * y ** 2)  # soft roll-off to `top`
    w_sh = np.clip(1 - y / 0.3, 0, 1); w_hi = np.clip((y - 0.6) / 0.3, 0, 1); w_md = 1 - w_sh - w_hi
    tint = np.stack([np.zeros_like(y),
                     sh_g * w_sh + md_g * w_md + hi_g * w_hi,
                     sh_b * w_sh + md_b * w_md + hi_b * w_hi], 1)
    tint -= (0.2126 * tint[:, 0] + 0.7152 * tint[:, 1] + 0.0722 * tint[:, 2])[:, None]  # keep luma
    out = y[:, None] + C * chroma + tint * (0.25 + 0.75 * np.sqrt(np.clip(y, 0, 1)))[:, None]
    return np.clip(out, 0, 1)

target = stats(R)
# content-neutral target for colour: use the reference's B-R / G-R offsets minus the source's own cast
p = np.array([0.03, 0.97, 0.86, 1.05, 0.05, 0.04, 0.10, 0.09, 0.02, 0.01, 0.85])
w = np.array([3, 2, 3, 1, 1, 2, 2, 1, 1, 0.0])  # weights per stat (last unused)
def loss(p):
    s = stats(grade(A, p)); return np.sum(w[: len(s)] * (s - target) ** 2)
step = np.array([0.01, 0.01, 0.01, 0.03, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.03])
best = loss(p)
for it in range(60):
    improved = False
    for i in range(len(p)):
        for d in (+1, -1):
            q = p.copy(); q[i] += d * step[i]
            q[10] = np.clip(q[10], 0.6, 1.1)
            l = loss(q)
            if l < best: best, p, improved = l, q, True
    if not improved: step *= 0.5
    if step.max() < 1e-3: break
np.set_printoptions(precision=3, suppress=True)
print("params", p)
print("target ", target)
print("graded ", stats(grade(A, p)))
print("source ", stats(A))

n = 33; g = np.linspace(0, 1, n)
b, gg, r = np.meshgrid(g, g, g, indexing="ij")  # .cube: R fastest
rgb = np.stack([r.ravel(), gg.ravel(), b.ravel()], 1)
out = grade(rgb, p)
with open("build/fit/look.cube", "w") as f:
    f.write("TITLE \"outfit_ref_look\"\nLUT_3D_SIZE 33\n")
    for v in out: f.write(f"{v[0]:.6f} {v[1]:.6f} {v[2]:.6f}\n")
np.save("build/fit/look_params.npy", p)
