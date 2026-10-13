import { AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * HOOK FINALE — 10.0s vertical hook from the full-res take (pauses trimmed,
 * voice at its natural speed, full sentence kept). Plain captions (no pills, no sounds) in the same type as
 * the other Dental Med Austria clips. Each jump cut alternates the framing
 * between a wide and a punched-in crop so it reads as a camera change.
 */

const SANS = "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CUTS = [2.02, 4.72, 5.92, 8.2];
const END = 10.0;

type Word = { w: string; s: number };
const CHUNKS: { to: number; words: Word[] }[] = [
  { to: 0.64, words: [{ w: "A", s: -0.2 }, { w: "chi", s: -0.2 }, { w: "stai", s: 0.42 }] },
  { to: 1.22, words: [{ w: "affidando", s: 0.64 }] },
  { to: 2.2, words: [{ w: "il", s: 1.22 }, { w: "tuo", s: 1.38 }, { w: "sorriso?", s: 1.58 }] },
  { to: 3.04, words: [{ w: "Se", s: 2.2 }, { w: "stai", s: 2.3 }, { w: "pensando", s: 2.58 }] },
  { to: 4.0, words: [{ w: "di", s: 3.04 }, { w: "curare", s: 3.3 }, { w: "i", s: 3.62 }, { w: "denti", s: 3.76 }] },
  { to: 4.94, words: [{ w: "in", s: 4.0 }, { w: "Albania,", s: 4.16 }] },
  { to: 6.1, words: [{ w: "il", s: 4.94 }, { w: "prezzo", s: 5.1 }, { w: "conta,", s: 5.4 }] },
  { to: 6.84, words: [{ w: "ma", s: 6.1 }, { w: "conta", s: 6.22 }, { w: "anche", s: 6.54 }] },
  { to: 7.52, words: [{ w: "sapere", s: 6.84 }, { w: "chi", s: 7.24 }, { w: "ti", s: 7.4 }] },
  { to: 8.4, words: [{ w: "seguirà", s: 7.52 }, { w: "prima,", s: 7.84 }] },
  { to: 9.3, words: [{ w: "durante", s: 8.4 }, { w: "e", s: 8.72 }, { w: "dopo", s: 9.02 }] },
  { to: 99, words: [{ w: "il", s: 9.3 }, { w: "trattamento.", s: 9.46 }] },
];

export const HookFinale: React.FC = () => {
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
        <OffthreadVideo src={staticFile("rec/hookfin.mp4")} muted />
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
