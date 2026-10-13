// Synthesizes a dark documentary music bed + 6 SFX as WAV files into public/audio/.
//   node scripts/generate-audio.mjs
// Edit PLAN to match the master timeline (absolute seconds, voiceover starts at 2.0s).
import { writeFileSync, mkdirSync } from "fs";

const PLAN = {
  total: 60, // video length in seconds = TOTAL_FRAMES / 30
  warmUntil: 14, // warm major-chord "promise" section ends here (the mask slips)
  heartbeatFrom: 20, // heartbeat starts (usually with the evidence / list scene)
  pulses: [[33, 45]], // low ostinato sections (money montage, final build)
  eerie: [45, 56], // high surveillance tones, or null
  climax: 57, // the biggest hit (title slam): everything builds to here, then drops
};

const SR = 44100;
const OUT = new URL("../public/audio/", import.meta.url).pathname;
mkdirSync(OUT + "sfx", { recursive: true });
const { total: TOTAL, warmUntil: W, climax: C } = PLAN;

let seed = 1337;
const rnd = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const noise = () => rnd() * 2 - 1;
const env = (t, pts) => {
  if (t <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    if (t <= pts[i][0]) {
      const [t0, v0] = pts[i - 1], [t1, v1] = pts[i];
      return t1 === t0 ? v1 : v0 + ((t - t0) / (t1 - t0)) * (v1 - v0);
    }
  }
  return pts[pts.length - 1][1];
};
const lpCoef = (fc) => 1 - Math.exp((-2 * Math.PI * fc) / SR);

function writeWav(name, L, R = L) {
  const n = L.length;
  const buf = Buffer.alloc(44 + n * 4);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write("WAVE", 8);
  buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(n * 4, 40);
  for (let i = 0, o = 44; i < n; i++, o += 4) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i])) * 32767), o);
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i])) * 32767), o + 2);
  }
  writeFileSync(OUT + name, buf);
  console.log("wrote", name, (n / SR).toFixed(2) + "s");
}

function finish(L, R, peak = 0.9, drive = 1.3) {
  let m = 0;
  for (let i = 0; i < L.length; i++) m = Math.max(m, Math.abs(L[i]), Math.abs(R[i]));
  const g = peak / (m || 1), k = Math.tanh(drive);
  for (let i = 0; i < L.length; i++) {
    L[i] = (Math.tanh(L[i] * g * drive) / k) * peak;
    R[i] = (Math.tanh(R[i] * g * drive) / k) * peak;
  }
}

function reverb(input, offset) {
  const out = new Float32Array(input.length);
  const combs = [1557, 1617, 1491, 1422].map((d) => ({ b: new Float32Array(d + offset), i: 0, f: 0 }));
  const aps = [556, 225].map((d) => ({ b: new Float32Array(d + offset), i: 0 }));
  for (let n = 0; n < input.length; n++) {
    let s = 0;
    for (const c of combs) {
      const y = c.b[c.i];
      c.f = y * 0.75 + c.f * 0.25;
      c.b[c.i] = input[n] * 0.015 + c.f * 0.86;
      c.i = (c.i + 1) % c.b.length;
      s += y;
    }
    for (const a of aps) {
      const y = a.b[a.i];
      a.b[a.i] = s + y * 0.5;
      a.i = (a.i + 1) % a.b.length;
      s = y - s * 0.5;
    }
    out[n] = s;
  }
  return out;
}

