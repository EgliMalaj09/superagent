import {
  AbsoluteFill,
  interpolate,
  spring,
  Video,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * DENTAL CAPTION — "A chi stai affidando il tuo sorriso?" (4.5s, 1920×1080).
 * Graded source + "smile highlight" captions: each word rises in as it is
 * spoken, then "sorriso?" pops into a bright white pill with a shine sweep
 * and twinkling sparkles.
 */

const SANS = "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const WORDS: { w: string; s: number }[] = [
  { w: "A", s: 0.96 },
  { w: "chi", s: 1.16 },
  { w: "stai", s: 1.32 },
  { w: "affidando", s: 1.56 },
  { w: "il", s: 2.2 },
  { w: "tuo", s: 2.26 },
];
const KEY = 2.48; // "sorriso?"

const Sparkle: React.FC<{ x: number; y: number; size: number; t: number; delay: number }> = ({ x, y, size, t, delay }) => {
  const local = t - KEY - delay;
  if (local < 0) return null;
  const pop = interpolate(local, [0, 0.12, 0.3], [0, 1.3, 1], clamp);
  const twinkle = 0.65 + 0.35 * Math.sin(local * 9 + delay * 10);
  return (
    <span
      style={{
        position: "absolute",
        left: x,
        top: y,
        fontSize: size,
        lineHeight: 1,
        color: "#fff",
        textShadow: "0 0 18px #fff, 0 0 32px rgba(190,225,255,0.9)",
        transform: `scale(${pop * twinkle}) rotate(${local * 40}deg)`,
        opacity: Math.min(1, pop),
      }}
    >
      ✦
    </span>
  );
};

export const DentalCaption: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const push = interpolate(t, [0, 4.5], [1.0, 1.045], clamp);
  const pill = spring({ frame: frame - KEY * fps, fps, config: { damping: 11, stiffness: 170, mass: 0.8 } });
  const shine = interpolate(t, [KEY + 0.25, KEY + 0.85], [-60, 160], clamp);
  const glow = interpolate(t, [KEY, KEY + 0.15, KEY + 0.8], [0, 1, 0.55], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "50% 38%" }}>
        <Video src={staticFile("rec/dent_graded.mp4")} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 58%, rgba(0,0,0,0.5) 100%)" }} />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 110,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 70,
          color: "#fff",
          whiteSpace: "pre",
        }}
      >
        {WORDS.map((wd, i) => {
          const p = interpolate(t, [wd.s, wd.s + 0.14], [0, 1], clamp);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: p,
                transform: `translateY(${(1 - p) * 26}px)`,
                filter: `blur(${(1 - p) * 6}px)`,
                textShadow: "0 3px 16px rgba(0,0,0,0.75)",
                marginRight: 18,
              }}
            >
              {wd.w}
            </span>
          );
        })}
        <span
          style={{
            display: "inline-block",
            position: "relative",
            padding: "4px 30px 10px",
            borderRadius: 60,
            overflow: "visible",
            background: "linear-gradient(180deg, #ffffff 0%, #eef6ff 100%)",
            color: "#0f2a44",
            opacity: t >= KEY ? Math.min(1, pill * 1.4) : 0,
            transform: `scale(${t >= KEY ? 0.6 + 0.4 * pill : 0.6})`,
            boxShadow: `0 0 ${30 + 30 * glow}px rgba(255,255,255,${0.35 + 0.35 * glow}), 0 8px 24px rgba(0,0,0,0.35)`,
          }}
        >
          {/* shine sweep across the pill, like light on enamel */}
          <span
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 60,
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: -20,
                bottom: -20,
                left: `${shine}%`,
                width: 70,
                transform: "skewX(-20deg)",
                background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(190,225,255,0.9) 50%, rgba(255,255,255,0) 100%)",
              }}
            />
          </span>
          <span style={{ position: "relative" }}>sorriso?</span>
          <Sparkle x={-30 + 300} y={-46} size={54} t={t} delay={0.08} />
          <Sparkle x={-30} y={60} size={32} t={t} delay={0.16} />
          <Sparkle x={150} y={-36} size={24} t={t} delay={0.3} />
        </span>
      </div>
    </AbsoluteFill>
  );
};
