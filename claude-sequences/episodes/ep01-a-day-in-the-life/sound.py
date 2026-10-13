#!/usr/bin/env python3
"""A Day in the Life of Claude: the full sound design (all effects + ambiences + a lo-fi bed), synthesised with numpy.

    python3 projects/a-day-in-claude-animation/sound.py   ->  projects/a-day-in-claude-animation/sound.wav

Times are positions in the joined reel (scene start + local time; scenes overlap by 0.35 s crossfades).
Final loudness is set later by templates/finish.sh (-14 LUFS), so the gains below are only the balance between sounds.
"""
import os, wave
import numpy as np

SR = 48000
ROOT = os.path.dirname(os.path.abspath(__file__))
LIB = os.path.join(ROOT, '..', '..', 'library', 'sfx')
DUR = 96.47
SCENE = [0, 6.65, 12.3, 17.95, 27.6, 34.25, 45.4, 57.45, 64.3, 71.45, 83.6, 88.05]   # s01..s12 start in the reel
rng = np.random.default_rng(7)


# ---------------------------------------------------------------- building blocks
def t_(d): return np.arange(int(d * SR)) / SR
def noise(d): return rng.uniform(-1, 1, int(d * SR))
def env(n, a=0.003, dec=0.15):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / dec)
def _lp1(x, fc):   # one-pole low-pass, applied in the frequency domain (fast, no scipy)
    k = 1 - np.exp(-2 * np.pi * fc / SR); n = len(x); N = 1 << int(np.ceil(np.log2(n + SR // 10 + 1)))
    w = 2 * np.pi * np.fft.rfftfreq(N) ; H = k / (1 - (1 - k) * np.exp(-1j * w))
    return np.fft.irfft(np.fft.rfft(x, N) * H, N)[:n]
def lp(x, fc):
    if np.ndim(fc) == 0: return _lp1(x, float(fc))
    fc = np.asarray(fc, float); y = np.zeros_like(x); c = int(0.05 * SR)   # swept cutoff: 50 ms blocks with a short crossfade
    for a in range(0, len(x), c):
        b = min(len(x), a + c); lo = max(0, a - c)
        y[a:b] = _lp1(x[lo:b], fc[a:b].mean())[a - lo:]
    return y
def hp(x, fc): return x - lp(x, fc)
def bp(x, lo, hi): return hp(lp(x, hi), lo)
def sine(f, d, ph=0):
    f = np.broadcast_to(np.asarray(f, float), int(d * SR)); return np.sin(2 * np.pi * np.cumsum(f) / SR + ph)
def norm(x, p=1.0): m = np.max(np.abs(x)) or 1; return x / m * p
def fade(x, fi=0.01, fo=0.05):
    n = len(x); a = min(n, int(fi * SR)); b = min(n, int(fo * SR))
    x = x.copy(); x[:a] *= np.linspace(0, 1, a); x[n - b:] *= np.linspace(1, 0, b); return x
def lib(name):
    w = wave.open(os.path.join(LIB, name + '.wav')); d = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(float) / 32768
    if w.getnchannels() == 2: d = d.reshape(-1, 2).mean(1)
    return d
def cat(*xs): return np.concatenate(xs)


# ---------------------------------------------------------------- the sounds
def bell(f):   # metallic strike: inharmonic partials
    d = 0.35; t = t_(d)
    x = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / (0.25 / r ** .5)) for r, a in [(1, 1), (2.76, .6), (5.4, .35), (8.93, .2)])
    return x
def alarm(d):  # twin-bell hammer at ~18 hits/s, alternating bells
    out = np.zeros(int((d + 0.4) * SR)); i = 0
    for k, s in enumerate(np.arange(0, d, 1 / 18)):
        b = bell(2300 if k % 2 else 2650) * (0.8 + 0.2 * rng.random()); n = int(s * SR); out[n:n + len(b)] += b[:len(out) - n]
    return norm(out, .9)
def thud(f=70, d=0.18, nz=0.5):
    t = t_(d); x = np.sin(2 * np.pi * (f + 60 * np.exp(-t / 0.02)) * t) * np.exp(-t / 0.05)
    x += nz * lp(noise(d), 600) * np.exp(-t / 0.03); return norm(x, .9)
def step(): return norm(lp(noise(0.07), 900) * env(int(0.07 * SR), 0.002, 0.02), .7)
def hop(f0=300, f1=700, d=0.13):
    t = t_(d); return np.sin(2 * np.pi * np.cumsum(np.linspace(f0, f1, len(t))) / SR) * env(len(t), 0.003, 0.06) * .8
def creak(d=0.55):
    t = t_(d); f = 260 + 90 * np.sin(2 * np.pi * 3.3 * t) + 60 * t
    saw = 2 * ((np.cumsum(f) / SR) % 1) - 1
    g = (np.sin(2 * np.pi * 22 * t) > 0.3).astype(float) * 0.6 + 0.4   # stick-slip
    return norm(bp(saw * g, 300, 2600) * np.sin(np.pi * t / d), .55)
def door_close():
    x = norm(thud(65, 0.22, .8), .9); c = lib('click') * .6; i = int(0.01 * SR); x[i:i + len(c)] += c[:len(x) - i]; return x
def scribble(d):
    t = t_(d); x = bp(noise(d), 1800, 6000)
    strokes = (0.5 + 0.5 * np.sin(2 * np.pi * 7.5 * t + 3 * np.sin(2 * np.pi * 1.3 * t))) ** 2
    return norm(x * strokes, .45)
def boing(f=420, d=0.45):
    t = t_(d); return np.sin(2 * np.pi * np.cumsum(f * (1 + 0.12 * np.sin(2 * np.pi * 28 * t) * np.exp(-t / .15))) / SR) * np.exp(-t / .12) * .6
def crunch():
    d = 0.2; out = np.zeros(int(d * SR))
    for k in range(9):
        g = hp(noise(0.02), 1500) * env(int(0.02 * SR), 0.0005, 0.005); n = int(rng.uniform(0, d - 0.03) * SR); out[n:n + len(g)] += g
    return norm(out + 0.3 * lp(noise(d), 800) * env(len(out), 0.002, 0.05), .9)
def grab(): return hop(500, 260, 0.08)
def murmur(d, lo=250, hi=1100, speed=0.9):
    t = t_(d); x = bp(noise(d), lo, hi)
    m = 0.55 + 0.25 * np.sin(2 * np.pi * speed * t) + 0.2 * np.sin(2 * np.pi * speed * 2.7 * t + 1)
    return norm(x * m, .5)
def clink(): t = t_(0.25); return (np.sin(2 * np.pi * 3100 * t) + .5 * np.sin(2 * np.pi * 4870 * t)) * np.exp(-t / .05) * .35
def cafe(d):
    x = murmur(d, 200, 1000)
    t = t_(d); tv = bp(noise(d), 400, 2400) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 2.3 * t + np.sin(2 * np.pi * .7 * t)))) * .25   # far TV commentary (no words)
    x = x + tv
    for s in rng.uniform(0.2, d - 0.3, int(d / 1.4)):
        c = clink(); n = int(s * SR); x[n:n + len(c)] += c[:len(x) - n]
    return fade(norm(x, .55), .4, .5)
