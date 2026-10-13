#!/usr/bin/env python3
"""Rough cut of Ep1 v3 (run with /tmp/pilvenv/bin/python — needs Pillow).

Per clip: trim filler (in/out below), match brightness, one shared color grade, keep the clip's own
ambience but level it. Then one continuous music bed (3 Lyria cues crossfaded) ducked under the
dialogue, plain white captions, 1080x1920 H.264, master -14 LUFS.
"""
import json, math, os, re, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from speech import bounds

HERE = os.path.dirname(os.path.abspath(__file__))
EP = os.path.dirname(HERE)
B = os.path.join(HERE, "build"); os.makedirs(B, exist_ok=True)
W, H, FPS, SR = 1080, 1920, 24, 48000
FONT = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"

# clip, in, out, caption (None = no dialogue), look ("office" | "memory" | "villa")
CUT = [
 ("scene01/clips/s01", 0.00, 4.85, "Një milion euro. Vetëm që të bëhesh gruaja ime.", "office"),
 ("scene01/clips/s02", 1.20, 3.00, "Më fal?!", "office"),
 ("scene02/clips/2A",  0.60, 3.75, "Ti as nuk më njeh!", "office"),
 ("scene02/clips/2B",  0.50, 3.00, None, "office"),
 ("scene02/clips/2C",  1.20, 4.03, "Di që babai yt ka dyzet e tetë orë.", "office"),
 ("scene03/clips/3A",  0.90, 2.90, None, "memory"),
 ("scene03/clips/3B1", 0.75, 2.50, "Për të shlyer borxhin.", "office"),
 ("scene03/clips/3B2", 0.40, 2.85, "Përndryshe humbisni shtëpinë.", "office"),
 ("scene04/clips/4A",  1.10, 3.60, "Nga i di ti këto?", "office"),
 ("scene04/clips/4B",  0.60, 3.00, None, "office"),
 ("scene05/clips/5A",  0.30, 3.60, None, "office"),
 ("scene05/clips/5B1", 0.60, 4.03, "Një vit martesë. Një milion euro.", "office"),
 ("scene05/clips/5B2", 0.25, 2.20, "Pastaj je e lirë.", "office"),
 ("scene05/clips/5C",  0.90, 2.90, "Dhe çfarë kërkon nga unë?", "office"),
 ("scene05/clips/5D",  0.80, 6.00, "Të jetosh në shtëpinë time. Të sillesh si gruaja ime. Dhe të mos bësh pyetje.", "office"),
 ("scene06/clips/6A",  0.50, 2.60, None, "office"),
 ("scene06/clips/6B",  1.50, 4.85, "Pse është shkruar që nuk mund të hyj në katin e tretë?", "office"),
 ("scene06/clips/6C",  0.60, 4.03, "Sepse ajo pjesë e shtëpisë nuk të përket ty.", "office"),
 ("scene06/clips/6D",  0.30, 2.80, None, "villa"),
 ("scene06/clips/6E",  0.90, 3.00, "Çfarë fsheh atje?", "office"),
 ("scene06/clips/6F",  0.40, 2.95, "Firmos ose largohu.", "office"),
]

# shared grade: gentle S-contrast, slightly muted color, teal shadows / warm highlights, soft vignette
GRADE = {
 "office": "eq=contrast=1.06:saturation=0.88,colorbalance=rs=-0.03:bs=0.035:rh=0.025:bh=-0.02,vignette=angle=PI/5",
 "memory": "eq=contrast=0.92:saturation=0.80:brightness=0.02,colorbalance=rh=0.04:gh=0.015:bh=-0.04,vignette=angle=PI/4",
 "villa":  "eq=contrast=1.04:saturation=0.85,vignette=angle=PI/4",
}
# local sound fixes, segment-relative seconds: (start, end, dB)
DIPS = {"scene01/clips/s01": [(0.0, 0.6, -9.0)],    # folder slam at the top was too loud
        "scene06/clips/6E": [(0.0, 0.48, -10.0)]}  # chair creak masking "Çfarë fsheh atje?"
