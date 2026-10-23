# -*- coding: utf-8 -*-
"""
DP 动态规划入门动画 (≈28.5s, 1920x1080, 30fps)
用法:
  python dp_anim.py                # 渲染完整视频 dp_intro.mp4
  python dp_anim.py preview 2 6 12 # 导出指定秒数的关键帧 PNG 预览
"""
import math, os, sys, wave, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H, S, FPS = 1920, 1080, 2, 30          # S = 超采样倍数（抗锯齿）
DUR = 28.5
OUT_DIR = os.path.dirname(os.path.abspath(__file__))

FONT_B = "C:/Windows/Fonts/msyhbd.ttc"
FONT_R = "C:/Windows/Fonts/msyh.ttc"
FONT_M = "C:/Windows/Fonts/consolab.ttf"

# ---------- 调色板 ----------
BG1 = (12, 14, 34); BG2 = (26, 20, 58)
CYAN = (76, 201, 240); PINK = (247, 37, 133); YEL = (255, 209, 102)
GRN = (6, 214, 160); WHITE = (240, 242, 255); GREY = (150, 156, 192)
CELL = (28, 32, 68); CELL_LINE = (72, 78, 135); DARK = (14, 16, 36)

# ---------- 缓动 ----------
def clamp(x, a=0.0, b=1.0): return max(a, min(b, x))
def p(t, a, d): return clamp((t - a) / d)
def eo(x): return 1 - (1 - x) ** 3
def eio(x): return 4 * x ** 3 if x < .5 else 1 - (-2 * x + 2) ** 3 / 2
def back(x, s=1.9):
    if x <= 0: return 0.0
    c3 = s + 1
    return 1 + c3 * (x - 1) ** 3 + s * (x - 1) ** 2
def lerp(a, b, u): return a + (b - a) * u
def mix(c1, c2, u): return tuple(int(lerp(a, b, clamp(u))) for a, b in zip(c1, c2))

_fc = {}
def font(size, kind="b"):
    px = max(1, int(round(size * S)))
    key = (kind, px)
    if key not in _fc:
        _fc[key] = ImageFont.truetype({"b": FONT_B, "r": FONT_R, "m": FONT_M}[kind], px)
    return _fc[key]