def slide(d=0.35): return norm(lp(noise(d), 1400) * np.sin(np.pi * t_(d) / d) ** .7, .5)
def gulp(f0=320, f1=110, d=0.26):
    t = t_(d); x = np.sin(2 * np.pi * np.cumsum(np.linspace(f0, f1, len(t))) / SR) * np.sin(np.pi * t / d) ** 2
    return norm(x + .3 * lp(noise(d), 500) * np.sin(np.pi * t / d), .85)
def shiver(d=0.85):
    t = t_(d); f = 140 + 30 * np.sin(2 * np.pi * 9 * t)
    saw = 2 * ((np.cumsum(f) / SR) % 1) - 1
    return norm(lp(saw, 900) * (0.5 + 0.5 * np.sin(2 * np.pi * 14 * t)) * np.sin(np.pi * t / d), .55)
def clack():
    x = np.zeros(int(0.16 * SR))
    for s in (0, 0.05):
        g = bp(noise(0.03), 1500, 5000) * env(int(0.03 * SR), 0.0003, 0.006); n = int(s * SR); x[n:n + len(g)] += g * (1 if s == 0 else .6)
    return norm(x, .9)
def brakes(d=0.7):
    t = t_(d); f = 2350 + 60 * np.sin(2 * np.pi * 6 * t)
    return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) * (1 - t / d) + .3 * lp(noise(d), 1500) * (1 - t / d), .45)
