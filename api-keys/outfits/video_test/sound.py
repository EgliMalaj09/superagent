#!/usr/bin/env python3
"""Original background track + subtle SFX for the outfit-swap reel.
Writes audio_clean.wav (music + light sfx) and audio_edit.wav (adds soft transition hits)."""
import numpy as np, wave

SR, DUR = 44100, 13.0417
N = int(SR * DUR)
rng = np.random.default_rng(3)
BPM = 120.0
BEAT = 60 / BPM
OFF = 0.125            # grid offset so beats land near the main cuts (4.625, 6.125, 7.625)
CUTS = [2.417, 4.042, 4.625, 6.125, 7.583, 8.333, 9.458, 10.042, 10.542, 11.25, 11.625]
SET_CHANGES = [4.625, 9.375]
WHIP = 11.25           # fast whip-pan
PUSH = 8.333           # sunglasses push-in


def env(n, a, d, s=0.0):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * (s + (1 - s) * np.exp(-t / d))


def lp(x, a):
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)):
        acc += a * (x[i] - acc); y[i] = acc
    return y


class Bus:
    def __init__(self): self.L = np.zeros(N); self.R = np.zeros(N)
    def add(self, sig, t0, gain=1.0, pan=0.0):
        i = int(t0 * SR)
        if i >= N or i + len(sig) <= 0: return
        if i < 0: sig = sig[-i:]; i = 0
        sig = sig[: N - i] * gain
        self.L[i:i + len(sig)] += sig * min(1, 1 - pan)
        self.R[i:i + len(sig)] += sig * min(1, 1 + pan)


def note(m): return 440 * 2 ** ((m - 69) / 12)

def kick():
    n = int(0.3 * SR); t = np.arange(n) / SR
    f = 45 + 90 * np.exp(-t * 35)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 10)

def hat(op=False):
    n = int((0.12 if op else 0.04) * SR)
    x = np.diff(np.concatenate([[0], rng.normal(0, 1, n)]))
    return x * env(n, 0.001, 0.05 if op else 0.012) * 0.18

def clap():
    n = int(0.2 * SR)
    return lp(rng.normal(0, 1, n), 0.5) * env(n, 0.002, 0.06) * 0.35

def bass(freq, length):
    n = int(length * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * freq * 2 * t)
    return x * env(n, 0.005, 0.18, 0.5) * np.minimum(1, (length - t) / 0.03)

def pad(freqs, length):
    n = int(length * SR); t = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * f * t + np.sin(2 * np.pi * 0.3 * t)) + 0.4 * np.sin(2 * np.pi * f * 1.004 * t) for f in freqs)
    e = np.minimum(1, t / 0.8) * np.minimum(1, (length - t) / 0.8)
    return x * e / len(freqs) * 0.10

def whoosh(length, up=True):
    n = int(length * SR); t = np.arange(n) / SR
    x = rng.normal(0, 1, n)
    sweep = (t / length) if up else (1 - t / length)
    y = np.zeros(n); acc = 0.0
    for i in range(n):
        a = 0.02 + 0.35 * sweep[i]
        acc += a * (x[i] - acc); y[i] = acc
    e = np.sin(np.pi * np.clip(t / length, 0, 1)) ** 1.5
    return y * e * 0.9

def soft_hit():
    n = int(0.6 * SR); t = np.arange(n) / SR
    body = np.sin(2 * np.pi * 55 * t) * np.exp(-t * 7)
    air = lp(rng.normal(0, 1, n), 0.25) * np.exp(-t * 12) * 0.4
    return (body + air) * 0.6

def shutter():
    n = int(0.09 * SR); t = np.arange(n) / SR
    c1 = rng.normal(0, 1, n) * np.exp(-t * 180)
    c2 = np.roll(rng.normal(0, 1, n) * np.exp(-t * 220), int(0.04 * SR))
    return lp(c1 + 0.7 * c2, 0.6) * 0.35

