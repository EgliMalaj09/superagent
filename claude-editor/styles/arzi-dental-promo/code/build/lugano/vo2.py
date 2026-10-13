"""Video 1: rebuild 40.0-44.22 s of the mix with the Lugano take.
mix ~= ducked music + voice-chain(voice).  Ducking curve and voice chain (FIR)
are fitted from the stems, validated on another region, then applied to the
new voice pieces from the WhatsApp take."""
import numpy as np, subprocess, os, wave, sys

SR = 48000
def load(f, ch):
    b = subprocess.run(["tools/ffmpeg", "-v", "error", "-i", os.path.expanduser(f), "-f", "f32le", "-ac", str(ch), "-ar", str(SR), "-"], capture_output=True).stdout
    return np.frombuffer(b, np.float32).reshape(-1, ch).astype(np.float64)

mix = load("build/rec43/mix52.wav", 2); mu = load("build/rec43/music52.wav", 2); v = load("build/rec43/voice52.wav", 1)[:, 0]
wa = load("~/Downloads/WhatsApp Audio 2026-10-06 at 3.51.32 PM.mpeg", 1)[:, 0]
N = min(len(mix), len(mu), len(v)); mix, mu, v = mix[:N], mu[:N], v[:N]
mm = mix.mean(1)

# --- voice chain: Wiener FIR from raw voice to the voice part of the mix ---
L = 2048
def wiener(x, y, n=8192):
    Sxy = 0; Sxx = 0; w = np.hanning(n)
    for i in range(0, len(x) - n, n // 2):
        X = np.fft.rfft(x[i:i + n] * w); Y = np.fft.rfft(y[i:i + n] * w)
        Sxy = Sxy + Y * np.conj(X); Sxx = Sxx + np.abs(X) ** 2
    H = Sxy / (Sxx + 1e-9 * np.max(Sxx))
    h = np.fft.irfft(H)
    return np.concatenate([h[-64:], h[: L - 64]])  # small pre-delay window

def conv(x, h):  # h starts 64 samples early
    y = np.convolve(x, h)[64: 64 + len(x)]
    return y

# iterate: ducking gain <-> voice FIR
W = 2400; nw = N // W
hv = np.zeros(L); hv[64 + 144] = 1.0  # init: 3 ms delay, unity
for it in range(3):
    vp = conv(v, hv)
    gm = np.zeros(nw)
    mum = mu.mean(1)
    for i in range(nw):
        s = slice(i * W, (i + 1) * W)
        r = mm[s] - vp[s]
        gm[i] = max(np.dot(r, mum[s]) / max(np.dot(mum[s], mum[s]), 1e-12), 0)
    gm = np.convolve(gm, np.ones(5) / 5, mode="same")
    G = np.interp(np.arange(N), np.arange(nw) * W + W / 2, gm)
    hv = wiener(v, mm - mum * G)

def err(a, b):
    s = slice(int(a * SR), int(b * SR))
    model = mum[s] * G[s] + conv(v, hv)[s]
    return 20 * np.log10(np.sqrt(np.mean(mm[s] ** 2))), 20 * np.log10(np.sqrt(np.mean((mm[s] - model) ** 2)))
for a, b in [(28, 37.5), (40, 44.22), (44.3, 47)]:
    print("model fit %.1f-%.1f s: mix %.1f dB, error %.1f dB" % ((a, b) + err(a, b)))

# --- new voice pieces from the WhatsApp take (pauses tightened to the old pacing) ---
def spec(x):
    n = 4096; w = np.hanning(n)
    return np.sqrt(np.mean([np.abs(np.fft.rfft(x[i:i + n] * w)) ** 2 for i in range(0, len(x) - n, n // 2)], 0))
so = spec(v[int(39.9 * SR):int(47.0 * SR)]); sw = spec(wa[int(16.5 * SR):int(22.2 * SR)])
fq = np.fft.rfftfreq(4096, 1 / SR); g = so / np.maximum(sw, 1e-12)
gs = np.array([np.exp(np.mean(np.log(g[(fq >= f / 2 ** (1 / 6)) & (fq <= f * 2 ** (1 / 6))] + 1e-12))) if f > 0 else 1 for f in fq])
gs /= np.exp(np.mean(np.log(gs[(fq > 300) & (fq < 3000)])))
gs = np.clip(gs, 10 ** (-8 / 20), 10 ** (8 / 20)); gs[fq < 120] = gs[np.argmin(np.abs(fq - 120))]
fir = np.roll(np.fft.irfft(gs), 2048) * np.hanning(4096)
waq = np.convolve(wa, fir, mode="same")

P = [(16.58, 17.80, 16.64, 40.12), (18.54, 19.92, 18.60, 41.64), (21.16, 22.12, 21.46, 43.52)]
OLD = [(40.06, 41.28), (41.58, 42.98), (43.28, 44.10)]
vnew = v.copy()
R0, R1 = int(40.0 * SR), int(44.22 * SR)
vnew[R0:R1] = 0
for (s0, s1, anc, tgt), (o0, o1) in zip(P, OLD):
    x = waq[int(s0 * SR):int(s1 * SR)].copy()
    f = int(0.015 * SR); x[:f] *= np.linspace(0, 1, f); x[-f:] *= np.linspace(1, 0, f)
    x *= np.sqrt(np.mean(v[int(o0 * SR):int(o1 * SR)] ** 2)) / np.sqrt(np.mean(x ** 2))
    at = int((tgt - (anc - s0)) * SR); vnew[at:at + len(x)] += x

# --- ducking taken only from windows where the voice is silent (both old and new) ---
venv = np.sqrt(np.convolve(np.maximum(v, 0) ** 2 + np.minimum(v, 0) ** 2, np.ones(W) / W, mode="same"))
nenv = np.sqrt(np.convolve(vnew ** 2, np.ones(W) / W, mode="same"))
quiet = (20 * np.log10(venv + 1e-12) < -50) & (20 * np.log10(nenv + 1e-12) < -50)
cent = np.arange(nw) * W + W // 2
gq = []; tq = []
for i in range(nw):
    c = cent[i]
    if c < int(37.5 * SR) or c > int(47.5 * SR) or not quiet[c]: continue
    s = slice(i * W, (i + 1) * W)
    gq.append(np.dot(mm[s], mum[s]) / max(np.dot(mum[s], mum[s]), 1e-12)); tq.append(c)
G = np.interp(np.arange(N), tq, np.convolve(gq, np.ones(3) / 3, mode="same"))
print("gap ducking gains:", np.round(gq, 2))

# --- rebuild region: music part from the mix model + new voice through the chain ---
vp_new = conv(vnew, hv)
region = mu * G[:, None] + vp_new[:, None]
w = np.zeros(N); f = int(0.04 * SR)
w[R0:R1] = 1; w[R0:R0 + f] = np.linspace(0, 1, f); w[R1 - f:R1] = np.linspace(1, 0, f)
out = mix * (1 - w)[:, None] + region * w[:, None]
pk = np.abs(out[R0:R1]).max(); print("region peak %.3f" % pk)
out[R0:R1] = np.tanh(out[R0:R1] / 0.99) * 0.99 if pk > 0.99 else out[R0:R1]
wv = wave.open("build/lugano/mix_lugano.wav", "w"); wv.setnchannels(2); wv.setsampwidth(2); wv.setframerate(SR)
wv.writeframes((out * 32767).astype(np.int16).tobytes()); wv.close()
# what's left of the OLD voice if we rebuild the region with silence instead of the new voice
leak = mix[R0:R1].mean(1) - (mu * G[:, None])[R0:R1].mean(1) - conv(v, hv)[R0:R1]
print("old-voice leftover after model: %.1f dB (music part %.1f dB)" % (20 * np.log10(np.sqrt(np.mean(leak ** 2))), 20 * np.log10(np.sqrt(np.mean(((mu * G[:, None])[R0:R1].mean(1)) ** 2)))))