// ---------------------------------------------------------------- MUSIC BED
function music() {
  const N = Math.floor(TOTAL * SR);
  const padL = new Float32Array(N), padR = new Float32Array(N);
  const dryL = new Float32Array(N), dryR = new Float32Array(N);

  const padVoice = (freq, gainEnv, cutoffEnv, pan, detune) => {
    let ph = rnd(), a = 0, b = 0;
    const gl = Math.cos(((pan + 1) * Math.PI) / 4), gr = Math.sin(((pan + 1) * Math.PI) / 4);
    for (let n = 0; n < N; n++) {
      const t = n / SR;
      const g = gainEnv(t);
      if (g <= 0) { ph += freq / SR; continue; }
      const f = freq * Math.pow(2, detune / 1200) * (1 + 0.0025 * Math.sin(2 * Math.PI * 0.21 * t + pan));
      ph += f / SR;
      const x = 2 * (ph % 1) - 1;
      const c = lpCoef(cutoffEnv(t));
      a += c * (x - a); b += c * (a - b);
      padL[n] += b * g * gl; padR[n] += b * g * gr;
    }
  };
  const chord = (notes, gainPts, cutPts, level) => {
    for (const fq of notes)
      for (const [pan, det] of [[-0.7, -8], [0, 0], [0.7, 8]])
        padVoice(fq, (t) => env(t, gainPts) * level, (t) => env(t, cutPts), pan, det);
  };

  // Warm D major "promise"
  chord([73.42, 110.0, 146.83, 185.0, 220.0],
    [[0, 0], [2.5, 0.6], [W - 1.5, 1], [W, 0.7], [W + 1.6, 0]],
    [[0, 500], [W * 0.6, 1300], [W + 1, 900]], 0.05);
  // Cold D minor "regime" — builds to the climax
  chord([73.42, 110.0, 146.83, 174.61],
    [[W + 0.2, 0], [W + 1.8, 0.7], [C - 0.15, 1.2], [C, 0.6], [TOTAL, 0]],
    [[W + 0.2, 350], [(W + C) / 2, 900], [C - 0.05, 3200], [C + 2, 500]], 0.05);
  // Minor-second tension (Eb)
  chord([155.56, 311.13],
    [[W + 1.4, 0], [W + 7, 0.25], [C - 0.05, 0.9], [C, 0]],
    [[W, 500], [C, 2000]], 0.035);

  // Sub drone
  for (let n = 0; n < N; n++) {
    const t = n / SR;
    const g = env(t, [[0, 0], [1.5, 0.45], [W, 0.3], [W + 2, 0.55], [C - 0.05, 0.9], [C + 0.05, 0.35], [TOTAL, 0]]);
    const s = Math.sin(2 * Math.PI * 36.71 * t) * 0.8 + Math.sin(2 * Math.PI * 73.42 * t) * 0.35;
    dryL[n] += s * g * 0.5; dryR[n] += s * g * 0.5;
  }

  // Heartbeat, accelerating into the climax
  const thump = (t0, amp) => {
    const len = Math.floor(0.35 * SR), s0 = Math.floor(t0 * SR);
    let ph = 0;
    for (let i = 0; i < len && s0 + i < N; i++) {
      const tt = i / SR;
      ph += (45 + 45 * Math.exp(-tt * 25)) / SR;
      const v = Math.sin(2 * Math.PI * ph) * Math.exp(-tt * 14) * amp;
      dryL[s0 + i] += v; dryR[s0 + i] += v;
    }
  };
  for (let t = PLAN.heartbeatFrom; t < C - 0.15; ) {
    const bpm = env(t, [[PLAN.heartbeatFrom, 66], [C, 118]]);
    const amp = env(t, [[PLAN.heartbeatFrom, 0.35], [C, 0.8]]);
    thump(t, amp); thump(t + 0.17, amp * 0.6);
    t += 60 / bpm;
  }

  // Low ostinato pulses
  const pluck = (t0, freq, amp) => {
    const len = Math.floor(0.28 * SR), s0 = Math.floor(t0 * SR);
    let ph = 0, a = 0, b = 0;
    for (let i = 0; i < len && s0 + i < N; i++) {
      const tt = i / SR;
      ph += freq / SR;
      const c = lpCoef(250 + 1400 * Math.exp(-tt * 18));
      const x = 2 * (ph % 1) - 1;
      a += c * (x - a); b += c * (a - b);
      const v = b * Math.exp(-tt * 9) * amp;
      padL[s0 + i] += v * 0.9; padR[s0 + i] += v;
      dryL[s0 + i] += v * 0.6; dryR[s0 + i] += v * 0.6;
    }
  };
  const pattern = [73.42, 73.42, 73.42, 77.78, 73.42, 73.42, 87.31, 77.78];
  for (const [from, to] of PLAN.pulses) {
    let k = 0;
    for (let t = from; t < Math.min(to, C); t += 0.3, k++) pluck(t, pattern[k % 8], env(t, [[from, 0.12], [to, 0.25]]));
  }

  // Eerie surveillance tones
  if (PLAN.eerie) {
    const [e0, e1] = PLAN.eerie;
    for (let n = Math.floor(e0 * SR); n < Math.min(N, Math.floor(e1 * SR)); n++) {
      const t = n / SR;
      const g = env(t, [[e0, 0], [e0 + 1.2, 0.035], [e1 - 1.5, 0.035], [e1, 0]]) * (0.6 + 0.4 * Math.sin(2 * Math.PI * 5.5 * t));
      const v = (Math.sin(2 * Math.PI * 1174.66 * t) + 0.6 * Math.sin(2 * Math.PI * 880 * t + 1)) * g;
      padL[n] += v; padR[n] += v * 0.7;
    }
  }

  const wetL = reverb(padL, 0), wetR = reverb(padR, 23);
  const L = new Float32Array(N), R = new Float32Array(N);
  for (let n = 0; n < N; n++) {
    const t = n / SR;
    const fade = Math.min(1, t / 0.5, (TOTAL - t) / 1.5);
    L[n] = (padL[n] * 0.8 + wetL[n] * 0.6 + dryL[n]) * fade;
    R[n] = (padR[n] * 0.8 + wetR[n] * 0.6 + dryR[n]) * fade;
  }
  finish(L, R, 0.9, 1.2);
  writeWav("music.wav", L, R);
}

