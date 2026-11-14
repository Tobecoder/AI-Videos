import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { THEME } from '../theme';
import { TimelineSegment } from '../utils/anim';

interface SubtitleCapsuleProps {
  segments: TimelineSegment[];
}

export const SubtitleCapsule: React.FC<SubtitleCapsuleProps> = ({
  segments,
}) => {
  const frame = useCurrentFrame();
  const active = segments.find(
    (s) => frame >= s.startFrame && frame <= s.endFrame + 4
  );

  if (!active) {
    return null;
  }

  const localFrame = frame - active.startFrame;
  const opacity = interpolate(localFrame, [0, 4], [0.4, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const translateY = interpolate(localFrame, [0, 5], [6, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 28,
        left: 96,
        right: 96,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      <div
        style={{
          backgroundColor: THEME.ink,
          color: '#FFFFFF',
          padding: '13px 32px',
          borderRadius: 16,
          maxWidth: 1620,
          textAlign: 'center',
          fontFamily: THEME.fontSans,
          fontSize: 27,
          fontWeight: 700,
          lineHeight: 1.4,
          letterSpacing: '0.01em',
          boxShadow: '0 12px 32px rgba(30, 34, 41, 0.24)',
          border: '1.5px solid rgba(255, 255, 255, 0.1)',
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        {active.displayText}
      </div>
    </div>
  );
};
