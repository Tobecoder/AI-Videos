/**
 * SHOT S09 (62.60s - 72.40s): 第五幕 · 温度与留白（穷举配色与机械卡点 vs 黄昏飞檐、风铃归鸟与叙事留白）
 *
 * Zero-Seam One-Take Continuity & Style-B Poetic Masterpiece:
 *   [62.60s / lt=0.00s] Exact 0.00px lock with S08's hand-torn deckle paper seam at `x = -390`, `#070b14` left
 *                       blueprint strip + receding gears, and `#FAF3E0` cold-press cream watercolor paper!
 *   [62.75s - 66.25s]   Yunxi: “它能穷举一万种配色、卡准每一个鼓点”
 *                       Left narrow cold strip (`x = -624 .. -406`) runs at rigid 60fps:
 *                         - Top Module: `10,000 HEX PALETTES` high-speed swatch grid racing `0 -> 10,000`
 *                         - Bottom Module: `112.00 BPM · ±0.00ms` quantized metronome & spectrum bars
 *   [66.40s - 71.15s]   Yunxi: “却不知道哪一抹颜色、哪一秒留白，能击中人心底的柔软。”
 *                       Right expansive cream watercolor paper (`x = -390 .. +640`) breathes at 12fps hand-drawn frame-hold:
 *                         - Wet-on-Wet sunset amber, persimmon & rose-ochre watercolor blooms diffuse across the sky
 *                         - 12fps sepia/graphite architectural wooden courtyard eaves (`木质飞檐瓦当`) & swaying glass
 *                           wind-chime (`玻璃风铃与短册`) draw stroke-by-stroke (zero crude human silhouettes!)
 *                         - 5 hand-sketched returning birds (`归鸟`) glide across vast, luminous negative space (`留白`)
 *                         - On “击中人心底的柔软”, evening breeze stirs the wind-chime, sending warm golden ripples across the paper
 *   [71.15s - 72.40s]   One-Take Camera Tilt Up into Twilight -> S10:
 *                       Torn seam sweeps off-screen (`-390 -> -720`), twilight indigo (`#0b1120`) washes down the sky as
 *                       camera tilts upward, and a single glowing 12fps hand-drawn Amber-Gold Filament detaches from the
 *                       wind-chime slip to `(0, 140)` — locking 0.00px onto S10's upstream golden line!
 */
