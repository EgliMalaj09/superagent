#!/usr/bin/env python3
"""sfx-synth.py: synthesise the Reel sound kit from scratch (numpy only). Free, no downloads, no licence to track.

Writes 48 kHz mono 16-bit WAVs, each peak-normalised to -3 dBFS with its transient at the very start (so a sound placed
at t lands at t; no silence to trim):
  pop     a short bubbly pop (logos, emojis, a pill landing)
  click   a dry UI click (a cursor click, a toggle)
  tick    a tiny tick (a counter, a list item)
  whoosh  filtered noise sweep, 0.45 s (a cut to B-roll, a transition; never under plain text)
  swipe   a fast 0.2 s air swipe (a slide-in)
  ding    a bright bell (a number landing, "done")
  typing  ~1.6 s of key taps (trim with data-duration)
  riser   1.2 s rising tone + noise (tension into a reveal; place it to END on the reveal)
  boom    a sub drop / impact (the punchline, the big reveal; use rarely)

Usage: python3 sfx-synth.py --out library/sfx [--only pop,ding] [--seed 7]
"""
import argparse, os, struct, wave
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument("--out", required=True)
ap.add_argument("--only", default="")
ap.add_argument("--seed", type=int, default=7)
a = ap.parse_args()
SR = 48000
rng = np.random.default_rng(a.seed)
T = lambda d: np.arange(int(SR * d)) / SR

def env(n, attack=0.002, decay=0.1):
    t = np.arange(n) / SR
    e = np.exp(-t / decay)
    k = max(1, int(attack * SR))
    e[:k] *= np.linspace(0, 1, k)
    return e

def lowpass(x, cutoff):
    """one-pole low-pass; cutoff may be an array (a sweep)."""
    c = np.broadcast_to(np.asarray(cutoff, dtype=float), x.shape)
    al = 1 - np.exp(-2 * np.pi * c / SR)
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)):
        acc += al[i] * (x[i] - acc); y[i] = acc
    return y

def highpass(x, cutoff):
    return x - lowpass(x, cutoff)

def pop():
    t = T(0.12); f = 900 * np.exp(-t * 28) + 260
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.001, 0.035)

def click():
    t = T(0.04); n = rng.standard_normal(len(t))
    return highpass(n, 2500) * env(len(t), 0.0005, 0.006) + 0.5 * np.sin(2 * np.pi * 3200 * t) * env(len(t), 0.0005, 0.004)

def tick():
    t = T(0.03)
    return np.sin(2 * np.pi * 4200 * t) * env(len(t), 0.0003, 0.005)

def whoosh(d=0.45):
    t = T(d); n = rng.standard_normal(len(t))
    sweep = 300 + 5000 * np.sin(np.pi * t / d) ** 2
    shape = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.5
    return highpass(lowpass(n, sweep), 150) * shape

def swipe():
    return whoosh(0.2)

def ding():
    t = T(1.2); e = env(len(t), 0.001, 0.35)
    return (np.sin(2 * np.pi * 1318.5 * t) + 0.5 * np.sin(2 * np.pi * 2637 * t) + 0.25 * np.sin(2 * np.pi * 3955 * t)) * e

def typing():
    out = np.zeros(int(SR * 1.6)); pos = 0
    while pos < len(out) - 3000:
        k = click() * rng.uniform(0.5, 1.0); k = lowpass(k, rng.uniform(3000, 7000))
        out[pos:pos + len(k)] += k[: len(out) - pos]
        pos += int(SR * rng.uniform(0.06, 0.13))
    return out

def riser():
    t = T(1.2); f = 180 * (2 ** (t / 1.2 * 2.5))
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR)
    noise = highpass(rng.standard_normal(len(t)), 1500) * 0.4
    shape = (t / 1.2) ** 2
    return (tone + noise) * shape

def boom():
    t = T(1.0); f = 90 * np.exp(-t * 4) + 38
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.002, 0.30)
    hit = lowpass(rng.standard_normal(len(t)), 900) * env(len(t), 0.001, 0.03)
    return body + 0.6 * hit

KIT = {"pop": pop, "click": click, "tick": tick, "whoosh": whoosh, "swipe": swipe, "ding": ding,
       "typing": typing, "riser": riser, "boom": boom}
only = [x for x in a.only.split(",") if x]
os.makedirs(a.out, exist_ok=True)
for name, fn in KIT.items():
    if only and name not in only:
        continue
    x = fn().astype(np.float64)
    fade = min(len(x), int(SR * 0.004)); x[-fade:] *= np.linspace(1, 0, fade)
    x = x / (np.max(np.abs(x)) + 1e-9) * 10 ** (-3 / 20)
    pcm = (x * 32767).astype("<i2")
    path = os.path.join(a.out, name + ".wav")
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    print("wrote %s (%.2f s)" % (path, len(x) / SR))
