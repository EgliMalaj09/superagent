"""Step 8: final export at locked platform specs, named, with a copy in ~/Downloads.

usage: python3 scripts/export.py <job> <input.mp4> --target long|vertical|vertical4k [--name NAME]
  long       3840x2160, CBR 50 Mb/s (80 at 48-60 fps)   YouTube long-form
  vertical   1080x1920, CBR 14 Mb/s                     Reels / TikTok / Shorts
  vertical4k 2160x3840, CBR 50 Mb/s                     Shorts from 4K
Always AAC 320k, H.264 High, bt709. Input is usually the CapCut export (or out/cut_polished.mp4).
Aspect mismatch is filled by a centre crop, never letterboxed.
"""
import argparse
import shutil
from pathlib import Path

from common import load_job, media_info, run, save_json

SPECS = {"long": (3840, 2160, 50), "vertical": (1080, 1920, 14), "vertical4k": (2160, 3840, 50)}

ap = argparse.ArgumentParser()
ap.add_argument("job")
ap.add_argument("input")
ap.add_argument("--target", required=True, choices=SPECS)
ap.add_argument("--name")
args = ap.parse_args()

d, job = load_job(args.job)
src = Path(args.input).expanduser()
info = media_info(src)
w, h, mbps = SPECS[args.target]
if args.target == "long" and info["fps_float"] >= 47.9:
    mbps = 80

name = args.name or f"{job['name']}-{args.target}"
out = d / "out" / f"{name}.mp4"
vf = (f"scale={w}:{h}:force_original_aspect_ratio=increase:flags=lanczos,crop={w}:{h},"
      f"setsar=1,format=yuv420p")
run(["ffmpeg", "-y", "-v", "error", "-i", str(src), "-vf", vf, "-fps_mode", "passthrough",
     "-c:v", "libx264", "-profile:v", "high", "-preset", "slow",
     "-b:v", f"{mbps}M", "-minrate", f"{mbps}M", "-maxrate", f"{mbps}M", "-bufsize", f"{mbps * 2}M",
     "-x264-params", "nal-hrd=cbr",
     "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
     "-c:a", "aac", "-b:a", "320k", "-ar", "48000", "-movflags", "+faststart", str(out)])

res = media_info(out)
ok = (res["width"], res["height"]) == (w, h) and abs(res["duration"] - info["duration"]) < 0.2
dl = Path.home() / "Downloads" / out.name
shutil.copy2(out, dl)
print(f"{out.name}: {res['width']}x{res['height']} @ {res['fps']} fps, {res['duration']:.2f}s, {mbps} Mb/s CBR")
print(f"copy: {dl}")
print("CHECK PASS" if ok else "CHECK FAIL: size or duration does not match")
job["steps"][f"export-{args.target}"] = "done" if ok else "check-failed"
save_json(d / "job.json", job)
