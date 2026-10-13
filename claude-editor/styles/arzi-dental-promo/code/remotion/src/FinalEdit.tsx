import {
  AbsoluteFill,
  Easing,
  Freeze,
  interpolate,
  random,
  Video,
  staticFile,
  useCurrentFrame,
} from "remotion";

/**
 * FINAL EDIT — the full "hook finale" reel (24.47s, black gap already removed).
 * Transformation FX (0–4s): snap spark + shockwave + shake at the snap, embers
 * while the armor spreads, a fire bloom + embers from the palms when they ignite.
 * Transitions: flame-burst zoom (f120), whip pans (f283, f313), zoom-through the
 * monitor into the tree hook (f550), flash into the end card (f635), and small
 * punch-ins on the desk cuts. Everything else plays untouched.
 */

const SRC = "rec/final_src.mp4";
const W = 1080;
const H = 1920;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const whipEase = Easing.bezier(0.7, 0, 0.3, 1);
const outCubic = Easing.out(Easing.cubic);

const SNAP = 22; // snap click (0.74s)
const SNAP_XY = [150, 700];
const ARMOR = [28, 62]; // armor spreading
const IGNITE = 92; // palms ignite (3.07s)
const PALMS = [
  [270, 1170],
  [700, 1170],
];
const CUT_FIRE = 120; // transformation → fairground
const WHIPS = [283, 313]; // monitor → desk, desk → tool
const CUT_TREE = 550; // BRAVO monitor → tree hook
const SCREEN_XY = [575, 880];
const CUT_END = 635; // tree → end card
const PUNCHES = [203, 220, 241]; // desk cuts

const Src: React.FC<{ at?: number }> = ({ at }) => {
  const v = <Video src={staticFile(SRC)} muted style={{ width: W, height: H }} />;
  return at === undefined ? v : <Freeze frame={at}>{v}</Freeze>;
};

