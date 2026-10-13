"""Step 5: captions as an .srt on the CUT timeline, ready for CapCut (Captions > Import captions).

usage: python3 scripts/captions.py <job> [--words N]
Words come from transcript/words.json, re-timed through out/cut_map.json; only kept words appear.
Default chunk size: 3 words for vertical, 6 for landscape. Breaks early at punctuation or pauses.
"""
import argparse
import json

from common import load_job, save_json

ap = argparse.ArgumentParser()
ap.add_argument("job")
ap.add_argument("--words", type=int)
args = ap.parse_args()

d, job = load_job(args.job)
words = json.loads((d / "transcript" / "words.json").read_text())["words"]
cut_map = json.loads((d / "out" / "cut_map.json").read_text())["segments"]
max_words = args.words or (3 if job["orientation"] == "vertical" or job["format"] != "long" else 6)

placed = []
for seg in cut_map:
    for w in words:
        mid = (w["start"] + w["end"]) / 2
        if seg["raw_start"] <= mid < seg["raw_end"]:
            s = seg["cut_start"] + max(w["start"], seg["raw_start"]) - seg["raw_start"]
            e = seg["cut_start"] + min(w["end"], seg["raw_end"]) - seg["raw_start"]
            placed.append({"word": w["word"], "start": s, "end": e})

chunks, cur = [], []
for i, w in enumerate(placed):
    cur.append(w)
    nxt = placed[i + 1] if i + 1 < len(placed) else None
    pause = nxt and nxt["start"] - w["end"] > 0.35
    if len(cur) >= max_words or w["word"][-1:] in ".?!,;:" or pause or not nxt:
        chunks.append(cur)
        cur = []


def ts(t):
    ms = max(0, round(t * 1000))
    return f"{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02},{ms % 1000:03}"


lines = []
for n, c in enumerate(chunks, 1):
    start = c[0]["start"]
    end = c[-1]["end"]
    if n < len(chunks):  # hold until the next caption if the gap is short, so captions don't flicker
        gap = chunks[n][0]["start"] - end
        end = chunks[n][0]["start"] if gap < 0.5 else end + 0.2
    text = " ".join(w["word"] for w in c).strip(" ,;:")
    lines.append(f"{n}\n{ts(start)} --> {ts(end)}\n{text}\n")

out = d / "out" / "captions.srt"
out.write_text("\n".join(lines))
job["steps"]["captions"] = "done"
save_json(d / "job.json", job)
print(f"{len(chunks)} captions ({max_words} words max) -> {out}")
