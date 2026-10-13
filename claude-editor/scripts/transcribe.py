"""Step 2a: transcribe the raw clip once with whisper.cpp (word timestamps, Metal GPU).

usage: python3 scripts/transcribe.py <job> [--lang sq|en] [--force]
Uses the Homebrew `whisper-cli` and the large-v3-turbo model (multilingual, handles Albanian).
Writes transcript/words.json and transcript/transcript.txt. Skips if already done.
"""
import argparse
import json
import sys
from pathlib import Path

from common import die, load_job, run, save_json

MODEL = Path.home() / ".cache/hyperframes/whisper/models/ggml-large-v3-turbo.bin"

ap = argparse.ArgumentParser()
ap.add_argument("job")
ap.add_argument("--lang", default="auto", help="language code, e.g. en or sq; auto-detect by default")
ap.add_argument("--force", action="store_true")
args = ap.parse_args()

d, job = load_job(args.job)
out = d / "transcript" / "words.json"
if out.exists() and not args.force:
    print(f"already transcribed: {out}")
    sys.exit(0)
if not MODEL.exists():
    die(f"model missing: {MODEL}")

wav = d / "transcript" / "audio16k.wav"
base = d / "transcript" / "whisper"
run(["ffmpeg", "-y", "-v", "error", "-i", str(d / job["raw"]), "-vn", "-ac", "1", "-ar", "16000", str(wav)])
# -ml 1 gives one token per entry, with its own timestamps; -ojf includes the detected language.
run(["whisper-cli", "-m", str(MODEL), "-f", str(wav), "-l", args.lang,
     "-ml", "1", "-ojf", "-of", str(base), "-np"], capture=True)
data = json.loads(Path(f"{base}.json").read_text())

# Tokens without a leading space (punctuation, word pieces) belong to the previous word.
words = []
for t in data["transcription"]:
    text = t["text"]
    s, e = t["offsets"]["from"] / 1000, t["offsets"]["to"] / 1000
    if not text.strip() or text.strip().startswith("["):
        continue
    if words and not text.startswith(" "):
        words[-1]["word"] += text.strip()
        words[-1]["end"] = max(words[-1]["end"], e) if text.strip().isalnum() else words[-1]["end"]
    else:
        words.append({"word": text.strip(), "start": round(s, 3), "end": round(e, 3)})

lang = data.get("result", {}).get("language", args.lang)
save_json(out, {"language": lang, "words": words})

# Readable transcript: one line per sentence-ish chunk, with raw-clip times.
lines, cur = [], []
for w in words:
    cur.append(w)
    if w["word"][-1:] in ".?!" or len(cur) >= 18:
        lines.append(f"[{cur[0]['start']:7.2f} - {cur[-1]['end']:7.2f}] " + " ".join(x["word"] for x in cur))
        cur = []
if cur:
    lines.append(f"[{cur[0]['start']:7.2f} - {cur[-1]['end']:7.2f}] " + " ".join(x["word"] for x in cur))
(d / "transcript" / "transcript.txt").write_text("\n".join(lines) + "\n")

wav.unlink()
Path(f"{base}.json").unlink()
job["language"] = lang
job["steps"]["transcribe"] = "done"
save_json(d / "job.json", job)
print(f"{len(words)} words, language={lang} -> {out}")
