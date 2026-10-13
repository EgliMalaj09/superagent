#!/usr/bin/env python3
"""snap-beats.py: snapshot every beat moment of a Reel and tile them into one contact sheet (Checkpoint B).

Reads storyboard.json next to public/ (reel-compose.py format): frame 0.3 (the hook), every beat in + 0.5, each pill
item + 0.4, a number's landing, plus any --at extras. Each frame carries Instagram's UI zones in translucent red (top bar,
bottom caption/username, right-side buttons): nothing important may sit under red. The sheet is for review only;
the render never has the guides.

Usage: python3 snap-beats.py --project projects/<p> [--at 12.3 --at 20.0] [--no-guides]
Writes projects/<p>/snaps/at-<t>.png and projects/<p>/snaps/sheet.png (tiled, 360x640 each, 4 across).
"""
import argparse, glob, json, math, os, shutil, subprocess

ap = argparse.ArgumentParser()
ap.add_argument("--project", required=True)
ap.add_argument("--at", action="append", default=[])
ap.add_argument("--no-guides", action="store_true")
args = ap.parse_args()
P = args.project
S = json.load(open(os.path.join(P, "storyboard.json")))
D = float(S["duration"])
moments = [0.3]
for b in S.get("beats", []):
    moments.append(float(b["in"]) + 0.5)
    if b["type"] == "pills":
        moments += [float(it[1]) + 0.4 for it in b.get("items", [])[1:]]
    elif b["type"] == "number":
        moments.append(min(float(b.get("count_at", float(b["in"]) + 0.1)) + float(b.get("count_dur", 1.1)) + 0.1, float(b["out"]) - 0.3))
moments += [float(x) for x in args.at]
moments = sorted(set(round(min(m, D - 0.05), 2) for m in moments))
snapdir = os.path.join(P, "snaps"); os.makedirs(snapdir, exist_ok=True)
pub = os.path.join(P, "public")
env = dict(os.environ, PRODUCER_BROWSER_GPU_MODE="hardware")
# Instagram Reels UI over a 1080x1920 frame (measured on iOS/Android 2025-26 layouts, generous on purpose)
GUIDES = ("drawbox=x=0:y=0:w=1080:h=220:color=red@0.40:t=fill,"
          "drawbox=x=0:y=1480:w=1080:h=440:color=red@0.40:t=fill,"
          "drawbox=x=940:y=880:w=140:h=600:color=red@0.40:t=fill")
outs = []
for t in moments:
    subprocess.run(["npx", "hyperframes", "snapshot", pub, "--at", str(t)], env=env, capture_output=True)
    cands = sorted(glob.glob(os.path.join(pub, "snapshots", "frame-00-at-*.png")))
    if not cands:
        print("no snapshot at", t); continue
    dst = os.path.join(snapdir, "at-%05.2f.png" % t)
    if args.no_guides:
        shutil.copy(cands[0], dst)
    else:
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", cands[0], "-vf", "scale=1080:1920," + GUIDES, dst], check=True)
    outs.append(dst)
    print("snap", t)
if outs:
    cols = min(4, len(outs)); rows = math.ceil(len(outs) / cols)
    cmd = ["ffmpeg", "-y", "-v", "error"]
    for o in outs: cmd += ["-i", o]
    n = len(outs)
    while n % cols: cmd += ["-i", outs[-1]]; n += 1
    cmd += ["-filter_complex", "".join("[%d]" % i for i in range(n)) + "concat=n=%d:v=1:a=0,scale=360:640,tile=%dx%d:padding=8" % (n, cols, rows),
            "-frames:v", "1", os.path.join(snapdir, "sheet.png")]
    subprocess.run(cmd, check=True)
    print("sheet:", os.path.join(snapdir, "sheet.png"), "(%d frames, %dx%d)" % (len(outs), cols, rows))
