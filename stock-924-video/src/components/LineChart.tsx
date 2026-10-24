import React from "react";
import { C, rand } from "../lib/theme";

/** Insert jittered points between keyframes so lines look like real price action. */
export const densify = (keys: number[], perSeg = 6, jitter = 0.35, seed = 1) => {
  const out: number[] = [];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    const amp = Math.abs(b - a) * jitter + 1;
    for (let k = 0; k < perSeg; k++) {
      const t = k / perSeg;
      const noise = k === 0 ? 0 : (rand(seed * 97 + i * 13 + k) - 0.5) * amp;
      out.push(a + (b - a) * t + noise);
    }
  }
  out.push(keys[keys.length - 1]);
  return out;
};

type Props = {
  id: string;
  values: number[];
  min: number;
  max: number;
  width: number;
  height: number;
  /** 0..1 portion of the line drawn */
  progress: number;
  /** if set: fixed color. Otherwise red above zero / green below */
  color?: string;
  strokeWidth?: number;
  area?: boolean;
  zeroLine?: boolean;
  zeroValue?: number;
  head?: boolean;
  style?: React.CSSProperties;
};

export const LineChart: React.FC<Props> = ({
  id,
  values,
  min,
  max,
  width: W,
  height: H,
  progress,
  color,
  strokeWidth = 7,
  area = true,
  zeroLine = true,
  zeroValue = 0,
  head = true,
  style,
}) => {
  const n = values.length;
  const X = (i: number) => (i / (n - 1)) * W;
  const Y = (v: number) => ((max - v) / (max - min)) * H;
  const p = Math.max(0, Math.min(1, progress)) * (n - 1);
  const whole = Math.floor(p);
  const pts: [number, number][] = [];
  for (let i = 0; i <= whole; i++) pts.push([X(i), Y(values[i])]);
  if (whole < n - 1 && p > whole) {
    const t = p - whole;
    const v = values[whole] + (values[whole + 1] - values[whole]) * t;
    pts.push([X(whole + t), Y(v)]);
  }
  const zy = Y(zeroValue);
  const zr = Math.max(0, Math.min(1, zy / H));
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];
  const areaPath =
    pts.length > 1 ? `${line} L${last[0].toFixed(1)},${zy} L${pts[0][0]},${zy} Z` : "";
  const headColor = color ?? (last && last[1] > zy ? C.down : C.up);
  const stroke = color ?? `url(#${id}-g)`;

  return (
    <svg width={W} height={H} style={{ overflow: "visible", ...style }}>
      <defs>
        <linearGradient id={`${id}-g`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={H}>
          <stop offset={zr} stopColor={C.up} />
          <stop offset={zr} stopColor={C.down} />
        </linearGradient>
        <linearGradient id={`${id}-a`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={H}>
          <stop offset={0} stopColor={color ?? C.up} stopOpacity={0.35} />
          <stop offset={zr} stopColor={color ?? C.up} stopOpacity={0.02} />
          <stop offset={zr} stopColor={color ?? C.down} stopOpacity={0.02} />
          <stop offset={1} stopColor={color ?? C.down} stopOpacity={0.35} />
        </linearGradient>
      </defs>
      {zeroLine && (
        <line x1={0} x2={W} y1={zy} y2={zy} stroke="rgba(255,255,255,0.25)" strokeWidth={2} strokeDasharray="10 10" />
      )}
      {area && areaPath && <path d={areaPath} fill={`url(#${id}-a)`} />}
      {pts.length > 1 && (
        <>
          <path d={line} fill="none" stroke={stroke} strokeWidth={strokeWidth * 3} strokeOpacity={0.15} strokeLinejoin="round" strokeLinecap="round" />
          <path d={line} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" />
        </>
      )}
      {head && last && progress > 0.001 && (
        <>
          <circle cx={last[0]} cy={last[1]} r={strokeWidth * 3.2} fill={headColor} opacity={0.25} />
          <circle cx={last[0]} cy={last[1]} r={strokeWidth * 1.4} fill="#fff" stroke={headColor} strokeWidth={4} />
        </>
      )}
    </svg>
  );
};
