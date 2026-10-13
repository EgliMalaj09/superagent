import { AbsoluteFill, Img, staticFile } from "remotion";

/**
 * CAPTION STYLES — static previews of four caption looks on a frame of the
 * dental-clinic video (1920×1080), all showing the full line in its final state.
 */

export type CaptionStyleProps = { style: 1 | 2 | 3 | 4 };

const SANS = "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif";
const GOLD = "linear-gradient(180deg, #f6e3a8 0%, #d9b45a 45%, #a8822f 100%)";

export const CaptionStyles: React.FC<CaptionStyleProps> = ({ style }) => {
  let caption: React.ReactNode = null;

  if (style === 1) {
    // Luxury serif: Didot italic, keyword in gold, hairline underline
    caption = (
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, textAlign: "center" }}>
        <div style={{ fontFamily: "Didot, 'Bodoni 72', serif", fontSize: 76, color: "#fff", textShadow: "0 3px 18px rgba(0,0,0,0.7)" }}>
          A chi stai affidando il tuo{" "}
          <span style={{ fontStyle: "italic", backgroundImage: GOLD, WebkitBackgroundClip: "text", color: "transparent", filter: "drop-shadow(0 3px 10px rgba(0,0,0,0.6))" }}>
            sorriso?
          </span>
        </div>
        <div style={{ width: 220, height: 2, margin: "18px auto 0", backgroundImage: GOLD }} />
      </div>
    );
  } else if (style === 2) {
    // Smile highlight: clean sans, keyword inside a bright white pill with sparkles
    caption = (
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 110, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 70, color: "#fff", textShadow: "0 3px 16px rgba(0,0,0,0.75)" }}>
        A chi stai affidando il tuo{" "}
        <span
          style={{
            display: "inline-block",
            position: "relative",
            padding: "4px 30px 10px",
            borderRadius: 60,
            background: "linear-gradient(180deg, #ffffff 0%, #eef6ff 100%)",
            color: "#0f2a44",
            textShadow: "none",
            boxShadow: "0 0 40px rgba(255,255,255,0.55), 0 8px 24px rgba(0,0,0,0.35)",
          }}
        >
          sorriso?
          <span style={{ position: "absolute", right: -26, top: -30, fontSize: 52, color: "#fff", textShadow: "0 0 18px #fff" }}>✦</span>
          <span style={{ position: "absolute", left: -18, bottom: -14, fontSize: 30, color: "#fff", textShadow: "0 0 12px #fff" }}>✦</span>
        </span>
      </div>
    );
  } else if (style === 3) {
    // Gold editorial: small tracked label + big bold line, keyword in gold
    caption = (
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 100, textAlign: "center", fontFamily: SANS }}>
        <div style={{ fontSize: 26, letterSpacing: "0.42em", color: "#e7cf8a", fontWeight: 600, marginBottom: 10, textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
          DENTAL MED AUSTRIA
        </div>
        <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", textTransform: "uppercase", lineHeight: 1, textShadow: "0 4px 22px rgba(0,0,0,0.75)" }}>
          A chi affidi il tuo{" "}
          <span style={{ backgroundImage: GOLD, WebkitBackgroundClip: "text", color: "transparent", filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.6))" }}>sorriso?</span>
        </div>
      </div>
    );
  } else {
    // Minimal lower-third: left-aligned with a gold bar, documentary feel
    caption = (
      <div style={{ position: "absolute", left: 110, bottom: 130, display: "flex", alignItems: "stretch", gap: 26, fontFamily: SANS }}>
        <div style={{ width: 6, borderRadius: 3, backgroundImage: GOLD }} />
        <div>
          <div style={{ fontSize: 60, fontWeight: 600, color: "#fff", lineHeight: 1.1, textShadow: "0 3px 14px rgba(0,0,0,0.75)" }}>
            A chi stai affidando
          </div>
          <div style={{ fontSize: 60, fontWeight: 300, color: "#fff", lineHeight: 1.1, textShadow: "0 3px 14px rgba(0,0,0,0.75)" }}>
            il tuo <span style={{ fontWeight: 700, color: "#e7cf8a" }}>sorriso?</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AbsoluteFill>
      <Img src={staticFile("rec/dent_frame.png")} style={{ width: 1920, height: 1080 }} />
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.45) 100%)" }} />
      {caption}
      <div style={{ position: "absolute", left: 40, top: 30, fontFamily: SANS, fontSize: 44, fontWeight: 800, color: "#fff", background: "rgba(0,0,0,0.55)", padding: "4px 22px", borderRadius: 14 }}>
        {style}
      </div>
    </AbsoluteFill>
  );
};
