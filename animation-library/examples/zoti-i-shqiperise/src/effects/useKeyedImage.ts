import { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

export type KeyedImage = { src: string; width: number; height: number };

const cache = new Map<string, Promise<KeyedImage>>();

// AI image tools often export "transparent" props as JPGs with a fake
// checkerboard baked in. This removes it at render time:
// 1) Flood-fill from the borders through dark grey pixels → transparent.
// 2) Pockets enclosed by the object (e.g. between crown arches) are keyed by
//    their stats: checker regions alternate light/dark (high variance) and are
//    mostly mid-grey, while dark details like jewels are mostly near-black.
// The result is cropped to the object's bounding box.
const keyImage = (file: string): Promise<KeyedImage> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth, h = img.naturalHeight;
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, w, h);
      const px = data.data;
      const isBg = (i: number) => {
        const r = px[i], g = px[i + 1], b = px[i + 2];
        const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
        return mx < 125 && mx - mn < 30;
      };
      const neighbours = (p: number) => {
        const x = p % w, y = (p / w) | 0;
        return [x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1, y > 0 ? p - w : -1, y < h - 1 ? p + w : -1];
      };

      const seen = new Uint8Array(w * h);
      const stack: number[] = [];
      for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
      for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
      while (stack.length) {
        const p = stack.pop()!;
        if (seen[p]) continue;
        seen[p] = 1;
        if (!isBg(p * 4)) continue;
        px[p * 4 + 3] = 0;
        for (const q of neighbours(p)) if (q >= 0 && !seen[q]) stack.push(q);
      }

      for (let start = 0; start < w * h; start++) {
        if (seen[start] || !isBg(start * 4)) continue;
        const region: number[] = [];
        let sum = 0, sq = 0, dark = 0;
        const st = [start];
        seen[start] = 1;
        while (st.length) {
          const p = st.pop()!;
          region.push(p);
          const v = Math.max(px[p * 4], px[p * 4 + 1], px[p * 4 + 2]);
          sum += v; sq += v * v;
          if (v < 30) dark++;
          for (const q of neighbours(p)) if (q >= 0 && !seen[q] && isBg(q * 4)) { seen[q] = 1; st.push(q); }
        }
        const n = region.length;
        const mean = sum / n;
        const sd = Math.sqrt(sq / n - mean * mean);
        const isChecker = (n > 8000 && sd > 25) || (n > 300 && sd > 20 && dark / n < 0.45);
        if (isChecker) for (const p of region) px[p * 4 + 3] = 0;
      }

      let minX = w, minY = h, maxX = 0, maxY = 0;
      for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++)
          if (px[(y * w + x) * 4 + 3] > 0) {
            if (x < minX) minX = x; if (x > maxX) maxX = x;
            if (y < minY) minY = y; if (y > maxY) maxY = y;
          }
      ctx.putImageData(data, 0, 0);
      const cw = maxX - minX + 1, ch = maxY - minY + 1;
      const out = document.createElement("canvas");
      out.width = cw; out.height = ch;
      out.getContext("2d")!.drawImage(canvas, minX, minY, cw, ch, 0, 0, cw, ch);
      resolve({ src: out.toDataURL("image/png"), width: cw, height: ch });
    };
    img.onerror = reject;
    img.src = staticFile(file);
  });

/** Loads a JPG/PNG from public/, strips a baked-in checkerboard, returns a transparent PNG data URL. */
export const useKeyedImage = (file: string): KeyedImage | null => {
  const [image, setImage] = useState<KeyedImage | null>(null);
  const [handle] = useState(() => delayRender(`Keying ${file}`));
  useEffect(() => {
    if (!cache.has(file)) cache.set(file, keyImage(file));
    cache.get(file)!.then((k) => {
      setImage(k);
      continueRender(handle);
    });
  }, [file, handle]);
  return image;
};