/** Seeded glowing embers rising from a source area. */
const Embers: React.FC<{
  frame: number;
  start: number;
  end: number;
  seed: string;
  count: number;
  area: [number, number, number, number]; // x, y, w, h spawn box
  rise: number; // px per frame
}> = ({ frame, start, end, seed, count, area, rise }) => {
  if (frame < start || frame > end + 40) return null;
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const born = start + random(`${seed}b${i}`) * (end - start);
        const age = frame - born;
        if (age < 0 || age > 40) return null;
        const x = area[0] + random(`${seed}x${i}`) * area[2] + Math.sin(age * 0.25 + i) * 10;
        const y = area[1] + random(`${seed}y${i}`) * area[3] - age * rise * (0.6 + random(`${seed}s${i}`) * 0.8);
        const r = 3 + random(`${seed}r${i}`) * 6;
        const o = interpolate(age, [0, 4, 28, 40], [0, 1, 0.7, 0], clamp);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - r,
              top: y - r,
              width: r * 2,
              height: r * 2,
              borderRadius: "50%",
              opacity: o,
              background: "radial-gradient(circle, #fff6d0 0%, #ffb347 40%, rgba(255,110,20,0) 72%)",
              boxShadow: `0 0 ${r * 3}px rgba(255,140,40,0.9)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const FinalEdit: React.FC = () => {
  const frame = useCurrentFrame();

  // ---------- camera ----------
  let scale = 1;
  let origin = "50% 50%";
  let tx = 0;
  let ty = 0;
  let blur = 0;

  if (frame < CUT_FIRE) {
    // slow push through the transformation + punches on snap and ignite
    scale = interpolate(frame, [0, CUT_FIRE], [1.0, 1.06], clamp)
      + 0.07 * interpolate(frame, [SNAP, SNAP + 2, SNAP + 12], [0, 1, 0], clamp)
      + 0.05 * interpolate(frame, [IGNITE, IGNITE + 2, IGNITE + 12], [0, 1, 0], clamp);
    origin = "45% 42%";
    // outgoing flame burst: rush into the fire over the last 5 frames
    const rush = interpolate(frame, [CUT_FIRE - 5, CUT_FIRE], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
    scale *= 1 + 0.35 * rush;
    blur = rush * 8;
    const shakeA = interpolate(frame, [SNAP, SNAP + 9], [1, 0], clamp);
    const shakeB = interpolate(frame, [IGNITE, IGNITE + 8], [1, 0], clamp) * 0.7;
    const sh = Math.max(shakeA, shakeB);
    tx = Math.sin(frame * 2.9) * 16 * sh;
    ty = Math.cos(frame * 3.7) * 12 * sh;
  } else if (frame < CUT_FIRE + 8) {
    // incoming fairground settles from a punch
    const k = interpolate(frame, [CUT_FIRE, CUT_FIRE + 8], [1, 0], { ...clamp, easing: outCubic });
    scale = 1 + 0.18 * k;
    blur = k * 6;
  }
  for (const p of PUNCHES) {
    if (frame >= p && frame < p + 7) {
      scale = 1 + 0.045 * interpolate(frame, [p, p + 7], [1, 0], { ...clamp, easing: outCubic });
    }
  }
  if (frame >= CUT_TREE - 6 && frame < CUT_TREE) {
    // outgoing: dive into the BRAVO screen
    const k = interpolate(frame, [CUT_TREE - 6, CUT_TREE], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
    scale = 1 + 1.4 * k;
    origin = `${(SCREEN_XY[0] / W) * 100}% ${(SCREEN_XY[1] / H) * 100}%`;
    blur = k * 10;
  } else if (frame >= CUT_TREE && frame < CUT_TREE + 9) {
    const k = interpolate(frame, [CUT_TREE, CUT_TREE + 9], [1, 0], { ...clamp, easing: outCubic });
    scale = 1 + 0.3 * k;
    blur = k * 8;
  }
  if (frame >= CUT_END - 4 && frame < CUT_END) {
    const k = interpolate(frame, [CUT_END - 4, CUT_END], [0, 1], clamp);
    scale = 1 + 0.2 * k;
    blur = k * 8;
  }

  // ---------- whip pans ----------
  const whip = WHIPS.find((c) => frame >= c - 5 && frame < c + 5);
  let content: React.ReactNode;
  let whipBlur = 0;
  if (whip !== undefined) {
    const dir = whip === WHIPS[0] ? 1 : -1;
    const pAt = (f: number) => interpolate(f, [whip - 5, whip + 5], [0, 1], { ...clamp, easing: whipEase });
    const p = pAt(frame);
    whipBlur = Math.min(70, Math.abs(pAt(frame + 0.5) - pAt(frame - 0.5)) * W * 0.28);
    content = (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: dir === 1 ? 0 : -W,
          width: W * 2,
          height: H,
          transform: `translateX(${-dir * p * W}px)`,
          filter: whipBlur > 0.5 ? "url(#finalwhip)" : undefined,
        }}
      >
        <div style={{ position: "absolute", top: 0, left: dir === 1 ? 0 : W, width: W, height: H, overflow: "hidden" }}>
          {frame < whip ? <Src /> : <Src at={whip - 1} />}
        </div>
        <div style={{ position: "absolute", top: 0, left: dir === 1 ? W : 0, width: W, height: H, overflow: "hidden" }}>
          {frame >= whip ? <Src /> : <Src at={whip} />}
        </div>
      </div>
    );
  } else {
    content = <Src />;
  }

  // ---------- light FX ----------
  const snapFlash = interpolate(frame, [SNAP, SNAP + 1, SNAP + 7], [0, 0.45, 0], clamp);
  const ring = interpolate(frame, [SNAP, SNAP + 14], [0, 1], { ...clamp, easing: outCubic });
  const spark = interpolate(frame, [SNAP - 1, SNAP + 1, SNAP + 10], [0, 1, 0], clamp);
  const fireGlow = frame < CUT_FIRE
    ? interpolate(frame, [IGNITE - 3, IGNITE + 3, CUT_FIRE], [0, 1, 0.8], clamp) * (0.85 + 0.15 * Math.sin(frame * 1.7))
    : 0;
  const fireFlash = interpolate(frame, [CUT_FIRE - 2, CUT_FIRE, CUT_FIRE + 5], [0, 0.85, 0], clamp);
  const treeFlash = interpolate(frame, [CUT_TREE - 1, CUT_TREE, CUT_TREE + 5], [0, 0.6, 0], clamp);
  const endFlash = interpolate(frame, [CUT_END - 1, CUT_END, CUT_END + 5], [0, 0.5, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="finalwhip" x="-5%" y="0" width="110%" height="100%">
          <feGaussianBlur stdDeviation={`${whipBlur} 0`} />
        </filter>
      </svg>

      <AbsoluteFill
        style={{
          transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
          transformOrigin: origin,
          filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
        }}
      >
        {content}

        {/* transformation FX live inside the camera so they move with it */}
        {frame < CUT_FIRE && (
          <>
            {/* snap spark at the fingers */}
            <div
              style={{
                position: "absolute",
                left: SNAP_XY[0] - 260,
                top: SNAP_XY[1] - 260,
                width: 520,
                height: 520,
                borderRadius: "50%",
                opacity: spark,
                mixBlendMode: "screen",
                background: "radial-gradient(circle, rgba(255,255,240,1) 0%, rgba(255,190,90,0.9) 18%, rgba(255,120,30,0.35) 42%, rgba(255,90,20,0) 68%)",
              }}
            />
            {/* shockwave ring */}
            <div
              style={{
                position: "absolute",
                left: SNAP_XY[0] - 1100 * ring,
                top: SNAP_XY[1] - 1100 * ring,
                width: 2200 * ring,
                height: 2200 * ring,
                borderRadius: "50%",
                border: `${10 * (1 - ring) + 2}px solid rgba(255,190,110,${0.75 * (1 - ring)})`,
                boxShadow: `0 0 60px rgba(255,150,60,${0.6 * (1 - ring)})`,
              }}
            />
            {/* palm fire bloom */}
            {PALMS.map(([x, y], i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x - 380,
                  top: y - 420,
                  width: 760,
                  height: 760,
                  borderRadius: "50%",
                  opacity: fireGlow,
                  mixBlendMode: "screen",
                  background: "radial-gradient(circle, rgba(255,210,120,0.75) 0%, rgba(255,140,40,0.4) 30%, rgba(255,90,20,0) 70%)",
                }}
              />
            ))}
            {/* warm firelight wash over the whole room */}
            <AbsoluteFill style={{ backgroundColor: "rgb(255,120,30)", opacity: 0.12 * fireGlow, mixBlendMode: "soft-light" }} />
          </>
        )}
      </AbsoluteFill>

      <Embers frame={frame} start={ARMOR[0]} end={ARMOR[1]} seed="armor" count={70} area={[200, 650, 700, 900]} rise={4} />
      <Embers frame={frame} start={IGNITE} end={CUT_FIRE} seed="palmL" count={40} area={[190, 1050, 160, 120]} rise={7} />
      <Embers frame={frame} start={IGNITE} end={CUT_FIRE} seed="palmR" count={40} area={[620, 1050, 160, 120]} rise={7} />

      <AbsoluteFill style={{ backgroundColor: "#fff3e0", opacity: snapFlash, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ backgroundColor: "#ffb060", opacity: fireFlash, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ backgroundColor: "#ffffff", opacity: treeFlash, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ backgroundColor: "#ffffff", opacity: endFlash }} />
    </AbsoluteFill>
  );
};
