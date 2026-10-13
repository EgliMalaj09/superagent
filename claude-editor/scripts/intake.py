"""Step 1: copy a raw clip into a new job folder and record its format.

usage: python3 scripts/intake.py <clip> <job-name> [--format long|vertical|explainer]
The original clip is copied, never moved or modified.
"""
import argparse
import re
import shutil

from common import JOBS, die, media_info, save_json

ap = argparse.ArgumentParser()
ap.add_argument("clip")
ap.add_argument("name")
ap.add_argument("--format", choices=["long", "vertical", "explainer"])
args = ap.parse_args()

src = __import__("pathlib").Path(args.clip).expanduser()
if not src.exists():
    die(f"clip not found: {src}")
slug = re.sub(r"[^a-z0-9]+", "-", args.name.lower()).strip("-")
d = JOBS / slug
if d.exists():
    die(f"job '{slug}' already exists; pick another name or resume it")
for sub in ("raw", "transcript", "out"):
    (d / sub).mkdir(parents=True)

dst = d / "raw" / f"raw{src.suffix.lower()}"
shutil.copy2(src, dst)
info = media_info(dst)

fmt = args.format or ("vertical" if info["orientation"] == "vertical" else "long")
job = {
    "name": slug,
    "source": str(src),
    "raw": str(dst.relative_to(d)),
    "format": fmt,
    **info,
    "steps": {"intake": "done"},
}
save_json(d / "job.json", job)
print(f"job: jobs/{slug}")
for k in ("width", "height", "orientation", "fps", "duration", "audio_channels", "format"):
    print(f"  {k}: {job[k]}")
