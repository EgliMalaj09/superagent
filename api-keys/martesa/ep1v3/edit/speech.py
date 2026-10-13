"""speech.py CLIP... -> speech start/end (s) from a voice-band energy envelope, robust to steady rain."""
import array, math, subprocess, sys
SR, WIN = 16000, 320  # 20 ms
def bounds(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-vn", "-ac", "1", "-ar", str(SR),
                          "-af", "highpass=f=300,lowpass=f=3200", "-f", "s16le", "-"], capture_output=True).stdout
    a = array.array("h", raw)
    db = []
    for i in range(0, len(a) - WIN, WIN):
        s = sum(x * x for x in a[i:i + WIN]) / WIN
        db.append(10 * math.log10(s + 1))
    floor = sorted(db)[int(len(db) * 0.15)]
    peak = sorted(db)[int(len(db) * 0.97)]
    thr = floor + max(6.0, (peak - floor) * 0.45)
    on = [i for i, v in enumerate(db) if v > thr]
    if not on: return None
    # ignore isolated blips: require 3 consecutive frames
    runs, start = [], None
    for i in range(len(db)):
        if db[i] > thr and start is None: start = i
        if (db[i] <= thr or i == len(db) - 1) and start is not None:
            if i - start >= 3: runs.append((start, i))
            start = None
    if not runs: return None
    return round(runs[0][0] * WIN / SR, 2), round(runs[-1][1] * WIN / SR, 2), round(peak - floor, 1)
if __name__ == "__main__":
    for p in sys.argv[1:]: print(p.split("/")[-1], bounds(p))
