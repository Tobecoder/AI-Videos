import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONT_MONO, FONT_SANS } from '../theme';

interface TreeNode {
  id: string;
  label: string;
  val: number;
  layer: number;
  x: number;
  y: number;
  parentId?: string;
  branchType?: 'minus1' | 'minus2'; // cyan for n-1, pink for n-2
}

const NODES: TreeNode[] = [
  // Layer 0
  { id: 'n5', label: 'f(5)', val: 5, layer: 0, x: 960, y: 270 },
  // Layer 1
  { id: 'n4', label: 'f(4)', val: 4, layer: 1, x: 560, y: 440, parentId: 'n5', branchType: 'minus1' },
  { id: 'n3_r', label: 'f(3)', val: 3, layer: 1, x: 1360, y: 440, parentId: 'n5', branchType: 'minus2' },
  // Layer 2
  { id: 'n3_l', label: 'f(3)', val: 3, layer: 2, x: 360, y: 630, parentId: 'n4', branchType: 'minus1' },
  { id: 'n2_lr', label: 'f(2)', val: 2, layer: 2, x: 760, y: 630, parentId: 'n4', branchType: 'minus2' },
  { id: 'n2_rl', label: 'f(2)', val: 2, layer: 2, x: 1160, y: 630, parentId: 'n3_r', branchType: 'minus1' },
  { id: 'n1_rr', label: 'f(1)', val: 1, layer: 2, x: 1560, y: 630, parentId: 'n3_r', branchType: 'minus2' },
  // Layer 3
  { id: 'n2_ll', label: 'f(2)', val: 2, layer: 3, x: 240, y: 825, parentId: 'n3_l', branchType: 'minus1' },
  { id: 'n1_lr', label: 'f(1)', val: 1, layer: 3, x: 480, y: 825, parentId: 'n3_l', branchType: 'minus2' },
];

const LAYER_START_FRAMES = [10, 32, 56, 78];

