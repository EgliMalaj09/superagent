"""Lugano–Tirana video: plan/final assembly on the voiceover (38.36 s, 30 fps).
Each slot: (start_f, end_f, src, src_start_s, filter, push, speed). PNG = placeholder card."""
import subprocess, os, sys
H = os.path.expanduser("~"); P = "build/lug/"
T = H + "/Downloads/torino planet/"; J = H + "/Downloads/te reja/"
D = 10; h = D // 2
G = "curves=master='0/0 0.25/0.21 0.6/0.56 0.85/0.78 1/0.9',eq=saturation=1.1:contrast=1.04,colorbalance=rm=0.03:bm=-0.03:rh=0.02:bh=-0.02"
CAM = "crop=1080:1920:0:(ih-1920)/2," + G                       # rotated camera footage (1080x2048)
PHONE = "scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920,unsharp=5:5:0.5:3:3:0.2"
AI = "scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920"
f = lambda s: round(s * 30)
S = [
 (0,        f(4.95),  P + "scene1.mp4", 0, None, True, 1),                           # AI 1  timelapse POV: airport -> boarding -> seatbelt (faceless)
 (f(4.95),  f(7.45),  T + "pritja ne recepsion.mp4", 5.0, CAM, True, 1),            # Con Dental Med Austria a Tirana (the man with the suitcase at reception)
 (f(7.45),  f(9.70),  T + "laboratori.mp4", 0.0, PHONE, True, 1),                    # scopri impianti dentali
 (f(9.70),  f(11.95), T + "laboratori.mp4", 30.6, PHONE, True, 1),                   # e faccette E.max a prezzi competitivi
 (f(11.95), f(14.45), J + "konsulenca.mp4", 37.6, CAM, True, 1),                     # Ti offriamo consulenza a Lugano
 (f(14.45), f(16.55), P + "map_full.mp4", 0, None, False, 2.05),                     # MAP Lugano -> Tirana (150 f move retimed into the slot)
 (f(16.55), f(18.70), P + "clips/v7.mp4", 0.9, AI, True, 1),                         # AI 7  assistant takes the suitcase (faceless)
 (f(18.70), f(20.15), T + "DSCF9517.mp4", 8.0, CAM, True, 1),                        # alla clinica
 (f(20.15), f(22.90), T + "laboratori.mp4", 25.0, PHONE, True, 1),                   # laboratorio interno
 (f(22.90), f(25.75), T + "Teknologjia.MP4", 10.0, CAM, True, 1),                    # trattamenti su misura
 (f(25.75), f(27.65), T + "pamje nga procesi.MP4", 3.5, CAM, True, 1),               # dopo il trattamento
 (f(27.65), f(29.90), J + "radiograma.mp4", 14.0, CAM, True, 1),                      # check-up X-ray ("seguirti anche a Lugano"; Lugano tag added as animation)
 (f(29.90), f(31.70), T + "per rezultatet duke buzeqeshur.mp4", 6.3, PHONE, True, 1),     # Non rimandare il tuo sorriso (mirror only; ends before the mic shot)
 (f(31.70), f(34.15), J + "plan nga klinika.mp4", 0.5, CAM, True, 1),                # busy lobby + logo desk (form animation on top)
 (f(34.15), f(36.60), J + "plan nga klinika.mp4", 15.0, CAM, True, 1),               # patients and staff crossing the lobby
 (f(36.60), f(38.36), P + "endlogo.mp4", 0, None, False, 1),                         # logo
]
OUT = sys.argv[1] if len(sys.argv) > 1 else H + "/Desktop/lugano-plan.mp4"
args = ["tools/ffmpeg", "-v", "error", "-y"]; fc = []; n = len(S)
for i, (a, b, src, ss, flt, push, spd) in enumerate(S):
    pre = 0 if i == 0 else h; post = 0 if i == n - 1 else h
    L = b - a + pre + post
    still = src.endswith(".png"); own = still or src.startswith(P)
    t0 = ss if own else max(0, ss - pre / 30 * spd)
    padstart = pre if own else 0
    args += (["-loop", "1", "-t", "8", "-i", src] if still else ["-ss", f"{t0:.4f}", "-i", src])
    ch = []
    if spd != 1: ch.append(f"setpts=PTS/{spd}")
    ch.append("fps=30")
    if flt: ch.append(flt)
    ch.append("setpts=PTS-STARTPTS")
    if own: ch.append(f"trim=end_frame={b - a}")
    if padstart: ch.append(f"tpad=start_mode=clone:start={padstart}")
    ch += [f"tpad=stop_mode=clone:stop={L}", f"trim=end_frame={L}"]
    if push: ch.append(f"scale=w='trunc(1080*(1+0.05*n/{L})/2)*2':h=-2:eval=frame:flags=bicubic,crop=1080:1920")
    ch += ["scale=1080:1920:out_range=tv", "setsar=1", "format=yuv420p", "setpts=N/30/TB", "fps=30"]
    fc.append(f"[{i}:v]" + ",".join(ch) + f"[s{i}]")
cur = "s0"
for i in range(1, n):
    fc.append(f"[{cur}][s{i}]xfade=transition=fade:duration={D / 30:.4f}:offset={(S[i][0] - h) / 30:.4f}[x{i}]"); cur = f"x{i}"
args += ["-i", P + "vo_raw.wav", "-filter_complex", ";".join(fc), "-map", f"[{cur}]", "-map", f"{n}:a",
         "-c:v", "libx264", "-crf", "17", "-preset", "medium", "-pix_fmt", "yuv420p", "-r", "30", "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", OUT]
r = subprocess.run(args, capture_output=True, text=True); print(r.stderr[-2500:])
