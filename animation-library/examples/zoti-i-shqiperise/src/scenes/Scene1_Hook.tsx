import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { cue, sceneLength } from "../timing";
import { boil, motionBlur, pingPongEntrance, weldDetach } from "../motion/helpers";
import { Photo, Shade } from "../effects/Photo";
import { Slam } from "../effects/Type";
import { Sfx } from "../effects/Sfx";
import { GOLD, LABEL } from "../fonts";

const PROMISES: [string, number][] = [
  ["PA KORRUPSION", 6.2],
  ["PA OLIGARKË", 7.7],
  ["NJË SHTET PËR QYTETARËT", 9.25],
];

/** Scene 1 — The Promise (2013). Warm gold, weld → detach frame, slow push. */
export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const len = sceneLength("hook");

  const zoom = interpolate(frame, [0, len], [1.0, 1.2], { easing: Easing.inOut(Easing.cubic) });
  const kick = interpolate(frame, [len - 10, len], [0, 0.12], { extrapolateLeft: "clamp" });
  const blur = interpolate(frame, [len - 10, len], [0, 10], { extrapolateLeft: "clamp" });
  const weld = weldDetach(frame, cue("hook", 5.6), cue("hook", 10.5));
  const b = boil(frame, "rama2013", 1.2);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0400" }}>
      <Sfx name="shutter" at={cue("hook", 0.1)} volume={0.5} />
      <Sfx name="whoosh" at={len - 14} volume={0.6} />

      <Photo
        src="characters/rama-2013.jpg"
        zoom={zoom + kick}
        x={b.x}
        y={b.y}
        origin="50% 35%"
        filter={`${motionBlur(blur)} saturate(1.15) contrast(1.08)`}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 50% 35%, rgba(255,180,80,0.22) 0%, transparent 55%)",
          mixBlendMode: "overlay",
        }}
      />
      <Shade from="bottom" strength={0.9} size="48%" />

      {/* Weld frame: locked to the photo, then detaches and drifts away */}
      <div
        style={{
          position: "absolute",
          inset: 70,
          border: `6px solid ${GOLD}`,
          boxShadow: "0 0 60px rgba(212,160,64,0.6), inset 0 0 40px rgba(212,160,64,0.3)",
          transform: `scale(${(zoom + kick) * weld.scale})`,
          transformOrigin: "50% 35%",
          opacity: 1 - weld.detachProgress,
        }}
      />

      <div style={{ position: "absolute", bottom: 520, left: 0, right: 0 }}>
        <Slam at={cue("hook", 0.2)} size={150} color="#f5d58a" glow="rgba(255,180,80,0.6)">
          2013
        </Slam>
      </div>
      <div style={{ position: "absolute", bottom: 400, left: 0, right: 0 }}>
        <Slam at={cue("hook", 4.3)} size={96} color={GOLD} glow="rgba(212,160,64,0.5)">
          SHQIPËRIA E RE
        </Slam>
      </div>

      <div style={{ position: "absolute", bottom: 150, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        {PROMISES.map(([text, sec], i) => {
          const at = cue("hook", sec);
          if (frame < at) return null;
          const p = pingPongEntrance(frame - at, 12, 1.12);
          return (
            <div
              key={text}
              style={{
                fontFamily: LABEL,
                fontWeight: 700,
                fontSize: 46,
                letterSpacing: 4,
                color: "#fff3d6",
                textShadow: "0 4px 12px #000",
                transform: `translateX(${(1 - p) * (i % 2 ? 300 : -300)}px)`,
                opacity: Math.min(1, p),
              }}
            >
              — {text} —
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
