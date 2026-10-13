#!/usr/bin/env python3
"""Generate the master set frame + per-shot keyframes. Usage: make_keys.py [shot_id ...]"""
import os, subprocess, sys
from shots import LOOK, SET, ADR, ELI, TEXT_RULE, SHOTS

HERE = os.path.dirname(os.path.abspath(__file__))
GEN = os.path.join(HERE, "..", "..", "day7", "gen.py")
CHAR = {"A": os.path.join(HERE, "..", "ep1", "adriani.png"), "E": os.path.join(HERE, "..", "ep1", "elira.png")}
KEYS = os.path.join(HERE, "keys"); os.makedirs(KEYS, exist_ok=True)
MASTER = os.path.join(KEYS, "master.png")

def gen(prompt, out, refs):
    pf = out.replace(".png", ".txt"); open(pf, "w").write(prompt)
    r = subprocess.run([sys.executable, GEN, pf, out, "--aspect", "9:16", "--ref", *refs], capture_output=True, text=True)
    print(os.path.basename(out), (r.stdout + r.stderr).strip().splitlines()[-1:])

def refs_note(who, with_master):
    n, notes = 1, []
    for c in who:
        notes.append(f"Reference image {n} is {'ADRIANI' if c == 'A' else 'ELIRA'} — keep this exact face and identity."); n += 1
    if with_master:
        notes.append(f"Reference image {n} is the set — match this exact office, desk, green lamp, windows and lighting.")
    return " ".join(notes)

want = sys.argv[1:]
if not os.path.exists(MASTER) and (not want or "master" in want):
    gen(f"{LOOK}\n{refs_note('AE', False)}\n{SET}\n{ADR}\n{ELI}\n"
        "SHOT: wide establishing two-shot across the desk. Adriani sits behind the desk, calm; Elira sits in a leather "
        "chair across from him, tense. A white contract (heading 'KONTRATË') lies on the desk between them under the "
        f"green lamp. {TEXT_RULE}", MASTER, [CHAR["A"], CHAR["E"]])

for s in SHOTS:
    if want and s["id"] not in want:
        continue
    out = os.path.join(KEYS, s["id"] + ".png")
    if os.path.exists(out) and not want:
        continue
    who = s["who"] or "A"
    chars = "\n".join(x for c, x in (("A", ADR), ("E", ELI)) if c in who)
    gen(f"{LOOK}\n{refs_note(who, True)}\n{SET}\n{chars}\nSHOT: {s['frame']}\n{TEXT_RULE}",
        out, [CHAR[c] for c in who] + [MASTER])
