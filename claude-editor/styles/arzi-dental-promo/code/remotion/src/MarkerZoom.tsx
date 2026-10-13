import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ColorGrade, GRADE_FILTER } from "./templates/ColorGrade";

/**
 * MARKER ZOOM — a landscape CapCut screen recording turned into a 9:16
 * shot. Opens wide on the whole editor, then the camera zooms in and
 * follows the playhead (the mouse drags it), punching in each time a
 * marker is dropped with an animated "M" keycap and a ring on the pin.
 *
 * Camera track (content coords of the recording) is precomputed from the
 * footage by build/rec(2)/camera.py → markerCam.json / adjustCam.json. `events` are the key
 * moments (a marker drop, a clip trim) that get a punch-in and a ring;
 * with `keycap` set, each event also shows that key being pressed.
 */

export type ZoomCam = {
  contentW: number;
  contentH: number;
  video: string;
  events: number[];
  eventX: number[];
  eventY: number;
  cam: number[][];
};

export type ScreenZoomProps = {
  cam: ZoomCam;
  titleBlock: string;
  titleScript: string;
  keycap?: string;
};
const AMBER = "#FFB547";
const BLOCK_FONT = "'Space Grotesk', system-ui, sans-serif";
const SCRIPT_FONT = "'Caveat', 'Bradley Hand', cursive";
const TEXT_SHADOW = "0 6px 36px rgba(0,0,0,0.92), 0 2px 12px rgba(0,0,0,0.80), 0 0 4px rgba(0,0,0,0.60)";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Title: React.FC<{ t: number; block: string; script: string }> = ({ t, block, script }) => {
  const p = interpolate(t, [0.15, 0.45], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top: 170,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: p,
        transform: `translateY(${(1 - p) * 24}px) scale(${0.94 + 0.06 * p})`,
        filter: `blur(${(1 - p) * 8}px)`,
        lineHeight: 1.0,
      }}
    >
      <div style={{ fontFamily: BLOCK_FONT, fontWeight: 700, fontSize: 118, color: "#fff", letterSpacing: "-0.025em", textShadow: TEXT_SHADOW }}>
        {block}
      </div>
      <div style={{ fontFamily: SCRIPT_FONT, fontWeight: 700, fontSize: 124, color: AMBER, textShadow: TEXT_SHADOW, marginTop: -6 }}>
        {script}
      </div>
    </div>
  );
};

/** Keycap state for time t: visibility and how far it is pressed down. */
const keyState = (t: number, presses: number[]) => {
  let vis = 0;
  let down = 0;
  for (const p of presses) {
    vis = Math.max(vis, interpolate(t, [p - 0.3, p - 0.15, p + 0.5, p + 0.7], [0, 1, 1, 0], clamp));
    down = Math.max(down, interpolate(t, [p - 0.04, p, p + 0.1, p + 0.2], [0, 1, 1, 0], clamp));
  }
  return { vis, down };
};

const Keycap: React.FC<{ t: number; presses: number[]; label: string }> = ({ t, presses, label }) => {
  const { vis, down } = keyState(t, presses);
  if (vis < 0.001) return null;
  const size = 200;
  const depth = 16;
  return (
    <div
      style={{
        position: "absolute",
        left: 540 - size / 2,
        top: 1560,
        width: size,
        height: size + depth,
        opacity: vis,
        transform: `scale(${0.85 + 0.15 * vis})`,
      }}
    >
      {/* key base (the side of the cap) */}
      <div style={{ position: "absolute", left: 0, top: depth, width: size, height: size, borderRadius: 38, background: "#07080b", boxShadow: `0 24px 60px rgba(0,0,0,0.7), 0 0 ${40 * down}px ${8 * down}px ${AMBER}88` }} />
      {/* key top */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: depth * down,
          width: size,
          height: size,
          borderRadius: 38,
          background: "linear-gradient(160deg, #2a2e37 0%, #16181e 100%)",
          border: `2px solid ${down > 0.05 ? AMBER : "rgba(255,255,255,0.14)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: BLOCK_FONT,
          fontWeight: 700,
          fontSize: 112,
          color: down > 0.05 ? AMBER : "#fff",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const ScreenZoom: React.FC<ScreenZoomProps> = ({ cam, titleBlock, titleScript, keycap }) => {
  const CONTENT_W = cam.contentW;
  const CONTENT_H = cam.contentH;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const [cx, cy, s] = cam.cam[Math.min(frame, cam.cam.length - 1)];

  // Wide shot reads as a floating window; the corners square off as we zoom.
  const zoomT = interpolate(s, [cam.cam[0][2], 1920 / CONTENT_H], [0, 1], clamp);
  const radius = 28 * (1 - zoomT);

  const toScreen = (x: number, y: number) => [540 + (x - cx) * s, 960 + (y - cy) * s];

  return (
    <AbsoluteFill style={{ backgroundColor: "#07080b", filter: GRADE_FILTER }}>
      {/* backdrop for the wide shot: warm glow on near-black */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 45% at 50% 50%, ${AMBER}22 0%, transparent 70%)` }} />

      {/* the recording, driven by the camera track */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: CONTENT_W,
          height: CONTENT_H,
          transformOrigin: "0 0",
          transform: `translate(${540 - cx * s}px, ${960 - cy * s}px) scale(${s})`,
          borderRadius: radius / s,
          overflow: "hidden",
          boxShadow: `0 ${30 / s}px ${80 / s}px rgba(0,0,0,${0.6 * (1 - zoomT)})`,
        }}
      >
        <OffthreadVideo src={staticFile(cam.video)} muted style={{ width: CONTENT_W, height: CONTENT_H }} />
      </div>

      {/* ring pulse on each new marker pin */}
      {cam.events.map((p, i) => {
        const k = interpolate(t, [p, p + 0.6], [0, 1], clamp);
        if (k <= 0 || k >= 1) return null;
        const [x, y] = toScreen(cam.eventX[i], cam.eventY);
        const r = 14 + 80 * k;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - r,
              top: y - r,
              width: r * 2,
              height: r * 2,
              borderRadius: "50%",
              border: `5px solid ${AMBER}`,
              opacity: 1 - k,
              boxShadow: `0 0 24px ${AMBER}`,
            }}
          />
        );
      })}

      {/* top & bottom shade so the title and keycap always read over busy UI */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.72) 100%)",
          opacity: zoomT,
        }}
      />

      <Title t={t} block={titleBlock} script={titleScript} />
      {keycap && <Keycap t={t} presses={cam.events} label={keycap} />}
      <ColorGrade />
    </AbsoluteFill>
  );
};
