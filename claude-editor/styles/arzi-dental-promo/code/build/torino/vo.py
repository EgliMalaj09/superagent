"""Video 1 Torino swap (same method as the Lugano take 3): keep the real mix (music untouched), remove the
old voice via a per-channel Wiener-fitted voice chain, add the new voice through
the same chain. Only 40.0-44.22 s changes; everything else stays bit-identical."""
import numpy as np, subprocess, os, wave

SR = 48000
def load(f, ch):
    b = subprocess.run(["tools/ffmpeg", "-v", "error", "-i", os.path.expanduser(f), "-f", "f32le", "-ac", str(ch), "-ar", str(SR), "-"], capture_output=True).stdout
    return np.frombuffer(b, np.float32).reshape(-1, ch).astype(np.float64)

mix = load("build/rec43/mix52.wav", 2); v = load("build/rec43/voice52.wav", 1)[:, 0]
wa = load("build/torino/take_clean.wav", 1)[:, 0]
N = min(len(mix), len(v)); mix, v = mix[:N], v[:N]
PRE, L = 256, 4096

def wiener(x, y, a, b, n=8192):
    Sxy = 0; Sxx = 0; w = np.hanning(n)
    for i in range(int(a * SR), int(b * SR) - n, n // 4):
        X = np.fft.rfft(x[i:i + n] * w); Y = np.fft.rfft(y[i:i + n] * w)
        Sxy = Sxy + Y * np.conj(X); Sxx = Sxx + np.abs(X) ** 2
    h = np.fft.irfft(Sxy / (Sxx + 1e-6 * np.max(Sxx)))
    h = np.concatenate([h[-PRE:], h[: L - PRE]])
    return h * np.concatenate([np.hanning(2 * PRE)[:PRE], np.ones(L - 2 * PRE), np.hanning(2 * PRE)[PRE:]])

def conv(x, h): return np.convolve(x, h)[PRE: PRE + len(x)]

# fit the chain on the voice section nearest the edit (voice level/EQ may vary over the reel)
H = [wiener(v, mix[:, c], 30.0, 47.5) for c in range(2)]
R0, R1 = int(40.0 * SR), int(44.22 * SR)
res = np.stack([mix[:, c] - conv(v, H[c]) for c in range(2)], 1)

db = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)
for a, b in [(40.3, 41.2), (41.7, 42.9), (43.3, 44.1), (38.0, 39.9)]:
    s = slice(int(a * SR), int(b * SR)); print("%.1f-%.1f mix %.1f dB -> without old voice %.1f dB" % (a, b, db(mix[s]), db(res[s])))

# new voice pieces (tone-matched, level-matched to the old words, pauses at the old pacing)
def spec(x):
    n = 4096; w = np.hanning(n)
    return np.sqrt(np.mean([np.abs(np.fft.rfft(x[i:i + n] * w)) ** 2 for i in range(0, len(x) - n, n // 2)], 0))
so = spec(v[int(39.9 * SR):int(47.0 * SR)]); sw = spec(wa[int(0.05 * SR):int(3.6 * SR)])
fq = np.fft.rfftfreq(4096, 1 / SR); g = so / np.maximum(sw, 1e-12)
gs = np.array([np.exp(np.mean(np.log(g[(fq >= f / 2 ** (1 / 6)) & (fq <= f * 2 ** (1 / 6))] + 1e-12))) if f > 0 else 1 for f in fq])
gs /= np.exp(np.mean(np.log(gs[(fq > 300) & (fq < 3000)])))
gs = np.clip(gs, 10 ** (-8 / 20), 10 ** (8 / 20)); gs[fq < 120] = gs[np.argmin(np.abs(fq - 120))]
fir = np.roll(np.fft.irfft(gs), 2048) * np.hanning(4096)
waq = np.convolve(wa, fir, mode="same")
P = [(0.02, 3.62, 3.14, 43.38)]
OLD = [(40.06, 44.10)]
vnew = np.zeros(N)
for (s0, s1, anc, tgt), (o0, o1) in zip(P, OLD):
    x = waq[int(s0 * SR):int(s1 * SR)].copy()
    f = int(0.04 * SR); x[:f] *= np.linspace(0, 1, f); x[-f:] *= np.linspace(1, 0, f)
    x *= np.sqrt(np.mean(v[int(o0 * SR):int(o1 * SR)] ** 2)) / np.sqrt(np.mean(x ** 2)) * 10 ** (-1 / 20)
    at = int((tgt - (anc - s0)) * SR); vnew[at:at + len(x)] += x
newpart = np.stack([res[:, c] + conv(vnew, H[c]) for c in range(2)], 1)

w = np.zeros(N); f = int(0.04 * SR)
w[R0:R1] = 1; w[R0:R0 + f] = np.linspace(0, 1, f); w[R1 - f:R1] = np.linspace(1, 0, f)
out = mix * (1 - w)[:, None] + newpart * w[:, None]
pk = np.abs(out[R0:R1]).max(); print("region peak %.3f" % pk)
if pk > 0.99: out[R0:R1] = np.tanh(out[R0:R1] / 0.99) * 0.99
wv = wave.open("build/torino/mix_torino.wav", "w"); wv.setnchannels(2); wv.setsampwidth(2); wv.setframerate(SR)
wv.writeframes((np.clip(out, -1, 1) * 32767).astype(np.int16).tobytes()); wv.close()
r = res[R0:R1].mean(1); r = r / np.abs(r).max() * 0.9
wv = wave.open("build/torino/residual.wav", "w"); wv.setnchannels(1); wv.setsampwidth(2); wv.setframerate(SR)
wv.writeframes((r * 32767).astype(np.int16).tobytes()); wv.close()
