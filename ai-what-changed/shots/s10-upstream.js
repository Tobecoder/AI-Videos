/**
 * SHOT S10 (72.40s - 80.60s): 第五幕 · 逆流灵光（冰冷平行「标准答案平均值」 vs 12fps 手绘逆流琥珀金线与灵感灯泡）
 *
 * Zero-Seam One-Take Continuity & Style B+C Fusion:
 *   [72.40s / lt=0.00s] Exact 0.00px lock with S09's `#0b1120` nocturnal twilight sky and the glowing 12fps
 *                       hand-drawn Amber-Gold Filament head at `(0, 140)`!
 *   [72.55s - 75.05s]   Yunxi: “它有过去所有标准答案的平均值”
 *                       110 razor-straight 60fps cold blue-grey parallel rays (`STD ANSWER / μ = 0.50`) streak
 *                       rigidly downward from the top of the frame while the lone golden filament holds its ground.
 *   [75.10s - 77.95s]   Yunxi: “唯独没有你的偏爱、你的痛感”
 *                       The 12fps hand-drawn golden filament swims UPSTREAM against the torrent:
 *                         - Curves left (`x = -148`) on “你的偏爱”, blooming a warm rose-amber watercolor aura
 *                         - Curves right (`x = +148`) on “你的痛感”, firing an electric-amber pulse that deflects
 *                           and bends away the cold downward standard-answer rays!
 *   [78.00s - 79.85s]   Yunxi: “和那句‘如果这样呢？’”
 *                       Spirals into `(0, -46)` to one-stroke sketch a luminous 12fps Glass Lightbulb & Sprouting
 *                       Tungsten-Seed Filament (`手绘灵感灯泡`), radiating a warm golden watercolor halo over
 *                       `「如果这样呢？」`!
 *   [79.85s - 80.60s]   One-Take Handoff -> S11:
 *                       Bulb halo gently lifts while a golden calligraphy filament extends to `(-360, 42)` — locking
 *                       0.00px onto S11's golden brush stroke!
 */
