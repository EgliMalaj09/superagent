import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { cue, sceneLength } from "../timing";
import { boil, flicker, pendulum, posterizeTime } from "../motion/helpers";
import { Photo } from "../effects/Photo";
import { Bar, Slam, Stamp } from "../effects/Type";
import { Sfx } from "../effects/Sfx";
import { LABEL, RED } from "../fonts";

const pad = (n: number) => String(n).padStart(2, "0");

/** Scene 5 — The Twist. Surveillance room: swinging flickering lamp, CCTV HUD, wiretap waveform. */
export const Scene5Twist: React.FC = () => {
  const frame = useCurrentFrame();
  const len = sceneLength("twist");

  const swing = pendulum(frame, 110, 1);
  const bulb = flicker(frame, "twist-lamp");
  const push = interpolate(frame, [0, len], [1.04, 1.16]);
  const b = boil(frame, "hyseni", 0.8);

  const secs = 3 * 3600 + 14 * 60 + 7 + Math.floor(frame / 30);
  const clock = `22.09.2026  ${pad(Math.floor(secs / 3600))}:${pad(Math.floor(secs / 60) % 60)}:${pad(secs % 60)}`;
  const bandY = ((frame * 23) % 2300) - 200;

  const lowerOut = cue("twist", 51.5);
  const stampAt = cue("twist", 50.9);
  const finalAt = cue("twist", 54.55);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sfx name="beep" at={cue("twist", 45.7)} volume={0.5} />
      <Sfx name="beep" at={cue("twist", 47.6)} volume={0.5} />
      <Sfx name="stamp" at={stampAt} volume={0.8} />
      <Sfx name="boom" at={finalAt} volume={0.9} />

      <Photo
        src="characters/hyseni.jpg"
        zoom={push}
        x={b.x}
        y={b.y}
        origin="50% 40%"
        filter={`brightness(${0.55 + bulb * 0.45}) contrast(1.15) saturate(0.9)`}
      />
      {/* Swinging overhead lamp: a warm cone that sweeps across her */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 520px 760px at ${50 + swing * 22}% 32%, rgba(255,230,170,${0.28 * bulb}) 0%, transparent 70%)`,
          mixBlendMode: "screen",
        }}
      />
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.5)", opacity: 1 - bulb }} />

      {/* VHS tracking band */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: bandY,
          height: 90,
          backdropFilter: "blur(3px) brightness(1.5)",
          background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0 2px, transparent 2px 5px)",
          transform: `translateX(${(random(`band-${posterizeTime(frame, 2)}`) - 0.5) * 30}px)`,
        }}
      />

      {/* CCTV HUD */}
      <AbsoluteFill style={{ padding: 50, fontFamily: LABEL, color: "#e8ffe8", fontSize: 30, letterSpacing: 3 }}>
        {[
          { top: 40, left: 40, borderTop: "4px solid", borderLeft: "4px solid" },
          { top: 40, right: 40, borderTop: "4px solid", borderRight: "4px solid" },
          { bottom: 40, left: 40, borderBottom: "4px solid", borderLeft: "4px solid" },
          { bottom: 40, right: 40, borderBottom: "4px solid", borderRight: "4px solid" },
        ].map((s, i) => (
          <div key={i} style={{ position: "absolute", width: 90, height: 90, borderColor: "rgba(230,255,230,0.7)", ...s }} />
        ))}
        <div style={{ position: "absolute", top: 70, left: 80, display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ width: 22, height: 22, borderRadius: 11, background: RED, opacity: Math.floor(frame / 15) % 2 ? 1 : 0.15 }} />
          REC · CAM 04 · SHISH
        </div>
        <div style={{ position: "absolute", top: 70, right: 80 }}>{clock}</div>
      </AbsoluteFill>

      {/* Wiretap waveform */}
      <svg width={1080} height={160} style={{ position: "absolute", bottom: 330 }}>
        {Array.from({ length: 48 }).map((_, i) => {
          const h = 8 + Math.abs(Math.sin(frame * 0.35 + i * 0.6)) * 110 * random(`w-${i}-${posterizeTime(frame, 2)}`);
          return <rect key={i} x={60 + i * 20} y={80 - h / 2} width={10} height={h} fill="rgba(80,255,210,0.75)" />;
        })}
      </svg>

      <div style={{ position: "absolute", top: 200, left: 0, right: 0, textAlign: "center" }}>
        <Bar at={cue("twist", 45.65)} size={50}>SPAK u afrua</Bar>
      </div>

      {frame < lowerOut && (
        <div style={{ position: "absolute", bottom: 160, left: 60, right: 60, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
          <Bar at={cue("twist", 47.5)} size={44} bg="#000" style={{ borderLeft: `8px solid ${RED}` }}>
            Vlora Hyseni · Drejtoresha e SHISH
          </Bar>
          <Bar at={cue("twist", 48.6)} size={38}>
            SHISH përgjoi familjarët e prokurorëve
          </Bar>
        </div>
      )}

      <div style={{ position: "absolute", top: 820, left: 0, right: 0, textAlign: "center" }}>
        <Stamp at={stampAt} text="NËN ARREST SHTËPIAK" rotate={-10} size={64} />
      </div>

      {frame >= cue("twist", 51.7) && (
        <div
          style={{
            position: "absolute",
            bottom: 210,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: LABEL,
            fontWeight: 700,
            fontSize: 50,
            letterSpacing: 4,
            color: "#fff",
            textShadow: "0 4px 12px #000",
            opacity: interpolate(frame, [cue("twist", 51.7), cue("twist", 51.7) + 8], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          SHTETI NUK HETONTE MË KRIMIN.
        </div>
      )}
      <div style={{ position: "absolute", bottom: 60, left: 0, right: 0 }}>
        <Slam at={finalAt} size={118} color={RED} glow="rgba(226,24,24,0.8)">
          SHTETI E MBRONTE.
        </Slam>
      </div>
    </AbsoluteFill>
  );
};