def engine(d, f0=42, f1=42):
    t = t_(d); f = np.linspace(f0, f1, len(t)); saw = 2 * ((np.cumsum(f) / SR) % 1) - 1
    return norm(lp(saw * (0.7 + 0.3 * np.sin(2 * np.pi * f * 0.5 * t)), 380), .6)
def van_door(): return norm(cat(lp(noise(0.45), 900) * np.linspace(.3, 1, int(0.45 * SR)), thud(80, .2, .9)), .8)
def ping(f=1500, d=0.25):
    t = t_(d); return (np.sin(2 * np.pi * f * t) + .3 * np.sin(2 * np.pi * f * 2 * t)) * np.exp(-t / .07) * .7
def ping2(): return cat(ping(1320, .09), ping(1980, .3))
def pop_cascade(d=1.5):
    out = np.zeros(int((d + .2) * SR)); n = 70
    for k in range(n):
        s = d * (k / n) ** .6; f = rng.uniform(500, 1400)
        b = hop(f, f * 1.6, 0.05) * .5; i = int(s * SR); out[i:i + len(b)] += b
    return norm(out, .7)
def hum(d): t = t_(d); return norm(lp(noise(d), 300) * .6 + .25 * np.sin(2 * np.pi * 60 * t) + .1 * np.sin(2 * np.pi * 120 * t), .4)
def blip(): t = t_(.1); return np.sin(2 * np.pi * 950 * t) * env(len(t), .002, .03) * .6
def whirr(d=0.75):
    t = t_(d); f = 110 + 60 * t / d; saw = 2 * ((np.cumsum(f) / SR) % 1) - 1
    whine = np.sin(2 * np.pi * np.cumsum(900 + 500 * t / d) / SR) * .25
    return norm((lp(saw, 1200) + whine) * np.minimum(1, t / .08) * np.minimum(1, (d - t) / .08), .7)
def clank(f=480):
    d = 0.6; t = t_(d)
    x = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / (0.3 / r ** .6)) for r, a in [(1, 1), (2.83, .7), (4.6, .5), (7.1, .3)])
    return norm(x + .8 * hp(noise(d), 2000) * np.exp(-t / .01), .9)
def gauge(): t = t_(.45); return norm(np.sin(2 * np.pi * np.cumsum(np.linspace(400, 1200, len(t))) / SR) * np.sin(np.pi * t / .45), .4)
def beep(f=1800): t = t_(.08); return np.sin(2 * np.pi * f * t) * .4 * fade(np.ones(len(t)), .005, .02)
def recharge(d=2.4):
    t = t_(d); f = 80 + 320 * (t / d) ** 1.4; x = np.sin(2 * np.pi * np.cumsum(f) / SR) + .4 * np.sin(2 * np.pi * np.cumsum(f * 2.01) / SR)
    x *= (0.8 + 0.2 * np.sin(2 * np.pi * 7 * t)) * np.minimum(1, t / .2) * np.minimum(1, (d - t) / .15)
    return norm(x + .15 * hum(d), .6)
