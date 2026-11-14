import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { AgentMascot } from '../components/AgentMascot';
import { BentoCard } from '../components/BentoCard';
import { RevealBox, StampSlam } from '../components/MotionEffects';
import { SectionHeader } from '../components/SectionHeader';
import { THEME } from '../theme';
import { getCueStartFrame, getSubCueFrame, popSpring, TimelineSegment } from '../utils/anim';

interface SceneProps {
  segments: TimelineSegment[];
  sceneStartFrame: number;
  subCues?: Record<string, number>;
}

const FUNNEL_STEPS = [
  { num: '01', title: '基础冷启动池', desc: '发 23 条几乎都能上 1,000 播放', cueKey: 's03_step1' },
  { num: '02', title: '过 500 推流门槛', desc: '触发官方继续加推下一流量池', cueKey: 's03_step2' },
  { num: '03', title: '阶梯式往外推', desc: '层层破圈放大曝光量', cueKey: 's03_step3' },
  { num: '04', title: '评论区广告变现', desc: '观众看评论 → 广告曝光与点击分成', cueKey: 's03_step4', highlight: true },
];

export const Scene03TrafficMechanism: React.FC<SceneProps> = ({
  segments,
  sceneStartFrame,
  subCues,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fFunnelStart = getCueStartFrame(segments, sceneStartFrame, 'funnel_500', 550);

  const fMainPlat = getSubCueFrame(subCues, sceneStartFrame, 's03_main_plat', 10);
  const fSyncPlats = getSubCueFrame(subCues, sceneStartFrame, 's03_sync_plats', 80);
  const f100Fans = getSubCueFrame(subCues, sceneStartFrame, 's03_100fans', 150);
  const fMythStamp = getSubCueFrame(subCues, sceneStartFrame, 's03_myth_stamp', 270);
  const fCommentBox = getSubCueFrame(subCues, sceneStartFrame, 's03_comment_box', 380);
  const fAdPulse = getSubCueFrame(subCues, sceneStartFrame, 's03_ad_pulse', 460);

  const fStep1 = getSubCueFrame(subCues, sceneStartFrame, 's03_step1', 590);
  const fSigWatch = getSubCueFrame(subCues, sceneStartFrame, 's03_sig_watch', 820);
  const fSigLike = getSubCueFrame(subCues, sceneStartFrame, 's03_sig_like', 850);
  const fSigShare = getSubCueFrame(subCues, sceneStartFrame, 's03_sig_share', 880);
  const fSigHeart = getSubCueFrame(subCues, sceneStartFrame, 's03_sig_heart', 910);
  const fStep4 = getSubCueFrame(subCues, sceneStartFrame, 's03_step4', 950);

  const pulseAlpha = frame >= fAdPulse ? 0.5 + 0.5 * Math.sin((frame - fAdPulse) / 6) : 0;

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
        eyebrow="STEP 02 · 视频号主战场实操体感"
        title={
          <>
            100 粉只是门槛，<span style={{ color: THEME.orange }}>评论区热闹</span>才有分成
          </>
        }
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '0.88fr 1.22fr',
          gap: 32,
          alignItems: 'stretch',
        }}
      >
        {/* Left: Platform + 100-follower myth + Comment Ad Mockup */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <BentoCard delay={fMainPlat} variant="slideLeft" style={{ padding: '20px 24px' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: THEME.inkMuted }}>
              多平台同步分发策略
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 12, alignItems: 'center' }}>
              <RevealBox atFrame={fMainPlat} variant="zoomPop" style={{ flex: 1.25 }}>
                <div
                  style={{
                    padding: '14px 14px',
                    borderRadius: 16,
                    backgroundColor: THEME.orangeSoft,
                    border: `2px solid ${THEME.orange}`,
                    fontSize: 19,
                    fontWeight: 900,
                    color: THEME.orange,
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  视频号（主战场）
                </div>
              </RevealBox>

              {frame >= fSyncPlats
                ? ['其他平台 A（同步）', '其他平台 B（同步）'].map((p, idx) => (
                    <RevealBox key={p} atFrame={fSyncPlats + idx * 8} variant="slideLeft" style={{ flex: 1 }}>
                      <div
                        style={{
                          padding: '14px 10px',
                          borderRadius: 16,
                          backgroundColor: '#F5F2EA',
                          border: `1.5px solid ${THEME.cardBorder}`,
                          fontSize: 17,
                          fontWeight: 700,
                          color: THEME.inkSecondary,
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {p}
                      </div>
                    </RevealBox>
                  ))
                : null}
            </div>
          </BentoCard>

          <BentoCard
            delay={f100Fans}
            variant="flipY"
            style={{
              padding: '22px 26px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 24, fontWeight: 900, color: THEME.ink }}>
                  创作者分成计划真相
                </span>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: THEME.orange,
                    backgroundColor: THEME.orangeSoft,
                    padding: '5px 12px',
                    borderRadius: 999,
                  }}
                >
                  100 粉即可开通
                </span>
              </div>

              {frame >= fMythStamp ? (
                <div style={{ marginTop: 12 }}>
                  <StampSlam atFrame={fMythStamp}>
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '8px 16px',
                        borderRadius: 12,
                        backgroundColor: THEME.dangerSoft,
                        border: `1.5px solid ${THEME.danger}`,
                        color: THEME.danger,
                        fontSize: 18,
                        fontWeight: 900,
                      }}
                    >
                      ⚠️ 误区：100粉门槛低 ≠ 播放高就赚钱
                    </div>
                  </StampSlam>
                </div>
              ) : null}
            </div>

            {frame >= fCommentBox ? (
              <RevealBox atFrame={fCommentBox} variant="slideUp">
                <div
                  style={{
                    marginTop: 14,
                    backgroundColor: '#FAF8F3',
                    borderRadius: 18,
                    padding: '16px 18px',
                    border: `1.5px solid ${THEME.cardBorder}`,
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 800, color: THEME.inkMuted, marginBottom: 10 }}>
                    评论区真实变现结构
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ backgroundColor: '#FFFFFF', padding: '10px 14px', borderRadius: 12, fontSize: 17, color: THEME.ink }}>
                      💬 <strong>观众互动：</strong>点开评论区看讨论……
                    </div>
                    <RevealBox atFrame={fAdPulse} variant="zoomPop">
                      <div
                        style={{
                          backgroundColor: THEME.orangeSoft,
                          border: `2px dashed ${THEME.orange}`,
                          padding: '12px 14px',
                          borderRadius: 12,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          boxShadow: `0 0 ${14 + pulseAlpha * 14}px rgba(255, 90, 31, ${0.15 + pulseAlpha * 0.2})`,
                        }}
                      >
                        <span style={{ fontSize: 18, fontWeight: 900, color: THEME.orange }}>
                          📢 评论区原生广告位（核心分成来源）
                        </span>
                        <span style={{ fontSize: 15, fontWeight: 800, color: THEME.ink }}>
                          曝光 + 点击
                        </span>
                      </div>
                    </RevealBox>
                  </div>
                </div>
              </RevealBox>
            ) : null}
          </BentoCard>
        </div>

        {/* Right: 4-Stage Ladder Funnel + Signal Chips */}
        <BentoCard
          delay={fFunnelStart}
          variant="slideRight"
          style={{
            padding: '24px 30px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 26, fontWeight: 900, color: THEME.ink }}>
                视频号阶梯式推流模型
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10, minHeight: 34, flexWrap: 'wrap' }}>
                {[
                  { label: '完播', at: fSigWatch },
                  { label: '点赞', at: fSigLike },
                  { label: '分享', at: fSigShare },
                  { label: '红心', at: fSigHeart },
                  { label: '评论互动', at: fStep4, accent: true },
                ].map((sig) => (
                  <RevealBox key={sig.label} atFrame={sig.at} variant="zoomPop">
                    <span
                      style={{
                        padding: '5px 12px',
                        borderRadius: 999,
                        fontSize: 16,
                        fontWeight: 800,
                        backgroundColor: sig.accent ? THEME.orange : THEME.tealSoft,
                        color: sig.accent ? '#FFFFFF' : '#0F766E',
                        border: sig.accent ? 'none' : `1.5px solid ${THEME.tealBorder}`,
                      }}
                    >
                      {sig.accent ? '★ ' : '+ '}
                      {sig.label}
                    </span>
                  </RevealBox>
                ))}
              </div>
            </div>
            <AgentMascot
              size={104}
              delay={fSigWatch}
              mood={frame >= fStep4 ? 'happy' : 'normal'}
              leftBadge="完播"
              rightBadge="评论"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
            {FUNNEL_STEPS.map((st) => {
              const cueAt = getSubCueFrame(subCues, sceneStartFrame, st.cueKey, 600);
              if (frame < cueAt) return null;
              const p = popSpring(frame, fps, cueAt);
              return (
                <div
                  key={st.num}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 22px',
                    borderRadius: 18,
                    backgroundColor: st.highlight ? '#FFF9F6' : '#FAF8F3',
                    border: st.highlight
                      ? `2px solid ${THEME.orange}`
                      : `1.5px solid ${THEME.cardBorder}`,
                    transform: `translateX(${interpolate(p, [0, 1], [48, 0])}px)`,
                    opacity: interpolate(p, [0, 0.45], [0, 1], { extrapolateRight: 'clamp' }),
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        backgroundColor: st.highlight ? THEME.orange : THEME.ink,
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                        fontWeight: 900,
                      }}
                    >
                      {st.num}
                    </div>
                    <div>
                      <div style={{ fontSize: 21, fontWeight: 900, color: THEME.ink }}>
                        {st.title}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: THEME.inkSecondary, marginTop: 2 }}>
                        {st.desc}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: st.highlight ? THEME.orange : THEME.teal,
                    }}
                  >
                    {st.highlight ? '变现终点' : '阶梯晋级 ↓'}
                  </div>
                </div>
              );
            })}
          </div>
        </BentoCard>
      </div>
    </AbsoluteFill>
  );
};
