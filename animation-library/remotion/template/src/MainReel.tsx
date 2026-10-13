import { AbsoluteFill, Audio, interpolate, Sequence, staticFile } from "remotion";
import { SCENES, SceneId, TOTAL_FRAMES, VO_OFFSET } from "./timing";
import { FilmTreatment } from "./effects/FilmTreatment";
import { Scene00Title } from "./scenes/Scene00_Title";

// Register every scene here, keyed by its id in timing.ts.
export const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  title: Scene00Title,
};

// Flip on once public/audio/voiceover.mp3 and music.wav exist.
const HAS_VOICEOVER = false;
const HAS_MUSIC = false;

export const Main: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {(Object.keys(SCENES) as SceneId[]).map((id) => {
      const [from, to] = SCENES[id];
      const C = SCENE_COMPONENTS[id];
      return (
        <Sequence key={id} name={id} from={from} durationInFrames={to - from}>
          <C />
        </Sequence>
      );
    })}
    <FilmTreatment />

    {HAS_VOICEOVER && (
      <Sequence from={VO_OFFSET} name="voiceover" layout="none">
        <Audio src={staticFile("audio/voiceover.mp3")} />
      </Sequence>
    )}
    {/* Music ducks under the voice, swells in the silent title, fades out with the picture */}
    {HAS_MUSIC && (
      <Audio
        src={staticFile("audio/music.wav")}
        volume={(f) =>
          interpolate(f, [0, VO_OFFSET - 10, VO_OFFSET + 5, TOTAL_FRAMES - 20, TOTAL_FRAMES], [0.5, 0.5, 0.08, 0.08, 0], {
            extrapolateRight: "clamp",
          })
        }
      />
    )}
  </AbsoluteFill>
);
