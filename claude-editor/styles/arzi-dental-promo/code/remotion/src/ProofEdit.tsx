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
 * PROOF — 11.8s b-roll for Creative 01 (no captions, no sound), same
 * vibe as the trigger: slow push on every shot, light flashes and
 * push-ins at the cuts, one whip pan.
 *   0–59    reception hall           → zoom-through into
 *   60–119  "Surgery 01" glass door  → window-light flash into
 *   120–173 treatment room / chair   → push-in into
 *   174–227 dentist at the chair     → whip pan into
 *   228–281 technician, autoclave    → window-light flash into
 *   282–352 team over the X-ray plan
 */

const SRC = "rec/proof.mp4";
const W = 1080;
const H = 1920;
const CUTS = [60, 120, 174, 228, 282];
const END = 353;
type T = "zoom" | "flash" | "push" | "whip";
const TYPES: T[] = ["zoom", "flash", "push", "whip", "flash"];
// where each shot's slow push (and outgoing zoom) aims, in % of the frame
const ORIGINS = ["50% 55%", "45% 60%", "55% 45%", "45% 45%", "60% 50%", "50% 35%"];
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeIn = Easing.in(Easing.cubic);
const easeOut = Easing.out(Easing.cubic);
const whipEase = Easing.bezier(0.7, 0, 0.3, 1);

const Src: React.FC<{ at?: number }> = ({ at }) => {
  const v = <OffthreadVideo src={staticFile(SRC)} muted style={{ width: W, height: H }} />;
  return at === undefined ? v : <Freeze frame={at}>{v}</Freeze>;
};

export const ProofEdit: React.FC = () => {
  const f = useCurrentFrame();
  const starts = [0, ...CUTS];
  const shot = starts.filter((s) => f >= s).length - 1;
  const start = starts[shot];
  const end = CUTS[shot] ?? END;

  // slow push on every shot
  let scale = interpolate(f, [start, end], [1.0, 1.05], clamp);
  let blur = 0;

  // incoming settle from the previous cut
  const inType = shot > 0 ? TYPES[shot - 1] : undefined;
  if (inType && inType !== "whip") {
    const settle = interpolate(f, [start, start + 8], [1, 0], { ...clamp, easing: easeOut });
    scale += (inType === "flash" ? 0.1 : 0.14) * settle;
    blur += settle * 5;
  }
  // outgoing rush into the next cut
  const outType = TYPES[shot];
  if (outType && outType !== "whip") {
    const rush = interpolate(f, [end - 4, end], [0, 1], { ...clamp, easing: easeIn });
    scale *= 1 + (outType === "zoom" ? 0.3 : outType === "push" ? 0.22 : 0.16) * rush;
    blur += rush * (outType === "zoom" ? 9 : 6);
  }

  // whip pan: outgoing and incoming travel as one strip
  const whipCut = CUTS.find((c, i) => TYPES[i] === "whip" && f >= c - 5 && f < c + 5);
  let content: React.ReactNode = <Src />;
  let whipBlur = 0;
  if (whipCut !== undefined) {
    const pAt = (x: number) => interpolate(x, [whipCut - 5, whipCut + 5], [0, 1], { ...clamp, easing: whipEase });
    const p = pAt(f);
    whipBlur = Math.min(70, Math.abs(pAt(f + 0.5) - pAt(f - 0.5)) * W * 0.28);
    content = (
      <div style={{ position: "absolute", top: 0, left: 0, width: W * 2, height: H, transform: `translateX(${-p * W}px)`, filter: whipBlur > 0.5 ? "url(#proofwhip)" : undefined }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: W, height: H, overflow: "hidden" }}>
          {f < whipCut ? <Src /> : <Src at={whipCut - 1} />}
        </div>
        <div style={{ position: "absolute", top: 0, left: W, width: W, height: H, overflow: "hidden" }}>
          {f >= whipCut ? <Src /> : <Src at={whipCut} />}
        </div>
      </div>
    );
    scale = 1;
    blur = 0;
  }

  // flashes
  let flash = 0;
  CUTS.forEach((c, i) => {
    if (TYPES[i] === "flash") flash = Math.max(flash, interpolate(f, [c - 3, c, c + 6], [0, 0.75, 0], clamp));
    if (TYPES[i] === "zoom" || TYPES[i] === "push") flash = Math.max(flash, interpolate(f, [c - 2, c, c + 4], [0, 0.22, 0], clamp));
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="proofwhip" x="-5%" y="0" width="110%" height="100%">
          <feGaussianBlur stdDeviation={`${whipBlur} 0`} />
        </filter>
      </svg>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: ORIGINS[shot], filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>
        {content}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: flash,
          background: "radial-gradient(ellipse 90% 70% at 50% 30%, #fffaf0 0%, rgba(255,246,228,0.85) 45%, rgba(255,240,220,0.4) 100%)",
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};
