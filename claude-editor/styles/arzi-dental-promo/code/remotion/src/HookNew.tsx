import { AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * HOOK NEW — 8.3s vertical hook (pauses removed, delivery sped 1.4x, full
 * sentence kept). Plain captions (no pills, no sounds) in the same type as
 * the other Dental Med Austria clips. Each jump cut alternates the framing
 * between a wide and a punched-in crop so it reads as a camera change.
 */

const SANS = "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CUTS = [1.443, 3.543, 4.471, 5.6, 6.243, 6.6, 7.186];
const END = 8.3;

type Word = { w: string; s: number };
const CHUNKS: { to: number; words: Word[] }[] = [
  { to: 0.46, words: [{ w: "A", s: -0.2 }, { w: "chi", s: -0.2 }, { w: "stai", s: 0.32 }] },
  { to: 0.88, words: [{ w: "affidando", s: 0.46 }] },
  { to: 1.56, words: [{ w: "il", s: 0.88 }, { w: "tuo", s: 0.98 }, { w: "sorriso?", s: 1.14 }] },
  { to: 2.18, words: [{ w: "Se", s: 1.56 }, { w: "stai", s: 1.68 }, { w: "pensando", s: 1.84 }] },
  { to: 2.94, words: [{ w: "di", s: 2.18 }, { w: "curare", s: 2.4 }, { w: "i", s: 2.66 }, { w: "denti", s: 2.74 }] },
  { to: 3.7, words: [{ w: "in", s: 2.94 }, { w: "Albania,", s: 3.08 }] },
  { to: 4.6, words: [{ w: "il", s: 3.7 }, { w: "prezzo", s: 3.84 }, { w: "conta,", s: 4.1 }] },
  { to: 5.24, words: [{ w: "ma", s: 4.6 }, { w: "conta", s: 4.7 }, { w: "anche", s: 4.96 }] },
  { to: 5.94, words: [{ w: "sapere", s: 5.24 }, { w: "chi", s: 5.64 }, { w: "ti", s: 5.78 }] },
  { to: 6.86, words: [{ w: "seguirà", s: 5.94 }, { w: "prima,", s: 6.32 }] },
  { to: 7.64, words: [{ w: "durante", s: 6.86 }, { w: "e", s: 7.12 }, { w: "dopo", s: 7.4 }] },
  { to: 99, words: [{ w: "il", s: 7.64 }, { w: "trattamento.", s: 7.76 }] },
];

export const HookNew: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const starts = [0, ...CUTS];
  const seg = starts.filter((s) => t >= s).length - 1;
  const segStart = starts[seg];
  const segEnd = CUTS[seg] ?? END;
  const base = seg % 2 === 0 ? 1.0 : 1.1; // alternate wide / punched-in
  const scale = base + interpolate(t, [segStart, segEnd], [0, 0.025], clamp);

  const chunk = CHUNKS.find((c) => t >= c.words[0].s && t < c.to);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "50% 25%" }}>
        <OffthreadVideo src={staticFile("rec/hooknew.mp4")} muted />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.42) 75%, rgba(0,0,0,0.25) 100%)" }} />
      {chunk && (
        <div
          style={{
            position: "absolute",
            left: 50,
            right: 50,
            top: 1290,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 92,
            lineHeight: 1.2,
            color: "#fff",
          }}
        >
          {chunk.words.map((wd, i) => {
            const p = interpolate(t, [wd.s, wd.s + 0.1], [0, 1], clamp);
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: p,
                  transform: `translateY(${(1 - p) * 22}px)`,
                  filter: `blur(${(1 - p) * 5}px)`,
                  textShadow: "0 4px 18px rgba(0,0,0,0.85)",
                  margin: "0 12px",
                }}
              >
                {wd.w}
              </span>
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};
