// Render specific master frames to PNG (half size) for quick visual review:
//   node scripts/render-stills.mjs <outDir> 120 450 1014 ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "fs";
import path from "path";

const [outDir, ...frames] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: process.env.COMP ?? "Main" });

for (const f of frames.map(Number)) {
  const output = path.join(outDir, `f${String(f).padStart(4, "0")}.png`);
  await renderStill({ composition, serveUrl, frame: f, output, scale: 0.5 });
  console.log("rendered", output);
}
