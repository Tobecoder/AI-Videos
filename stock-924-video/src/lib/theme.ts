import { Easing, interpolate } from "remotion";

export const C = {
  bg: "#07090D",
  panel: "rgba(255,255,255,0.045)",
  border: "rgba(255,255,255,0.09)",
  text: "#F3F5F9",
  dim: "#8A93A6",
  // A-share convention: red = up, green = down
  up: "#FF3B3B",
  down: "#14C774",
  gold: "#FFD23F",
};

export const FONT_CN = '"Noto Sans SC", "Microsoft YaHei", sans-serif';
export const FONT_NUM = 'Bahnschrift, "DIN Alternate", "Noto Sans SC", sans-serif';

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0 -> 1 between frames a and b */
export const prog = (f: number, a: number, b: number, easing = EASE_OUT) =>
  interpolate(f, [a, b], [0, 1], { ...clamp, easing });

export const money = (v: number) => {
  const s = Math.round(Math.abs(v)).toLocaleString("en-US");
  return `${v > 0 ? "+" : v < 0 ? "-" : ""}${s}`;
};

/** deterministic pseudo random */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** decaying screen shake offset */
export const shake = (f: number, at: number, strength = 26, len = 18) => {
  const t = f - at;
  if (t < 0 || t > len) return { x: 0, y: 0 };
  const k = (1 - t / len) ** 2 * strength;
  return { x: Math.sin(t * 2.7) * k, y: Math.cos(t * 3.9) * k * 0.7 };
};
