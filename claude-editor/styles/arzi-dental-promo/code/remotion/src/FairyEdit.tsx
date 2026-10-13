import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  Video,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * FAIRY EDIT — 10s surreal AI short (1504×1120, 24fps).
 * Shots: corridor + butterfly flying into the lens (0–3.875s), fairy man
 * reveal (3.875–6.33s), from behind (6.33–7.92s), close-up with the
 * butterfly on his cheek, eyes closing ~8.75s (7.92–10.04s).
 *
 * Effects: film grain, a dreamy bloom on the lamps, vignette, per-shot
 * camera pushes, lamp flicker, a light flash + golden sparkles on the
 * reveal, a zoom-punch into the close-up, and a slow fade to black.
 */

const W = 1504;
const H = 1120;
const SRC = "rec/fairy2x.mp4";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const inOut = Easing.bezier(0.45, 0, 0.55, 1);
const accel = Easing.bezier(0.6, 0, 0.9, 0.5);

const CUT_REVEAL = 3.875;
const CUT_BACK = 6.333;
const CUT_CLOSE = 7.917;
const EYES_CLOSE = 8.75;
const END = 10.04;

/** Seeded golden/green sparkles drifting up around the wings. */
const Sparkles: React.FC<{ t: number }> = ({ t }) => {
  const local = t - CUT_REVEAL;
  if (local < 0 || t >= CUT_BACK) return null;
  const master = interpolate(local, [0, 0.35, 2.1, 2.45], [0, 1, 1, 0], clamp);
  const dots = Array.from({ length: 46 }, (_, i) => {
    // keep clear of the face: spawn on the wing sides (left/right bands)
    const side = random(`side${i}`) > 0.5 ? 1 : 0;
    const x0 = side ? 0.66 + random(`x${i}`) * 0.26 : 0.08 + random(`x${i}`) * 0.26;
    const y0 = 0.3 + random(`y${i}`) * 0.6;
    const speed = 0.03 + random(`s${i}`) * 0.07; // screen-heights per second
    const size = 4 + random(`r${i}`) * 9;
    const phase = random(`p${i}`) * Math.PI * 2;
    const twinkle = 0.45 + 0.55 * Math.abs(Math.sin(local * (3 + random(`f${i}`) * 5) + phase));
    const born = random(`b${i}`) * 0.6;
    const alive = interpolate(local, [born, born + 0.3], [0, 1], clamp);
    const gold = random(`c${i}`) > 0.35;
    return {
      x: (x0 + Math.sin(local * 1.3 + phase) * 0.012) * W,
      y: (y0 - speed * local) * H,
      size,
      o: twinkle * alive * master,
      color: gold ? "255,214,140" : "200,255,190",
    };
  });
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", pointerEvents: "none" }}>
      {dots.map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: d.x - d.size,
            top: d.y - d.size,
            width: d.size * 2,
            height: d.size * 2,
            borderRadius: "50%",
            opacity: d.o,
            background: `radial-gradient(circle, rgba(${d.color},1) 0%, rgba(${d.color},0.5) 35%, rgba(${d.color},0) 70%)`,
            boxShadow: `0 0 ${d.size * 3}px rgba(${d.color},0.8)`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

export const FairyEdit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Camera per shot: [scale, transform-origin]
  let scale = 1;
  let origin = "50% 50%";
  let punchBlur = 0;
  if (t < CUT_REVEAL) {
    // slow push down the corridor, accelerating into the butterfly's wings
    scale = 1 + interpolate(t, [0, 3.2], [0, 0.07], { ...clamp, easing: inOut })
      + interpolate(t, [3.2, CUT_REVEAL], [0, 0.18], { ...clamp, easing: accel });
    origin = "50% 48%";
  } else if (t < CUT_BACK) {
    // reveal opens slightly tight and settles
    scale = interpolate(t, [CUT_REVEAL, CUT_REVEAL + 1.2], [1.08, 1.0], { ...clamp, easing: Easing.out(Easing.cubic) });
    origin = "50% 35%";
  } else if (t < CUT_CLOSE) {
    scale = interpolate(t, [CUT_BACK, CUT_CLOSE], [1.0, 1.05], clamp);
    origin = "45% 40%";
  } else {
    // zoom punch into the close-up, then a slow push toward the face
    const punch = interpolate(t, [CUT_CLOSE, CUT_CLOSE + 0.22], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
    punchBlur = punch * 9;
    scale = 1 + 0.1 * punch + interpolate(t, [CUT_CLOSE, END], [0, 0.1], { ...clamp, easing: inOut });
    origin = "62% 38%";
  }

  // Lamp flicker in the corridor (two quick dips).
  const flicker = t < CUT_REVEAL
    ? 1 - 0.45 * interpolate(t, [1.18, 1.21, 1.3, 1.34], [0, 1, 1, 0], clamp)
        - 0.3 * interpolate(t, [2.02, 2.05, 2.09], [0, 1, 0], clamp)
    : 1;

  // Reveal flash + bloom burst.
  const flash = interpolate(t, [CUT_REVEAL, CUT_REVEAL + 0.04, CUT_REVEAL + 0.4], [0, 0.55, 0], clamp);
  const bloom = 0.28 + 0.32 * interpolate(t, [CUT_REVEAL, CUT_REVEAL + 0.1, CUT_REVEAL + 1.0], [0, 1, 0], clamp);

  // Vignette deepens as his eyes close; fade to black at the end.
  const vignette = 0.42 + 0.28 * interpolate(t, [EYES_CLOSE - 0.4, EYES_CLOSE + 0.6], [0, 1], clamp);
  const fadeOut = interpolate(t, [END - 0.55, END - 0.05], [0, 1], { ...clamp, easing: inOut });

  const videoStyle: React.CSSProperties = { width: W, height: H };

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          transformOrigin: origin,
          filter: `brightness(${flicker})${punchBlur > 0.3 ? ` blur(${punchBlur}px)` : ""}`,
        }}
      >
        <Video src={staticFile(SRC)} muted style={videoStyle} />
        {/* dreamy bloom: a blurred, brightened copy screened on top */}
        <AbsoluteFill style={{ mixBlendMode: "screen", opacity: bloom, filter: "blur(22px) brightness(1.35) saturate(1.2)" }}>
          <Video src={staticFile(SRC)} muted style={videoStyle} />
        </AbsoluteFill>
      </AbsoluteFill>

      <Sparkles t={t} />

      {/* animated film grain */}
      <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: 0.16, pointerEvents: "none" }}>
        <svg width={W} height={H}>
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={frame % 24} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width={W} height={H} filter="url(#grain)" />
        </svg>
      </AbsoluteFill>

      {/* vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 75% 70% at 55% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,${vignette}) 100%)`,
        }}
      />
      <AbsoluteFill style={{ backgroundColor: "#fff5e0", opacity: flash }} />
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: fadeOut }} />
    </AbsoluteFill>
  );
};
