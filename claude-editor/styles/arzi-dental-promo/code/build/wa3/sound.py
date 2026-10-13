"""School-run adventure (3 clips, 28.125 s): original synthesized score + SFX
synced to the picture. Event times are global seconds (clip B at 10.042,
clip C at 20.083). Writes music.npy, sfx.npy (stereo, 48 kHz)."""
import numpy as np

SR = 48000
DUR = 28.125
N = int(SR * DUR)
rng = np.random.default_rng(3)

def t_(d): return np.arange(int(d * SR)) / SR
def hz(n): return 440 * 2 ** ((n - 69) / 12)
def filt(x, lo=None, hi=None, peak=None):
    n = 1 << int(np.ceil(np.log2(len(x) + 1)))
    X = np.fft.rfft(x, n); f = np.fft.rfftfreq(n, 1 / SR); m = np.ones_like(f)
    if lo: m *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1e-3)) ** 4)
    if hi: m *= 1 / np.sqrt(1 + (f / hi) ** 4)
    if peak: fc, q = peak; m *= 1 + 4 * np.exp(-((np.log2(np.maximum(f, 1) / fc)) * q) ** 2)
    return np.fft.irfft(X * m, n)[: len(x)]
def sweep_filter(x, f0, f1):
    """time-varying low-pass via short overlapping blocks"""
    out = np.zeros_like(x); blk = 2048; hop = 1024; w = np.hanning(blk)
    for i in range(0, len(x) - blk, hop):
        fc = f0 * (f1 / f0) ** (i / max(1, len(x) - blk))
        out[i:i + blk] += filt(x[i:i + blk] * w, hi=fc)
    return out
noise = lambda d: rng.standard_normal(int(d * SR))

class Bus:
    def __init__(self): self.L = np.zeros(N); self.R = np.zeros(N)
    def put(self, sig, at, gain=1.0, pan=0.0):
        i = int(round(at * SR))
        if i < 0: sig = sig[-i:]; i = 0
        j = min(N, i + len(sig))
        if j <= i: return
        s = sig[: j - i] * gain
        self.L[i:j] += s * np.sqrt(0.5 * (1 - pan)); self.R[i:j] += s * np.sqrt(0.5 * (1 + pan))
    def arr(self): return np.stack([self.L, self.R], 1)

# =============================== SFX ===============================
fx = Bus()
def step(wet=False):
    t = t_(0.12); s = filt(noise(0.12), lo=120, hi=2500 if not wet else 4000) * np.exp(-t / 0.025)
    thump = np.sin(2 * np.pi * 85 * t) * np.exp(-t / 0.03)
    s = s * 0.6 + thump
    if wet: s += filt(noise(0.12), lo=1500, hi=7000) * np.exp(-np.maximum(t - 0.01, 0) / 0.04) * 0.7
    return s
def whoosh(d=0.45, up=True):
    t = t_(d); env = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 2
    return sweep_filter(noise(d), 300 if up else 4000, 4000 if up else 300) * env
def splash(big=1.0, d=1.6):
    t = t_(d); body = filt(noise(d), lo=200, hi=9000) * np.exp(-t / (0.35 * big))
    low = filt(noise(d), hi=400) * np.exp(-t / 0.15) * 1.5
    drops = np.zeros_like(t)
    for _ in range(int(40 * big)):
        a = rng.uniform(0.05, d * 0.8); f = rng.uniform(900, 2600); tt = t - a
        drops += (tt > 0) * np.sin(2 * np.pi * f * tt * (1 + 2 * tt)) * np.exp(-np.maximum(tt, 0) / 0.02) * rng.uniform(0.1, 0.4)
    return body + low + drops
def bubbles(d):
    t = t_(d); s = np.zeros_like(t)
    for _ in range(int(d * 14)):
        a = rng.uniform(0, d - 0.1); f = rng.uniform(250, 900); tt = t - a
        s += (tt > 0) * np.sin(2 * np.pi * f * tt * (1 + 6 * tt)) * np.exp(-np.maximum(tt, 0) / 0.03) * rng.uniform(0.2, 0.6)
    return s
def boing(f0=220):
    t = t_(0.35); f = f0 * (1 + 0.6 * np.exp(-t / 0.05)) * (1 + 0.04 * np.sin(2 * np.pi * 18 * t))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.12)
def snap():
    t = t_(0.15); return filt(noise(0.15), lo=800, hi=5000) * np.exp(-t / 0.008) * 1.5 + np.sin(2 * np.pi * 140 * t) * np.exp(-t / 0.02)
def scrape(d=0.25):
    t = t_(d); return filt(noise(d), lo=600, hi=3500, peak=(1500, 2)) * (0.5 + 0.5 * np.sin(np.pi * t / d)) * (0.6 + 0.4 * np.sin(2 * np.pi * 23 * t))
