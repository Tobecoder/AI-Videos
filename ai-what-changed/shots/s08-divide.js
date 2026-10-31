/**
 * SHOT S08 (54.40s - 62.60s): 第四幕 · 双界分野（冰冷机械「怎么做」 vs 手撕画纸 12fps 手绘「做什么 · 想法」）
 *
 * Zero-Seam One-Take Continuity & Style-B Breakthrough:
 *   [54.40s / lt=0.00s] Exact 0.00px & 0.000rad tooth-for-tooth lock with S07's `#070b14` Blueprint Grid +
 *                       3 Left-Half 60fps Interlocking Mechanical Gears!
 *   [54.55s - 57.05s]   Yunxi: “因为 AI 改变的只是怎么做”
 *                       Left half illuminates cold CAD dimension callouts, parameter sliders & `HOW · 怎么做` (`效率与执行`).
 *   [57.08s - 61.45s]   Yunxi: “它从来改变不了做什么——AI，改变不了想法。”
 *                       FIRST WARM ACOUSTIC PIANO NOTE DROPS! An irregular fibrous hand-torn paper edge (`手撕水彩纸毛边`)
 *                       rips down `x ≈ 0`, peeling away the cold dark blueprint on the right to reveal warm cream
 *                       cold-press watercolor paper (`#FAF3E0`)!
 *                       At 12fps hand-drawn boiling graphite frame-hold, a living pencil Question Mark (`WHAT · 做什么`)
 *                       draws itself stroke-by-stroke; on “想法”, its base blooms with warm amber wet-on-wet watercolor
 *                       and sprouts a glowing botanical spark (`「想法」`).
 *   [61.45s - 62.60s]   One-Take Paper Wave -> S09: Hand-torn deckle seam sweeps leftward (`x: 0 -> -390`), expanding
 *                       the warm watercolor paper across 80% of the stage for S09!
 */
