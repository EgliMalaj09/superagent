"""Shared helpers for the pipeline scripts (stdlib only)."""
import json
import subprocess
import sys
from fractions import Fraction
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
JOBS = ROOT / "jobs"


def die(msg):
    print(f"ERROR: {msg}", file=sys.stderr)
    sys.exit(1)


def run(cmd, capture=False):
    r = subprocess.run(cmd, capture_output=capture, text=True)
    if r.returncode != 0:
        if capture:
            print(r.stderr[-3000:], file=sys.stderr)
        die(f"command failed: {' '.join(map(str, cmd[:6]))} ...")
    return r.stdout if capture else None


def ffprobe(path):
    out = run(["ffprobe", "-v", "error", "-print_format", "json",
               "-show_streams", "-show_format", str(path)], capture=True)
    return json.loads(out)


def media_info(path):
    p = ffprobe(path)
    v = next((s for s in p["streams"] if s["codec_type"] == "video"), None)
    a = next((s for s in p["streams"] if s["codec_type"] == "audio"), None)
    if not v:
        die(f"no video stream in {path}")
    w, h = int(v["width"]), int(v["height"])
    rot = 0
    for sd in v.get("side_data_list", []):
        if "rotation" in sd:
            rot = abs(int(sd["rotation"])) % 180
    if rot == 90:
        w, h = h, w
    fps = Fraction(v.get("avg_frame_rate") or v["r_frame_rate"])
    if fps == 0:
        fps = Fraction(v["r_frame_rate"])
    return {
        "width": w,
        "height": h,
        "orientation": "vertical" if h > w else "landscape",
        "fps": f"{fps.numerator}/{fps.denominator}",
        "fps_float": round(float(fps), 3),
        "duration": float(p["format"]["duration"]),
        "audio_channels": int(a["channels"]) if a else 0,
    }


def job_dir(name):
    d = JOBS / name
    if not (d / "job.json").exists():
        die(f"no job '{name}' in {JOBS}")
    return d


def load_job(name):
    d = job_dir(name)
    return d, json.loads((d / "job.json").read_text())


def save_json(path, data):
    Path(path).write_text(json.dumps(data, indent=2, ensure_ascii=False))
