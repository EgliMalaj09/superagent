#!/usr/bin/env python3
"""Generate the continuous environment bed: night room tone + gentle rain on glass + distant city.

The source frame is just rain on a window (no desk/office cues — those made the model add typing/printer noise).
A take is accepted only if Gemini hears no speech, no music, and describes rain / hum / distant traffic.
"""
import json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
GEN = os.path.join(HERE, "..", "..", "day7", "gen.py")
AMB = os.path.join(HERE, "amb"); os.makedirs(AMB, exist_ok=True)
from shots import LOOK

key = os.path.join(AMB, "rain_window.png")
if not os.path.exists(key):
    pf = key.replace(".png", ".txt")
    open(pf, "w").write(f"{LOOK}\nReference image 1 is the room — match its window and night city view.\n"
                        "SHOT: close view of a tall dark window at night, rain drops running down the glass, the city "
                        "lights far below blurred into soft bokeh. No people, no furniture, nothing else in frame.")
    subprocess.run([sys.executable, GEN, pf, key, "--aspect", "9:16", "--ref", os.path.join(HERE, "keys", "master.png")], check=True)

P = ("Animate this exact image as one continuous 10-second static shot. Rain drops slide down the window glass and "
     "the city lights shimmer softly. Nothing else moves.\n"
     "AUDIO: natural room tone recorded high up inside a quiet, soundproofed tower at night: a soft, low, steady "
     "air-ventilation hum and a very faint, muffled, distant murmur of city traffic far below, heard through thick "
     "glass. Smooth and continuous like gentle wind, no individual sounds at all. The rain is silent behind the glass. "
     "No music, no score, no voices, no footsteps, no typing, no clicks, no ticking, no machines, no sudden sounds.")
pf = os.path.join(AMB, "amb_prompt.txt"); open(pf, "w").write(P)
GOOD = ("hum", "drone", "whoosh", "white noise", "air", "hvac", "ventilation", "rumble", "traffic", "ambient", "ambience", "room tone", "wind", "drizzle", "patter")
BAD = ("typing", "keyboard", "printer", "voice", "speech", "music", "footstep", "thunder", "click", "beep", "tick", "typewriter", "rain")
takes = []
for t in range(5):
    out = os.path.join(AMB, f"tone{t}.mp4")
    if not os.path.exists(out):
        subprocess.run([sys.executable, os.path.join(HERE, "omni2.py"), pf, out, "--image", key,
                        "--duration", "10s", "--resolution", "720p"], capture_output=True, text=True)
    if not os.path.exists(out):
        print("tone", t, "failed", flush=True); continue
    wav = out.replace(".mp4", ".wav")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", out, "-vn", "-ac", "2", "-ar", "48000", wav], check=True)
    rep = subprocess.run([sys.executable, os.path.join(HERE, "listen.py"), wav], capture_output=True, text=True).stdout
    print("tone", t, rep.replace("\n", " ")[:300], flush=True)
    try:
        r = json.loads(rep[rep.index("{"):rep.rindex("}") + 1])
    except ValueError:
        continue
    noise = (r.get("background_noise") or "").lower()
    if (not (r.get("transcript") or "").strip() and not r.get("music")
            and any(g in noise for g in GOOD) and not any(b in noise for b in BAD)):
        takes.append(wav)
    if len(takes) >= 3:
        break
json.dump(takes, open(os.path.join(AMB, "good.json"), "w"))
print("GOOD_TAKES", takes)