def sip(): d = .32; t = t_(d); return norm(bp(noise(d), 1500, 6000) * np.sin(np.pi * t / d) ** 3 * (0.6 + 0.4 * np.sin(2 * np.pi * 25 * t)), .5)
def wind(d=1.2): t = t_(d); return norm(lp(noise(d), 300 + 500 * np.sin(np.pi * t / d)) * np.sin(np.pi * t / d), .45)
def whistle(): d = .5; t = t_(d); return np.sin(2 * np.pi * np.cumsum(2400 + 900 * np.sin(np.pi * t / d)) / SR) * np.sin(np.pi * t / d) * .25
def crowd(d, cheer=0.5):
    x = murmur(d, 300, 2200, 0.6) + .5 * murmur(d, 150, 700, 0.35)
    for s in rng.uniform(0.3, d - 0.6, int(d / 0.9)):
        w = whistle() * cheer; n = int(s * SR); x[n:n + len(w)] += w[:len(x) - n]
    return fade(norm(x, .7), .8, .8)
def slap(): d = .09; return norm(bp(noise(d), 700, 5000) * env(int(d * SR), .0005, .015), .8)
def stomps(d, rate=2.8):
    out = np.zeros(int((d + .3) * SR))
    for s in np.arange(0, d, 1 / rate):
        for j in range(5):
            b = thud(55 + rng.uniform(-8, 8), .2, .8) * rng.uniform(.4, .8); n = int((s + rng.uniform(0, .05)) * SR); out[n:n + len(b)] += b
    return norm(out, .9)
def crickets(d):
    t = t_(d); out = np.zeros(len(t))
    for f0, ph in ((4400, 0), (4700, 1.7)):
        chirp = (np.sin(2 * np.pi * 2.1 * t + ph) > 0.6).astype(float) * (np.sin(2 * np.pi * 45 * t) > 0)
        out += np.sin(2 * np.pi * f0 * t) * lp(chirp, 200)
    return fade(norm(out, .25), .3, .5)
def snore(d=2.0):
    t = t_(d); breath = np.maximum(0, np.sin(2 * np.pi * t / d)) ** 2
    rasp = lp(noise(d), 350) * (0.6 + 0.4 * np.sin(2 * np.pi * 32 * t))
    return norm(rasp * breath, .4)


