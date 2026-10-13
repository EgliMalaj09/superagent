import {
  AbsoluteFill,
  Easing,
  Freeze,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";

/**
 * MEME EDIT — 2K (1440×2560) cut of a meme compilation. The source is
 * pre-graded per clip and upscaled in ffmpeg; here every cut becomes a
 * whip pan (alternating direction), each clip gets a slow cinematic push-in,
 * and the facepalm ending lands with a crash zoom, flash, shake and vignette.
 *
 * Transitions are given as the last clean outgoing frame and the first clean
 * incoming frame, so the source's own blurry/messy transition frames in
 * between are never shown.
 */

const SRC = "rec/meme2k.mp4";
const W = 1440;
const H = 2560;

type Cut = { out: number; in: number };
const CUTS: Cut[] = [
  { out: 43, in: 44 }, // selfie → desk
  { out: 116, in: 128 }, // desk → reporter (replaces a soft blur)
  { out: 199, in: 206 }, // reporter → old woman
  { out: 279, in: 285 }, // old woman → excavator
  { out: 349, in: 350 }, // excavator → tank top
  { out: 454, in: 474 }, // tank top → table (replaces a shaky pan)
  { out: 494, in: 502 }, // table → facepalm guy (skips the camera swing onto him)
];
const PUNCH = 507; // the hand hits the forehead: crash zoom

const whipEase = Easing.bezier(0.7, 0, 0.3, 1);
const outEase = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Whip window per cut: centred on the gap, 10–14 frames long.
const windows = CUTS.map((c) => {
  const mid = Math.round((c.out + c.in + 1) / 2);
  const len = Math.min(14, Math.max(10, c.in - c.out + 4));
  return { ...c, a: mid - Math.floor(len / 2), b: mid + Math.ceil(len / 2) };
});

// Clip spans (for the slow push-in), from one incoming frame to the next outgoing.
const starts = [0, ...CUTS.map((c) => c.in), PUNCH];
const ends = [...CUTS.map((c) => c.out), PUNCH - 1, 557];

const Video: React.FC<{ at?: number }> = ({ at }) => {
  const v = <OffthreadVideo src={staticFile(SRC)} muted style={{ width: W, height: H }} />;
  return at === undefined ? v : <Freeze frame={at}>{v}</Freeze>;
};

export const MemeEdit: React.FC = () => {
  const frame = useCurrentFrame();

  // Slow push-in: 1.00 → 1.045 across each clip.
  const ci = Math.max(0, starts.findIndex((s, i) => frame >= s && frame <= (ends[i] ?? 557)));
  let scale = interpolate(frame, [starts[ci], ends[ci]], [1.0, 1.045], clamp);

  // Facepalm: crash zoom from 1.45 → 1.1, then keep pushing slowly to 1.18.
  let shakeX = 0;
  let shakeY = 0;
  let flash = 0;
  let vignette = 0.35;
  if (frame >= PUNCH) {
    const k = interpolate(frame, [PUNCH, PUNCH + 9], [0, 1], { ...clamp, easing: outEase });
    scale = 1.45 - 0.35 * k + interpolate(frame, [PUNCH + 9, 557], [0, 0.08], clamp);
    const shake = interpolate(frame, [PUNCH, PUNCH + 10], [1, 0], clamp);
    shakeX = Math.sin(frame * 2.3) * 18 * shake;
    shakeY = Math.cos(frame * 3.1) * 14 * shake;
    flash = interpolate(frame, [PUNCH, PUNCH + 4], [0.7, 0], clamp);
    vignette = interpolate(frame, [PUNCH, PUNCH + 20], [0.35, 0.7], clamp);
  }

  const win = windows.find((w) => frame >= w.a && frame < w.b);
  let content: React.ReactNode;
  let blur = 0;

  if (win) {
    const dir = windows.indexOf(win) % 2 === 0 ? 1 : -1; // alternate left / right
    const pAt = (f: number) => interpolate(f, [win.a, win.b], [0, 1], { ...clamp, easing: whipEase });
    const p = pAt(frame);
    const speed = Math.abs(pAt(frame + 0.5) - pAt(frame - 0.5)) * W;
    blur = Math.min(80, speed * 0.28);
    const outLayer = frame <= win.out ? <Video /> : <Video at={win.out} />;
    const inLayer = frame >= win.in ? <Video /> : <Video at={win.in} />;
    content = (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: dir === 1 ? 0 : -W,
          width: W * 2,
          height: H,
          transform: `translateX(${-dir * p * W}px)`,
          filter: blur > 0.5 ? "url(#memewhip)" : undefined,
        }}
      >
        <div style={{ position: "absolute", top: 0, left: dir === 1 ? 0 : W, width: W, height: H, overflow: "hidden" }}>
          {outLayer}
        </div>
        <div style={{ position: "absolute", top: 0, left: dir === 1 ? W : 0, width: W, height: H, overflow: "hidden" }}>
          {inLayer}
        </div>
      </div>
    );
  } else {
    // Between whips, hide any leftover messy source frames behind holds.
    const gap = windows.find((w) => frame > w.out && frame < w.in);
    const hold = gap ? (frame < gap.a ? gap.out : gap.in) : undefined;
    content = <Video at={hold} />;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="memewhip" x="-5%" y="0" width="110%" height="100%">
          <feGaussianBlur stdDeviation={`${blur} 0`} />
        </filter>
      </svg>
      <AbsoluteFill
        style={{
          transform: `translate(${shakeX}px, ${shakeY}px) scale(${scale})`,
          transformOrigin: frame >= PUNCH ? "50% 38%" : "50% 50%",
        }}
      >
        {content}
      </AbsoluteFill>
      {/* cinematic vignette; deepens on the facepalm */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 70% at 50% 45%, rgba(0,0,0,0) 50%, rgba(0,0,0,${vignette}) 100%)`,
        }}
      />
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};
