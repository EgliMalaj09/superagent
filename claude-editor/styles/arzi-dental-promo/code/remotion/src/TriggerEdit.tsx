import { AbsoluteFill, Easing, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";

/**
 * TRIGGER — 4s b-roll for Creative 01 (no captions):
 *   0–41   instrument tray, gloved hand takes an instrument
 *   42–77  close-up: gloved hands lift an instrument at the dental unit
 *   78–119 slow glide across the instruments on the tray
 * Cut 1 (f42): light-flash zoom (both shots have bright windows).
 * Cut 2 (f78): push-in toward the instrument, incoming starts tighter and settles.
 * Every shot carries a slow push-in.
 */

const C1 = 42;
const C2 = 78;
const END = 119;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeIn = Easing.in(Easing.cubic);
const easeOut = Easing.out(Easing.cubic);

export const TriggerEdit: React.FC = () => {
  const f = useCurrentFrame();

  let scale = 1;
  let origin = "50% 50%";
  let blur = 0;

  if (f < C1) {
    scale = interpolate(f, [0, C1], [1.0, 1.05], clamp);
    const rush = interpolate(f, [C1 - 4, C1], [0, 1], { ...clamp, easing: easeIn });
    scale *= 1 + 0.18 * rush;
    blur = rush * 7;
    origin = "40% 72%";
  } else if (f < C2) {
    const settle = interpolate(f, [C1, C1 + 8], [1, 0], { ...clamp, easing: easeOut });
    scale = 1.14 * settle + (1 - settle) * 1.0 + interpolate(f, [C1, C2], [0, 0.05], clamp);
    blur = settle * 5;
    const rush = interpolate(f, [C2 - 4, C2], [0, 1], { ...clamp, easing: easeIn });
    scale *= 1 + 0.22 * rush;
    blur += rush * 6;
    origin = "45% 55%"; // toward the instrument in the gloved hand
  } else {
    const settle = interpolate(f, [C2, C2 + 9], [1, 0], { ...clamp, easing: easeOut });
    scale = 1.0 + 0.14 * settle + interpolate(f, [C2, END], [0, 0.05], clamp);
    blur = settle * 5;
    origin = "50% 70%"; // toward the instruments on the tray
  }

  const flash = interpolate(f, [C1 - 3, C1, C1 + 6], [0, 0.75, 0], clamp);
  const soft = interpolate(f, [C2 - 2, C2, C2 + 4], [0, 0.25, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          transformOrigin: origin,
          filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
        }}
      >
        <OffthreadVideo src={staticFile("rec/trigger.mp4")} muted />
      </AbsoluteFill>
      {/* window-light flash, slightly warm, like sun blooming through the glass */}
      <AbsoluteFill
        style={{
          opacity: flash,
          background: "radial-gradient(ellipse 90% 70% at 50% 30%, #fffaf0 0%, rgba(255,246,228,0.85) 45%, rgba(255,240,220,0.4) 100%)",
          mixBlendMode: "screen",
        }}
      />
      <AbsoluteFill style={{ backgroundColor: "#ffffff", opacity: soft, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};
