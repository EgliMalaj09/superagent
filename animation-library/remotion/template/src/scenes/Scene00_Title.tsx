import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { DISPLAY, LABEL, RED } from "../fonts";

const TITLE = "TITULLI I VIDEOS";
const SUBTITLE = "SHQIPËRI · 2026";

/** Cold open: title letters flicker on over black before the voice starts. */
export const Scene00Title: React.FC = () => {
  const frame = useCurrentFrame();
  const sub = interpolate(frame, [30, 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const out = interpolate(frame, [52, 60], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #200404 0%, #000 65%)", opacity: out }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 30, padding: 60 }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 118, color: RED, letterSpacing: 4, textAlign: "center", textShadow: "0 0 60px rgba(226,24,24,0.8)" }}>
          {TITLE.split("").map((ch, i) => {
            const onAt = 4 + i * 1.6;
            const on = frame >= onAt && random(`t-${i}-${Math.floor(frame / 2)}`) > (frame < onAt + 6 ? 0.45 : 0.03);
            return (
              <span key={i} style={{ opacity: on ? 1 : 0.06 }}>
                {ch}
              </span>
            );
          })}
        </div>
        <div style={{ fontFamily: LABEL, fontSize: 34, color: "#bbb", letterSpacing: 18, opacity: sub }}>{SUBTITLE}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
