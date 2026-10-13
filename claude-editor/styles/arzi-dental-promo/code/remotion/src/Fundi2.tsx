import { AbsoluteFill, Easing, Freeze, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { RouteMap, type RouteDest } from "./RouteMap";

/**
 * FUNDI v2 — route map until just after "Firenze", then the Seedance
 * consultation clip (faceless, coat text blurred), then logo only.
 *   0–125    Tirana → Firenze map
 *   118–131  light-leak dissolve map → clip
 *   126–307  Seedance clip (internal cut at local f90 → defocus dissolve)
 *   300–315  fade to black; logo fades in on black until the end
 */

const CLIP_AT = 126;
const CLIP_LEN = 182;
const INNER_CUT = 90; // local frame of the chair → desk cut
const LOGO_AT = 304;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.65, 0, 0.35, 1);

const Clip: React.FC = () => {
  const f = useCurrentFrame(); // local
  const half = 6;
  if (f < INNER_CUT - half || f >= INNER_CUT + half) {
    return <OffthreadVideo src={staticFile("rec/sd_clip.mp4")} muted />;
  }
  const p = interpolate(f, [INNER_CUT - half, INNER_CUT + half - 1], [0, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ filter: `blur(${18 * p}px)`, opacity: 1 - p, transform: `scale(${1 + 0.04 * p})` }}>
        <Freeze frame={Math.min(f, INNER_CUT - 1)}>
          <OffthreadVideo src={staticFile("rec/sd_clip.mp4")} muted />
        </Freeze>
      </AbsoluteFill>
      <AbsoluteFill style={{ filter: `blur(${18 * (1 - p)}px)`, opacity: p, transform: `scale(${1.04 - 0.04 * p})` }}>
        <Freeze frame={Math.max(f, INNER_CUT)}>
          <OffthreadVideo src={staticFile("rec/sd_clip.mp4")} muted />
        </Freeze>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Fundi2: React.FC<{ dest?: RouteDest }> = ({ dest = "firenze" }) => {
  const f = useCurrentFrame();
  const inP = interpolate(f, [CLIP_AT - 8, CLIP_AT + 5], [0, 1], { ...clamp, easing: ease });
  const leak = 0.6 * Math.sin(Math.PI * inP);
  const push = interpolate(f, [CLIP_AT, CLIP_AT + CLIP_LEN], [1.0, 1.04], clamp);
  const toBlack = interpolate(f, [LOGO_AT - 6, LOGO_AT + 2], [0, 1], clamp);
  const logo = interpolate(f, [LOGO_AT + 2, LOGO_AT + 20], [0, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence durationInFrames={CLIP_AT + 6}>
        <RouteMap dest={dest} />
      </Sequence>
      <Sequence from={CLIP_AT - 8} durationInFrames={CLIP_LEN + 8}>
        <AbsoluteFill style={{ opacity: inP, transform: `scale(${push})` }}>
          <Sequence from={8}>
            <Clip />
          </Sequence>
          <Sequence durationInFrames={8}>
            <Freeze frame={0}>
              <OffthreadVideo src={staticFile("rec/sd_clip.mp4")} muted />
            </Freeze>
          </Sequence>
        </AbsoluteFill>
      </Sequence>
      <AbsoluteFill
        style={{
          opacity: leak,
          background: "radial-gradient(ellipse 90% 70% at 30% 30%, #fff3dc 0%, rgba(255,214,160,0.7) 40%, rgba(255,190,130,0) 80%)",
          mixBlendMode: "screen",
        }}
      />
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: toBlack }} />
      {f >= LOGO_AT && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <Img
            src={staticFile("rec/dma_logo.png")}
            style={{ width: 820, opacity: logo, transform: `scale(${0.96 + 0.04 * logo})`, mixBlendMode: "screen" }}
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
