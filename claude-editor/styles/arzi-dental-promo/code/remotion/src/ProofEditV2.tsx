import {
  AbsoluteFill,
  Easing,
  Freeze,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";

/**
 * PROOF v2 — same 6 shots as v1, but every joint is a real blended transition
 * (outgoing and incoming on screen together for ~0.4s), each one different:
 *   f60  reception → surgery door   zoom-blend (rush in, land from a zoom)
 *   f120 surgery door → room        light-leak dissolve
 *   f174 room → dentist             vertical slide with motion blur
 *   f228 dentist → technician       whip pan
 *   f282 technician → team          defocus dissolve
 * Around each cut the outgoing shot holds its last frame and the incoming
 * holds its first frame, so the motion of the transition hides the holds.
 */

const W = 1080;
const H = 1920;
const HALF = 6; // frames each side of the cut → 12-frame (0.4s) blends
export type BlendType = "zoomblend" | "leak" | "slide" | "whip" | "defocus";
type T = BlendType;

export type BlendProps = {
  src?: string;
  cuts?: number[];
  end?: number;
  types?: BlendType[];
  /** per-shot transform origin for the slow push / zooms */
  origins?: string[];
};
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.65, 0, 0.35, 1);

let SRC = "rec/proof.mp4";
let CUTS = [60, 120, 174, 228, 282];
let END = 353;
let TYPES: T[] = ["zoomblend", "leak", "slide", "whip", "defocus"];
let ORIGINS = ["50% 55%", "45% 60%", "55% 45%", "45% 45%", "60% 50%", "50% 35%"];

const Src: React.FC<{ at?: number }> = ({ at }) => {
  const v = <OffthreadVideo src={staticFile(SRC)} muted style={{ width: W, height: H }} />;
  return at === undefined ? v : <Freeze frame={at}>{v}</Freeze>;
};

const Layer: React.FC<{ style: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <AbsoluteFill style={{ overflow: "hidden", ...style }}>{children}</AbsoluteFill>
);

const push = (f: number, shot: number) => {
  const starts = [0, ...CUTS];
  return interpolate(f, [starts[shot], CUTS[shot] ?? END], [1.0, 1.05], clamp);
};

export const ProofEditV2: React.FC<BlendProps> = ({ src, cuts, end, types, origins }) => {
  if (src) SRC = src;
  if (cuts) CUTS = cuts;
  if (end) END = end;
  if (types) TYPES = types;
  if (origins) ORIGINS = origins;
  const f = useCurrentFrame();
  const idx = CUTS.findIndex((c) => f >= c - HALF && f < c + HALF);

  if (idx < 0) {
    const shot = [0, ...CUTS].filter((s) => f >= s).length - 1;
    return (
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        <Layer style={{ transform: `scale(${push(f, shot)})`, transformOrigin: ORIGINS[shot] }}>
          <Src />
        </Layer>
      </AbsoluteFill>
    );
  }

  const c = CUTS[idx];
  const type = TYPES[idx];
  const pAt = (x: number) => interpolate(x, [c - HALF, c + HALF], [0, 1], { ...clamp, easing: ease });
  const p = pAt(f);
  const speed = Math.abs(pAt(f + 0.5) - pAt(f - 0.5));
  const outSrc = f < c ? <Src /> : <Src at={c - 1} />;
  const inSrc = f >= c ? <Src /> : <Src at={c} />;
  const outScale = push(Math.min(f, c - 1), idx);
  const inScale = push(Math.max(f, c), idx + 1);
  const oO = ORIGINS[idx];
  const iO = ORIGINS[idx + 1];

  let out: React.CSSProperties = {};
  let inn: React.CSSProperties = {};
  let glow = 0;
  let filterDefs: React.ReactNode = null;

  if (type === "zoomblend") {
    out = { transform: `scale(${outScale * (1 + 0.35 * p)})`, transformOrigin: oO, filter: `blur(${10 * p}px)`, opacity: 1 - p };
    inn = { transform: `scale(${inScale * (1.25 - 0.25 * p)})`, transformOrigin: iO, filter: `blur(${10 * (1 - p)}px)`, opacity: p };
    glow = 0.25 * Math.sin(Math.PI * p);
  } else if (type === "leak") {
    out = { transform: `scale(${outScale})`, transformOrigin: oO, opacity: 1 - p };
    inn = { transform: `scale(${inScale * (1.06 - 0.06 * p)})`, transformOrigin: iO, opacity: p };
    glow = 0.7 * Math.sin(Math.PI * p);
  } else if (type === "slide") {
    const vb = Math.min(60, speed * H * 0.25);
    filterDefs = (
      <filter id="vblur" x="0" y="-5%" width="100%" height="110%">
        <feGaussianBlur stdDeviation={`0 ${vb}`} />
      </filter>
    );
    const blurF = vb > 0.5 ? "url(#vblur)" : undefined;
    out = { transform: `translateY(${-p * H}px) scale(${outScale})`, transformOrigin: oO, filter: blurF };
    inn = { transform: `translateY(${(1 - p) * H}px) scale(${inScale})`, transformOrigin: iO, filter: blurF };
  } else if (type === "whip") {
    const hb = Math.min(70, speed * W * 0.28);
    filterDefs = (
      <filter id="hblur2" x="-5%" y="0" width="110%" height="100%">
        <feGaussianBlur stdDeviation={`${hb} 0`} />
      </filter>
    );
    const blurF = hb > 0.5 ? "url(#hblur2)" : undefined;
    out = { transform: `translateX(${-p * W}px) scale(${outScale})`, transformOrigin: oO, filter: blurF };
    inn = { transform: `translateX(${(1 - p) * W}px) scale(${inScale})`, transformOrigin: iO, filter: blurF };
  } else {
    // defocus dissolve: rack out of focus, dissolve, rack back in
    out = { transform: `scale(${outScale * (1 + 0.04 * p)})`, transformOrigin: oO, filter: `blur(${18 * p}px)`, opacity: 1 - p };
    inn = { transform: `scale(${inScale * (1.04 - 0.04 * p)})`, transformOrigin: iO, filter: `blur(${18 * (1 - p)}px)`, opacity: p };
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>{filterDefs}</svg>
      <Layer style={out}>{outSrc}</Layer>
      <Layer style={inn}>{inSrc}</Layer>
      <AbsoluteFill
        style={{
          opacity: glow,
          background: "radial-gradient(ellipse 90% 70% at 70% 25%, #fff3dc 0%, rgba(255,214,160,0.7) 40%, rgba(255,190,130,0) 80%)",
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};
