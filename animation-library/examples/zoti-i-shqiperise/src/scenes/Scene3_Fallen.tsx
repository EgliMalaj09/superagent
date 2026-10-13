import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cue } from "../timing";
import { boil, pingPongEntrance } from "../motion/helpers";
import { Slam, Stamp } from "../effects/Type";
import { Sfx } from "../effects/Sfx";
import { GOLD, LABEL, RED } from "../fonts";

// enter = when the name is spoken, hit = when the charge is spoken (voiceover seconds)
const FALLEN = [
  { file: "tahiri.jpg", name: "SAIMIR TAHIRI", stamp: "I DËNUAR", enter: 18.95, hit: 20.45, from: [-700, 0], pos: "50% 25%" },
  { file: "koka.jpg", name: "LEFTER KOKA", stamp: "I DËNUAR", enter: 21.75, hit: 23.1, from: [700, 0], pos: "50% 25%" },
  { file: "ahmetaj.jpg", name: "ARBEN AHMETAJ", stamp: "NË ARRATI", enter: 24.3, hit: 25.7, from: [0, -900], pos: "40% 30%" },
  { file: "balluku.jpg", name: "BELINDA BALLUKU", stamp: "NËN HETIM", enter: 27.05, hit: 29.7, from: [0, 900], pos: "50% 35%" },
  { file: "veliaj.jpg", name: "ERION VELIAJ", stamp: "NËN HETIM", enter: 27.75, hit: 29.85, from: [-700, 300], pos: "40% 15%" },
  { file: "hyseni.jpg", name: "VLORA HYSENI", stamp: "NËN HETIM", enter: 28.5, hit: 30.0, from: [700, 300], pos: "50% 35%" },
] as const;

/** Scene 3 — The Fallen. Portraits fly in staggered from varied directions; stamps land on the charge. */
export const Scene3Fallen: React.FC = () => {
  const frame = useCurrentFrame();

  const listAt = cue("fallen", 31.25);

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, #1a0808 0%, #000 75%)" }}>
      {FALLEN.map((f) => (
        <Sfx key={`s-${f.name}`} name="shutter" at={cue("fallen", f.enter)} volume={0.5} />
      ))}
      {FALLEN.map((f) => (
        <Sfx key={`h-${f.name}`} name="stamp" at={cue("fallen", f.hit)} volume={0.75} />
      ))}
      <Sfx name="boom" at={listAt} volume={0.7} />

      <div style={{ position: "absolute", top: 70, left: 0, right: 0, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 14, color: GOLD }}>
        NJERËZIT E TIJ
      </div>

      <div
        style={{
          position: "absolute",
          inset: "150px 46px 230px 46px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr 1fr",
          gap: 22,
        }}
      >
        {FALLEN.map((f, i) => {
          const enterAt = cue("fallen", f.enter);
          const hitAt = cue("fallen", f.hit);
          const p = frame < enterAt ? 0 : pingPongEntrance(frame - enterAt, 14, 1.08);
          const hit = frame >= hitAt;
          const b = boil(frame + i * 7, `portrait-${i}`, 1);
          return (
            <div
              key={f.name}
              style={{
                position: "relative",
                overflow: "hidden",
                background: "#0a0404",
                border: `4px solid ${hit ? "#5a1010" : "#3a2a20"}`,
                boxShadow: "0 12px 30px rgba(0,0,0,0.9)",
                opacity: Math.min(1, p * 1.5),
                transform: `translate(${f.from[0] * (1 - p) + b.x}px, ${f.from[1] * (1 - p) + b.y}px) rotate(${b.rot + (1 - p) * (i % 2 ? 12 : -12)}deg)`,
              }}
            >
              <Img
                src={staticFile(`images/characters/${f.file}`)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: f.pos,
                  filter: `grayscale(${hit ? 1 : 0.35}) brightness(${hit ? 0.55 : 0.95}) contrast(1.15)`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "10px 6px",
                  background: "rgba(0,0,0,0.88)",
                  borderTop: `2px solid ${GOLD}`,
                  color: GOLD,
                  fontFamily: LABEL,
                  fontWeight: 700,
                  fontSize: 26,
                  letterSpacing: 2,
                  textAlign: "center",
                }}
              >
                {f.name}
              </div>
              <div style={{ position: "absolute", top: "42%", left: 0, right: 0, textAlign: "center" }}>
                <Stamp at={hitAt} text={f.stamp} rotate={-14 + (i % 3) * 9} size={40} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ position: "absolute", bottom: 80, left: 0, right: 0 }}>
        <Slam at={listAt} size={92} color={RED} glow="rgba(226,24,24,0.6)">
          LISTA NUK MBARON
        </Slam>
      </div>
      {frame > listAt && (
        <AbsoluteFill
          style={{
            background: "#000",
            opacity: interpolate(frame, [listAt + 20, listAt + 40], [0, 0.35], { extrapolateRight: "clamp" }),
          }}
        />
      )}
    </AbsoluteFill>
  );
};
