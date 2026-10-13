import subprocess, sys
FF = sys.argv[1]
SRC = "/Users/eglimalaj/Desktop/finished-editing.mp4"
DUR = 36.6
W = 0.22  # whoosh envelope peaks ~0.22s in, so start it that far before the cut
cuts = [1.47, 6.63, 11.5, 16.67, 20.43, 21.8, 25.17, 33.8, 35.0]
events = [("hook-boom", 0.0, 2.2), ("whoosh", 0.0, 2.0)]
events += [("whoosh", c - W, 2.2) for c in cuts]
# pops when on-screen text lands; closer (35.05 "Ruaje") gets no sting per the skill's closer rule
pops = [1.9, 6.70, 11.55, 16.75, 20.50, 22.25, 33.90]
events += [("card-pop", t, 4.0) for t in pops]

args = [FF, "-v", "error", "-y", "-t", str(DUR), "-i", SRC]
for name, _, _ in events:
    args += ["-i", f"../sfx/{name}.wav"]
fc = [f"[0:a]aresample=48000,afade=t=out:st={DUR-0.15}:d=0.15[orig]"]
labels = ["[orig]"]
for i, (_, t, v) in enumerate(events, start=1):
    ms = int(round(t * 1000))
    fc.append(f"[{i}:a]volume={v},adelay={ms}|{ms}[e{i}]")
    labels.append(f"[e{i}]")
fc.append("".join(labels) + f"amix=inputs={len(labels)}:duration=first:normalize=0,alimiter=limit=0.89:level=disabled[out]")
args += ["-filter_complex", ";".join(fc), "-map", "[out]", "-c:a", "pcm_s16le", "audio.wav"]
subprocess.run(args, check=True)