# ---------------------------------------------------------------- the lo-fi bed (84 bpm, Fmaj7 Em7 Dm7 Cmaj7)
def bed():
    bpm = 84; beat = 60 / bpm; n = int(DUR * SR); out = np.zeros(n + SR)
    chords = [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [48, 52, 55, 59]]
    hz = lambda m: 440 * 2 ** ((m - 69) / 12)
    bar = 4 * beat; k = 0; s = 0.0
    while s < DUR:
        ch = chords[(k // 2) % 4]
        for b in range(4):                                     # soft e-piano stabs on each beat
            st = s + b * beat + (0.02 if b % 2 else 0); d = beat * .95; t = t_(d)
            x = sum(np.sin(2 * np.pi * hz(m) * t) * (1 + .3 * np.sin(2 * np.pi * hz(m) * 2 * t)) for m in ch) / 4
            x *= np.exp(-t / .45) * .5; i = int(st * SR); out[i:i + len(x)] += x[:len(out) - i]
        t = t_(bar); bass = np.sin(2 * np.pi * hz(ch[0] - 12) * t) * np.exp(-t / 1.4) * .35   # bass on the bar
        i = int(s * SR); out[i:i + len(bass)] += bass[:len(out) - i]
        for b in range(4):                                     # drums: kick 1 & 3, snare 2 & 4, swung hats
            st = s + b * beat; i = int(st * SR)
            if b % 2 == 0: kk = thud(52, .3, .2) * .55; out[i:i + len(kk)] += kk[:len(out) - i]
            else: sn = bp(noise(.18), 900, 3500) * env(int(.18 * SR), .001, .05) * .3; out[i:i + len(sn)] += sn[:len(out) - i]
            for h in (0, .58):
                j = int((st + h * beat) * SR); hh = hp(noise(.04), 6000) * env(int(.04 * SR), .0005, .012) * .12; out[j:j + len(hh)] += hh[:len(out) - j]
        s += bar; k += 1
    out = out[:n]
    out += lp(noise(DUR), 2500)[:n] * .015                    # vinyl hiss
    for s in rng.uniform(0, DUR, 140):                         # vinyl crackle
        i = int(s * SR); c = hp(noise(.004), 3000) * .12; out[i:i + len(c)] += c[:n - i]
    t = np.arange(n) / SR
    g = np.ones(n)
    g *= np.clip(t / 1.5, 0, 1) * np.clip((DUR - t) / 1.5, 0, 1)          # fade in / out
    g *= np.interp(t, [0, 78.5, 79.2, 83.3, 84.2, 90.8, 91.3, DUR], [1, 1, 1.45, 1.45, .45, .45, 1, 1])   # swell at the protest, quiet night
    return lp(out, 5000) * g


# ---------------------------------------------------------------- the cue sheet: (scene, local time, sound, gain)
L = lambda n: lib(n)
CUES = [
    # 1 bedroom
    (1, 0.10, alarm(1.2), .55), (1, 2.40, L('click'), .7), (1, 2.75, hop(260, 520), .45), (1, 3.25, thud(75, .2, .6), .6),
    *[(1, 3.6 + i * 0.25, step(), .35) for i in range(8)], (1, 5.55, creak(), .4), (1, 6.40, door_close(), .45),
    # 2 mirror
    *[(2, 0.1 + i * 0.18, step(), .3) for i in range(6)], (2, 1.55, L('whoosh'), .35), (2, 2.45, scribble(2.9), .45),
    # 3 breakfast
    *[(3, 0.05 + i * 0.25, step(), .3) for i in range(4)], (3, 1.0, L('pop'), .8), (3, 1.0, boing(380, .4), .35), (3, 1.38, grab(), .5),
    (3, 1.66, thud(80, .15, .5), .4), *[(3, 2.1 + i * 0.2, step(), .3) for i in range(4)],
    (3, 3.15, crunch(), .8), (3, 3.55, crunch(), .8), (3, 3.95, crunch(), .85), (3, 5.05, creak(.45), .35), (3, 5.65, door_close(), .4),
    # 4 bar
    *[(4, 0.05 + i * 0.25, step(), .3) for i in range(4)], (4, 1.13, hop(280, 560), .4), (4, 1.4, thud(90, .12, .4), .4),
    (4, 1.6, slide(), .45), (4, 2.0, slide(.3), .4), (4, 5.95, gulp(), .7), (4, 6.9, cat(gulp(280, 120, .16), gulp(260, 100, .16), gulp(240, 90, .2)), .7),
    (4, 7.3, shiver(), .55), (4, 8.45, clack(), .8), (4, 8.6, thud(80, .15, .5), .35), *[(4, 8.95 + i * 0.25, step(), .3) for i in range(4)],
    # 5 furgon
    (5, 0.0, engine(1.0, 48, 38), .35), (5, 0.55, brakes(), .4), (5, 0.6, engine(1.2, 36, 36), .3), *[(5, 0.75 + i * 0.2, step(), .3) for i in range(4)],
    (5, 1.55, van_door(), .45), (5, 1.8, L('whoosh'), .35), (5, 2.2, engine(3.0, 40, 44), .18),
    *[(5, 2.6 + i * 0.16, ping(1200 + i * 120), .4) for i in range(6)], (5, 3.6, ping2(), .5), (5, 4.4, blip(), .35),
    (5, 5.25, thud(60, .25, .7), .7), (5, 5.25, boing(300, .5), .4), (5, 6.0, L('whoosh'), .3), (5, 6.4, engine(0.6, 45, 110), .45),
    # 6 HQ + the thousands
    *[(6, 0.1 + i * 0.22, step(), .3) for i in range(5)], (6, 0.9, L('swipe'), .5), (6, 1.7, L('swipe'), .4),
    (6, 2.5, L('typing'), .45), (6, 3.5, pop_cascade(1.6), .45), (6, 4.5, hum(4.6), .25), (6, 4.6, L('riser'), .2),
    *[(6, 4.9 + i * 0.14, L('tick'), .3) for i in range(14)], (6, 7.0, L('whoosh'), .5),
    *[(6, 7.85 + i * 0.4, blip(), .35) for i in range(9)],
    # 7 claw + lab + recharge
    (7, 0.0, L('typing'), .35), (7, 0.45, whirr(), .55), (7, 1.2, clank(), .7), (7, 1.55, whirr(.7), .45),
    (7, 2.3, hum(3.3), .2), (7, 2.5, whirr(.8), .4), (7, 3.45, L('glitch'), .35), (7, 3.9, gauge(), .4),
    *[(7, 4.0 + i * 0.25, beep(1600 + (i % 3) * 300), .35) for i in range(6)],
    (7, 5.75, recharge(2.4), .5), *[(7, 5.8 + i * 0.08, L('tick'), .25) for i in range(30)],
    (7, 8.4, whirr(.6), .45), (7, 9.05, clank(330), .6), (7, 9.25, whirr(.5), .35), (7, 9.6, L('typing'), .4),
    (7, 11.0, hop(300, 560), .4), *[(7, 11.2 + i * 0.22, step(), .3) for i in range(5)],
    # 8 bar again
    *[(8, 0.05 + i * 0.25, step(), .3) for i in range(4)], (8, 1.13, hop(280, 560), .4),
    (8, 2.05, slide(), .45), (8, 4.05, L('ding'), .25), (8, 5.6, sip(), .6), (8, 6.1, thud(80, .15, .5), .35),
    *[(8, 6.4 + i * 0.22, step(), .3) for i in range(4)],
    # 9 pyramid
    *[(9, 0.3 + i * 0.26, hop(300 + i * 40, 600 + i * 60, .12), .4) for i in range(12)], (9, 3.6, wind(1.4), .45),
    (9, 3.9, L('riser'), .35), 
    # 10 the Flamingo Revolution
    (10, 0.9, L('stamp'), .35), *[(10, 0.1 + i * 0.2, step(), .25) for i in range(5)],
    (10, 4.55, slap(), .6), (10, 5.75, L('swipe'), .5), (10, 5.95, stomps(1.7), .55),
    (10, 7.75, L('riser'), .3), (10, 9.55, L('whoosh'), .5), 
    (10, 10.6, L('stamp'), .3),
    # 11 mirror at night
    (11, 0.0, crickets(4.8), .4), (11, 0.4, L('whoosh'), .25), (11, 1.3, scribble(0.8), .45), (11, 2.2, scribble(0.55), .45), (11, 2.95, slap(), .55),
    # 12 night → morning → loop
    (12, 0.0, crickets(2.6), .4), (12, 0.2, snore(2.0), .4), *[(12, 2.1 + i * 0.17, L('tick'), .45) for i in range(5)],
    (12, 3.0, alarm(0.8), .5), (12, 3.85, L('click'), .6), (12, 4.0, L('pop'), .3), (12, 5.8, L('ding'), .35), (12, 7.9, alarm(0.55), .45),
]


def main():
    n = int(DUR * SR); mix = np.zeros(n)
    for sc, lt, snd, g in CUES:
        i = int((SCENE[sc - 1] + lt) * SR)
        if i >= n: continue
        x = fade(np.asarray(snd, float), .002, .01) * g; mix[i:i + len(x)] += x[:n - i]
    b = bed(); mix = mix + 0.30 * b
    mix = np.tanh(mix * 1.1) / np.tanh(1.1)        # gentle soft clip
    st = np.stack([mix, mix], 1)
    pcm = (np.clip(st, -1, 1) * 32767 * .9).astype(np.int16)
    w = wave.open(os.path.join(ROOT, 'sound.wav'), 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes()); w.close()
    print('wrote sound.wav', round(n / SR, 2), 's,', len(CUES), 'cues + lo-fi bed')


if __name__ == '__main__':
    main()