# ---------- 画布封装（逻辑坐标 1920x1080，自动乘超采样） ----------
class Cv:
    def __init__(s, img):
        s.img = img; s.d = ImageDraw.Draw(img, "RGBA"); s.ga = 1.0; s.ox = 0; s.oy = 0
    def c(s, col, a=1.0): return (col[0], col[1], col[2], int(255 * clamp(a * s.ga)))
    def P(s, x, y): return ((x + s.ox) * S, (y + s.oy) * S)
    def text(s, x, y, txt, size, col, a=1, kind="b", anchor="mm"):
        # Pillow 的 text 不支持半透明混合，这里用 L 遮罩手动合成以支持淡入淡出
        al = clamp(a * s.ga)
        if al <= 0.004 or size < 2: return
        f = font(size, kind); X, Y = s.P(x, y); X, Y = int(round(X)), int(round(Y))
        l, t, r, b = f.getbbox(txt, anchor=anchor)
        if r <= l or b <= t: return
        m = Image.new("L", (r - l, b - t), 0)
        ImageDraw.Draw(m).text((-l, -t), txt, font=f, fill=int(255 * al), anchor=anchor)
        s.img.paste(tuple(col[:3]), (X + l, Y + t, X + r, Y + b), m)
    def runs(s, x, y, runs, size, a=1, kind="b", align="center"):
        runs = [(r[0], r[1], r[2] if len(r) > 2 else kind) for r in runs]   # 每段可单独指定字体
        total = sum(font(size, k).getlength(t) for t, _, k in runs) / S
        cx = x - total / 2 if align == "center" else x
        for t, col, k in runs:
            s.text(cx, y, t, size, col, a, k, anchor="lm")
            cx += font(size, k).getlength(t) / S
    def hgrad(s, x0, y0, x1, y1, c1, c2, a=1):
        al = clamp(a * s.ga); X0, Y0 = map(int, s.P(x0, y0)); X1, Y1 = map(int, s.P(x1, y1))
        if al <= 0.004 or X1 <= X0: return
        u = np.linspace(0, 1, X1 - X0)[None, :, None]
        arr = (np.array(c1) * (1 - u) + np.array(c2) * u).repeat(Y1 - Y0, 0).astype(np.uint8)
        s.img.paste(Image.fromarray(arr, "RGB"), (X0, Y0), Image.new("L", (X1 - X0, Y1 - Y0), int(255 * al)))
    def circle(s, x, y, r, fill=None, a=1, outline=None, w=0):
        if r <= 0 or a * s.ga <= 0.004: return
        X, Y = s.P(x, y); R = r * S
        s.d.ellipse((X - R, Y - R, X + R, Y + R), fill=s.c(fill, a) if fill else None,
                    outline=s.c(outline, a) if outline else None, width=int(w * S))
    def ellipse(s, x, y, rx, ry, fill, a=1):
        X, Y = s.P(x, y)
        s.d.ellipse((X - rx * S, Y - ry * S, X + rx * S, Y + ry * S), fill=s.c(fill, a))
    def rrect(s, x0, y0, x1, y1, r, fill=None, a=1, outline=None, w=0):
        if a * s.ga <= 0.004 or x1 <= x0 or y1 <= y0: return
        X0, Y0 = s.P(x0, y0); X1, Y1 = s.P(x1, y1)
        s.d.rounded_rectangle((X0, Y0, X1, Y1), radius=min(r * S, (X1 - X0) / 2, (Y1 - Y0) / 2),
                              fill=s.c(fill, a) if fill else None,
                              outline=s.c(outline, a) if outline else None, width=int(w * S))
    def line(s, pts, col, w, a=1):
        if a * s.ga <= 0.004 or len(pts) < 2: return
        s.d.line([s.P(*q) for q in pts], fill=s.c(col, a), width=max(1, int(w * S)), joint="curve")
    def poly(s, pts, col, a=1):
        if a * s.ga <= 0.004: return
        s.d.polygon([s.P(*q) for q in pts], fill=s.c(col, a))
    def glow(s, x, y, r, col, a=1, n=7):
        for k in range(n, 0, -1):
            s.circle(x, y, r * (1 + k * 0.22), col, a * 0.07)

# ---------- 背景 ----------
_BG = None
def background():
    global _BG
    if _BG is None:
        h, w = H * S, W * S
        y = np.linspace(0, 1, h)[:, None, None]
        x = np.linspace(0, 1, w)[None, :, None]
        arr = np.array(BG1) * (1 - y) + np.array(BG2) * y
        d = np.sqrt(((x - .5) * 1.6) ** 2 + (y - .45) ** 2)
        arr = arr * (1.12 - 0.45 * d) + np.array([20, 30, 70]) * np.clip(0.35 - d, 0, 1)
        img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")
        dr = ImageDraw.Draw(img, "RGBA")
        for gx in range(0, W + 1, 60):
            for gy in range(0, H + 1, 60):
                r = 1.6 * S
                dr.ellipse((gx * S - r, gy * S - r, gx * S + r, gy * S + r), fill=(255, 255, 255, 16))
        _BG = img
    return _BG.copy()

def heading(c, t, txt, t0=0.0):
    q = eo(p(t, t0, 0.5))
    c.rrect(132, 130 - 30 * q, 140, 130 + 30 * q, 3, CYAN, a=q)
    c.text(160 + lerp(-30, 0, q), 130, txt, 58, WHITE, q, anchor="lm")

def scene_out(c, t, start, dur=0.4):
    o = eio(p(t, start, dur)); c.ga = 1 - o; c.oy = -30 * o

