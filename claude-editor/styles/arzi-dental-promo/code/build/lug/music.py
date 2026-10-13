"""Lugano–Tirana video — rhythmic score (from the video 1 groove) (original, synthesized). 120 BPM, D major.
Light groove under the doctor hook (0-12 s), full beat with the b-roll, a lift
from 25 s, a short break into the map (39.9 s), a final hit + ring-out on the
logo. Ducked under the voice with a sidechain follower, plus kick pumping."""
import numpy as np, wave

SR = 48000
DUR = 38.36
N = int(SR * DUR)
rng = np.random.default_rng(7)
L = np.zeros(N); R = np.zeros(N)

BPM = 120; B = 60 / BPM; BAR = 4 * B  # 2.0 s bars, downbeat at 0
def t_(d): return np.arange(int(d * SR)) / SR
def hz(n): return 440 * 2 ** ((n - 69) / 12)

def put(sig, at, gain=1.0, pan=0.0):
    i = int(round(at * SR))
    if i < 0: sig = sig[-i:]; i = 0
    j = min(N, i + len(sig))
    if j <= i: return
    s = sig[: j - i] * gain
    L[i:j] += s * np.sqrt(0.5 * (1 - pan)); R[i:j] += s * np.sqrt(0.5 * (1 + pan))

def fft_filter(x, lo=None, hi=None):
    n = 1 << int(np.ceil(np.log2(len(x) + 1)))
    X = np.fft.rfft(x, n); f = np.fft.rfftfreq(n, 1 / SR)
    m = np.ones_like(f)
    if lo: m *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1e-3)) ** 4)
    if hi: m *= 1 / np.sqrt(1 + (f / hi) ** 4)
    return np.fft.irfft(X * m, n)[: len(x)]

# ---------------- instruments ----------------
def kick(v=1.0):
    t = t_(0.32); f = 46 + 110 * np.exp(-t / 0.03)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.13)
    click = rng.standard_normal(len(t)) * np.exp(-t / 0.002) * 0.25
    return np.tanh(1.6 * (body + click)) * v

NOISE = rng.standard_normal(SR)
def clap(v=1.0):
    t = t_(0.25); n = fft_filter(NOISE[: len(t)], lo=900, hi=6000)
    env = np.zeros_like(t)
    for d in (0.0, 0.011, 0.022): env += np.exp(-np.maximum(t - d, 0) / 0.006) * (t >= d)
    env += 0.5 * np.exp(-np.maximum(t - 0.03, 0) / 0.07) * (t >= 0.03)
    return n * env * v * 0.8

HAT = fft_filter(rng.standard_normal(int(0.4 * SR)), lo=7000)
def hat(v=1.0, open_=False):
    d = 0.22 if open_ else 0.045; t = t_(d)
    return HAT[: len(t)] * np.exp(-t / (0.07 if open_ else 0.012)) * v

def bass(n, d, v=1.0):
    t = t_(d); f = hz(n)
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.12 * np.sign(np.sin(2 * np.pi * f * t))
    env = np.minimum(1, t / 0.005) * np.exp(-t / 0.35) * np.clip((d - t) / 0.02, 0, 1)
    return np.tanh(1.3 * s) * env * v

def pluck(n, v=1.0):
    t = t_(0.5); f = hz(n)
    s = sum(a * np.sin(2 * np.pi * f * h * t) * np.exp(-t * (7 + 5 * h)) for h, a in ((1, 1.0), (2, 0.5), (3, 0.3), (4, 0.15), (5, 0.08)))
    return s * np.minimum(1, t / 0.002) * v

PAD_CACHE = {}
def pad(notes, d, v=1.0):
    t = t_(d); s = np.zeros_like(t)
    for n in notes:
        for det in (-0.08, 0.0, 0.08):
            ph = rng.uniform(0, 2 * np.pi)
            s += sum(np.sin(2 * np.pi * hz(n + det) * h * t + ph) / h for h in range(1, 5))
    s = fft_filter(s, hi=1800)
    env = np.minimum(1, t / 0.4) * np.clip((d - t) / 0.4, 0, 1)
    return s * env * v / len(notes)

