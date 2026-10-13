export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Voiceover starts after a 2s silent title card.
export const VO_OFFSET = 60;

/** Absolute master frame for a timestamp (seconds) in voiceover.mp3. */
export const at = (voSec: number) => VO_OFFSET + Math.round(voSec * FPS);

// [start, end) absolute frames. Add one entry per scene, in order, with
// boundaries placed inside voiceover pauses (run `npm run pauses`).
export const SCENES = {
  title: [0, VO_OFFSET],
} as const;

export type SceneId = keyof typeof SCENES;

export const sceneStart = (id: SceneId) => SCENES[id][0];
export const sceneLength = (id: SceneId) => SCENES[id][1] - SCENES[id][0];

/** Scene-local frame for a voiceover timestamp. */
export const cue = (id: SceneId, voSec: number) => at(voSec) - sceneStart(id);

const ids = Object.keys(SCENES) as SceneId[];
export const TOTAL_FRAMES = SCENES[ids[ids.length - 1]][1];
