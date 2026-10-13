#!/usr/bin/env python3
"""Animate keyframes with Omni (Albanian speech, dialogue-only audio) and QA each clip with Gemini.

Usage: make_clips.py [shot_id ...]   (re-runs only the given shots; otherwise skips clips that already passed QA)
"""
import json, os, subprocess, sys
from shots import SHOTS, V_ADR, V_ELI

HERE = os.path.dirname(os.path.abspath(__file__))
OMNI = os.path.join(HERE, "omni2.py")
LISTEN = os.path.join(HERE, "listen.py")
CLIPS = os.path.join(HERE, "clips"); os.makedirs(CLIPS, exist_ok=True)
QA_FILE = os.path.join(HERE, "qa.json")
RES = os.environ.get("RES", "1080p")
MAX_TRIES = int(os.environ.get("TRIES", "4"))

qa = json.load(open(QA_FILE)) if os.path.exists(QA_FILE) else {}

def prompt(s, variant):
    name = {"A": "The man (Adriani)", "E": "The woman (Elira)"}
    head = (f"Animate this exact image as one continuous {s['dur']}-second shot from a realistic Albanian television "
            "drama. Keep every face, the clothing, the set and the lighting identical to the image.")
    if s["speaker"]:
        voice = V_ADR if s["speaker"] == "A" else V_ELI
        other = "The other person stays silent." if len(s["who"]) > 1 else ""
        body = (f"\nACTION: {s['action']}\nDIALOGUE — spoken in the Albanian language only, native Albanian pronunciation, "
                f"lips in sync: {name[s['speaker']]} says exactly: \"{s['line']}\"\n"
                f"These are the only words spoken in the whole shot. No English. {other}\n"
                f"VOICE: {voice}.\nCAMERA: {s['cam']}.\n"
                "AUDIO: only a clean close-mic recording of that one Albanian line. No music, no score, no ambience, "
                "no room noise, no sound effects. Silence before and after the line.")
        if s.get("offscreen"):
            body = (f"\nACTION: {s['action']}\nThe woman on screen does not speak. Off-screen (not visible), the man "
                    f"(Adriani) says exactly, in the Albanian language only, native Albanian pronunciation: \"{s['line']}\"\n"
                    "These are the only words spoken in the whole shot. No English.\n"
                    f"VOICE: {voice}.\nCAMERA: {s['cam']}.\n"
                    "AUDIO: only a clean recording of that one Albanian line. No music, no score, no ambience, "
                    "no room noise, no sound effects. Silence before and after the line.")
        if variant:  # softer phrasing for retries after a policy block
            body = body.replace(f"ACTION: {s['action']}", "ACTION: A quiet, serious conversation at a desk.")
    else:
        sound = s.get("sfx", "complete silence")
        body = (f"\nACTION: {s['action']}\nNobody speaks. No dialogue, no voices.\nCAMERA: {s['cam']}.\n"
                f"AUDIO: {sound}. No music, no score, no voices, no other sounds.")
    return head + body

def check(path, s):
    wav = path.replace(".mp4", ".wav")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", path, "-vn", "-ac", "1", "-ar", "24000", wav], check=True)
    args = [sys.executable, LISTEN, wav] + (["--expect", s["line"]] if s["line"] else [])
    out = subprocess.run(args, capture_output=True, text=True).stdout
    try:
        r = json.loads(out[out.index("{"):out.rindex("}") + 1])
    except ValueError:
        return False, {"raw": out[:300]}
    if s["line"]:
        ok = bool(r.get("all_albanian")) and bool(r.get("matches_expected")) and not r.get("music")
    else:
        ok = not (r.get("transcript") or "").strip() and not r.get("music")
    return ok, r

want = sys.argv[1:]
for s in SHOTS:
    sid = s["id"]
    if want and sid not in want:
        continue
    if not want and qa.get(sid, {}).get("ok"):
        continue
    key = os.path.join(HERE, "keys", sid + ".png")
    best = None
    for t in range(MAX_TRIES):
        pf = os.path.join(CLIPS, f"{sid}_prompt.txt")
        open(pf, "w").write(prompt(s, variant=t >= 2))
        out = os.path.join(CLIPS, f"{sid}_t{t}.mp4")
        r = subprocess.run([sys.executable, OMNI, pf, out, "--image", key, "--aspect", "9:16",
                            "--duration", f"{s['dur']}s", "--resolution", RES], capture_output=True, text=True)
        msg = (r.stdout + r.stderr).strip().splitlines()[-1:] or [""]
        if not os.path.exists(out):
            print(sid, f"try{t}", "FAILED:", msg[0][:200], flush=True)
            continue
        ok, rep = check(out, s)
        print(sid, f"try{t}", "PASS" if ok else "FAIL", json.dumps(rep, ensure_ascii=False)[:300], flush=True)
        if ok:
            best = out; break
    if best:
        os.replace(best, os.path.join(CLIPS, sid + ".mp4"))
    # re-read before writing: another make_clips run may be updating qa.json in parallel
    qa = json.load(open(QA_FILE)) if os.path.exists(QA_FILE) else {}
    qa[sid] = {"ok": True, "report": rep} if best else {"ok": False}
    json.dump(qa, open(QA_FILE, "w"), ensure_ascii=False, indent=1)
print("SUMMARY", {k: v["ok"] for k, v in qa.items()})
