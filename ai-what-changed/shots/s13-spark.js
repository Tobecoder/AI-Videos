/**
 * SHOT S13 (96.80s - 102.00s): 尾版 · 灵魂火种（12fps 手绘呼吸火苗 + 「工具重塑边界 · 想法定义灵魂」 -> 0.00px 闭环衔接 S01）
 *
 * Zero-Seam One-Take Finale & Infinite Mobius Loop Lock to S01 (`t = 0.00s`):
 *   [96.80s / lt=0.00s] Exact 0.00px lock with S12's converged warm golden core at `(0, -24)` on `#060911` and
 *                       `stage3D` camera at `(0, 0, 14.2)`!
 *   [96.95s - 100.75s]  Yunxi: “去创造，只有你想得到的东西吧。”
 *                       All complex tech FX rest in quiet stillness; at center `(0, -24)`, a delicate 12fps
 *                       hand-sketched pencil & wet-on-wet amber watercolor Soul Flame (`人类灵感火种`) breathes
 *                       warmly above timeless editorial typography:
 *                         `工具重塑边界  ·  想法定义灵魂`
 *   [100.75s - 102.00s] Infinite Loop Morph -> S01 (`t = 0.00s`):
 *                       A tiny rising spark lifts from the tip of the warm flame, cool-shifting from amber gold
 *                       into S01's exact cyan-blue terminal cursor & `rgba(14, 116, 190, 0.14)` ambient spotlight,
 *                       so wrapping `102.00s -> 0.00s` seamlessly opens S01's prompt bar for an infinite loop!
 */
