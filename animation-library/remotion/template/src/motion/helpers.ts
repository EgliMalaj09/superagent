import { interpolate, Easing, random } from "remotion";

/** Posterize time — quantize a frame value to a step so animations tick in chunky frames (stop-motion feel). */
export const posterizeTime = (frame: number, step = 2): number => {
  return Math.floor(frame / step) * step;
};

/** Character boil — tiny jittery offsets so a static image feels alive. Returns {x, y, rot}. */
export const boil = (
  frame: number,
  seed: string,
  amount = 2
): { x: number; y: number; rot: number } => {
  const t = posterizeTime(frame, 3);
  const x = (random(`${seed}-x-${t}`) - 0.5) * amount * 2;
  const y = (random(`${seed}-y-${t}`) - 0.5) * amount * 2;
  const rot = (random(`${seed}-r-${t}`) - 0.5) * (amount * 0.1);
  return { x, y, rot };
};

/** Ping-pong entrance — overshoot then settle. 0 → start, 1 → overshoot, settled by end. */
export const pingPongEntrance = (
  frame: number,
  durationInFrames = 20,
  overshoot = 1.15
): number => {
  const p = Math.min(frame / durationInFrames, 1);
  if (p < 0.6) {
    return interpolate(p, [0, 0.6], [0, overshoot], {
      easing: Easing.out(Easing.cubic),
    });
  }
  return interpolate(p, [0.6, 1], [overshoot, 1], {
    easing: Easing.inOut(Easing.cubic),
  });
};

/** Weld → detach: a frame locks to its subject, then "detaches" (grows/separates) past a given frame. */
export const weldDetach = (
  frame: number,
  detachAt: number,
  endAt: number
): { scale: number; detachProgress: number } => {
  if (frame < detachAt) return { scale: 1, detachProgress: 0 };
  const progress = interpolate(frame, [detachAt, endAt], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  return { scale: 1 + progress * 0.4, detachProgress: progress };
};

/** Parallax push — layer at depth d (0=far, 1=near) zooms at a scaled rate. */
export const parallaxPush = (
  frame: number,
  totalFrames: number,
  depth: number,
  startScale = 1,
  endScale = 1.3
): number => {
  const p = Math.min(frame / totalFrames, 1);
  const span = (endScale - startScale) * (0.4 + depth * 1.2);
  return startScale + p * span;
};

/** Flicker (hold keyframes) — fluorescent / bad bulb pulse. Returns opacity 0..1. */
export const flicker = (frame: number, seed = "lamp"): number => {
  const t = posterizeTime(frame, 2);
  const r = random(`${seed}-${t}`);
  if (r < 0.08) return 0.1;
  if (r < 0.14) return 0.45;
  if (r < 0.2) return 0.75;
  return 1;
};

/** Slow pendulum swing — for a hanging lamp. Returns a value in [-amplitude, amplitude]. */
export const pendulum = (frame: number, periodFrames = 90, amplitude = 6): number => {
  return Math.sin((frame / periodFrames) * Math.PI * 2) * amplitude;
};

/** Motion blur CSS filter helper. */
export const motionBlur = (strength: number): string =>
  `blur(${Math.max(0, strength)}px)`;

/** Smash-in (for stamps, titles, number crashes). Enter huge → settle. */
export const smashIn = (
  frame: number,
  startFrame: number,
  settleFrames = 8
): { scale: number; opacity: number } => {
  if (frame < startFrame) return { scale: 3, opacity: 0 };
  const p = Math.min((frame - startFrame) / settleFrames, 1);
  const scale = interpolate(p, [0, 1], [3, 1], {
    easing: Easing.out(Easing.poly(5)),
  });
  const opacity = interpolate(p, [0, 0.2], [0, 1], { extrapolateRight: "clamp" });
  return { scale, opacity };
};
