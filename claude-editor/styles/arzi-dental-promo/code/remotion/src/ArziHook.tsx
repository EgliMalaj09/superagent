import {
  AbsoluteFill,
  interpolate,
  spring,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * ARZI HOOK — 6.0s vertical hook from the dentist clip:
 * "A chi stai affidando il tuo sorriso? | Se stai pensando di curare i denti in Albania, | il prezzo conta."
 * (pauses removed; punch in at 2.0s and punch out at 4.8s hide the jump cuts).
 * Captions: the "smile highlight" style — words rise in as spoken, keywords
 * pop into a white pill with a shine sweep and sparkles.
 */

const SANS = "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const JUMP = 2.0;
const JUMP2 = 4.8;

type Word = { w: string; s: number; pill?: boolean };
const CHUNKS: { to: number; lines: Word[][] }[] = [
  { to: 0.62, lines: [[{ w: "A", s: -0.2 }, { w: "chi", s: -0.2 }, { w: "stai", s: 0.4 }]] },
  { to: 1.18, lines: [[{ w: "affidando", s: 0.62 }]] },
  { to: 2.0, lines: [[{ w: "il", s: 1.18 }, { w: "tuo", s: 1.3 }], [{ w: "sorriso?", s: 1.54, pill: true }]] },
  { to: 2.54, lines: [[{ w: "Se", s: 2.02 }, { w: "stai", s: 2.28 }]] },
  { to: 3.28, lines: [[{ w: "pensando", s: 2.54 }, { w: "di", s: 3.02 }]] },
  { to: 3.98, lines: [[{ w: "curare", s: 3.28 }, { w: "i", s: 3.6 }, { w: "denti", s: 3.74 }]] },
  { to: 4.84, lines: [[{ w: "in", s: 3.98 }], [{ w: "Albania", s: 4.16, pill: true }]] },
  { to: 9, lines: [[{ w: "il", s: 4.86 }, { w: "prezzo", s: 5.06 }, { w: "conta.", s: 5.44 }]] },
];

const Sparkle: React.FC<{ x: number; y: number; size: number; local: number; delay: number }> = ({ x, y, size, local, delay }) => {
  const l = local - delay;
  if (l < 0) return null;
  const pop = interpolate(l, [0, 0.12, 0.3], [0, 1.3, 1], clamp);
  const twinkle = 0.65 + 0.35 * Math.sin(l * 9 + delay * 10);
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
        transform: `scale(${pop * twinkle}) rotate(${l * 40}deg)`,
        opacity: Math.min(1, pop),
      }}
    >
      ✦
    </span>
  );
};

const Pill: React.FC<{ text: string; s: number; t: number; frame: number; fps: number }> = ({ text, s, t, frame, fps }) => {
  if (t < s) return <span style={{ display: "inline-block", opacity: 0, padding: "6px 36px 12px" }}>{text}</span>;
  const pop = spring({ frame: frame - s * fps, fps, config: { damping: 11, stiffness: 170, mass: 0.8 } });
  const local = t - s;
  const shine = interpolate(local, [0.25, 0.85], [-60, 160], clamp);
  const glow = interpolate(local, [0, 0.15, 0.8], [0, 1, 0.55], clamp);
  return (
    <span
      style={{
        display: "inline-block",
        position: "relative",
        padding: "6px 36px 12px",
        borderRadius: 70,
        background: "linear-gradient(180deg, #ffffff 0%, #eef6ff 100%)",
        color: "#0f2a44",
        textShadow: "none",
        opacity: Math.min(1, pop * 1.4),
        transform: `scale(${0.6 + 0.4 * pop})`,
        boxShadow: `0 0 ${30 + 30 * glow}px rgba(255,255,255,${0.35 + 0.35 * glow}), 0 8px 24px rgba(0,0,0,0.35)`,
      }}
    >
      <span style={{ position: "absolute", inset: 0, borderRadius: 70, overflow: "hidden" }}>
        <span
          style={{
            position: "absolute",
            top: -20,
            bottom: -20,
            left: `${shine}%`,
            width: 80,
            transform: "skewX(-20deg)",
            background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(190,225,255,0.9) 50%, rgba(255,255,255,0) 100%)",
          }}
        />
      </span>
      <span style={{ position: "relative" }}>{text}</span>
      <Sparkle x={-40} y={-50} size={58} local={local} delay={0.08} />
      <Sparkle x={-30} y={80} size={34} local={local} delay={0.16} />
      <Sparkle x={-80} y={10} size={26} local={local} delay={0.3} />
    </span>
  );
};

export const ArziHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // slow push on each half; the second half starts punched in to hide the jump
  // slow push on each part; each jump cut alternates punch in / punch out to hide it
  const scale = t < JUMP
    ? interpolate(t, [0, JUMP], [1.0, 1.04], clamp)
    : t < JUMP2
      ? 1.12 - interpolate(t, [JUMP, JUMP + 0.35], [0, 0.03], clamp) + interpolate(t, [JUMP, JUMP2], [0, 0.03], clamp)
      : 1.02 + interpolate(t, [JUMP2, 6.0], [0, 0.05], clamp);

  const chunk = CHUNKS.find((c) => t >= c.lines[0][0].s && t < c.to);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "50% 28%" }}>
        <OffthreadVideo src={staticFile("rec/arzi916b.mp4")} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 52%, rgba(0,0,0,0.42) 78%, rgba(0,0,0,0.2) 100%)" }} />

      {chunk && (
        <div
          style={{
            position: "absolute",
            left: 40,
            right: 40,
            top: 1240,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 92,
            lineHeight: 1.25,
            color: "#fff",
          }}
        >
          {chunk.lines.map((line, li) => (
            <div key={li}>
              {line.map((wd, wi) => {
                if (wd.pill) return <Pill key={wi} text={wd.w} s={wd.s} t={t} frame={frame} fps={fps} />;
                const p = interpolate(t, [wd.s, wd.s + 0.12], [0, 1], clamp);
                return (
                  <span
                    key={wi}
                    style={{
                      display: "inline-block",
                      opacity: p,
                      transform: `translateY(${(1 - p) * 26}px)`,
                      filter: `blur(${(1 - p) * 6}px)`,
                      textShadow: "0 4px 18px rgba(0,0,0,0.8)",
                      margin: "0 12px",
                    }}
                  >
                    {wd.w}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};
