import { Easing, interpolate, useCurrentFrame } from "remotion";
import { FPS, scenes, SCENE_TAIL } from "../lib/timeline";
import { C, clamp, FONT_CN } from "../lib/theme";

type Chunk = { text: string; from: number; to: number };

const MAX = 15;
const HIGHLIGHT =
  /([+\-]?\d[\d.,]*%?|[一二两三四五六七八九十百千]+万(?:块)?|[一二三四五六七八九]千[一二三四五六七八九]?点?|满仓|清仓|割肉|追高|踏空|恐慌|追热点|涨停|跌停|韭菜|牛市|浮盈|最高点|最低点|高位)/g;

/** Split long lines at punctuation into chunks; time each chunk by character count. */
const chunkLine = (text: string, from: number, dur: number): Chunk[] => {
  const parts = text.match(/[^，。？！：；,]+[，。？！：；,]?/g) ?? [text];
  const groups: string[] = [];
  let cur = "";
  for (const p of parts) {
    if (cur && (cur + p).replace(/[，。？！：；,]/g, "").length > MAX) {
      groups.push(cur);
      cur = p;
    } else cur += p;
  }
  if (cur) groups.push(cur);
  const total = groups.reduce((a, g) => a + g.length, 0);
  let t = from;
  return groups.map((g) => {
    const d = (g.length / total) * dur;
    const c = { text: g.replace(/[，。,]$/, ""), from: t, to: t + d };
    t += d;
    return c;
  });
};

export const buildChunks = (sceneIds: string[]): Chunk[] => {
  let offset = 0;
  const out: Chunk[] = [];
  for (const id of sceneIds) {
    const s = scenes.find((x) => x.id === id)!;
    for (const l of s.lines) {
      out.push(...chunkLine(l.text, (offset + l.start) * FPS, l.duration * FPS));
    }
    offset += s.duration + SCENE_TAIL;
  }
  return out;
};

const renderRich = (text: string) =>
  text.split(HIGHLIGHT).map((seg, i) =>
    i % 2 === 1 ? (
      <span key={i} style={{ color: C.gold }}>
        {seg}
      </span>
    ) : (
      <span key={i}>{seg}</span>
    ),
  );

export const Subtitles: React.FC<{ sceneIds: string[] }> = ({ sceneIds }) => {
  const f = useCurrentFrame();
  const chunks = buildChunks(sceneIds);
  const c = chunks.find((x) => f >= x.from && f < x.to + 4);
  if (!c) return null;
  const local = f - c.from;
  const pop = interpolate(local, [0, 6], [0.86, 1], {
    ...clamp,
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });
  const op = interpolate(local, [0, 3], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1452,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          maxWidth: 980,
          padding: "14px 34px 18px",
          borderRadius: 18,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(6px)",
          fontFamily: FONT_CN,
          fontWeight: 800,
          fontSize: 60,
          lineHeight: 1.3,
          color: "#FFFFFF",
          textAlign: "center",
          letterSpacing: 1,
          textShadow: "0 3px 0 rgba(0,0,0,0.6)",
          transform: `scale(${pop})`,
          opacity: op,
        }}
      >
        {renderRich(c.text)}
      </div>
    </div>
  );
};
