import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONT_MONO, FONT_SANS } from '../theme';

// Stairs 0..5
// Ball jumps: +1 (0->1), +2 (1->3), +1 (3->4), +1 (4->5)
interface JumpSegment {
  from: number;
  to: number;
  step: 1 | 2;
  startFrame: number;
  endFrame: number;
}

const JUMPS: JumpSegment[] = [
  { from: 0, to: 1, step: 1, startFrame: 42, endFrame: 66 },
  { from: 1, to: 3, step: 2, startFrame: 76, endFrame: 104 },
  { from: 3, to: 4, step: 1, startFrame: 114, endFrame: 138 },
  { from: 4, to: 5, step: 1, startFrame: 148, endFrame: 172 },
];

export const Scene2Stairs: React.FC = () => {
  const frame = useCurrentFrame(); // 0..165 (5.5s)
  const { fps } = useVideoConfig();

  const enterOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const exitOpacity = interpolate(frame, [152, 165], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Stair layout coordinates
  const baseLeft = 280;
  const baseBottom = 860;
  const stepWidth = 220;
  const stepHeight = 95;

  const getStairTopCenter = (idx: number) => ({
    x: baseLeft + idx * stepWidth + stepWidth * 0.5,
    y: baseBottom - (idx + 1) * stepHeight,
  });

  // Compute ball position and squash/stretch deformation
  let ballX = getStairTopCenter(0).x;
  let ballY = getStairTopCenter(0).y;
  let scaleX = 1;
  let scaleY = 1;

  // Before first jump: ball pops onto stair 0
  const ballAppear = spring({
    frame: frame - 18,
    fps,
    config: { damping: 10, stiffness: 160 },
  });

  for (let i = 0; i < JUMPS.length; i++) {
    const j = JUMPS[i];
    const startPt = getStairTopCenter(j.from);
    const endPt = getStairTopCenter(j.to);

    if (frame >= j.startFrame && frame <= j.endFrame) {
      const t = (frame - j.startFrame) / (j.endFrame - j.startFrame);
      ballX = interpolate(t, [0, 1], [startPt.x, endPt.x]);
      const linearY = interpolate(t, [0, 1], [startPt.y, endPt.y]);
      const arcHeight = j.step === 2 ? 190 : 125;
      const arcOffset = -4 * arcHeight * t * (1 - t);
      ballY = linearY + arcOffset;

      // Stretch while in mid-air
      const stretch = Math.sin(t * Math.PI) * 0.22;
      scaleX = 1 - stretch * 0.6;
      scaleY = 1 + stretch;
      break;
    } else if (frame > j.endFrame) {
      ballX = endPt.x;
      ballY = endPt.y;

      // Check landing squash & rebound within 12 frames after landing
      const sinceLand = frame - j.endFrame;
      if (sinceLand >= 0 && sinceLand <= 12) {
        const squashWave = Math.sin((sinceLand / 12) * Math.PI * 2) * Math.exp(-sinceLand * 0.22);
        scaleX = 1 + squashWave * 0.36;
        scaleY = 1 - squashWave * 0.36;
      }
    }
  }

  const ballRadius = 32;

  return (
    <AbsoluteFill
      style={{
        opacity: enterOpacity * exitOpacity,
        fontFamily: FONT_SANS,
      }}
    >
      {/* Top Header */}
      <div
        style={{
          position: 'absolute',
          top: 56,
          left: 100,
          right: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ color: COLORS.yellow, fontSize: 24, fontWeight: 700, letterSpacing: 2 }}>
            SCENE 01 · 问题引入
          </div>
          <div style={{ color: COLORS.textMain, fontSize: 56, fontWeight: 900, marginTop: 6 }}>
            爬楼梯问题：每次可走{' '}
            <span style={{ color: COLORS.cyan }}>+1 阶</span> 或{' '}
            <span style={{ color: COLORS.pink }}>+2 阶</span>
          </div>
        </div>

        {/* Step Sequence Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            background: COLORS.bgCard,
            padding: '18px 28px',
            borderRadius: 20,
            border: `2px solid ${COLORS.border}`,
          }}
        >
          <span style={{ color: COLORS.textMuted, fontSize: 24, fontWeight: 600 }}>路径演示：</span>
          {JUMPS.map((j, idx) => {
            const active = frame >= j.startFrame;
            const color = j.step === 1 ? COLORS.cyan : COLORS.pink;
            const pop = spring({
              frame: frame - j.startFrame,
              fps,
              config: { damping: 10, stiffness: 180 },
            });
            return (
              <div
                key={idx}
                style={{
                  padding: '8px 20px',
                  borderRadius: 12,
                  fontFamily: FONT_MONO,
                  fontSize: 28,
                  fontWeight: 800,
                  color: active ? COLORS.bgDeep : COLORS.textMuted,
                  background: active ? color : '#1E293B',
                  border: `2px solid ${active ? color : COLORS.border}`,
                  transform: `scale(${active ? interpolate(pop, [0, 1], [0.7, 1]) : 0.95})`,
                  boxShadow: active ? `0 0 20px ${color}88` : 'none',
                }}
              >
                +{j.step}
              </div>
            );
          })}
        </div>
      </div>

      {/* SVG Layer for Jump Arcs & Landing Ripples */}
      <svg
        width={1920}
        height={1080}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 4 }}
      >
        {JUMPS.map((j, idx) => {
          if (frame < j.startFrame) return null;
          const startPt = getStairTopCenter(j.from);
          const endPt = getStairTopCenter(j.to);
          const color = j.step === 1 ? COLORS.cyan : COLORS.pink;
          const arcHeight = j.step === 2 ? 190 : 125;
          const ctrlX = (startPt.x + endPt.x) / 2;
          const ctrlY = Math.min(startPt.y, endPt.y) - arcHeight * 1.65;
          const progress = interpolate(frame, [j.startFrame, j.endFrame], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          const pathD = `M ${startPt.x} ${startPt.y - 16} Q ${ctrlX} ${ctrlY} ${endPt.x} ${endPt.y - 16}`;

          // Landing ring
          const landFrame = frame - j.endFrame;
          const showRing = landFrame >= 0 && landFrame <= 20;
          const ringRx = interpolate(landFrame, [0, 20], [16, 75], { extrapolateRight: 'clamp' });
          const ringAlpha = interpolate(landFrame, [0, 20], [0.9, 0], { extrapolateRight: 'clamp' });

          return (
            <g key={idx}>
              <path
                d={pathD}
                fill="none"
                stroke={color}
                strokeWidth={5}
                strokeDasharray="12 10"
                opacity={0.75 * progress}
              />
              {/* Step label at peak of arc */}
              {progress > 0.35 && (
                <g transform={`translate(${ctrlX}, ${(startPt.y + endPt.y) / 2 - arcHeight - 25})`}>
                  <rect
                    x={-38}
                    y={-22}
                    width={76}
                    height={40}
                    rx={12}
                    fill={COLORS.bgDeep}
                    stroke={color}
                    strokeWidth={2.5}
                  />
                  <text
                    x={0}
                    y={6}
                    textAnchor="middle"
                    fill={color}
                    fontFamily={FONT_MONO}
                    fontSize={24}
                    fontWeight={800}
                  >
                    +{j.step}
                  </text>
                </g>
              )}
              {showRing && (
                <ellipse
                  cx={endPt.x}
                  cy={endPt.y - 4}
                  rx={ringRx}
                  ry={ringRx * 0.3}
                  fill="none"
                  stroke={color}
                  strokeWidth={4}
                  opacity={ringAlpha}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Stairs rising one by one */}
      {[0, 1, 2, 3, 4, 5].map((idx) => {
        const riseSpring = spring({
          frame: frame - idx * 5,
          fps,
          config: { damping: 12, stiffness: 150 },
        });

        const fullHeight = (idx + 1) * stepHeight;
        const currentHeight = fullHeight * riseSpring;
        const left = baseLeft + idx * stepWidth;

        // Is this stair visited by the ball?
        const visited =
          idx === 0
            ? frame >= 18
            : JUMPS.some((j) => j.to === idx && frame >= j.endFrame);
        const visitJump = JUMPS.find((j) => j.to === idx);
        const highlightColor =
          idx === 5 && visited
            ? COLORS.green
            : visitJump
              ? visitJump.step === 1
                ? COLORS.cyan
                : COLORS.pink
              : COLORS.yellow;

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left,
              bottom: 1080 - baseBottom,
              width: stepWidth - 10,
              height: currentHeight,
              background: visited
                ? `linear-gradient(180deg, ${highlightColor}33 0%, ${COLORS.bgCard} 100%)`
                : `linear-gradient(180deg, #1E293B 0%, ${COLORS.bgPanel} 100%)`,
              borderTop: `6px solid ${visited ? highlightColor : '#475569'}`,
              borderLeft: `2px solid ${visited ? highlightColor + '66' : COLORS.border}`,
              borderRight: `2px solid ${visited ? highlightColor + '66' : COLORS.border}`,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              boxShadow: visited ? `0 -8px 28px ${highlightColor}33` : 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 0',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 26,
                fontWeight: 800,
                color: visited ? highlightColor : COLORS.textMuted,
              }}
            >
              {idx === 0 ? '起点 0' : `第 ${idx} 阶`}
            </div>

            {idx === 5 && (
              <div
                style={{
                  padding: '8px 18px',
                  borderRadius: 999,
                  background: visited ? COLORS.green : '#1E293B',
                  color: visited ? COLORS.bgDeep : COLORS.textMuted,
                  fontWeight: 900,
                  fontSize: 22,
                  boxShadow: visited ? `0 0 24px ${COLORS.green}` : 'none',
                }}
              >
                ★ 终点 TARGET
              </div>
            )}
          </div>
        );
      })}

      {/* Bouncing Yellow Ball with Squash & Stretch */}
      <div
        style={{
          position: 'absolute',
          left: ballX - ballRadius,
          top: ballY - ballRadius * 2,
          width: ballRadius * 2,
          height: ballRadius * 2,
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, #FFFBEB, ${COLORS.yellow} 60%, #CA8A04 100%)`,
          boxShadow: `0 0 36px ${COLORS.yellow}, 0 0 70px ${COLORS.yellow}88`,
          transformOrigin: '50% 100%',
          transform: `scale(${scaleX * ballAppear}, ${scaleY * ballAppear})`,
          zIndex: 10,
        }}
      />

      {/* Bottom Question Prompt */}
      <div
        style={{
          position: 'absolute',
          bottom: 72,
          left: 280,
          right: 280,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 36px',
          background: `${COLORS.bgCard}ee`,
          borderRadius: 20,
          border: `2px solid ${COLORS.yellow}66`,
          opacity: interpolate(frame, [95, 115], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          transform: `translateY(${interpolate(frame, [95, 115], [20, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}px)`,
        }}
      >
        <div style={{ fontSize: 30, fontWeight: 700, color: COLORS.textMain }}>
          思考：要跳到第 <span style={{ color: COLORS.yellow, fontFamily: FONT_MONO }}>n</span> 阶，最后一步只有两种可能：
        </div>
        <div style={{ display: 'flex', gap: 28, fontSize: 26, fontWeight: 700 }}>
          <span style={{ color: COLORS.cyan }}>① 从 n-1 跳 +1 阶</span>
          <span style={{ color: COLORS.pink }}>② 从 n-2 跳 +2 阶</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
