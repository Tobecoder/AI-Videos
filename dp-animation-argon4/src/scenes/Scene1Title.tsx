import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONT_MONO, FONT_SANS } from '../theme';

const FIB_BG_ITEMS = [
  { val: '1', x: 12, y: 22, size: 46, speed: 0.9, color: COLORS.cyan, phase: 0 },
  { val: '1', x: 85, y: 18, size: 42, speed: 1.1, color: COLORS.pink, phase: 1.2 },
  { val: '2', x: 22, y: 75, size: 54, speed: 0.8, color: COLORS.yellow, phase: 2.1 },
  { val: '3', x: 78, y: 78, size: 60, speed: 1.0, color: COLORS.green, phase: 0.7 },
  { val: '5', x: 8, y: 52, size: 68, speed: 1.2, color: COLORS.cyan, phase: 1.8 },
  { val: '8', x: 90, y: 48, size: 74, speed: 0.85, color: COLORS.pink, phase: 2.9 },
  { val: '13', x: 30, y: 15, size: 80, speed: 0.95, color: COLORS.yellow, phase: 0.4 },
  { val: '21', x: 68, y: 16, size: 86, speed: 1.15, color: COLORS.green, phase: 1.5 },
  { val: '34', x: 16, y: 86, size: 92, speed: 0.75, color: COLORS.pink, phase: 2.5 },
  { val: '55', x: 82, y: 85, size: 96, speed: 1.05, color: COLORS.cyan, phase: 3.1 },
  { val: '89', x: 48, y: 12, size: 64, speed: 0.9, color: COLORS.yellow, phase: 1.0 },
  { val: '144', x: 52, y: 88, size: 72, speed: 1.0, color: COLORS.green, phase: 2.2 },
];

export const Scene1Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title pop-in spring
  const titlePop = spring({
    frame: frame - 6,
    fps,
    config: { damping: 10, stiffness: 160, mass: 0.8 },
  });

  const subtitlePop = spring({
    frame: frame - 20,
    fps,
    config: { damping: 13, stiffness: 140 },
  });

  const legendPop = spring({
    frame: frame - 34,
    fps,
    config: { damping: 14, stiffness: 130 },
  });

  // Scene exit fade
  const exitOpacity = interpolate(frame, [92, 105], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Concentric ripples expanding from center
  const ripples = [
    { delay: 6, color: COLORS.yellow, maxRadius: 720 },
    { delay: 14, color: COLORS.cyan, maxRadius: 920 },
    { delay: 22, color: COLORS.pink, maxRadius: 1100 },
    { delay: 30, color: COLORS.green, maxRadius: 1280 },
  ];

  return (
    <AbsoluteFill
      style={{
        opacity: exitOpacity,
        fontFamily: FONT_SANS,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Floating Fibonacci numbers in background */}
      {FIB_BG_ITEMS.map((item, idx) => {
        const floatY = item.y - (frame * item.speed * 0.18);
        const driftX = item.x + Math.sin(frame * 0.05 + item.phase) * 1.8;
        const rot = Math.sin(frame * 0.04 + item.phase) * 8;
        const itemOpacity = interpolate(frame, [0, 15], [0, 0.22], {
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: `${driftX}%`,
              top: `${floatY}%`,
              transform: `translate(-50%, -50%) rotate(${rot}deg)`,
              fontFamily: FONT_MONO,
              fontSize: item.size,
              fontWeight: 800,
              color: item.color,
              opacity: itemOpacity,
              textShadow: `0 0 24px ${item.color}`,
              userSelect: 'none',
            }}
          >
            {item.val}
          </div>
        );
      })}

      {/* Expanding ripple rings */}
      {ripples.map((r, i) => {
        const localFrame = Math.max(0, frame - r.delay);
        const progress = interpolate(localFrame, [0, 65], [0, 1], {
          extrapolateRight: 'clamp',
        });
        const radius = interpolate(progress, [0, 1], [60, r.maxRadius]);
        const alpha = interpolate(progress, [0, 0.15, 1], [0, 0.65, 0]);

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: radius * 2,
              height: radius * 2,
              borderRadius: '50%',
              border: `3px solid ${r.color}`,
              opacity: alpha,
              boxShadow: `0 0 30px ${r.color}66, inset 0 0 30px ${r.color}33`,
              pointerEvents: 'none',
            }}
          />
        );
      })}

      {/* Main Title Card */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `scale(${interpolate(titlePop, [0, 1], [0.3, 1])})`,
          opacity: interpolate(titlePop, [0, 0.4, 1], [0, 1, 1]),
          zIndex: 10,
        }}
      >
        <div
          style={{
            padding: '10px 28px',
            borderRadius: 999,
            background: `${COLORS.bgCard}dd`,
            border: `2px solid ${COLORS.cyan}88`,
            color: COLORS.cyan,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 3,
            marginBottom: 28,
            boxShadow: `0 0 24px ${COLORS.cyan}44`,
          }}
        >
          ALGORITHM VISUALIZATION · 1, 1, 2, 3, 5, 8, 13, 21
        </div>

        <div
          style={{
            fontSize: 112,
            fontWeight: 900,
            color: COLORS.textMain,
            letterSpacing: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            textShadow: `0 10px 40px rgba(0,0,0,0.7)`,
          }}
        >
          <span
            style={{
              color: COLORS.yellow,
              textShadow: `0 0 36px ${COLORS.yellow}88`,
            }}
          >
            动态规划
          </span>
          <span style={{ color: COLORS.textMuted, fontSize: 80 }}>·</span>
          <span>30秒入门</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            marginTop: 28,
            fontSize: 34,
            color: COLORS.textMuted,
            fontWeight: 500,
            transform: `translateY(${interpolate(subtitlePop, [0, 1], [24, 0])}px)`,
            opacity: subtitlePop,
          }}
        >
          从 <span style={{ color: COLORS.pink, fontWeight: 700 }}>指数级爆炸 O(2ⁿ)</span> 到{' '}
          <span style={{ color: COLORS.green, fontWeight: 700 }}>线性递推 O(n)</span> 的核心直觉
        </div>

        {/* Color Legend Pills */}
        <div
          style={{
            marginTop: 48,
            display: 'flex',
            gap: 28,
            transform: `translateY(${interpolate(legendPop, [0, 1], [30, 0])}px)`,
            opacity: legendPop,
          }}
        >
          {[
            { label: '当前项 i', color: COLORS.yellow, code: 'dp[i]' },
            { label: '前一项 i-1', color: COLORS.cyan, code: 'dp[i-1]' },
            { label: '前两项 i-2', color: COLORS.pink, code: 'dp[i-2]' },
          ].map((pill, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '12px 26px',
                borderRadius: 16,
                background: COLORS.bgCard,
                border: `2px solid ${pill.color}`,
                boxShadow: `0 0 20px ${pill.color}33`,
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: pill.color,
                  boxShadow: `0 0 12px ${pill.color}`,
                }}
              />
              <span style={{ fontSize: 24, color: COLORS.textMain, fontWeight: 600 }}>
                {pill.label}
              </span>
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 22,
                  color: pill.color,
                  fontWeight: 700,
                }}
              >
                {pill.code}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
