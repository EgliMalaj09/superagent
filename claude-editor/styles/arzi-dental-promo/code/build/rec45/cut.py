import subprocess
F = "../tools/ffmpeg"
SP = 5.28 / 6.7   # playback speed so the edit fills the 6.7 s slot
G = ("curves=master='0/0 0.22/0.20 0.6/0.6 0.88/0.86 1/0.96',eq=saturation=1.04:contrast=1.03,"
     "colorbalance=rm=0.03:gm=0.01:bm=-0.03:rh=0.02:bh=-0.02")
fc = [
  "[0:v]trim=0:0.75,setpts=PTS-STARTPTS[a]",
  "[0:v]trim=1.55:6.08,setpts=PTS-STARTPTS[b]",
  "[a][b]concat=n=2:v=1:a=0[c]",
  f"[c]setpts=PTS/{SP},minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:vsbmc=1,"
  f"scale=1080:1920:flags=lanczos,unsharp=5:5:0.5:5:5:0,{G},format=yuv420p,trim=end_frame=201[v]",
]
subprocess.run([F, "-v", "error", "-y", "-i", "rec45/src.mp4", "-filter_complex", ";".join(fc), "-map", "[v]",
                "-an", "-c:v", "libx264", "-crf", "12", "-preset", "slow", "-g", "6",
                "../remotion/public/rec/s2a.mp4"], check=True)
print("cut at", round(0.75 / SP * 30), "frames")
