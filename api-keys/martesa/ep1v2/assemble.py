#!/usr/bin/env python3
"""Assemble the publish-ready episode (run with a Python that has Pillow).

Per clip: strip background (denoise + gate) leaving only the dialogue, trim dead air, level the voice.
Then: one continuous environment bed under the whole episode, timed Albanian subtitles, end card,
1080x1920 H.264, loudness mastered to -14 LUFS.
"""
import glob, json, math, os, re, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
from shots import SHOTS

HERE = os.path.dirname(os.path.abspath(__file__))
B = os.path.join(HERE, "build"); os.makedirs(B, exist_ok=True)
W, H, FPS, SR = 1080, 1920, 24, 48000
FONT = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_I = "/System/Library/Fonts/Supplemental/Arial Bold Italic.ttf"
CLEAN = "highpass=f=80,afftdn=nf=-30,agate=threshold=0.015:ratio=6:attack=3:release=220:range=0.03"
DIALOG_LUFS, AMB_LUFS, FINAL_LUFS = -18.0, -36.0, -14.0
KEEP_TAIL = {"s14", "s15", "s09"}  # action continues after the line / no line
END_CARD = 2.5

def run(cmd, check=True):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if check and r.returncode:
        sys.exit(f"FAILED: {' '.join(cmd)[:300]}\n{r.stderr[-1500:]}")
    return r

def duration(p):
    return float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]).stdout)

def loudness(p):
    r = run(["ffmpeg", "-hide_banner", "-i", p, "-af", "loudnorm=print_format=json", "-f", "null", "-"])
    j = r.stderr[r.stderr.rindex("{"):r.stderr.rindex("}") + 1]
    return json.loads(j)

def speech_bounds(wav, total):
    r = run(["ffmpeg", "-hide_banner", "-i", wav, "-af", "silencedetect=noise=-40dB:d=0.25", "-f", "null", "-"])
    st = [float(x) for x in re.findall(r"silence_start: (-?[\d.]+)", r.stderr)]
    en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", r.stderr)]
    sil = [(s, en[i] if i < len(en) else total) for i, s in enumerate(st)]
    ss, se = 0.0, total
    if sil and sil[0][0] <= 0.05:
        ss = sil[0][1]
    if sil and sil[-1][1] >= total - 0.06:
        se = sil[-1][0]
    return max(0.0, ss), max(ss, se)

# ---------- subtitles ----------
def wrap(d, text, f, maxw):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if d.textlength(t, font=f) <= maxw:
            cur = t
        else:
            lines.append(cur); cur = w
    lines.append(cur)
    return lines

def outlined(d, xy, text, f, fill, ow):
    x, y = xy
    for dx in range(-ow, ow + 1):
        for dy in range(-ow, ow + 1):
            if dx * dx + dy * dy <= ow * ow:
                d.text((x + dx, y + dy), text, font=f, fill=(0, 0, 0, 255))
    d.text((x, y), text, font=f, fill=fill)

def sub_png(path, text):
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    f = ImageFont.truetype(FONT, 58)
    lines = wrap(d, text, f, 940)
    lh = 74
    y = H - 330 - lh * len(lines)
    for ln in lines:
        outlined(d, ((W - d.textlength(ln, font=f)) / 2, y), ln, f, (255, 255, 255, 255), 5); y += lh
    img.save(path)

def msg_png(path):
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    fh, fb = ImageFont.truetype(FONT, 42), ImageFont.truetype(FONT_I, 60)
    lines = ["Ajo i ngjan fiks", "gruas që vrave."]
    top = H // 2 - 150
    d.rounded_rectangle([60, top - 60, W - 60, top + 300], radius=18, fill=(8, 8, 10, 215), outline=(235, 60, 60, 240), width=4)
    d.text(((W - d.textlength("MESAZH I RI", font=fh)) / 2, top), "MESAZH I RI", font=fh, fill=(255, 85, 85, 255))
    y = top + 90
    for ln in lines:
        outlined(d, ((W - d.textlength(ln, font=fb)) / 2, y), ln, fb, (255, 255, 255, 255), 3); y += 82
    img.save(path)

