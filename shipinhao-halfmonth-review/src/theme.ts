export const THEME = {
  bg: '#F6F4EE',
  bgGrid: '#E9E5DB',
  ink: '#1E2229',
  inkSecondary: '#474E5C',
  inkMuted: '#7A818F',
  orange: '#FF5A1F',
  orangeSoft: '#FFF0EA',
  orangeBorder: '#FFCBB8',
  teal: '#14B8A6',
  tealSoft: '#ECFDF9',
  tealBorder: '#99F6E4',
  eyeGlow: '#7FA6FF',
  cardBg: '#FFFFFF',
  cardBorder: '#E6E2D8',
  danger: '#DC2626',
  dangerSoft: '#FEF2F2',
  fontSans:
    "'Noto Sans SC', 'Microsoft YaHei UI', 'Microsoft YaHei', sans-serif",
  fontSerif: "'Noto Serif SC', 'Source Han Serif SC', serif",
} as const;

export const STEP_ITEMS = [
  { index: 1, label: '选赛道' },
  { index: 2, label: '推流机制' },
  { index: 3, label: '数据复盘' },
  { index: 4, label: '起号实操' },
  { index: 5, label: '算账反思' },
] as const;
