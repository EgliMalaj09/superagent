import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { cue, sceneLength } from "../timing";
import { Photo } from "../effects/Photo";
import { Bar } from "../effects/Type";
import { Sfx } from "../effects/Sfx";

/** Scene 1b — "Trembëdhjetë vite më vonë": warm half first, then the red half rips in. */
export const Scene1bSplitFace: React.FC = () => {
  const frame = useCurrentFrame();
  const len = sceneLength("split");
  const redAt = cue("split", 12.0);

  const reveal = interpolate(frame, [redAt, redAt + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.poly(5)),
  });
  const zoom = interpolate(frame, [0, len], [1.05, 1.16]);
  const glitch = frame >= redAt && frame < redAt + 5;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sfx name="boom" at={redAt} volume={0.8} />
      <Sfx name="whoosh" at={len - 12} volume={0.5} />

      <div style={{ position: "absolute", inset: 0, clipPath: "inset(0 50% 0 0)" }}>
        <Photo src="characters/rama-split.jpg" zoom={zoom} origin="50% 35%" />
      </div>
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${100 - reveal * 50}%)` }}>
        <Photo src="characters/rama-split.jpg" zoom={zoom} origin="50% 35%" x={glitch ? 14 : 0} filter="saturate(1.3) contrast(1.1)" />
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "50%",
          width: 4,
          background: "#ff2a2a",
          boxShadow: "0 0 30px 6px rgba(255,40,40,0.7)",
          opacity: reveal,
        }}
      />

      <div style={{ position: "absolute", top: 210, left: 0, right: 0, textAlign: "center" }}>
        <Bar at={cue("split", 11.85)} size={52} bg="#000" style={{ border: "3px solid #e21818" }}>
          13 vite më vonë
        </Bar>
      </div>
    </AbsoluteFill>
  );
};
