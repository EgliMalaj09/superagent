import { AbsoluteFill, useCurrentFrame, random } from "remotion";
import { posterizeTime } from "../motion/helpers";

/** Film treatment stack — rides on top of every scene: scan lines, grain, dust, corner blur, vignette, gate weave. */
export const FilmTreatment: React.FC = () => {
  const frame = useCurrentFrame();
  const grainT = posterizeTime(frame, 1);

  const weaveX = (random(`weave-x-${posterizeTime(frame, 2)}`) - 0.5) * 4;
  const weaveY = (random(`weave-y-${posterizeTime(frame, 2)}`) - 0.5) * 3;
  const hasDust = random(`dust-${posterizeTime(frame, 4)}`) > 0.85;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", transform: `translate(${weaveX}px, ${weaveY}px)` }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0px, rgba(0,0,0,0.16) 1.6px, transparent 1.6px, transparent 4px)",
          mixBlendMode: "multiply",
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.18,
          mixBlendMode: "overlay",
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${1.6 + random(`grain-${grainT}`) * 0.4}' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.9'/></svg>")`,
          backgroundSize: "300px 300px",
          transform: `translate(${(random(`gx-${grainT}`) - 0.5) * 30}px, ${(random(`gy-${grainT}`) - 0.5) * 30}px)`,
        }}
      />
      {hasDust && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(ellipse at 20% 30%, rgba(255,230,180,0.08), transparent 40%), radial-gradient(ellipse at 80% 70%, rgba(255,210,160,0.06), transparent 50%)",
            mixBlendMode: "screen",
            opacity: 0.7,
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.35) 85%, rgba(0,0,0,0.75) 100%)",
        }}
      />
      <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 350px 60px rgba(0,0,0,0.85)" }} />
    </AbsoluteFill>
  );
};
