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
 * TALK CAPTIONS — selfie talking head (already stabilised + colour-corrected
 * in ffmpeg) with word-punch captions and two face-anchored punch-ins.
 * Word timings: Whisper word stamps, snapped to the real pauses in the audio.
 */

const AMBER = "#FFB547";
const BLOCK_FONT = "'Space Grotesk', system-ui, sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type Word = { w: string; s: number; e: number };
const LINES: Word[][] = [
  [{ w: "Përshëndetje,", s: 1.08, e: 1.98 }],
  [{ w: "grupi", s: 2.52, e: 3.39 }, { w: "Rizgjimi,", s: 3.65, e: 4.41 }],
  [{ w: "jemi", s: 5.22, e: 5.5 }, { w: "këtu", s: 5.5, e: 5.85 }],
  [{ w: "dhe", s: 6.32, e: 6.8 }, { w: "pretendojmë", s: 6.8, e: 7.76 }],
  [{ w: "të", s: 7.76, e: 8.22 }, { w: "kryejmë", s: 8.22, e: 8.62 }],
  [{ w: "një", s: 8.62, e: 8.94 }, { w: "revolucion", s: 8.94, e: 10.1 }],
];

// Face-anchored punch-ins: [start, peak scale, release start, release end]
const PUNCHES: [number, number, number, number][] = [
  [3.55, 1.08, 4.7, 5.2],
  [8.85, 1.13, 99, 100],
];
const ease = Easing.bezier(0.4, 0, 0.2, 1);

export const TalkCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  let scale = 1;
  for (const [a, peak, r0, r1] of PUNCHES) {
    const inK = interpolate(t, [a, a + 0.35], [0, 1], { ...clamp, easing: ease });
    const outK = interpolate(t, [r0, r1], [0, 1], { ...clamp, easing: ease });
    scale = Math.max(scale, 1 + (peak - 1) * inK * (1 - outK));
  }

  const lineIdx = LINES.findIndex((ln, i) => {
    const start = ln[0].s;
    const next = LINES[i + 1]?.[0].s ?? 99;
    const end = Math.min(next, ln[ln.length - 1].e + 0.45);
    return t >= start && t < end;
  });
  const line = lineIdx >= 0 ? LINES[lineIdx] : null;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "50% 32%" }}>
        <OffthreadVideo src={staticFile("rec/talk.mp4")} muted />
      </AbsoluteFill>

      {line && (() => {
        const p = interpolate(t, [line[0].s, line[0].s + 0.18], [0, 1], clamp);
        const eased = 1 - Math.pow(1 - p, 3);
        return (
          <div
            style={{
              position: "absolute",
              top: 1300,
              left: 60,
              right: 60,
              textAlign: "center",
              opacity: p,
              transform: `translateY(${(1 - eased) * 26}px)`,
              filter: `blur(${(1 - eased) * 8}px)`,
            }}
          >
            {line.map((wd, i) => {
              const active = t >= wd.s;
              return (
                <span
                  key={i}
                  style={{
                    fontFamily: BLOCK_FONT,
                    fontWeight: 700,
                    fontSize: 104,
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                    textTransform: "uppercase",
                    color: active && t < wd.e + 0.25 ? AMBER : "#fff",
                    WebkitTextStroke: "14px #000",
                    paintOrder: "stroke fill",
                    textShadow: "0 8px 30px rgba(0,0,0,0.75)",
                    margin: "0 14px",
                    display: "inline-block",
                  }}
                >
                  {wd.w}
                </span>
              );
            })}
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};