(function () {
  const E = window.MGEasing;

  class ShotS13Spark {
    constructor(stage3D) {
      this.stage = stage3D;
      this.startTime = 96.80;
      this.endTime = 102.00;
      this.duration = this.endTime - this.startTime; // 5.20s
    }

    _sketchJitter(t12, seed, amp = 1.4) {
      const h = Math.sin(t12 * 37.0 + seed * 17.31) * 43758.5453;
      return ((h - Math.floor(h)) - 0.5) * 2 * amp;
    }

    _drawPencilBezier(ctx, x0, y0, cx1, cy1, cx2, cy2, x1, y1, t12, seed, width = 2.6, col = '#fbbf24') {
      for (let pass = 0; pass < 2; pass++) {
        const j = pass === 0 ? 0.85 : 1.45;
        const s = seed + pass * 13.7;
        ctx.save();
        ctx.strokeStyle = col;
        ctx.globalAlpha *= (pass === 0 ? 0.92 : 0.42);
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
      const lt = Math.max(0, t - this.startTime); // 0.00 -> 5.20s
      const loopP = E.cinematicInOut(E.clamp((lt - 3.95) / 1.25)); // Morph -> S01 `t = 0.00s`!
      this._updateStage3D(t, lt, loopP);

      vecCtx.clearRect(0, 0, width, height);
      fgCtx.clearRect(0, 0, width, height);

      const baseW = 1280;
      const baseH = 720;
      const scaleFit = Math.min(width / baseW, height / baseH);
      const t12 = Math.floor(t * 12) / 12;

      // Ambient Spotlight Crossfade: Warm Amber Watercolor -> S01's exact `rgba(14, 116, 190, 0.14)` spotlight!
      if (loopP > 0.01) {
        const s01Spot = vecCtx.createRadialGradient(
          width * 0.5, height * 0.48, 10,
          width * 0.5, height * 0.48, width * 0.52
        );
        s01Spot.addColorStop(0, `rgba(14, 116, 190, ${0.14 * loopP})`);
        s01Spot.addColorStop(0.55, `rgba(15, 23, 42, ${0.08 * loopP})`);
        s01Spot.addColorStop(1, 'rgba(5, 8, 16, 0)');
        vecCtx.fillStyle = s01Spot;
        vecCtx.fillRect(0, 0, width, height);
      }

      vecCtx.save();
      vecCtx.translate(width / 2, height / 2);
      const slowPull = E.lerp(1.0, 0.94, loopP); // Matches S01 `camZoom = 0.94` at `t = 0.00s`!
      vecCtx.scale(scaleFit * slowPull, scaleFit * slowPull);

      // 1) 12FPS BREATHING HAND-SKETCHED SOUL FLAME (`(0, -24)`)
      const flameFade = 1 - E.smoothstep(E.clamp((loopP - 0.10) / 0.65));
      if (flameFade > 0.01) {
        this._drawHandSketchedSoulFlame(vecCtx, t, lt, t12, flameFade);
      }

      // 2) TIMELESS CLOSING MAXIM (`工具重塑边界 · 想法定义灵魂`)
      const maximIn = E.smoothstep(E.clamp((lt - 0.45) / 0.85));
      const maximOut = 1 - E.smoothstep(E.clamp((lt - 3.85) / 0.65));
      const maximAlpha = maximIn * maximOut;
      if (maximAlpha > 0.01) {
        this._drawClosingMaxim(vecCtx, t12, maximAlpha);
      }

      // 3) RISING SPARK -> CYAN TERMINAL CURSOR `_` (Infinite Mobius Loop into S01 `t = 0.00s`!)
      if (loopP > 0.01) {
        this._drawLoopCursorMorph(vecCtx, t, loopP);
      }

      vecCtx.restore();

      // Cinema Vignette & Closing Voiceover Subtitle
      this._renderForeground(t, lt, loopP, fgCtx, width, height);
    }

    _updateStage3D(t, lt, loopP) {
      // Matches `stage3D.updateS01(0)` (`camZ = 14.2`, `gridMat = 0.11`, `pMat = 0.30`) 100% seamlessly!
      const camX = Math.sin(0) * 0.08;
      const camY = Math.cos(0) * 0.06 * loopP;
      this.stage.camera.position.set(camX, camY, 14.2);
      this.stage.camera.lookAt(camX * 0.92, camY * 0.92, 0);
      this.stage.gridMat.opacity = 0.11;
      this.stage.pMat.opacity = 0.30;
      this.stage.renderer.render(this.stage.scene, this.stage.camera);
    }

    _drawHandSketchedSoulFlame(ctx, t, lt, t12, flameFade) {
      ctx.save();
      ctx.globalAlpha = flameFade;
      ctx.translate(0, -24);

      const breath = 1 + Math.sin(t12 * 4.2) * 0.045;
      const swayX = Math.sin(t12 * 3.1) * 3.5;

      // Soft Wet-on-Wet Amber Watercolor Halo (`0.00px` match with S12's `coreGlowR = 115` at `lt = 0`!)
      const haloR = (115 + Math.sin(t * 2.2) * 8);
      const wg = ctx.createRadialGradient(0, -10, 4, 0, -10, haloR);
      wg.addColorStop(0, 'rgba(255, 251, 235, 0.88)');
      wg.addColorStop(0.32, 'rgba(251, 191, 36, 0.42)');
      wg.addColorStop(0.68, 'rgba(249, 115, 22, 0.16)');
      wg.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = wg;
      ctx.beginPath();
      ctx.arc(0, -10, haloR, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.scale(breath, breath);

      // Translucent Warm Amber Inner Flame Fill
      const fg = ctx.createLinearGradient(0, 32, swayX, -64);
      fg.addColorStop(0, 'rgba(245, 158, 11, 0.72)');
      fg.addColorStop(0.55, 'rgba(251, 191, 36, 0.85)');
      fg.addColorStop(1, 'rgba(255, 251, 235, 0.95)');
      ctx.fillStyle = fg;
      ctx.beginPath();
      ctx.moveTo(0, 32);
      ctx.bezierCurveTo(-34, 24, -32, -24, swayX, -66);
      ctx.bezierCurveTo(32, -24, 34, 24, 0, 32);
      ctx.closePath();
      ctx.fill();

      // 12fps Boiling Hand-Sketched Pencil Contour of the Outer & Inner Flame!
      this._drawPencilBezier(ctx, 0, 32, -34, 24, -32, -24, swayX, -66, t12, 2401.3, 3.0, '#fde68a');
      this._drawPencilBezier(ctx, swayX, -66, 32, -24, 34, 24, 0, 32, t12, 2415.8, 3.0, '#fde68a');

      // Warm Inner Core Wick Teardrop
      this._drawPencilBezier(ctx, 0, 26, -14, 18, -12, -8, swayX * 0.5, -28, t12, 2430.2, 2.0, '#fffbeb');
      this._drawPencilBezier(ctx, swayX * 0.5, -28, 12, -8, 14, 18, 0, 26, t12, 2442.9, 2.0, '#fffbeb');

      // Subtle hand-sketched candle/hearth resting arc beneath the flame
      this._drawPencilBezier(ctx, -28, 42, -10, 46, 10, 46, 28, 42, t12, 2460.5, 1.8, 'rgba(217, 119, 6, 0.55)');

      ctx.restore();
      ctx.restore();
    }

    _drawClosingMaxim(ctx, t12, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;

      const jx = this._sketchJitter(t12, 81.4, 0.65);
      const jy = this._sketchJitter(t12, 93.2, 0.65);

      // Main Closing Maxim
      ctx.font = '700 28px "PingFang SC", "STKaiti", "Kaiti SC", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(245, 158, 11, 0.42)';
      ctx.shadowBlur = 14;
      ctx.fillStyle = '#fef3c7';
      ctx.fillText('工具重塑边界  ·  想法定义灵魂', jx, 86 + jy);

      // Subtle bilingual documentary endplate subtitle
      ctx.shadowBlur = 0;
      ctx.font = '500 12.5px "JetBrains Mono", "Inter", sans-serif';
      ctx.fillStyle = 'rgba(148, 163, 184, 0.72)';
      ctx.fillText('TOOLS RESHAPE BOUNDARIES  ·  IDEAS DEFINE THE SOUL', 0, 122);

      ctx.restore();
    }

    _drawLoopCursorMorph(ctx, t, loopP) {
      // Spark lifts from flame tip `(0, -86)` and settles down into `(0, 16)` while shifting amber -> cyan `_`!
      const sy = E.lerp(-86, 16, E.cinematicInOut(loopP));
      const colorMix = E.smoothstep(E.clamp((loopP - 0.25) / 0.65));

      const r = Math.round(E.lerp(251, 56, colorMix));
      const g = Math.round(E.lerp(191, 224, colorMix));
      const b = Math.round(E.lerp(36, 255, colorMix));
      const fadeEnd = 1 - E.smoothstep(E.clamp((loopP - 0.82) / 0.18));

      ctx.save();
      ctx.globalAlpha = Math.max(0.12, fadeEnd);

      // Soft halo around morphing spark/cursor
      const halo = ctx.createRadialGradient(0, sy, 1, 0, sy, 28);
      halo.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.90)`);
      halo.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(0, sy, 28, 0, Math.PI * 2);
      ctx.fill();

      // Morphs from round golden spark into glowing cyan terminal cursor `_`!
      const cursorW = E.lerp(7, 22, colorMix);
      const cursorH = E.lerp(7, 4, colorMix);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.beginPath();
      ctx.roundRect(-cursorW / 2, sy - cursorH / 2, cursorW, cursorH, 2);
      ctx.fill();

      ctx.restore();
    }

    _renderForeground(t, lt, loopP, ctx, width, height) {
      // Matches S01's foreground vignette seamlessly as `loopP -> 1`
      const vig = ctx.createRadialGradient(
        width * 0.5, height * 0.5, width * 0.38,
        width * 0.5, height * 0.5, width * 0.85
      );
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, `rgba(2, 4, 10, ${E.lerp(0.46, 0.38, loopP)})`);
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, width, height);

      // Closing Voiceover Subtitle (Synced to Yunxi `s13` starting at `96.95s / lt = 0.15s`)
      const subY = height - Math.max(36, height * 0.072);
      const subFont = Math.max(15, Math.round(width * 0.0175));
      ctx.save();
      ctx.font = `600 ${subFont}px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let subText = '';
      let subAlpha = 0;

      if (lt >= 0.15 && lt < 3.65) {
        subText = '去创造，只有你想得到的东西吧。';
        subAlpha = E.smoothstep(E.invLerp(0.15, 0.38, lt)) * (1 - E.smoothstep(E.invLerp(3.25, 3.65, lt)));
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
        ctx.fillStyle = '#fef08a';
        ctx.fillText(subText, width / 2, subY + 1);
      }
      ctx.restore();
    }
  }

  window.ShotS13Spark = ShotS13Spark;
})();
