"""Step 3: measured audio polish. Speech to -17 LUFS into a -6 dBFS limiter; mono becomes stereo.

usage: python3 scripts/polish_audio.py <job> [input]   (input defaults to out/cut.mp4)
Two-pass loudnorm (measure, then apply), video stream copied untouched.
Writes out/cut_polished.mp4 and prints the measured result.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

from common import load_job, run, save_json

TARGET_I, TARGET_TP, LIMIT = -17.0, -6.0, 10 ** (-6 / 20)

d, job = load_job(sys.argv[1])
src = Path(sys.argv[2]) if len(sys.argv) > 2 else d / "out" / "cut.mp4"
out = d / "out" / "cut_polished.mp4"

r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(src), "-vn", "-af",
                    f"loudnorm=I={TARGET_I}:TP={TARGET_TP}:LRA=11:print_format=json",
                    "-f", "null", "-"], capture_output=True, text=True)
m = json.loads(re.findall(r"\{[^{}]*\}", r.stderr)[-1])
print(f"before: {m['input_i']} LUFS, peak {m['input_tp']} dBTP")

af = ("pan=stereo|c0=c0|c1=c0," if job.get("audio_channels") == 1 else "") + \
     (f"loudnorm=I={TARGET_I}:TP={TARGET_TP}:LRA=11:"
      f"measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:"
      f"measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,"
      f"alimiter=limit={LIMIT:.4f}:level=disabled,aresample=48000")
run(["ffmpeg", "-y", "-v", "error", "-i", str(src), "-map", "0:v", "-map", "0:a",
     "-c:v", "copy", "-af", af, "-c:a", "aac", "-b:a", "320k", "-movflags", "+faststart", str(out)])

r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(out), "-vn",
                    "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True)
summary = r.stderr[r.stderr.rfind("Summary:"):]
i = float(re.search(r"I:\s+(-?[\d.]+) LUFS", summary).group(1))
pk = float(re.search(r"Peak:\s+(-?[\d.]+) dBFS", summary).group(1))
ok = abs(i - TARGET_I) <= 1.0 and pk <= TARGET_TP + 0.5
print(f"after:  {i} LUFS, true peak {pk} dBFS -> {out.name}")
print("CHECK PASS" if ok else "CHECK FAIL: loudness off target (very short or very dynamic clip?)")
job["steps"]["audio"] = "done" if ok else "check-failed"
save_json(d / "job.json", job)
