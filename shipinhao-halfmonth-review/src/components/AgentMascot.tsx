import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { THEME } from '../theme';
import { popSpring } from '../utils/anim';

interface AgentMascotProps {
  size?: number;
  delay?: number;
  lookX?: number;
  lookY?: number;
  leftBadge?: string;
  rightBadge?: string;
  mood?: 'normal' | 'shock' | 'happy' | 'thinking';
}

export const AgentMascot: React.FC<AgentMascotProps> = ({
  size = 156,
  delay = 0,
  lookX = 0,
  lookY = 0,
  leftBadge,
  rightBadge,
  mood = 'normal',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < delay) return null;

  const entrance = popSpring(frame, fps, delay);
  const floatY = Math.sin(frame / 16) * 5;
  const tilt = mood === 'thinking' ? -4 : mood === 'happy' ? Math.sin(frame / 10) * 3 : 0;

  const blinkCycle = frame % 95;
  const blinkScale =
    blinkCycle >= 86 && blinkCycle <= 91
      ? interpolate(blinkCycle, [86, 88.5, 91], [1, 0.12, 1])
      : 1;

  const eyeShiftX = lookX * (size * 0.055);
  const eyeShiftY = lookY * (size * 0.045);

  const badgeStyle: React.CSSProperties = {
    padding: '10px 18px',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    border: `2px solid ${THEME.teal}`,
    boxShadow: '0 8px 20px rgba(20, 184, 166, 0.14)',
    fontFamily: THEME.fontSans,
    fontSize: 20,
    fontWeight: 800,
    color: THEME.ink,
    whiteSpace: 'nowrap',
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        transform: `translateY(${floatY}px) rotate(${tilt}deg) scale(${interpolate(
          entrance,
          [0, 1],
          [0.6, 1]
        )})`,
        opacity: interpolate(entrance, [0, 0.45], [0, 1], {
          extrapolateRight: 'clamp',
        }),
      }}
    >
      {leftBadge ? <div style={badgeStyle}>{leftBadge}</div> : null}

      <div
        style={{
          width: size,
          height: size * 0.9,
          borderRadius: size * 0.24,
          backgroundColor: THEME.ink,
          boxShadow:
            '0 18px 38px rgba(30, 34, 41, 0.24), inset 0 2px 4px rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: size * 0.16,
          position: 'relative',
        }}
      >
        {[0, 1].map((idx) => {
          if (mood === 'happy') {
            return (
              <div
                key={idx}
                style={{
                  width: size * 0.17,
                  height: size * 0.1,
                  borderTop: `${Math.max(4, size * 0.04)}px solid #5EEAD4`,
                  borderRadius: '999px 999px 0 0',
                  transform: `translate(${eyeShiftX}px, ${eyeShiftY}px)`,
                }}
              />
            );
          }

          const eyeHeight =
            mood === 'shock'
              ? size * 0.26
              : mood === 'thinking' && idx === 1
              ? size * 0.13
              : size * 0.22;

          return (
            <div
              key={idx}
              style={{
                width: size * 0.145,
                height: eyeHeight,
                borderRadius: 999,
                backgroundColor: mood === 'shock' ? '#FFA94D' : THEME.eyeGlow,
                boxShadow:
                  mood === 'shock'
                    ? '0 0 16px rgba(255, 169, 77, 0.7)'
                    : '0 0 14px rgba(127, 166, 255, 0.55)',
                transform: `translate(${eyeShiftX}px, ${eyeShiftY}px) scaleY(${blinkScale})`,
              }}
            />
          );
        })}
      </div>

      {rightBadge ? <div style={badgeStyle}>{rightBadge}</div> : null}
    </div>
  );
};
