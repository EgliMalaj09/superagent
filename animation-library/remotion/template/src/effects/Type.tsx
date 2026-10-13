import { CSSProperties, ReactNode } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { DISPLAY, LABEL, RED } from "../fonts";
import { smashIn } from "../motion/helpers";

/** Text that smashes in (huge → settle) at a scene-local frame. */
export const Slam: React.FC<{
  at: number;
  children: ReactNode;
  size?: number;
  color?: string;
  glow?: string;
  settle?: number;
  style?: CSSProperties;
}> = ({ at, children, size = 120, color = "#fff", glow, settle = 8, style }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const s = smashIn(frame, at, settle);
  return (
    <div
      style={{
        fontFamily: DISPLAY,
        fontSize: size,
        lineHeight: 1,
        color,
        textAlign: "center",
        textTransform: "uppercase",
        transform: `scale(${s.scale})`,
        opacity: s.opacity,
        textShadow: `0 6px 0 #000${glow ? `, 0 0 50px ${glow}` : ""}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Red rubber stamp that slams onto whatever is underneath. */
export const Stamp: React.FC<{
  at: number;
  text: string;
  rotate?: number;
  size?: number;
  style?: CSSProperties;
}> = ({ at, text, rotate = -12, size = 34, style }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const s = smashIn(frame, at, 6);
  return (
    <div
      style={{
        display: "inline-block",
        padding: `${size * 0.2}px ${size * 0.6}px`,
        border: `${Math.max(4, size * 0.14)}px solid ${RED}`,
        color: RED,
        fontFamily: DISPLAY,
        fontSize: size,
        letterSpacing: size * 0.08,
        whiteSpace: "nowrap",
        background: "rgba(0,0,0,0.45)",
        boxShadow: "0 0 24px rgba(226,24,24,0.55)",
        transform: `rotate(${rotate}deg) scale(${s.scale})`,
        opacity: s.opacity * 0.95,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** News-ticker style label bar that wipes in from the left. */
export const Bar: React.FC<{
  at: number;
  children: ReactNode;
  size?: number;
  bg?: string;
  color?: string;
  style?: CSSProperties;
}> = ({ at, children, size = 40, bg = RED, color = "#fff", style }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const p = interpolate(frame, [at, at + 8], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        display: "inline-block",
        padding: `${size * 0.25}px ${size * 0.6}px`,
        background: bg,
        color,
        fontFamily: LABEL,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: size * 0.06,
        textTransform: "uppercase",
        clipPath: `inset(0 ${100 - p * 100}% 0 0)`,
        boxShadow: "0 8px 0 rgba(0,0,0,0.6)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
