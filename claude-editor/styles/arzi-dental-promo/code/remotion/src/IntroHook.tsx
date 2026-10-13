import {
  AbsoluteFill,
  Easing,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * INTRO HOOK — 2.8s: effect montage (0–1.47s, left untouched so the effect
 * reads clearly) then the speaker, who transforms x-ray → inverted → real.
 * The speaker section is graded in ffmpeg; here it gets reframed (face
 * higher/bigger), a cinematic settle, and a punch-in on "5 HAPA" while the
 * five fingers are up. Word-punch captions throughout; "5 HAPA" is the hero.
 */

const AMBER = "#FFB547";
const BLOCK_FONT = "'Space Grotesk', system-ui, sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.4, 0, 0.2, 1);

const SPEAKER_IN = 1.466; // cut to the speaker (x-ray frame)
const HERO_AT = 1.94; // "5 hapa"

type Word = { w: string; s: number; e: number };
const LINES: Word[][] = [
  [{ w: "Si", s: 0.0, e: 0.3 }, { w: "ta", s: 0.3, e: 0.68 }, { w: "krijosh", s: 0.68, e: 1.0 }],
  [{ w: "këtë", s: 1.0, e: 1.12 }, { w: "efekt", s: 1.12, e: 1.4 }],
  [{ w: "në", s: 1.4, e: 1.62 }, { w: "vetëm", s: 1.62, e: 1.94 }],
];

const Caption: React.FC<{ t: number }> = ({ t }) => {
  const idx = LINES.findIndex((ln, i) => t >= ln[0].s && t < (LINES[i + 1]?.[0].s ?? HERO_AT));
  if (idx < 0) return null;
  const line = LINES[idx];
  const p = interpolate(t, [line[0].s, line[0].s + 0.12], [0, 1], clamp);
  const k = 1 - Math.pow(1 - p, 3);
  return (
    <div
      style={{
        position: "absolute",
        top: 1330,
        left: 50,
        right: 50,
        textAlign: "center",
        opacity: p,
        transform: `translateY(${(1 - k) * 22}px)`,
        filter: `blur(${(1 - k) * 7}px)`,
      }}
    >
      {line.map((wd, i) => (
        <span
          key={i}
          style={{
            fontFamily: BLOCK_FONT,
            fontWeight: 700,
            fontSize: 108,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            color: t >= wd.s && t < wd.e + 0.15 ? AMBER : "#fff",
            WebkitTextStroke: "14px #000",
            paintOrder: "stroke fill",
            textShadow: "0 8px 30px rgba(0,0,0,0.75)",
            margin: "0 14px",
            display: "inline-block",
          }}
        >
          {wd.w}
        </span>
      ))}
    </div>
  );
};

/** "5 HAPA" hero: the 5 slams in huge, HAPA follows, amber glow. */
const Hero: React.FC<{ t: number }> = ({ t }) => {
  if (t < HERO_AT) return null;
  const slam = interpolate(t, [HERO_AT, HERO_AT + 0.14], [0, 1], clamp);
  const k = 1 - Math.pow(1 - slam, 3);
  const hapa = interpolate(t, [HERO_AT + 0.08, HERO_AT + 0.24], [0, 1], clamp);
  const hk = 1 - Math.pow(1 - hapa, 3);
  const shared = {
    fontFamily: BLOCK_FONT,
    fontWeight: 700,
    lineHeight: 0.9,
    letterSpacing: "-0.03em",
    WebkitTextStroke: "16px #000",
    paintOrder: "stroke fill",
  } as const;
  return (
    <div
      style={{
        position: "absolute",
        top: 1250,
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 34,
      }}
    >
      <div
        style={{
          ...shared,
          fontSize: 330,
          color: AMBER,
          opacity: slam,
          transform: `scale(${1.6 - 0.6 * k})`,
          filter: `blur(${(1 - k) * 10}px)`,
          textShadow: `0 0 60px ${AMBER}88, 0 10px 40px rgba(0,0,0,0.8)`,
        }}
      >
        5
      </div>
      <div
        style={{
          ...shared,
          fontSize: 190,
          color: "#fff",
          opacity: hapa,
          transform: `translateX(${(1 - hk) * 60}px)`,
          filter: `blur(${(1 - hk) * 8}px)`,
          textShadow: "0 10px 40px rgba(0,0,0,0.8)",
        }}
      >
        HAPA
      </div>
    </div>
  );
};

export const IntroHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Speaker reframe: zoom 1.18 and lift ~140px so the face sits near centre
  // instead of low with a big empty wall above. Opens a touch tighter and
  // settles (cinematic hook motion), then punches in on "5 HAPA".
  let transform = "none";
  if (t >= SPEAKER_IN) {
    const settle = interpolate(t, [SPEAKER_IN, SPEAKER_IN + 0.45], [0, 1], { ...clamp, easing: ease });
    const punch = interpolate(t, [HERO_AT - 0.05, HERO_AT + 0.25], [0, 1], { ...clamp, easing: ease });
    const scale = 1.26 - 0.08 * settle + 0.1 * punch;
    const lift = -140 * (scale / 1.18);
    transform = `translateY(${lift}px) scale(${scale})`;
  }
  // brief white flash on the cut from the montage into the speaker
  const flash = interpolate(t, [SPEAKER_IN - 0.03, SPEAKER_IN, SPEAKER_IN + 0.18], [0, 0.55, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform, transformOrigin: "50% 56%" }}>
        <OffthreadVideo src={staticFile("rec/intro.mp4")} muted />
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flash }} />
      <Caption t={t} />
      <Hero t={t} />
    </AbsoluteFill>
  );
};
