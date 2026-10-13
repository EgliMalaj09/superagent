import { AbsoluteFill } from "remotion";

/** Plan card for an AI scene of Creative 03 (rendered as a still, looped by ffmpeg). */
const SANS = "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif";
const COLOR: Record<string, string> = { AI: "#8b5cf6", ANIM: "#E2C17A" };
export type C3CardProps = { id: string; kind: string; text: string; line: string; secs: number };
export const C3Card: React.FC<C3CardProps> = ({ id, kind, text, line, secs }) => (
  <AbsoluteFill style={{ backgroundColor: "#000", padding: "0 90px", justifyContent: "center", fontFamily: SANS }}>
    <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 40, fontWeight: 600, letterSpacing: "0.12em" }}>SKENA {id}</div>
    <div style={{ alignSelf: "flex-start", marginTop: 24, padding: "10px 34px", borderRadius: 60, background: COLOR[kind] ?? "#8b5cf6", color: "#0b0b0c", fontSize: 56, fontWeight: 800 }}>{kind}</div>
    <div style={{ marginTop: 50, color: "#fff", fontSize: 64, fontWeight: 700, lineHeight: 1.2 }}>{text}</div>
    <div style={{ marginTop: 50, color: "rgba(255,255,255,0.55)", fontSize: 40, fontStyle: "italic", lineHeight: 1.3 }}>“{line}”</div>
    <div style={{ marginTop: 50, color: "rgba(255,255,255,0.45)", fontSize: 38, fontWeight: 600 }}>{secs.toFixed(1)} s</div>
  </AbsoluteFill>
);
