import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ColorGrade, GRADE_FILTER } from "./templates/ColorGrade";

/**
 * X-RAY REVEAL — the camera holds on the prompt card, glides right to the
 * dragon, and while it travels a scan line sweeps the dragon from the real
 * photo into its X-ray version. Both dragon frames are pixel-aligned, so
 * the wipe reads as a transformation, not a cut.
 */

const GAP = 60; // black gutter between the two panels (px)


const panEase = Easing.bezier(0.65, 0, 0.35, 1);
const scanEase = Easing.bezier(0.45, 0, 0.25, 1);

export type RevealProps = {
  /** public/ path of the transformed dragon (must be pixel-aligned with the real one) */
  after?: string;
  /** scan-line colour — pick one from the transformed image's palette */
  accent?: string;
  /** public/ path of the prompt card */
  card?: string;
  /** Timeline (seconds): camera starts moving, camera lands on the dragon,
   *  scan begins (mid-pan), scan finishes (just after landing), clip end. */
  holdEnd?: number;
  panEnd?: number;
  scanStart?: number;
  scanEnd?: number;
  endSec?: number;
};

export const XrayReveal: React.FC<RevealProps> = ({
  after = "xray/dragon_xray_1080.png",
  accent: ACCENT = "#FFB547",
  card = "xray/prompt_1080.png",
  holdEnd: HOLD_END = 1.8,
  panEnd: PAN_END = 3.6,
  scanStart: SCAN_START = 2.6,
  scanEnd: SCAN_END = 4.0,
  endSec = 7,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const panDist = width + GAP;

  const panAt = (sec: number) =>
    interpolate(sec, [HOLD_END, PAN_END], [0, 1], {
      easing: panEase,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const pan = panAt(t);
  const tx = -pan * panDist;

  // Directional motion blur, driven by the camera's current speed.
  const pxPerFrame = Math.abs(panAt(t + 0.5 / fps) - panAt(t - 0.5 / fps)) * panDist;
  const blur = Math.min(18, Math.max(0, pxPerFrame - 8) * 0.35);

  // Camera scale: slow push on the prompt, eases back during the pan,
  // then a slow push on the finished X-ray.
  const scale =
    t < HOLD_END
      ? interpolate(t, [0, HOLD_END], [1.0, 1.035])
      : t < PAN_END
        ? interpolate(t, [HOLD_END, PAN_END], [1.035, 1.0], { easing: panEase })
        : interpolate(t, [PAN_END, endSec], [1.0, 1.06], { extrapolateRight: "clamp" });

  // Scan position across the dragon panel, 0..1.
  const scan = interpolate(t, [SCAN_START, SCAN_END], [0, 1], {
    easing: scanEase,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scanX = interpolate(scan, [0, 1], [-0.04, 1.04]) * width;
  const lineOpacity = interpolate(
    t,
    [SCAN_START, SCAN_START + 0.15, SCAN_END - 0.2, SCAN_END],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const feather = 70;
  const xrayMask = `linear-gradient(to right, #000 ${scanX - feather}px, transparent ${scanX + feather}px)`;

  // A soft bloom over the X-ray right after the scan completes.
  const bloom = interpolate(t, [SCAN_END - 0.1, SCAN_END + 0.15, SCAN_END + 0.7], [0, 0.18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scale around the centre of the current view, not the world strip.
  const originX = pan * panDist + width / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", filter: GRADE_FILTER }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="hblur" x="-5%" y="0" width="110%" height="100%">
          <feGaussianBlur stdDeviation={`${blur} 0`} />
        </filter>
      </svg>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: panDist + width,
          height,
          transform: `translateX(${tx}px) scale(${scale})`,
          transformOrigin: `${originX}px ${height / 2}px`,
          filter: blur > 0.5 ? "url(#hblur)" : undefined,
        }}
      >
        {/* Panel 1 — the prompt card */}
        <Img
          src={staticFile(card)}
          style={{ position: "absolute", left: 0, top: 0, width, height }}
        />

        {/* Panel 2 — the dragon, real → X-ray */}
        <div style={{ position: "absolute", left: panDist, top: 0, width, height, overflow: "hidden" }}>
          <Img src={staticFile("xray/dragon_real_1080.png")} style={{ position: "absolute", inset: 0, width, height }} />
          <Img
            src={staticFile(after)}
            style={{
              position: "absolute",
              inset: 0,
              width,
              height,
              WebkitMaskImage: xrayMask,
              maskImage: xrayMask,
            }}
          />
          {/* Scan line: a thin hot core plus a wide soft glow */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: scanX - 90,
              width: 180,
              opacity: lineOpacity * 0.55,
              background: `linear-gradient(to right, transparent, ${ACCENT}55 45%, ${ACCENT}88 50%, ${ACCENT}55 55%, transparent)`,
              mixBlendMode: "screen",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: scanX - 2,
              width: 4,
              opacity: lineOpacity,
              background: "linear-gradient(to bottom, transparent 0%, #fff 18%, #fff 82%, transparent 100%)",
              boxShadow: `0 0 18px 4px ${ACCENT}, 0 0 60px 10px ${ACCENT}66`,
            }}
          />
          <AbsoluteFill style={{ backgroundColor: "#fff", opacity: bloom, mixBlendMode: "soft-light" }} />
        </div>
      </div>

      <ColorGrade />
    </AbsoluteFill>
  );
};
