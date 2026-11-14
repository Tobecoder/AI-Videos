import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { THEME } from '../theme';
import { popSpring } from '../utils/anim';

interface BentoCardProps {
  children: React.ReactNode;
  delay?: number;
  accent?: 'none' | 'orange' | 'teal' | 'dark';
  variant?: 'slideUp' | 'slideLeft' | 'slideRight' | 'zoomPop' | 'flipY' | 'flipX';
  style?: React.CSSProperties;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  delay = 0,
  accent = 'none',
  variant = 'slideUp',
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < delay) {
    return null;
  }

  const progress = popSpring(frame, fps, delay);
  const opacity = interpolate(progress, [0, 0.4], [0, 1], {
    extrapolateRight: 'clamp',
  });

  let transform = '';
  switch (variant) {
    case 'slideLeft':
      transform = `translateX(${interpolate(progress, [0, 1], [-56, 0])}px)`;
      break;
    case 'slideRight':
      transform = `translateX(${interpolate(progress, [0, 1], [56, 0])}px)`;
      break;
    case 'zoomPop':
      transform = `scale(${interpolate(progress, [0, 1], [0.72, 1])})`;
      break;
    case 'flipY':
      transform = `perspective(1200px) rotateY(${interpolate(progress, [0, 1], [-80, 0])}deg)`;
      break;
    case 'flipX':
      transform = `perspective(1200px) rotateX(${interpolate(progress, [0, 1], [70, 0])}deg)`;
      break;
    case 'slideUp':
    default:
      transform = `translateY(${interpolate(progress, [0, 1], [36, 0])}px) scale(${interpolate(
        progress,
        [0, 1],
        [0.95, 1]
      )})`;
      break;
  }

  const isDark = accent === 'dark';
  const borderColor =
    accent === 'orange'
      ? THEME.orange
      : accent === 'teal'
      ? THEME.teal
      : isDark
      ? '#2C323D'
      : THEME.cardBorder;

  return (
    <div
      style={{
        backgroundColor: isDark ? THEME.ink : THEME.cardBg,
        color: isDark ? '#FFFFFF' : THEME.ink,
        borderRadius: 26,
        border: `2px solid ${borderColor}`,
        boxShadow: isDark
          ? '0 22px 48px rgba(30, 34, 41, 0.22)'
          : '0 14px 36px rgba(30, 34, 41, 0.065), 0 2px 6px rgba(30, 34, 41, 0.03)',
        padding: '28px 32px',
        fontFamily: THEME.fontSans,
        opacity,
        transform,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
