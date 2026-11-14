import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { AgentMascot } from '../components/AgentMascot';
import { BentoCard } from '../components/BentoCard';
import { HighlightSweep, RevealBox } from '../components/MotionEffects';
import { SectionHeader } from '../components/SectionHeader';
import { THEME } from '../theme';
import { getSubCueFrame, popSpring, TimelineSegment } from '../utils/anim';

interface SceneProps {
  segments: TimelineSegment[];
  sceneStartFrame: number;
  subCues?: Record<string, number>;
}

const CARDS = [
  {
    src: 'assets/cards/card_changtu.png',
    title: '跟父亲跑长途',
    views: '3.0w 播放',
    rot: -5,
    xOffset: -10,
    offsetY: 16,
  },
  {
    src: 'assets/cards/card_shien.png',
    title: '师恩照亮我一生',
    views: '3.2w 播放',
    rot: 0,
    xOffset: 0,
    offsetY: -10,
  },
  {
    src: 'assets/cards/card_daoqian.png',
    title: '等不来的道歉',
    views: '5.9w 播放',
    rot: 5,
    xOffset: 10,
    offsetY: 14,
  },
];

export const Scene02NicheChoice: React.FC<SceneProps> = ({
  sceneStartFrame,
  subCues,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fWriter = getSubCueFrame(subCues, sceneStartFrame, 's02_writer', 45);
  const fCardsDeal = getSubCueFrame(subCues, sceneStartFrame, 's02_cards_deal', 110);
  const fIdeal = getSubCueFrame(subCues, sceneStartFrame, 's02_ideal_card', 220);
  const fTagEdit = getSubCueFrame(subCues, sceneStartFrame, 's02_tag_edit', 360);
  const fTagTime = getSubCueFrame(subCues, sceneStartFrame, 's02_tag_time', 440);
  const fTagMoney = getSubCueFrame(subCues, sceneStartFrame, 's02_tag_money', 480);

  const fMvpCard = getSubCueFrame(subCues, sceneStartFrame, 's02_mvp_card', 580);
  const fTear = getSubCueFrame(subCues, sceneStartFrame, 's02_tear', 660);
  const fResonance = getSubCueFrame(subCues, sceneStartFrame, 's02_resonance', 730);

  const fFormBar = getSubCueFrame(subCues, sceneStartFrame, 's02_form_bar', 870);
  const fContentKing = getSubCueFrame(subCues, sceneStartFrame, 's02_content_king', 940);
  const fDimIdeal = getSubCueFrame(subCues, sceneStartFrame, 's02_dim_ideal', 1070);
  const fLockMvp = getSubCueFrame(subCues, sceneStartFrame, 's02_lock_mvp', 1140);

  const isDimmed = frame >= fDimIdeal;
  const isMvpLocked = frame >= fLockMvp;

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
        eyebrow="STEP 01 · 为什么先做 AI 图文故事"
        title={
          <>
            先跑通<span style={{ color: THEME.orange }}>低成本能落地的</span>，再切真正想做的
          </>
        }
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.08fr 1fr',
          gap: 36,
          alignItems: 'center',
        }}
      >
        {/* Left: AI Story Card Deck Deal */}
        <BentoCard
          delay={6}
          variant="slideLeft"
          style={{
            padding: '26px 28px 24px',
            backgroundColor: '#FBF9F4',
            height: 550,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: THEME.ink }}>
              赛道：AI 图文故事集
            </span>
            {frame >= fWriter ? (
              <RevealBox atFrame={fWriter} variant="zoomPop">
                <span
                  style={{
                    fontSize: 17,
                    fontWeight: 800,
                    color: THEME.teal,
                    backgroundColor: THEME.tealSoft,
                    padding: '6px 14px',
                    borderRadius: 999,
                    border: `1.5px solid ${THEME.tealBorder}`,
                  }}
                >
                  ✍️ AI 写文案 + 固定手绘卡
                </span>
              </RevealBox>
            ) : null}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
              marginTop: 10,
              flex: 1,
            }}
          >
            {frame < fCardsDeal ? (
              <div
                style={{
                  padding: '28px 36px',
                  borderRadius: 20,
                  border: `2px dashed ${THEME.cardBorder}`,
                  color: THEME.inkMuted,
                  fontSize: 21,
                  fontWeight: 700,
                }}
              >
                AI 正在生成文案与故事脚本...
              </div>
            ) : (
              CARDS.map((card, idx) => {
                const dealAt = fCardsDeal + idx * 14;
                if (frame < dealAt) return null;
                const p = popSpring(frame, fps, dealAt);
                const hover = Math.sin((frame + idx * 20) / 24) * 4;
                const startX = (1 - idx) * 220;
                const curX = interpolate(p, [0, 1], [startX, card.xOffset]);
                const curRot = interpolate(p, [0, 1], [0, card.rot]);

                return (
                  <div
                    key={card.title}
                    style={{
                      width: 244,
                      backgroundColor: '#FFFFFF',
                      borderRadius: 18,
                      padding: 10,
                      border: `1.5px solid ${THEME.cardBorder}`,
                      boxShadow: '0 16px 34px rgba(30, 34, 41, 0.13)',
                      transform: `translate(${curX}px, ${
                        card.offsetY + hover + interpolate(p, [0, 1], [70, 0])
                      }px) rotate(${curRot}deg) scale(${interpolate(p, [0, 1], [0.75, 1])})`,
                      opacity: interpolate(p, [0, 0.45], [0, 1], { extrapolateRight: 'clamp' }),
                    }}
                  >
                    <Img
                      src={staticFile(card.src)}
                      style={{
                        width: '100%',
                        height: 312,
                        objectFit: 'cover',
                        borderRadius: 12,
                        display: 'block',
                      }}
                    />
                    <div
                      style={{
                        marginTop: 10,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0 4px',
                      }}
                    >
                      <span style={{ fontSize: 16, fontWeight: 800, color: THEME.ink }}>
                        {card.title}
                      </span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: THEME.orange }}>
                        {card.views}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </BentoCard>

        {/* Right: Gated reveals synced to spoken narration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minHeight: 550 }}>
          {/* Ideal Niche Card */}
          <div style={{ opacity: isDimmed ? 0.52 : 1, transition: 'opacity 0.3s' }}>
            <BentoCard delay={fIdeal} variant="flipX" style={{ padding: '22px 26px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 24, fontWeight: 900, color: THEME.ink }}>
                  真正想做的：知识分享动画
                </span>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: isDimmed ? THEME.danger : THEME.inkMuted,
                    backgroundColor: isDimmed ? THEME.dangerSoft : '#EFECE3',
                    padding: '6px 14px',
                    borderRadius: 999,
                  }}
                >
                  {isDimmed ? '现阶段先舍弃' : '初期门槛高'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 14, minHeight: 42 }}>
                <RevealBox atFrame={fTagEdit} variant="zoomPop">
                  <span style={{ fontSize: 18, fontWeight: 700, color: THEME.danger, backgroundColor: THEME.dangerSoft, padding: '8px 14px', borderRadius: 12, display: 'inline-block' }}>
                    ✕ 不会剪辑
                  </span>
                </RevealBox>
                <RevealBox atFrame={fTagTime} variant="zoomPop">
                  <span style={{ fontSize: 18, fontWeight: 700, color: THEME.danger, backgroundColor: THEME.dangerSoft, padding: '8px 14px', borderRadius: 12, display: 'inline-block' }}>
                    ✕ 时间成本太高
                  </span>
                </RevealBox>
                <RevealBox atFrame={fTagMoney} variant="zoomPop">
                  <span style={{ fontSize: 18, fontWeight: 700, color: THEME.danger, backgroundColor: THEME.dangerSoft, padding: '8px 14px', borderRadius: 12, display: 'inline-block' }}>
                    ✕ 金钱门槛高
                  </span>
                </RevealBox>
              </div>
            </BentoCard>
          </div>

          {/* MVP Card */}
          <div>
            <BentoCard
              delay={fMvpCard}
              variant="slideRight"
              accent="teal"
              style={{
                padding: '22px 26px',
                backgroundColor: isMvpLocked ? '#F2FBF9' : '#FFFFFF',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 24, fontWeight: 900, color: THEME.ink }}>
                  先落地的：AI 图文故事
                </span>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: '#FFFFFF',
                    backgroundColor: THEME.teal,
                    padding: '6px 14px',
                    borderRadius: 999,
                  }}
                >
                  {isMvpLocked ? '✓ 低成本跑通落地' : 'MVP 先行'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 14, minHeight: 42 }}>
                <RevealBox atFrame={fTear} variant="slideUp">
                  <span style={{ fontSize: 18, fontWeight: 700, color: '#0F766E', backgroundColor: THEME.tealSoft, padding: '8px 14px', borderRadius: 12, display: 'inline-block' }}>
                    🥹 自己也会看哭
                  </span>
                </RevealBox>
                <RevealBox atFrame={fResonance} variant="slideUp">
                  <span style={{ fontSize: 18, fontWeight: 700, color: '#0F766E', backgroundColor: THEME.tealSoft, padding: '8px 14px', borderRadius: 12, display: 'inline-block' }}>
                    ✓ 天生情绪共鸣
                  </span>
                </RevealBox>
                <RevealBox atFrame={fLockMvp} variant="zoomPop">
                  <span style={{ fontSize: 18, fontWeight: 700, color: '#0F766E', backgroundColor: THEME.tealSoft, padding: '8px 14px', borderRadius: 12, display: 'inline-block' }}>
                    ✓ 低成本快速跑通
                  </span>
                </RevealBox>
              </div>
            </BentoCard>
          </div>

          {/* Core Formula Dark Card */}
          <div>
            <BentoCard
              delay={fFormBar}
              variant="flipY"
              accent="dark"
              style={{
                padding: '22px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#9CA3AF' }}>
                  拆解爆款后的底层规律
                </div>
                <div style={{ fontSize: 29, fontWeight: 900, color: '#FFFFFF', marginTop: 6 }}>
                  表达形式五花八门 ·{' '}
                  <HighlightSweep atFrame={fContentKing} color="rgba(255, 90, 31, 0.35)">
                    <span style={{ color: '#FF8A5B' }}>内容永远是最核心</span>
                  </HighlightSweep>
                </div>
              </div>
              <AgentMascot
                size={104}
                delay={fContentKing}
                mood="happy"
                leftBadge="形式"
                rightBadge="内容"
              />
            </BentoCard>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