EXTRA_AF = {"scene04/clips/4A": "highpass=f=170,"}  # thunder rumble under "Nga i di ti këto?"
TARGET_LUMA = None  # set from the office clips' median
DIALOG_LUFS, AMB_LUFS, MUSIC_LUFS, FINAL_LUFS = -18.5, -30.0, -31.0, -14.0


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: sys.exit(f"FAILED: {' '.join(cmd)[:300]}\n{r.stderr[-1500:]}")
    return r

def lufs(p):
    e = run(["ffmpeg", "-hide_banner", "-i", p, "-af", "loudnorm=print_format=json", "-f", "null", "-"]).stderr
    return float(json.loads(e[e.rindex("{"):e.rindex("}") + 1])["input_i"])

def mean_luma(clip, t):
    p = os.path.join(B, "probe.png")
    run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{t:.2f}", "-i", clip, "-frames:v", "1", "-vf", "scale=270:-1", p])
    g = Image.open(p).convert("L"); h = g.histogram()
    return sum(i * c for i, c in enumerate(h)) / sum(h) / 255.0

# ---------- captions ----------
def cap_png(path, text):
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    f = ImageFont.truetype(FONT, 54)
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if d.textlength(t, font=f) <= 900: cur = t
        else: lines.append(cur); cur = w
    lines.append(cur)
    lh, y = 70, H - 420 - 70 * len(lines)
    for ln in lines:
        x = (W - d.textlength(ln, font=f)) / 2
        d.text((x + 2, y + 3), ln, font=f, fill=(0, 0, 0, 150))  # soft drop shadow only, for legibility
        d.text((x, y), ln, font=f, fill=(255, 255, 255, 255)); y += lh
    img.save(path)

def sentences(text):
    parts = [p.strip() for p in re.split(r"(?<=[.!?])\s+", text) if p.strip()]
    return parts

# ---------- build ----------
lumas = {}
for c, a, b, _, look in CUT:
    lumas[c] = mean_luma(os.path.join(EP, c + ".mp4"), (a + b) / 2)
