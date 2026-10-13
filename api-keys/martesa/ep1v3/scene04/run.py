#!/usr/bin/env python3
"""Scene 4: run the APPROVED prompts from PROMPTS.md verbatim. Usage: run.py key|4A|4B"""
import json, os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
GEN = os.path.join(ROOT, "..", "day7", "gen.py")
OMNI, LISTEN = (os.path.join(ROOT, "ep1v2", f) for f in ("omni2.py", "listen.py"))
blocks = re.findall(r"```\n(.*?)\n```", open(os.path.join(HERE, "PROMPTS.md")).read(), re.S)
P = dict(zip(["4A_key", "4A", "4B"], blocks))
CLIPS = os.path.join(HERE, "clips")
SHOTS = {"4A": ("keys/4A.png", 4, "Nga i di ti këto?"), "4B": ("keys/4B.png", 3, None)}

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

def main(which):
    if which == "key":
        pf = os.path.join(HERE, "keys", "4A_prompt.txt"); open(pf, "w").write(P["4A_key"].replace("; image 3 = a previous shot of her at this same window (match the window, rain, city lights and light)", ""))
        subprocess.run([sys.executable, GEN, pf, os.path.join(HERE, "keys", "4A.png"), "--aspect", "9:16", "--ref",
                        os.path.join(ROOT, "characters", "elira", "ELIRA_character_sheet.png"),
                        os.path.join(ROOT, "characters", "elira", "refs", "elira_face_anchor.png")]); return
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