(function () {
  const E = window.MGEasing;

  class ShotS10Upstream {
    constructor(stage3D) {
      this.stage = stage3D;
      this.startTime = 72.40;
      this.endTime = 80.60;
      this.duration = this.endTime - this.startTime; // 8.20s

      // 110 Rigid 60fps Downward Parallel "Standard Answer" Rays
      this.coldRays = [];
      const labels = ['μ = 0.500', 'AVG_ANS', 'STD_OUT', 'p(x) MAX', 'MEAN_VEC', 'NORM_01'];
      for (let i = 0; i < 110; i++) {
        const s1 = Math.sin(i * 31.17 + 1.9) * 43758.54;
        const r1 = s1 - Math.floor(s1);
        const s2 = Math.sin(i * 79.43 + 4.3) * 19283.71;
        const r2 = s2 - Math.floor(s2);
        this.coldRays.push({
          x: -630 + (i / 109) * 1260 + (r1 - 0.5) * 8,
          phaseY: r2 * 960,
          speed: 520 + (i % 5) * 68,
          len: 75 + (i % 4) * 42,
          alpha: 0.14 + (i % 4) * 0.065,
          isCyan: i % 5 === 0,
          label: i % 11 === 0 ? labels[(i / 11) % labels.length | 0] : null
        });
      }

      // Warm golden watercolor stardust trailing behind the upstream filament
      this.goldDust = [];
      for (let i = 0; i < 36; i++) {
        this.goldDust.push({
          seed: i * 13.7,
          offsetX: ((i % 7) - 3) * 5.5,
          r: 1.5 + (i % 4) * 1.1
        });
      }
    }

    _sketchJitter(t12, seed, amp = 1.9) {
      const h = Math.sin(t12 * 37.0 + seed * 17.31) * 43758.5453;
      return ((h - Math.floor(h)) - 0.5) * 2 * amp;
    }

    _drawPencilBezier(ctx, x0, y0, cx1, cy1, cx2, cy2, x1, y1, t12, seed, width = 3.0, col = '#fbbf24') {
      for (let pass = 0; pass < 2; pass++) {
        const j = pass === 0 ? 0.9 : 1.6;
        const s = seed + pass * 15.1;
        ctx.save();
        ctx.strokeStyle = col;
        ctx.globalAlpha *= (pass === 0 ? 0.94 : 0.42);
        ctx.lineWidth = pass === 0 ? width : width * 0.65;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(x0 + this._sketchJitter(t12, s + 1, j), y0 + this._sketchJitter(t12, s + 2, j));
        ctx.bezierCurveTo(
          cx1 + this._sketchJitter(t12, s + 3, j), cy1 + this._sketchJitter(t12, s + 4, j),
          cx2 + this._sketchJitter(t12, s + 5, j), cy2 + this._sketchJitter(t12, s + 6, j),
          x1 + this._sketchJitter(t12, s + 7, j),  y1 + this._sketchJitter(t12, s + 8, j)
        );
        ctx.stroke();
        ctx.restore();
      }
    }

    // Continuous upstream S-curve trajectory from `(0, 140)` at `lt=0` to `(0, -46)` at `lt=5.65s`
    _evalUpstreamPoint(u) {
      // u in [0, 1]
      // u=0.00 -> (0, 140) [exact lock with S09 end!]
      // u=0.45 -> (-148, 52) ["你的偏爱"]
      // u=0.76 -> (+146, -6) ["你的痛感"]
      // u=1.00 -> (0, -46)   ["如果这样呢？" Lightbulb center]
      const y = E.lerp(140, -46, E.smoothstep(u));
      const x = -152 * Math.sin(u * Math.PI * 2.05) * Math.sin(u * Math.PI);
      return { x, y };
    }

    render(t, vecCtx, fgCtx, width, height) {
      const lt = Math.max(0, t - this.startTime); // 0.00 -> 8.20s
      const transP = E.cinematicInOut(E.clamp((lt - 7.32) / 0.88));
      this._updateStage3D(t, lt, transP);

      vecCtx.clearRect(0, 0, width, height);
      fgCtx.clearRect(0, 0, width, height);

      const baseW = 1280;
      const baseH = 720;
      const scaleFit = Math.min(width / baseW, height / baseH);
      const t12 = Math.floor(t * 12) / 12;

      // Sub-beat Choreography Curves (Synced to Yunxi `s10` starting at `72.55s / lt = 0.15s`):
      // 1) Cold downward parallel rays ramp (`lt = 0.05s -> 0.85s`, fades out as bulb blooms & transitions)
      const raysInP = E.smoothstep(E.clamp(lt / 0.75));
      // 2) Upstream golden swim progress (`lt = 1.65s -> 5.65s`)
      const swimP = E.cinematicInOut(E.clamp((lt - 1.65) / 4.00));
      // 3) "你的偏爱" warm rose-amber bloom (`lt >= 3.25s`) & "你的痛感" amber shock pulse (`lt >= 4.55s`)
      const loveBloomP = E.snappyOut(E.clamp((lt - 3.22) / 0.95));
      const painPulseP = E.snappyOut(E.clamp((lt - 4.52) / 0.95));
      // 4) "如果这样呢？" 12fps Hand-Sketched Bulb Ignition (`lt >= 5.65s`)
      const bulbP = E.snappyOut(E.clamp((lt - 5.62) / 0.95));

      // Nocturnal Twilight Backdrop (`#0b1120` 0.00px lock with S09 end!)
      vecCtx.fillStyle = '#0b1120';
      vecCtx.fillRect(0, 0, width, height);

      vecCtx.save();
      vecCtx.translate(width / 2, height / 2);
      vecCtx.scale(scaleFit, scaleFit);

      const activeHead = this._evalUpstreamPoint(swimP);

      // 1) COLD 60FPS PARALLEL DOWNWARD RAYS ("过去所有标准答案的平均值")
      const raysFade = raysInP * (1 - bulbP * 0.68) * (1 - transP);
      if (raysFade > 0.005) {
        this._renderColdStandardAnswerRays(vecCtx, t, lt, raysFade, activeHead, bulbP);
      }

      // 2) EMOTIONAL WAYPOINT BLOOMS ("你的偏爱" & "你的痛感")
      if ((loveBloomP > 0.01 || painPulseP > 0.01) && transP < 0.98) {
        this._renderHumanEmotionPulses(vecCtx, t12, loveBloomP, painPulseP, bulbP, transP);
      }

      // 3) UPSTREAM 12FPS HAND-DRAWN AMBER-GOLD FILAMENT (`(0, 140) -> (0, -46)`)
      if (transP < 0.99) {
        this._renderUpstreamGoldenFilament(vecCtx, t, lt, t12, swimP, bulbP, transP);
      }

      // 4) LUMINOUS 12FPS HAND-SKETCHED INSPIRATION LIGHTBULB & S11 BRUSH HANDOFF!
      if (bulbP > 0.005) {
        this._renderWhatIfLightbulbAndHandoff(vecCtx, t, t12, bulbP, transP);
      }

      vecCtx.restore();

      // Cinema Vignette & Voiceover Subtitles
      this._renderForeground(t, lt, bulbP, fgCtx, width, height);
    }

    _updateStage3D(t, lt, transP) {
      this.stage.gridMat.opacity = E.lerp(0.06, 0.09, transP);
      this.stage.pMat.opacity = E.lerp(0.18, 0.24, transP);
      this.stage.camera.position.set(0, E.lerp(0.8, 0.2, transP), E.lerp(9.8, 11.2, transP));
      this.stage.camera.lookAt(0, E.lerp(0.5, 0.0, transP), 0);
      this.stage.renderer.render(this.stage.scene, this.stage.camera);
    }

    _renderColdStandardAnswerRays(ctx, t, lt, raysFade, activeHead, bulbP) {
      ctx.save();

      // Repulsion shield radius around the upstream golden spark & lightbulb!
      const shieldR = 92 + bulbP * 240;

      this.coldRays.forEach((ray) => {
        const rawY = ((ray.phaseY + lt * ray.speed) % 920) - 460;
        let rx = ray.x;
        const dy = rawY - activeHead.y;
        const dx = rx - activeHead.x;
        const dist = Math.hypot(dx, dy);

        // Cold standard-answer rays part & deflect around the human golden spark!
        let localAlpha = ray.alpha * raysFade;
        if (dist < shieldR && dist > 1) {
          const push = (1 - dist / shieldR);
          rx += (dx >= 0 ? 1 : -1) * push * push * 68;
          localAlpha *= (1 - push * 0.65);
        }
        if (localAlpha <= 0.005) return;

        const yTop = rawY - ray.len;
        const yBot = rawY;
        const g = ctx.createLinearGradient(rx, yTop, rx, yBot);
        const colRgb = ray.isCyan ? '56, 189, 248' : '148, 163, 184';
        g.addColorStop(0, `rgba(${colRgb}, 0)`);
        g.addColorStop(0.75, `rgba(${colRgb}, ${localAlpha})`);
        g.addColorStop(1, `rgba(226, 232, 240, ${Math.min(0.85, localAlpha * 1.45)})`);

        ctx.strokeStyle = g;
        ctx.lineWidth = ray.isCyan ? 1.8 : 1.2;
        ctx.beginPath();
        ctx.moveTo(rx, yTop);
        ctx.lineTo(rx, yBot);
        ctx.stroke();

        if (ray.label && lt < 5.6) {
          ctx.font = '600 10px "JetBrains Mono", monospace';
          ctx.fillStyle = `rgba(148, 163, 184, ${localAlpha * 0.95})`;
          ctx.textAlign = 'left';
          ctx.fillText(ray.label, rx + 5, yBot - 4);
        }
      });

      // Cold top HUD tag ("STANDARD ANSWER DISTRIBUTION · μ = AVERAGE") during opening 4.8s
      const avgTagAlpha = E.smoothstep(E.clamp((lt - 0.35) / 0.45)) * (1 - E.smoothstep(E.clamp((lt - 4.8) / 0.6)));
      if (avgTagAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = avgTagAlpha;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.84)';
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(-190, -322, 380, 36, 18);
        ctx.fill();
        ctx.stroke();

        ctx.font = '600 12px "JetBrains Mono", "PingFang SC", monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('↓ AI DEFAULT: 过去所有标准答案的平均值 (μ)', 0, -304);
        ctx.restore();
      }

      ctx.restore();
    }

    _renderHumanEmotionPulses(ctx, t12, loveBloomP, painPulseP, bulbP, transP) {
      const fade = (1 - bulbP * 0.45) * (1 - transP);
      if (fade <= 0.01) return;
      ctx.save();
      ctx.globalAlpha = fade;

      // 1) Left Waypoint (`(-116, 48)`): “你的偏爱” — Warm Rose-Amber Watercolor Aura
      if (loveBloomP > 0.01) {
        const lx = -132;
        const ly = 48;
        const rg = ctx.createRadialGradient(lx, ly, 4, lx, ly, 92 * loveBloomP);
        rg.addColorStop(0, 'rgba(251, 113, 133, 0.38)');
        rg.addColorStop(0.55, 'rgba(245, 158, 11, 0.18)');
        rg.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(lx, ly, 92 * loveBloomP, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '700 18px "PingFang SC", "STKaiti", serif';
        ctx.fillStyle = `rgba(253, 164, 175, ${loveBloomP * 0.95})`;
        ctx.textAlign = 'right';
        ctx.fillText('你的偏爱 ✦', lx - 24 + this._sketchJitter(t12, 21.3, 0.9), ly + 6);
      }

      // 2) Right Waypoint (`(+128, -4)`): “你的痛感” — Crisp Amber-Gold Resonance Ring & Spark
      if (painPulseP > 0.01) {
        const px = 128;
        const py = -4;
        const ringR = 16 + painPulseP * 84;
        ctx.strokeStyle = `rgba(251, 191, 36, ${(1 - painPulseP * 0.65) * 0.65})`;
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.arc(px, py, ringR, 0, Math.PI * 2);
        ctx.stroke();

        ctx.font = '700 18px "PingFang SC", "STKaiti", serif';
        ctx.fillStyle = `rgba(253, 224, 71, ${painPulseP * 0.95})`;
        ctx.textAlign = 'left';
        ctx.fillText('⚡ 你的痛感', px + 24 + this._sketchJitter(t12, 44.7, 0.9), py + 6);
      }

      ctx.restore();
    }

    _renderUpstreamGoldenFilament(ctx, t, lt, t12, swimP, bulbP, transP) {
      ctx.save();
      ctx.globalAlpha = 1 - E.smoothstep(E.clamp((transP - 0.15) / 0.75));

      // Entry tail (`(0, 310) -> (0, 140)`) locked 0.00px with S09 end!
      const tailFade = 1 - E.smoothstep(E.clamp(swimP / 0.65));
      if (tailFade > 0.01) {
        ctx.save();
        ctx.globalAlpha *= tailFade;
        ctx.shadowColor = 'rgba(251, 191, 36, 0.75)';
        ctx.shadowBlur = 16;
        this._drawPencilBezier(ctx, 0, 310, -36, 250, 16, 192, 0, 140, t12, 1250.7, 3.6, '#fbbf24');
        ctx.restore();
      }

      // Sample progressive upstream polyline from `u = 0` to `u = swimP`
      const samples = 36;
      const pts = [];
      const uStart = Math.max(0, swimP - 0.72);
      for (let i = 0; i <= samples; i++) {
        const u = E.lerp(uStart, swimP, i / samples);
        const p = this._evalUpstreamPoint(u);
        pts.push(p);
      }

      // Draw double-pass 12fps hand-sketched glowing golden path
      for (let pass = 0; pass < 2; pass++) {
        ctx.save();
        ctx.shadowColor = 'rgba(251, 191, 36, 0.85)';
        ctx.shadowBlur = pass === 0 ? 18 : 6;
        ctx.strokeStyle = pass === 0 ? '#fbbf24' : '#fef3c7';
        ctx.lineWidth = pass === 0 ? 3.8 : 1.9;
        ctx.globalAlpha *= pass === 0 ? 0.95 : 0.70;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        for (let i = 0; i < pts.length; i++) {
          const jAmp = pass === 0 ? 1.1 : 1.9;
          const jx = i === pts.length - 1 ? 0 : this._sketchJitter(t12, 300 + i * 3 + pass * 40, jAmp);
          const jy = i === pts.length - 1 ? 0 : this._sketchJitter(t12, 500 + i * 3 + pass * 40, jAmp);
          if (i === 0) ctx.moveTo(pts[i].x + jx, pts[i].y + jy);
          else ctx.lineTo(pts[i].x + jx, pts[i].y + jy);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Trailing warm golden watercolor dust motes
      const head = pts[pts.length - 1];
      this.goldDust.forEach((d, di) => {
        const u = E.clamp(swimP - (di / this.goldDust.length) * 0.55);
        if (u <= 0.005) return;
        const bp = this._evalUpstreamPoint(u);
        const dx = bp.x + d.offsetX + Math.sin(t * 3 + d.seed) * 6;
        const dy = bp.y + ((t * 28 + d.seed * 10) % 28);
        ctx.fillStyle = 'rgba(253, 224, 71, 0.55)';
        ctx.beginPath();
        ctx.arc(dx, dy, d.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Glowing spark head at `head` (at `lt = 0`, `head` is `(0, 140)` with `r = 26`, 0.00px lock with S09!)
      if (bulbP < 0.85) {
        const haloR = 26 * (1 - bulbP * 0.5);
        const headHalo = ctx.createRadialGradient(head.x, head.y, 1, head.x, head.y, haloR);
        headHalo.addColorStop(0, 'rgba(255, 251, 235, 0.98)');
        headHalo.addColorStop(0.45, 'rgba(251, 191, 36, 0.65)');
        headHalo.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = headHalo;
        ctx.beginPath();
        ctx.arc(head.x, head.y, haloR, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    _renderWhatIfLightbulbAndHandoff(ctx, t, t12, bulbP, transP) {
      ctx.save();

      // Bulb gently lifts upward (`-46 -> -168`) and softens during `transP` (`7.32s -> 8.20s`)
      const bx = 0;
      const by = E.lerp(-46, -155, transP);
      const bulbFade = 1 - E.smoothstep(E.clamp((transP - 0.25) / 0.75));

      // 1) Expansive Warm Amber Wet-on-Wet Watercolor Halo
      const haloR = 265 * bulbP * (1 + transP * 0.35);
      if (haloR > 2) {
        const wg = ctx.createRadialGradient(bx, by, 8, bx, by, haloR);
        wg.addColorStop(0, `rgba(254, 243, 199, ${0.42 * bulbFade})`);
        wg.addColorStop(0.38, `rgba(251, 191, 36, ${0.24 * bulbFade})`);
        wg.addColorStop(0.72, `rgba(234, 88, 12, ${0.10 * bulbFade})`);
        wg.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = wg;
        ctx.beginPath();
        ctx.arc(bx, by, haloR, 0, Math.PI * 2);
        ctx.fill();
      }

      if (bulbFade > 0.01) {
        ctx.save();
        ctx.globalAlpha = bulbFade;
        ctx.translate(bx, by);
        const sc = E.spring(bulbP, 13, 0.70);
        ctx.scale(sc, sc);

        // Glass Edison Bulb Envelope (12fps hand-sketched left & right warm cream-gold curves!)
        this._drawPencilBezier(ctx, -20, 46, -24, 20, -56, -6, -52, -44, t12, 1401.2, 3.2, '#fde68a');
        this._drawPencilBezier(ctx, -52, -44, -48, -86, -24, -104, 0, -104, t12, 1412.8, 3.2, '#fde68a');
        this._drawPencilBezier(ctx, 0, -104, 24, -104, 48, -86, 52, -44, t12, 1424.5, 3.2, '#fde68a');
        this._drawPencilBezier(ctx, 52, -44, 56, -6, 24, 20, 20, 46, t12, 1436.9, 3.2, '#fde68a');

        // Screw-thread base ribs (`y = 48 .. 72`)
        for (let r = 0; r < 3; r++) {
          const ry = 50 + r * 9;
          this._drawPencilBezier(ctx, -18 + r * 2, ry, -6, ry + 3, 6, ry + 3, 18 - r * 2, ry, t12, 1450 + r * 9, 2.4, '#d97706');
        }

        // Glowing Question-Mark / Sprouting-Seed Tungsten Filament inside the bulb!
        ctx.save();
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 20;
        this._drawPencilBezier(ctx, -8, 44, -10, 12, -24, -24, 0, -54, t12, 1480.3, 3.4, '#fffbeb');
        this._drawPencilBezier(ctx, 0, -54, 24, -24, 10, 12, 8, 44, t12, 1492.7, 3.4, '#fffbeb');
        ctx.restore();

        // 9 Hand-sketched golden light rays radiating around the bulb
        for (let k = 0; k < 9; k++) {
          const a = -Math.PI * 1.12 + (k / 8) * Math.PI * 1.24;
          const rIn = 74;
          const rOut = 98 + (k % 2) * 12;
          this._drawPencilBezier(
            ctx,
            Math.cos(a) * rIn, -38 + Math.sin(a) * rIn,
            Math.cos(a) * (rIn + 8), -38 + Math.sin(a) * (rIn + 8),
            Math.cos(a) * (rOut - 6), -38 + Math.sin(a) * (rOut - 6),
            Math.cos(a) * rOut, -38 + Math.sin(a) * rOut,
            t12, 1510 + k * 11, 2.5, '#fbbf24'
          );
        }

        // Expressive hand-drawn callout beneath bulb: `「如果这样呢？」`
        const jx = this._sketchJitter(t12, 1601, 1.0);
        const jy = this._sketchJitter(t12, 1609, 1.0);
        ctx.font = '900 32px "PingFang SC", "STKaiti", serif';
        ctx.fillStyle = '#fef3c7';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(245, 158, 11, 0.65)';
        ctx.shadowBlur = 16;
        ctx.fillText('「如果这样呢？」', jx, 124 + jy);

        ctx.restore();
      }

      // 2) ONE-TAKE GOLDEN BRUSH HANDOFF -> S11 (`transP: 0 -> 1` glides spark to `(-360, 42)`!)
      if (transP > 0.01) {
        const p0 = { x: 0,    y: by + 44 };
        const p1 = { x: -120, y: 88 };
        const p2 = { x: -245, y: 18 };
        const p3 = { x: -360, y: 42 };
        const seg = E.splitCubicBezier(p0, p1, p2, p3, transP);
        const tip = seg[3];

        ctx.save();
        ctx.shadowColor = 'rgba(251, 191, 36, 0.88)';
        ctx.shadowBlur = 18;
        this._drawPencilBezier(
          ctx,
          seg[0].x, seg[0].y, seg[1].x, seg[1].y, seg[2].x, seg[2].y, seg[3].x, seg[3].y,
          t12, 1720.4, 3.4, '#fbbf24'
        );

        const tipHalo = ctx.createRadialGradient(tip.x, tip.y, 1, tip.x, tip.y, 24);
        tipHalo.addColorStop(0, 'rgba(255, 251, 235, 0.98)');
        tipHalo.addColorStop(0.45, 'rgba(251, 191, 36, 0.65)');
        tipHalo.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = tipHalo;
        ctx.beginPath();
        ctx.arc(tip.x, tip.y, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    }

    _renderForeground(t, lt, bulbP, ctx, width, height) {
      const vig = ctx.createRadialGradient(
        width * 0.5, height * 0.5, width * 0.40,
        width * 0.5, height * 0.5, width * 0.85
      );
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(5, 7, 14, 0.48)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, width, height);

      // Voiceover Subtitles (Synced to Yunxi `s10` starting at `72.55s / lt = 0.15s`, zero trailing commas!)
      const subY = height - Math.max(36, height * 0.072);
      const subFont = Math.max(15, Math.round(width * 0.0175));
      ctx.save();
      ctx.font = `600 ${subFont}px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let subText = '';
      let subAlpha = 0;

      if (lt >= 0.15 && lt < 2.62) {
        subText = '它有过去所有标准答案的平均值';
        subAlpha = E.smoothstep(E.invLerp(0.15, 0.38, lt)) * (1 - E.smoothstep(E.invLerp(2.38, 2.62, lt)));
      } else if (lt >= 2.68 && lt < 5.50) {
        subText = '唯独没有你的偏爱、你的痛感';
        subAlpha = E.smoothstep(E.invLerp(2.68, 2.90, lt)) * (1 - E.smoothstep(E.invLerp(5.26, 5.50, lt)));
      } else if (lt >= 5.56 && lt < 7.82) {
        subText = '和那句「如果这样呢？」';
        subAlpha = E.smoothstep(E.invLerp(5.56, 5.78, lt)) * (1 - E.smoothstep(E.invLerp(7.48, 7.82, lt)));
      }

      if (subAlpha > 0.01 && subText) {
        const padX = 26;
        const pillH = Math.round(subFont * 1.95);
        const pillW = Math.ceil(ctx.measureText(subText).width) + padX * 2;
        ctx.globalAlpha = subAlpha;
        ctx.fillStyle = 'rgba(10, 14, 24, 0.78)';
        ctx.beginPath();
        ctx.roundRect(width / 2 - pillW / 2, subY - pillH / 2, pillW, pillH, pillH / 2);
        ctx.fill();

        ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
        ctx.shadowBlur = 6;
        ctx.fillStyle = lt >= 5.56 ? '#fef08a' : 'rgba(248, 250, 252, 0.98)';
        ctx.fillText(subText, width / 2, subY + 1);
      }
      ctx.restore();
    }
  }

  window.ShotS10Upstream = ShotS10Upstream;
})();