def wind(d):
    t = t_(d); s = sweep_filter(noise(d), 500, 900) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.4 * t))
    return s * np.minimum(1, t / 0.6) * np.clip((d - t) / 0.6, 0, 1)
def stomp():
    t = t_(0.9); return (np.sin(2 * np.pi * (38 + 25 * np.exp(-t / 0.08)) * t) * np.exp(-t / 0.35) * 1.6 + filt(noise(0.9), hi=300) * np.exp(-t / 0.12))
def roar(d=1.2, growl=False):
    t = t_(d); f0 = (70 if growl else 95) + (0 if growl else 35 * np.sin(np.pi * t / d))
    buzz = np.sign(np.sin(2 * np.pi * np.cumsum(f0) / SR)) * 0.5 + filt(noise(d), lo=80, hi=2500)
    jitter = 1 + 0.35 * filt(noise(d), hi=25) / 3
    s = filt(buzz * jitter, peak=(450, 1.5)) + 0.6 * filt(buzz * jitter, peak=(1100, 2))
    env = np.minimum(1, t / (0.25 if growl else 0.12)) * np.clip((d - t) / 0.35, 0, 1)
    return np.tanh(1.5 * s * env) * (0.6 if growl else 1.0)
def thwack():
    t = t_(0.3); return np.sin(2 * np.pi * 180 * t) * np.exp(-t / 0.05) + filt(noise(0.3), lo=1500) * np.exp(-t / 0.01) + np.sin(2 * np.pi * 620 * t) * np.exp(-t / 0.08) * 0.4
def thud():
    t = t_(0.6); return np.sin(2 * np.pi * (55 + 40 * np.exp(-t / 0.05)) * t) * np.exp(-t / 0.18) * 1.4 + filt(noise(0.6), hi=900) * np.exp(-t / 0.06)
def bell(d=1.8):
    t = t_(d); return sum(a * np.sin(2 * np.pi * 1320 * r * t) * np.exp(-t / (0.9 / r)) for r, a in ((1, 1), (2.76, 0.5), (5.4, 0.25), (8.9, 0.12)))
def rain(d):
    return filt(noise(d), lo=1500, hi=9000) * 0.5 + filt(noise(d), lo=300, hi=1200) * 0.25

A, Bt, C = 0.0, 10.042, 20.083
# --- clip A: stone run, puddles, river, splash, underwater
fx.put(rain(7.71), 0.0, 0.035)
for k, tt in enumerate(np.arange(0.12, 2.2, 0.27)): fx.put(step(), tt, 0.35, (-0.2, 0.2)[k % 2])
fx.put(whoosh(0.4), 2.25 - 0.3, 0.25)
for k, tt in enumerate(np.arange(2.35, 4.6, 0.3)): fx.put(step(True), tt, 0.35, (-0.2, 0.2)[k % 2])
fx.put(whoosh(0.4), 4.71 - 0.3, 0.25)
fx.put(filt(noise(3.0), lo=200, hi=3000) * np.minimum(1, t_(3.0) / 0.3), 4.71, 0.10)        # river rush
for k, tt in enumerate(np.arange(4.8, 5.9, 0.3)): fx.put(step(True), tt, 0.25, (-0.2, 0.2)[k % 2])
fx.put(whoosh(0.5), 6.0, 0.25)                                                              # jump
fx.put(splash(1.0), 6.58, 0.55)                                                             # into the river
fx.put(filt(noise(2.33), hi=500) * 0.6 + bubbles(2.33), 7.71, 0.30)                         # underwater
fx.put(bubbles(1.0), 9.0, 0.35)
# --- clip B: burst out, crocodile hops, climb, summit, T-rex
fx.put(whoosh(0.35), Bt - 0.25, 0.3)
fx.put(splash(1.3, 1.4), Bt + 0.17, 0.6)
for k, tt in enumerate((0.83, 1.67, 2.5)): fx.put(boing(220 + 40 * k), Bt + tt, 0.32, (-0.3, 0.0, 0.3)[k])
fx.put(snap(), Bt + 1.15, 0.45, 0.3); fx.put(snap(), Bt + 2.05, 0.45, -0.3)
fx.put(whoosh(0.4), Bt + 2.71 - 0.3, 0.25)
for k, tt in enumerate(np.arange(2.8, 4.4, 0.4)): fx.put(scrape(0.25), Bt + tt, 0.25, (-0.3, 0.3)[k % 2])
fx.put(wind(3.6), Bt + 4.0, 0.22)
fx.put(whoosh(0.35), Bt + 6.21 - 0.25, 0.2)
# T-rex: the clip's own stomps + roar are used (see mix); add only a deep sub rumble under them
def sub(d, f0=34):
    t = t_(d); return np.sin(2 * np.pi * (f0 + 8 * np.exp(-t / 0.2)) * t) * np.exp(-t / (d / 3))
