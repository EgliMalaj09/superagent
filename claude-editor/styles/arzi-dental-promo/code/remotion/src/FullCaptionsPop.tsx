import { AbsoluteFill, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { Fundi2 } from "./Fundi2";
import { RouteMap } from "./RouteMap";
import { FullFix2Video } from "./FullFix2";

/**
 * Reference-style captions for the finished video: heavy Poppins, 1–3 words
 * at a time as spoken, white with a soft shadow, key words in yellow caps.
 * Starts after the hook (its captions are already burned into the footage).
 */

const FONT = "'Poppins', -apple-system, sans-serif";
const YELLOW = "#FFE14D";
type W = [string, number, boolean?]; // word, start (s), highlight

// [words…] per chunk; a chunk stays until the next chunk starts (max +0.7 s after its last word)
export const CHUNKS: W[][] = [
  [["Da", 11.98], ["noi,", 12.28]],
  [["Dental", 13.24, true], ["Med", 13.48, true], ["Austria", 13.75, true]],
  [["a", 14.14], ["Tirana,", 14.56]],
  [["il", 15.92], ["tuo", 16.04], ["caso", 16.26]],
  [["viene", 16.84], ["valutato", 17.26]],
  [["dal", 18.34], ["team", 18.66, true], ["medico", 19.06, true]],
  [["e", 19.84], ["il", 20.18], ["percorso", 20.42]],
  [["viene", 21.02], ["pianificato", 21.38, true]],
  [["con", 22.56], ["il", 22.98], ["supporto", 23.22]],
  [["del", 23.66], ["laboratorio", 23.74, true]],
  [["odontotecnico", 24.86, true]],
  [["interno.", 26.18, true]],
  [["La", 27.5], ["clinica", 27.86]],
  [["dispone", 28.52], ["di", 29.1]],
  [["oltre", 29.44], ["1.000", 29.82, true]],
  [["metri", 30.2], ["quadrati", 30.46]],
  [["e", 31.32], ["19", 31.84, true]],
  [["poltrone", 32.62], ["operative", 33.66]],
  [["per", 34.38], ["organizzare", 35.12]],
  [["le", 35.74], ["diverse", 36.04], ["fasi", 36.38]],
  [["della", 37.06], ["cura.", 37.38]],
  [["Dopo", 40.42], ["il", 40.62], ["rientro,", 40.74]],
  [["i", 41.86], ["nostri", 41.86], ["riferimenti", 42.2]],
  [["a", 43.32], ["Firenze", 43.52, true]],
  [["possono", 44.22], ["seguirti", 44.74]],
  [["per", 45.56], ["i", 45.76], ["controlli", 46.12, true]],
  [["concordati.", 46.46, true]],
  [["Raccontaci", 47.8]],
  [["il", 48.46], ["tuo", 48.66], ["caso", 48.78, true]],
  [["e", 49.32], ["richiedi", 49.94]],
  [["una", 50.34], ["prima", 50.6], ["valutazione.", 50.76, true]],
];

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// widest word at `size` px (Poppins 800), so long words shrink the chunk instead of overflowing
let ctx: CanvasRenderingContext2D | null = null;
const fitSize = (words: W[], size: number, max: number) => {
  ctx = ctx ?? document.createElement("canvas").getContext("2d");
  if (!ctx) return size;
  ctx.font = `800 ${size}px Poppins`;
  const widest = Math.max(...words.map(([w, , hi]) => ctx!.measureText(hi ? w.toUpperCase() : w).width + 28));
  return widest > max ? Math.floor((size * max) / widest) : size;
};

export const PopCaptions: React.FC<{ size?: number; swap?: Record<string, string> }> = ({ size = 104, swap }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const idx = CHUNKS.findIndex((c, i) => {
    const start = c[0][1];
    const next = CHUNKS[i + 1]?.[0][1] ?? 99;
    const end = Math.min(next, c[c.length - 1][1] + 0.9);
    return t >= start && t < end;
  });
  if (idx < 0) return null;
  const chunk = CHUNKS[idx];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 30,
          right: 30,
          top: 1120,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: fitSize(chunk, size, 1000),
          lineHeight: 1.08,
          letterSpacing: "-0.01em",
        }}
      >
        {chunk.map(([w, s, hi], i) => {
          if (t < s) return null;
          const pop = spring({ frame: f - Math.round(s * 30), fps: 30, config: { damping: 14, stiffness: 260, mass: 0.6 } });
          const o = interpolate(f - s * 30, [0, 3], [0, 1], clamp);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                margin: "0 14px",
                color: hi ? YELLOW : "#ffffff",
                textTransform: hi ? "uppercase" : "none",
                opacity: o,
                transform: `scale(${0.85 + 0.15 * pop})`,
                textShadow: "0 4px 14px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.6)",
              }}
            >
              {swap?.[w] ?? w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const FullCaptionsPop: React.FC = () => (
  <AbsoluteFill>
    <FullFix2Video />
    <PopCaptions />
  </AbsoluteFill>
);

/** Same captions, bigger, over the finished clean master (hook keeps its own captions). */
// The reception swap (handshake → DSCF9519 with the suitcase) is baked into
// rec/cleanswap.mp4 with ffmpeg; one video layer keeps the 4K render light.
export const FullCaptionsBig: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <OffthreadVideo src={staticFile("rec/cleanswap.mp4")} muted style={{ width: 1080, height: 1920 }} />
    <PopCaptions size={132} />
  </AbsoluteFill>
);

/** Captions only, transparent — composited over the 4K master with ffmpeg. */
export const CaptionsOnlyBig: React.FC = () => <PopCaptions size={132} />;

/**
 * Video 1 Lugano patch (absolute frames 1215–1344): Lugano route map + clip
 * dissolve (Fundi2 local 14…) with the same captions, "Firenze" → "Lugano".
 * Composited over finished-1 at its own resolution.
 */
export const V1LuganoPatch: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Sequence from={-14}>
      <Fundi2 dest="lugano" />
    </Sequence>
    <Sequence from={-1215}>
      <PopCaptions size={132} swap={{ Firenze: "Lugano" }} />
    </Sequence>
  </AbsoluteFill>
);

/** Video 1 Torino: clean map section (no captions) for cleanswap frames 1215–1344. */
export const V1TorinoMap: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Sequence from={-14}>
      <Fundi2 dest="torino" />
    </Sequence>
  </AbsoluteFill>
);

/** Video 1 Torino: captions only, "Firenze" → "Torino". */
export const CaptionsOnlyTorino: React.FC = () => <PopCaptions size={132} swap={{ Firenze: "Torino" }} />;

/** Lugano campaign: Lugano → Tirana route map (full 150-frame move; retimed to the slot with ffmpeg). */
export const LuganoTiranaMap: React.FC = () => <RouteMap dest="luganoToTirana" />;
