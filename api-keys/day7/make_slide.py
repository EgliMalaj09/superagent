#!/usr/bin/env python3
"""Build a carousel slide/scene in the locked style with character/location sheets as references.

Usage:
  python3 make_slide.py SCENE_FILE OUT.png --chars name=path ... [--loc path] [--aspect 3:4]
The scene file is the shot description. The prompt actually sent is saved as OUT.prompt.txt.
"""
import argparse, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
MODEL = "gemini-3.1-flash-image"
STYLE_REFS = [os.path.join(HERE, "references", f"{n}.jpg") for n in (4, 22, 1)]

p = argparse.ArgumentParser()
p.add_argument("scene_file")
p.add_argument("out")
p.add_argument("--chars", nargs="*", default=[], help="name=path to character sheet")
p.add_argument("--loc", default=None)
p.add_argument("--aspect", default="3:4")
a = p.parse_args()

t = open(os.path.join(HERE, "style-blocks.md")).read()
loc_block = t.split("## LOCATION BLOCK")[1].strip()

refs, legend = list(STYLE_REFS), [f"Images 1-{len(STYLE_REFS)}: STYLE REFERENCES ONLY - copy their rendering technique exactly (a real photograph posterized into flat colour areas with engraved crosshatching and heavy grain); do not copy their subjects or composition."]
for c in a.chars:
    name, path = c.split("=", 1)
    refs.append(path)
    legend.append(f"Image {len(refs)}: character sheet of {name} - keep face, hair, build and costume exactly as shown; ignore the sheet's backdrop and panel layout.")
if a.loc:
    refs.append(a.loc)
    legend.append(f"Image {len(refs)}: the location - keep its architecture and landscape; ignore any border or flag in it.")

prompt = "\n".join(legend) + "\n\nSingle full-frame image, one continuous scene (not a sheet, not panels).\n\n" \
    + open(a.scene_file).read().strip() + "\n\n" + loc_block
prompt_path = os.path.splitext(a.out)[0] + ".prompt.txt"
open(prompt_path, "w").write(prompt)
sys.exit(subprocess.call([sys.executable, os.path.join(HERE, "gen.py"), prompt_path, a.out,
                          "--model", MODEL, "--aspect", a.aspect, "--ref", *refs]))