for tt in (7.0, 7.75, 8.5): fx.put(sub(0.9), Bt + tt, 0.35)
fx.put(sub(1.3, 30) * 0.8, Bt + 9.0, 0.4)
# --- clip C: run, pole plant, vault over the canyon, landing, school bell
fx.put(whoosh(0.35), C - 0.25, 0.3)
for k, tt in enumerate(np.arange(0.05, 1.0, 0.24)): fx.put(step(), C + tt, 0.35, (-0.2, 0.2)[k % 2])
fx.put(thwack(), C + 1.0, 0.45)
fx.put(whoosh(1.0), C + 1.2, 0.35)
fx.put(wind(2.4), C + 1.3, 0.22)
fx.put(whoosh(0.5, up=False), C + 3.3, 0.3)
fx.put(thud(), C + 3.72, 0.6)
for k, tt in enumerate(np.arange(5.3, 8.0, 0.5)): fx.put(step() * 0.6, C + tt, 0.2, (-0.15, 0.15)[k % 2])

# =============================== MUSIC ===============================
mu = Bus()
BPM = 120; Bq = 60 / BPM
def pluck(n, d=0.35, bright=1.0):
    t = t_(d); f = hz(n)
    s = sum(a * np.sin(2 * np.pi * f * h * t) * np.exp(-t * (9 + 6 * h / bright)) for h, a in ((1, 1), (2, 0.6), (3, 0.35), (4, 0.2)))
    return s * np.minimum(1, t / 0.002)
def brass(notes, d):
    t = t_(d); s = 0
    for n in notes:
        f = hz(n); ph = 2 * np.pi * f * t * (1 + 0.003 * np.sin(2 * np.pi * 5 * t))
        s = s + sum(np.sin(h * ph) / h ** 1.1 for h in range(1, 9))
    s = filt(s, hi=2200)
    return s * np.minimum(1, t / 0.06) * np.clip((d - t) / 0.3, 0, 1) / len(notes)
def strings(notes, d):
    t = t_(d); s = 0
    for n in notes:
        for det in (-0.12, -0.04, 0.05, 0.11):
            f = hz(n + det) * (1 + 0.004 * np.sin(2 * np.pi * (5.2 + det) * t + rng.uniform(0, 6)))
            ph = 2 * np.pi * np.cumsum(f) / SR
            s = s + sum(np.sin(h * ph) / h for h in range(1, 10))
    s = filt(s, hi=2600, lo=90)
    return s * np.minimum(1, t / 0.35) * np.clip((d - t) / 0.5, 0, 1) / (4 * len(notes))
def glock(n, d=1.2):
    t = t_(d); f = hz(n)
    return (np.sin(2 * np.pi * f * t) * np.exp(-t / 0.6) + 0.25 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / 0.15)) * np.minimum(1, t / 0.002)
def tom(f=90):
    t = t_(0.5); return np.sin(2 * np.pi * (f + 60 * np.exp(-t / 0.04)) * t) * np.exp(-t / 0.18)
def shaker():
    t = t_(0.07); return filt(noise(0.07), lo=6000) * np.exp(-t / 0.015)
def bassn(n, d):
    t = t_(d); s = np.tanh(1.4 * (np.sin(2 * np.pi * hz(n) * t) + 0.3 * np.sin(4 * np.pi * hz(n) * t)))
    return s * np.minimum(1, t / 0.005) * np.exp(-t / 0.4)
def hit(notes, d=1.6):
    s = brass(notes, d) * 1.4
    k = tom(70); s[: len(k)] += k * 0.8
    return s

Dm = [(50, [62, 65, 69]), (46, [58, 62, 65]), (48, [60, 64, 67]), (45, [57, 61, 64])]  # Dm Bb C A
def adventure(t0, t1, bright=1.0, drums=True, gain=1.0):
    b = 0; t = t0
    while t < t1 - 1e-6:
        root, tri = Dm[b % 4]
        for k in range(8):  # 8th-note ostinato
            st = t + k * Bq / 2
            if st >= t1: break
            n = tri[(0, 1, 2, 1, 0, 2, 1, 2)[k]] + (12 if bright > 1 and k in (2, 6) else 0)
            mu.put(pluck(n, 0.3, bright), st, 0.11 * gain, -0.3 + 0.3 * (k % 3))
            if k % 2 == 0: mu.put(bassn(root, Bq * 0.9), st, 0.17 * gain)
            if drums: mu.put(shaker(), st + Bq / 4, 0.05 * gain, 0.4)
        if drums:
            for q in range(4):
                st = t + q * Bq
                if st < t1: mu.put(tom(85 if q % 2 == 0 else 120), st, (0.30 if q == 0 else 0.18) * gain)
        mu.put(brass([tri[0], tri[2]], 4 * Bq + 0.1), t, 0.035 * gain)
        t += 4 * Bq; b += 1

