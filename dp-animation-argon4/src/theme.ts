export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const TOTAL_SECONDS = 28.5;
export const TOTAL_FRAMES = Math.round(TOTAL_SECONDS * FPS); // 855 frames

export const COLORS = {
  bgDeep: '#070B14',
  bgPanel: '#0F172A',
  bgCard: '#15203B',
  border: '#263554',
  textMain: '#F8FAFC',
  textMuted: '#94A3B8',
  // Core 4 Accent Colors with strict semantic meaning:
  cyan: '#00F0FF',   // Fixed for i - 1 / +1
  pink: '#FF2A85',   // Fixed for i - 2 / +2
  yellow: '#FFD600', // Fixed for current cell i / target
  green: '#00E676',  // Fixed for completion / base / O(n) success
};

export const SCENE_FRAMES = {
  scene1: { start: 0, end: 105 },     // 0 - 3.5s: 标题 "动态规划 · 30秒入门"
  scene2: { start: 105, end: 270 },   // 3.5 - 9s: 问题引入：爬楼梯 (+1 +2 +1 +1)
  scene3: { start: 270, end: 435 },   // 9 - 14.5s: 暴力递归 f(n)=f(n-1)+f(n-2)
  scene4: { start: 435, end: 720 },   // 14.5 - 24s: DP 填表 dp[i]=dp[i-1]+dp[i-2]
  scene5: { start: 720, end: 855 },   // 24 - 28.5s: 总结：DP 三步走
};

// DP Table values: 1 -> 1 -> 2 -> 3 -> 5 -> 8 -> 13 -> 21
export const DP_VALUES = [1, 1, 2, 3, 5, 8, 13, 21];

// Relative frames inside Scene 4 (length 285 frames = 9.5s) when each DP cell pops in
// Accelerating rhythm (节奏越来越快):
// gaps: 24, 42, 38, 33, 28, 23, 19 (getting faster each cell!)
export const DP_STEP_REL_FRAMES = [
  18,  // i=0: val 1 (init)
  40,  // i=1: val 1 (init)
  82,  // i=2: 1 + 1 = 2 (gap 42)
  120, // i=3: 2 + 1 = 3 (gap 38)
  153, // i=4: 3 + 2 = 5 (gap 33)
  181, // i=5: 5 + 3 = 8 (gap 28)
  204, // i=6: 8 + 5 = 13 (gap 23)
  223, // i=7: 13 + 8 = 21 (gap 19, final chord!)
];

export const FONT_SANS = '"Inter", "Microsoft YaHei", "PingFang SC", "Noto Sans SC", sans-serif';
export const FONT_MONO = '"JetBrains Mono", "Fira Code", "Consolas", monospace';
