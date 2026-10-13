import subprocess
F = "../tools/ffmpeg"
# speech phrases with the long pauses shortened to ~0.25 s of the original room tone
segs = [(0.00, 1.42), (2.02, 3.72), (4.30, 5.32), (5.74, 9.10), (9.70, 13.95)]
fc = []
for i, (a, b) in enumerate(segs):
    fc.append(f"[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS,afade=t=in:d=0.01,afade=t=out:st={b-a-0.01:.3f}:d=0.01[a{i}]")
fc.append("".join(f"[a{i}]" for i in range(len(segs))) + f"concat=n={len(segs)}:v=0:a=1,aresample=48000[a]")
subprocess.run([F, "-v", "error", "-y", "-i", "rec41/source.mp4", "-filter_complex", ";".join(fc), "-map", "[a]",
                "-c:a", "pcm_s24le", "rec41/voice.wav"], check=True)
t = 0
for a, b in segs:
    print(f"orig {a:5.2f}-{b:5.2f} -> new {t:5.2f}-{t+b-a:5.2f}")
    t += b - a
print("total", round(t, 2))