def ambience():
    x = lp(rng.normal(0, 1, N), 0.015) * 2.2           # distant city rumble
    x += lp(rng.normal(0, 1, N), 0.12) * 0.06          # air
    return x * 0.07

def footsteps(t0, t1, step=0.5):
    out = []
    t = t0
    while t < t1:
        n = int(0.07 * SR); tt = np.arange(n) / SR
        s = lp(rng.normal(0, 1, n), 0.35) * np.exp(-tt * 70) * 0.22 + np.sin(2 * np.pi * 120 * tt) * np.exp(-tt * 60) * 0.12
        out.append((s, t)); t += step
    return out


def music(bus):
    # Am9 -> Fmaj7 -> Dm9 -> Em7, deep minimal Berlin house, low-key
    chords = [[57, 60, 64, 71], [53, 57, 60, 64], [50, 53, 57, 64], [52, 55, 59, 62]]
    roots = [33, 29, 26, 28]
    bar = 4 * BEAT
    t = OFF - bar  # start one bar early so the grid is aligned
    k = 0
    while t < DUR:
        ci = k % 4
        bus.add(pad([note(m) for m in chords[ci]], bar + 0.6), t, gain=1.0)
        for b in range(4):
            tb = t + b * BEAT
            intro = tb < 2.4                            # first shot: no kick, just pad + hats
            if not intro: bus.add(kick(), tb, gain=0.75)
            bus.add(hat(), tb + BEAT / 2, gain=1.0, pan=0.25)
            if not intro and b in (1, 3): bus.add(clap(), tb, gain=0.6)
            if not intro:
                bus.add(bass(note(roots[ci]), BEAT * 0.45), tb + BEAT / 2, gain=0.42)
        t += bar; k += 1


def build(edit):
    m, fx = Bus(), Bus()
    music(m)
    amb = ambience(); fx.L += amb; fx.R += amb
    # quiet footsteps on cobblestones where she walks
    for s, t in footsteps(0.0, 2.4, 0.48) + footsteps(9.5, 10.5, 0.5) + footsteps(12.3, 13.0, 0.48):
        fx.add(s, t, gain=0.8, pan=rng.uniform(-0.2, 0.2))
    fx.add(whoosh(0.42), WHIP - 0.12, gain=0.55)        # whip-pan
    fx.add(whoosh(0.5), PUSH - 0.05, gain=0.35)         # push-in
    fx.add(whoosh(0.9), 6.10, gain=0.2)                 # low-angle camera rotation
    fx.add(shutter(), 12.95, gain=0.6)                  # camera click at the very end
    if edit:
        for t in SET_CHANGES:
            fx.add(whoosh(0.35), t - 0.33, gain=0.45)
            fx.add(soft_hit(), t, gain=0.7)
        for t in CUTS:
            if all(abs(t - s) > 0.2 for s in SET_CHANGES) and abs(t - WHIP) > 0.2:
                fx.add(shutter(), t, gain=0.35, pan=rng.uniform(-0.3, 0.3))
    # mix: music under, gentle duck around hits
    duck = np.ones(N)
    for t in (SET_CHANGES if edit else []):
        i = int(t * SR); w = int(0.4 * SR)
        duck[i:i + w] = np.minimum(duck[i:i + w], 0.6 + 0.4 * np.linspace(0, 1, len(duck[i:i + w])))
    L = m.L * duck * 0.9 + fx.L
    R = m.R * duck * 0.9 + fx.R
    mix = np.stack([L, R], 1)
    fi, fo = int(0.25 * SR), int(0.6 * SR)
    mix[:fi] *= np.linspace(0, 1, fi)[:, None]
    mix[-fo:] *= np.linspace(1, 0, fo)[:, None]
    mix /= np.max(np.abs(mix)) * 1.15
    return mix


for name, edit in (("audio_clean.wav", False), ("audio_edit.wav", True)):
    pcm = (build(edit) * 32767).astype(np.int16)
    with wave.open(name, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    print("wrote", name)
