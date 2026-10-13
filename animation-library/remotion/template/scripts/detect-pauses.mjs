// Prints the silent gaps in a voiceover so scenes and cues can be pinned to exact words.
//   node scripts/detect-pauses.mjs public/audio/voiceover.mp3 [minGapSeconds=0.3]
// Uses macOS `afconvert` to decode (no ffmpeg needed).
import { execFileSync } from "child_process";
import { readFileSync, mkdtempSync } from "fs";
import { tmpdir } from "os";
import path from "path";

const [input, minGapArg] = process.argv.slice(2);
const minGap = Number(minGapArg ?? 0.3);
const wav = path.join(mkdtempSync(path.join(tmpdir(), "vo-")), "vo.wav");
execFileSync("afconvert", ["-f", "WAVE", "-d", "LEI16@16000", "-c", "1", input, wav]);

const buf = readFileSync(wav);
let off = 12;
while (buf.toString("ascii", off, off + 4) !== "data") off += 8 + buf.readUInt32LE(off + 4);
const start = off + 8, n = buf.readUInt32LE(off + 4) / 2, sr = 16000, win = 800; // 50ms windows

const thrDb = -40;
let inGap = false, gs = 0, speechStart = 0;
const lines = [];
for (let i = 0, k = 0; i + win <= n; i += win, k++) {
  let s = 0;
  for (let j = 0; j < win; j++) { const v = buf.readInt16LE(start + (i + j) * 2) / 32768; s += v * v; }
  const db = 20 * Math.log10(Math.sqrt(s / win) + 1e-9);
  const t = k * 0.05;
  if (db < thrDb && !inGap) { inGap = true; gs = t; }
  if (db >= thrDb && inGap) {
    inGap = false;
    if (t - gs >= minGap) {
      lines.push(`speech ${speechStart.toFixed(2)} → ${gs.toFixed(2)}   | gap ${(t - gs).toFixed(2)}s`);
      speechStart = t;
    }
  }
}
lines.push(`speech ${speechStart.toFixed(2)} → ${(n / sr).toFixed(2)}   | end`);
console.log(`duration ${(n / sr).toFixed(2)}s — one line per spoken phrase:`);
lines.forEach((l, i) => console.log(String(i + 1).padStart(3), l));
