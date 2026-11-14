import { Easing, interpolate, spring } from 'remotion';

export interface TimelineSegment {
  id: string;
  sceneId: string;
  stepIndex: number;
  stepLabel: string;
  displayText: string;
  cue: string;
  startSec: number;
  endSec: number;
  startFrame: number;
  endFrame: number;
}

export interface TimelineScene {
  sceneId: string;
  stepIndex: number;
  stepLabel: string;
  startFrame: number;
  endFrame: number;
  durationInFrames: number;
}

export interface TimelineData {
  fps: number;
  width: number;
  height: number;
  totalDurationSec: number;
  totalFrames: number;
  audioMode: string;
  scenes: TimelineScene[];
  segments: TimelineSegment[];
  subCues?: Record<string, number>;
}

export const popSpring = (frame: number, fps: number, delay = 0) =>
  spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: {
      damping: 14,
      stiffness: 160,
      mass: 0.76,
    },
  });

export const snappySpring = (frame: number, fps: number, delay = 0) =>
  spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: {
      damping: 11,
      stiffness: 220,
      mass: 0.65,
    },
  });

export const smoothT = (frame: number, start: number, duration: number) =>
  interpolate(frame, [start, start + Math.max(1, duration)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

export const getCueStartFrame = (
  segments: TimelineSegment[],
  sceneStartFrame: number,
  cue: string,
  fallback = 0
): number => {
  const seg = segments.find((s) => s.cue === cue);
  if (!seg) return fallback;
  return Math.max(0, seg.startFrame - sceneStartFrame);
};

export const getSubCueFrame = (
  subCues: Record<string, number> | undefined,
  sceneStartFrame: number,
  key: string,
  fallback = 0
): number => {
  const absFrame = subCues?.[key];
  if (typeof absFrame !== 'number') return fallback;
  return Math.max(0, absFrame - sceneStartFrame);
};
