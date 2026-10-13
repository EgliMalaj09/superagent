#!/usr/bin/env python3
"""Scene 2 v2: run the APPROVED prompts from PROMPTS_v2.md verbatim. Usage: run_v2.py key|2A|2B|2C"""
import json, os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
GEN = os.path.join(ROOT, "..", "day7", "gen.py")
OMNI, LISTEN = (os.path.join(ROOT, "ep1v2", f) for f in ("omni2.py", "listen.py"))
blocks = re.findall(r"```\n(.*?)\n```", open(os.path.join(HERE, "PROMPTS_v2.md")).read(), re.S)
P = dict(zip(["2A", "2B", "2C_key", "2C"], blocks))
CLIPS = os.path.join(HERE, "clips")
SHOTS = {"2A": ("keys/s01.png", 4, "Ti as nuk më njeh!"), "2B": ("keys/s02.png", 4, None),
         "2C": ("keys/s03.png", 4, "Di që babai yt ka dyzet e tetë orë.")}

def qa(mp4, line):
    wav = mp4.replace(".mp4", ".wav")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", mp4, "-vn", "-ac", "1", "-ar", "24000", wav], check=True)
    out = subprocess.run([sys.executable, LISTEN, wav] + (["--expect", line] if line else []), capture_output=True, text=True).stdout
    os.remove(wav)
    try: r = json.loads(out[out.index("{"):out.rindex("}") + 1])
    except ValueError: return False, out[:200]
    if line: ok = r.get("all_albanian") and r.get("matches_expected") and not r.get("music")
    else: ok = not (r.get("transcript") or "").strip() and not r.get("music")
    return bool(ok), r

def main(which):
    if which == "key":
        pf = os.path.join(HERE, "keys", "s03_prompt.txt"); open(pf, "w").write(P["2C_key"])
        subprocess.run([sys.executable, GEN, pf, os.path.join(HERE, "keys", "s03.png"), "--aspect", "9:16",
                        "--ref", os.path.join(ROOT, "ep1v3", "scene01", "keys", "s01.png")]); return
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
