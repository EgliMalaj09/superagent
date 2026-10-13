import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import { RouteMap } from "./RouteMap";
import { EndCard } from "./Creative2";

/**
 * FUNDI — closing section: Tirana → Firenze route map synced to the voiceover,
 * then the CTA end card on "Raccontaci il tuo caso…" (7.5 s).
 */
const CTA = 225;

export const Fundi: React.FC = () => {
  const f = useCurrentFrame();
  const mapFade = interpolate(f, [CTA - 2, CTA + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence durationInFrames={CTA + 12}>
        <AbsoluteFill style={{ opacity: mapFade }}>
          <RouteMap />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={CTA}>
        <AbsoluteFill style={{ opacity: interpolate(f, [CTA, CTA + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <EndCard />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
