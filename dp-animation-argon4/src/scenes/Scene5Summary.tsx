import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONT_MONO, FONT_SANS } from '../theme';

const CARDS = [
  {
    step: 'STEP 01',
    title: '定义状态',
    accent: COLORS.yellow,
    code: 'dp[i]',
    desc: '明确 dp[i] 代表什么含义',
    detail: '例：爬到第 i 阶楼梯的方法总数',
    delay: 14,
  },
  {
    step: 'STEP 02',
    title: '状态转移',
    accent: COLORS.cyan,
    secondaryAccent: COLORS.pink,
    code: 'dp[i] = dp[i-1] + dp[i-2]',
    desc: '找到当前状态与前序状态的关系',
    detail: '由 i-1 走 1 阶 + 由 i-2 走 2 阶',
    delay: 42,
  },
  {
    step: 'STEP 03',
    title: '初始值 + 填表',
    accent: COLORS.green,
    code: 'dp[0]=1, dp[1]=1 → 递推',
    desc: '确定边界条件，自底向上依次填表',
    detail: '时间复杂度从 O(2ⁿ) 降为 O(n)！',
    delay: 70,
  },
];

export const Scene5Summary: React.FC = () => {
  const frame = useCurrentFrame(); // 0..135 (4.5s)
  const { fps } = useVideoConfig();

  const enterOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const exitOpacity = interpolate(frame, [122, 135], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const headerPop = spring({
    frame: frame - 2,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  return (
    <AbsoluteFill
      style={{
        opacity: enterOpacity * exitOpacity,
        fontFamily: FONT_SANS,
        padding: '60px 100px',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `translateY(${interpolate(headerPop, [0, 1], [-24, 0])}px)`,
          opacity: headerPop,
        }}
      >
        <div
          style={{
            padding: '8px 24px',
            borderRadius: 999,
            background: `${COLORS.green}22`,
            border: `2px solid ${COLORS.green}`,
            color: COLORS.green,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 3,
          }}
        >
          SUMMARY · 核心套路总结
        </div>
        <div
          style={{
            fontSize: 68,
            fontWeight: 900,
            color: COLORS.textMain,
            marginTop: 14,
          }}
        >
          动态规划 · <span style={{ color: COLORS.yellow }}>三步走法则</span>
        </div>
      </div>

      {/* Three Cards Row with Arrows */}
      <div
        style={{
          marginTop: 58,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        {CARDS.map((card, idx) => {
          const cardPop = spring({
            frame: frame - card.delay,
            fps,
            config: { damping: 11, stiffness: 160, mass: 0.85 },
          });

          const arrowPop = spring({
            frame: frame - (card.delay + 16),
            fps,
            config: { damping: 12, stiffness: 160 },
          });

          return (
            <React.Fragment key={idx}>
              <div
                style={{
                  flex: 1,
                  height: 560,
                  borderRadius: 32,
                  background: `linear-gradient(180deg, ${card.accent}1f 0%, ${COLORS.bgCard} 45%, ${COLORS.bgPanel} 100%)`,
                  border: `3.5px solid ${card.accent}`,
                  boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 36px ${card.accent}44`,
                  padding: '42px 36px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transform: `scale(${interpolate(cardPop, [0, 1], [0.6, 1])}) translateY(${interpolate(cardPop, [0, 1], [50, 0])}px)`,
                  opacity: interpolate(cardPop, [0, 0.3, 1], [0, 1, 1]),
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '8px 20px',
                      borderRadius: 12,
                      background: card.accent,
                      color: COLORS.bgDeep,
                      fontFamily: FONT_MONO,
                      fontSize: 22,
                      fontWeight: 900,
                    }}
                  >
                    {card.step}
                  </div>

                  <div
                    style={{
                      fontSize: 52,
                      fontWeight: 900,
                      color: COLORS.textMain,
                      marginTop: 26,
                    }}
                  >
                    {card.title}
                  </div>

                  <div
                    style={{
                      fontSize: 26,
                      color: COLORS.textMuted,
                      marginTop: 14,
                      lineHeight: 1.4,
                      fontWeight: 500,
                    }}
                  >
                    {card.desc}
                  </div>
                </div>

                {/* Formula / Code Highlight Box */}
                <div
                  style={{
                    padding: '24px 20px',
                    borderRadius: 20,
                    background: COLORS.bgDeep,
                    border: `2px solid ${card.accent}88`,
                    fontFamily: FONT_MONO,
                    fontSize: idx === 1 ? 27 : 30,
                    fontWeight: 800,
                    textAlign: 'center',
                    color: card.accent,
                    boxShadow: `inset 0 0 20px ${card.accent}22`,
                  }}
                >
                  {idx === 1 ? (
                    <>
                      <span style={{ color: COLORS.yellow }}>dp[i]</span>
                      <span style={{ color: COLORS.textMuted }}> = </span>
                      <span style={{ color: COLORS.cyan }}>dp[i-1]</span>
                      <span style={{ color: COLORS.textMuted }}> + </span>
                      <span style={{ color: COLORS.pink }}>dp[i-2]</span>
                    </>
                  ) : (
                    card.code
                  )}
                </div>

                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: card.accent,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <span>✦</span>
                  <span>{card.detail}</span>
                </div>
              </div>

              {/* Arrow between cards */}
              {idx < 2 && (
                <div
                  style={{
                    fontSize: 54,
                    fontWeight: 900,
                    color: COLORS.textMain,
                    transform: `scale(${arrowPop})`,
                    opacity: arrowPop,
                    textShadow: `0 0 20px ${card.accent}`,
                  }}
                >
                  →
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