# ======================= 场景 1：标题 (0 - 3.5s) =======================
_rng = np.random.default_rng(7)
FLOATS = [(float(_rng.uniform(80, 1840)), float(_rng.uniform(80, 1100)),
           [1, 1, 2, 3, 5, 8, 13, 21, 34, 55][i % 10], float(_rng.uniform(26, 60)),
           float(_rng.uniform(0.6, 1.6)), float(_rng.uniform(0, 6.28))) for i in range(22)]

def s1(c, t):
    scene_out(c, t, 3.05, 0.45)
    fa = eo(p(t, 0, 1.0))
    for x, y, n, sz, sp, ph in FLOATS:
        col = [CYAN, PINK, YEL, GRN][n % 4]
        c.text(x + math.sin(t * .8 + ph) * 12, y - t * sp * 22, str(n), sz, col, 0.10 * fa, "m")
    for k in range(3):
        q = eo(p(t, 0.15 + 0.15 * k, 1.6))
        c.circle(960, 500, lerp(60, 360 + k * 110, q), None, 0.35 * (1 - q) + 0.06, CYAN, 2)
    q = p(t, 0.2, 0.7)
    if q > 0:
        sz = 150 * lerp(0.6, 1.0, back(q)); a = p(t, 0.2, 0.25)
        c.text(960, 476, "动态规划", sz, (0, 0, 0), 0.35 * a)
        c.text(960, 470, "动态规划", sz, WHITE, a)
    w = 440 * eo(p(t, 0.7, 0.6))
    c.hgrad(960 - w / 2, 566, 960 + w / 2, 574, CYAN, PINK)
    q2 = eo(p(t, 0.9, 0.5))
    c.text(960, 628 + 20 * (1 - q2), "Dynamic Programming", 44, GREY, q2, "m")
    q3 = p(t, 1.3, 0.5)
    if q3 > 0:
        b = back(q3)
        c.rrect(960 - 120 * b, 725 - 34 * b, 960 + 120 * b, 725 + 34 * b, 34, PINK)
        c.text(960, 724, "30 秒入门", 32 * b, WHITE)

# ======================= 场景 2：问题 (3.5 - 9s) =======================
X0, FLOOR, SW, SH, NST, BR = 600, 920, 170, 90, 5, 26
JUMPS = [(0, 1), (1, 3), (3, 4), (4, 5)]
JS, JI, JD = 1.3, 0.7, 0.5

def step_pos(k): return (X0 + (k - 0.5) * SW, FLOOR - k * SH - BR)
def jump_pt(a, b, u):
    xa, ya = step_pos(a); xb, yb = step_pos(b)
    hgt = 110 if b - a == 1 else 160
    return lerp(xa, xb, u), lerp(ya, yb, u) - hgt * 4 * u * (1 - u)

