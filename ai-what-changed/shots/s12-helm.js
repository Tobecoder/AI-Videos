/**
 * SHOT S12 (87.80s - 96.80s): 第六幕 · 人机归位（3D 蓝色算力推进引擎 + 12fps 手绘鎏金星盘船舵「握住方向盘的人，是你」）
 *
 * Zero-Seam One-Take Continuity & Ultimate Style A + B + C Synthesis:
 *   [87.80s / lt=0.00s] Exact 0.00px lock with S11's `#070b16` cosmos, Golden Celestial Heading Beam, and
 *                       concentric Navigator's Astrolabe Helm rings at `(0, 48)`!
 *   [87.95s - 91.30s]   Yunxi: “别把工具的全能，误当成自己的全能。”
 *                       Outer 60fps cyan AI telemetry dials spin rapidly (`TOOL CAPABILITY: 100%`), while the
 *                       inner compass needle drifts unanchored (`±32°`) — capability without direction is aimless.
 *   [91.40s - 93.65s]   Yunxi: “AI 是最强的引擎”
 *                       420 Style-C 3D electric-cyan & sapphire compute warp streaks ignite radially from `(0, -90)`
 *                       streaming backward past the camera as majestic deep-space propulsion exhaust!
 *   [93.70s - 95.95s]   Yunxi: “但握住方向盘的人，是你。”
 *                       12fps warm hand-sketched golden spokes, 8 helm handles & amber watercolor aura wrap the
 *                       Navigator's Helm, decisively turning & spring-locking the 4-pointed Golden Compass Rose onto
 *                       `000° · HUMAN HEADING`, firing a radiant Golden Starway into the cosmos!
 *   [95.95s - 96.80s]   One-Take Cosmic Convergence -> S13:
 *                       The entire starfield & golden astrolabe helm converge smoothly inward to `(0, -24)` on
 *                       `#060911` — igniting S13's quiet 12fps breathing Soul Flame at 0.00px continuity!
 */
