import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";

/**
 * COMMENT CTA — the 1.6s effect montage stays untouched (no zoom, no grade,
 * no vignette) so the effect reads clearly; the call-to-action lives in the
 * dark lower third. "KOMENTO" is the message, so it lands first, biggest,
 * gets the amber underline and re-pulses on the big cuts.
 */

const AMBER = "#FFB547";
const BLOCK_FONT = "'Space Grotesk', system-ui, sans-serif";
const SCRIPT_FONT = "'Caveat', 'Bradley Hand', cursive";
const TEXT_SHADOW = "0 6px 36px rgba(0,0,0,0.92), 0 2px 12px rgba(0,0,0,0.80), 0 0 4px rgba(0,0,0,0.60)";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Cuts where KOMENTO re-pulses to pull the eye back (frames).
const PULSES = [20, 40];

/** Fade + rise + blur-off entrance, the WordPop-style reveal. */
const enter = (frame: number, start: number, len: number) => {
  const p = interpolate(frame, [start, start + len], [0, 1], clamp);
  const eased = 1 - Math.pow(1 - p, 3);
  return { opacity: p, rise: (1 - eased) * 30, blur: (1 - eased) * 10 };
};

export const CommentCta: React.FC = () => {
  const frame = useCurrentFrame();

  // KOMENTO slams in: from 1.3x to 1.0 with the blur burning off.
  const slam = interpolate(frame, [0, 6], [0, 1], clamp);
  const slamEased = 1 - Math.pow(1 - slam, 3);
  let komentoScale = 1.3 - 0.3 * slamEased;
  for (const p of PULSES) {
    komentoScale *= 1 + 0.07 * interpolate(frame, [p, p + 3, p + 8], [0, 1, 0], clamp);
  }
  const underline = interpolate(frame, [6, 16], [0, 1], clamp);
  const epike = enter(frame, 5, 7);
  const per = enter(frame, 9, 7);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo src={staticFile("rec/cta.mp4")} muted />

      {/* legibility shade — lower third only, never over the subjects */}
      <AbsoluteFill
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 58%, rgba(0,0,0,0.55) 72%, rgba(0,0,0,0.55) 88%, rgba(0,0,0,0) 100%)" }}
      />

      <div style={{ position: "absolute", top: 1235, left: 0, right: 0, textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            opacity: slam,
            transform: `scale(${komentoScale})`,
            filter: `blur(${(1 - slamEased) * 12}px)`,
          }}
        >
          <div
            style={{
              fontFamily: BLOCK_FONT,
              fontWeight: 700,
              fontSize: 180,
              lineHeight: 1,
              color: "#fff",
              letterSpacing: "-0.03em",
              textShadow: TEXT_SHADOW,
            }}
          >
            KOMENTO
          </div>
          <div
            style={{
              height: 14,
              marginTop: 10,
              borderRadius: 7,
              background: AMBER,
              width: `${underline * 100}%`,
              boxShadow: `0 0 24px ${AMBER}99`,
            }}
          />
        </div>

        <div
          style={{
            marginTop: 8,
            opacity: epike.opacity,
            transform: `translateY(${epike.rise}px)`,
            filter: `blur(${epike.blur}px)`,
            fontFamily: SCRIPT_FONT,
            fontWeight: 700,
            fontSize: 150,
            lineHeight: 1,
            color: AMBER,
            textShadow: TEXT_SHADOW,
          }}
        >
          “epike”
        </div>
        <div
          style={{
            marginTop: 6,
            opacity: per.opacity,
            transform: `translateY(${per.rise}px)`,
            filter: `blur(${per.blur}px)`,
            fontFamily: BLOCK_FONT,
            fontWeight: 700,
            fontSize: 72,
            lineHeight: 1,
            color: "#fff",
            letterSpacing: "-0.01em",
            textShadow: TEXT_SHADOW,
          }}
        >
          për promptet
        </div>
      </div>
    </AbsoluteFill>
  );
};
