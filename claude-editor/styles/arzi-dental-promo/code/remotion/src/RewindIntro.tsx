import {
  AbsoluteFill,
  Easing,
  Freeze,
  interpolate,
  random,
  Sequence,
  Video,
  staticFile,
  useCurrentFrame,
} from "remotion";

/**
 * REWIND INTRO — cold-open on the butterfly → person transformation, a fast
 * VHS-style rewind back to frame 0, then the full edit from the start.
 *   0–36    teaser: source frames 80–116 (wings fill the lens, flash reveal)
 *   37–58   rewind: source 116 → 0, accelerating, with tape FX
 *   59–299  full video from the beginning
 */

const SRC = "rec/fairy_final.mp4";
const W = 1504;
const H = 1120;
const TEASE_FROM = 80;
const TEASE_TO = 116;
const TEASE_LEN = TEASE_TO - TEASE_FROM + 1; // 37
const RW_LEN = 22;
const MAIN_AT = TEASE_LEN + RW_LEN; // 59
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Still: React.FC<{ at: number }> = ({ at }) => (
  <Freeze frame={Math.max(0, Math.round(at))}>
    <Video src={staticFile(SRC)} muted style={{ width: W, height: H }} />
  </Freeze>
);

const RewindIcon: React.FC<{ frame: number }> = ({ frame }) => (
  <svg
    width="150"
    height="90"
    viewBox="0 0 150 90"
    style={{ position: "absolute", left: 70, top: 60, opacity: frame % 8 < 6 ? 0.9 : 0.35 }}
  >
    <polygon points="70,10 70,80 10,45" fill="#fff" />
    <polygon points="135,10 135,80 75,45" fill="#fff" />
  </svg>
);

export const RewindIntro: React.FC = () => {
  const frame = useCurrentFrame();

  // ---------- teaser ----------
  if (frame < TEASE_LEN) {
    // slow push for tension; last 3 frames freeze-jolt into the rewind
    const push = interpolate(frame, [0, TEASE_LEN], [1.0, 1.06], clamp);
    const jolt = interpolate(frame, [TEASE_LEN - 3, TEASE_LEN], [0, 1], clamp);
    return (
      <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
        <AbsoluteFill style={{ transform: `scale(${push + 0.03 * jolt})`, transformOrigin: "50% 40%" }}>
          <Still at={TEASE_FROM + frame} />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  // ---------- rewind ----------
  if (frame < MAIN_AT) {
    const k = frame - TEASE_LEN; // 0..21
    const p = interpolate(k, [0, RW_LEN - 1], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
    const src = TEASE_TO - p * TEASE_TO;
    const split = 10 + 22 * Math.sin((k / RW_LEN) * Math.PI); // RGB offset in px
    const jitterY = (random(`jy${k}`) - 0.5) * 18;
    const bandY = (random(`band${k}`) * H) | 0;
    const bandH = 60 + random(`bh${k}`) * 90;
    const bandShift = (random(`bs${k}`) - 0.5) * 120;
    const flicker = 0.85 + random(`fl${k}`) * 0.25;
    const layer = (color: string, dx: number) => (
      <AbsoluteFill style={{ mixBlendMode: "screen", transform: `translate(${dx}px, ${jitterY}px)` }}>
        <Still at={src} />
        <AbsoluteFill style={{ backgroundColor: color, mixBlendMode: "multiply" }} />
      </AbsoluteFill>
    );
    return (
      <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
        <AbsoluteFill style={{ filter: `saturate(0.6) contrast(1.15) brightness(${flicker})`, transform: "scale(1.04)" }}>
          {layer("#ff0000", -split)}
          {layer("#00ff00", 0)}
          {layer("#0000ff", split)}
          {/* tracking-error band: a torn, shifted strip */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: bandY,
              width: W,
              height: bandH,
              overflow: "hidden",
              transform: `translateX(${bandShift}px)`,
              filter: "brightness(1.4) blur(1px)",
            }}
          >
            <div style={{ position: "absolute", left: 0, top: -bandY, width: W, height: H }}>
              <Still at={src} />
            </div>
          </div>
        </AbsoluteFill>
        {/* scanlines */}
        <AbsoluteFill
          style={{
            backgroundImage: "repeating-linear-gradient(to bottom, rgba(0,0,0,0.28) 0px, rgba(0,0,0,0.28) 2px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 5px)",
          }}
        />
        {/* noise */}
        <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: 0.35 }}>
          <svg width={W} height={H}>
            <filter id="rwnoise">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={k} />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width={W} height={H} filter="url(#rwnoise)" />
          </svg>
        </AbsoluteFill>
        <RewindIcon frame={frame} />
        {/* white pop as the tape snaps back to the start */}
        <AbsoluteFill style={{ backgroundColor: "#fff", opacity: interpolate(k, [RW_LEN - 2, RW_LEN - 1], [0, 0.7], clamp) }} />
      </AbsoluteFill>
    );
  }

  // ---------- full video from the start ----------
  const settle = interpolate(frame, [MAIN_AT, MAIN_AT + 8], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${1 + 0.06 * settle})` }}>
        <Sequence from={MAIN_AT}>
          <Video src={staticFile(SRC)} muted style={{ width: W, height: H }} />
        </Sequence>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: 0.6 * settle * settle }} />
    </AbsoluteFill>
  );
};