def s2(c, t):
    scene_out(c, t, 5.1)
    heading(c, t, "问题：爬楼梯")
    qa = eo(p(t, 0.3, 0.4))
    c.runs(160 + lerp(-20, 0, qa), 215, [("每次只能走 ", WHITE), ("1 阶", CYAN), (" 或 ", WHITE),
           ("2 阶", PINK), ("，走到第 n 阶共有几种走法？", WHITE)], 36, qa, align="left")
    c.line([(300, FLOOR), (1620, FLOOR)], GREY, 2, 0.35 * eo(p(t, 0.3, 0.5)))
    c.text(X0 - SW / 2, FLOOR + 40, "起点", 28, GREY, eo(p(t, 0.5, 0.4)))
    for k in range(1, NST + 1):
        q = eo(p(t, 0.45 + 0.1 * k, 0.5))
        if q <= 0: continue
        xl, xr = X0 + (k - 1) * SW, X0 + k * SW
        top = FLOOR - k * SH * q
        c.rrect(xl, top, xr, FLOOR, 0, (34, 38, 84))
        c.line([(xl, top), (xr, top)], CYAN, 4)
        c.text((xl + xr) / 2, top + 42, str(k), 34, GREY, q, "m")
    qf = back(p(t, 1.1, 0.5))
    if qf > 0:
        fx, fy = X0 + NST * SW - 26, FLOOR - NST * SH
        c.line([(fx, fy), (fx, fy - 90 * qf)], WHITE, 4)
        c.poly([(fx, fy - 90 * qf), (fx + 50 * qf, fy - 72 * qf), (fx, fy - 54 * qf)], PINK)
    # 小球
    if t < 1.0: return
    bx, by = step_pos(0); land = None
    for j, (a, b) in enumerate(JUMPS):
        s0 = JS + JI * j
        if t >= s0:
            u = clamp((t - s0) / JD)
            for i in range(0, int(u * 20) + 1):          # 轨迹虚点
                px, py = jump_pt(a, b, i / 20)
                c.circle(px, py, 4, YEL, 0.35)
            q = back(p(t, s0 + 0.12, 0.35))
            if q > 0:
                mx, my = jump_pt(a, b, 0.5)
                c.text(mx, my - 50, "+%d" % (b - a), 40 * q, CYAN if b - a == 1 else PINK, 1, "m")
            bx, by = jump_pt(a, b, u)
            if u >= 1: land = s0 + JD
    sq = 0.0
    if land is not None and t - land < 0.18: sq = math.sin(math.pi * (t - land) / 0.18) * 0.28
    pop = back(p(t, 1.0, 0.35))
    rx, ry = BR * pop * (1 + sq), BR * pop * (1 - sq)
    c.glow(bx, by + BR * sq, BR * pop, YEL, 1)
    c.ellipse(bx, by + BR * sq, rx, ry, YEL)
    c.circle(bx - rx * 0.3, by + BR * sq - ry * 0.35, ry * 0.28, WHITE, 0.7)
    qe = eo(p(t, 3.95, 0.4))
    c.runs(960, 1005 + 15 * (1 - qe), [("其中一种：", GREY), ("1 + 2 + 1 + 1", YEL),
           ("    那么总共有几种？", WHITE)], 36, qe)

# ======================= 场景 3：暴力递归 (9 - 14.5s) =======================
NODES, EDGES = [], []
def _build(n, lvl, slot, parent):
    idx = len(NODES); NODES.append((n, lvl, slot))
    if parent is not None: EDGES.append((parent, idx))
    if lvl < 3 and n >= 2:
        _build(n - 1, lvl + 1, 2 * slot, idx); _build(n - 2, lvl + 1, 2 * slot + 1, idx)
_build(5, 0, 0, None)
def npos(i):
    _, lvl, slot = NODES[i]; wd = 1600 / (2 ** lvl)
    return 160 + (slot + 0.5) * wd, 380 + lvl * 140
NR = 40

