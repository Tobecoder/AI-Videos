import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { COLORS, FONT_MONO, SCENE_FRAMES, TOTAL_FRAMES } from './theme';
import { Scene1Title } from './scenes/Scene1Title';
import { Scene2Stairs } from './scenes/Scene2Stairs';
import { Scene3Recursion } from './scenes/Scene3Recursion';
import { Scene4DPTable } from './scenes/Scene4DPTable';
import { Scene5Summary } from './scenes/Scene5Summary';

export const DPIntroComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = (frame / TOTAL_FRAMES) * 100;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bgDeep,
        backgroundImage: `
          radial-gradient(circle at 18% 20%, rgba(0, 240, 255, 0.08) 0%, transparent 45%),
          radial-gradient(circle at 82% 80%, rgba(255, 42, 133, 0.08) 0%, transparent 45%),
          linear-gradient(rgba(38, 53, 84, 0.22) 1px, transparent 1px),
          linear-gradient(90deg, rgba(38, 53, 84, 0.22) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 100% 100%, 60px 60px, 60px 60px',
        overflow: 'hidden',
      }}
    >
      {/* Programmatically generated sound effects track */}
      <Audio src={staticFile('sfx.wav')} volume={0.9} />

      {/* 0 - 3.5s: Scene 1 Title */}
      <Sequence
        from={SCENE_FRAMES.scene1.start}
        durationInFrames={SCENE_FRAMES.scene1.end - SCENE_FRAMES.scene1.start}
      >
        <Scene1Title />
      </Sequence>

      {/* 3.5 - 9s: Scene 2 Climbing Stairs */}
      <Sequence
        from={SCENE_FRAMES.scene2.start}
        durationInFrames={SCENE_FRAMES.scene2.end - SCENE_FRAMES.scene2.start}
      >
        <Scene2Stairs />
      </Sequence>

      {/* 9 - 14.5s: Scene 3 Brute-Force Recursion */}
      <Sequence
        from={SCENE_FRAMES.scene3.start}
        durationInFrames={SCENE_FRAMES.scene3.end - SCENE_FRAMES.scene3.start}
      >
        <Scene3Recursion />
      </Sequence>

      {/* 14.5 - 24s: Scene 4 DP Table Filling */}
      <Sequence
        from={SCENE_FRAMES.scene4.start}
        durationInFrames={SCENE_FRAMES.scene4.end - SCENE_FRAMES.scene4.start}
      >
        <Scene4DPTable />
      </Sequence>

      {/* 24 - 28.5s: Scene 5 Summary Three Steps */}
      <Sequence
        from={SCENE_FRAMES.scene5.start}
        durationInFrames={SCENE_FRAMES.scene5.end - SCENE_FRAMES.scene5.start}
      >
        <Scene5Summary />
      </Sequence>

      {/* Persistent Color Legend & Timeline Progress Bar at very bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          left: 100,
          right: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: FONT_MONO,
          fontSize: 16,
          color: COLORS.textMuted,
          opacity: 0.85,
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: COLORS.yellow,
                display: 'inline-block',
              }}
            />
            当前格 i (Yellow)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: COLORS.cyan,
                display: 'inline-block',
              }}
            />
            i-1 / +1阶 (Cyan)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: COLORS.pink,
                display: 'inline-block',
              }}
            />
            i-2 / +2阶 (Pink)
          </span>
        </div>
        <div>{(frame / 30).toFixed(1)}s / 28.5s</div>
      </div>

      {/* Bottom Progress Line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 6,
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${COLORS.cyan}, ${COLORS.pink}, ${COLORS.yellow}, ${COLORS.green})`,
          boxShadow: `0 0 16px ${COLORS.cyan}`,
          zIndex: 60,
        }}
      />
    </AbsoluteFill>
  );
};
