import React from 'react';
import { Composition } from 'remotion';
import timelineRaw from './data/timeline.json';
import { TimelineData } from './utils/anim';
import { ShipinhaoReviewVideo } from './Video';

const timeline = timelineRaw as TimelineData;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ShipinhaoReview"
        component={ShipinhaoReviewVideo}
        durationInFrames={timeline.totalFrames}
        fps={timeline.fps}
        width={timeline.width}
        height={timeline.height}
      />
    </>
  );
};
