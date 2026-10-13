"""Step 2b: render the approved cut list into out/cut.mp4, frame-accurate, and verify it.

usage: python3 scripts/build_cut.py <job>
Reads transcript/cuts.json: {"segments": [{"start": s, "end": s, "text": "..."}]} (raw-clip seconds,
already padded). Snaps every boundary to the footage's frame grid, renders in one encode, then checks
the frame count and duration against the list. Writes out/cut_map.json for captions.
"""
import json
import math
import sys
from fractions import Fraction

from common import load_job, media_info, run, save_json, die

d, job = load_job(sys.argv[1])
cuts = json.loads((d / "transcript" / "cuts.json").read_text())["segments"]
if not cuts:
    die("cuts.json has no segments")
fps = Fraction(job["fps"])
total_frames_raw = math.floor(job["duration"] * fps)

segs, prev_end = [], -1
for c in cuts:
    sf = max(0, round(c["start"] * fps))
    ef = min(total_frames_raw, round(c["end"] * fps))
    if sf < prev_end:
        die(f"segments overlap or are out of order near {c['start']}s")
    if ef <= sf:
        die(f"empty segment at {c['start']}s")
    segs.append((sf, ef, c.get("text", "")))
    prev_end = ef

parts, labels, cut_map, offset = [], [], [], 0
for i, (sf, ef, text) in enumerate(segs):
    s, e = float(sf / fps), float(ef / fps)
    parts.append(f"[0:v]trim=start_frame={sf}:end_frame={ef},setpts=PTS-STARTPTS[v{i}]")
    parts.append(f"[0:a]atrim=start={s:.6f}:end={e:.6f},asetpts=PTS-STARTPTS[a{i}]")
    labels.append(f"[v{i}][a{i}]")
    cut_map.append({"raw_start": s, "raw_end": e, "cut_start": float(offset / fps),
                    "frames": ef - sf, "text": text})
    offset += ef - sf
graph = ";".join(parts) + ";" + "".join(labels) + f"concat=n={len(segs)}:v=1:a=1[v][a]"

out = d / "out" / "cut.mp4"
(d / "out" / "cut_filter.txt").write_text(graph)
run(["ffmpeg", "-y", "-v", "error", "-i", str(d / job["raw"]),
     "-/filter_complex", str(d / "out" / "cut_filter.txt"),
     "-map", "[v]", "-map", "[a]", "-fps_mode", "passthrough",
     "-c:v", "libx264", "-preset", "medium", "-crf", "16", "-pix_fmt", "yuv420p",
     "-c:a", "aac", "-b:a", "320k", "-movflags", "+faststart", str(out)])

# Verify against the list.
counted = run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-count_frames",
               "-show_entries", "stream=nb_read_frames", "-of", "csv=p=0", str(out)], capture=True)
got = int(counted.strip().split(",")[0])
want = offset
dur = media_info(out)["duration"]
save_json(d / "out" / "cut_map.json", {"fps": job["fps"], "segments": cut_map})
ok = abs(got - want) <= 1
print(f"segments: {len(segs)}  frames: {got} (expected {want})  duration: {dur:.2f}s "
      f"(raw {job['duration']:.2f}s, removed {job['duration'] - dur:.2f}s)")
print("CHECK PASS" if ok else "CHECK FAIL: frame count does not match the cut list")
job["steps"]["cut"] = "done" if ok else "check-failed"
save_json(d / "job.json", job)
sys.exit(0 if ok else 1)