def s3(c, t):
    scene_out(c, t, 5.1)
    heading(c, t, "暴力递归")
    qa = eo(p(t, 0.25, 0.4))
    c.runs(450, 132, [("f(n)", YEL), (" = ", WHITE), ("f(n-1)", CYAN), (" + ", WHITE), ("f(n-2)", PINK)],
           44, qa, "m", align="left")
    qb = eo(p(t, 0.45, 0.4))
    c.text(160, 215, "最后一步：要么从第 n-1 阶走 1 步，要么从第 n-2 阶走 2 步", 32, GREY, qb, anchor="lm")
    hq = eo(p(t, 2.9, 0.4))
    for pi, ci in EDGES:
        lvl = NODES[ci][1]; tk = 0.6 + 0.5 * lvl
        q = eo(p(t, tk - 0.25, 0.3))
        if q <= 0: continue
        (x1, y1), (x2, y2) = npos(pi), npos(ci)
        L = math.hypot(x2 - x1, y2 - y1); ux, uy = (x2 - x1) / L, (y2 - y1) / L
        sx, sy = x1 + ux * NR, y1 + uy * NR
        ex, ey = x2 - ux * NR, y2 - uy * NR
        c.line([(sx, sy), (lerp(sx, ex, q), lerp(sy, ey, q))], CELL_LINE, 3, 1 - 0.4 * hq)
    for i, (n, lvl, slot) in enumerate(NODES):
        tk = 0.6 + 0.5 * lvl
        q = p(t, tk, 0.35)
        if q <= 0: continue
        b = back(q); x, y = npos(i); r = NR * b
        hl = {3: PINK, 2: YEL}.get(n)
        if hl and hq > 0:
            ph = ((t - 2.9) / 0.9) % 1.0
            c.circle(x, y, r + 26 * ph, None, (1 - ph) * hq, hl, 3)
            c.glow(x, y, r, hl, hq)
        dim = 1 - 0.5 * hq if not hl else 1
        fill = mix((30, 34, 74), hl, hq) if hl else (30, 34, 74)
        c.circle(x, y, r, fill, dim, mix(CYAN, hl, hq) if hl else CYAN, 3)
        c.text(x, y, "f(%d)" % n, 28 * b, mix(WHITE, DARK, hq) if hl else WHITE, dim, "m")
    qe = eo(p(t, 3.3, 0.4))
    c.runs(960, 920 + 15 * (1 - qe), [("f(3)", PINK), (" 算了 2 次，", WHITE), ("f(2)", YEL),
           (" 算了 3 次……  重复计算，指数级爆炸 ", WHITE), ("O(2ⁿ)", PINK)], 36, qe)

# ======================= 场景 4：动态规划填表 (14.5 - 24s) =======================
VALS = [1, 1, 2, 3, 5, 8, 13, 21]
CW, GAP, CX0, CTOP = 150, 30, 285, 580
CBOT = CTOP + CW
ST = {2: 2.7, 3: 3.7, 4: 4.55, 5: 5.25, 6: 5.85, 7: 6.4}
SD = {2: 1.0, 3: 0.85, 4: 0.7, 5: 0.6, 6: 0.55, 7: 0.6}
FT = {0: 1.8, 1: 2.0, **{i: ST[i] + 0.45 * SD[i] for i in ST}}
def cx(i): return CX0 + i * (CW + GAP) + CW / 2

def bez(p0, p1, p2, u):
    return ((1 - u) ** 2 * p0[0] + 2 * (1 - u) * u * p1[0] + u * u * p2[0],
            (1 - u) ** 2 * p0[1] + 2 * (1 - u) * u * p1[1] + u * u * p2[1])

def arc(c, x0, x1, hgt, col, prog, a):
    if prog <= 0 or a <= 0: return
    y = CTOP - 10
    p0, p2 = (x0, y), (x1, y); p1 = ((x0 + x1) / 2, y - 2 * hgt)
    n = max(2, int(40 * prog))
    pts = [bez(p0, p1, p2, prog * k / n) for k in range(n + 1)]
    c.line(pts, col, 5, a)
    ex, ey = pts[-1]; tx, ty = bez(p0, p1, p2, max(0, prog - 0.04))
    L = math.hypot(ex - tx, ey - ty) or 1; ux, uy = (ex - tx) / L, (ey - ty) / L
    sz = 20
    c.poly([(ex + ux * 6, ey + uy * 6), (ex - ux * sz - uy * sz * .6, ey - uy * sz + ux * sz * .6),
            (ex - ux * sz + uy * sz * .6, ey - uy * sz - ux * sz * .6)], col, a)

