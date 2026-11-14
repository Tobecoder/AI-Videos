import React from 'react';
import { AbsoluteFill } from 'remotion';
import { THEME } from '../theme';

export const PaperBackground: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.bg,
        overflow: 'hidden',
      }}
    >
      {/* Subtle warm radial glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 22% 18%, rgba(255, 255, 255, 0.85) 0%, rgba(246, 244, 238, 0) 58%), radial-gradient(circle at 82% 76%, rgba(255, 90, 31, 0.045) 0%, rgba(246, 244, 238, 0) 52%)',
        }}
      />

      {/* Minimal dot-grid matrix */}
      <svg
        width="1920"
        height="1080"
        style={{ position: 'absolute', inset: 0, opacity: 0.35 }}
      >
        <defs>
          <pattern
            id="dot-grid"
            width="36"
            height="36"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="18" cy="18" r="1.25" fill="#D5CFC1" />
          </pattern>
          <filter id="paper-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.035" />
            </feComponentTransfer>
          </filter>
        </defs>
        <rect width="1920" height="1080" fill="url(#dot-grid)" />
        <rect
          width="1920"
          height="1080"
          filter="url(#paper-noise)"
          opacity="0.7"
        />
      </svg>
    </AbsoluteFill>
  );
};
