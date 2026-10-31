/**
 * SHOT S11 (80.60s - 87.80s): 第六幕 · 升华金句（冷灰风化沙砾「做出来越来越廉价」 vs 12fps 手绘鎏金「好想法前所未有地昂贵」）
 *
 * Zero-Seam One-Take Continuity & Spatial Kinetic Material Contrast:
 *   [80.60s / lt=0.00s] Exact 0.00px lock with S10's `#0b1120` twilight stage and glowing golden filament spark
 *                       waiting at `(-360, 42)`!
 *   [80.78s - 82.45s]   Yunxi: “当做出来越来越廉价”
 *                       Upper spatial line (`y = -88`): Cold cyan-slate wireframe construction guides snap together
 *                       `当「做出来」越来越廉价`, then immediately begin fracturing left-to-right into 340 weightless
 *                       grey sand particles drifting away in the wind!
 *   [82.55s - 86.65s]   Yunxi: “一个真正的好想法，才变得前所未有地昂贵。”
 *                       Lower focal plane (`y = +42`): The waiting 12fps golden filament sweeps `x: -360 -> +360`,
 *                       blooming a warm wet-on-wet amber watercolor glow and igniting monumental hand-crafted serif
 *                       typography: `「好想法」才前所未有地昂贵`!
 *   [86.65s - 87.80s]   One-Take Perspective Stretch -> S12:
 *                       The golden underline stretches in 3D perspective toward the central horizon `(0, -24)` as a
 *                       Golden Navigation Heading Beam while concentric astrolabe rings emerge at `(0, 36)` — locking
 *                       0.00px onto S12's Navigator's Helm!
 */