def s4(c, t):
    scene_out(c, t, 9.1)
    heading(c, t, "动态规划：把答案记下来")
    qa = eo(p(t, 0.25, 0.4))
    c.text(160, 215, "从小到大计算，每个子问题只算一次，后面直接查表复用", 32, GREY, qa, anchor="lm")
    qf = p(t, 0.4, 0.5)
    if qf > 0:
        c.runs(960, 375, [("dp[i]", YEL), (" = ", WHITE), ("dp[i-1]", CYAN), (" + ", WHITE), ("dp[i-2]", PINK)],
               60 * lerp(0.7, 1, back(qf)), p(t, 0.4, 0.2), "m")
    ql = eo(p(t, 0.8, 0.4))
    c.text(222, CTOP + CW / 2, "dp", 40, GREY, ql, "m")
    c.text(222, CBOT + 42, "i", 30, GREY, ql, "m")
    cur = max([i for i in ST if t >= ST[i]], default=None)
    # 当前步骤的箭头
    for i in ST:
        s0, d = ST[i], SD[i]
        pr = eio(p(t, s0, 0.45 * d)); fa = 1 - p(t, FT[i] + 0.15, 0.3)
        arc(c, cx(i - 2), cx(i) + 16, 75, PINK, pr, fa)
        arc(c, cx(i - 1), cx(i) - 16, 42, CYAN, pr, fa)
    for i in range(8):
        q = eo(p(t, 0.8 + 0.06 * i, 0.4))
        if q <= 0: continue
        x0 = CX0 + i * (CW + GAP); dy = 30 * (1 - q)
        filled = t >= FT[i]; fq = p(t, FT[i], 0.3)
        fill = mix(CELL, (18, 62, 74), fq) if filled else CELL
        outl = mix(CELL_LINE, GRN, fq) if filled else CELL_LINE; ow = 3
        if cur is not None and ST[cur] <= t < FT[cur] + 0.25:
            if i == cur - 1: outl, ow = CYAN, 6
            elif i == cur - 2: outl, ow = PINK, 6
            elif i == cur: outl, ow = YEL, 6
        if i == 7 and t > 7.0:
            g = 0.6 + 0.4 * math.sin((t - 7.0) * 6)
            for k in range(6, 0, -1):
                e = k * 7
                c.rrect(x0 - e, CTOP - e, x0 + CW + e, CBOT + e, 18 + e, YEL, 0.06 * g * p(t, 7.0, 0.3))
        c.rrect(x0, CTOP + dy, x0 + CW, CBOT + dy, 18, fill, q, outl, ow)
        if filled:
            c.rrect(x0, CTOP, x0 + CW, CBOT, 18, YEL, 0.55 * (1 - p(t, FT[i], 0.5)))
            c.text(cx(i), CTOP + CW / 2, str(VALS[i]), 60 * back(fq), WHITE, 1, "m")
        c.text(cx(i), CBOT + 42 + dy, str(i), 30, GREY, q, "m")
    # 初始值标注
    qi = eo(p(t, 1.9, 0.3)) * (1 - p(t, 2.55, 0.25))
    if qi > 0:
        c.line([(CX0, CTOP - 22), (CX0, CTOP - 32), (CX0 + 2 * CW + GAP, CTOP - 32), (CX0 + 2 * CW + GAP, CTOP - 22)], GRN, 3, qi)
        c.text(CX0 + CW + GAP / 2, CTOP - 62, "初始值", 28, GRN, qi)
    # 底部算式
    if cur is None:
        qe = eo(p(t, 1.9, 0.3))
        c.runs(960, 850, [("dp[0] = dp[1] = 1", GRN), ("   （原地不动 / 只走 1 阶，各 1 种）", GREY, "b")], 36, qe, "m")
    else:
        i = cur; qe = eo(p(t, ST[i], 0.2))
        rr = [("dp[%d]" % i, YEL), (" = ", WHITE), (str(VALS[i - 1]), CYAN), (" + ", WHITE), (str(VALS[i - 2]), PINK)]
        if t >= FT[i]: rr += [(" = ", WHITE), (str(VALS[i]), YEL)]
        c.runs(960, 850 + 10 * (1 - qe), rr, 48, qe, "m")
    qz = eo(p(t, 7.2, 0.4))
    c.runs(960, 960 + 15 * (1 - qz), [("第 7 阶共有 ", WHITE), ("21", YEL), (" 种走法  ·  只需计算 n 次 ", WHITE),
           ("O(n)", GRN)], 40, qz)

