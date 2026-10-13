#!/usr/bin/env python3
"""Generate master blocking plate + shot keyframes. Usage: make_keys.py [master|s01|s02 ...]"""
import os, subprocess, sys
from spec import *

GEN = os.path.join(ROOT, "..", "day7", "gen.py")
KEYS = os.path.join(HERE, "keys"); os.makedirs(KEYS, exist_ok=True)
MASTER_PNG = os.path.join(KEYS, "master.png")
NAME = {"A": "ADRIANI", "E": "ELIRA"}

def gen(prompt, out, refs):
    pf = out.replace(".png", "_prompt.txt"); open(pf, "w").write(prompt)
    r = subprocess.run([sys.executable, GEN, pf, out, "--aspect", "9:16", "--ref", *refs], capture_output=True, text=True)
    print(os.path.basename(out), (r.stdout + r.stderr).strip().splitlines()[-1:], flush=True)

want = sys.argv[1:] or ["master"] + [s["id"] for s in SHOTS]
if "master" in want:
    note = ("Reference image 1 = ADRIANI character sheet, reference image 2 = ELIRA character sheet (keep these exact "
            "faces, hair and outfits). Reference image 3 = the office set (match desk, green lamp, windows, mood).")
    gen(f"{LOOK}\n{note}\n{SET}\n{BLOCK}\n{ADR}\n{ELI}\nSHOT: {MASTER['frame']}", MASTER_PNG, MASTER["refs"])
for s in SHOTS:
    if s["id"] not in want: continue
    who = s["who"]
    note = (f"Reference image 1 = {NAME[who[0]]} character sheet, reference image 2 = {NAME[who[1]]} character sheet "
            "(keep exact faces, hair, outfits). Reference image 3 = the MASTER BLOCKING frame of this scene: match "
            "its set, lighting and EXACTLY who sits on which side of the desk and of the frame.")
    if len(s["refs"]) > 2:
        note = note.replace("Reference image 3 = the MASTER", "Reference image 3 = extra face reference of ELIRA. Reference image 4 = the MASTER")
    if len(s["refs"]) > 2:
        note = note.replace("Reference image 3 = the MASTER", "Reference image 3 = extra face reference of ELIRA. Reference image 4 = the MASTER")
    gen(f"{LOOK}\n{note}\n{SET}\n{BLOCK}\n{ADR}\n{ELI}\nSHOT: {s['frame']}",
        os.path.join(KEYS, s["id"] + ".png"), s["refs"] + [MASTER_PNG])
