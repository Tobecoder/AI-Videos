import React from 'react';
import { Composition } from 'remotion';
import { DPIntroComposition } from './DPIntroComposition';
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from './theme';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DPIntro"
        component={DPIntroComposition}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
