import { AbsoluteFill, Easing, Freeze, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";

/**
 * FULL FIX — the finished 52.3s reel with two repairs:
 *  1. girl smiling → map (f1201): was a hard cut into a dark frame; now the
 *     smile pushes in and dissolves with a warm light leak into the map.
 *  2. desk scene (f1411–1507) replaced with the real reception moment
 *     (receptionist explaining to a patient with his suitcase), blended in
 *     from the chair shot and faded to black before the logo.
 */

const SRC = "rec/fullsrc.mp4";
const J = 1201;
const D0 = 1411;
const D1 = 1507;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.65, 0, 0.35, 1);

const Src: React.FC<{ at?: number }> = ({ at }) => {
  const v = <OffthreadVideo src={staticFile(SRC)} muted style={{ width: 1080, height: 1920 }} />;
  return at === undefined ? v : <Freeze frame={at}>{v}</Freeze>;
};

const Leak: React.FC<{ o: number }> = ({ o }) => (
  <AbsoluteFill
    style={{
      opacity: o,
      background: "radial-gradient(ellipse 90% 70% at 60% 30%, #fff3dc 0%, rgba(255,214,160,0.7) 40%, rgba(255,190,130,0) 80%)",
      mixBlendMode: "screen",
    }}
  />
);

export const FullFix: React.FC = () => {
  const f = useCurrentFrame();

  // 1. girl → map
  if (f >= J - 6 && f < J + 14) {
    const p = interpolate(f, [J - 6, J + 13], [0, 1], { ...clamp, easing: ease });
    return (
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        <AbsoluteFill>{f >= J ? <Src /> : <Src at={J + 10} />}</AbsoluteFill>
        <AbsoluteFill style={{ opacity: 1 - p, transform: `scale(${1 + 0.12 * p})`, filter: `blur(${8 * p}px)` }}>
          <Src at={Math.min(f, J - 1)} />
        </AbsoluteFill>
        <Leak o={0.7 * Math.sin(Math.PI * p)} />
      </AbsoluteFill>
    );
  }

  // 2. reception replaces the desk scene
  if (f >= D0 && f < D1) {
    const p = interpolate(f, [D0, D0 + 12], [0, 1], { ...clamp, easing: ease });
    const push = interpolate(f, [D0, D1], [1.0, 1.05], clamp);
    const black = interpolate(f, [D1 - 8, D1], [0, 1], clamp);
    return (
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        <AbsoluteFill style={{ opacity: 1 - p, filter: `blur(${16 * p}px)`, transform: `scale(${1 + 0.04 * p})` }}>
          <Src at={D0 - 1} />
        </AbsoluteFill>
        <AbsoluteFill style={{ opacity: p, filter: `blur(${16 * (1 - p)}px)`, transform: `scale(${push})`, transformOrigin: "50% 45%" }}>
          <Sequence from={D0}>
            <OffthreadVideo src={staticFile("rec/recdesk.mp4")} muted />
          </Sequence>
        </AbsoluteFill>
        <AbsoluteFill style={{ backgroundColor: "#000", opacity: black }} />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Src />
    </AbsoluteFill>
  );
};
