import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { cue, sceneLength } from "../timing";
import { boil, motionBlur } from "../motion/helpers";
import { Photo } from "../effects/Photo";
import { Bar, Slam, Stamp } from "../effects/Type";
import { Sfx } from "../effects/Sfx";
import { GOLD, LABEL } from "../fonts";

// His face in each image as a % of the 1080×1920 frame — the zoom-through pivots on these.
const FACE_PLAIN = "50% 32.5%"; // rama-throne.jpg
const FACE_CROWNED = "50% 44%"; // rama-throne-crowned.jpg

const RUSH_IN = 14; // frames the camera rushes into his face before the cut
const PULL_BACK = 20; // frames the camera pulls back to reveal the crown
const DEEP_ZOOM = 3.4;

const CHARGES = [
  { label: "MINISTRAT E TIJ", stamp: "NË BURG", show: 56.5, hit: 57.6, y: 560 },
  { label: "ZËVENDËSI I TIJ", stamp: "NË ARRATI", show: 58.9, hit: 60.0, y: 860 },
  { label: "INTELIGJENCA E TIJ", stamp: "NËN ARREST", show: 61.25, hit: 62.4, y: 1160 },
];

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Scene 6 — The Coronation. Recap of the fallen, the throne, then a zoom-through reveals the crown. */
export const Scene6Coronation: React.FC = () => {
  const frame = useCurrentFrame();
  const len = sceneLength("coronation");

  const reveal = cue("coronation", 64.0);
  const crownAt = cue("coronation", 72.35);
  const rushFrom = crownAt - RUSH_IN;

  const clear = interpolate(frame, [reveal, reveal + 20], [0, 1], clamp);
  const recapOut = interpolate(frame, [reveal - 10, reveal], [1, 0], clamp);
  const b = boil(frame, "throne", 0.6);

  const crowned = frame >= crownAt;
  const since = frame - crownAt;

  // Before the cut: slow push, then a sudden rush into his face
  const slowPush = interpolate(frame, [reveal, rushFrom], [1.0, 1.12], clamp);
  const rush = interpolate(frame, [rushFrom, crownAt], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const plainZoom = slowPush + rush * (DEEP_ZOOM - slowPush);

  // After the cut: start deep on his face, pull back fast so the crown comes into view
  const crownedZoom = interpolate(since, [0, PULL_BACK, len - crownAt], [DEEP_ZOOM, 1.0, 1.05], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  const blur = crowned ? interpolate(since, [0, 12], [14, 0], { extrapolateRight: "clamp" }) : rush * 14;

  const midCaptions = frame >= cue("coronation", 64.6) && frame < cue("coronation", 67.9);
  const fadeOut = interpolate(frame, [len - 20, len], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ background: "#000", opacity: fadeOut }}>
      {CHARGES.map((c) => (
        <Sfx key={c.label} name="stamp" at={cue("coronation", c.hit)} volume={0.75} />
      ))}
      <Sfx name="whoosh" at={reveal - 6} volume={0.6} />
      <Sfx name="whoosh" at={rushFrom} volume={0.8} />
      <Sfx name="boom" at={crownAt + PULL_BACK - 4} volume={1} />

      {!crowned && (
        <Photo
          src="characters/rama-throne.jpg"
          zoom={plainZoom}
          x={b.x}
          y={b.y}
          origin={FACE_PLAIN}
          filter={`${motionBlur(blur)} blur(${(1 - clear) * 18}px) brightness(${0.35 + clear * 0.65}) contrast(1.12)`}
        />
      )}

      {crowned && (
        <Photo
          src="characters/rama-throne-crowned.jpg"
          zoom={crownedZoom}
          x={b.x}
          y={b.y}
          origin={FACE_CROWNED}
          filter={`${motionBlur(blur)} contrast(1.12)`}
        />
      )}

      {/* Recap of the fallen over the blurred throne */}
      <AbsoluteFill style={{ opacity: recapOut }}>
        {CHARGES.map((c, i) =>
          frame >= cue("coronation", c.show) ? (
            <div key={c.label} style={{ position: "absolute", top: c.y, left: 0, right: 0, textAlign: "center" }}>
              <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 62, letterSpacing: 6, color: "#fff", textShadow: "0 4px 12px #000", marginBottom: 18 }}>
                {c.label}
              </div>
              <Stamp at={cue("coronation", c.hit)} text={c.stamp} rotate={i % 2 ? 6 : -6} size={64} />
            </div>
          ) : null
        )}
      </AbsoluteFill>

      {midCaptions && (
        <div style={{ position: "absolute", top: 180, left: 60, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
          <Bar at={cue("coronation", 64.6)} size={50} bg="#000" color={GOLD} style={{ borderLeft: `8px solid ${GOLD}` }}>
            I rizgjedhur
          </Bar>
          <Bar at={cue("coronation", 66.2)} size={50} bg="#000" color={GOLD} style={{ borderLeft: `8px solid ${GOLD}` }}>
            I pakapshëm
          </Bar>
        </div>
      )}

      {frame >= cue("coronation", 68.0) && frame < rushFrom && (
        <div
          style={{
            position: "absolute",
            bottom: 230,
            left: 60,
            right: 60,
            textAlign: "center",
            fontFamily: LABEL,
            fontWeight: 700,
            fontSize: 46,
            letterSpacing: 4,
            color: "#ddd",
            textShadow: "0 4px 12px #000",
          }}
        >
          EDI RAMA NUK ËSHTË MË KRYEMINISTËR.
        </div>
      )}

      <div style={{ position: "absolute", bottom: 150, left: 0, right: 0 }}>
        <Slam at={crownAt + PULL_BACK - 4} size={124} color={GOLD} glow="rgba(226,24,24,0.9)" settle={9}>
          ZOTI I SHQIPËRISË
        </Slam>
      </div>
    </AbsoluteFill>
  );
};
