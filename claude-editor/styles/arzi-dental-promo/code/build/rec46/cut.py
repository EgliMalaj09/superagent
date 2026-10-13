import subprocess, glob, os
F = "../tools/ffmpeg"
A = os.path.expanduser("~/Downloads/Woman_hiding_her_smile_20261004152548.mp4")
B = glob.glob(os.path.expanduser("~/Downloads/Woman_having_lunch_at_caf*20261004152556.mp4"))[0]
SLOW = 1.2   # 0.83x speed
G = ("scale=1080:1920:flags=lanczos,unsharp=5:5:0.5:5:5:0,"
     "curves=master='0/0 0.22/0.20 0.6/0.6 0.88/0.85 1/0.95',eq=saturation=1.0:contrast=1.04,"
     "colorbalance=rm=0.03:gm=0.01:bm=-0.03:rh=0.02:bh=-0.02,vignette=angle=0.55,"
     "noise=c0s=7:c0f=t+u,format=yuv420p")
segs = [(B, 0.55, 1.70), (A, 4.80, 6.00), (B, 2.00, 3.40)]
args = [F, "-v", "error", "-y"]
fc = []
for i, (src, a, b) in enumerate(segs):
    args += ["-ss", str(a), "-t", str(b - a), "-i", src]
    fc.append(f"[{i}:v]setpts={SLOW}*(PTS-STARTPTS),minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:vsbmc=1,{G},settb=1/30[s{i}]")
d = [(b - a) * SLOW for _, a, b in segs]
X = 0.2
off1 = d[0] - X
off2 = d[0] + d[1] - 2 * X
fc.append(f"[s0][s1]xfade=transition=fade:duration={X}:offset={off1:.3f}[x1]")
fc.append(f"[x1][s2]xfade=transition=fade:duration={X}:offset={off2:.3f},trim=end_frame=123[v]")
subprocess.run(args + ["-filter_complex", ";".join(fc), "-map", "[v]", "-an", "-c:v", "libx264", "-crf", "14",
                       "-preset", "slow", "-g", "6", "rec46/s2b.mp4"], check=True)
print("total", round(sum(d) - 2 * X, 2), "cuts at", round(off1, 2), round(off2, 2))
