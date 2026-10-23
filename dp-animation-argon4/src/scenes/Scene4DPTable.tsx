import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, DP_STEP_REL_FRAMES, DP_VALUES, FONT_MONO, FONT_SANS } from '../theme';

export const Scene4DPTable: React.FC = () => {
  const frame = useCurrentFrame(); // 0..285 (9.5s: 14.5s to 24s)
  const { fps } = useVideoConfig();

  const enterOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const exitOpacity = interpolate(frame, [270, 285], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Determine which step i (0..7) is currently active
  let activeIndex = -1;
  for (let i = 0; i < DP_STEP_REL_FRAMES.length; i++) {
    if (frame >= DP_STEP_REL_FRAMES[i]) {
      activeIndex = i;
    }
  }

  const allCompleted = frame >= DP_STEP_REL_FRAMES[7] + 24;

  // Table geometry
  const cellWidth = 176;
  const cellGap = 22;
  const totalWidth = 8 * cellWidth + 7 * cellGap;
  const startX = (1920 - totalWidth) / 2;
  const cellY = 460;
  const cellHeight = 190;

  const getCellCenterX = (idx: number) => startX + idx * (cellWidth + cellGap) + cellWidth / 2;

  return (
    <AbsoluteFill
      style={{
        opacity: enterOpacity * exitOpacity,
        fontFamily: FONT_SANS,
      }}
    >
      {/* Top Header & State Transition Equation */}
      <div
        style={{
          position: 'absolute',
          top: 52,
          left: 100,
          right: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ color: COLORS.cyan, fontSize: 24, fontWeight: 700, letterSpacing: 2 }}>
            SCENE 03 · 动态规划：自底向上填表
          </div>
          <div style={{ color: COLORS.textMain, fontSize: 54, fontWeight: 900, marginTop: 6 }}>
            把算过的结果存进数组，只算一次！
          </div>
        </div>

        {/* Formula Box */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '16px 32px',
            borderRadius: 20,
            background: COLORS.bgCard,
            border: `2px solid ${COLORS.border}`,
            fontFamily: FONT_MONO,
            fontSize: 36,
            fontWeight: 800,
          }}
        >
          <span style={{ color: COLORS.yellow }}>dp[i]</span>
          <span style={{ color: COLORS.textMuted }}>=</span>
          <span style={{ color: COLORS.cyan }}>dp[i-1]</span>
          <span style={{ color: COLORS.textMuted }}>+</span>
          <span style={{ color: COLORS.pink }}>dp[i-2]</span>
        </div>
      </div>

      {/* Curved Colored Arrows for current transition i >= 2 */}
      {activeIndex >= 2 && (
        <svg
          width={1920}
          height={1080}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 8 }}
        >
          <defs>
            <marker
              id="arrow-cyan"
              markerWidth="10"
              markerHeight="10"
              refX="7"
              refY="5"
              orient="auto"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill={COLORS.cyan} />
            </marker>
            <marker
              id="arrow-pink"
              markerWidth="10"
              markerHeight="10"
              refX="7"
              refY="5"
              orient="auto"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill={COLORS.pink} />
            </marker>
          </defs>

          {(() => {
            const stepStart = DP_STEP_REL_FRAMES[activeIndex];
            const arrowProgress = interpolate(frame - stepStart, [-8, 6], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });

            const xPrev1 = getCellCenterX(activeIndex - 1);
            const xPrev2 = getCellCenterX(activeIndex - 2);
            const xCurr = getCellCenterX(activeIndex);
            const topY = cellY - 12;

            // Arc from i-1 (Cyan)
            const ctrl1X = (xPrev1 + xCurr) / 2;
            const ctrl1Y = topY - 105;
            const path1 = `M ${xPrev1} ${topY} Q ${ctrl1X} ${ctrl1Y} ${xCurr - 14} ${topY}`;

            // Arc from i-2 (Pink)
            const ctrl2X = (xPrev2 + xCurr) / 2;
            const ctrl2Y = topY - 190;
            const path2 = `M ${xPrev2} ${topY} Q ${ctrl2X} ${ctrl2Y} ${xCurr + 14} ${topY}`;

            return (
              <g opacity={arrowProgress}>
                {/* Pink i-2 arrow */}
                <path
                  d={path2}
                  fill="none"
                  stroke={COLORS.pink}
                  strokeWidth={6}
                  markerEnd="url(#arrow-pink)"
                />
                <rect
                  x={ctrl2X - 58}
                  y={ctrl2Y - 22}
                  width={116}
                  height={38}
                  rx={10}
                  fill={COLORS.bgDeep}
                  stroke={COLORS.pink}
                  strokeWidth={2.5}
                />
                <text
                  x={ctrl2X}
                  y={ctrl2Y + 4}
                  textAnchor="middle"
                  fill={COLORS.pink}
                  fontFamily={FONT_MONO}
                  fontSize={20}
                  fontWeight={800}
                >
                  dp[i-2]
                </text>

                {/* Cyan i-1 arrow */}
                <path
                  d={path1}
                  fill="none"
                  stroke={COLORS.cyan}
                  strokeWidth={6}
                  markerEnd="url(#arrow-cyan)"
                />
                <rect
                  x={ctrl1X - 58}
                  y={ctrl1Y - 20}
                  width={116}
                  height={38}
                  rx={10}
                  fill={COLORS.bgDeep}
                  stroke={COLORS.cyan}
                  strokeWidth={2.5}
                />
                <text
                  x={ctrl1X}
                  y={ctrl1Y + 6}
                  textAnchor="middle"
                  fill={COLORS.cyan}
                  fontFamily={FONT_MONO}
                  fontSize={20}
                  fontWeight={800}
                >
                  dp[i-1]
                </text>
              </g>
            );
          })()}
        </svg>
      )}

      {/* 8 DP Table Cells */}
      {DP_VALUES.map((val, idx) => {
        const triggerFrame = DP_STEP_REL_FRAMES[idx];
        const isFilled = frame >= triggerFrame;
        const isCurrent = activeIndex === idx;
        const isPrev1 = activeIndex >= 2 && idx === activeIndex - 1;
        const isPrev2 = activeIndex >= 2 && idx === activeIndex - 2;

        // Role color coding: Yellow for current i, Cyan for i-1, Pink for i-2, Green when all done
        let borderColor = COLORS.border;
        let glowColor = 'transparent';
        let roleBadge: { text: string; color: string } | null = null;

        if (allCompleted && idx === 7) {
          borderColor = COLORS.green;
          glowColor = `${COLORS.green}88`;
          roleBadge = { text: '最终答案', color: COLORS.green };
        } else if (isCurrent) {
          borderColor = COLORS.yellow;
          glowColor = `${COLORS.yellow}88`;
          roleBadge = { text: idx < 2 ? '初始值' : '当前 i', color: COLORS.yellow };
        } else if (isPrev1) {
          borderColor = COLORS.cyan;
          glowColor = `${COLORS.cyan}66`;
          roleBadge = { text: 'i - 1', color: COLORS.cyan };
        } else if (isPrev2) {
          borderColor = COLORS.pink;
          glowColor = `${COLORS.pink}66`;
          roleBadge = { text: 'i - 2', color: COLORS.pink };
        } else if (isFilled) {
          borderColor = '#3B527E';
        }

        const popScale = isFilled
          ? spring({
              frame: frame - triggerFrame,
              fps,
              config: { damping: 10, stiffness: 200, mass: 0.7 },
            })
          : 1;

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: startX + idx * (cellWidth + cellGap),
              top: cellY,
              width: cellWidth,
              height: cellHeight,
              borderRadius: 24,
              background: isCurrent
                ? `linear-gradient(180deg, ${COLORS.yellow}26 0%, ${COLORS.bgCard} 100%)`
                : isPrev1
                  ? `linear-gradient(180deg, ${COLORS.cyan}26 0%, ${COLORS.bgCard} 100%)`
                  : isPrev2
                    ? `linear-gradient(180deg, ${COLORS.pink}26 0%, ${COLORS.bgCard} 100%)`
                    : COLORS.bgCard,
              border: `4px solid ${borderColor}`,
              boxShadow: `0 0 36px ${glowColor}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '18px 0',
              transform: `scale(${isCurrent ? 1.05 : 1})`,
            }}
          >
            {/* Role Tag on top of active cells */}
            {roleBadge && (
              <div
                style={{
                  position: 'absolute',
                  top: -20,
                  padding: '4px 16px',
                  borderRadius: 999,
                  background: roleBadge.color,
                  color: COLORS.bgDeep,
                  fontFamily: FONT_MONO,
                  fontSize: 18,
                  fontWeight: 900,
                  boxShadow: `0 0 16px ${roleBadge.color}`,
                }}
              >
                {roleBadge.text}
              </div>
            )}

            {/* Index header */}
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 24,
                fontWeight: 700,
                color: isCurrent
                  ? COLORS.yellow
                  : isPrev1
                    ? COLORS.cyan
                    : isPrev2
                      ? COLORS.pink
                      : COLORS.textMuted,
              }}
            >
              dp[{idx}]
            </div>

            {/* Number Value */}
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 68,
                fontWeight: 900,
                color: isFilled
                  ? allCompleted && idx === 7
                    ? COLORS.green
                    : isCurrent
                      ? COLORS.yellow
                      : isPrev1
                        ? COLORS.cyan
                        : isPrev2
                          ? COLORS.pink
                          : COLORS.textMain
                  : '#1E293B',
                transform: `scale(${isFilled ? popScale : 0.5})`,
                opacity: isFilled ? 1 : 0.25,
              }}
            >
              {isFilled ? val : '?'}
            </div>

            {/* Stair indicator */}
            <div style={{ fontSize: 18, color: COLORS.textMuted, fontWeight: 600 }}>
              第 {idx} 阶
            </div>
          </div>
        );
      })}

      {/* Synchronized Arithmetic Display below the table */}
      <div
        style={{
          position: 'absolute',
          bottom: 95,
          left: 160,
          right: 160,
          height: 150,
          borderRadius: 28,
          background: COLORS.bgCard,
          border: `3px solid ${allCompleted ? COLORS.green : COLORS.border}`,
          boxShadow: allCompleted ? `0 0 40px ${COLORS.green}55` : '0 10px 35px rgba(0,0,0,0.4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 48px',
        }}
      >
        {activeIndex < 0 ? (
          <div style={{ fontSize: 36, color: COLORS.textMuted, fontWeight: 700 }}>
            准备初始化 DP 表...
          </div>
        ) : activeIndex < 2 ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              fontFamily: FONT_MONO,
              fontSize: 44,
              fontWeight: 800,
            }}
          >
            <span
              style={{
                padding: '8px 20px',
                borderRadius: 12,
                background: `${COLORS.yellow}22`,
                color: COLORS.yellow,
                fontSize: 28,
                fontFamily: FONT_SANS,
              }}
            >
              边界初始值
            </span>
            <span style={{ color: COLORS.yellow }}>dp[{activeIndex}]</span>
            <span style={{ color: COLORS.textMuted }}>=</span>
            <span style={{ color: COLORS.textMain }}>{DP_VALUES[activeIndex]}</span>
            <span style={{ fontSize: 28, color: COLORS.textMuted, fontFamily: FONT_SANS }}>
              ({activeIndex === 0 ? '站在起点算 1 种' : '爬到第 1 阶只有 1 种'})
            </span>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              fontFamily: FONT_MONO,
              fontSize: 44,
              fontWeight: 900,
            }}
          >
            <span style={{ color: COLORS.yellow }}>dp[{activeIndex}]</span>
            <span style={{ color: COLORS.textMuted }}>=</span>
            <span style={{ color: COLORS.cyan }}>dp[{activeIndex - 1}]</span>
            <span style={{ color: COLORS.textMuted }}>+</span>
            <span style={{ color: COLORS.pink }}>dp[{activeIndex - 2}]</span>
            <span style={{ color: COLORS.textMuted }}>=</span>
            <span
              style={{
                padding: '6px 18px',
                borderRadius: 14,
                background: `${COLORS.cyan}22`,
                border: `2px solid ${COLORS.cyan}`,
                color: COLORS.cyan,
              }}
            >
              {DP_VALUES[activeIndex - 1]}
            </span>
            <span style={{ color: COLORS.textMuted }}>+</span>
            <span
              style={{
                padding: '6px 18px',
                borderRadius: 14,
                background: `${COLORS.pink}22`,
                border: `2px solid ${COLORS.pink}`,
                color: COLORS.pink,
              }}
            >
              {DP_VALUES[activeIndex - 2]}
            </span>
            <span style={{ color: COLORS.textMuted }}>=</span>
            <span
              style={{
                padding: '6px 24px',
                borderRadius: 14,
                background: allCompleted ? COLORS.green : COLORS.yellow,
                color: COLORS.bgDeep,
                boxShadow: `0 0 24px ${allCompleted ? COLORS.green : COLORS.yellow}`,
              }}
            >
              {DP_VALUES[activeIndex]}
            </span>
          </div>
        )}

        {/* Speed / Complexity Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '14px 28px',
            borderRadius: 18,
            background: allCompleted ? COLORS.green : '#1E293B',
            color: allCompleted ? COLORS.bgDeep : COLORS.green,
            border: `2px solid ${COLORS.green}`,
            fontFamily: FONT_MONO,
            fontSize: 32,
            fontWeight: 900,
            boxShadow: allCompleted ? `0 0 30px ${COLORS.green}` : 'none',
          }}
        >
          {allCompleted ? '✓ 填表完成 · O(n)' : `⚡ 递推加速中 (${activeIndex + 1}/8)`}
        </div>
      </div>
    </AbsoluteFill>
  );
};
