import subprocess, sys
F = sys.argv[1]; gain = sys.argv[2]; out = sys.argv[3]
ev = [("hook-boom", 0.0, 1.6), ("whoosh", 0.0, 1.2),        # cold open hit
      ("whoosh", 0.45, 1.3), ("whoosh", 0.83, 1.3),          # montage cuts: mouse→dragon, dragon→headphones
      ("whoosh", 1.25, 1.4), ("hook-boom", 1.466, 1.8),      # impact on the cut to the speaker
      ("card-pop", 1.94, 2.6), ("hook-boom", 1.94, 1.2)]     # "5 HAPA" hero
args = [F, "-v", "error", "-y", "-i", "rec6/intro_audio.wav"]
for n, _, _ in ev: args += ["-i", f"../sfx/{n}.wav"]
fc = ["[0:a]aresample=48000,highpass=f=70[v]"]; lab = ["[v]"]
for i, (_, t, v) in enumerate(ev, 1):
    ms = int(t * 1000); fc.append(f"[{i}:a]volume={v},adelay={ms}|{ms}[e{i}]"); lab.append(f"[e{i}]")
fc.append("".join(lab) + f"amix=inputs={len(lab)}:duration=first:normalize=0,volume={gain}dB,alimiter=limit=0.84:level=disabled[m]")
args += ["-filter_complex", ";".join(fc), "-map", "[m]", "-c:a", "pcm_s16le", out]
subprocess.run(args, check=True)
