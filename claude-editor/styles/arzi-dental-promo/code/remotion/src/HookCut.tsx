import {
  AbsoluteFill,
  Freeze,
  interpolate,
  Sequence,
  Video,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * HOOK CUT — 4.06s: pauses trimmed from the voice (voice itself untouched).
 *   0.00–1.36  black screen, "Po e shikon" → "videon apo jo?" typed in sync
 *   1.36–2.62  desk shots, captions "Hook-u e / bëri detyrën."
 *   2.62–4.06  monitor: cursor journey slowed so the Start click lands on
 *              "bashkë" (3.62s), then the last frame holds with a slow push.
 * Word times are in the trimmed timeline (seconds).
 */

const FPS = 30;
const BG = "#0b0b0c";
const FONT = "-apple-system, 'SF Pro Display', 'SF Pro Text', system-ui, 'Helvetica Neue', sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type W = { w: string; s: number; e: number };

// Black-screen cards: letters of each word type out across the time it is spoken.
const CARDS: { from: number; to: number; words: W[] }[] = [
  { from: 0, to: 0.58, words: [{ w: "Po", s: 0.0, e: 0.12 }, { w: "e", s: 0.12, e: 0.3 }, { w: "shikon", s: 0.33, e: 0.57 }] },
  { from: 0.58, to: 1.36, words: [{ w: "videon", s: 0.58, e: 0.86 }, { w: "apo", s: 0.88, e: 1.02 }, { w: "jo?", s: 1.02, e: 1.11 }] },
];

// Small captions: chunks of 1–2 words, each word appears when it is spoken.
const CAPTIONS: { to: number; y: number; words: W[] }[] = [
  { to: 1.89, y: 0.6, words: [{ w: "Hook-u", s: 1.46, e: 1.8 }, { w: "e", s: 1.8, e: 1.89 }] },
  { to: 2.62, y: 0.6, words: [{ w: "bëri", s: 1.89, e: 2.09 }, { w: "detyrën.", s: 2.1, e: 2.42 }] },
  { to: 3.0, y: 0.8, words: [{ w: "Hajde", s: 2.68, e: 2.92 }, { w: "ta", s: 2.93, e: 3.0 }] },
  { to: 3.36, y: 0.8, words: [{ w: "krijojmë", s: 3.0, e: 3.34 }] },
  { to: 3.62, y: 0.8, words: [{ w: "një", s: 3.36, e: 3.46 }, { w: "tjetër", s: 3.46, e: 3.61 }] },
  { to: 4.06, y: 0.8, words: [{ w: "bashkë.", s: 3.62, e: 3.83 }] },
];

const BlackCard: React.FC<{ t: number }> = ({ t }) => {
  const card = CARDS.find((c) => t >= c.from && t < c.to);
  if (!card) return null;
  const letters: { ch: string; at: number }[] = [];
  card.words.forEach((wd, wi) => {
    const chars = [...wd.w];
    chars.forEach((ch, i) => letters.push({ ch, at: wd.s + ((wd.e - wd.s) * i) / chars.length }));
    if (wi < card.words.length - 1) letters.push({ ch: " ", at: wd.e });
  });
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <div
        style={{
          position: "absolute",
          top: "55%",
          left: 0,
          right: 0,
          transform: "translateY(-50%)",
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: 140,
          letterSpacing: "-0.01em",
          color: "#f4f4f4",
          whiteSpace: "pre",
        }}
      >
        {letters.filter((l) => t >= l.at).map((l, i) => (
          <span key={i} style={{ opacity: interpolate(t, [l.at, l.at + 0.1], [0.4, 1], clamp) }}>
            {l.ch}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Caption: React.FC<{ t: number }> = ({ t }) => {
  const cap = CAPTIONS.find((c) => t >= c.words[0].s && t < c.to);
  if (!cap) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: `${cap.y * 100}%`,
        left: 60,
        right: 60,
        transform: "translateY(-50%)",
        textAlign: "center",
        fontFamily: FONT,
        fontWeight: 500,
        fontSize: 64,
        color: "#ffffff",
        textShadow: "0 2px 12px rgba(0,0,0,0.75), 0 0 3px rgba(0,0,0,0.6)",
        whiteSpace: "pre",
      }}
    >
      {cap.words.map((wd, i) => {
        const o = interpolate(t, [wd.s, wd.s + 0.08], [0, 1], clamp);
        return (
          <span key={i} style={{ opacity: o }}>
            {i > 0 ? " " : ""}
            {wd.w}
          </span>
        );
      })}
    </div>
  );
};

export const HookCut: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const DESK = Math.round(1.36 * FPS); // 41
  const CRT = Math.round(2.62 * FPS); // 79
  const CRT2 = CRT + 30; // after the 1.0s slowed cursor journey (click on "bashkë")
  const HOLD = CRT2 + 4; // after the 4 post-click frames
  const push = interpolate(t, [2.62, 4.06], [1.0, 1.06], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <BlackCard t={t} />
      <Sequence from={DESK} durationInFrames={CRT - DESK}>
        <Video src={staticFile("rec/desk.mp4")} muted />
      </Sequence>
      <Sequence from={CRT} durationInFrames={122 - CRT}>
        <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "50% 45%" }}>
          <Sequence durationInFrames={CRT2 - CRT}>
            <Video src={staticFile("rec/crt1.mp4")} muted />
          </Sequence>
          <Sequence from={CRT2 - CRT} durationInFrames={HOLD - CRT2}>
            <Video src={staticFile("rec/crt2.mp4")} muted />
          </Sequence>
          <Sequence from={HOLD - CRT} durationInFrames={122 - HOLD}>
            <Freeze frame={3}>
              <Video src={staticFile("rec/crt2.mp4")} muted />
            </Freeze>
          </Sequence>
        </AbsoluteFill>
      </Sequence>
      <Caption t={t} />
    </AbsoluteFill>
  );
};
