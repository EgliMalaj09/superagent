import numpy as np, wave, sys
MODE = sys.argv[1]
SR = 48000; DUR = 52.33; N = int(SR * DUR)
rng = np.random.default_rng(11)
L = np.zeros(N); R = np.zeros(N)
def t_(d): return np.arange(int(d * SR)) / SR
def put(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i < 0: sig = sig[-i:]; i = 0          # notes that started before 0 s
    j = min(N, i + len(sig))
    if i >= N or j <= i: return
    s = sig[: j - i] * gain
    L[i:j] += s * np.sqrt(0.5 * (1 - pan)); R[i:j] += s * np.sqrt(0.5 * (1 + pan))
def hz(n): return 440 * 2 ** ((n - 69) / 12)
def onepole(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); z = 0.0
    for k in range(len(x)): z = (1 - a) * x[k] + a * z; y[k] = z
    return y
def piano(n, d=2.2, vel=1.0):
    t = t_(d); f = hz(n)
    s = sum(a * np.sin(2*np.pi*f*h*t) * np.exp(-t*(1.6 + h*0.9)) for h, a in ((1,1.0),(2,0.42),(3,0.18),(4,0.08)))
    s *= np.minimum(1, t / 0.004) * np.clip((d - t) / 0.3, 0, 1)
    return s * vel
def pad(notes, d, bright=700):
    t = t_(d); s = np.zeros_like(t)
    for n in notes:
        for det in (-0.06, 0.0, 0.06):
            f = hz(n + det); s += sum(np.sin(2*np.pi*f*h*t)/h for h in range(1, 6))
    s = onepole(s, bright)
    env = np.minimum(1, t / 1.2) * np.clip((d - t) / 1.0, 0, 1)
    return s * env
def kick():
    t = t_(0.35); f = 48 + 60 * np.exp(-t / 0.04)
    return np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-t / 0.14)
def shaker():
    t = t_(0.08); n = rng.standard_normal(len(t)); n = n - onepole(n, 5000)
    return n * np.exp(-t / 0.018)

BPM = 96; B = 60 / BPM; BAR = 4 * B   # 2.5 s
# D major, original progression: D – Bm – G – A  (I–vi–IV–V)
CH = [(50, [62, 66, 69]), (47, [59, 62, 66]), (43, [55, 59, 62]), (45, [57, 61, 64])]
START = 3.0 if MODE == 'A' else -2.0  # B: two extra bars before 3.0 s, same grid
bars = int((50.0 - START) / BAR) + 1
for b in range(bars):
    at = START + b * BAR
    root, tri = CH[(b + (0 if MODE == 'A' else 2)) % 4]
    lift = at >= 25.0
    # piano: gentle 8th-note arpeggio, original pattern
    pat = [0, 1, 2, 1, 0, 2, 1, 2]
    for k, idx in enumerate(pat):
        n = tri[idx] + (12 if (lift and k in (2, 6)) else 0)
        put(piano(n, 1.6, 0.55 if k % 2 else 0.7), at + k * B / 2, 0.16, -0.3 + 0.2 * idx)
    put(piano(root + 12, 2.4, 0.8), at, 0.14, 0.0)
    put(pad([root + 12] + tri, BAR + 0.6, 1100 if lift else 700), at, 0.035 if lift else 0.028, 0.0)
    if at >= 11.2:                 # pulse joins with the b-roll
        for q in range(4):
            put(kick(), at + q * B, 0.18 if lift else 0.14)
    if lift:
        for q in range(8):
            put(shaker(), at + q * B / 2 + B / 4, 0.05, 0.4)
# ending: final D chord rings out after the voice ends (38 s → 40 s)
for n in (50, 62, 66, 69, 74):
    put(piano(n, 2.2, 0.9), 50.1, 0.15, 0.0)
put(pad([62, 66, 69, 74], 2.2, 1200), 50.1, 0.03)
mix = np.stack([L, R], 1)
fade_in = np.clip((np.arange(N) / SR - START) / 1.5, 0, 1) if MODE == 'A' else np.clip(np.arange(N) / SR / 0.25, 0, 1)
fade_out = np.clip((DUR - np.arange(N) / SR) / 0.6, 0, 1)
mix *= (fade_in * fade_out)[:, None]
np.save("build/torino/music_raw_%s.npy" % MODE, mix)
raise SystemExit; w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((mix * 32767).astype(np.int16).tobytes()); w.close(); print("ok")
