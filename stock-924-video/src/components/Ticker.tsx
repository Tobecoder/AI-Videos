import { useCurrentFrame } from "remotion";
import { C, FONT_CN, FONT_NUM } from "../lib/theme";

type Item = { name: string; value: string; up: boolean };

const ITEMS: Item[] = [
  { name: "上证指数", value: "▲ 牛市", up: true },
  { name: "深证成指", value: "▲ 普涨", up: true },
  { name: "创业板指", value: "▲ 翻倍", up: true },
  { name: "券商ETF", value: "▲ 旗手", up: true },
  { name: "我的账户", value: "▼ -50,000", up: false },
  { name: "隔壁老王", value: "▲ 已提车", up: true },
  { name: "我的心态", value: "▼ 已崩", up: false },
];

/** Scrolling stock ticker at the top of the frame. Every index is up. Except me. */
export const Ticker: React.FC = () => {
  const f = useCurrentFrame();
  const itemW = 330;
  const loopW = ITEMS.length * itemW;
  const x = -((f * 2.4) % loopW);
  const row = [...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <div
      style={{
        position: "absolute",
        top: 118,
        left: 0,
        right: 0,
        height: 64,
        overflow: "hidden",
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        background: "rgba(255,255,255,0.03)",
        maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div style={{ display: "flex", transform: `translateX(${x}px)`, height: "100%" }}>
        {row.map((it, i) => (
          <div
            key={i}
            style={{
              width: itemW,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: 14,
              paddingLeft: 26,
              fontSize: 27,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontFamily: FONT_CN, color: it.up ? C.dim : C.text, fontWeight: it.up ? 500 : 800 }}>
              {it.name}
            </span>
            <span style={{ fontFamily: FONT_NUM, color: it.up ? C.up : C.down, fontWeight: 700 }}>
              {it.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
