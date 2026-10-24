import { Composition } from "remotion";
import { MainVideo, totalFrames } from "./Video";
import { FPS, scenes } from "./lib/timeline";

const ALL = scenes.map((s) => s.id);
const PREVIEW = ["hook"];

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Preview"
      component={MainVideo}
      durationInFrames={totalFrames(PREVIEW)}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={{ sceneIds: PREVIEW }}
    />
    <Composition
      id="Stock924"
      component={MainVideo}
      durationInFrames={totalFrames(ALL)}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={{ sceneIds: ALL }}
    />
  </>
);