# ======================= 场景 5：总结 (24 - 28.5s) =======================
CARDS = [(CYAN, "定义状态", ("dp[i] 表示什么", "b"), ("到第 i 阶的走法数", "b")),
         (YEL, "状态转移", ("dp[i]=dp[i-1]+dp[i-2]", "m"), ("大问题由小问题推出", "b")),
         (PINK, "初始值 + 填表", ("dp[0] = dp[1] = 1", "m"), ("从小到大依次计算", "b"))]

def s5(c, t):
    c.ga = 1; c.oy = 0
    q = p(t, 0, 0.5)
    if q > 0: c.text(960, 220, "DP 三步走", 72 * lerp(0.7, 1, back(q)), WHITE, p(t, 0, 0.2))
    for k, (col, title, l1, l2) in enumerate(CARDS):
        q = eo(p(t, 0.35 + 0.3 * k, 0.5))
        if q <= 0: continue
        x = 430 + 530 * k; y = 530 + 40 * (1 - q)
        c.rrect(x - 235, y - 140, x + 235, y + 140, 24, (30, 34, 72), q, col, 3)
        c.circle(x, y - 140, 36 * back(p(t, 0.45 + 0.3 * k, 0.4)), col, q)
        c.text(x, y - 140, str(k + 1), 36, DARK, q, "m")
        c.text(x, y - 45, title, 44, WHITE, q)
        c.text(x, y + 35, l1[0], 28 if l1[1] == "m" else 28, col, q, l1[1])
        c.text(x, y + 85, l2[0], 26, GREY, q, l2[1] if l2[1] != "b" else "r")
        if k > 0:
            ax = x - 265
            c.poly([(ax - 10, y - 16), (ax + 12, y), (ax - 10, y + 16)], GREY, q)
    qe = eo(p(t, 1.6, 0.5))
    c.runs(960, 810 + 15 * (1 - qe), [("核心思想：", GREY), ("拆成子问题", CYAN), ("  +  ", WHITE), ("记住答案", YEL),
           ("  =  ", WHITE), ("不重复计算", GRN)], 42, qe)

SCENES = [(0.0, 3.5, s1), (3.5, 9.0, s2), (9.0, 14.5, s3), (14.5, 24.0, s4), (24.0, DUR, s5)]

def render(t):
    img = background(); c = Cv(img)
    for a, b, fn in SCENES:
        if a <= t < b or (fn is s5 and t >= a):
            fn(c, t - a); break
    c.ga = 1; c.oy = 0
    # 底部进度条
    c.rrect(0, H - 6, W, H, 0, WHITE, 0.06)
    c.rrect(0, H - 6, W * t / DUR, H, 0, CYAN, 0.8)
    # 片头淡入 / 片尾淡出
    fade = max(1 - p(t, 0, 0.3), p(t, DUR - 0.5, 0.5))
    if fade > 0: c.rrect(0, 0, W, H, 0, (0, 0, 0), fade)
    return img.reduce(S)

def render_bytes(i): return render(i / FPS).tobytes()