(function () {
  const E = window.MGEasing;

  class ShotS08Divide {
    constructor(stage3D) {
      this.stage = stage3D;
      this.startTime = 54.40;
      this.endTime = 62.60;
      this.duration = this.endTime - this.startTime; // 8.20s

      // Exact Gear Specs locked 0.00px & 0.000rad with S07 end!
      this.gears = [
        { cx: -340, cy: -40,  r: 112, teeth: 18, speed:  1.20, phase: 0.00 },
        { cx: -176, cy: -148, r: 74,  teeth: 12, speed: -1.80, phase: 0.26 },
        { cx: -188, cy:  102, r: 86,  teeth: 14, speed: -1.54, phase: 0.15 }
      ];

      // Deterministic irregular hand-torn deckle paper profile (`y = -370 .. +370`)
      this.tearOffsets = [];
      for (let i = 0; i <= 74; i++) {
        const y = -370 + i * 10;
        const n1 = Math.sin(i * 0.43 + 1.2) * 14;
        const n2 = Math.cos(i * 1.17 + 0.7) * 6.5;
        const n3 = Math.sin(i * 2.85 + 2.4) * 3.2;
        this.tearOffsets.push({ y, dx: n1 + n2 + n3 });
      }

      // Deterministic warm cotton-paper fiber stipple grains
      this.paperGrains = [];
      for (let i = 0; i < 220; i++) {
        const s1 = Math.sin(i * 19.31 + 3.7) * 43758.54;
        const r1 = s1 - Math.floor(s1);
        const s2 = Math.sin(i * 73.17 + 8.1) * 29183.11;
        const r2 = s2 - Math.floor(s2);
        this.paperGrains.push({
          x: -420 + r1 * 1080,
          y: -360 + r2 * 720,
          r: 0.8 + (i % 3) * 0.65,
          alpha: 0.035 + (i % 4) * 0.015
        });
      }
    }

    // 12fps Hand-Drawn Boiling Sketch Jitter Helper (`quantized to 12 frames per second!`)
    _sketchJitter(t12, seed, amp = 2.2) {
      const h = Math.sin(t12 * 37.0 + seed * 17.31) * 43758.5453;
      return ((h - Math.floor(h)) - 0.5) * 2 * amp;
    }

    // Multi-Pass Graphite Pencil Curve Helper (draws 2 slightly offset boiling strokes for warm hand-drawn feel)
    _drawPencilBezier(ctx, x0, y0, cx1, cy1, cx2, cy2, x1, y1, t12, seed, width = 3.2, col = '#3b3026') {
      for (let pass = 0; pass < 2; pass++) {
        const j = pass === 0 ? 1.0 : 1.7;
        const s = seed + pass * 11.7;
        ctx.save();
        ctx.strokeStyle = col;
        ctx.globalAlpha *= (pass === 0 ? 0.92 : 0.42);
        ctx.lineWidth = pass === 0 ? width : width * 0.68;
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

    render(t, vecCtx, fgCtx, width, height) {
      const lt = Math.max(0, t - this.startTime); // 0.00 -> 8.20s
      this._updateStage3D(t, lt);

      vecCtx.clearRect(0, 0, width, height);
      fgCtx.clearRect(0, 0, width, height);

      const baseW = 1280;
      const baseH = 720;
      const scaleFit = Math.min(width / baseW, height / baseH);

      // Quantized 12fps time for right-side hand-drawn pencil boil!
      const t12 = Math.floor(t * 12) / 12;

      // Sub-beat Choreography Curves (Synced to Yunxi `s08` starting at `lt = 0.15s`):
      // 1) Left `HOW · 怎么做` CAD callouts (`lt = 0.25s -> 8.20s`)
      const howRevealP = E.snappyOut(E.clamp((lt - 0.25) / 0.65));
      // 2) Vertical Hand-Torn Paper Rip (`lt = 2.68s -> 3.55s`, right as Yunxi begins “它从来改变不了做什么”!)
      const ripDownP = E.cinematicInOut(E.clamp((lt - 2.68) / 0.88));
      // 3) End Wave Push Left (`lt = 6.95s -> 8.20s` -> sweeps `tearBaseX` from `0` to `-390` for S09!)
      const waveLeftP = E.cinematicInOut(E.clamp((lt - 6.95) / 1.22));
      const tearBaseX = E.lerp(0, -390, waveLeftP);

      // Base Cold Blueprint Backdrop (`#070b14` matches S07 end 0.00px!)
      vecCtx.fillStyle = '#070b14';
      vecCtx.fillRect(0, 0, width, height);

      vecCtx.save();
      vecCtx.translate(width / 2, height / 2);
      vecCtx.scale(scaleFit, scaleFit);

      // 1) LEFT WORLD (60fps Cold Mechanical Engineering Blueprint & Interlocking Gears: `HOW · 怎么做`)
      this._renderColdBlueprintWorld(vecCtx, t, lt, howRevealP, waveLeftP);

      // 2) RIGHT WORLD (Warm Cream Watercolor Paper `#FAF3E0` + Hand-Torn Deckle Seam + 12fps Pencil Sketch: `WHAT · 做什么 / 想法`)
      if (ripDownP > 0.002) {
        this._renderWarmPaperWorld(vecCtx, t, lt, t12, ripDownP, waveLeftP, tearBaseX);
      }

      vecCtx.restore();

      // Cinema Vignette & Documentary Voiceover Subtitles
      this._renderForeground(t, lt, ripDownP, fgCtx, width, height);
    }

    _updateStage3D(t, lt) {
      this.stage.gridMat.opacity = 0.11;
      this.stage.pMat.opacity = 0.02;
      this.stage.camera.position.set(0, 0, 11.5);
      this.stage.camera.lookAt(0, 0, 0);
      this.stage.renderer.render(this.stage.scene, this.stage.camera);
    }

    // =========================================================================
    // 1. COLD 60FPS MECHANICAL BLUEPRINT WORLD (`HOW · 怎么做`)
    // =========================================================================
    _renderColdBlueprintWorld(ctx, t, lt, howRevealP, waveLeftP) {
      ctx.save();

      // Exact 32px Engineering Grid from S07 end
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      for (let gx = -640; gx <= 640; gx += 32) {
        ctx.beginPath(); ctx.moveTo(gx, -360); ctx.lineTo(gx, 360); ctx.stroke();
      }
      for (let gy = -360; gy <= 360; gy += 32) {
        ctx.beginPath(); ctx.moveTo(-640, gy); ctx.lineTo(640, gy); ctx.stroke();
      }

      // Center vertical blueprint axis (`x = 0`, covered once paper rips down!)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(0, -360);
      ctx.lineTo(0, 360);
      ctx.stroke();
      ctx.setLineDash([]);

      // Shift left-side gears smoothly into the narrow `[-640..-390]` strip during `waveLeftP` (`6.95s -> 8.20s`)!
      const shiftX = -215 * waveLeftP;
      const gearScale = E.lerp(1.0, 0.72, waveLeftP);

      ctx.save();
      ctx.translate(shiftX, 0);

      // 3 Interlocking 60fps Precision Wireframe Gears (0.000rad phase lock with S07!)
      this.gears.forEach((g) => {
        const angle = g.phase + t * g.speed;
        const cx = E.lerp(g.cx, -305, waveLeftP * 0.35);
        this._drawPrecisionGear(ctx, cx, g.cy, g.r * gearScale, g.teeth, angle);
      });

      // Cold CAD Typography & Automated Telemetry (`HOW · 怎么做`)
      if (howRevealP > 0.01) {
        ctx.save();
        ctx.globalAlpha = howRevealP * (1 - waveLeftP * 0.92);

        // Top-left CAD Blueprint Header Box
        ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(-576, -308, 256, 74, 10);
        ctx.fill();
        ctx.stroke();

        ctx.font = '700 12px "JetBrains Mono", monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('AI EXECUTION · 60.0 FPS', -556, -286);

        ctx.font = '800 22px "PingFang SC", "Inter", sans-serif';
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText('HOW ·「怎么做」', -556, -254);

        // Bottom-left mechanical speed metrics
        ctx.font = '600 12.5px "JetBrains Mono", "PingFang SC", monospace';
        ctx.fillStyle = '#64748b';
        ctx.fillText('▸ 流程自动化   ▸ 极速渲染   ▸ 零成本执行', -572, 268);

        const rpm = (1200 + Math.floor((t * 87) % 99));
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`THROUGHPUT: ${rpm} OPS/SEC`, -572, 294);
        ctx.restore();
      }

      ctx.restore();
      ctx.restore();
    }

    _drawPrecisionGear(ctx, cx, cy, r, teeth, angle) {
      if (r <= 2) return;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      const outerR = r + 10 * (r / 90);
      const innerR = r - 6 * (r / 90);
      const hubR = r * 0.34;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.72)';
      ctx.lineWidth = Math.max(1.4, 2.0 * (r / 90));

      ctx.beginPath();
      const step = (Math.PI * 2) / teeth;
      for (let i = 0; i < teeth; i++) {
        const a0 = i * step;
        const a1 = a0 + step * 0.22;
        const a2 = a0 + step * 0.48;
        const a3 = a0 + step * 0.70;
        if (i === 0) ctx.moveTo(Math.cos(a0) * innerR, Math.sin(a0) * innerR);
        else ctx.lineTo(Math.cos(a0) * innerR, Math.sin(a0) * innerR);
        ctx.lineTo(Math.cos(a1) * outerR, Math.sin(a1) * outerR);
        ctx.lineTo(Math.cos(a2) * outerR, Math.sin(a2) * outerR);
        ctx.lineTo(Math.cos(a3) * innerR, Math.sin(a3) * innerR);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, r * 0.72, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, hubR, 0, Math.PI * 2);
      ctx.stroke();

      for (let s = 0; s < 4; s++) {
        const sa = (s * Math.PI) / 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(sa) * hubR, Math.sin(sa) * hubR);
        ctx.lineTo(Math.cos(sa) * (r * 0.72), Math.sin(sa) * (r * 0.72));
        ctx.stroke();
      }

      ctx.restore();
    }

    // =========================================================================
    // 2. WARM WATERCOLOR PAPER & 12FPS HAND-DRAWN SKETCH (`WHAT · 做什么 / 想法`)
    // =========================================================================
    _renderWarmPaperWorld(ctx, t, lt, t12, ripDownP, waveLeftP, tearBaseX) {
      // Max Y reached by the downward paper tear (`-370 -> +370`)
      const ripMaxY = E.lerp(-370, 370, ripDownP);

      // Build organic hand-torn deckle polygon covering `[tearBaseX .. +660]` down to `ripMaxY`
      const tracePaperRegion = (offsetX = 0) => {
        ctx.beginPath();
        let started = false;
        for (let i = 0; i < this.tearOffsets.length; i++) {
          const pt = this.tearOffsets[i];
          if (pt.y > ripMaxY) break;
          // Slight curl inward right at the active tearing tip!
          const tipCurl = ripDownP < 0.99
            ? Math.exp(-Math.max(0, ripMaxY - pt.y) / 45) * 48
            : 0;
          const px = tearBaseX + pt.dx + tipCurl + offsetX;
          if (!started) {
            ctx.moveTo(px, pt.y);
            started = true;
          } else {
            ctx.lineTo(px, pt.y);
          }
        }
        ctx.lineTo(660, Math.min(370, ripMaxY));
        ctx.lineTo(660, -370);
        ctx.closePath();
      };

      ctx.save();

      // 1) Tactile Drop Shadow + White Fibrous Paper Core Edge along the Hand-Torn Seam!
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetX = -8;
      // Fibrous bright white inner cotton-pulp edge (`6px` wider to the left than cream top coat!)
      ctx.fillStyle = '#fffdf9';
      tracePaperRegion(-7);
      ctx.fill();
      ctx.restore();

      // 2) Warm Cream Cold-Press Watercolor Paper Top Surface (`#FAF3E0` -> `#F4E9CE`)
      const paperG = ctx.createLinearGradient(tearBaseX, -360, 640, 360);
      paperG.addColorStop(0, '#fcf7e8');
      paperG.addColorStop(0.55, '#faf2dc');
      paperG.addColorStop(1, '#f2e5c6');
      ctx.fillStyle = paperG;
      tracePaperRegion(0);
      ctx.fill();

      // Clip all watercolor washes & 12fps pencil sketches cleanly inside the torn paper!
      ctx.save();
      tracePaperRegion(0);
      ctx.clip();

      // Subtle tactile cotton-paper grain stipples
      ctx.fillStyle = '#8c7355';
      this.paperGrains.forEach((g) => {
        if (g.x < tearBaseX - 20 || g.y > ripMaxY) return;
        ctx.globalAlpha = g.alpha;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Content fades gently during the final `0.65s` leftward wave so S09's sunset eaves have a clean paper stage!
      const sketchContentFade = 1 - E.smoothstep(E.clamp((waveLeftP - 0.35) / 0.60));
      if (sketchContentFade > 0.01) {
        ctx.save();
        ctx.globalAlpha = sketchContentFade;

        const rightCenterX = E.lerp(315, 160, waveLeftP);

        // A) Wet-on-Wet Warm Amber Watercolor Wash (`blooms at lt >= 5.55s` right on “AI，改变不了想法”!)
        const bloomP = E.snappyOut(E.clamp((lt - 5.45) / 1.05));
        if (bloomP > 0.01) {
          this._drawWatercolorIdeaWash(ctx, rightCenterX, 52, bloomP, t12);
        }

        // B) 12fps Hand-Sketched `WHAT · 做什么` Header (`lt >= 3.35s`)
        const whatP = E.smoothstep(E.clamp((lt - 3.30) / 0.55));
        if (whatP > 0.01) {
          ctx.save();
          ctx.globalAlpha = sketchContentFade * whatP;
          const jx = this._sketchJitter(t12, 3.1, 1.1);
          const jy = this._sketchJitter(t12, 7.4, 1.1);

          ctx.font = '700 13px "Georgia", "PingFang SC", serif';
          ctx.fillStyle = '#9a6b32';
          ctx.textAlign = 'center';
          ctx.fillText('HUMAN ORIGIN  ·  12FPS HAND-DRAWN', rightCenterX + jx, -278 + jy);

          ctx.font = '800 24px "PingFang SC", "Kaiti SC", "STKaiti", serif';
          ctx.fillStyle = '#3b3026';
          ctx.fillText('WHAT ·「做什么」', rightCenterX + jx, -242 + jy);

          // Hand-drawn graphite underline stroke
          this._drawPencilBezier(
            ctx,
            rightCenterX - 96, -222,
            rightCenterX - 30, -219,
            rightCenterX + 35, -225,
            rightCenterX + 96, -221,
            t12, 19.2, 2.2, '#b45309'
          );
          ctx.restore();
        }

        // C) Living 12fps Graphite Question Mark + Sprouting Idea Spark!
        const drawQP = E.cinematicInOut(E.clamp((lt - 3.45) / 1.15));
        if (drawQP > 0.01) {
          this._drawHandSketchedQuestionAndIdea(ctx, rightCenterX, -28, drawQP, bloomP, t12);
        }

        // D) Warm Brush-Ink Emphasis `AI 改变不了「想法」` (`lt >= 5.75s`)
        if (bloomP > 0.15) {
          const textP = E.snappyOut(E.clamp((lt - 5.72) / 0.55));
          ctx.save();
          ctx.globalAlpha = sketchContentFade * textP;
          const jx = this._sketchJitter(t12, 41.2, 1.0);
          const jy = this._sketchJitter(t12, 53.8, 1.0);

          ctx.font = '900 34px "PingFang SC", "STKaiti", serif';
          ctx.fillStyle = '#292018';
          ctx.textAlign = 'center';
          ctx.fillText('AI 改变不了「想法」', rightCenterX + jx, 196 + jy);

          ctx.font = '600 15px "PingFang SC", serif';
          ctx.fillStyle = '#92400e';
          ctx.fillText('工具负责穷举执行  ·  人类赋予动机与灵魂', rightCenterX, 238);
          ctx.restore();
        }

        ctx.restore();
      }

      ctx.restore(); // end paper clip
      ctx.restore();
    }

    _drawWatercolorIdeaWash(ctx, cx, cy, bloomP, t12) {
      ctx.save();
      ctx.translate(cx, cy);

      // Layered irregular organic wet-on-wet amber/ochre watercolor puddles (`multiply` feel on cream paper)
      const layers = [
        { r: 145 * bloomP, dx: -8, dy: -12, col: 'rgba(251, 191, 36, 0.24)' },
        { r: 112 * bloomP, dx: 14, dy: 6,   col: 'rgba(245, 158, 11, 0.22)' },
        { r: 78 * bloomP,  dx: -4, dy: 10,  col: 'rgba(234, 88, 12, 0.16)' }
      ];

      layers.forEach((ly, li) => {
        if (ly.r <= 2) return;
        ctx.fillStyle = ly.col;
        ctx.beginPath();
        const steps = 24;
        for (let s = 0; s <= steps; s++) {
          const a = (s / steps) * Math.PI * 2;
          const wobble = 1 + 0.14 * Math.sin(a * 3 + li * 2.1) + 0.08 * Math.cos(a * 5 - li);
          const px = ly.dx + Math.cos(a) * ly.r * wobble;
          const py = ly.dy + Math.sin(a) * ly.r * wobble * 0.88;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
      });

      // Soft watercolor pigment edge ring (authentic wet-edge capillary ring!)
      ctx.strokeStyle = `rgba(217, 119, 6, ${0.28 * bloomP})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let s = 0; s <= 28; s++) {
        const a = (s / 28) * Math.PI * 2;
        const r = 142 * bloomP * (1 + 0.13 * Math.sin(a * 3 + 0.4));
        const px = -6 + Math.cos(a) * r;
        const py = -10 + Math.sin(a) * r * 0.88;
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();

      ctx.restore();
    }

    _drawHandSketchedQuestionAndIdea(ctx, cx, cy, drawQP, bloomP, t12) {
      ctx.save();
      ctx.translate(cx, cy);

      // Clip progressive pencil drawing top-to-bottom as `drawQP` goes `0 -> 1`
      ctx.save();
      ctx.beginPath();
      ctx.rect(-140, -145, 280, 290 * drawQP);
      ctx.clip();

      // Upper expressive curve of hand-drawn Question Mark `?`
      this._drawPencilBezier(
        ctx,
        -46, -68,
        -48, -128,
        56, -132,
        52, -62,
        t12, 101.3, 4.6, '#3b3026'
      );
      // Lower stem sweeping down to `(0, 34)`
      this._drawPencilBezier(
        ctx,
        52, -62,
        48, -18,
        2, -4,
        0, 38,
        t12, 205.7, 4.6, '#3b3026'
      );

      // Sketchy graphite shading hatch marks along the curve
      for (let h = 0; h < 6; h++) {
        const hy = -98 + h * 12;
        this._drawPencilBezier(
          ctx,
          28, hy, 34, hy + 2, 40, hy + 3, 46, hy + 5,
          t12, 310 + h * 7, 1.4, 'rgba(59, 48, 38, 0.48)'
        );
      }
      ctx.restore();

      // Base Dot of `?` at `(0, 78)` -> Sprouts a Warm Hand-Drawn Botanical Leaf / Spark on `bloomP`!
      if (drawQP > 0.82) {
        const dotP = E.snappyOut(E.clamp((drawQP - 0.82) / 0.18));
        const jx = this._sketchJitter(t12, 88.1, 1.4);
        const jy = this._sketchJitter(t12, 92.5, 1.4);

        ctx.fillStyle = bloomP > 0.2 ? '#d97706' : '#3b3026';
        ctx.beginPath();
        ctx.arc(jx, 78 + jy, 9.5 * dotP, 0, Math.PI * 2);
        ctx.fill();

        // Sprouting Warm Hand-Sketched Two-Leaf Seedling & Radiant Ink Rays (`bloomP > 0.05`)!
        if (bloomP > 0.05) {
          const sp = E.spring(bloomP, 12, 0.68);
          // Delicate stem rising from the dot
          this._drawPencilBezier(
            ctx,
            0, 74,
            -4, 58,
            2, 46,
            0, 74 - 32 * sp,
            t12, 401.2, 2.8, '#b45309'
          );
          // Left & Right warm hand-drawn leaves
          const topY = 74 - 32 * sp;
          this._drawPencilBezier(ctx, 0, topY + 6, -24 * sp, topY - 14 * sp, -32 * sp, topY + 6, 0, topY + 8, t12, 420.5, 2.4, '#d97706');
          this._drawPencilBezier(ctx, 0, topY + 4, 24 * sp, topY - 16 * sp, 32 * sp, topY + 4, 0, topY + 6, t12, 450.9, 2.4, '#d97706');

          // 7 Hand-drawn radiating inspiration ticks around the Question Mark!
          for (let r = 0; r < 7; r++) {
            const a = -Math.PI + (r / 6) * Math.PI;
            const rIn = 88;
            const rOut = 88 + 24 * sp;
            this._drawPencilBezier(
              ctx,
              Math.cos(a) * rIn, -35 + Math.sin(a) * rIn,
              Math.cos(a) * (rIn + 8), -35 + Math.sin(a) * (rIn + 8),
              Math.cos(a) * (rOut - 6), -35 + Math.sin(a) * (rOut - 6),
              Math.cos(a) * rOut, -35 + Math.sin(a) * rOut,
              t12, 500 + r * 13, 2.4, '#d97706'
            );
          }
        }
      }

      ctx.restore();
    }

    _renderForeground(t, lt, ripDownP, ctx, width, height) {
      // Gentle vignette (softens on the right side once warm paper appears!)
      const vig = ctx.createRadialGradient(
        width * 0.5, height * 0.5, width * 0.42,
        width * 0.5, height * 0.5, width * 0.85
      );
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, `rgba(10, 8, 6, ${E.lerp(0.52, 0.24, ripDownP)})`);
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, width, height);

      // Voiceover Subtitles (Synced to Yunxi `s08` starting at `54.55s / lt = 0.15s`, zero trailing commas!)
      const subY = height - Math.max(36, height * 0.072);
      const subFont = Math.max(15, Math.round(width * 0.0175));
      ctx.save();
      ctx.font = `600 ${subFont}px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let subText = '';
      let subAlpha = 0;

      if (lt >= 0.12 && lt < 2.75) {
        subText = '因为 AI 改变的只是「怎么做」';
        subAlpha = E.smoothstep(E.invLerp(0.12, 0.34, lt)) * (1 - E.smoothstep(E.invLerp(2.52, 2.75, lt)));
      } else if (lt >= 2.80 && lt < 4.50) {
        subText = '它从来改变不了「做什么」';
        subAlpha = E.smoothstep(E.invLerp(2.80, 3.02, lt)) * (1 - E.smoothstep(E.invLerp(4.28, 4.50, lt)));
      } else if (lt >= 4.54 && lt < 7.65) {
        subText = 'AI，改变不了想法。';
        subAlpha = E.smoothstep(E.invLerp(4.54, 4.76, lt)) * (1 - E.smoothstep(E.invLerp(7.30, 7.65, lt)));
      }

      if (subAlpha > 0.01 && subText) {
        const padX = 26;
        const pillH = Math.round(subFont * 1.95);
        const pillW = Math.ceil(ctx.measureText(subText).width) + padX * 2;
        ctx.globalAlpha = subAlpha;
        ctx.fillStyle = 'rgba(15, 14, 12, 0.78)';
        ctx.beginPath();
        ctx.roundRect(width / 2 - pillW / 2, subY - pillH / 2, pillW, pillH, pillH / 2);
        ctx.fill();

        ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
        ctx.shadowBlur = 6;
        ctx.fillStyle = lt >= 4.54 ? '#fef08a' : 'rgba(248, 250, 252, 0.98)';
        ctx.fillText(subText, width / 2, subY + 1);
      }
      ctx.restore();
    }
  }

  window.ShotS08Divide = ShotS08Divide;
})();
