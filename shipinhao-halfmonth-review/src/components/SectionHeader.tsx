import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { THEME } from '../theme';
import { popSpring } from '../utils/anim';

interface SectionHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  delay?: number;
  align?: 'left' | 'center';
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  delay = 0,
  align = 'left',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = popSpring(frame, fps, delay);
  const translateY = interpolate(progress, [0, 1], [22, 0]);
  const opacity = interpolate(progress, [0, 0.6], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        textAlign: align,
        opacity,
        transform: `translateY(${translateY}px)`,
        fontFamily: THEME.fontSans,
      }}
    >
      <div
        style={{
          fontSize: 23,
          fontWeight: 700,
          color: THEME.inkMuted,
          marginBottom: 8,
          letterSpacing: '0.02em',
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          fontSize: 50,
          fontWeight: 900,
          color: THEME.ink,
          lineHeight: 1.2,
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </div>
    </div>
  );
};