// ---------------------------------------------------------------- SFX
const sfx = (seconds, fn) => {
  const N = Math.floor(seconds * SR), L = new Float32Array(N), R = new Float32Array(N);
  fn(N, L, R);
  return [L, R];
};

function stamp() {
  const [L, R] = sfx(0.7, (N, L, R) => {
    let ph = 0, hp = 0;
    for (let n = 0; n < N; n++) {
      const t = n / SR;
      ph += (50 + 110 * Math.exp(-t * 30)) / SR;
      const thud = Math.sin(2 * Math.PI * ph) * Math.exp(-t * 11);
      const nz = noise(); hp = nz - hp * 0.6;
      const crack = hp * Math.exp(-t * 70) * 0.8;
      const ring = (Math.sin(2 * Math.PI * 820 * t) + Math.sin(2 * Math.PI * 1290 * t) * 0.6 + Math.sin(2 * Math.PI * 2050 * t) * 0.3) * Math.exp(-t * 9) * 0.08;
      L[n] = thud + crack + ring; R[n] = thud + crack * 0.9 + ring;
    }
  });
  finish(L, R, 0.95, 2);
  writeWav("sfx/stamp.wav", L, R);
}

function boom() {
  const [L, R] = sfx(3.5, (N, L, R) => {
    let ph = 0, a = 0;
    for (let n = 0; n < N; n++) {
      const t = n / SR;
      ph += (28 + 50 * Math.exp(-t * 6)) / SR;
      const sub = Math.sin(2 * Math.PI * ph) * Math.exp(-t * 1.4);
      a += lpCoef(180) * (noise() - a);
      const rumble = a * 3 * Math.exp(-t * 2.2);
      const hit = noise() * Math.exp(-t * 60) * 0.5;
      L[n] = sub + rumble + hit; R[n] = sub + rumble * 0.9 + hit;
    }
  });
  finish(L, R, 0.95, 2.2);
  writeWav("sfx/boom.wav", L, R);
}

function riser() {
  const [L, R] = sfx(3, (N, L, R) => {
    let a = 0, b = 0, ph = 0;
    for (let n = 0; n < N; n++) {
      const t = n / SR, p = t / 3;
      const c = lpCoef(200 * Math.pow(40, p));
      a += c * (noise() - a); b += c * (a - b);
      ph += (90 * Math.pow(10, p)) / SR;
      const v = (b * 1.5 + Math.sin(2 * Math.PI * ph) * 0.35) * Math.pow(p, 2.2);
      L[n] = v; R[n] = v * (0.9 + 0.1 * Math.sin(t * 20));
    }
  });
  finish(L, R, 0.85, 1.4);
  writeWav("sfx/riser.wav", L, R);
}

function whoosh() {
  const [L, R] = sfx(0.8, (N, L, R) => {
    let a = 0, b = 0;
    for (let n = 0; n < N; n++) {
      const t = n / SR, p = t / 0.8;
      const bell = Math.sin(Math.PI * Math.min(1, p * 1.4)) ** 2;
      const c = lpCoef(300 + 5000 * bell);
      a += c * (noise() - a); b += c * (a - b);
      L[n] = (a - b * 0.5) * bell * (1 - p * 0.5);
      R[n] = (a - b * 0.5) * bell * (0.5 + p * 0.5);
    }
  });
  finish(L, R, 0.8, 1.2);
  writeWav("sfx/whoosh.wav", L, R);
}

function shutter() {
  const [L, R] = sfx(0.3, (N, L, R) => {
    for (let n = 0; n < N; n++) {
      const t = n / SR;
      const c1 = noise() * Math.exp(-t * 400);
      const c2 = t > 0.07 ? noise() * Math.exp(-(t - 0.07) * 300) * 0.7 : 0;
      const ping = Math.sin(2 * Math.PI * 3200 * t) * Math.exp(-t * 25) * 0.08;
      L[n] = c1 + c2 + ping; R[n] = c1 * 0.9 + c2 + ping;
    }
  });
  finish(L, R, 0.7, 1.5);
  writeWav("sfx/shutter.wav", L, R);
}

function beep() {
  const [L, R] = sfx(0.5, (N, L, R) => {
    for (let n = 0; n < N; n++) {
      const t = n / SR;
      const on = t < 0.09 || (t > 0.16 && t < 0.25);
      const v = on ? Math.sin(2 * Math.PI * 1400 * t) * 0.5 : 0;
      L[n] = v; R[n] = v;
    }
  });
  finish(L, R, 0.5, 1);
  writeWav("sfx/beep.wav", L, R);
}

music();
stamp();
boom();
riser();
whoosh();
shutter();
beep();
