import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { BentoCard } from '../components/BentoCard';
import { RevealBox, StampSlam } from '../components/MotionEffects';
import { SectionHeader } from '../components/SectionHeader';
import { THEME } from '../theme';
import { getSubCueFrame, smoothT, TimelineSegment } from '../utils/anim';

interface SceneProps {
  segments: TimelineSegment[];
  sceneStartFrame: number;
  subCues?: Record<string, number>;
}

const CASES = [
  {
    slotLabel: '作品 #01（总长 65s）',
    title: '《跟父亲跑长途的那七天》',
    tag: '未开分成计划',
    viewsNum: 3.0,
    completion: 25.59,
    avgSec: 49.53,
    likes: 354,
    hearts: 127,
    shares: 166,
    comments: 46,
    followers: 48,
    flipKey: 's04_c1_flip',
    viewsKey: 's04_c1_views',
    compKey: 's04_c1_comp',
    commKey: 's04_c1_comm',
    fallbackBase: 170,
  },
  {
    slotLabel: '作品 #02（总长 65s）',
    title: '《师恩照亮我一生》',
    tag: '未开分成计划',
    viewsNum: 3.2,
    completion: 34.26,
    avgSec: 59.43,
    likes: 895,
    hearts: 453,
    shares: 81,
    comments: 169,
    followers: 47,
    flipKey: 's04_c2_flip',
    viewsKey: 's04_c2_views',
    compKey: 's04_c2_comp',
    likesKey: 's04_c2_likes',
    commKey: 's04_c2_comm',
    fallbackBase: 480,
    badgeNote: '赞/心心翻倍',
  },
  {
    slotLabel: '作品 #03（总长 65s）',
    title: '《等不来的道歉》',
    tag: '全程参与分成 · ¥3.93',
    viewsNum: 5.9,
    completion: 38.11,
    avgSec: 64.07,
    likes: 847,
    hearts: 248,
    shares: 114,
    comments: 503,
    followers: 75,
    flipKey: 's04_c3_flip',
    viewsKey: 's04_c3_views',
    compKey: 's04_c3_comp',
    commKey: 's04_c3_comm',
    fallbackBase: 860,
    isWinner: true,
    badgeNote: '完播 & 评论双爆',
  },
];

