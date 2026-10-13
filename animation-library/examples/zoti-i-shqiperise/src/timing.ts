export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Voiceover starts after a 2s silent title card.
export const VO_OFFSET = 60;

/** Absolute master frame for a timestamp (seconds) in voiceover.mp3. */
export const at = (voSec: number) => VO_OFFSET + Math.round(voSec * FPS);

const VO_END = at(73.8);

// [start, end) absolute frames. Boundaries sit inside the voiceover's pauses
// (measured with scripts/detect-pauses.mjs).
export const SCENES = {
  title: [0, VO_OFFSET],
  hook: [VO_OFFSET, at(11.3)],
  split: [at(11.3), at(13.6)],
  transformation: [at(13.6), at(18.4)],
  fallen: [at(18.4), at(33.1)],
  loot: [at(33.1), at(45.25)],
  twist: [at(45.25), at(56.1)],
  coronation: [at(56.1), VO_END + 50],
} as const;

export type SceneId = keyof typeof SCENES;

export const sceneStart = (id: SceneId) => SCENES[id][0];
export const sceneLength = (id: SceneId) => SCENES[id][1] - SCENES[id][0];

/** Scene-local frame for a voiceover timestamp. */
export const cue = (id: SceneId, voSec: number) => at(voSec) - sceneStart(id);

export const TOTAL_FRAMES = SCENES.coronation[1];
