import {
  AbsoluteFill,
  Easing,
  interpolate,
  Video,
  staticFile,
  useCurrentFrame,
} from "remotion";

/**
 * TOOL ZOOM — the AI tool screen recording (688×1492 panel) turned into a
 * 9:16 camera move, with no overlays: open on the uploaded photo, glide to
 * the Seedance 2.5 model row, pull back as the prompt pastes in (frame 33),
 * glide to Generate and punch in on the click (frame 50), then pull out to
 * the whole panel while the preview images cycle.
 *
 * Source is pre-upscaled 2× (tool2x.mp4); coordinates below are in the
 * original 688×1492 panel space.
 */

const SW = 688;
const SH = 1492;
const OW = 1080;
const OH = 1920;
const BASE = OW / SW; // fill the width at zoom 1
const OVERSCROLL = 320; // past the panel edge onto matching background
const PANEL_BG = "#0f1112"; // sampled from the recording's edges

// [frame, cx, cy, zoom] — zoom multiplies BASE. Positions measured on the
// recording: photo (352,660), model row (text from x≈75, y 1196),
// pasted prompt (y 800–1220), Generate button (352,1372).
const KEYS: [number, number, number, number][] = [
  [0, 352, 660, 1.75], // photo just landed in References
  [12, 352, 670, 1.6], // settle
  [26, 300, 1196, 1.35], // glide to the Seedance 2.5 model row
  [32, 300, 1196, 1.4], // hold on it
  [40, 344, 1010, 1.0], // prompt pastes (f33): pull back so full lines read
  [48, 352, 1340, 1.12], // glide down to Generate
  [51, 352, 1372, 1.38], // punch in on the click (f50)
  [58, 352, 1372, 1.32], // hold the pressed button
  [99, 344, 760, 1.0], // slow pull out to the whole panel
];
const ease = Easing.bezier(0.45, 0, 0.2, 1);

const camAt = (f: number): [number, number, number] => {
  const i = Math.max(0, KEYS.findIndex((k, j) => f >= k[0] && f < (KEYS[j + 1]?.[0] ?? Infinity)));
  const a = KEYS[i];
  const b = KEYS[i + 1] ?? a;
  const t = b === a ? 0 : interpolate(f, [a[0], b[0]], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  return [a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, a[3] + (b[3] - a[3]) * t];
};

// Keep the view inside the panel.
const clampCam = (cx: number, cy: number, z: number): [number, number, number] => {
  const s = BASE * z;
  const w = OW / s;
  const h = OH / s;
  return [
    w >= SW ? SW / 2 : Math.min(Math.max(cx, w / 2), SW - w / 2),
    Math.min(Math.max(cy, h / 2 - OVERSCROLL), SH - h / 2 + OVERSCROLL),
    z,
  ];
};

export const ToolZoom: React.FC = () => {
  const frame = useCurrentFrame();
  const [cx, cy, z] = clampCam(...camAt(frame));
  const [px, py, pz] = clampCam(...camAt(frame - 1));
  const s = BASE * z;

  // Light motion blur that follows the camera's speed on screen.
  const speed = Math.hypot((cx - px) * s, (cy - py) * s) + Math.abs(z - pz) * 900;
  const blur = Math.min(6, speed * 0.05);

  return (
    <AbsoluteFill style={{ backgroundColor: PANEL_BG, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: SW,
          height: SH,
          transformOrigin: "0 0",
          transform: `translate(${OW / 2 - cx * s}px, ${OH / 2 - cy * s}px) scale(${s})`,
          filter: blur > 0.4 ? `blur(${blur / s}px)` : undefined,
        }}
      >
        <Video src={staticFile("rec/tool2x.mp4")} muted style={{ width: SW, height: SH }} />
      </div>
    </AbsoluteFill>
  );
};
