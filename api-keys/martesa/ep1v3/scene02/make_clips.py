#!/usr/bin/env python3
"""Animate scene keyframes with Omni: Albanian dialogue ONLY + diegetic SFX, no music. QA every take with Gemini.
Usage: make_clips.py [s01 s02 ...]   env: TRIES (default 4), RES (default 1080p)"""
import json, os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
from spec import *

TOOLS = os.path.join(ROOT, "ep1v2")
OMNI, LISTEN = os.path.join(TOOLS, "omni2.py"), os.path.join(TOOLS, "listen.py")
CLIPS = os.path.join(HERE, "clips"); os.makedirs(CLIPS, exist_ok=True)
RES, TRIES = os.environ.get("RES", "1080p"), int(os.environ.get("TRIES", "4"))
NAME = {"A": "The man (Adriani)", "E": "The woman (Elira)"}

def prompt(s, soft=False):
    voice = V_ADR if s["speaker"] == "A" else V_ELI
    action = "A quiet, serious conversation across a desk." if soft else s["action"]
    return (f"Animate this exact image as one continuous {s['dur']}-second shot from a realistic Albanian television drama. "
            "Keep every face, the clothing, the set, the lighting and the positions of both people identical to the image: "
            "nobody changes sides, the camera does not cross to the other side.\n"
            f"ACTION: {action}\n"
            + (f"DIALOGUE — Albanian language ONLY, native Albanian pronunciation. The woman on screen does NOT speak, her lips stay closed. "
               f"Off-screen, from across the room (not visible, slightly distant, natural room acoustics), the man (Adriani) says exactly: \"{s['line']}\"\n"
               if s.get("offscreen") else
               f"DIALOGUE — Albanian language ONLY, native Albanian pronunciation, lips in sync. {NAME[s['speaker']]} says exactly: "
               f"\"{s['line']}\"\n")
            + "These are the ONLY words spoken in the whole shot. The other person stays silent. "
            "No English, no Italian, no other language, no extra words, no background voices.\n"
            f"VOICE: {voice}.\n"
            f"CAMERA: {s['cam']}.\n"
            f"SOUND EFFECTS (realistic, natural level, under the dialogue): {s['sfx']}.\n"
            "NO music, NO score, NO soundtrack.")

def qa(path, s):
    wav = path.replace(".mp4", ".wav")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", path, "-vn", "-ac", "1", "-ar", "24000", wav], check=True)
    out = subprocess.run([sys.executable, LISTEN, wav, "--expect", s["line"]], capture_output=True, text=True).stdout
    try: r = json.loads(out[out.index("{"):out.rindex("}") + 1])
    except ValueError: return False, {"raw": out[:300]}
    return bool(r.get("all_albanian")) and bool(r.get("matches_expected")) and not r.get("music"), r

def run(s):
    sid, log = s["id"], []
    key = os.path.join(HERE, "keys", sid + ".png")
    for t in range(TRIES):
        pf = os.path.join(CLIPS, f"{sid}_omni_prompt.txt" if t < 2 else f"{sid}_omni_prompt_soft.txt")
        open(pf, "w").write(prompt(s, soft=t >= 2))
        out = os.path.join(CLIPS, f"{sid}_t{t}.mp4")
        r = subprocess.run([sys.executable, OMNI, pf, out, "--image", key, "--aspect", "9:16",
                            "--duration", f"{s['dur']}s", "--resolution", RES], capture_output=True, text=True)
        if not os.path.exists(out):
            print(sid, f"try{t} FAILED", ((r.stdout + r.stderr).strip().splitlines() or [""])[-1][:250], flush=True); continue
        ok, rep = qa(out, s)
        print(sid, f"try{t}", "PASS" if ok else "FAIL", json.dumps(rep, ensure_ascii=False)[:350], flush=True)
        if ok:
            os.replace(out, os.path.join(CLIPS, sid + ".mp4")); return sid, True
    return sid, False

def main():
    want = sys.argv[1:] or [s["id"] for s in SHOTS]
    with ThreadPoolExecutor(2) as ex:
        print("SUMMARY", dict(ex.map(run, [s for s in SHOTS if s["id"] in want])))

if __name__ == "__main__":
    main()