(function () {
  const E = window.MGEasing;

  const SWATCH_PALETTE = [
    '#FF5733', '#00F5FF', '#8B5CF6', '#10B981', '#F43F5E', '#38BDF8',
    '#F59E0B', '#EC4899', '#6366F1', '#14B8A6', '#84CC16', '#EF4444',
    '#06B6D4', '#A855F7', '#F97316', '#22C55E', '#3B82F6', '#EAB308'
  ];

  class ShotS09Warmth {
    constructor(stage3D) {
      this.stage = stage3D;
      this.startTime = 62.60;
      this.endTime = 72.40;
      this.duration = this.endTime - this.startTime; // 9.80s

      // Exact Gear Specs from S08 end (`waveLeftP = 1.0`) for 0.00px entry crossfade!
      this.entryGears = [
        { cx: -340, cy: -40,  r: 112, teeth: 18, speed:  1.20, phase: 0.00 },
        { cx: -176, cy: -148, r: 74,  teeth: 12, speed: -1.80, phase: 0.26 },
        { cx: -188, cy:  102, r: 86,  teeth: 14, speed: -1.54, phase: 0.15 }
      ];

      // Identical hand-torn deckle paper profile (`y = -370 .. +370`) locked 0.00px with S08!
      this.tearOffsets = [];
      for (let i = 0; i <= 74; i++) {
        const y = -370 + i * 10;
        const n1 = Math.sin(i * 0.43 + 1.2) * 14;
        const n2 = Math.cos(i * 1.17 + 0.7) * 6.5;
        const n3 = Math.sin(i * 2.85 + 2.4) * 3.2;
        this.tearOffsets.push({ y, dx: n1 + n2 + n3 });
      }

      // Identical cotton-paper fiber stipple grains locked 0.00px with S08!
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

      // 5 Poetic Returning Birds (`归鸟`) across the sunset sky
      this.birds = [
        { x0: 78,  y0: -88,  vx: 22, vy: -5.5, span: 15.5, phase: 0.2 },
        { x0: 122, y0: -112, vx: 20, vy: -4.8, span: 12.0, phase: 1.4 },
        { x0: 154, y0: -96,  vx: 21, vy: -5.2, span: 10.5, phase: 2.7 },
        { x0: 208, y0: -134, vx: 18, vy: -4.2, span: 9.0,  phase: 0.9 },
        { x0: 244, y0: -122, vx: 17, vy: -3.9, span: 7.5,  phase: 2.1 }
      ];

      // Warm golden dusk motes stirred by the wind-chime on “击中人心底的柔软”
      this.softMotes = [];
      for (let i = 0; i < 28; i++) {
        const a = (i / 28) * Math.PI * 2 + (i % 3) * 0.4;
        this.softMotes.push({
          ang: a,
          speed: 26 + (i % 5) * 14,
          driftY: -12 - (i % 4) * 8,
          r: 1.8 + (i % 4) * 1.15,
          col: i % 2 === 0 ? 'rgba(245, 158, 11, 0.55)' : 'rgba(251, 113, 133, 0.42)'
        });
      }
    }

    // 12fps Hand-Drawn Boiling Sketch Jitter (`quantized to 12fps`)
    _sketchJitter(t12, seed, amp = 1.8) {
      const h = Math.sin(t12 * 37.0 + seed * 17.31) * 43758.5453;
      return ((h - Math.floor(h)) - 0.5) * 2 * amp;
    }

    // Double-pass warm sepia/graphite hand-drawn Bezier stroke
    _drawPencilBezier(ctx, x0, y0, cx1, cy1, cx2, cy2, x1, y1, t12, seed, width = 2.6, col = '#3b3026') {
      for (let pass = 0; pass < 2; pass++) {
        const j = pass === 0 ? 0.85 : 1.45;
        const s = seed + pass * 13.3;
        ctx.save();
        ctx.strokeStyle = col;
        ctx.globalAlpha *= (pass === 0 ? 0.90 : 0.38);
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

    render(t, vecCtx, fgCtx, width, height) {
      const lt = Math.max(0, t - this.startTime); // 0.00 -> 9.80s
      const transP = E.cinematicInOut(E.clamp((lt - 8.55) / 1.25)); // One-Take Tilt Up -> S10!
      this._updateStage3D(t, lt, transP);

      vecCtx.clearRect(0, 0, width, height);
      fgCtx.clearRect(0, 0, width, height);

      const baseW = 1280;
      const baseH = 720;
      const scaleFit = Math.min(width / baseW, height / baseH);

      // Quantized 12fps hand-drawn animation clock
      const t12 = Math.floor(t * 12) / 12;

      // Sub-beat Choreography Curves (Synced to Yunxi `s09` starting at `62.75s / lt = 0.15s`):
      // 1) Left Cold AI Strip Modules (`lt = 0.15s -> 8.55s`)
      const leftModP = E.snappyOut(E.clamp((lt - 0.12) / 0.58));
      const beatModP = E.snappyOut(E.clamp((lt - 1.92) / 0.52));
      // 2) Right Sunset Watercolor Wash (`lt >= 3.82s` on “却不知道哪一抹颜色”)
      const sunsetP = E.smoothstep(E.clamp((lt - 3.82) / 1.65));
      // 3) 12fps Hand-Sketched Eaves & Glass Wind-Chime (`lt >= 4.18s`)
      const eavesP = E.cinematicInOut(E.clamp((lt - 4.18) / 1.35));
      // 4) Poetic Negative Space & Returning Birds (`lt >= 5.25s` on “哪一秒留白”)
      const birdsP = E.smoothstep(E.clamp((lt - 5.20) / 1.10));
      // 5) Warm Heartbeat Chime Ripple (`lt >= 6.72s` on “能击中人心底的柔软”)
      const softHitP = E.snappyOut(E.clamp((lt - 6.72) / 1.55));
      // 6) Hand-torn seam sweeps off-screen left (`-390 -> -720`) during One-Take transition to S10!
      const tearBaseX = E.lerp(-390, -720, transP);

      // Base Cold Blueprint Backdrop (`#070b14` matches S08 end 0.00px!)
      vecCtx.fillStyle = '#070b14';
      vecCtx.fillRect(0, 0, width, height);

      vecCtx.save();
      vecCtx.translate(width / 2, height / 2);
      vecCtx.scale(scaleFit, scaleFit);

      // 1) LEFT NARROW COLD AI STRIP (`x = -640 .. tearBaseX`: 10,000 Colors & Rigid Beat Quantizer)
      if (tearBaseX > -680) {
        this._renderColdExhaustionStrip(vecCtx, t, lt, leftModP, beatModP, sunsetP, transP);
      }

      // 2) RIGHT EXPANSIVE WATERCOLOR PAPER (`x = tearBaseX .. +640`: Sunset Wash, Eaves, Wind-Chime, Birds & Twilight Filament)
      this._renderPoeticWatercolorStage(
        vecCtx, t, lt, t12, tearBaseX, sunsetP, eavesP, birdsP, softHitP, transP
      );

      vecCtx.restore();

      // Cinema Vignette & Poetic Voiceover Subtitles
      this._renderForeground(t, lt, sunsetP, transP, fgCtx, width, height);
    }

    _updateStage3D(t, lt, transP) {
      this.stage.gridMat.opacity = E.lerp(0.11, 0.06, transP);
      this.stage.pMat.opacity = E.lerp(0.02, 0.18, transP);
      this.stage.camera.position.set(0, E.lerp(0, 0.8, transP), E.lerp(11.5, 9.8, transP));
      this.stage.camera.lookAt(0, E.lerp(0, 0.5, transP), 0);
      this.stage.renderer.render(this.stage.scene, this.stage.camera);
    }

    // =========================================================================
    // 1. LEFT NARROW COLD 60FPS AI STRIP (`穷举一万种配色 · 卡准每一个鼓点`)
    // =========================================================================
    _renderColdExhaustionStrip(ctx, t, lt, leftModP, beatModP, sunsetP, transP) {
      ctx.save();
      const slideOutX = -280 * transP;
      ctx.translate(slideOutX, 0);

      // Exact 32px Blueprint Grid from S08 end
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      for (let gx = -640; gx <= -352; gx += 32) {
        ctx.beginPath(); ctx.moveTo(gx, -360); ctx.lineTo(gx, 360); ctx.stroke();
      }
      for (let gy = -360; gy <= 360; gy += 32) {
        ctx.beginPath(); ctx.moveTo(-640, gy); ctx.lineTo(-352, gy); ctx.stroke();
      }

      // A) Entry Blueprint Gears from S08 (`lt = 0.00s`: 0.00px & 0.000rad match, smoothly receding behind AI modules!)
      const gearFade = 1 - leftModP * 0.86;
      if (gearFade > 0.02) {
        ctx.save();
        ctx.globalAlpha = gearFade;
        ctx.translate(-215, 0);
        this.entryGears.forEach((g) => {
          const angle = g.phase + t * g.speed;
          const cx = E.lerp(g.cx, -305, 0.35);
          this._drawPrecisionGear(ctx, cx, g.cy, g.r * 0.72, g.teeth, angle);
        });
        ctx.restore();
      }

      // Gently dim left cold strip once right poetic watercolor takes focus (`lt >= 3.82s`)
      const stripFocusAlpha = E.lerp(1.0, 0.52, sunsetP) * (1 - transP);

      // B) TOP COLD MODULE (`y = -324 .. -18`): `10,000 HEX PALETTES` Brute-Force Enumeration
      if (leftModP > 0.01) {
        ctx.save();
        ctx.globalAlpha = leftModP * stripFocusAlpha;

        const bx = -622;
        const by = -324;
        const bw = 212;
        const bh = 304;

        ctx.fillStyle = 'rgba(11, 18, 32, 0.92)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.48)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, bh, 12);
        ctx.fill();
        ctx.stroke();

        ctx.font = '700 10.5px "JetBrains Mono", monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('AI COLOR BRUTE-FORCE', bx + 14, by + 22);

        // Counter racing smoothly `0 -> 10,000` over `lt = 0.20s -> 1.85s`
        const countP = E.expoOut(E.clamp((lt - 0.18) / 1.65));
        const colorCount = Math.min(10000, Math.round(10000 * countP));
        ctx.font = '800 20px "JetBrains Mono", "PingFang SC", monospace';
        ctx.fillStyle = '#f1f5f9';
        ctx.fillText(`${colorCount.toLocaleString()} 种配色`, bx + 14, by + 48);

        // Rapid 60fps `5 cols × 6 rows` Color Swatch Matrix flashing mechanically!
        const cols = 5;
        const rows = 6;
        const swW = 33;
        const swH = 26;
        const gapX = 5;
        const gapY = 5;
        const tick60 = Math.floor(t * 24);

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const idx = (r * cols + c + tick60) % SWATCH_PALETTE.length;
            const sx = bx + 14 + c * (swW + gapX);
            const sy = by + 72 + r * (swH + gapY);
            ctx.fillStyle = SWATCH_PALETTE[idx];
            ctx.beginPath();
            ctx.roundRect(sx, sy, swW, swH, 4);
            ctx.fill();
          }
        }

        // Live flashing HEX readout at bottom of module
        const activeHex = SWATCH_PALETTE[tick60 % SWATCH_PALETTE.length];
        ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`SCAN: ${activeHex} · RGB OK`, bx + 14, by + bh - 18);

        ctx.restore();
      }

      // C) BOTTOM COLD MODULE (`y = +10 .. +324`): `112.00 BPM · ±0.00ms` Rigid Beat Quantizer
      if (beatModP > 0.01) {
        ctx.save();
        ctx.globalAlpha = beatModP * stripFocusAlpha;

        const bx = -622;
        const by = 10;
        const bw = 212;
        const bh = 314;

        ctx.fillStyle = 'rgba(11, 18, 32, 0.92)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.48)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, bh, 12);
        ctx.fill();
        ctx.stroke();

        ctx.font = '700 10.5px "JetBrains Mono", monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('AI BEAT QUANTIZER', bx + 14, by + 22);

        ctx.font = '800 18px "PingFang SC", "JetBrains Mono", sans-serif';
        ctx.fillStyle = '#f1f5f9';
        ctx.fillText('卡准每一个鼓点', bx + 14, by + 48);

        // Mechanical 112 BPM 8-Step Sequencer Grid (`±0.00ms` zero-rubato flash!)
        const beatSec = 60 / 112;
        const step8 = Math.floor((t / (beatSec / 2)) % 8);
        const beatEnv = 1 - ((t % (beatSec / 2)) / (beatSec / 2));

        for (let s = 0; s < 8; s++) {
          const sx = bx + 14 + s * 23.5;
          const sy = by + 74;
          const active = s === step8;
          ctx.fillStyle = active ? '#00f5ff' : 'rgba(51, 65, 85, 0.65)';
          ctx.beginPath();
          ctx.roundRect(sx, sy, 19, 22, 4);
          ctx.fill();
        }

        // Rigid quantized vertical spectrum bars
        const numBars = 12;
        const baseBarY = by + 246;
        for (let b = 0; b < numBars; b++) {
          const hPhase = Math.abs(Math.sin(b * 1.3 + Math.floor(t * 14) * 0.9));
          const bhVal = 18 + hPhase * (b % 3 === 0 ? 112 * (0.45 + 0.55 * beatEnv) : 78);
          const barX = bx + 14 + b * 15.6;
          ctx.fillStyle = b % 3 === 0 ? '#38bdf8' : 'rgba(148, 163, 184, 0.55)';
          ctx.fillRect(barX, baseBarY - bhVal, 10.5, bhVal);
        }

        // Baseline & Cold Zero-Error Telemetry
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.beginPath();
        ctx.moveTo(bx + 14, baseBarY + 2);
        ctx.lineTo(bx + bw - 14, baseBarY + 2);
        ctx.stroke();

        ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('112.00 BPM · ±0.00ms', bx + 14, by + bh - 38);
        ctx.fillStyle = '#64748b';
        ctx.fillText('HUMAN RUBATO: 0.0%', bx + 14, by + bh - 18);

        ctx.restore();
      }

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

      ctx.restore();
    }

    // =========================================================================
    // 2. RIGHT POETIC WATERCOLOR & 12FPS SKETCH STAGE (`黄昏飞檐 · 风铃归鸟 · 叙事留白`)
    // =========================================================================
    _renderPoeticWatercolorStage(ctx, t, lt, t12, tearBaseX, sunsetP, eavesP, birdsP, softHitP, transP) {
      const tracePaperRegion = (offsetX = 0) => {
        ctx.beginPath();
        for (let i = 0; i < this.tearOffsets.length; i++) {
          const pt = this.tearOffsets[i];
          const px = tearBaseX + pt.dx + offsetX;
          if (i === 0) ctx.moveTo(px, pt.y);
          else ctx.lineTo(px, pt.y);
        }
        ctx.lineTo(660, 370);
        ctx.lineTo(660, -370);
        ctx.closePath();
      };

      ctx.save();

      // 1) Tactile Drop Shadow + White Fibrous Pulp Edge along the Hand-Torn Seam (0.00px lock with S08!)
      if (tearBaseX > -690) {
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
        ctx.shadowBlur = 24;
        ctx.shadowOffsetX = -8;
        ctx.fillStyle = '#fffdf9';
        tracePaperRegion(-7);
        ctx.fill();
        ctx.restore();
      }

      // 2) Warm Cream Cold-Press Paper Surface -> Deepens smoothly into Nocturnal Twilight (`#0b1120`) during `transP`!
      const paperG = ctx.createLinearGradient(tearBaseX, -360, 640, 360);
      paperG.addColorStop(0, '#fcf7e8');
      paperG.addColorStop(0.55, '#faf2dc');
      paperG.addColorStop(1, '#f2e5c6');
      ctx.fillStyle = paperG;
      tracePaperRegion(0);
      ctx.fill();

      ctx.save();
      tracePaperRegion(0);
      ctx.clip();

      // Twilight Sky Wash (`transP: 0 -> 1` sweeps deep nocturnal slate-indigo `#0b1120` down for S10!)
      if (transP > 0.002) {
        const twiG = ctx.createLinearGradient(0, -370, 0, 370);
        const darkA = E.smoothstep(E.clamp(transP * 1.12));
        twiG.addColorStop(0, `rgba(11, 17, 32, ${darkA})`);
        twiG.addColorStop(0.65, `rgba(13, 20, 38, ${E.smoothstep(E.clamp((transP - 0.08) / 0.92))})`);
        twiG.addColorStop(1, `rgba(11, 17, 32, ${E.smoothstep(E.clamp((transP - 0.16) / 0.84))})`);
        ctx.fillStyle = twiG;
        ctx.fillRect(-720, -370, 1400, 740);
      }

      // Subtle cotton-paper stipple grains (fade gently as night sky deepens)
      const sceneFade = 1 - E.smoothstep(E.clamp((transP - 0.12) / 0.72));
      if (sceneFade > 0.01) {
        ctx.fillStyle = '#8c7355';
        this.paperGrains.forEach((g) => {
          if (g.x < tearBaseX - 20) return;
          ctx.globalAlpha = g.alpha * sceneFade;
          ctx.beginPath();
          ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      }

      // Camera subtle breathing zoom + upward tilt (`cameraPanY` shifts scene down during `transP`!)
      const breathScale = 1.0 + 0.024 * E.smoothstep(E.clamp((lt - 4.0) / 4.5));
      const cameraPanY = 260 * E.cinematicInOut(transP);

      if (sceneFade > 0.01) {
        ctx.save();
        ctx.globalAlpha = sceneFade;
        ctx.translate(120, cameraPanY);
        ctx.scale(breathScale, breathScale);
        ctx.translate(-120, 0);

        // A) Wet-on-Wet Sunset Amber & Rose-Terracotta Watercolor Diffusion (`lt >= 3.82s`: “哪一抹颜色”)
        if (sunsetP > 0.005) {
          this._drawSunsetWatercolorWash(ctx, sunsetP, softHitP, t12);
        }

        // B) Distant Poetic Horizon & Mountain Wash (`留白` anchor in lower right)
        if (sunsetP > 0.15) {
          const horP = E.smoothstep(E.clamp((sunsetP - 0.15) / 0.85));
          this._drawDistantHorizonWash(ctx, horP, t12);
        }

        // C) 5 Delicate 12fps Hand-Sketched Returning Birds (`归鸟` across generous negative space!)
        if (birdsP > 0.01) {
          this._drawReturningBirds(ctx, lt, t12, birdsP);
        }

        // D) 12fps Hand-Sketched Wooden Courtyard Eaves & Swaying Glass Wind-Chime (`木质飞檐与风铃`)
        if (eavesP > 0.01) {
          this._drawCourtyardEavesAndChime(ctx, t, lt, t12, eavesP, softHitP);
        }

        ctx.restore();
      }

      // E) ONE-TAKE GOLDEN INSPIRATION FILAMENT (`lt >= 7.85s` -> detaches from wind-chime slip & locks `(0, 140)` for S10!)
      const filamentP = E.cinematicInOut(E.clamp((lt - 7.95) / 1.85));
      if (filamentP > 0.005) {
        this._drawAscendingGoldenFilament(ctx, t, t12, filamentP, transP, cameraPanY);
      }

      ctx.restore(); // end paper clip
      ctx.restore();
    }

    _drawSunsetWatercolorWash(ctx, sunsetP, softHitP, t12) {
      ctx.save();

      // Organic wet-on-wet layered sunset clouds across upper-right sky (`x = 40 .. +560`, `y = -250 .. +90`)
      const washes = [
        { cx: 310, cy: -68, rx: 285, ry: 145, col: 'rgba(253, 224, 71, 0.24)', delay: 0.00 },
        { cx: 245, cy: -38, rx: 235, ry: 118, col: 'rgba(251, 146, 60, 0.23)', delay: 0.10 },
        { cx: 368, cy: -92, rx: 210, ry: 104, col: 'rgba(251, 113, 133, 0.17)', delay: 0.20 },
        { cx: 145, cy: -12, rx: 190, ry: 86,  col: 'rgba(245, 158, 11, 0.18)', delay: 0.28 }
      ];

      washes.forEach((w, wi) => {
        const p = E.snappyOut(E.clamp((sunsetP - w.delay) / (1 - w.delay)));
        if (p <= 0.01) return;
        const rx = w.rx * p * (1 + softHitP * 0.06);
        const ry = w.ry * p * (1 + softHitP * 0.06);

        const rg = ctx.createRadialGradient(w.cx, w.cy, rx * 0.08, w.cx, w.cy, rx);
        rg.addColorStop(0, w.col);
        rg.addColorStop(0.68, w.col);
        rg.addColorStop(1, 'rgba(251, 191, 36, 0)');

        ctx.fillStyle = rg;
        ctx.beginPath();
        const steps = 28;
        for (let s = 0; s <= steps; s++) {
          const a = (s / steps) * Math.PI * 2;
          const edgeWobble = 1 + 0.12 * Math.sin(a * 3 + wi * 1.9) + 0.07 * Math.cos(a * 5 - wi);
          const px = w.cx + Math.cos(a) * rx * edgeWobble;
          const py = w.cy + Math.sin(a) * ry * edgeWobble;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
      });

      // Soft glowing setting sun disc nested inside the amber watercolor bloom (`cx = 346, cy = -54`)
      const sunP = E.smoothstep(E.clamp((sunsetP - 0.22) / 0.78));
      if (sunP > 0.01) {
        const sx = 346;
        const sy = -54;
        const sunHalo = ctx.createRadialGradient(sx, sy, 4, sx, sy, 74 * sunP);
        sunHalo.addColorStop(0, `rgba(255, 251, 235, ${0.88 * sunP})`);
        sunHalo.addColorStop(0.42, `rgba(251, 191, 36, ${0.46 * sunP})`);
        sunHalo.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = sunHalo;
        ctx.beginPath();
        ctx.arc(sx, sy, 74 * sunP, 0, Math.PI * 2);
        ctx.fill();

        // Delicate 12fps hand-sketched amber ring hinting at the setting sun
        ctx.save();
        ctx.globalAlpha *= 0.42 * sunP;
        this._drawPencilBezier(
          ctx,
          sx - 28, sy, sx - 28, sy - 36, sx + 28, sy - 36, sx + 28, sy,
          t12, 601.4, 1.6, '#d97706'
        );
        ctx.restore();
      }

      ctx.restore();
    }

    _drawDistantHorizonWash(ctx, horP, t12) {
      ctx.save();
      ctx.globalAlpha *= horP;

      // Subtle distant misty mountain silhouette in warm grey-ochre wash (`y ≈ 198 .. 235`, preserving vast negative space!)
      ctx.fillStyle = 'rgba(180, 146, 108, 0.16)';
      ctx.beginPath();
      ctx.moveTo(-120, 228);
      ctx.bezierCurveTo(20, 214, 140, 192, 255, 206);
      ctx.bezierCurveTo(360, 218, 460, 184, 595, 204);
      ctx.lineTo(650, 228);
      ctx.closePath();
      ctx.fill();

      // Whisper-thin 12fps graphite water-horizon reflection strokes
      this._drawPencilBezier(
        ctx,
        -60, 228, 120, 226, 360, 230, 585, 227,
        t12, 712.5, 1.3, 'rgba(120, 96, 72, 0.42)'
      );
      this._drawPencilBezier(
        ctx,
        240, 242, 310, 241, 385, 243, 445, 241,
        t12, 735.1, 1.1, 'rgba(217, 119, 6, 0.38)'
      );

      ctx.restore();
    }

    _drawReturningBirds(ctx, lt, t12, birdsP) {
      ctx.save();
      ctx.globalAlpha *= birdsP;

      const flyT = Math.max(0, lt - 5.15);
      this.birds.forEach((b, bi) => {
        const bx = b.x0 + flyT * b.vx;
        const by = b.y0 + flyT * b.vy + Math.sin(t12 * 3.2 + b.phase) * 2.2;
        const flap = Math.sin(t12 * 7.5 + b.phase);
        const wingY = -b.span * (0.28 + 0.36 * flap);

        // Left & right 12fps calligraphy-pencil wings
        this._drawPencilBezier(
          ctx,
          bx - b.span, by + wingY,
          bx - b.span * 0.48, by - b.span * 0.32,
          bx - b.span * 0.16, by - 1,
          bx, by,
          t12, 800 + bi * 19, 1.8, '#4a3b2f'
        );
        this._drawPencilBezier(
          ctx,
          bx, by,
          bx + b.span * 0.16, by - 1,
          bx + b.span * 0.48, by - b.span * 0.32,
          bx + b.span, by + wingY,
          t12, 810 + bi * 19, 1.8, '#4a3b2f'
        );
      });

      ctx.restore();
    }

    _drawCourtyardEavesAndChime(ctx, t, lt, t12, eavesP, softHitP) {
      ctx.save();

      // Progressive left-to-right hand-drawing reveal clip (`x = -410 .. -30`)
      ctx.save();
      ctx.beginPath();
      ctx.rect(-420, -340, 420 * eavesP, 540);
      ctx.clip();

      // Warm sepia architectural wash under the wooden eaves
      ctx.fillStyle = 'rgba(92, 68, 48, 0.13)';
      ctx.beginPath();
      ctx.moveTo(-405, -245);
      ctx.quadraticCurveTo(-245, -182, -74, -128);
      ctx.quadraticCurveTo(-102, -104, -138, -102);
      ctx.lineTo(-405, -142);
      ctx.closePath();
      ctx.fill();

      // Main upturned flying-eaves ridge curve (`飞檐主脊`, sweeping gracefully upward at tip `(-70, -132)`)
      this._drawPencilBezier(
        ctx,
        -405, -246,
        -265, -192,
        -142, -138,
        -68, -134,
        t12, 901.2, 3.4, '#3b3026'
      );

      // Lower wooden fascia beam (`檐口额枋`)
      this._drawPencilBezier(
        ctx,
        -405, -152,
        -275, -132,
        -168, -112,
        -92, -110,
        t12, 915.6, 2.8, '#3b3026'
      );

      // Upturned eaves horn tip (`翘角封檐`)
      this._drawPencilBezier(
        ctx,
        -68, -134,
        -72, -120,
        -80, -112,
        -92, -110,
        t12, 928.4, 2.8, '#3b3026'
      );

      // 7 Hand-sketched clay roof tile ribs & semicircular drip tiles (`筒瓦与瓦当`)
      for (let k = 0; k < 7; k++) {
        const u = (k + 0.6) / 7.4;
        const txTop = E.lerp(-380, -115, u);
        const tyTop = E.lerp(-234, -142, u);
        const txBot = txTop + 18;
        const tyBot = E.lerp(-156, -113, u);

        this._drawPencilBezier(
          ctx,
          txTop, tyTop,
          (txTop + txBot) * 0.5 - 4, (tyTop + tyBot) * 0.5,
          (txTop + txBot) * 0.5 + 2, (tyTop + tyBot) * 0.5 + 4,
          txBot, tyBot,
          t12, 940 + k * 11, 1.7, 'rgba(59, 48, 38, 0.72)'
        );

        // Round drip-tile end (`瓦当`)
        ctx.save();
        ctx.strokeStyle = 'rgba(59, 48, 38, 0.75)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(txBot + 2, tyBot - 2, 5.2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Exposed wooden rafters (`檐下椽木阴影排线`)
      for (let r = 0; r < 6; r++) {
        const rx = -368 + r * 44;
        const ry = E.lerp(-150, -116, r / 6);
        this._drawPencilBezier(
          ctx,
          rx, ry, rx - 6, ry + 10, rx - 12, ry + 18, rx - 18, ry + 26,
          t12, 995 + r * 7, 1.5, 'rgba(59, 48, 38, 0.46)'
        );
      }
      ctx.restore(); // end progressive eaves clip

      // Delicate Glass Wind-Chime & Fluttering Paper Slip (`玻璃风铃与短册`) hanging from `(-108, -111)`!
      if (eavesP > 0.68) {
        const chimeAppear = E.snappyOut(E.clamp((eavesP - 0.68) / 0.32));
        const anchorX = -108;
        const anchorY = -111;

        // Gentle evening breeze sway (amplifies warmly on `softHitP` at “击中人心底的柔软”!)
        const breezeAmp = 0.07 + softHitP * 0.11;
        const swayAngle = Math.sin(t * 2.15 - 0.6) * breezeAmp;

        ctx.save();
        ctx.globalAlpha *= chimeAppear;
        ctx.translate(anchorX, anchorY);
        ctx.rotate(swayAngle);

        // Hanging silk cord (`0 -> 26`)
        this._drawPencilBezier(ctx, 0, 0, 0, 9, 0, 18, 0, 26, t12, 1020.3, 1.6, '#4a3b2f');

        // Translucent hand-blown glass bell (`y = 26 .. 64`) catching golden sunset light!
        const bellG = ctx.createRadialGradient(4, 42, 2, 0, 46, 24);
        bellG.addColorStop(0, 'rgba(255, 251, 235, 0.78)');
        bellG.addColorStop(0.6, 'rgba(253, 224, 71, 0.28)');
        bellG.addColorStop(1, 'rgba(186, 230, 253, 0.22)');
        ctx.fillStyle = bellG;
        ctx.beginPath();
        ctx.moveTo(0, 26);
        ctx.bezierCurveTo(-22, 28, -24, 54, -20, 63);
        ctx.quadraticCurveTo(0, 68, 20, 63);
        ctx.bezierCurveTo(24, 54, 22, 28, 0, 26);
        ctx.closePath();
        ctx.fill();

        // 12fps Pencil outline of glass wind-chime bell
        this._drawPencilBezier(ctx, 0, 26, -22, 28, -24, 54, -20, 63, t12, 1031.1, 2.0, '#3b3026');
        this._drawPencilBezier(ctx, 0, 26, 22, 28, 24, 54, 20, 63, t12, 1042.7, 2.0, '#3b3026');
        this._drawPencilBezier(ctx, -20, 63, -8, 67, 8, 67, 20, 63, t12, 1055.9, 1.8, '#3b3026');

        // Wooden clapper bead + lower thread (`y = 52 -> 92`)
        ctx.fillStyle = '#92400e';
        ctx.beginPath();
        ctx.arc(0, 56, 3.6, 0, Math.PI * 2);
        ctx.fill();
        this._drawPencilBezier(ctx, 0, 59, 1, 72, 2, 82, 4, 94, t12, 1068.4, 1.4, '#4a3b2f');

        // Fluttering Warm-Amber Tanzaku Paper Slip (`短册`, `y = 94 .. 168`)
        const flutter = Math.sin(t * 3.4) * (4 + softHitP * 6);
        ctx.save();
        ctx.translate(4, 94);
        ctx.rotate(swayAngle * 0.85 + flutter * 0.025);

        const slipG = ctx.createLinearGradient(0, 0, 14, 72);
        slipG.addColorStop(0, '#fef3c7');
        slipG.addColorStop(1, '#fde68a');
        ctx.fillStyle = slipG;
        ctx.beginPath();
        ctx.moveTo(-9, 0);
        ctx.lineTo(9, 0);
        ctx.quadraticCurveTo(11 + flutter * 0.4, 36, 8 + flutter, 72);
        ctx.lineTo(-10 + flutter, 70);
        ctx.quadraticCurveTo(-7 + flutter * 0.4, 35, -9, 0);
        ctx.closePath();
        ctx.fill();

        this._drawPencilBezier(ctx, -9, 0, -7 + flutter * 0.4, 35, -9 + flutter, 54, -10 + flutter, 70, t12, 1080.2, 1.5, '#78350f');
        this._drawPencilBezier(ctx, 9, 0, 11 + flutter * 0.4, 36, 9 + flutter, 55, 8 + flutter, 72, t12, 1091.8, 1.5, '#78350f');
        // Tiny poetic vertical brush stroke inside the paper slip
        this._drawPencilBezier(ctx, 0, 14, 1 + flutter * 0.2, 28, 2 + flutter * 0.5, 42, 1 + flutter * 0.7, 54, t12, 1104.5, 1.4, '#b45309');

        ctx.restore();
        ctx.restore();

        // Warm Golden Acoustic-Heart Ripples & Floating Dust Motes on `softHitP` (“能击中人心底的柔软”)!
        if (softHitP > 0.01) {
          const chimeWorldX = anchorX;
          const chimeWorldY = anchorY + 56;

          for (let ring = 0; ring < 2; ring++) {
            const rp = E.clamp((softHitP - ring * 0.22) / 0.78);
            if (rp <= 0) continue;
            const rad = 26 + rp * 240;
            ctx.save();
            ctx.strokeStyle = `rgba(217, 119, 6, ${(1 - rp) * 0.42})`;
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.arc(chimeWorldX, chimeWorldY, rad, -0.45, Math.PI * 0.75);
            ctx.stroke();
            ctx.restore();
          }

          this.softMotes.forEach((m) => {
            const dist = softHitP * m.speed * 2.4;
            const mx = chimeWorldX + 20 + Math.cos(m.ang) * dist + softHitP * 95;
            const my = chimeWorldY + 35 + Math.sin(m.ang) * dist * 0.55 + softHitP * m.driftY;
            ctx.fillStyle = m.col;
            ctx.beginPath();
            ctx.arc(mx, my, m.r * (1 - softHitP * 0.25), 0, Math.PI * 2);
            ctx.fill();
          });
        }
      }

      ctx.restore();
    }

    // =========================================================================
    // 3. ONE-TAKE HANDOFF -> S10 (`手绘琥珀金线` detaches & locks `(0, 140)`!)
    // =========================================================================
    _drawAscendingGoldenFilament(ctx, t, t12, filamentP, transP, cameraPanY) {
      // Starts at the fluttering paper-slip tip `(-104, 58 + cameraPanY)` and curls to `(0, 140)` pointing straight up!
      const p0 = { x: E.lerp(-104, 0, transP * 0.35), y: E.lerp(58 + cameraPanY, 310, transP) };
      const p1 = { x: E.lerp(-42, -36, transP),       y: E.lerp(96 + cameraPanY * 0.6, 250, transP) };
      const p2 = { x: E.lerp(18, 16, transP),         y: E.lerp(42 + cameraPanY * 0.2, 192, transP) };
      const p3 = { x: 0,                              y: 140 };

      const seg = E.splitCubicBezier(p0, p1, p2, p3, filamentP);
      const tip = seg[3];

      ctx.save();
      // Soft warm amber watercolor glow around the rising hand-drawn golden line
      ctx.shadowColor = 'rgba(251, 191, 36, 0.85)';
      ctx.shadowBlur = 18;
      this._drawPencilBezier(
        ctx,
        seg[0].x, seg[0].y,
        seg[1].x, seg[1].y,
        seg[2].x, seg[2].y,
        seg[3].x, seg[3].y,
        t12, 1250.7, 3.6, '#fbbf24'
      );

      // Glowing spark head at `(tip.x, tip.y)` — at `lt = 9.80s / transP = 1.0`, `tip` is `(0, 140)`!
      const headHalo = ctx.createRadialGradient(tip.x, tip.y, 1, tip.x, tip.y, 26);
      headHalo.addColorStop(0, 'rgba(255, 251, 235, 0.98)');
      headHalo.addColorStop(0.45, 'rgba(251, 191, 36, 0.65)');
      headHalo.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = headHalo;
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, 26, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    _renderForeground(t, lt, sunsetP, transP, ctx, width, height) {
      // Soft vignette (warm & airy during paper scene, deepens slightly into nocturnal twilight for S10)
      const vig = ctx.createRadialGradient(
        width * 0.5, height * 0.5, width * 0.44,
        width * 0.5, height * 0.5, width * 0.86
      );
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, `rgba(10, 8, 6, ${E.lerp(0.24, 0.46, transP)})`);
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, width, height);

      // Voiceover Subtitles (Synced to Yunxi `s09` starting at `62.75s / lt = 0.15s`, zero trailing commas!)
      const subY = height - Math.max(36, height * 0.072);
      const subFont = Math.max(15, Math.round(width * 0.0175));
      ctx.save();
      ctx.font = `600 ${subFont}px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let subText = '';
      let subAlpha = 0;

      if (lt >= 0.15 && lt < 3.62) {
        subText = '它能穷举一万种配色、卡准每一个鼓点';
        subAlpha = E.smoothstep(E.invLerp(0.15, 0.38, lt)) * (1 - E.smoothstep(E.invLerp(3.38, 3.62, lt)));
      } else if (lt >= 3.68 && lt < 6.45) {
        subText = '却不知道哪一抹颜色、哪一秒留白';
        subAlpha = E.smoothstep(E.invLerp(3.68, 3.92, lt)) * (1 - E.smoothstep(E.invLerp(6.22, 6.45, lt)));
      } else if (lt >= 6.50 && lt < 9.15) {
        subText = '能击中人心底的柔软。';
        subAlpha = E.smoothstep(E.invLerp(6.50, 6.74, lt)) * (1 - E.smoothstep(E.invLerp(8.80, 9.15, lt)));
      }

      if (subAlpha > 0.01 && subText) {
        const padX = 26;
        const pillH = Math.round(subFont * 1.95);
        const pillW = Math.ceil(ctx.measureText(subText).width) + padX * 2;
        ctx.globalAlpha = subAlpha;
        ctx.fillStyle = 'rgba(18, 15, 12, 0.78)';
        ctx.beginPath();
        ctx.roundRect(width / 2 - pillW / 2, subY - pillH / 2, pillW, pillH, pillH / 2);
        ctx.fill();

        ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
        ctx.shadowBlur = 6;
        ctx.fillStyle = lt >= 6.50 ? '#fef08a' : 'rgba(248, 250, 252, 0.98)';
        ctx.fillText(subText, width / 2, subY + 1);
      }
      ctx.restore();
    }
  }

  window.ShotS09Warmth = ShotS09Warmth;
})();