(function () {
  const E = window.MGEasing;

  class ShotS11Thesis {
    constructor(stage3D) {
      this.stage = stage3D;
      this.startTime = 80.60;
      this.endTime = 87.80;
      this.duration = this.endTime - this.startTime; // 7.20s

      // 340 Wind-Sand Erosion Particles for dissolving `当「做出来」越来越廉价`
      this.sandParticles = [];
      for (let i = 0; i < 340; i++) {
        const s1 = Math.sin(i * 23.17 + 1.4) * 43758.54;
        const r1 = s1 - Math.floor(s1);
        const s2 = Math.sin(i * 67.89 + 5.2) * 27183.39;
        const r2 = s2 - Math.floor(s2);
        this.sandParticles.push({
          bx: -290 + r1 * 580,
          by: -112 + r2 * 48,
          vx: 85 + (i % 7) * 24,
          vy: -18 + ((i % 9) - 4) * 9,
          r: 1.1 + (i % 3) * 0.75,
          alpha: 0.35 + (i % 4) * 0.14
        });
      }

      // Warm ascending golden bokeh embers around `「好想法」才前所未有地昂贵`
      this.goldEmbers = [];
      for (let i = 0; i < 42; i++) {
        const s1 = Math.sin(i * 41.3 + 2.7) * 31415.92;
        const r1 = s1 - Math.floor(s1);
        this.goldEmbers.push({
          x: -360 + r1 * 720,
          baseY: 68 + (i % 5) * 12,
          vy: 16 + (i % 4) * 8,
          r: 1.6 + (i % 4) * 1.35,
          phase: i * 0.9
        });
      }
    }

    _sketchJitter(t12, seed, amp = 1.6) {
      const h = Math.sin(t12 * 37.0 + seed * 17.31) * 43758.5453;
      return ((h - Math.floor(h)) - 0.5) * 2 * amp;
    }

    _drawPencilBezier(ctx, x0, y0, cx1, cy1, cx2, cy2, x1, y1, t12, seed, width = 3.2, col = '#fbbf24') {
      for (let pass = 0; pass < 2; pass++) {
        const j = pass === 0 ? 0.85 : 1.55;
        const s = seed + pass * 14.7;
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

    render(t, vecCtx, fgCtx, width, height) {
      const lt = Math.max(0, t - this.startTime); // 0.00 -> 7.20s
      const transP = E.cinematicInOut(E.clamp((lt - 6.02) / 1.18)); // One-Take Stretch -> S12 Helm!
      this._updateStage3D(t, lt, transP);

      vecCtx.clearRect(0, 0, width, height);
      fgCtx.clearRect(0, 0, width, height);

      const baseW = 1280;
      const baseH = 720;
      const scaleFit = Math.min(width / baseW, height / baseH);
      const t12 = Math.floor(t * 12) / 12;

      // Sub-beat Choreography Curves (Synced to Yunxi `s11` starting at `80.78s / lt = 0.18s`):
      // 1) Upper Cold Wireframe Line (`lt = 0.15s -> 0.85s`) & Wind-Sand Erosion (`lt = 1.25s -> 4.35s`)
      const cheapInP = E.snappyOut(E.clamp((lt - 0.12) / 0.65));
      const erodeP = E.smoothstep(E.clamp((lt - 1.28) / 2.85));
      // 2) Lower Golden Filament Sweep (`lt = 1.88s -> 4.35s` on “一个真正的好想法，才变得前所未有地昂贵”)
      const goldSweepP = E.cinematicInOut(E.clamp((lt - 1.88) / 2.45));
      const preciousGlowP = E.snappyOut(E.clamp((lt - 4.55) / 1.15));

      // Deep Nocturnal Slate Backdrop (`#0b1120` -> `#070b16` during `transP`)
      vecCtx.fillStyle = transP > 0.5 ? '#070b16' : '#0b1120';
      vecCtx.fillRect(0, 0, width, height);

      vecCtx.save();
      vecCtx.translate(width / 2, height / 2);
      // Subtle slow cinematic dolly-in (`1.00 -> 1.05`)
      const dolly = 1.0 + 0.045 * E.smoothstep(lt / 6.0) * (1 - transP);
      vecCtx.scale(scaleFit * dolly, scaleFit * dolly);

      // 1) UPPER LINE: Cold Mass-Produced Wireframe `当「做出来」越来越廉价` + Sand Erosion!
      if (cheapInP > 0.01 && erodeP < 0.999 && transP < 0.95) {
        this._renderDissolvingCheapLine(vecCtx, lt, cheapInP, erodeP, transP);
      }

      // 2) LOWER FOCAL LINE: 12fps Hand-Drawn Golden `「好想法」才前所未有地昂贵`!
      this._renderPreciousGoldenLine(vecCtx, t, lt, t12, goldSweepP, preciousGlowP, transP);

      // 3) ONE-TAKE 3D HORIZON STRETCH & ASTROLABE HELM EMERGENCE (`transP: 0 -> 1` locks to S12!)
      if (transP > 0.005) {
        this._renderHelmHorizonEmergence(vecCtx, t, t12, transP);
      }

      vecCtx.restore();

      // Cinema Vignette & Voiceover Subtitles
      this._renderForeground(t, lt, preciousGlowP, fgCtx, width, height);
    }

    _updateStage3D(t, lt, transP) {
      this.stage.gridMat.opacity = E.lerp(0.09, 0.15, transP);
      this.stage.pMat.opacity = E.lerp(0.24, 0.42, transP);
      this.stage.camera.position.set(0, E.lerp(0.2, 0.0, transP), E.lerp(11.2, 9.6, transP));
      this.stage.camera.lookAt(0, 0, 0);
      this.stage.renderer.render(this.stage.scene, this.stage.camera);
    }

    _renderDissolvingCheapLine(ctx, lt, cheapInP, erodeP, transP) {
      ctx.save();
      ctx.globalAlpha = cheapInP * (1 - transP);

      // Wind erosion front sweeping left-to-right from `x = -340` to `x = +380`
      const erodeFrontX = E.lerp(-340, 390, erodeP);

      // Intact portion of cold wireframe text to the right of `erodeFrontX`
      if (erodeFrontX < 340) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(erodeFrontX, -155, 740, 120);
        ctx.clip();

        // Cold CAD construction bounding hairlines
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-310, -118); ctx.lineTo(310, -118);
        ctx.moveTo(-310, -56);  ctx.lineTo(310, -56);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.font = '600 34px "PingFang SC", "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(148, 163, 184, 0.42)';
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.78)';
        ctx.lineWidth = 1.2;
        ctx.fillText('当「做出来」越来越廉价', 0, -86);
        ctx.strokeText('当「做出来」越来越廉价', 0, -86);

        ctx.restore();
      }

      // Sand/Dust Particles peeling off behind `erodeFrontX` and drifting away to the right!
      if (erodeP > 0.01) {
        this.sandParticles.forEach((p) => {
          if (p.bx > erodeFrontX) return;
          const age = Math.max(0, (erodeFrontX - p.bx) / 360);
          if (age >= 1) return;
          const px = p.bx + age * p.vx * 1.65;
          const py = p.by + age * p.vy + age * age * 16;
          ctx.fillStyle = `rgba(148, 163, 184, ${p.alpha * (1 - age)})`;
          ctx.beginPath();
          ctx.arc(px, py, p.r * (1 - age * 0.4), 0, Math.PI * 2);
          ctx.fill();
        });
      }

      ctx.restore();
    }

    _renderPreciousGoldenLine(ctx, t, lt, t12, goldSweepP, preciousGlowP, transP) {
      const fadeOut = 1 - E.smoothstep(E.clamp((transP - 0.08) / 0.65));

      // Waiting & sweeping golden spark head: starts at `(-360, 42)` (`0.00px` lock with S10 end!) -> sweeps to `(+360, 42)`
      const brushX = E.lerp(-360, 368, goldSweepP);
      const brushY = 42 + Math.sin(goldSweepP * Math.PI * 2) * 6;

      if (fadeOut > 0.01) {
        ctx.save();
        ctx.globalAlpha = fadeOut;

        // A) Warm Wet-on-Wet Amber Watercolor Illumination Backdrop behind the golden text!
        if (goldSweepP > 0.02) {
          const washW = 390 * goldSweepP + preciousGlowP * 45;
          const wg = ctx.createRadialGradient(0, 42, 12, 0, 42, Math.max(30, washW));
          wg.addColorStop(0, `rgba(251, 191, 36, ${0.22 + preciousGlowP * 0.10})`);
          wg.addColorStop(0.55, 'rgba(217, 119, 6, 0.11)');
          wg.addColorStop(1, 'rgba(245, 158, 11, 0)');
          ctx.fillStyle = wg;
          ctx.beginPath();
          ctx.ellipse(E.lerp(-180, 0, goldSweepP), 42, Math.max(30, washW), 96, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // B) Progressive Left-to-Right Golden Calligraphy Reveal (`「好想法」才前所未有地昂贵`)
        if (goldSweepP > 0.01) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(-420, -25, brushX + 420, 145);
          ctx.clip();

          const jx = this._sketchJitter(t12, 55.2, 0.95);
          const jy = this._sketchJitter(t12, 71.8, 0.95);
          const scalePulse = 1 + preciousGlowP * 0.035;

          ctx.save();
          ctx.translate(jx, 38 + jy);
          ctx.scale(scalePulse, scalePulse);

          ctx.shadowColor = `rgba(245, 158, 11, ${0.55 + preciousGlowP * 0.35})`;
          ctx.shadowBlur = 18 + preciousGlowP * 14;
          ctx.font = '900 44px "PingFang SC", "STKaiti", "Kaiti SC", serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          const textGrad = ctx.createLinearGradient(-340, -22, 340, 24);
          textGrad.addColorStop(0, '#fef3c7');
          textGrad.addColorStop(0.35, '#fbbf24');
          textGrad.addColorStop(0.75, '#fde68a');
          textGrad.addColorStop(1, '#f59e0b');
          ctx.fillStyle = textGrad;
          ctx.fillText('「好想法」才前所未有地昂贵', 0, 0);
          ctx.restore();

          // 12fps Hand-sketched golden brush underline (`y = 78`)
          this._drawPencilBezier(
            ctx,
            -332, 78, -110, 74, 120, 82, 332, 77,
            t12, 1810.5, 3.4, '#fbbf24'
          );

          ctx.restore();
        }

        // C) Rising Warm Golden Bokeh Embers
        if (goldSweepP > 0.25) {
          const emberAlpha = E.smoothstep((goldSweepP - 0.25) / 0.75);
          this.goldEmbers.forEach((em) => {
            if (em.x > brushX) return;
            const ey = em.baseY - ((lt * em.vy + em.phase * 18) % 135);
            const ex = em.x + Math.sin(t * 2.1 + em.phase) * 7;
            ctx.fillStyle = `rgba(253, 224, 71, ${0.46 * emberAlpha})`;
            ctx.beginPath();
            ctx.arc(ex, ey, em.r, 0, Math.PI * 2);
            ctx.fill();
          });
        }

        // D) Glowing Golden Spark Tip (`(-360, 42)` at `lt = 0.00s` -> sweeps across to `(+368, 42)`)
        if (goldSweepP < 0.98) {
          const tipHalo = ctx.createRadialGradient(brushX, brushY, 1, brushX, brushY, 24);
          tipHalo.addColorStop(0, 'rgba(255, 251, 235, 0.98)');
          tipHalo.addColorStop(0.45, 'rgba(251, 191, 36, 0.65)');
          tipHalo.addColorStop(1, 'rgba(245, 158, 11, 0)');
          ctx.fillStyle = tipHalo;
          ctx.beginPath();
          ctx.arc(brushX, brushY, 24, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    // One-Take Morph (`lt = 6.02s -> 7.20s`): Golden Underline -> 3D Celestial Heading Beam + S12 Astrolabe Helm!
    _renderHelmHorizonEmergence(ctx, t, t12, transP) {
      ctx.save();

      // 1) Golden Underline folds into a 3D Celestial Navigation Heading Beam pointing to `(0, -90)`!
      const leftX = E.lerp(-332, -16, transP);
      const rightX = E.lerp(332, 16, transP);
      const nearY = E.lerp(78, 36, transP);
      const farY = E.lerp(78, -210, transP);

      const beamG = ctx.createLinearGradient(0, nearY, 0, farY);
      beamG.addColorStop(0, `rgba(251, 191, 36, ${0.85 * transP})`);
      beamG.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = beamG;
      ctx.beginPath();
      ctx.moveTo(leftX, nearY);
      ctx.lineTo(-2, farY);
      ctx.lineTo(2, farY);
      ctx.lineTo(rightX, nearY);
      ctx.closePath();
      ctx.fill();

      // 2) Concentric Navigator's Astrolabe Helm Rings materializing at `(0, 48)` (Exact 0.00px lock with S12 start!)
      const helmScale = E.spring(transP, 13, 0.74);
      const hx = 0;
      const hy = 48;

      ctx.save();
      ctx.translate(hx, hy);
      ctx.scale(helmScale, helmScale);
      ctx.globalAlpha = transP;

      // Outer Cyan Compute Ring (`r = 186`)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.52)';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.arc(0, 0, 186, 0, Math.PI * 2);
      ctx.stroke();

      // Inner 12fps Hand-Sketched Golden Helm Rim (`r = 132`)
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.arc(0, 0, 132, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
      ctx.restore();
    }

    _renderForeground(t, lt, preciousGlowP, ctx, width, height) {
      const vig = ctx.createRadialGradient(
        width * 0.5, height * 0.5, width * 0.40,
        width * 0.5, height * 0.5, width * 0.85
      );
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(4, 6, 12, 0.50)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, width, height);

      // Voiceover Subtitles (Synced to Yunxi `s11` starting at `80.78s / lt = 0.18s`, zero trailing commas!)
      const subY = height - Math.max(36, height * 0.072);
      const subFont = Math.max(15, Math.round(width * 0.0175));
      ctx.save();
      ctx.font = `600 ${subFont}px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let subText = '';
      let subAlpha = 0;

      if (lt >= 0.18 && lt < 1.92) {
        subText = '当「做出来」越来越廉价';
        subAlpha = E.smoothstep(E.invLerp(0.18, 0.40, lt)) * (1 - E.smoothstep(E.invLerp(1.70, 1.92, lt)));
      } else if (lt >= 1.98 && lt < 3.62) {
        subText = '一个真正的「好想法」';
        subAlpha = E.smoothstep(E.invLerp(1.98, 2.20, lt)) * (1 - E.smoothstep(E.invLerp(3.40, 3.62, lt)));
      } else if (lt >= 3.68 && lt < 6.45) {
        subText = '才变得前所未有地昂贵。';
        subAlpha = E.smoothstep(E.invLerp(3.68, 3.90, lt)) * (1 - E.smoothstep(E.invLerp(6.10, 6.45, lt)));
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
        ctx.fillStyle = lt >= 1.98 ? '#fef08a' : 'rgba(248, 250, 252, 0.98)';
        ctx.fillText(subText, width / 2, subY + 1);
      }
      ctx.restore();
    }
  }

  window.ShotS11Thesis = ShotS11Thesis;
})();
