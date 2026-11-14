import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { AgentMascot } from '../components/AgentMascot';
import { BentoCard } from '../components/BentoCard';
import { HighlightSweep, RevealBox, StampSlam } from '../components/MotionEffects';
import { SectionHeader } from '../components/SectionHeader';
import { THEME } from '../theme';
import { getSubCueFrame, popSpring, TimelineSegment } from '../utils/anim';

interface SceneProps {
  segments: TimelineSegment[];
  sceneStartFrame: number;
  subCues?: Record<string, number>;
}

export const Scene06RoiAndPivot: React.FC<SceneProps> = ({
  sceneStartFrame,
  subCues,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fPrePlan = getSubCueFrame(subCues, sceneStartFrame, 's06_pre_plan', 80);
  const fFullPlan = getSubCueFrame(subCues, sceneStartFrame, 's06_full_plan', 150);

  const fRevCard = getSubCueFrame(subCues, sceneStartFrame, 's06_rev_card', 270);
  const fRev393 = getSubCueFrame(subCues, sceneStartFrame, 's06_rev_393', 360);
  const fRev504 = getSubCueFrame(subCues, sceneStartFrame, 's06_rev_504', 470);

  const fCostCard = getSubCueFrame(subCues, sceneStartFrame, 's06_cost_card', 580);
  const fDeficit = getSubCueFrame(subCues, sceneStartFrame, 's06_deficit_stamp', 700);

  const fCrowd = getSubCueFrame(subCues, sceneStartFrame, 's06_crowd_card', 870);
  const fOtherRev = getSubCueFrame(subCues, sceneStartFrame, 's06_other_rev', 960);
  const fRoiHl = getSubCueFrame(subCues, sceneStartFrame, 's06_roi_hl', 1140);

  const fTuition = getSubCueFrame(subCues, sceneStartFrame, 's06_tuition', 1320);
  const fPivot = getSubCueFrame(subCues, sceneStartFrame, 's06_pivot_card', 1420);
  const fMetaTag = getSubCueFrame(subCues, sceneStartFrame, 's06_meta_tag', 1530);
  const fCta = getSubCueFrame(subCues, sceneStartFrame, 's06_cta_box', 1650);

  // Balance scale tilt angle: 0deg initially, tilts heavily left (-11deg) when cost vs revenue deficit hits!
  const tiltP = frame >= fDeficit ? popSpring(frame, fps, fDeficit) : 0;
  const beamAngle = interpolate(tiltP, [0, 1], [0, -11]);

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
          eyebrow="STEP 05 · 算清成本账，再决定长期赛道"
          title={
            <>
              5.9 万播放赚 <span style={{ color: THEME.orange }}>¥3.93</span>，为什么我准备转型？
            </>
          }
        />

        {/* Plan timeline tags */}
        <div style={{ display: 'flex', gap: 10 }}>
          <RevealBox atFrame={fPrePlan} variant="zoomPop">
            <span style={{ padding: '8px 14px', borderRadius: 999, backgroundColor: '#EFECE3', color: THEME.inkSecondary, fontSize: 16, fontWeight: 800 }}>
              长途 / 师恩：未开分成
            </span>
          </RevealBox>
          <RevealBox atFrame={fFullPlan} variant="zoomPop">
            <span style={{ padding: '8px 14px', borderRadius: 999, backgroundColor: THEME.orangeSoft, border: `1.5px solid ${THEME.orange}`, color: THEME.orange, fontSize: 16, fontWeight: 800 }}>
              道歉：全程参与分成
            </span>
          </RevealBox>
        </div>
      </div>

      {/* Top ROI Balance Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 220px 1.15fr',
          gap: 20,
          alignItems: 'center',
          minHeight: 204,
        }}
      >
        <div>
          <BentoCard delay={fCostCard} variant="slideLeft" style={{ padding: '24px 28px' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: THEME.inkMuted }}>
              单条图文真实投入
            </div>
            <div style={{ fontSize: 44, fontWeight: 900, color: THEME.ink, marginTop: 8 }}>
              1~2 小时 + <span style={{ color: THEME.danger }}>¥5 成本</span>
            </div>
            <div style={{ fontSize: 17, fontWeight: 600, color: THEME.inkSecondary, marginTop: 8 }}>
              23 条累计约 35 小时 · 制作费用约 ¥115
            </div>
          </BentoCard>
        </div>

        {/* Center Tilt Scale + Mascot */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <AgentMascot
            size={104}
            delay={4}
            mood={frame >= fPivot ? 'happy' : frame >= fDeficit ? 'shock' : 'thinking'}
          />
          {frame >= fRevCard ? (
            <svg width="170" height="44" viewBox="0 0 170 44">
              <polygon points="85,18 75,38 95,38" fill={THEME.ink} />
              <g transform={`rotate(${beamAngle} 85 18)`}>
                <rect x="15" y="14" width="140" height="6" rx="3" fill={THEME.orange} />
                <circle cx="22" cy="17" r="7" fill={THEME.danger} />
                <circle cx="148" cy="17" r="7" fill={THEME.teal} />
              </g>
            </svg>
          ) : null}
        </div>

        <div>
          <BentoCard
            delay={fRevCard}
            variant="slideRight"
            accent="orange"
            style={{ padding: '24px 28px', backgroundColor: '#FFF9F6' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 32 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: THEME.orange }}>
                全程分成实得回报
              </span>
              {frame >= fDeficit ? (
                <StampSlam atFrame={fDeficit} ringColor={THEME.danger}>
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 900,
                      color: '#FFFFFF',
                      backgroundColor: THEME.danger,
                      padding: '5px 12px',
                      borderRadius: 999,
                    }}
                  >
                    尚未打平 ¥5 成本！
                  </span>
                </StampSlam>
              ) : null}
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 26, marginTop: 10, minHeight: 54 }}>
              <RevealBox atFrame={fRev393} variant="zoomPop">
                <div>
                  <span style={{ fontSize: 44, fontWeight: 900, color: THEME.orange }}>¥3.93</span>
                  <span style={{ fontSize: 17, fontWeight: 700, color: THEME.inkSecondary, marginLeft: 8 }}>
                    单条(5.9w)
                  </span>
                </div>
              </RevealBox>
              <RevealBox atFrame={fRev504} variant="zoomPop">
                <div>
                  <span style={{ fontSize: 44, fontWeight: 900, color: THEME.ink }}>¥5.04</span>
                  <span style={{ fontSize: 17, fontWeight: 700, color: THEME.inkSecondary, marginLeft: 8 }}>
                    半月总计(158,921播)
                  </span>
                </div>
              </RevealBox>
            </div>
          </BentoCard>
        </div>
      </div>

      {/* Bottom Reflection & Meta Pivot Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '0.95fr 1.25fr',
          gap: 28,
          minHeight: 220,
        }}
      >
        <div>
          <BentoCard
            delay={fCrowd}
            variant="flipX"
            style={{
              height: '100%',
              padding: '22px 26px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: THEME.ink }}>
                  自媒体内卷现状与清醒提醒
                </span>
                <span style={{ fontSize: 15, fontWeight: 800, color: THEME.inkMuted }}>
                  账号仿佛比人多
                </span>
              </div>
              <div style={{ fontSize: 18, color: THEME.inkSecondary, marginTop: 10, lineHeight: 1.55 }}>
                大号后期虽有{' '}
                <RevealBox atFrame={fOtherRev} variant="zoomPop" style={{ display: 'inline-block' }}>
                  <span style={{ fontWeight: 800, color: THEME.teal }}>接广 / 带货等变现</span>
                </RevealBox>
                ，但入场前必算清：
                <HighlightSweep atFrame={fRoiHl}>
                  <strong style={{ color: THEME.ink }}>投入产出比能否长期熬下去？</strong>
                </HighlightSweep>
              </div>
            </div>

            {frame >= fTuition ? (
              <RevealBox atFrame={fTuition} variant="slideUp">
                <div
                  style={{
                    marginTop: 12,
                    padding: '10px 14px',
                    borderRadius: 12,
                    backgroundColor: '#FAF8F3',
                    fontSize: 17,
                    fontWeight: 700,
                    color: THEME.inkSecondary,
                  }}
                >
                  ✓ 这半个月，相当于用极低成本交了一笔真实网感学费
                </div>
              </RevealBox>
            ) : null}
          </BentoCard>
        </div>

        <div>
          <BentoCard
            delay={fPivot}
            variant="flipY"
            accent="dark"
            style={{
              height: '100%',
              padding: '22px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#9CA3AF' }}>
                下一步方向切换
              </span>
              <RevealBox atFrame={fMetaTag} variant="zoomPop">
                <span style={{ fontSize: 16, fontWeight: 800, color: '#5EEAD4' }}>
                  ✨ 就像你现在看到的这条视频一样
                </span>
              </RevealBox>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 10 }}>
              <div style={{ padding: '12px 18px', borderRadius: 14, backgroundColor: '#2B313C', fontSize: 20, fontWeight: 700, color: '#D1D5DB' }}>
                AI 图文故事（跑通网感）
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: THEME.orange }}>→</div>
              <RevealBox atFrame={fPivot + 10} variant="zoomPop">
                <div style={{ padding: '12px 20px', borderRadius: 14, backgroundColor: THEME.orange, fontSize: 21, fontWeight: 900, color: '#FFFFFF' }}>
                  知识分享动画（高价值赛道）
                </div>
              </RevealBox>
            </div>

            <div style={{ minHeight: 48, marginTop: 12 }}>
              <RevealBox atFrame={fCta} variant="slideUp">
                <div
                  style={{
                    padding: '12px 18px',
                    borderRadius: 14,
                    backgroundColor: 'rgba(255,255,255,0.09)',
                    fontSize: 19,
                    fontWeight: 800,
                    color: '#FBBF24',
                  }}
                >
                  💬 评论区聊聊：你最高分了多少？我下一步该死磕故事号还是转型知识动画？
                </div>
              </RevealBox>
            </div>
          </BentoCard>
        </div>
      </div>
    </AbsoluteFill>
  );
};