export const Scene3Recursion: React.FC = () => {
  const frame = useCurrentFrame(); // 0..165 (5.5s)
  const { fps } = useVideoConfig();

  const enterOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const exitOpacity = interpolate(frame, [152, 165], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Duplicate pulse begins at frame 95
  const pulseActive = frame >= 95;
  const pulseWave = pulseActive ? 0.5 + 0.5 * Math.sin((frame - 95) * 0.35) : 0;

  // O(2^n) callout pop
  const badgePop = spring({
    frame: frame - 102,
    fps,
    config: { damping: 10, stiffness: 160 },
  });

  return (
    <AbsoluteFill
      style={{
        opacity: enterOpacity * exitOpacity,
        fontFamily: FONT_SANS,
      }}
    >
      {/* Top Header & Formula */}
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
          <div style={{ color: COLORS.pink, fontSize: 24, fontWeight: 700, letterSpacing: 2 }}>
            SCENE 02 · 暴力递归的困境
          </div>
          <div style={{ color: COLORS.textMain, fontSize: 54, fontWeight: 900, marginTop: 6 }}>
            递归展开树：大量重复子问题
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
          <span style={{ color: COLORS.yellow }}>f(n)</span>
          <span style={{ color: COLORS.textMuted }}>=</span>
          <span style={{ color: COLORS.cyan }}>f(n-1)</span>
          <span style={{ color: COLORS.textMuted }}>+</span>
          <span style={{ color: COLORS.pink }}>f(n-2)</span>
        </div>
      </div>

      {/* SVG Edges & Duplicate Connectors */}
      <svg
        width={1920}
        height={1080}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 2 }}
      >
        {NODES.map((node) => {
          if (!node.parentId) return null;
          const parent = NODES.find((n) => n.id === node.parentId)!;
          const startFrame = LAYER_START_FRAMES[node.layer];
          const progress = interpolate(frame, [startFrame - 8, startFrame + 8], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          if (progress <= 0) return null;

          const edgeColor = node.branchType === 'minus1' ? COLORS.cyan : COLORS.pink;
          const curX = interpolate(progress, [0, 1], [parent.x, node.x]);
          const curY = interpolate(progress, [0, 1], [parent.y, node.y]);

          return (
            <g key={`edge-${node.id}`}>
              <line
                x1={parent.x}
                y1={parent.y}
                x2={curX}
                y2={curY}
                stroke={edgeColor}
                strokeWidth={5}
                opacity={0.85}
              />
              {progress > 0.7 && (
                <text
                  x={(parent.x + node.x) / 2 + (node.branchType === 'minus1' ? -30 : 30)}
                  y={(parent.y + node.y) / 2 - 6}
                  fill={edgeColor}
                  fontFamily={FONT_MONO}
                  fontSize={20}
                  fontWeight={700}
                  textAnchor="middle"
                >
                  {node.branchType === 'minus1' ? 'n-1' : 'n-2'}
                </text>
              )}
            </g>
          );
        })}

        {/* Dashed glowing link between duplicate f(3) nodes and duplicate f(2) nodes */}
        {pulseActive && (
          <g opacity={interpolate(frame, [95, 108], [0, 0.9], { extrapolateRight: 'clamp' })}>
            <path
              d="M 360 630 Q 860 490 1360 440"
              fill="none"
              stroke={COLORS.cyan}
              strokeWidth={3.5}
              strokeDasharray="10 8"
            />
            <path
              d="M 240 825 Q 500 730 760 630 Q 960 690 1160 630"
              fill="none"
              stroke={COLORS.pink}
              strokeWidth={3.5}
              strokeDasharray="10 8"
            />
          </g>
        )}
      </svg>

      {/* Tree Nodes */}
      {NODES.map((node) => {
        const startFrame = LAYER_START_FRAMES[node.layer];
        const pop = spring({
          frame: frame - startFrame,
          fps,
          config: { damping: 11, stiffness: 170 },
        });
        if (frame < startFrame - 2) return null;

        const isF3 = node.val === 3;
        const isF2 = node.val === 2;
        const isDuplicate = (isF3 || isF2) && pulseActive;

        const baseColor =
          node.val === 5
            ? COLORS.yellow
            : isF3
              ? COLORS.cyan
              : isF2
                ? COLORS.pink
                : COLORS.green;

        const pulseScale = isDuplicate ? 1 + pulseWave * 0.16 : 1;
        const glowRadius = isDuplicate ? 28 + pulseWave * 35 : 18;

        return (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: node.x - 68,
              top: node.y - 42,
              width: 136,
              height: 84,
              borderRadius: 22,
              background: isDuplicate
                ? `linear-gradient(135deg, ${baseColor}44, ${COLORS.bgCard})`
                : COLORS.bgCard,
              border: `3.5px solid ${baseColor}`,
              boxShadow: `0 0 ${glowRadius}px ${baseColor}${isDuplicate ? 'cc' : '55'}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              transform: `scale(${pop * pulseScale})`,
              zIndex: 5,
            }}
          >
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 32,
                fontWeight: 900,
                color: COLORS.textMain,
              }}
            >
              {node.label}
            </div>
            {isDuplicate && (
              <div
                style={{
                  position: 'absolute',
                  top: -16,
                  right: -18,
                  padding: '2px 10px',
                  borderRadius: 999,
                  background: baseColor,
                  color: COLORS.bgDeep,
                  fontSize: 15,
                  fontWeight: 900,
                  boxShadow: `0 0 12px ${baseColor}`,
                }}
              >
                {isF3 ? '算了 2 次' : '算了 3 次'}
              </div>
            )}
          </div>
        );
      })}

      {/* Exponential O(2^n) Alert Banner */}
      {frame >= 100 && (
        <div
          style={{
            position: 'absolute',
            bottom: 64,
            right: 100,
            left: 640,
            padding: '24px 38px',
            borderRadius: 24,
            background: `linear-gradient(90deg, ${COLORS.bgCard}f5, #2A1225f5)`,
            border: `3px solid ${COLORS.pink}`,
            boxShadow: `0 0 45px ${COLORS.pink}66`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transform: `scale(${badgePop})`,
            zIndex: 12,
          }}
        >
          <div>
            <div style={{ color: COLORS.pink, fontSize: 24, fontWeight: 800 }}>
              ⚠️ 重叠子问题导致冗余计算！
            </div>
            <div style={{ color: COLORS.textMain, fontSize: 32, fontWeight: 700, marginTop: 6 }}>
              <span style={{ color: COLORS.cyan, fontFamily: FONT_MONO }}>f(3)</span> 重复 2 次，
              <span style={{ color: COLORS.pink, fontFamily: FONT_MONO }}>f(2)</span> 重复 3 次 → 随 n 增大呈指数爆炸
            </div>
          </div>

          <div
            style={{
              padding: '14px 28px',
              borderRadius: 18,
              background: COLORS.pink,
              color: COLORS.bgDeep,
              fontFamily: FONT_MONO,
              fontSize: 42,
              fontWeight: 900,
              boxShadow: `0 0 28px ${COLORS.pink}`,
            }}
          >
            O(2ⁿ)
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
