import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
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

export const Scene01Hook: React.FC<SceneProps> = ({
  sceneStartFrame,
  subCues,
}) => {
  const frame = useCurrentFrame();

  const fDur65 = getSubCueFrame(subCues, sceneStartFrame, 's01_dur65', 14);
  const fWatch64 = getSubCueFrame(subCues, sceneStartFrame, 's01_watch64', 54);
  const fViews59 = getSubCueFrame(subCues, sceneStartFrame, 's01_views59', 105);
  const fComm503 = getSubCueFrame(subCues, sceneStartFrame, 's01_comm503', 145);
  const fMystery = getSubCueFrame(subCues, sceneStartFrame, 's01_mystery', 190);
  const fHit393 = getSubCueFrame(subCues, sceneStartFrame, 's01_hit393', 280);

  const fFans240 = getSubCueFrame(subCues, sceneStartFrame, 's01_fans240', 370);
  const fPosts23 = getSubCueFrame(subCues, sceneStartFrame, 's01_posts23', 415);
  const fTotal158k = getSubCueFrame(subCues, sceneStartFrame, 's01_total158k', 465);
  const fRev504 = getSubCueFrame(subCues, sceneStartFrame, 's01_rev504', 525);

  const fTimeCost = getSubCueFrame(subCues, sceneStartFrame, 's01_timecost', 610);
  const fMoneyCost = getSubCueFrame(subCues, sceneStartFrame, 's01_moneycost', 670);
  const fWorth = getSubCueFrame(subCues, sceneStartFrame, 's01_worth', 810);

  const watchP = smoothT(frame, fWatch64, 28);
  const viewsP = smoothT(frame, fViews59, 26);
  const commP = smoothT(frame, fComm503, 26);
  const totalP = smoothT(frame, fTotal158k, 32);

  const isStampHit = frame >= fHit393;

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
        eyebrow="视频号半个月真实复盘 · 不画大饼只摊数据"
        title={
          <>
            一条 65 秒的小爆款，到底
            <HighlightSweep atFrame={fWorth} color="rgba(255, 90, 31, 0.22)">
              <span style={{ color: THEME.orange }}>值不值得干</span>
            </HighlightSweep>
            ？
          </>
        }
      />

      {/* Center Hero Comparison */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.35fr 0.95fr',
          gap: 32,
          alignItems: 'stretch',
          minHeight: 332,
        }}
      >
        <BentoCard
          delay={fDur65}
          variant="slideLeft"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '28px 34px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span
              style={{
                fontSize: 21,
                fontWeight: 800,
                color: THEME.inkSecondary,
                backgroundColor: '#F3EFE6',
                padding: '8px 18px',
                borderRadius: 999,
              }}
            >
              案例：《等不来的道歉》（全程参与分成计划）
            </span>
            <span
              style={{
                fontSize: 19,
                fontWeight: 800,
                color: '#FFFFFF',
                backgroundColor: THEME.teal,
                padding: '6px 16px',
                borderRadius: 999,
              }}
            >
              总长 65s
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 22,
              marginTop: 22,
              minHeight: 196,
            }}
          >
            {/* Metric 1: appears at "平均看了64秒" */}
            <div>
              <RevealBox atFrame={fWatch64} variant="flipY">
                <div style={{ backgroundColor: '#FAF8F3', borderRadius: 20, padding: '22px 24px', border: `1.5px solid ${THEME.cardBorder}` }}>
                  <div style={{ fontSize: 19, fontWeight: 700, color: THEME.inkMuted }}>平均观看时长</div>
                  <div style={{ fontSize: 52, fontWeight: 900, color: THEME.ink, marginTop: 8 }}>
                    {(watchP * 64.07).toFixed(2)}<span style={{ fontSize: 22, marginLeft: 4 }}>s</span>
                  </div>
                  <div style={{ fontSize: 17, color: THEME.teal, fontWeight: 800, marginTop: 4 }}>几乎看完一整条</div>
                </div>
              </RevealBox>
            </div>

            {/* Metric 2: appears at "5.9万播放" */}
            <div>
              <RevealBox atFrame={fViews59} variant="flipY">
                <div style={{ backgroundColor: '#FAF8F3', borderRadius: 20, padding: '22px 24px', border: `1.5px solid ${THEME.cardBorder}` }}>
                  <div style={{ fontSize: 19, fontWeight: 700, color: THEME.inkMuted }}>单条播放量</div>
                  <div style={{ fontSize: 52, fontWeight: 900, color: THEME.ink, marginTop: 8 }}>
                    {(viewsP * 5.9).toFixed(1)}<span style={{ fontSize: 22, marginLeft: 4 }}>万</span>
                  </div>
                  <div style={{ fontSize: 17, color: THEME.inkSecondary, fontWeight: 700, marginTop: 4 }}>完播率 38.11%</div>
                </div>
              </RevealBox>
            </div>

            {/* Metric 3: appears at "503条评论" */}
            <div>
              <RevealBox atFrame={fComm503} variant="flipY">
                <div style={{ backgroundColor: '#FAF8F3', borderRadius: 20, padding: '22px 24px', border: `1.5px solid ${THEME.cardBorder}` }}>
                  <div style={{ fontSize: 19, fontWeight: 700, color: THEME.inkMuted }}>评论区互动</div>
                  <div style={{ fontSize: 52, fontWeight: 900, color: THEME.ink, marginTop: 8 }}>
                    {Math.round(commP * 503)}<span style={{ fontSize: 22, marginLeft: 4 }}>条</span>
                  </div>
                  <div style={{ fontSize: 17, color: THEME.inkSecondary, fontWeight: 700, marginTop: 4 }}>新增关注 +75</div>
                </div>
              </RevealBox>
            </div>
          </div>
        </BentoCard>

        {/* Right Shocking Payout Card: appears at "分成给了多少钱" */}
        <div>
          <BentoCard
            delay={fMystery}
            variant="slideRight"
            accent={isStampHit ? 'orange' : 'none'}
            style={{
              height: '100%',
              backgroundColor: isStampHit ? '#FFF9F6' : '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '28px 36px',
            }}
          >
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: THEME.inkMuted }}>
                视频号创作者分成实得
              </div>

              {isStampHit ? (
                <StampSlam atFrame={fHit393}>
                  <div
                    style={{
                      fontSize: 108,
                      fontWeight: 900,
                      color: THEME.orange,
                      lineHeight: 1.05,
                      marginTop: 12,
                    }}
                  >
                    ¥3.93
                  </div>
                </StampSlam>
              ) : (
                <div
                  style={{
                    fontSize: 82,
                    fontWeight: 900,
                    color: '#D4CFC3',
                    lineHeight: 1.15,
                    marginTop: 16,
                  }}
                >
                  ¥ ??.??
                </div>
              )}

              <div
                style={{
                  marginTop: 12,
                  fontSize: 21,
                  fontWeight: 700,
                  color: isStampHit ? THEME.inkSecondary : THEME.inkMuted,
                }}
              >
                {isStampHit ? '3 块 9 毛 3，够干嘛？' : '猜猜平台给了多少分成？'}
              </div>
            </div>

            <AgentMascot
              size={140}
              delay={fMystery}
              mood={isStampHit ? 'shock' : 'thinking'}
              lookX={-0.6}
            />
          </BentoCard>
        </div>
      </div>

      {/* Bottom 15-Day Full Ledger Row — strictly synced to each phrase */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr) 1.45fr',
          gap: 20,
          minHeight: 164,
        }}
      >
        <div>
          <BentoCard delay={fFans240} variant="zoomPop" style={{ padding: '22px 24px', height: '100%' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: THEME.inkMuted }}>当前粉丝量</div>
            <div style={{ fontSize: 42, fontWeight: 900, color: THEME.ink, marginTop: 6 }}>240</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: THEME.inkSecondary, marginTop: 4 }}>半个月新增</div>
          </BentoCard>
        </div>

        <div>
          <BentoCard delay={fPosts23} variant="zoomPop" style={{ padding: '22px 24px', height: '100%' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: THEME.inkMuted }}>原创作品数</div>
            <div style={{ fontSize: 42, fontWeight: 900, color: THEME.ink, marginTop: 6 }}>23 条</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: THEME.inkSecondary, marginTop: 4 }}>持续半个月</div>
          </BentoCard>
        </div>

        <div>
          <BentoCard delay={fTotal158k} variant="flipX" style={{ padding: '22px 24px', height: '100%' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: THEME.inkMuted }}>累计总播放</div>
            <div style={{ fontSize: 40, fontWeight: 900, color: THEME.ink, marginTop: 6 }}>
              {Math.round(totalP * 158921).toLocaleString()}
            </div>
            <div style={{ fontSize: 17, fontWeight: 600, color: THEME.inkSecondary, marginTop: 4 }}>近 15.9 万播放</div>
          </BentoCard>
        </div>

        <div>
          <BentoCard delay={fRev504} variant="zoomPop" accent="orange" style={{ padding: '22px 24px', height: '100%' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: THEME.inkMuted }}>累计总收益</div>
            <div style={{ fontSize: 42, fontWeight: 900, color: THEME.orange, marginTop: 6 }}>¥5.04</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: THEME.inkSecondary, marginTop: 4 }}>全部作品合计</div>
          </BentoCard>
        </div>

        <div>
          <BentoCard
            delay={fTimeCost}
            variant="slideUp"
            accent="dark"
            style={{
              padding: '22px 26px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, color: '#9CA3AF' }}>
              单条真实投入成本
            </div>
            <div style={{ fontSize: 34, fontWeight: 900, color: '#FFFFFF', marginTop: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>1~2 小时</span>
              {frame >= fMoneyCost ? (
                <StampSlam atFrame={fMoneyCost} ringColor="#FF8A5B">
                  <span style={{ color: '#FF8A5B' }}>+ 约 ¥5</span>
                </StampSlam>
              ) : null}
            </div>
            <div style={{ fontSize: 17, color: '#D1D5DB', marginTop: 4 }}>
              文案打磨 + AI 生图卡片费用
            </div>
          </BentoCard>
        </div>
      </div>
    </AbsoluteFill>
  );
};
