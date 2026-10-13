import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { cue, sceneLength } from "../timing";
import { boil } from "../motion/helpers";
import { Photo } from "../effects/Photo";
import { Slam } from "../effects/Type";
import { Sfx } from "../effects/Sfx";
import { GOLD, LABEL, RED } from "../fonts";

/** Scene 2 — "ai nuk është më Kryeministër. Ai është bërë diçka tjetër." */
export const Scene2Transformation: React.FC = () => {
  const frame = useCurrentFrame();
  const len = sceneLength("transformation");

  const drain = interpolate(frame, [0, cue("transformation", 16.6)], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateRight: "clamp",
  });
  const push = interpolate(frame, [0, len], [1.0, 1.14]);
  const b = boil(frame, "silhouette", 0.8);

  const kryeIn = cue("transformation", 13.9);
  const kryeOut = cue("transformation", 16.1);
  const krye = interpolate(frame, [kryeIn, kryeIn + 8, kryeOut, kryeOut + 8], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const strike = interpolate(frame, [kryeOut - 18, kryeOut - 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const zotiAt = cue("transformation", 17.2);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sfx name="stamp" at={kryeOut - 10} volume={0.4} />
      <Sfx name="boom" at={zotiAt} volume={0.9} />

      <Photo
        src="characters/rama-silhouette.jpg"
        zoom={push}
        x={b.x}
        y={b.y}
        origin="50% 45%"
        filter={`saturate(${1 - drain * 0.3}) brightness(${1 - drain * 0.2}) contrast(${1 + drain * 0.25})`}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 50% 30%, rgba(0,0,0,0) 0%, rgba(120,0,0,0.75) 95%)",
          opacity: drain,
          mixBlendMode: "multiply",
        }}
      />
      <AbsoluteFill
        style={{
          background: "linear-gradient(0deg, rgba(226,24,24,0.3) 0%, transparent 55%)",
          opacity: drain,
          mixBlendMode: "screen",
        }}
      />

      <div style={{ position: "absolute", top: 230, left: 0, right: 0, textAlign: "center", opacity: krye }}>
        <span style={{ position: "relative", fontFamily: LABEL, fontWeight: 700, fontSize: 76, letterSpacing: 8, color: GOLD, textShadow: "0 4px 15px #000" }}>
          KRYEMINISTËR
          <span
            style={{
              position: "absolute",
              left: -10,
              top: "52%",
              height: 10,
              width: `calc(${strike * 100}% + 20px)`,
              background: RED,
              boxShadow: "0 0 20px rgba(226,24,24,0.8)",
            }}
          />
        </span>
      </div>
      <div style={{ position: "absolute", top: 180, left: 0, right: 0 }}>
        <Slam at={zotiAt} size={260} color={RED} glow="rgba(226,24,24,0.9)" settle={10} style={{ letterSpacing: 16 }}>
          ZOTI
        </Slam>
      </div>
    </AbsoluteFill>
  );
};
