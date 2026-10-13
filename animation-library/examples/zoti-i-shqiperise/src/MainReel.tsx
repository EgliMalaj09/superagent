import { AbsoluteFill, Audio, interpolate, Sequence, staticFile } from "remotion";
import { SCENES, SceneId, TOTAL_FRAMES, VO_OFFSET } from "./timing";
import { FilmTreatment } from "./effects/FilmTreatment";
import { Scene0Title } from "./scenes/Scene0_Title";
import { Scene1Hook } from "./scenes/Scene1_Hook";
import { Scene1bSplitFace } from "./scenes/Scene1b_SplitFace";
import { Scene2Transformation } from "./scenes/Scene2_Transformation";
import { Scene3Fallen } from "./scenes/Scene3_Fallen";
import { Scene4Loot } from "./scenes/Scene4_Loot";
import { Scene5Twist } from "./scenes/Scene5_Twist";
import { Scene6Coronation } from "./scenes/Scene6_Coronation";

export const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  title: Scene0Title,
  hook: Scene1Hook,
  split: Scene1bSplitFace,
  transformation: Scene2Transformation,
  fallen: Scene3Fallen,
  loot: Scene4Loot,
  twist: Scene5Twist,
  coronation: Scene6Coronation,
};

export const ZotiMaster: React.FC = () => (
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

    <Sequence from={VO_OFFSET} name="voiceover" layout="none">
      <Audio src={staticFile("audio/voiceover.mp3")} />
    </Sequence>
    {/* Music ducks under the voice, swells in the silent title, fades out with the picture */}
    <Audio
      src={staticFile("audio/music.wav")}
      volume={(f) =>
        interpolate(f, [0, VO_OFFSET - 10, VO_OFFSET + 5, TOTAL_FRAMES - 20, TOTAL_FRAMES], [0.75, 0.75, 0.3, 0.3, 0], {
          extrapolateRight: "clamp",
        })
      }
    />
  </AbsoluteFill>
);
