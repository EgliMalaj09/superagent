import { AbsoluteFill, Easing, Freeze, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";

/**
 * FINALE FIX — the user's assembled final, played untouched except inside
 * three windows, where the existing transition is rebuilt from the clean
 * frames on either side:
 *   [644,657)  vertical slide  → zoom-blend
 *   [701,714)  whip + leak     → defocus dissolve (dentist → instrument tray)
 *   [755,773)  hard cut + dark fade-in → warm light-leak into the patient shot
 * Timing outside the windows is unchanged, so the voiceover stays in sync.
 */

let SRC = "rec/finale.mp4";
const W = 1080;
const H = 1920;
export type FixType = "zoomblend" | "defocus" | "leak" | "hold";
type T = FixType;
export type Fix = { a: number; b: number; outAt: number; inAt: number; type: T };
let FIXES: Fix[] = [
  { a: 644, b: 657, outAt: 643, inAt: 657, type: "zoomblend" },
  { a: 701, b: 714, outAt: 700, inAt: 714, type: "defocus" },
  { a: 755, b: 773, outAt: 760, inAt: 773, type: "leak" },
];
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.65, 0, 0.35, 1);

const Still: React.FC<{ at: number }> = ({ at }) => (
  <Freeze frame={at}>
    <OffthreadVideo src={staticFile(SRC)} muted style={{ width: W, height: H }} />
  </Freeze>
);

export const FinaleFix: React.FC<{ src?: string; fixes?: Fix[] }> = ({ src, fixes }) => {
  if (src) SRC = src;
  if (fixes) FIXES = fixes;
  const f = useCurrentFrame();
  const fix = FIXES.find((x) => f >= x.a && f < x.b);
  if (!fix) {
    return (
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        <OffthreadVideo src={staticFile(SRC)} muted style={{ width: W, height: H }} />
      </AbsoluteFill>
    );
  }
  if (fix.type === "hold") {
    return (
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        <Still at={fix.outAt} />
      </AbsoluteFill>
    );
  }
  const p = interpolate(f, [fix.a, fix.b - 1], [0, 1], { ...clamp, easing: ease });
  let out: React.CSSProperties;
  let inn: React.CSSProperties;
  let glow = 0;
  if (fix.type === "zoomblend") {
    out = { transform: `scale(${1 + 0.35 * p})`, filter: `blur(${10 * p}px)`, opacity: 1 - p };
    inn = { transform: `scale(${1.25 - 0.25 * p})`, filter: `blur(${10 * (1 - p)}px)`, opacity: p };
    glow = 0.2 * Math.sin(Math.PI * p);
  } else if (fix.type === "defocus") {
    out = { transform: `scale(${1 + 0.04 * p})`, filter: `blur(${18 * p}px)`, opacity: 1 - p };
    inn = { transform: `scale(${1.04 - 0.04 * p})`, filter: `blur(${18 * (1 - p)}px)`, opacity: p };
  } else {
    out = { opacity: 1 - p };
    inn = { transform: `scale(${1.06 - 0.06 * p})`, opacity: p };
    glow = 0.75 * Math.sin(Math.PI * p);
  }
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={out}>
        <Still at={Math.min(f, fix.outAt)} />
      </AbsoluteFill>
      <AbsoluteFill style={inn}>
        <Still at={fix.inAt} />
      </AbsoluteFill>
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
