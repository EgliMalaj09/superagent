// Debug helper for useKeyedImage: lists grey regions that are NOT connected to the image border
// (pockets inside a prop) with their size and stats, so you can see whether the keying rule
// will remove checkerboard pockets (high sd, low dark%) and keep jewels (high dark%).
//   node scripts/analyze-checker.mjs public/images/props/crown.jpg
import { execFileSync } from "child_process";
import { readFileSync, mkdtempSync } from "fs";
import { tmpdir } from "os";
import path from "path";

const bmp = path.join(mkdtempSync(path.join(tmpdir(), "key-")), "img.bmp");
execFileSync("sips", ["-s", "format", "bmp", process.argv[2], "--out", bmp], { stdio: "ignore" });
const b = readFileSync(bmp);
const off = b.readUInt32LE(10), w = b.readInt32LE(18), hRaw = b.readInt32LE(22), bpp = b.readUInt16LE(28) / 8;
const h = Math.abs(hRaw), row = Math.ceil((w * bpp) / 4) * 4;
const px = (x, y) => { const yy = hRaw > 0 ? h - 1 - y : y; const i = off + yy * row + x * bpp; return [b[i + 2], b[i + 1], b[i]]; };
const isBg = (x, y) => { const [r, g, bl] = px(x, y); const mx = Math.max(r, g, bl), mn = Math.min(r, g, bl); return mx < 125 && mx - mn < 30; };

const lab = new Int32Array(w * h).fill(-1);
const regs = [];
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
  if (lab[y * w + x] !== -1 || !isBg(x, y)) continue;
  const id = regs.length, st = [y * w + x]; lab[y * w + x] = id;
  const r = { n: 0, border: false, x0: w, y0: h, x1: 0, y1: 0, sum: 0, sq: 0, dark: 0 };
  while (st.length) {
    const p = st.pop(), cx = p % w, cy = (p / w) | 0; r.n++;
    if (!cx || !cy || cx === w - 1 || cy === h - 1) r.border = true;
    r.x0 = Math.min(r.x0, cx); r.x1 = Math.max(r.x1, cx); r.y0 = Math.min(r.y0, cy); r.y1 = Math.max(r.y1, cy);
    const v = Math.max(...px(cx, cy)); r.sum += v; r.sq += v * v; if (v < 30) r.dark++;
    for (const [nx, ny] of [[cx - 1, cy], [cx + 1, cy], [cx, cy - 1], [cx, cy + 1]])
      if (nx >= 0 && ny >= 0 && nx < w && ny < h && lab[ny * w + nx] === -1 && isBg(nx, ny)) { lab[ny * w + nx] = id; st.push(ny * w + nx); }
  }
  regs.push(r);
}
console.log("size", w, h);
regs.filter((r) => !r.border && r.n > 150).sort((a, c) => c.n - a.n).slice(0, 30).forEach((r) => {
  const m = r.sum / r.n, sd = Math.sqrt(r.sq / r.n - m * m), dark = r.dark / r.n;
  const keyed = (r.n > 8000 && sd > 25) || (r.n > 300 && sd > 20 && dark < 0.45);
  console.log(`${keyed ? "KEY " : "keep"} n=${r.n} bbox=${r.x0},${r.y0}-${r.x1},${r.y1} mean=${m.toFixed(0)} sd=${sd.toFixed(0)} dark=${(dark * 100).toFixed(0)}%`);
});
