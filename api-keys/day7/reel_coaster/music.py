#!/usr/bin/env python3
"""Original 120 BPM track for the coaster reel. Drop at 9.0s (coaster plunge).
Writes audio/music.wav (44.1 kHz stereo)."""
import numpy as np, wave

SR, BPM, DUR = 44100, 120, 27.0
BEAT = 60 / BPM
N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)

def note(m): return 440 * 2 ** ((m - 69) / 12)
def env(n, a=0.005, d=0.2, s=0.0):
    t = np.arange(n) / SR
    e = np.minimum(1, t / a) * (s + (1 - s) * np.exp(-t / d))
    return e
def add(sig, t0, pan=0.0, gain=1.0):
    i = int(t0 * SR)
    if i >= N: return
    sig = sig[: N - i] * gain
    L[i:i + len(sig)] += sig * (1 - pan) ** 0.5 if pan > 0 else sig
    R[i:i + len(sig)] += sig * (1 + pan) ** 0.5 if pan < 0 else sig

def kick():
    n = int(0.35 * SR); t = np.arange(n) / SR
    f = 50 + 120 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)
def clap():
    n = int(0.25 * SR); t = np.arange(n) / SR
    return rng.normal(0, 1, n) * np.exp(-t * 18) * 0.5
def hat(open_=False):
    n = int((0.18 if open_ else 0.05) * SR)
    x = rng.normal(0, 1, n); x = np.diff(np.concatenate([[0], x]))
    return x * env(n, 0.001, 0.06 if open_ else 0.015) * 0.25
def saw(freq, length, cutoff=0.5):
    n = int(length * SR); t = np.arange(n) / SR
    x = 2 * ((t * freq) % 1) - 1
    # one-pole lowpass
    y = np.zeros(n); a = cutoff; acc = 0.0
    for i in range(0, n, 1):
        acc += a * (x[i] - acc); y[i] = acc
    return y
def pluck(freq, length=0.25):
    n = int(length * SR); t = np.arange(n) / SR
    x = np.sign(np.sin(2 * np.pi * freq * t)) * 0.5 + np.sin(2 * np.pi * freq * 2 * t) * 0.3
    return x * env(n, 0.002, 0.08)
def pad(freqs, length):
    n = int(length * SR); t = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 1.005 * t) for f in freqs)
    e = np.minimum(1, t / 0.4) * np.minimum(1, (length - t) / 0.4)
    return x * e / len(freqs) * 0.18

# Am  F  C  G  (2 s each)
CH = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
BASS = [45, 41, 48, 43]
ARP = [0, 1, 2, 1, 2, 0, 1, 2]

def section(t0, t1, kick_on, full):
    t = t0
    while t < t1 - 1e-6:
        b = round((t) / BEAT)
        ci = (b // 4) % 4
        if kick_on: add(kick(), t, gain=0.9)
        if full and b % 2 == 1: add(clap(), t, gain=0.8)
        add(hat(), t + BEAT / 2, pan=0.3)
        if full: add(hat(), t + BEAT / 4, pan=-0.3, gain=0.6); add(hat(), t + 3 * BEAT / 4, pan=-0.3, gain=0.6)
        # bass 8ths
        if full:
            for k in range(2):
                bs = saw(note(BASS[ci]), BEAT / 2 * 0.9, 0.08) * env(int(BEAT / 2 * 0.9 * SR), 0.003, 0.15, 0.4)
                add(bs, t + k * BEAT / 2, gain=0.5)
        # arp 16ths
        for k in range(4 if full else 2):
            step = (b * 4 + k) % 8
            fr = note(CH[ci][ARP[step] % 3] + 12)
            add(pluck(fr, 0.2), t + k * BEAT / (4 if full else 2), pan=0.4 if k % 2 else -0.4, gain=0.16)
        if b % 4 == 0:
            add(pad([note(m) for m in CH[ci]], 4 * BEAT), t)
        t += BEAT

# 0-6 intro: hats + soft arp + pad, light kick from 2s ("turn with the beat")
section(0.0, 2.0, False, False)
section(2.0, 6.0, True, False)
# 6-9 build: snare roll + riser
section(6.0, 9.0, True, False)
for i, t in enumerate(np.arange(6.0, 9.0, BEAT / 4)):
    add(clap(), t, gain=0.15 + 0.5 * (t - 6) / 3)
n = int(3 * SR); tt = np.arange(n) / SR
riser = rng.normal(0, 1, n) * (tt / 3) ** 2 * 0.25 + np.sin(2 * np.pi * np.cumsum(200 + 1200 * (tt / 3) ** 2) / SR) * (tt / 3) * 0.12
add(riser, 6.0)
# 9-27 drop
crash = rng.normal(0, 1, int(1.5 * SR)) * env(int(1.5 * SR), 0.001, 0.5) * 0.35
for t in (9.0, 17.0, 23.5):
    add(crash, t); add(kick(), t, gain=1.0)
section(9.0, 22.5, True, True)
# 22.5-23.5 short build into splash
section(22.5, 23.5, False, False)
for t in np.arange(22.5, 23.5, BEAT / 4): add(clap(), t, gain=0.4)
section(23.5, 26.0, True, True)
# outro hit
add(kick(), 26.0, gain=1.0); add(crash, 26.0)
add(pad([note(57), note(64), note(69)], 1.0) * 2, 26.0)

mix = np.stack([L, R], 1)
mix /= np.max(np.abs(mix)) * 1.12
fade = int(0.6 * SR); mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
pcm = (mix * 32767).astype(np.int16)
with wave.open("audio/music.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("wrote audio/music.wav", DUR, "s")
