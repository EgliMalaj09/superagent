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
 * DRAGO WHIP — three camera-screen shots (headphones → mouse → dragon)
 * joined with whip-pan transitions instead of hard cuts. Inside a short
 * window around each cut the outgoing and incoming shots travel as one
 * strip (outgoing on the left, incoming on the right) with a horizontal
 * motion blur that follows the speed. Runtime is unchanged: the outgoing
 * shot holds its last frame / the incoming shot holds its first frame for
 * the few frames either side of the cut.
 */

const W = 1080;

export type WhipProps = {
  src: string;
  /** first frame of each incoming shot */
  cuts: number[];
  /** optional: frame the outgoing shot holds on (skips black/flash frames before a cut) */
  holdOut?: Record<number, number>;
  /** show frame 1 in place of a black frame 0 */
  fixFirst?: boolean;
};
const HALF = 5; // frames each side of the cut
const ease = Easing.bezier(0.7, 0, 0.3, 1); // slow-fast-slow: a real whip

const progressAt = (f: number, cut: number) =>
  interpolate(f, [cut - HALF, cut + HALF], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

export const DragoWhip: React.FC<WhipProps> = ({ src, cuts, holdOut = {}, fixFirst = false }) => {
  const SRC = src;
  const CUTS = cuts;
  const frame = useCurrentFrame();
  const cut = CUTS.find((c) => frame >= c - HALF && frame < c + HALF);

  if (fixFirst && frame === 0) {
    return (
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        <Freeze frame={1}>
          <OffthreadVideo src={staticFile(SRC)} muted />
        </Freeze>
      </AbsoluteFill>
    );
  }

  if (cut === undefined) {
    return (
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        <OffthreadVideo src={staticFile(SRC)} muted />
      </AbsoluteFill>
    );
  }

  const p = progressAt(frame, cut);
  const x = -p * W;
  const speed = Math.abs(progressAt(frame + 0.5, cut) - progressAt(frame - 0.5, cut)) * W;
  const blur = Math.min(60, speed * 0.28);
  const live = <OffthreadVideo src={staticFile(SRC)} muted style={{ width: W, height: 1920 }} />;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="whipblur" x="-5%" y="0" width="110%" height="100%">
          <feGaussianBlur stdDeviation={`${blur} 0`} />
        </filter>
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: W * 2,
          height: 1920,
          transform: `translateX(${x}px)`,
          filter: blur > 0.5 ? "url(#whipblur)" : undefined,
        }}
      >
        {/* outgoing shot: live until the cut (or its hold frame), then holds */}
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 1920, overflow: "hidden" }}>
          {frame <= (holdOut[cut] ?? cut - 1) ? live : <Freeze frame={holdOut[cut] ?? cut - 1}>{live}</Freeze>}
        </div>
        {/* incoming shot: holds its first frame until the cut, then live */}
        <div style={{ position: "absolute", left: W, top: 0, width: W, height: 1920, overflow: "hidden" }}>
          {frame >= cut ? live : <Freeze frame={cut}>{live}</Freeze>}
        </div>
      </div>
    </AbsoluteFill>
  );
};
