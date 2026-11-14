import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { AgentMascot } from '../components/AgentMascot';
import { BentoCard } from '../components/BentoCard';
import { HighlightSweep, RevealBox, StampSlam } from '../components/MotionEffects';
import { SectionHeader } from '../components/SectionHeader';
import { THEME } from '../theme';
import { getSubCueFrame, smoothT, TimelineSegment } from '../utils/anim';

interface SceneProps {
  segments: TimelineSegment[];
  sceneStartFrame: number;
  subCues?: Record<string, number>;
}

export const Scene05GrowthPlaybook: React.FC<SceneProps> = ({
  sceneStartFrame,
  subCues,
}) => {
  const frame = useCurrentFrame();

  const fLeftCard = getSubCueFrame(subCues, sceneStartFrame, 's05_left_card', 140);
  const fFlatLine = getSubCueFrame(subCues, sceneStartFrame, 's05_flat_line', 260);
  const fExpLine = getSubCueFrame(subCues, sceneStartFrame, 's05_exp_line', 340);
  const fKBadge = getSubCueFrame(subCues, sceneStartFrame, 's05_k_badge', 410);
  const fPill1 = getSubCueFrame(subCues, sceneStartFrame, 's05_pill_1', 480);
  const fPill2 = getSubCueFrame(subCues, sceneStartFrame, 's05_pill_2', 525);
  const fPill3 = getSubCueFrame(subCues, sceneStartFrame, 's05_pill_3', 575);

  const fRightCard = getSubCueFrame(subCues, sceneStartFrame, 's05_right_card', 670);
  const fCoreLock = getSubCueFrame(subCues, sceneStartFrame, 's05_core_lock', 830);
  const fAunt = getSubCueFrame(subCues, sceneStartFrame, 's05_aunt', 970);
  const fSisterFlip = getSubCueFrame(subCues, sceneStartFrame, 's05_sister_flip', 1030);
  const fFloor = getSubCueFrame(subCues, sceneStartFrame, 's05_floor_badge', 1100);

  const flatT = smoothT(frame, fFlatLine, 28);
  const expT = smoothT(frame, fExpLine, 42);

  // Traveling spark coordinates along cubic curve approximation
  const sparkX = interpolate(expT, [0, 1], [50, 620]);
  const sparkY =
    212 - Math.pow(expT, 2.2) * 186;

  return (
    <AbsoluteFill
      style={{
        padding: '116px 88px 176px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <SectionHeader
          eyebrow="STEP 04 · 新手起号实操复盘"
          title={
            <>
              宁可<span style={{ color: THEME.orange }}>少而精</span>，站在验证过的爆款上改写
            </>
          }
        />
        <AgentMascot
          size={92}
          delay={4}
          mood={frame >= fRightCard ? 'happy' : 'normal'}
          rightBadge={frame >= fRightCard ? '2条干货' : '实战建议'}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 32,
          alignItems: 'stretch',
          minHeight: 540,
        }}
      >
        {/* Left Card: arrives at "第一，宁可少而精" */}
        <div>
          <BentoCard
            delay={fLeftCard}
            variant="slideLeft"
            style={{
              height: '100%',
              padding: '28px 32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    backgroundColor: THEME.orange,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    fontWeight: 900,
                  }}
                >
                  1
                </span>
                <span style={{ fontSize: 28, fontWeight: 900, color: THEME.ink }}>
                  宁可少而精，不拿水货凑数
                </span>
              </div>
              <div style={{ fontSize: 19, color: THEME.inkSecondary, marginTop: 8 }}>
                盯着 100 粉凑数，不如死磕单篇爆款质量
              </div>
            </div>

            {/* Dual-Phase Curve Drawing */}
            <div
              style={{
                marginTop: 14,
                backgroundColor: '#FAF8F3',
                borderRadius: 20,
                padding: '18px 20px',
                border: `1.5px solid ${THEME.cardBorder}`,
                minHeight: 270,
              }}
            >
              <svg width="100%" height="240" viewBox="0 0 680 240">
                {[48, 105, 162, 215].map((y) => (
                  <line key={y} x1="40" y1={y} x2="640" y2={y} stroke="#E6E2D8" strokeDasharray="5 5" />
                ))}

                {frame >= fFlatLine ? (
                  <>
                    <path
                      d="M 50 208 Q 240 198, 420 188 T 620 176"
                      fill="none"
                      stroke="#9CA3AF"
                      strokeWidth="4"
                      strokeDasharray="600"
                      strokeDashoffset={interpolate(flatT, [0, 1], [600, 0])}
                    />
                    <text x="410" y="164" fill="#6B7280" fontSize="17" fontWeight="700" fontFamily={THEME.fontSans}>
                      低质凑数（难破圈）
                    </text>
                  </>
                ) : null}

                {frame >= fExpLine ? (
                  <>
                    <path
                      d="M 50 212 C 180 205, 310 190, 410 135 C 485 92, 550 48, 620 26"
                      fill="none"
                      stroke={THEME.orange}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray="680"
                      strokeDashoffset={interpolate(expT, [0, 1], [680, 0])}
                    />
                    <circle
                      cx={sparkX}
                      cy={sparkY}
                      r="9"
                      fill={THEME.orange}
                    />
                    <circle
                      cx={sparkX}
                      cy={sparkY}
                      r="17"
                      fill="none"
                      stroke={THEME.orange}
                      strokeWidth="2.5"
                      opacity="0.4"
                    />
                  </>
                ) : null}

                {frame >= fKBadge ? (
                  <g>
                    <rect x="220" y="14" width="298" height="38" rx="19" fill={THEME.orangeSoft} stroke={THEME.orange} strokeWidth="2" />
                    <text x="369" y="39" textAnchor="middle" fill={THEME.orange} fontSize="18" fontWeight="900" fontFamily={THEME.fontSans}>
                      ★ 精品爆款指数涨粉（一条涨上千）
                    </text>
                  </g>
                ) : null}
              </svg>
            </div>

            {/* 3 Staggered Pills */}
            <div style={{ display: 'flex', gap: 12, marginTop: 14, minHeight: 50 }}>
              {[
                { text: '✓ 内容垂直', at: fPill1 },
                { text: '✓ 规律更新', at: fPill2 },
                { text: '✓ 质量 > 数量', at: fPill3 },
              ].map((pill) => (
                <div key={pill.text} style={{ flex: 1 }}>
                  <RevealBox atFrame={pill.at} variant="zoomPop">
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '12px 10px',
                        borderRadius: 14,
                        backgroundColor: THEME.tealSoft,
                        border: `1.5px solid ${THEME.tealBorder}`,
                        fontSize: 19,
                        fontWeight: 800,
                        color: '#0F766E',
                      }}
                    >
                      {pill.text}
                    </div>
                  </RevealBox>
                </div>
              ))}
            </div>
          </BentoCard>
        </div>

        {/* Right Card: arrives ONLY at "第二，憋不出选题别硬憋" */}
        <div>
          <BentoCard
            delay={fRightCard}
            variant="slideRight"
            style={{
              height: '100%',
              padding: '28px 32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    backgroundColor: THEME.teal,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    fontWeight: 900,
                  }}
                >
                  2
                </span>
                <span style={{ fontSize: 28, fontWeight: 900, color: THEME.ink }}>
                  站在同赛道爆款肩膀上改写
                </span>
              </div>
              <div style={{ fontSize: 19, color: THEME.inkSecondary, marginTop: 8 }}>
                先从模仿成熟结构起步，微创新守住内容下限
              </div>
            </div>

            <div style={{ minHeight: 108 }}>
              <RevealBox atFrame={fCoreLock} variant="flipX">
                <div
                  style={{
                    backgroundColor: THEME.ink,
                    borderRadius: 20,
                    padding: '20px 26px',
                    color: '#FFFFFF',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 17, fontWeight: 700, color: '#9CA3AF' }}>
                      🔒 保留不可动摇的底座
                    </span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: THEME.teal }}>
                      市场已验证
                    </span>
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 900, marginTop: 8 }}>
                    核心情绪冲突（内核完全保留）
                  </div>
                </div>
              </RevealBox>
            </div>

            {/* Perspective 3D Flip Demo */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                gap: 14,
                alignItems: 'center',
                minHeight: 106,
              }}
            >
              <div>
                <RevealBox atFrame={fAunt} variant="slideLeft">
                  <div
                    style={{
                      backgroundColor: '#FAF8F3',
                      border: `1.5px solid ${THEME.cardBorder}`,
                      borderRadius: 18,
                      padding: '18px 20px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 16, fontWeight: 700, color: THEME.inkMuted }}>
                      原爆款视角
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: THEME.inkSecondary, marginTop: 6 }}>
                      「小姨」的故事
                    </div>
                  </div>
                </RevealBox>
              </div>

              {frame >= fSisterFlip ? (
                <RevealBox atFrame={fSisterFlip} variant="zoomPop">
                  <div style={{ fontSize: 30, fontWeight: 900, color: THEME.orange }}>→</div>
                </RevealBox>
              ) : (
                <div style={{ width: 28 }} />
              )}

              <div>
                <RevealBox atFrame={fSisterFlip} variant="flipX">
                  <div
                    style={{
                      backgroundColor: THEME.orangeSoft,
                      border: `2px solid ${THEME.orange}`,
                      borderRadius: 18,
                      padding: '18px 20px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 16, fontWeight: 800, color: THEME.orange }}>
                      换视角 + 改细节
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: THEME.ink, marginTop: 6 }}>
                      「姐姐 / 妹妹」视角
                    </div>
                  </div>
                </RevealBox>
              </div>
            </div>

            <div style={{ minHeight: 54 }}>
              <RevealBox atFrame={fFloor} variant="slideUp">
                <div
                  style={{
                    padding: '14px 20px',
                    borderRadius: 14,
                    backgroundColor: '#FAF8F3',
                    border: `1.5px solid ${THEME.cardBorder}`,
                    fontSize: 19,
                    fontWeight: 800,
                    color: THEME.ink,
                    textAlign: 'center',
                  }}
                >
                  不一定超原爆款，但
                  <HighlightSweep atFrame={fFloor + 6}>
                    <span style={{ color: THEME.orange }}>内容下限绝对不会差</span>
                  </HighlightSweep>
                </div>
              </RevealBox>
            </div>
          </BentoCard>
        </div>
      </div>
    </AbsoluteFill>
  );
};