office = sorted(v for (c, *_r, look) in CUT if look == "office" for v in [lumas[c]])
TARGET_LUMA = office[len(office) // 2]

segs, caps, t = [], [], 0.0
for i, (c, a, b, cap, look) in enumerate(CUT):
    src = os.path.join(EP, c + ".mp4"); sid = f"{i:02d}_{os.path.basename(c)}"
    n = int(round((b - a) * FPS)); d = n / FPS
    m = lumas[c]
    gamma = 1.0 if (look != "office" or m > 0.3) else max(0.9, min(1.15, math.log(max(m, 0.02)) / math.log(TARGET_LUMA)))  # inserts keep their own exposure
    vf = (f"scale={W}:{H}:flags=lanczos,fps={FPS},setsar=1,eq=gamma={gamma:.3f},{GRADE[look]},format=yuv420p")
    v = os.path.join(B, sid + "_v.mp4")
    run(["ffmpeg", "-y", "-ss", f"{a:.3f}", "-i", src, "-an", "-frames:v", str(n), "-vf", vf,
         "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-r", str(FPS), v])
    # audio: keep the clip's own sound, level it, tiny fades at the cut points
    raw = os.path.join(B, sid + "_raw.wav")
    run(["ffmpeg", "-y", "-ss", f"{a:.3f}", "-t", f"{d:.4f}", "-i", src, "-vn", "-ac", "2", "-ar", str(SR), raw])
    gain = (DIALOG_LUFS - lufs(raw)) if cap else min(8.0, AMB_LUFS - lufs(raw))  # never pump quiet ambience/hiss
    au = os.path.join(B, sid + "_a.wav")
    run(["ffmpeg", "-y", "-i", raw, "-af",
         EXTRA_AF.get(c, "") + f"volume={gain:.2f}dB," + "".join(f"volume={db}dB:enable='between(t,{x},{y})'," for x, y, db in DIPS.get(c, [])) + f"afade=t=in:d=0.06,afade=t=out:st={max(0, d - 0.08):.3f}:d=0.08,apad=whole_dur={d:.4f}",
         "-ar", str(SR), "-ac", "2", au])
    if cap:
        sb = bounds(src)
        s0, s1 = (sb[0], sb[1]) if sb else (a, b)
        c0 = t + max(0.0, s0 - a - 0.10); c1 = t + min(d, s1 - a + 0.30)
        parts = sentences(cap)
        if len(parts) > 1 and (c1 - c0) > 2.6:  # long line: one sentence at a time, timed by length
            tot = sum(len(p) for p in parts); x = c0
            for p in parts:
                y = x + (c1 - c0) * len(p) / tot; caps.append((p, round(x, 2), round(y, 2))); x = y
        else:
            caps.append((cap, round(c0, 2), round(c1, 2)))
    segs.append((v, au, d))
    print(f"{sid}: {a:.2f}-{b:.2f} ({d:.2f}s) luma={m:.3f} gamma={gamma:.3f} gain={gain:+.1f}dB", flush=True)
    t += d
T = t

open(os.path.join(B, "v.txt"), "w").write("".join(f"file '{x[0]}'\n" for x in segs))
open(os.path.join(B, "a.txt"), "w").write("".join(f"file '{x[1]}'\n" for x in segs))
video, sound = os.path.join(B, "video.mp4"), os.path.join(B, "clips_audio.wav")
run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", os.path.join(B, "v.txt"), "-c", "copy", video])
run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", os.path.join(B, "a.txt"), "-ar", str(SR), "-ac", "2", sound])

# music: C -> A -> B with 5 s crossfades, one continuous bed for the whole cut
M = os.path.join(HERE, "music")
bed = os.path.join(B, "music_bed.wav")
run(["ffmpeg", "-y", "-i", f"{M}/lyria_C.wav", "-i", f"{M}/lyria_A.wav", "-i", f"{M}/lyria_B.wav", "-filter_complex",
     "[0:a][1:a]acrossfade=d=5:c1=tri:c2=tri[x];[x][2:a]acrossfade=d=5:c1=tri:c2=tri,aresample=48000,aformat=channel_layouts=stereo[m]",
     "-map", "[m]", bed])
mg = MUSIC_LUFS - lufs(bed)
music = os.path.join(B, "music_fit.wav")
run(["ffmpeg", "-y", "-i", bed, "-af",
     f"atrim=0:{T:.3f},volume={mg:.2f}dB,afade=t=in:d=1.5,afade=t=out:st={T - 2.5:.3f}:d=2.5", music])

# mix: music ducks slightly under the clip sound (dialogue), then master
mix, master = os.path.join(B, "mix.wav"), os.path.join(B, "master.wav")
run(["ffmpeg", "-y", "-i", sound, "-i", music, "-filter_complex",
     "[0:a]asplit[s][key];[1:a][key]sidechaincompress=threshold=0.05:ratio=3:attack=40:release=400[duck];"
     "[s][duck]amix=inputs=2:normalize=0[m]", "-map", "[m]", "-ar", str(SR), mix])
e = run(["ffmpeg", "-hide_banner", "-i", mix, "-af", "loudnorm=print_format=json", "-f", "null", "-"]).stderr
j = json.loads(e[e.rindex("{"):e.rindex("}") + 1])
run(["ffmpeg", "-y", "-i", mix, "-af",
     f"loudnorm=I={FINAL_LUFS}:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:"
     f"measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true",
     "-ar", str(SR), master])

# captions + final encode
pngs = []
for k, (text, c0, c1) in enumerate(caps):
    p = os.path.join(B, f"cap_{k:02d}.png"); cap_png(p, text); pngs.append((p, c0, c1))
inp = ["-i", video, "-i", master] + sum((["-i", p] for p, _, _ in pngs), [])
fc, cur = [], "[0:v]"
for k, (p, c0, c1) in enumerate(pngs):
    fc.append(f"{cur}[{k + 2}:v]overlay=0:0:enable='between(t,{c0},{c1})'[o{k}]"); cur = f"[o{k}]"
out = os.path.join(HERE, "EP1_ROUGHCUT_scenes01-06.mp4")
run(["ffmpeg", "-y", *inp, "-filter_complex", ";".join(fc), "-map", cur, "-map", "1:a",
     "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-profile:v", "high", "-pix_fmt", "yuv420p", "-r", str(FPS),
     "-c:a", "aac", "-b:a", "192k", "-ar", str(SR), "-movflags", "+faststart", "-shortest", out])
json.dump({"cut": CUT, "captions": caps, "duration": T}, open(os.path.join(B, "timeline.json"), "w"), ensure_ascii=False, indent=1)
print("DONE", out, f"{T:.2f}s", f"{len(caps)} captions")