# ---------------- arrangement ----------------
# D – Bm – G – A, one chord per bar
CH = [(38, [62, 66, 69, 74]), (35, [59, 62, 66, 71]), (31, [55, 59, 62, 67]), (33, [57, 61, 64, 69])]
FULL = 4.0       # full beat lands on the clinic reveal (bar at 4.0 s, fill from 3.5)
LIFT = 20.0      # lab onward: brighter
BREAK = (14.0, 14.5)   # one-beat drop into the map
END_HIT = 36.6

bars = int(DUR / BAR) + 1
ARP = [0, 2, 1, 3, 2, 1, 3, 2]  # 8th-note pluck pattern over the chord tones
for b in range(bars):
    at = b * BAR
    if at >= END_HIT: break
    root, tri = CH[b % 4]
    full = at >= FULL; lift = at >= LIFT
    for q in range(4):  # beats
        bt = at + q * B
        in_break = BREAK[0] <= bt < BREAK[1]
        if bt >= END_HIT: break
        # kick: every beat (four-on-the-floor), softer in the hook
        if not in_break:
            put(kick(), bt, 0.30 if full else 0.20)
        # clap on 2 and 4 once the b-roll starts
        if full and q in (1, 3) and not in_break:
            put(clap(), bt, 0.16 if lift else 0.13, 0.1)
        for e in range(4):  # 16ths
            st = bt + e * B / 4
            if in_break and st < BREAK[1] - 0.25: continue
            vel = (1.0, 0.45, 0.75, 0.45)[e]
            if full or e % 2 == 0:
                put(hat(vel), st + (0.012 if e % 2 else 0), 0.07 if full else 0.05, 0.35)
        if full and not in_break:
            put(hat(0.8, True), bt + B / 2, 0.05, -0.3)  # off-beat open hat
        # bass: driving 8ths on the root, octave pop on the last 8th of the bar
        for e in range(2):
            st = bt + e * B / 2
            if in_break: continue
            n = root + (12 if (q == 3 and e == 1) else 0)
            put(bass(n, B / 2 * 0.9), st, 0.20 if full else 0.15)
    # pluck arpeggio in 8ths (from the start: it carries the rhythm under the hook)
    for k, idx in enumerate(ARP):
        st = at + k * B / 2
        if st >= END_HIT: break
        n = tri[idx] + (12 if lift and k in (3, 7) else 0)
        put(pluck(n, 0.9 if k % 2 == 0 else 0.6), st, 0.11 if full else 0.09, -0.4 + 0.25 * idx)
    # soft pad bed
    put(pad(tri[:3], BAR + 0.3, 1.0), at, 0.035 if lift else 0.028)

# small drum fill into the full beat and into the lift
for start in (FULL - B, LIFT - B):
    for e in range(4):
        put(clap(0.6 + 0.1 * e), start + e * B / 4, 0.08)
# end: one big D hit on "valutazione", ringing out over the logo
put(kick(), END_HIT, 0.34)
put(clap(), END_HIT, 0.12)
for n in (38, 50, 62, 66, 69, 74):
    put(pluck(n, 1.0), END_HIT, 0.10)
put(pad([62, 66, 69, 74], DUR - END_HIT, 1.0), END_HIT, 0.05)
put(bass(38, 1.2, 1.0), END_HIT, 0.22)

music = np.stack([L, R], 1)

# kick pumping (sidechain) for the groove feel
pump = np.ones(N)
for b in range(int(END_HIT / B) + 1):
    i = int(b * B * SR); t = t_(B)
    pump[i:i + len(t)] = np.minimum(pump[i:i + len(t)], 1 - 0.35 * np.exp(-t / 0.09)) if i < N else 0
music *= pump[:N, None]
fade_out = np.clip((DUR - np.arange(N) / SR) / 0.8, 0, 1)
fade_in = np.clip(np.arange(N) / SR / 0.05, 0, 1)
music *= (fade_in * fade_out)[:, None]
music /= np.max(np.abs(music)) / 0.8
np.save("build/lug/music.npy", music)
print("ok", music.shape)