adventure(0.0, 7.71)                                    # run through the rain
underwater_from = len(mu.L)
adventure(7.71, 10.042, drums=False, gain=0.8)          # (low-passed below)
adventure(10.042, 16.25, bright=1.3)                    # crocodiles + climb
mu.put(hit([62, 66, 69, 74], 1.0), 16.25, 0.20)         # hero pose sting (D major)
for k, tt in enumerate(np.arange(17.1, 20.0, Bq)):      # T-rex tension: low pulses
    mu.put(tom(60), tt, 0.20); mu.put(bassn(38, Bq * 0.8), tt, 0.14)
mu.put(brass([38, 44, 50], 2.9), 17.1, 0.12)            # dissonant low swell
adventure(20.083, 23.75, bright=1.4)                    # run + vault: building
riser = sweep_filter(noise(2.4), 400, 8000) * np.linspace(0, 1, int(2.4 * SR)) ** 2
mu.put(riser, 23.75 - 2.4, 0.12)
# triumph at school (D major): warm strings, glockenspiel melody, soft drums
DM = [(50, [62, 66, 69]), (55, [62, 67, 71]), (57, [61, 64, 69]), (50, [62, 66, 69])]
mu.put(strings([50, 62, 66, 69, 74], 2.2), 23.75, 0.55)
k0 = tom(70); mu.put(k0, 23.75, 0.35)
MEL = [74, 76, 78, 81, 79, 78, 76, 78, 74, 76, 78, 74]   # simple bright melody, quarter notes
t = 23.75; b = 0
while t < DUR - 0.8:
    root, tri = DM[b % 4]
    mu.put(strings(tri + [tri[0] + 12], 4 * Bq + 0.4), t, 0.45)
    for k in range(8):
        st = t + k * Bq / 2
        if st >= DUR - 0.6: break
        if k % 2 == 0: mu.put(bassn(root, Bq * 0.9), st, 0.14)
        mu.put(shaker(), st + Bq / 4, 0.035, 0.4)
    for q in range(4):
        st = t + q * Bq
        if st < DUR - 0.6:
            mu.put(tom(85 if q % 2 == 0 else 120), st, 0.16 if q == 0 else 0.10)
            mu.put(glock(MEL[(b * 4 + q) % len(MEL)]), st, 0.07, 0.25)
    t += 4 * Bq; b += 1
mu.put(strings([50, 62, 66, 69, 74], 1.4), DUR - 1.4, 0.5)
mu.put(glock(86, 1.4), DUR - 1.4, 0.08)

music = mu.arr()
# underwater: muffle the music between 7.71 and 10.042 (with short ramps)
i0, i1 = int(7.71 * SR), int(10.042 * SR)
muff = np.stack([filt(music[i0 - 2400:i1 + 2400, c], hi=450) for c in range(2)], 1)
w = np.ones(i1 - i0 + 4800); r = 2400; w[:r] = np.linspace(0, 1, r); w[-r:] = np.linspace(1, 0, r)
music[i0 - 2400:i1 + 2400] = music[i0 - 2400:i1 + 2400] * (1 - w[:, None]) + muff * w[:, None] * 1.3
# duck the music under the big moments (splash, roar, landing)
duck = np.ones(N)
for a, b, g in ((6.5, 7.4, 0.55), (Bt + 8.85, Bt + 10.0, 0.35), (C + 3.65, C + 4.1, 0.6)):
    i, j = int(a * SR), int(b * SR); duck[i:j] = np.minimum(duck[i:j], g)
duck = np.convolve(duck, np.ones(2400) / 2400, mode="same")
music *= duck[:, None]
fade = np.clip((DUR - np.arange(N) / SR) / 0.5, 0, 1) * np.clip(np.arange(N) / SR / 0.03, 0, 1)
music *= fade[:, None]
def reverb(x, rt=1.3, wet=0.22, pre=0.02):
    n = int(rt * SR); t = np.arange(n) / SR
    out = np.zeros_like(x)
    for c in range(2):
        ir = rng.standard_normal(n) * np.exp(-6.9 * t / rt); ir = filt(ir, hi=6000, lo=150)
        ir = np.concatenate([np.zeros(int(pre * SR)), ir]); ir /= np.sqrt(np.sum(ir ** 2))
        m = 1 << int(np.ceil(np.log2(len(x) + len(ir))))
        out[:, c] = np.fft.irfft(np.fft.rfft(x[:, c], m) * np.fft.rfft(ir, m), m)[: len(x)]
    return x * (1 - wet) + out * wet * 1.6
music = reverb(music, 1.6, 0.25)
sfxa = reverb(fx.arr(), 1.0, 0.18)
np.save("build/wa3/music.npy", music); np.save("build/wa3/sfx.npy", sfxa * fade[:, None])
print("ok")
