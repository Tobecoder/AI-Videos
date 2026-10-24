import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { densify, LineChart } from "../components/LineChart";
import { Sfx } from "../components/Sfx";
import { C, clamp, EASE_OUT, FONT_CN, FONT_NUM, money, prog, rand, shake } from "../lib/theme";
import { cues } from "../lib/timeline";

// My P&L story in yuan: up to +10k, then all the way down to -50k
const PNL_KEYS = [0, 1500, 4200, 3000, 7000, 10000, 6000, 1000, -6000, -2000, -15000, -9000, -24000, -20000, -38000, -31000, -44000, -50000];
const PNL = densify(PNL_KEYS, 5, 0.3, 7);
const PEAK = 5 / (PNL_KEYS.length - 1);

// Scissors chart, in % terms: the index vs. me
const INDEX_PCT = densify([0, 22, 30, 17, 21, 24, 14, 26, 34, 40, 46], 5, 0.25, 3);
const ME_PCT = densify([0, 10, 2, -6, -12, -7, -21, -30, -26, -40, -50], 5, 0.25, 11);

const Glitchy: React.FC<{ f: number; at: number; children: React.ReactNode }> = ({ f, at, children }) => {
  const t = f - at;
  const on = t >= -2 && t < 10;
  const dx = on ? (rand(f) - 0.5) * 40 : 0;
  const dy = on ? (rand(f + 50) - 0.5) * 16 : 0;
  return (
    <div
      style={{
        transform: `translate(${dx}px, ${dy}px)`,
        filter: on ? `drop-shadow(${dx * 0.4}px 0 0 rgba(0,255,255,0.7)) drop-shadow(${-dx * 0.4}px 0 0 rgba(255,0,255,0.7))` : undefined,
      }}
    >
      {children}
    </div>
  );
};

