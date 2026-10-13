import { AbsoluteFill, Composition, Folder } from "remotion";
import { FPS, HEIGHT, SCENES, SceneId, TOTAL_FRAMES, WIDTH } from "./timing";
import { SCENE_COMPONENTS, ZotiMaster } from "./MainReel";
import { FilmTreatment } from "./effects/FilmTreatment";

const withFilm = (C: React.FC): React.FC => () => (
  <AbsoluteFill>
    <C />
    <FilmTreatment />
  </AbsoluteFill>
);

const SCENE_PREVIEWS = Object.fromEntries(
  (Object.keys(SCENES) as SceneId[]).map((id) => [id, withFilm(SCENE_COMPONENTS[id])])
) as Record<SceneId, React.FC>;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="ZotiMaster" component={ZotiMaster} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Folder name="Scenes">
      {(Object.keys(SCENES) as SceneId[]).map((id) => (
        <Composition
          key={id}
          id={`Scene-${id}`}
          component={SCENE_PREVIEWS[id]}
          durationInFrames={SCENES[id][1] - SCENES[id][0]}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
      ))}
    </Folder>
  </>
);
