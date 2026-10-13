import { AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ProofEditV2 } from "./ProofEditV2";

/**
 * CREATIVE 02 — Pain to Transformation, rough cut with black slots for the
 * AI shots (to be dropped in by the user). Real shots blend into each other;
 * cuts into and out of the black AI slots stay hard so replacements line up.
 * End card: "Richiedi una prima valutazione" + clinic logo (from the clinic's
 * own reel).
 */

const SANS = "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const END_AT = 1605;

export const EndCard: React.FC = () => {
  const f = useCurrentFrame(); // local to the Sequence
  const logo = interpolate(f, [0, 18], [0, 1], clamp);
  const line = interpolate(f, [12, 30], [0, 1], clamp);
  const arrow = interpolate(f, [30, 44], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", alignItems: "center", justifyContent: "center" }}>
      <Img
        src={staticFile("rec/dma_logo.png")}
        style={{ width: 760, opacity: logo, transform: `scale(${0.96 + 0.04 * logo})`, mixBlendMode: "screen", marginTop: -260 }}
      />
      <div
        style={{
          marginTop: 70,
          opacity: line,
          transform: `translateY(${(1 - line) * 24}px)`,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 74,
          lineHeight: 1.15,
          color: "#fff",
          textAlign: "center",
        }}
      >
        Richiedi una
        <br />
        prima valutazione
      </div>
      <div style={{ marginTop: 60, opacity: arrow, transform: `translateY(${(1 - arrow) * -16 + Math.sin(f / 6) * 8 * arrow}px)`, fontSize: 90 }}>
        👇
      </div>
    </AbsoluteFill>
  );
};

export const Creative2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <ProofEditV2
      src="rec/c2.mp4"
      cuts={[990, 1095, 1185, 1254, 1524]}
      end={1725}
      types={["leak", "defocus", "zoomblend", "defocus", "leak"]}
      origins={["50% 45%", "50% 45%", "50% 45%", "50% 45%", "50% 45%", "50% 45%"]}
    />
    <Sequence from={END_AT}>
      <EndCard />
    </Sequence>
  </AbsoluteFill>
);
