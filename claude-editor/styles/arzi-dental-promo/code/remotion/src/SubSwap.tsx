import { AbsoluteFill, Easing, Freeze, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";

/**
 * SUB SWAP — the base clip (X-ray → lab → teeth) with its middle lab shot
 * replaced by the new lab footage (substtt). Audio and the two transitions
 * keep their places: defocus dissolve into the lab at f21, zoom-blend out
 * of it at f101, both rebuilt with the new footage.
 */

const BASE = "rec/swapbase.mp4";
const SUB = "rec/swapsub.mp4";
const C1 = 21;
const C2 = 101;
const HALF = 6;
const SUB_OFFSET = 10; // sub frame = f - (C1 - HALF) + SUB_OFFSET
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.65, 0, 0.35, 1);

const V: React.FC<{ src: string; at: number }> = ({ src, at }) => (
  <Freeze frame={Math.max(0, at)}>
    <OffthreadVideo src={staticFile(src)} muted style={{ width: 1080, height: 1920 }} />
  </Freeze>
);

export const SubSwap: React.FC = () => {
  const f = useCurrentFrame();
  const subAt = (x: number) => x - (C1 - HALF) + SUB_OFFSET;
  // slow push on the new lab shot, like the other shots
  const push = interpolate(f, [C1, C2], [1.0, 1.05], clamp);
  const lab = (x: number) => (
    <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "50% 45%" }}>
      <V src={SUB} at={subAt(x)} />
    </AbsoluteFill>
  );

  if (f < C1 - HALF || f >= C2 + HALF) return <AbsoluteFill><V src={BASE} at={f} /></AbsoluteFill>;
  if (f >= C1 + HALF && f < C2 - HALF) return <AbsoluteFill style={{ overflow: "hidden" }}>{lab(f)}</AbsoluteFill>;

  if (f < C2 - HALF) {
    // defocus dissolve: X-ray → new lab shot
    const p = interpolate(f, [C1 - HALF, C1 + HALF - 1], [0, 1], { ...clamp, easing: ease });
    return (
      <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
        <AbsoluteFill style={{ filter: `blur(${18 * p}px)`, opacity: 1 - p, transform: `scale(${1 + 0.04 * p})` }}>
          <V src={BASE} at={Math.min(f, C1 - HALF - 1)} />
        </AbsoluteFill>
        <AbsoluteFill style={{ filter: `blur(${18 * (1 - p)}px)`, opacity: p }}>{lab(f)}</AbsoluteFill>
      </AbsoluteFill>
    );
  }
  // zoom-blend: new lab shot → teeth
  const p = interpolate(f, [C2 - HALF, C2 + HALF - 1], [0, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${1 + 0.35 * p})`, filter: `blur(${10 * p}px)`, opacity: 1 - p }}>{lab(f)}</AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${1.25 - 0.25 * p})`, filter: `blur(${10 * (1 - p)}px)`, opacity: p }}>
        <V src={BASE} at={C2 + HALF} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
