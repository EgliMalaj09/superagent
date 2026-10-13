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
 * SAFETY — 4s b-roll for Creative 01 (no captions, no sound):
 *   0–59    wide: the branded DENTAL MED reception desk
 *   60–119  closer: staff in blue assisting a patient at the counter
 * Joint: zoom-blend toward the counter (outgoing rushes in and fades while
 * the incoming lands from a zoom), so it reads as the camera moving in.
 */

const SRC = "rec/safety.mp4";
const W = 1080;
const H = 1920;
const CUT = 60;
const END = 119;
const HALF = 7;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.65, 0, 0.35, 1);

const Src: React.FC<{ at?: number }> = ({ at }) => {
  const v = <OffthreadVideo src={staticFile(SRC)} muted style={{ width: W, height: H }} />;
  return at === undefined ? v : <Freeze frame={at}>{v}</Freeze>;
};

export const SafetyEdit: React.FC = () => {
  const f = useCurrentFrame();
  const pushA = (x: number) => interpolate(x, [0, CUT], [1.0, 1.05], clamp);
  const pushB = (x: number) => interpolate(x, [CUT, END], [1.0, 1.05], clamp);
  const OA = "78% 58%"; // toward the counter on the right, where the closer shot is
  const OB = "55% 45%";

  if (f < CUT - HALF || f >= CUT + HALF) {
    const a = f < CUT;
    return (
      <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
        <AbsoluteFill style={{ transform: `scale(${a ? pushA(f) : pushB(f)})`, transformOrigin: a ? OA : OB }}>
          <Src />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  const p = interpolate(f, [CUT - HALF, CUT + HALF], [0, 1], { ...clamp, easing: ease });
  const glow = 0.22 * Math.sin(Math.PI * p);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${pushA(Math.min(f, CUT - 1)) * (1 + 0.4 * p)})`,
          transformOrigin: OA,
          filter: `blur(${10 * p}px)`,
          opacity: 1 - p,
        }}
      >
        {f < CUT ? <Src /> : <Src at={CUT - 1} />}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          transform: `scale(${pushB(Math.max(f, CUT)) * (1.25 - 0.25 * p)})`,
          transformOrigin: OB,
          filter: `blur(${10 * (1 - p)}px)`,
          opacity: p,
        }}
      >
        {f >= CUT ? <Src /> : <Src at={CUT} />}
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
