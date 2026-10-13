#!/usr/bin/env python3
"""Generate shot keyframes for this scene. Usage: make_keys.py [s01 s02 ...]"""
import os, subprocess, sys
from spec import *

GEN = os.path.join(ROOT, "..", "day7", "gen.py")
KEYS = os.path.join(HERE, "keys"); os.makedirs(KEYS, exist_ok=True)

def main():
    want = sys.argv[1:] or [s["id"] for s in SHOTS]
    for s in SHOTS:
        if s["id"] not in want: continue
        note = "Reference images: " + "; ".join(f"image {i+1} = {d}" for i, (_, d) in enumerate(s["refs"])) + "."
        out = os.path.join(KEYS, s["id"] + ".png"); pf = out.replace(".png", "_prompt.txt")
        open(pf, "w").write(f"{LOOK}\n{note}\n{SET}\n{BLOCK}\n{WINDOW}\n{ADR}\n{ELI}\nSHOT: {s['frame']}")
        r = subprocess.run([sys.executable, GEN, pf, out, "--aspect", "9:16", "--ref", *[p for p, _ in s["refs"]]],
                           capture_output=True, text=True)
        print(s["id"], (r.stdout + r.stderr).strip().splitlines()[-1:], flush=True)

if __name__ == "__main__":
    main()
