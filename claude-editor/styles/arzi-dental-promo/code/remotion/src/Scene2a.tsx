import { AbsoluteFill, Easing, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";

/**
 * SCENE 2a — AI waiting-room shot, refined: awkward hand-reach removed (cut at
 * f29 hidden by a punch-in to a closer framing), slow motion, warm grade,
 * slow push toward her face, light film grain.
 */
const CUT = 29;
const END = 201;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Scene2a: React.FC = () => {
  const f = useCurrentFrame();
  const push = interpolate(f, [0, END], [1.0, 1.08], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const punch = f >= CUT ? 0.1 * interpolate(f, [CUT, CUT + 14], [1, 0.35], { ...clamp, easing: Easing.out(Easing.cubic) }) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${push + punch})`, transformOrigin: "45% 32%" }}>
        <OffthreadVideo src={staticFile("rec/s2a.mp4")} muted />
      </AbsoluteFill>
      {/* soft vignette for a filmic, less AI-clean look */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 70% at 45% 35%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.28) 100%)" }} />
      <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: 0.12 }}>
        <svg width={1080} height={1920}>
          <filter id="g2a">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 30} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width={1080} height={1920} filter="url(#g2a)" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
