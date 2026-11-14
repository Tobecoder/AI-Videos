import React from 'react';
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { THEME } from '../theme';
import { popSpring, snappySpring } from '../utils/anim';

/** Gated reveal that strictly keeps element hidden until `atFrame`, with varied entrance styles. */
export const RevealBox: React.FC<{
  atFrame: number;
  variant?: 'slideUp' | 'slideLeft' | 'slideRight' | 'zoomPop' | 'flipY' | 'flipX';
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ atFrame, variant = 'slideUp', children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < atFrame) {
    return null;
  }

  const p = popSpring(frame, fps, atFrame);
  const opacity = interpolate(p, [0, 0.35], [0, 1], { extrapolateRight: 'clamp' });

  let transform = '';
  switch (variant) {
    case 'slideLeft':
      transform = `translateX(${interpolate(p, [0, 1], [-64, 0])}px)`;
      break;
    case 'slideRight':
      transform = `translateX(${interpolate(p, [0, 1], [64, 0])}px)`;
      break;
    case 'zoomPop':
      transform = `scale(${interpolate(p, [0, 1], [0.65, 1])})`;
      break;
    case 'flipY':
      transform = `perspective(1200px) rotateY(${interpolate(p, [0, 1], [-85, 0])}deg)`;
      break;
    case 'flipX':
      transform = `perspective(1200px) rotateX(${interpolate(p, [0, 1], [75, 0])}deg)`;
      break;
    case 'slideUp':
    default:
      transform = `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.95, 1])})`;
      break;
  }

  return (
    <div style={{ opacity, transform, ...style }}>
      {children}
    </div>
  );
};

/** Heavy rubber-stamp slam with expanding shockwave ring at `atFrame`. */
export const StampSlam: React.FC<{
  atFrame: number;
  ringColor?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ atFrame, ringColor = THEME.orange, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < atFrame) return null;

  const local = frame - atFrame;
  const p = snappySpring(frame, fps, atFrame);
  const scale = interpolate(p, [0, 1], [2.25, 1]);
  const rotate = interpolate(p, [0, 1], [-8, 0]);
  const opacity = interpolate(local, [0, 3], [0, 1], { extrapolateRight: 'clamp' });

  const ringProgress = interpolate(local, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
  const ringScale = interpolate(ringProgress, [0, 1], [0.6, 1.55]);
  const ringOpacity = interpolate(ringProgress, [0, 0.25, 1], [0, 0.65, 0]);

  return (
    <div style={{ position: 'relative', display: 'inline-block', ...style }}>
      <div
        style={{
          position: 'absolute',
          inset: -12,
          borderRadius: 24,
          border: `4px solid ${ringColor}`,
          transform: `scale(${ringScale})`,
          opacity: ringOpacity,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          opacity,
          transform: `scale(${scale}) rotate(${rotate}deg)`,
          transformOrigin: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Sweeping marker-pen highlighter behind key phrases at `atFrame`. */
export const HighlightSweep: React.FC<{
  atFrame: number;
  color?: string;
  children: React.ReactNode;
}> = ({ atFrame, color = 'rgba(255, 90, 31, 0.22)', children }) => {
  const frame = useCurrentFrame();
  const w =
    frame < atFrame
      ? 0
      : interpolate(frame - atFrame, [0, 14], [0, 100], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        });

  return (
    <span style={{ position: 'relative', display: 'inline-block', padding: '0 6px' }}>
      <span
        style={{
          position: 'absolute',
          left: 0,
          bottom: 4,
          height: '44%',
          width: `${w}%`,
          backgroundColor: color,
          borderRadius: 6,
          zIndex: 0,
        }}
      />
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </span>
  );
};