(function () {
  const E = window.MGEasing;

  class ShotS12Helm {
    constructor(stage3D) {
      this.stage = stage3D;
      this.startTime = 87.80;
      this.endTime = 96.80;
      this.duration = this.endTime - this.startTime; // 9.00s

      // 420 Radial 3D Compute Thruster Star-Streaks (AI = Deep-Space Engine Exhaust!)
      this.warpStars = [];
      for (let i = 0; i < 420; i++) {
        const s1 = Math.sin(i * 19.73 + 0.8) * 43758.54;
        const r1 = s1 - Math.floor(s1);
        const s2 = Math.sin(i * 83.29 + 3.4) * 29831.17;
        const r2 = s2 - Math.floor(s2);
        this.warpStars.push({
          ang: r1 * Math.PI * 2,
          zPhase: r2,
          speed: 0.42 + (i % 5) * 0.14,
          isBrightCyan: i % 3 === 0,
          thick: 1.1 + (i % 3) * 0.65
        });
      }
    }

    _sketchJitter(t12, seed, amp = 1.6) {
      const h = Math.sin(t12 * 37.0 + seed * 17.31) * 43758.5453;
      return ((h - Math.floor(h)) - 0.5) * 2 * amp;
    }

    _drawPencilBezier(ctx, x0, y0, cx1, cy1, cx2, cy2, x1, y1, t12, seed, width = 2.8, col = '#fbbf24') {
      for (let pass = 0; pass < 2; pass++) {
        const j = pass === 0 ? 0.85 : 1.5;
        const s = seed + pass * 13.9;
        ctx.save();
        ctx.strokeStyle = col;
        ctx.globalAlpha *= (pass === 0 ? 0.92 : 0.40);
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
      const lt = Math.max(0, t - this.startTime); // 0.00 -> 9.00s
      const convergeP = E.cinematicInOut(E.clamp((lt - 8.05) / 0.95)); // One-Take Convergence -> S13!
      this._updateStage3D(t, lt, convergeP);

      vecCtx.clearRect(0, 0, width, height);
      fgCtx.clearRect(0, 0, width, height);

      const baseW = 1280;
      const baseH = 720;
      const scaleFit = Math.min(width / baseW, height / baseH);
      const t12 = Math.floor(t * 12) / 12;

      // Sub-beat Choreography Curves (Synced to Yunxi `s12` starting at `87.95s / lt = 0.15s`):
      // 1) Engine Thruster Ramp (`lt = 3.35s -> 4.65s` on “AI 是最强的引擎”)
      const engineThrustP = E.snappyOut(E.clamp((lt - 3.30) / 1.35));
      // 2) Human Helm Lock (`lt = 5.75s -> 6.85s` on “但握住方向盘的人，是你”)
      const helmLockP = E.spring(E.clamp((lt - 5.75) / 1.15), 13, 0.72);
      const captainGlowP = E.smoothstep(E.clamp((lt - 5.80) / 0.85));

      // Deep Space Backdrop (`#070b16` -> `#060911` exact S13/S01 obsidian lock!)
      vecCtx.fillStyle = convergeP > 0.4 ? '#060911' : '#070b16';
      vecCtx.fillRect(0, 0, width, height);

      vecCtx.save();
      vecCtx.translate(width / 2, height / 2);
      // Over-the-shoulder wide pull-out (`1.00 -> 0.92`) during engine roar, then smooth center settle
      const camZoom = E.lerp(1.0, 0.93, engineThrustP * (1 - convergeP));
      vecCtx.scale(scaleFit * camZoom, scaleFit * camZoom);

      // Vanishing horizon shifts gently to `(0, -24)` during `convergeP`
      const horizonY = E.lerp(-210, -24, convergeP);
      const helmY = E.lerp(48, -24, convergeP);

      // 1) 3D ELECTRIC-CYAN & SAPPHIRE COMPUTE ENGINE WARP EXHAUST ("AI 是最强的引擎")
      const warpVis = (0.18 + 0.82 * engineThrustP) * (1 - convergeP * 0.94);
      if (warpVis > 0.01) {
        this._renderComputeEngineExhaust(vecCtx, t, lt, warpVis, engineThrustP, horizonY);
      }

      // 2) GOLDEN CELESTIAL STARWAY HEADING BEAM (`0.00px` lock from S11!)
      if (convergeP < 0.98) {
        this._renderGoldenStarwayBeam(vecCtx, lt, helmLockP, captainGlowP, convergeP, helmY, horizonY);
      }

      // 3) FOREGROUND 3D COMPUTE + 12FPS HAND-SKETCHED GOLDEN NAVIGATOR'S ASTROLABE HELM!
      this._renderNavigatorAstrolabeHelm(
        vecCtx, t, lt, t12, engineThrustP, helmLockP, captainGlowP, convergeP, helmY
      );

      vecCtx.restore();

      // Cinema Vignette & Voiceover Subtitles
      this._renderForeground(t, lt, captainGlowP, fgCtx, width, height);
    }

    _updateStage3D(t, lt, convergeP) {
      this.stage.gridMat.opacity = E.lerp(0.15, 0.11, convergeP);
      this.stage.pMat.opacity = E.lerp(0.42, 0.30, convergeP);
      this.stage.camera.position.set(0, 0, E.lerp(9.6, 14.2, convergeP));
      this.stage.camera.lookAt(0, 0, 0);
      this.stage.renderer.render(this.stage.scene, this.stage.camera);
    }

    _renderComputeEngineExhaust(ctx, t, lt, warpVis, engineThrustP, horizonY) {
      ctx.save();
      const speedMult = 0.35 + engineThrustP * 1.45;

      // Deep cyan engine core glow at horizon
      const coreG = ctx.createRadialGradient(0, horizonY + 80, 10, 0, horizonY + 80, 420);
      coreG.addColorStop(0, `rgba(14, 165, 233, ${0.22 * warpVis})`);
      coreG.addColorStop(0.55, `rgba(30, 58, 138, ${0.12 * warpVis})`);
      coreG.addColorStop(1, 'rgba(7, 11, 22, 0)');
      ctx.fillStyle = coreG;
      ctx.fillRect(-720, -400, 1440, 800);

      // 420 Radial 3D Compute Star-Streaks flying backward past the helm!
      this.warpStars.forEach((st) => {
        const u = (st.zPhase + lt * st.speed * speedMult * 0.48) % 1.0;
        // Exponential perspective projection (`r = 24 -> 860`)
        const rHead = 24 + Math.pow(u, 2.4) * 840;
        const streakLen = (14 + Math.pow(u, 2.1) * (42 + engineThrustP * 135));
        const rTail = Math.max(18, rHead - streakLen);

        const ca = Math.cos(st.ang);
        const sa = Math.sin(st.ang);
        const cyOrigin = horizonY + 110;

        const x0 = ca * rTail;
        const y0 = cyOrigin + sa * rTail * 0.68;
        const x1 = ca * rHead;
        const y1 = cyOrigin + sa * rHead * 0.68;

        const alpha = Math.sin(u * Math.PI) * warpVis * (st.isBrightCyan ? 0.85 : 0.48);
        if (alpha <= 0.01) return;

        ctx.strokeStyle = st.isBrightCyan
          ? `rgba(0, 245, 255, ${alpha})`
          : `rgba(96, 165, 250, ${alpha})`;
        ctx.lineWidth = st.thick * (0.6 + u * 1.1);
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      });

      ctx.restore();
    }

    _renderGoldenStarwayBeam(ctx, lt, helmLockP, captainGlowP, convergeP, helmY, horizonY) {
      ctx.save();
      ctx.globalAlpha = 1 - convergeP;

      // Before `lt = 5.75s`, heading beam sways uncertainly; once human locks the helm, it snaps dead-center & blazes gold!
      const driftX = (1 - E.clamp((lt - 5.75) / 0.65)) * Math.sin(lt * 2.1) * 54;
      const beamHalfW = E.lerp(16, 46, captainGlowP);

      const beamG = ctx.createLinearGradient(0, helmY, driftX, horizonY);
      beamG.addColorStop(0, `rgba(251, 191, 36, ${0.55 + captainGlowP * 0.35})`);
      beamG.addColorStop(0.5, `rgba(245, 158, 11, ${0.24 + captainGlowP * 0.25})`);
      beamG.addColorStop(1, 'rgba(251, 191, 36, 0)');

      ctx.fillStyle = beamG;
      ctx.beginPath();
      ctx.moveTo(-beamHalfW, helmY - 12);
      ctx.lineTo(driftX - 3, horizonY);
      ctx.lineTo(driftX + 3, horizonY);
      ctx.lineTo(beamHalfW, helmY - 12);
      ctx.closePath();
      ctx.fill();

      // Crisp center golden laser heading line once locked!
      if (captainGlowP > 0.02) {
        ctx.strokeStyle = `rgba(254, 243, 199, ${0.85 * captainGlowP})`;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(0, helmY - 18);
        ctx.lineTo(driftX, horizonY);
        ctx.stroke();
      }

      ctx.restore();
    }

    _renderNavigatorAstrolabeHelm(ctx, t, lt, t12, engineThrustP, helmLockP, captainGlowP, convergeP, helmY) {
      ctx.save();
      ctx.translate(0, helmY);

      // Converge smoothly down to `0.00` as the center core becomes S13's 12fps Soul Flame at `(0, -24)`!
      const helmCollapseScale = E.lerp(1.0, 0.06, convergeP);
      const ringAlpha = 1 - E.smoothstep(E.clamp((convergeP - 0.15) / 0.75));

      if (ringAlpha > 0.01) {
        ctx.save();
        ctx.scale(helmCollapseScale, helmCollapseScale);
        ctx.globalAlpha = ringAlpha;

        // A) Warm Wet-on-Wet Amber Watercolor Aura blooming behind the Helm when Human takes command!
        if (captainGlowP > 0.01) {
          const auraR = 235 * captainGlowP;
          const wg = ctx.createRadialGradient(0, 0, 18, 0, 0, auraR);
          wg.addColorStop(0, 'rgba(251, 191, 36, 0.28)');
          wg.addColorStop(0.55, 'rgba(234, 88, 12, 0.12)');
          wg.addColorStop(1, 'rgba(245, 158, 11, 0)');
          ctx.fillStyle = wg;
          ctx.beginPath();
          ctx.arc(0, 0, auraR, 0, Math.PI * 2);
          ctx.fill();
        }

        // B) OUTER 60FPS CYAN AI ENGINE TELEMETRY RING (`r = 186`, 0.00px lock with S11 end!)
        ctx.save();
        ctx.rotate(t * (0.45 + engineThrustP * 1.35));
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.52 + engineThrustP * 0.28})`;
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.arc(0, 0, 186, 0, Math.PI * 2);
        ctx.stroke();

        // 36 Precision Degree Ticks on the AI Compute Ring
        for (let k = 0; k < 36; k++) {
          const a = (k / 36) * Math.PI * 2;
          const r0 = k % 3 === 0 ? 174 : 179;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * r0, Math.sin(a) * r0);
          ctx.lineTo(Math.cos(a) * 186, Math.sin(a) * 186);
          ctx.stroke();
        }
        ctx.restore();

        // Secondary Dashed Cyan Thruster Ring (`r = 212`)
        if (engineThrustP > 0.02) {
          ctx.save();
          ctx.rotate(-t * 0.85);
          ctx.strokeStyle = `rgba(0, 245, 255, ${0.34 * engineThrustP})`;
          ctx.setLineDash([14, 10]);
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(0, 0, 212, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        }

        // C) INNER 12FPS HAND-SKETCHED GOLDEN NAVIGATOR'S HELM (`r = 132`, 8 Helm Spokes & Handles!)
        // Drifts unmoored before `lt = 5.75s`, then turns & spring-locks to `0.00rad` TRUE NORTH!
        const unmooredAngle = Math.sin(lt * 1.9) * 0.46 - 0.32;
        const helmAngle = E.lerp(unmooredAngle, 0, E.clamp(helmLockP, 0, 1.15));

        ctx.save();
        ctx.rotate(helmAngle);

        // Main Golden Helm Rim (`r = 132`)
        ctx.strokeStyle = captainGlowP > 0.1 ? '#fbbf24' : 'rgba(251, 191, 36, 0.85)';
        ctx.lineWidth = 3.6;
        ctx.shadowColor = 'rgba(245, 158, 11, 0.55)';
        ctx.shadowBlur = 14 * captainGlowP;
        ctx.beginPath();
        ctx.arc(0, 0, 132, 0, Math.PI * 2);
        ctx.stroke();

        // Inner Brass Hub Ring (`r = 42`)
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(0, 0, 42, 0, Math.PI * 2);
        ctx.stroke();

        // 8 Hand-Sketched Golden Helm Spokes & Outer Peg Handles (`船舵握柄`)
        const spokeReveal = E.smoothstep(E.clamp(lt / 0.85));
        if (spokeReveal > 0.02) {
          ctx.save();
          ctx.globalAlpha *= spokeReveal;
          for (let s = 0; s < 8; s++) {
            const sa = (s / 8) * Math.PI * 2;
            const ca = Math.cos(sa);
            const sn = Math.sin(sa);
            const handleOut = 132 + 26 * (0.4 + 0.6 * captainGlowP);

            this._drawPencilBezier(
              ctx,
              ca * 42, sn * 42,
              ca * 82, sn * 82,
              ca * 112, sn * 112,
              ca * handleOut, sn * handleOut,
              t12, 2100 + s * 17, s === 0 ? 3.8 : 2.8,
              s === 0 && captainGlowP > 0.2 ? '#fffbeb' : '#fbbf24'
            );

            // Sculpted round peg tip on each helm handle
            ctx.fillStyle = s === 0 ? '#fef3c7' : '#f59e0b';
            ctx.beginPath();
            ctx.arc(ca * handleOut, sn * handleOut, s === 0 ? 6.2 : 4.5, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

        // Sculpted 4-Pointed Golden Compass Rose Needle (`手绘鎏金四芒星指针`)
        ctx.save();
        ctx.fillStyle = '#fef3c7';
        ctx.beginPath();
        ctx.moveTo(0, -108); // North pointer
        ctx.lineTo(14, -14);
        ctx.lineTo(0, 0);
        ctx.lineTo(-14, -14);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'rgba(217, 119, 6, 0.78)';
        ctx.beginPath();
        ctx.moveTo(0, 88);   // South counterweight
        ctx.lineTo(11, 12);
        ctx.lineTo(0, 0);
        ctx.lineTo(-11, 12);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        ctx.restore(); // end helmAngle rotation

        // D) Left & Right Architectural Role Callout Pills (`AI = 最强引擎` vs `你 = 领航掌舵`)
        if (engineThrustP > 0.15) {
          ctx.save();
          ctx.globalAlpha *= E.smoothstep((engineThrustP - 0.15) / 0.55) * (1 - convergeP);

          // Left Cyan Pill: AI ENGINE
          ctx.fillStyle = 'rgba(11, 20, 38, 0.86)';
          ctx.strokeStyle = 'rgba(0, 245, 255, 0.52)';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.roundRect(-492, -32, 218, 64, 12);
          ctx.fill();
          ctx.stroke();

          ctx.font = '700 11px "JetBrains Mono", monospace';
          ctx.fillStyle = '#38bdf8';
          ctx.textAlign = 'center';
          ctx.fillText('AI · COMPUTE THRUST', -383, -12);
          ctx.font = '800 17px "PingFang SC", sans-serif';
          ctx.fillStyle = '#e2e8f0';
          ctx.fillText('最强的推进引擎', -383, 14);
          ctx.restore();
        }

        if (captainGlowP > 0.10) {
          ctx.save();
          ctx.globalAlpha *= E.smoothstep((captainGlowP - 0.10) / 0.55) * (1 - convergeP);

          // Right Warm-Gold Pill: HUMAN CAPTAIN
          ctx.fillStyle = 'rgba(28, 20, 12, 0.88)';
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.72)';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.roundRect(274, -32, 218, 64, 12);
          ctx.fill();
          ctx.stroke();

          ctx.font = '700 11px "JetBrains Mono", monospace';
          ctx.fillStyle = '#fbbf24';
          ctx.textAlign = 'center';
          ctx.fillText('HUMAN · TRUE HEADING', 383, -12);
          ctx.font = '800 17px "PingFang SC", serif';
          ctx.fillStyle = '#fef3c7';
          ctx.fillText('握住方向盘的你', 383, 14);
          ctx.restore();
        }

        ctx.restore();
      }

      // E) CENTRAL EMBER CORE: Smoothly births S13's 12fps Soul Flame at `(0, -24)` as `convergeP -> 1.0`!
      const coreGlowR = E.lerp(22, 115, convergeP);
      const cg = ctx.createRadialGradient(0, 0, 2, 0, 0, coreGlowR);
      cg.addColorStop(0, 'rgba(255, 251, 235, 0.98)');
      cg.addColorStop(0.35, 'rgba(251, 191, 36, 0.55)');
      cg.addColorStop(0.75, `rgba(249, 115, 22, ${0.22 * convergeP})`);
      cg.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.arc(0, 0, coreGlowR, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    _renderForeground(t, lt, captainGlowP, ctx, width, height) {
      const vig = ctx.createRadialGradient(
        width * 0.5, height * 0.5, width * 0.40,
        width * 0.5, height * 0.5, width * 0.86
      );
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(4, 6, 12, 0.48)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, width, height);

      // Voiceover Subtitles (Synced to Yunxi `s12` starting at `87.95s / lt = 0.15s`, zero trailing commas!)
      const subY = height - Math.max(36, height * 0.072);
      const subFont = Math.max(15, Math.round(width * 0.0175));
      ctx.save();
      ctx.font = `600 ${subFont}px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let subText = '';
      let subAlpha = 0;

      if (lt >= 0.15 && lt < 3.45) {
        subText = '别把工具的全能，误当成自己的全能';
        subAlpha = E.smoothstep(E.invLerp(0.15, 0.38, lt)) * (1 - E.smoothstep(E.invLerp(3.22, 3.45, lt)));
      } else if (lt >= 3.52 && lt < 5.75) {
        subText = 'AI 是最强的引擎';
        subAlpha = E.smoothstep(E.invLerp(3.52, 3.74, lt)) * (1 - E.smoothstep(E.invLerp(5.52, 5.75, lt)));
      } else if (lt >= 5.82 && lt < 8.45) {
        subText = '但握住方向盘的人，是你。';
        subAlpha = E.smoothstep(E.invLerp(5.82, 6.04, lt)) * (1 - E.smoothstep(E.invLerp(8.12, 8.45, lt)));
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
        ctx.fillStyle = lt >= 5.82 ? '#fef08a' : 'rgba(248, 250, 252, 0.98)';
        ctx.fillText(subText, width / 2, subY + 1);
      }
      ctx.restore();
    }
  }

  window.ShotS12Helm = ShotS12Helm;
})();
