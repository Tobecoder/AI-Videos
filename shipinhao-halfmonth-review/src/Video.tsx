import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import { PaperBackground } from './components/PaperBackground';
import { SubtitleCapsule } from './components/SubtitleCapsule';
import { TopStepBar } from './components/TopStepBar';
import timelineRaw from './data/timeline.json';
import { Scene01Hook } from './scenes/Scene01Hook';
import { Scene02NicheChoice } from './scenes/Scene02NicheChoice';
import { Scene03TrafficMechanism } from './scenes/Scene03TrafficMechanism';
import { Scene04DataBattle } from './scenes/Scene04DataBattle';
import { Scene05GrowthPlaybook } from './scenes/Scene05GrowthPlaybook';
import { Scene06RoiAndPivot } from './scenes/Scene06RoiAndPivot';
import { TimelineData } from './utils/anim';

const timeline = timelineRaw as TimelineData;

const SceneWrapper: React.FC<{
  index: number;
  durationInFrames: number;
  children: React.ReactNode;
}> = ({ index, durationInFrames, children }) => {
  const frame = useCurrentFrame();

  // Varied scene-to-scene entrance & exit transitions
  const enterT = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const exitT = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  let transform = '';
  if (index > 0) {
    switch (index % 3) {
      case 1:
        transform = `translateX(${interpolate(enterT, [0, 1], [120, 0])}px)`;
        break;
      case 2:
        transform = `scale(${interpolate(enterT, [0, 1], [0.94, 1])})`;
        break;
      case 0:
      default:
        transform = `translateY(${interpolate(enterT, [0, 1], [70, 0])}px)`;
        break;
    }
  }

  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(index === 0 ? 1 : enterT, exitT),
        transform,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const ShipinhaoReviewVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const currentScene =
    timeline.scenes.find(
      (s) => frame >= s.startFrame && frame < s.endFrame
    ) ?? timeline.scenes[timeline.scenes.length - 1];

  const renderScene = (sceneId: string, startFrame: number) => {
    const segs = timeline.segments.filter((s) => s.sceneId === sceneId);
    const props = {
      segments: segs,
      sceneStartFrame: startFrame,
      subCues: timeline.subCues,
    };

    switch (sceneId) {
      case 'hook':
        return <Scene01Hook {...props} />;
      case 'niche':
        return <Scene02NicheChoice {...props} />;
      case 'traffic':
        return <Scene03TrafficMechanism {...props} />;
      case 'data':
        return <Scene04DataBattle {...props} />;
      case 'playbook':
        return <Scene05GrowthPlaybook {...props} />;
      case 'roi':
        return <Scene06RoiAndPivot {...props} />;
      default:
        return null;
    }
  };

  return (
    <AbsoluteFill>
      <PaperBackground />
      <TopStepBar activeStep={currentScene.stepIndex} />

      {timeline.scenes.map((scene, idx) => (
        <Sequence
          key={scene.sceneId}
          from={scene.startFrame}
          durationInFrames={scene.durationInFrames}
        >
          <SceneWrapper index={idx} durationInFrames={scene.durationInFrames}>
            {renderScene(scene.sceneId, scene.startFrame)}
          </SceneWrapper>
        </Sequence>
      ))}

      <SubtitleCapsule segments={timeline.segments} />
      <Audio src={staticFile('audio/narration.mp3')} />
    </AbsoluteFill>
  );
};