export const HookScene: React.FC = () => {
  const f = useCurrentFrame();
  const c = cues("hook");
  const h2 = c.at("h2");
  const h3 = c.at("h3");
  const h4 = c.at("h4");
  const crashStart = h2 + 6;
  const crashEnd = h2 + 50;

  // ---------------- Phase A: account counter
  const up = prog(f, 4, c.end("h1") - 8);
  const crash = interpolate(f, [crashStart, crashEnd], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.55, 0, 0.6, 1),
  });
  const value = f < crashStart ? 10000 * up : 10000 - 60000 * crash;
  const chartP = f < crashStart ? PEAK * up : PEAK + (1 - PEAK) * crash;
  const pos = value >= 0;
  const aOut = prog(f, h3 - 4, h3 + 8);
  const sh = shake(f, crashEnd, 30, 20);
  const flash = f < h2 ? 0 : interpolate(f, [h2, h2 + 7], [0.55, 0], clamp);

  // ---------------- Phase B: index vs me
  const bIn = prog(f, h3, h3 + 14);
  const bOut = prog(f, h4 - 4, h4 + 8);
  const idxVal = interpolate(prog(f, h3 + 8, h3 + 70), [0, 1], [2748, 4000]);
  const meVal = interpolate(prog(f, h3 + 8, h3 + 70), [0, 1], [10000, -50000]);
  const scissors = prog(f, h3 + 14, h4 - 14, Easing.inOut(Easing.quad));

  // ---------------- Phase C: title slam
  const h4Dur = c.end("h4") - h4;
  const stampAt = h4 + Math.round(h4Dur * 0.5);
  const slamAt = h4 + 16;
  const sh2 = shake(f, slamAt + 4, 34, 18);
  const sh3 = shake(f, stampAt + 4, 16, 12);

  return (
    <AbsoluteFill style={{ fontFamily: FONT_CN, color: C.text }}>
      <Backdrop glow={f < h2 ? "rgba(255,59,59,0.20)" : "rgba(20,199,116,0.16)"} />

      {/* ============ Phase A ============ */}
      {f < h3 + 10 && (
        <AbsoluteFill
          style={{
            opacity: 1 - aOut,
            transform: `translate(${sh.x}px, ${sh.y}px) scale(${1 - aOut * 0.12})`,
          }}
        >
          <div style={{ position: "absolute", top: 300, left: 80, right: 80, display: "flex", alignItems: "center", gap: 18, opacity: prog(f, 0, 10) }}>
            <div style={{ fontSize: 40, fontWeight: 700, color: C.dim }}>我的A股账户</div>
            <div style={{ fontSize: 28, fontWeight: 700, padding: "6px 16px", borderRadius: 10, border: `2px solid ${C.border}`, color: C.dim }}>
              2024.09.24 起
            </div>
            <div style={{ flex: 1 }} />
            <div
              style={{
                fontSize: 32,
                fontWeight: 900,
                padding: "8px 20px",
                borderRadius: 12,
                color: "#fff",
                background: pos ? C.up : C.down,
                transform: `rotate(${pos ? 3 : -4}deg) scale(${f >= crashEnd && f < crashEnd + 8 ? 1.25 : 1})`,
                opacity: f > 30 ? 1 : 0,
              }}
            >
              {pos ? "股神附体" : "韭菜本菜"}
            </div>
          </div>

          <Glitchy f={f} at={h2}>
            <div style={{ position: "absolute", top: 380, left: 0, right: 0, textAlign: "center" }}>
              <span
                style={{
                  fontFamily: FONT_NUM,
                  fontWeight: 700,
                  fontSize: 220,
                  letterSpacing: -4,
                  color: pos ? C.up : C.down,
                  textShadow: `0 0 60px ${pos ? "rgba(255,59,59,0.55)" : "rgba(20,199,116,0.55)"}`,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                <span style={{ fontSize: 110, marginRight: 10 }}>¥</span>
                {money(value)}
              </span>
            </div>
          </Glitchy>
          <div style={{ position: "absolute", top: 650, left: 0, right: 0, textAlign: "center", fontSize: 34, color: C.dim, letterSpacing: 6 }}>
            累计盈亏（元）
          </div>

          <div style={{ position: "absolute", top: 780, left: 70 }}>
            <LineChart id="pnl" values={PNL} min={-55000} max={14000} width={940} height={520} progress={chartP} />
          </div>
        </AbsoluteFill>
      )}

      {/* white flash on "现在" */}
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flash, pointerEvents: "none" }} />

      {/* ============ Phase B ============ */}
      {f >= h3 - 2 && f < h4 + 10 && (
        <AbsoluteFill style={{ opacity: bIn * (1 - bOut), transform: `translateY(${(1 - bIn) * 60}px) scale(${1 - bOut * 0.1})` }}>
          <div style={{ position: "absolute", top: 270, left: 0, right: 0, textAlign: "center", fontSize: 72, fontWeight: 900, color: C.gold, letterSpacing: 4 }}>
            {"最离谱的是……".slice(0, Math.ceil(prog(f, h3, h3 + 18, Easing.linear) * 7))}
          </div>

          {[
            { label: "上证指数", val: Math.round(idxVal).toLocaleString("en-US"), sub: "▲ 一度站上4000点", col: C.up, x: 70 },
            { label: "我的账户", val: money(meVal), sub: "▼ 从+1万到-5万", col: meVal >= 0 ? C.up : C.down, x: 555 },
          ].map((card, i) => {
            const e = prog(f, h3 + 4 + i * 6, h3 + 22 + i * 6);
            return (
              <div
                key={card.label}
                style={{
                  position: "absolute",
                  top: 410,
                  left: card.x,
                  width: 455,
                  height: 330,
                  borderRadius: 28,
                  background: C.panel,
                  border: `2px solid ${card.col}55`,
                  boxShadow: `0 0 60px ${card.col}22 inset`,
                  padding: "34px 36px",
                  boxSizing: "border-box",
                  opacity: e,
                  transform: `translateY(${(1 - e) * 80}px)`,
                }}
              >
                <div style={{ fontSize: 40, fontWeight: 700, color: C.dim }}>{card.label}</div>
                <div style={{ fontFamily: FONT_NUM, fontWeight: 700, fontSize: 100, color: card.col, marginTop: 28, marginLeft: i === 1 ? 26 : 0, letterSpacing: -2, fontVariantNumeric: "tabular-nums" }}>
                  {card.val}
                </div>
                <div style={{ fontSize: 34, fontWeight: 800, color: card.col, marginTop: 18 }}>{card.sub}</div>
              </div>
            );
          })}
          <div
            style={{
              position: "absolute",
              top: 535,
              left: 490,
              width: 100,
              height: 100,
              borderRadius: 50,
              background: C.bg,
              border: `3px solid ${C.gold}`,
              color: C.gold,
              fontFamily: FONT_NUM,
              fontWeight: 800,
              fontSize: 42,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${prog(f, h3 + 16, h3 + 28, Easing.bezier(0.34, 1.56, 0.64, 1))})`,
            }}
          >
            VS
          </div>

          <div style={{ position: "absolute", top: 800, left: 70, width: 940, height: 520 }}>
            <LineChart id="idx" values={INDEX_PCT} min={-55} max={52} width={940} height={520} progress={scissors} color={C.up} area={false} />
            <LineChart id="me" values={ME_PCT} min={-55} max={52} width={940} height={520} progress={scissors} color={C.down} area={false} zeroLine={false} style={{ position: "absolute", left: 0, top: 0 }} />
            {[
              { t: "大盘 ▲", col: C.up, top: 0 },
              { t: "我 ▼", col: C.down, top: 470 },
            ].map((l) => (
              <div
                key={l.t}
                style={{
                  position: "absolute",
                  right: -10,
                  top: l.top - 20,
                  fontSize: 44,
                  fontWeight: 900,
                  color: l.col,
                  opacity: prog(f, h4 - 20, h4 - 10),
                  transform: `translateX(${(1 - prog(f, h4 - 20, h4 - 10)) * 30}px)`,
                }}
              >
                {l.t}
              </div>
            ))}
            <div style={{ position: "absolute", left: 0, top: 540, fontSize: 28, color: C.dim }}>2024.9.24</div>
            <div style={{ position: "absolute", right: 0, top: 540, fontSize: 28, color: C.dim }}>至今</div>
          </div>
        </AbsoluteFill>
      )}

      {/* ============ Phase C ============ */}
      {f >= h4 - 2 && (
        <AbsoluteFill style={{ transform: `translate(${sh2.x + sh3.x}px, ${sh2.y + sh3.y}px)` }}>
          {Array.from({ length: 16 }).map((_, i) => {
            const x = rand(i + 1) * 1000;
            const speed = 4 + rand(i + 9) * 6;
            const y = -150 + ((f - h4) * speed + rand(i + 3) * 1900) % 2100;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  fontSize: 60 + rand(i + 5) * 60,
                  opacity: 0.22 * prog(f, h4, h4 + 15),
                  transform: `rotate(${(f - h4) * (rand(i + 7) - 0.5) * 6}deg)`,
                }}
              >
                🥬
              </div>
            );
          })}

          <div style={{ position: "absolute", top: 330, left: 0, right: 0, textAlign: "center" }}>
            <div style={{ fontSize: 64, fontWeight: 700, color: C.dim, letterSpacing: 16, opacity: prog(f, h4, h4 + 10), transform: `translateY(${(1 - prog(f, h4, h4 + 12)) * 30}px)` }}>
              924行情以来
            </div>
            <div
              style={{
                marginTop: 30,
                fontSize: 120,
                fontWeight: 900,
                opacity: prog(f, h4 + 5, h4 + 14),
                transform: `translateX(${(1 - prog(f, h4 + 5, h4 + 18)) * -120}px)`,
              }}
            >
              我从赚<span style={{ color: C.up, fontSize: 170, textShadow: `0 0 50px ${C.up}88` }}>1万</span>
            </div>
            <div
              style={{
                marginTop: -10,
                fontSize: 120,
                fontWeight: 900,
                opacity: prog(f, slamAt - 2, slamAt + 2),
                transform: `scale(${interpolate(f, [slamAt - 2, slamAt + 6], [2.4, 1], { ...clamp, easing: EASE_OUT })})`,
              }}
            >
              到亏<span style={{ color: C.down, fontSize: 230, textShadow: `0 0 60px ${C.down}99` }}>5万</span>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              top: 1060,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              opacity: prog(f, stampAt - 1, stampAt + 2),
              transform: `rotate(-7deg) scale(${interpolate(f, [stampAt - 1, stampAt + 7], [2.6, 1], { ...clamp, easing: EASE_OUT })})`,
            }}
          >
            <div
              style={{
                border: `8px solid ${C.up}`,
                borderRadius: 18,
                padding: "16px 44px 20px",
                color: C.up,
                fontSize: 96,
                fontWeight: 900,
                letterSpacing: 10,
                background: "rgba(255,59,59,0.08)",
                boxShadow: `0 0 50px ${C.up}55`,
              }}
            >
              🥬 韭菜炼成记
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ============ SFX ============ */}
      {Array.from({ length: 22 }).map((_, i) => (
        <Sfx key={i} src="tick" at={6 + i * 4} volume={0.12} />
      ))}
      <Sfx src="cash" at={c.end("h1") - 14} volume={0.55} />
      <Sfx src="glitch" at={h2 - 2} volume={0.5} />
      <Sfx src="boom" at={h2} volume={0.7} />
      <Sfx src="trombone" at={crashStart} volume={0.42} />
      <Sfx src="whoosh" at={h3 - 6} volume={0.35} />
      <Sfx src="pop" at={h3 + 16} volume={0.4} />
      <Sfx src="whoosh_down" at={h4 - 8} volume={0.35} />
      <Sfx src="stamp" at={slamAt + 2} volume={0.7} />
      <Sfx src="stamp" at={stampAt + 2} volume={0.8} />
    </AbsoluteFill>
  );
};
