import { Audio, Sequence, staticFile } from "remotion";

// Master level for every sound effect; lower = quieter under the voiceover.
const SFX_GAIN = 0.12;

export type SfxName = "stamp" | "boom" | "riser" | "whoosh" | "shutter" | "beep";

export const Sfx: React.FC<{ name: SfxName; at: number; volume?: number }> = ({
  name,
  at,
  volume = 0.8,
}) => (
  <Sequence from={Math.max(0, at)} layout="none" name={`sfx:${name}`}>
    <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={volume * SFX_GAIN} />
  </Sequence>
);