export const Scene04DataBattle: React.FC<SceneProps> = ({
  sceneStartFrame,
  subCues,
}) => {
  const frame = useCurrentFrame();

  const fSlots = getSubCueFrame(subCues, sceneStartFrame, 's04_slots', 30);
  const fDimC1 = getSubCueFrame(subCues, sceneStartFrame, 's04_dim_c1', 1200);
  const fDouble = getSubCueFrame(subCues, sceneStartFrame, 's04_double_badge', 1320);
  const fPulseComp = getSubCueFrame(subCues, sceneStartFrame, 's04_pulse_comp', 1420);
  const fPulseComm = getSubCueFrame(subCues, sceneStartFrame, 's04_pulse_comm', 1510);
  const fEmo = getSubCueFrame(subCues, sceneStartFrame, 's04_f_emo', 1640);
  const fKnow = getSubCueFrame(subCues, sceneStartFrame, 's04_f_know', 1730);

  const pulseAlpha = 0.5 + 0.5 * Math.sin(frame / 6);

  return (
    <AbsoluteFill
      style={{
        padding: '116px 88px 176px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <SectionHeader
        eyebrow="STEP 03 · 三条 65 秒小爆款真实后台横评"
        title={
          <>
            点赞最高不一定最爆，<span style={{ color: THEME.orange }}>完播 + 评论</span>决定扩流
          </>
        }
      />

      {/* 3 Video Comparison Cards (each strictly waits for its spoken beat!) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 28,
          minHeight: 446,
        }}
      >
        {CASES.map((item, idx) => {
          const flipAt = getSubCueFrame(subCues, sceneStartFrame, item.flipKey, item.fallbackBase);
          const viewsAt = getSubCueFrame(subCues, sceneStartFrame, item.viewsKey, flipAt + 40);
          const compAt = getSubCueFrame(subCues, sceneStartFrame, item.compKey, flipAt + 80);
          const commAt = getSubCueFrame(subCues, sceneStartFrame, item.commKey, flipAt + 140);
          const likesAt = item.likesKey
            ? getSubCueFrame(subCues, sceneStartFrame, item.likesKey, flipAt + 110)
            : commAt;

          const isCardVisible = frame >= flipAt;
          const isDimmed = idx === 0 && frame >= fDimC1;

          const viewsT = smoothT(frame, viewsAt, 22);
          const compT = smoothT(frame, compAt, 26);
          const commT = smoothT(frame, commAt, 26);

          const compWidth = interpolate(compT, [0, 1], [0, item.completion]);
          const commentWidth = interpolate(commT, [0, 1], [0, (item.comments / 520) * 100]);

          const highlightComp = item.isWinner && frame >= fPulseComp;
          const highlightComm = item.isWinner && frame >= fPulseComm;

          if (!isCardVisible) {
            return (
              <div key={item.title} style={{ height: '100%' }}>
                {frame >= fSlots ? (
                  <RevealBox atFrame={fSlots + idx * 6} variant="zoomPop" style={{ height: '100%' }}>
                    <div
                      style={{
                        height: '100%',
                        borderRadius: 26,
                        border: `2px dashed ${THEME.cardBorder}`,
                        backgroundColor: 'rgba(255,255,255,0.45)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: THEME.inkMuted,
                        fontSize: 21,
                        fontWeight: 800,
                      }}
                    >
                      {item.slotLabel}
                    </div>
                  </RevealBox>
                ) : null}
              </div>
            );
          }

          return (
            <div
              key={item.title}
              style={{
                opacity: isDimmed ? 0.36 : 1,
                transition: 'opacity 0.35s ease',
              }}
            >
              <BentoCard
                delay={flipAt}
                variant="flipY"
                accent={item.isWinner ? 'orange' : 'none'}
                style={{
                  height: '100%',
                  padding: '24px 28px',
                  backgroundColor: item.isWinner ? '#FFF9F6' : '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: item.isWinner ? '#FFFFFF' : THEME.inkSecondary,
                        backgroundColor: item.isWinner ? THEME.orange : '#EFECE3',
                        padding: '5px 12px',
                        borderRadius: 999,
                      }}
                    >
                      {item.tag}
                    </span>

                    {item.badgeNote && frame >= (idx === 1 ? likesAt : commAt) ? (
                      <RevealBox atFrame={idx === 1 ? likesAt : commAt} variant="zoomPop">
                        <span
                          style={{
                            fontSize: 15,
                            fontWeight: 800,
                            color: item.isWinner ? THEME.orange : THEME.teal,
                          }}
                        >
                          ★ {item.badgeNote}
                        </span>
                      </RevealBox>
                    ) : null}
                  </div>

                  <div style={{ fontSize: 25, fontWeight: 900, color: THEME.ink, marginTop: 14 }}>
                    {item.title}
                  </div>
                </div>

                {/* Views Counter */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, minHeight: 54 }}>
                  <RevealBox atFrame={viewsAt} variant="zoomPop">
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                      <span
                        style={{
                          fontSize: 48,
                          fontWeight: 900,
                          color: item.isWinner ? THEME.orange : THEME.ink,
                          lineHeight: 1,
                        }}
                      >
                        {(viewsT * item.viewsNum).toFixed(1)} 万
                      </span>
                      <span style={{ fontSize: 18, fontWeight: 700, color: THEME.inkMuted }}>
                        播放
                      </span>
                      {item.isWinner && frame >= fDouble ? (
                        <StampSlam atFrame={fDouble}>
                          <span
                            style={{
                              fontSize: 15,
                              fontWeight: 900,
                              color: '#FFFFFF',
                              backgroundColor: THEME.orange,
                              padding: '4px 10px',
                              borderRadius: 8,
                            }}
                          >
                            ≈ 2倍爆量
                          </span>
                        </StampSlam>
                      ) : null}
                    </div>
                  </RevealBox>
                </div>

                {/* Completion Bar */}
                <div
                  style={{
                    padding: highlightComp ? '8px 10px' : '0px',
                    borderRadius: 12,
                    backgroundColor: highlightComp ? `rgba(255, 90, 31, ${0.08 + pulseAlpha * 0.08})` : 'transparent',
                    border: highlightComp ? `1.5px solid ${THEME.orange}` : '1.5px solid transparent',
                  }}
                >
                  {frame >= compAt ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 800, marginBottom: 6 }}>
                        <span style={{ color: THEME.inkSecondary }}>完播率</span>
                        <span style={{ color: item.isWinner ? THEME.orange : THEME.ink }}>
                          {item.completion}% · 均看 {item.avgSec}s
                        </span>
                      </div>
                      <div style={{ height: 14, borderRadius: 999, backgroundColor: '#EFECE3', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${compWidth * 2.2}%`,
                            height: '100%',
                            borderRadius: 999,
                            backgroundColor: item.isWinner ? THEME.orange : THEME.teal,
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <div style={{ height: 42 }} />
                  )}
                </div>

                {/* Comments Bar */}
                <div
                  style={{
                    padding: highlightComm ? '8px 10px' : '0px',
                    borderRadius: 12,
                    backgroundColor: highlightComm ? `rgba(255, 90, 31, ${0.08 + pulseAlpha * 0.08})` : 'transparent',
                    border: highlightComm ? `1.5px solid ${THEME.orange}` : '1.5px solid transparent',
                  }}
                >
                  {frame >= commAt ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 800, marginBottom: 6 }}>
                        <span style={{ color: THEME.inkSecondary }}>评论数 · 涨粉 +{item.followers}</span>
                        <span style={{ color: item.isWinner ? THEME.orange : THEME.ink }}>
                          {Math.round(commT * item.comments)} 条
                        </span>
                      </div>
                      <div style={{ height: 14, borderRadius: 999, backgroundColor: '#EFECE3', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${commentWidth}%`,
                            height: '100%',
                            borderRadius: 999,
                            backgroundColor: item.isWinner ? THEME.orange : '#64748B',
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <div style={{ height: 42 }} />
                  )}
                </div>

                {/* Mini Stats Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 10,
                    paddingTop: 10,
                    borderTop: `1.5px solid ${THEME.cardBorder}`,
                    fontSize: 16,
                    fontWeight: 700,
                    color: THEME.inkSecondary,
                    minHeight: 34,
                  }}
                >
                  {frame >= Math.min(likesAt, commAt) ? (
                    <>
                      <div style={{ color: idx === 1 ? THEME.teal : undefined, fontWeight: idx === 1 ? 900 : 700 }}>
                        👍 赞 {item.likes}
                      </div>
                      <div style={{ color: idx === 1 ? THEME.teal : undefined, fontWeight: idx === 1 ? 900 : 700 }}>
                        ❤️ 心 {item.hearts}
                      </div>
                      <div>↗️ 享 {item.shares}</div>
                    </>
                  ) : null}
                </div>
              </BentoCard>
            </div>
          );
        })}
      </div>

      {/* Bottom Dual Track Formula — arrives strictly when spoken */}
      <div style={{ minHeight: 84 }}>
        <BentoCard
          delay={fEmo}
          variant="slideUp"
          accent="dark"
          style={{
            padding: '20px 30px',
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: 28,
            alignItems: 'center',
          }}
        >
          <RevealBox atFrame={fEmo} variant="slideLeft">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span
                style={{
                  padding: '8px 16px',
                  borderRadius: 12,
                  backgroundColor: THEME.orange,
                  color: '#FFFFFF',
                  fontSize: 19,
                  fontWeight: 900,
                  whiteSpace: 'nowrap',
                }}
              >
                情感故事赛道
              </span>
              <span style={{ fontSize: 21, fontWeight: 700, color: '#F3F4F6' }}>
                必须调动情绪共鸣（引发倾诉欲）
              </span>
            </div>
          </RevealBox>

          <div style={{ width: 2, height: 36, backgroundColor: '#374151' }} />

          <RevealBox atFrame={fKnow} variant="slideRight">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span
                style={{
                  padding: '8px 16px',
                  borderRadius: 12,
                  backgroundColor: THEME.teal,
                  color: '#FFFFFF',
                  fontSize: 19,
                  fontWeight: 900,
                  whiteSpace: 'nowrap',
                }}
              >
                知识技能赛道
              </span>
              <span style={{ fontSize: 21, fontWeight: 700, color: '#F3F4F6' }}>
                必须提供实用价值（省时间 / 少踩坑）
              </span>
            </div>
          </RevealBox>
        </BentoCard>
      </div>
    </AbsoluteFill>
  );
};