# ======================= 音效 =======================
SR = 44100
def synth_audio(path):
    n = int(SR * DUR) + SR; buf = np.zeros(n)
    def add(t0, sig):
        i = int(t0 * SR); buf[i:i + len(sig)] += sig[:max(0, n - i)]
    def pop(f, vol=0.30, d=0.16):
        tt = np.arange(int(SR * d)) / SR
        ph = 2 * np.pi * np.cumsum(f * (1 + 0.6 * np.exp(-tt * 45))) / SR
        return vol * np.sin(ph) * np.exp(-tt * 28) * np.minimum(1, tt * 800)
    def boing(vol=0.22):
        tt = np.arange(int(SR * 0.22)) / SR
        ph = 2 * np.pi * np.cumsum(260 + 900 * tt) / SR
        return vol * np.sin(ph) * np.exp(-tt * 14) * np.minimum(1, tt * 600)
    def whoosh(vol=0.18, d=0.5):
        m = int(SR * d); nz = np.random.default_rng(1).standard_normal(m + 64)
        k = np.ones(48) / 48; nz = np.convolve(nz, k, "same")[:m]
        u = np.linspace(0, 1, m); return vol * 6 * nz * np.sin(np.pi * u) ** 2
    def chime(f, vol=0.18, d=1.4):
        tt = np.arange(int(SR * d)) / SR
        s = sum(np.sin(2 * np.pi * f * h * tt) / (i + 1) for i, h in enumerate([1, 1.5, 2, 3]))
        return vol * s * np.exp(-tt * 3) * np.minimum(1, tt * 300)
    # 背景垫音
    tt = np.arange(int(SR * DUR)) / SR
    pad = sum(np.sin(2 * np.pi * f * tt + i) for i, f in enumerate([130.8, 164.8, 196.0, 246.9]))
    pad *= 0.022 * (0.75 + 0.25 * np.sin(2 * np.pi * 0.25 * tt))
    pad *= np.minimum(1, tt / 1.5) * np.minimum(1, (DUR - tt) / 1.0)
    buf[:len(pad)] += pad
    # 场景1
    add(0.2, pop(440)); add(1.3, pop(780)); add(0.7, whoosh(0.08, 0.6))
    # 场景2
    add(3.4, whoosh())
    for k in range(1, 6): add(3.5 + 0.45 + 0.1 * k, pop(300 + 60 * k, 0.12))
    add(3.5 + 1.0, pop(660, 0.2))
    for j in range(4):
        add(3.5 + JS + JI * j, boing()); add(3.5 + JS + JI * j + JD, pop(220, 0.18, 0.1))
    add(3.5 + 3.95, chime(523, 0.10))
    # 场景3
    add(8.9, whoosh())
    for l in range(4): add(9.0 + 0.6 + 0.5 * l, pop(330 + 80 * l, 0.2))
    add(9.0 + 2.9, pop(880, 0.22)); add(9.0 + 3.05, pop(698, 0.22))
    # 场景4
    add(14.4, whoosh())
    add(14.5 + 0.4, pop(520, 0.2)); add(14.5 + 0.8, whoosh(0.06, 0.5))
    notes = [523, 587, 659, 784, 880, 1047, 1175, 1319]
    for i in range(8): add(14.5 + FT[i], pop(notes[i], 0.24))
    add(14.5 + 7.05, chime(784, 0.16))
    # 场景5
    add(23.9, whoosh())
    add(24.0, pop(523, 0.2))
    for k in range(3): add(24.0 + 0.35 + 0.3 * k, pop(659 + 120 * k, 0.2))
    add(24.0 + 1.6, chime(523, 0.15, 2.5))
    buf = buf[:int(SR * DUR)]
    buf = buf / (np.abs(buf).max() + 1e-9) * 0.85
    with wave.open(path, "wb") as wf:
        wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(SR)
        wf.writeframes((buf * 32767).astype(np.int16).tobytes())

# ======================= 主程序 =======================
if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "preview":
        pdir = os.path.join(OUT_DIR, "preview"); os.makedirs(pdir, exist_ok=True)
        for s in sys.argv[2:]:
            render(float(s)).save(os.path.join(pdir, "f_%05.2f.png" % float(s)))
        print("preview saved"); sys.exit()
    import imageio_ffmpeg
    from multiprocessing import Pool
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    wav = os.path.join(OUT_DIR, "sfx.wav"); synth_audio(wav)
    out = os.path.join(OUT_DIR, "dp_intro.mp4")
    total = int(DUR * FPS)
    proc = subprocess.Popen([ff, "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
                             "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-i", wav,
                             "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
                             "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", out],
                            stdin=subprocess.PIPE)
    with Pool(max(1, (os.cpu_count() or 2) - 1)) as pool:
        for k, fr in enumerate(pool.imap(render_bytes, range(total), chunksize=4)):
            proc.stdin.write(fr)
            if k % 60 == 0: print(f"frame {k}/{total}", flush=True)
    proc.stdin.close(); proc.wait()
    print("done:", out)
