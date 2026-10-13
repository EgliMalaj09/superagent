import { AbsoluteFill, interpolate, spring, useCurrentFrame } from "remotion";

/**
 * The Poppins pop captions (same look as FullCaptionsPop) driven by a chunk
 * list passed in as a prop. Words at 0 s are fully shown on frame 0 so the
 * hook text is on the first frame.
 */

const FONT = "'Poppins', -apple-system, sans-serif";
const YELLOW = "#FFE14D";
export type CapWord = [string, number, boolean?];
export type CapChunk = CapWord[];
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const PopCaptionsFrom: React.FC<{ chunks: CapChunk[]; top?: number }> = ({ chunks, top = 1120 }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const idx = chunks.findIndex((c, i) => {
    const next = chunks[i + 1]?.[0][1] ?? 99;
    return t >= c[0][1] && t < Math.min(next, c[c.length - 1][1] + 0.9);
  });
  if (idx < 0) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 50,
          right: 50,
          top,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 104,
          lineHeight: 1.08,
          letterSpacing: "-0.01em",
        }}
      >
        {chunks[idx].map(([w, s, hi], i) => {
          if (t < s) return null;
          const instant = s === 0;
          const pop = instant ? 1 : spring({ frame: f - Math.round(s * 30), fps: 30, config: { damping: 14, stiffness: 260, mass: 0.6 } });
          const o = instant ? 1 : interpolate(f - s * 30, [0, 3], [0, 1], clamp);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                margin: "0 14px",
                color: hi ? YELLOW : "#ffffff",
                textTransform: hi ? "uppercase" : "none",
                opacity: o,
                transform: `scale(${0.85 + 0.15 * pop})`,
                textShadow: "0 4px 14px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.6)",
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