def end_png(path):
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    f1, f2 = ImageFont.truetype(FONT, 84), ImageFont.truetype(FONT, 40)
    t1, t2 = "VAZHDON...", "MARTESA 1 MILION EURO  ·  EPISODI 1"
    d.text(((W - d.textlength(t1, font=f1)) / 2, H // 2 - 80), t1, font=f1, fill=(255, 255, 255, 255))
    d.text(((W - d.textlength(t2, font=f2)) / 2, H // 2 + 40), t2, font=f2, fill=(200, 200, 200, 255))
    img.save(path)

# ---------- per-clip processing ----------
segs, subs, t = [], [], 0.0
for s in SHOTS:
    sid = s["id"]
    clip = os.path.join(HERE, "clips", sid + ".mp4")
    if not os.path.exists(clip):
        sys.exit(f"missing clip {clip}")
    total = duration(clip)
    raw, clean = os.path.join(B, sid + "_raw.wav"), os.path.join(B, sid + "_clean.wav")
    run(["ffmpeg", "-y", "-i", clip, "-vn", "-ac", "1", "-ar", str(SR), raw])
    if s.get("sfx"):  # keep the natural phone buzz; denoising turns it tonal
        run(["ffmpeg", "-y", "-i", raw, "-af", "highpass=f=60", clean])
    elif s["line"]:
        run(["ffmpeg", "-y", "-i", raw, "-af", CLEAN, clean])
    else:
        run(["ffmpeg", "-y", "-i", raw, "-af", "volume=0", clean])
    if s["line"]:
        ss, se = speech_bounds(clean, total)
        start = max(0.0, ss - 0.35) if ss > 0.7 else 0.0
        end = total if sid in KEEP_TAIL else min(total, se + 0.55)
        if end - start < 1.6:
            end = min(total, start + 1.6)
    else:
        ss = se = None; start, end = 0.0, total
    n = int(round((end - start) * FPS)); d = n / FPS
    v, a = os.path.join(B, sid + "_v.mp4"), os.path.join(B, sid + "_a.wav")
    run(["ffmpeg", "-y", "-ss", f"{start:.3f}", "-i", clip, "-an", "-frames:v", str(n),
         "-vf", f"scale={W}:{H}:flags=lanczos,fps={FPS},setsar=1,format=yuv420p",
         "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-r", str(FPS), v])
    gain = 0.0
    if s["line"]:
        gain = DIALOG_LUFS - float(loudness(clean)["input_i"])
    elif s.get("sfx"):
        gain = -26.0 - float(loudness(clean)["input_i"])
    run(["ffmpeg", "-y", "-i", clean, "-af",
         f"atrim=start={start:.3f}:duration={d:.4f},asetpts=PTS-STARTPTS,volume={gain:.2f}dB,apad=whole_dur={d:.4f}",
         "-ar", str(SR), "-ac", "1", a])
    if s["line"]:
        a0 = t + max(0.0, ss - start - 0.10); a1 = t + min(d, se - start + 0.35)
        subs.append((sid, s["line"], round(a0, 2), round(a1, 2)))
    if sid == "s15":
        subs.append(("msg", None, round(t + 1.4, 2), round(t + d, 2)))
    segs.append((sid, v, a, d))
    print(f"{sid}: {start:.2f}-{end:.2f} ({d:.2f}s) speech={ss}-{se} gain={gain:+.1f}dB", flush=True)
    t += d

# end card
ev, ea = os.path.join(B, "end_v.mp4"), os.path.join(B, "end_a.wav")
run(["ffmpeg", "-y", "-f", "lavfi", "-i", f"color=c=black:s={W}x{H}:r={FPS}:d={END_CARD}",
     "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p", ev])
run(["ffmpeg", "-y", "-f", "lavfi", "-i", f"anullsrc=r={SR}:cl=mono", "-t", str(END_CARD), ea])
subs.append(("end", None, round(t, 2), round(t + END_CARD, 2)))
segs.append(("end", ev, ea, END_CARD)); T = t + END_CARD

# concat video + dialogue
open(os.path.join(B, "v.txt"), "w").write("".join(f"file '{x[1]}'\n" for x in segs))
open(os.path.join(B, "a.txt"), "w").write("".join(f"file '{x[2]}'\n" for x in segs))
video, dialog = os.path.join(B, "video.mp4"), os.path.join(B, "dialog.wav")
run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", os.path.join(B, "v.txt"), "-c", "copy", video])
run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", os.path.join(B, "a.txt"), "-ar", str(SR), "-ac", "1", dialog])

# dialogue only (no ambience bed) + two-pass loudness master
mix, master = os.path.join(B, "mix.wav"), os.path.join(B, "master.wav")
run(["ffmpeg", "-y", "-i", dialog, "-af", "pan=stereo|c0=c0|c1=c0", "-ar", str(SR), mix])
m = loudness(mix)
run(["ffmpeg", "-y", "-i", mix, "-af",
     f"loudnorm=I={FINAL_LUFS}:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
     f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true",
     "-ar", str(SR), master])

# subtitle overlays + final encode
pngs = []
for sid, line, a0, a1 in subs:
    p = os.path.join(B, f"sub_{sid}.png")
    if sid == "msg": msg_png(p)
    elif sid == "end": end_png(p)
    else: sub_png(p, line)
    pngs.append((p, a0, a1))
inp = ["-i", video, "-i", master] + sum((["-i", p] for p, _, _ in pngs), [])
fc, cur = [], "[0:v]"
for i, (p, a0, a1) in enumerate(pngs):
    fc.append(f"{cur}[{i + 2}:v]overlay=0:0:enable='between(t,{a0},{a1})'[o{i}]"); cur = f"[o{i}]"
out = os.path.join(HERE, "MARTESA_EP1_FINAL.mp4")
run(["ffmpeg", "-y", *inp, "-filter_complex", ";".join(fc), "-map", cur, "-map", "1:a",
     "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-profile:v", "high", "-pix_fmt", "yuv420p", "-r", str(FPS),
     "-c:a", "aac", "-b:a", "192k", "-ar", str(SR), "-movflags", "+faststart", "-shortest", out])
json.dump(subs, open(os.path.join(B, "timeline.json"), "w"), ensure_ascii=False, indent=1)
print("DONE", out, f"{T:.2f}s")
