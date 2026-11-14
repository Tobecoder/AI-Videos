import React from 'react';
import { STEP_ITEMS, THEME } from '../theme';

interface TopStepBarProps {
  activeStep: number; // 0 for Hook intro, 1..5 for chapters
}

export const TopStepBar: React.FC<TopStepBarProps> = ({ activeStep }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 40,
        left: 88,
        right: 88,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 20,
        fontFamily: THEME.fontSans,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {STEP_ITEMS.map((step) => {
          const isActive = step.index === activeStep;
          const isDone = activeStep > step.index;
          return (
            <div
              key={step.index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 20px 10px 12px',
                borderRadius: 999,
                backgroundColor: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.72)',
                border: isActive
                  ? `2px solid ${THEME.orange}`
                  : `1.5px solid ${THEME.cardBorder}`,
                boxShadow: isActive
                  ? '0 8px 24px rgba(255, 90, 31, 0.14)'
                  : '0 4px 12px rgba(30, 34, 41, 0.04)',
                opacity: activeStep === 0 || isActive || isDone ? 1 : 0.62,
                transform: isActive ? 'scale(1.04)' : 'scale(1)',
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  backgroundColor: isActive
                    ? THEME.orange
                    : isDone
                    ? THEME.teal
                    : '#E5E0D5',
                  color: isActive || isDone ? '#FFFFFF' : THEME.inkSecondary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 800,
                }}
              >
                {isDone ? '✓' : step.index}
              </div>
              <span
                style={{
                  fontSize: 19,
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? THEME.ink : THEME.inkSecondary,
                  letterSpacing: '0.01em',
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Right-side compact creator badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 20px',
          borderRadius: 999,
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          border: `1.5px solid ${THEME.cardBorder}`,
          boxShadow: '0 4px 12px rgba(30, 34, 41, 0.04)',
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: THEME.orange,
          }}
        />
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: THEME.inkSecondary,
          }}
        >
          视频号半个月实战复盘 · 15天真实数据
        </span>
      </div>
    </div>
  );
};
