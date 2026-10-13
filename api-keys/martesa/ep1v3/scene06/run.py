#!/usr/bin/env python3
"""Scene 6: run prompts from PROMPTS.md (sections '## id'). Usage: run.py key_6A|key_6B|key_6C|6A..6F"""
import json, os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
GEN = os.path.join(ROOT, "..", "day7", "gen.py")
OMNI, LISTEN = (os.path.join(ROOT, "ep1v2", f) for f in ("omni2.py", "listen.py"))
P = dict(re.findall(r"## (\S+)\n```\n(.*?)\n```", open(os.path.join(HERE, "PROMPTS.md")).read(), re.S))
CLIPS, KEYS = os.path.join(HERE, "clips"), os.path.join(HERE, "keys")
SHEET = lambda c: os.path.join(ROOT, "characters", c, f"{c.upper()}_character_sheet.png")
KEYGEN = {"key_6A": ("6A.png", [SHEET("elira")]), "key_6B": ("6B.png", [os.path.join(KEYS, "_5C_last.png")]),
          "key_6C": ("6C.png", [os.path.join(KEYS, "_5D_last.png"), SHEET("adriani")])}
SHOTS = {"6A": ("6A.png", 3, None), "6B": ("6B.png", 5, "Pse është shkruar që nuk mund të hyj në katin e tretë?"),
         "6C": ("6C.png", 4, "Sepse ajo pjesë e shtëpisë nuk të përket ty."), "6D": ("6D.png", 3, None),
         "6E": ("6E.png", 3, "Çfarë fsheh atje?"), "6F": ("6C.png", 3, "Firmos ose largohu.")}

def qa(mp4, line):
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
    if said.lower().startswith("listen carefully"): said = ""
    ok = (r.get("all_albanian") and r.get("matches_expected") and not r.get("music")) if line else (not said and not r.get("music"))
    return bool(ok), r

def main(which):
    if which in KEYGEN:
        out, refs = KEYGEN[which]
        pf = os.path.join(KEYS, which + "_prompt.txt"); open(pf, "w").write(P[which])
        r = subprocess.run([sys.executable, GEN, pf, os.path.join(KEYS, out), "--aspect", "9:16", "--ref", *refs], capture_output=True, text=True)
        print(which, (r.stdout + r.stderr).strip().splitlines()[-1:], flush=True); return
    key, dur, line = SHOTS[which]
    pf = os.path.join(CLIPS, f"{which}_omni_prompt.txt"); open(pf, "w").write(P[which])
    for t in range(3):
        out = os.path.join(CLIPS, f"{which}_t{t}.mp4")
        r = subprocess.run([sys.executable, OMNI, pf, out, "--image", os.path.join(KEYS, key), "--aspect", "9:16",
                            "--duration", f"{dur}s", "--resolution", "1080p"], capture_output=True, text=True)
        if not os.path.exists(out):
            print(which, f"try{t} FAILED", (r.stdout + r.stderr)[-200:], flush=True)
            if "content_blocked" in r.stdout + r.stderr: return
            continue
        ok, rep = qa(out, line)
        print(which, f"try{t}", "PASS" if ok else "FAIL", json.dumps(rep, ensure_ascii=False)[:300], flush=True)
        if ok: os.replace(out, os.path.join(CLIPS, which + ".mp4")); return

if __name__ == "__main__":
    for w in sys.argv[1:]: main(w)
