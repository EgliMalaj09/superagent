#!/usr/bin/env python3
"""Scene 5: run the prompts from PROMPTS.md verbatim. Usage: run.py 5A|5B|5C|5D"""
import json, os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
GEN = os.path.join(ROOT, "..", "day7", "gen.py")
OMNI, LISTEN = (os.path.join(ROOT, "ep1v2", f) for f in ("omni2.py", "listen.py"))
blocks = re.findall(r"```\n(.*?)\n```", open(os.path.join(HERE, "PROMPTS.md")).read(), re.S)
P = dict(zip(["5A", "5B", "5C", "5D"], blocks))
CLIPS = os.path.join(HERE, "clips")
SHOTS = {"5A": ("keys/5A.png", 4, None), "5B": ("keys/5B.png", 5, "Një vit martesë. Një milion euro. Pastaj je e lirë."),
         "5C": ("keys/5C.png", 3, "Dhe çfarë kërkon nga unë?"),
         "5D": ("keys/5D.png", 6, "Të jetosh në shtëpinë time. Të sillesh si gruaja ime. Dhe të mos bësh pyetje.")}

def qa(mp4, line):
    """Albanian/silence check. Re-asks the listener (not Omni) when its answer is unusable, so a good take is never re-rendered."""
    wav = mp4.replace(".mp4", ".wav")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", mp4, "-vn", "-ac", "1", "-ar", "24000", wav], check=True)
    r = None
    for _ in range(3):
        out = subprocess.run([sys.executable, LISTEN, wav] + (["--expect", line] if line else []), capture_output=True, text=True).stdout
        try: r = json.loads(out[out.index("{"):out.rindex("}") + 1]); break
        except ValueError: continue
    os.remove(wav)
    if r is None: return False, "listener gave no usable answer"
    said = (r.get("transcript") or "").strip()
    if said.lower().startswith("listen carefully"): said = ""   # listener echoed its own instructions = no speech
    if line: ok = r.get("all_albanian") and r.get("matches_expected") and not r.get("music")
    else: ok = not said and not r.get("music")
    return bool(ok), r

def split(src, which, line, dur, key):
    P[which] = (P[src].replace("one continuous 5-second shot", f"one continuous {dur}-second shot")
                .replace(", with short pauses between the three sentences,", ",")
                .replace('"Një vit martesë. Një milion euro. Pastaj je e lirë."', '"' + line + '"'))
    SHOTS[which] = (key, dur, line)

split("5B", "5B1", "Një vit martesë. Një milion euro.", 4, "keys/5B.png")
split("5B", "5B2", "Pastaj je e lirë.", 3, "keys/5B2.png")

def main(which):
    key, dur, line = SHOTS[which]
    pf = os.path.join(CLIPS, f"{which}_omni_prompt.txt"); open(pf, "w").write(P[which])
    for t in range(3):
        out = os.path.join(CLIPS, f"{which}_t{t}.mp4")
        r = subprocess.run([sys.executable, OMNI, pf, out, "--image", os.path.join(HERE, key), "--aspect", "9:16",
                            "--duration", f"{dur}s", "--resolution", "1080p"], capture_output=True, text=True)
        if not os.path.exists(out):
            print(which, f"try{t} FAILED", (r.stdout + r.stderr)[-250:], flush=True); continue
        ok, rep = qa(out, line)
        print(which, f"try{t}", "PASS" if ok else "FAIL", json.dumps(rep, ensure_ascii=False)[:300], flush=True)
        if ok: os.replace(out, os.path.join(CLIPS, which + ".mp4")); return

if __name__ == "__main__":
    main(sys.argv[1])
