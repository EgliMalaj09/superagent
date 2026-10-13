#!/usr/bin/env python3
"""Build a locked-style asset: prefix + description + style block, then generate.

Usage:
  python3 make_asset.py character|location DESCRIPTION_FILE OUT.png [--aspect 16:9]
Prompt actually sent is saved next to OUT as OUT.prompt.txt.
"""
import argparse, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
MODEL = "gemini-3.1-flash-image"
REFS = [os.path.join(HERE, "references", f"{n}.jpg") for n in (4, 6, 22, 25, 1)]

p = argparse.ArgumentParser()
p.add_argument("kind", choices=["character", "location"])
p.add_argument("desc_file")
p.add_argument("out")
p.add_argument("--aspect", default="16:9")
a = p.parse_args()

t = open(os.path.join(HERE, "style-blocks.md")).read()
prefix = t.split("Prefix (top of every prompt):")[1].split("## CHARACTER SHEET BLOCK")[0].strip()
char = t.split("## CHARACTER SHEET BLOCK")[1].split("## LOCATION BLOCK")[0].strip()
loc = t.split("## LOCATION BLOCK")[1].strip()

prompt = f"{prefix}\n\n{open(a.desc_file).read().strip()}\n\n{char if a.kind == 'character' else loc}"
prompt_path = os.path.splitext(a.out)[0] + ".prompt.txt"
open(prompt_path, "w").write(prompt)
sys.exit(subprocess.call([sys.executable, os.path.join(HERE, "gen.py"), prompt_path, a.out,
                          "--model", MODEL, "--aspect", a.aspect, "--ref", *REFS]))
