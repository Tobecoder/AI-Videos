/**
 * SHOT S04 (20.20s - 29.00s): 第二幕 · 改变了剪辑（逐帧抠像/打轴/对轨 -> AI 剃刀一眨眼磁吸卡点成片 -> 无边框穿入预览窗进入 S05）
 *
 * Zero-Seam One-Take Continuity:
 *   [20.20s / lt=0.00s] Exact 0.00px lock with S03's morphed NLE Video Studio (Media Bin + Program Monitor + Inspector + 4-Track Timeline).
 *   [20.28s - 24.40s]   Yunxi: “它改变了剪辑——曾经逐帧对齐的抠像、字幕与卡点”
 *                       Shows tedious manual polygon pen points on `抠像`, unaligned raw subtitle box on `字幕`, and off-beat clip gaps on `卡点`.
 *   [24.45s - 27.65s]   Yunxi: “现在一眨眼，凌乱素材就能自动成片。”
 *                       High-speed `✦ AI` Razor Playhead sweeps across all 4 tracks -> clips magnetically snap onto audio drum peaks,
 *                       Right Inspector snaps into a silky Bezier S-curve Speed Ramp, and Program Monitor blooms into a 4K Teal-Orange
 *                       graded master with glowing AI Rotoscope rim light, depth typography & kinetic captions!
 *   [27.65s - 29.00s]   Borderless One-Take Fly-Through INSIDE the Program Monitor horizon -> ready for S05 Warp Tunnel!
 */
(function () {
  const E = window.MGEasing;

  class ShotS04Editing {
    constructor(stage3D) {
      this.stage = stage3D;
      this.startTime = 20.20;
      this.endTime = 29.00;
      this.duration = this.endTime - this.startTime; // 8.80s

      // Beat grid X positions on Timeline (`A1 · 音乐` major drum peaks: i = 4, 14, 24, 34, 44, 54 => wx = -445 + i*16)
      // BeatXs: -381, -221, -61, +99, +259, +419
      this.beatXs = [-381, -221, -61, 99, 259, 419];

      // Clips start at exact S03 `dstX, dstY, dstW, dstH`, drift slightly messy in Beat A,
      // then magnetically snap (`snapX, snapW`) seamlessly onto exact beat intervals when Playhead crosses!
      this.timelineClips = [
        // Track V2 (`y = 92`, FX & Color)
        { s3X: -395, messyX: -412, snapX: -381, y: 92, s3W: 175, snapW: 158, h: 34, col: '#a855f7', label: 'FX · 光影粒子' },
        { s3X: -165, messyX: -188, snapX: -221, y: 92, s3W: 210, snapW: 158, h: 34, col: '#8b5cf6', label: 'FX · 曲线变速' },
        { s3X: 110,  messyX: 78,   snapX: -61,  y: 92, s3W: 195, snapW: 318, h: 34, col: '#ec4899', label: 'LUT · 电影青橙调色' },
        { s3X: 355,  messyX: 332,  snapX: 259,  y: 92, s3W: 185, snapW: 276, h: 34, col: '#6366f1', label: 'AI · 智能边缘抠像' },

        // Track V1 (`y = 142`, Main Camera Footage — zero gaps after magnetic snap!)
        { s3X: -420, messyX: -432, snapX: -435, y: 142, s3W: 245, snapW: 212, h: 38, col: '#0ea5e9', label: 'CAM_A01.raw' },
        { s3X: -140, messyX: -158, snapX: -221, y: 142, s3W: 230, snapW: 158, h: 38, col: '#0284c7', label: 'CAM_A02_wide.mov' },
        { s3X: 125,  messyX: 108,  snapX: -61,  y: 142, s3W: 225, snapW: 318, h: 38, col: '#06b6d4', label: 'B_ROLL_city.mp4' },
        { s3X: 378,  messyX: 368,  snapX: 259,  y: 142, s3W: 175, snapW: 276, h: 38, col: '#2563eb', label: 'MASTER_4K.mov' },

        // Track T1 (`y = 192`, AI Subtitles)
        { s3X: -405, messyX: -418, snapX: -381, y: 192, s3W: 190, snapW: 158, h: 28, col: '#f59e0b', label: '“自动识别语音字幕”' },
        { s3X: -175, messyX: -152, snapX: -221, y: 192, s3W: 240, snapW: 318, h: 28, col: '#d97706', label: '“毫秒级精准对齐鼓点”' },
        { s3X: 115,  messyX: 148,  snapX: 99,   y: 192, s3W: 255, snapW: 436, h: 28, col: '#eab308', label: '“一眨眼凌乱素材成片”' }
      ];
    }

    render(t, vecCtx, fgCtx, width, height) {
      const lt = Math.max(0, t - this.startTime); // 0.00 -> 8.80s
      this._updateStage3D(t, lt);

      vecCtx.clearRect(0, 0, width, height);
      fgCtx.clearRect(0, 0, width, height);

      const baseW = 1280;
      const baseH = 720;
      const scaleFit = Math.min(width / baseW, height / baseH);

      // Sub-beat curves synced to Yunxi `s04` word boundaries (`starts at lt = 0.08s`):
      // - Messy drift (`0.30s -> 1.60s`): highlights unaligned gaps & manual labor
      const messyP = E.smoothstep(E.clamp((lt - 0.30) / 1.20));
      // - AI Magic Sweep (`4.52s -> 6.85s`, triggered right on “现在一眨眼”!)
      const aiSweepP = E.cinematicInOut(E.clamp((lt - 4.52) / 2.25));
      // - Playhead X position: slow manual crawl (`-435 -> -335` during 0.5..4.4s), then high-speed AI sweep (`-335 -> +545`)!
      const manualCrawl = E.smoothstep(E.clamp((lt - 0.45) / 3.95)) * 100;
      const playheadX = lt < 4.52
        ? -435 + manualCrawl
        : E.lerp(-335, 545, aiSweepP);

      // - Borderless One-Take Fly-Through into Program Monitor (`lt = 7.45s -> 8.80s` -> S05!)
      const diveP = E.cinematicInOut(E.clamp((lt - 7.45) / 1.32));

      // Camera Rig:
      // At lt=0: camZoom=1.0, camX=0, camY=0 (exact lock with S03 end!)
      // Subtle tracking follow during AI sweep, then zooms straight into Program Monitor center `(0, -142)`!
      const sweepTrackX = (aiSweepP > 0.01 && aiSweepP < 0.99)
        ? Math.sin(aiSweepP * Math.PI) * 14 * (1 - diveP)
        : 0;
      const camX = sweepTrackX;
      const camY = E.lerp(0, -142, diveP);
      // Monitor interior is `w = 590 -> 640`, `h = 262 -> 360`; `camZoom = 2.02` + monitor expansion fills 1280x720 cleanly!
      const camZoom = E.lerp(1.0, 2.02, diveP);

      // Studio Backdrop (`#070913` matches S03 end at lt=0!)
      vecCtx.fillStyle = '#070913';
      vecCtx.fillRect(0, 0, width, height);

      vecCtx.save();
      vecCtx.translate(width / 2, height / 2);
      vecCtx.scale(scaleFit * camZoom, scaleFit * camZoom);
      vecCtx.translate(-camX, -camY);

      const surroundFade = 1 - E.smoothstep(E.clamp(diveP / 0.55));

      // 1) Subtle Studio Grid
      if (surroundFade > 0.01) {
        this._drawStudioGrid(vecCtx, surroundFade);
      }

      // 2) Left Media Bin & Right Speed/Color Inspector Panels
      if (surroundFade > 0.01) {
        this._renderFlankingPanels(vecCtx, t, lt, aiSweepP, diveP, surroundFade);
      }

      // 3) Bottom 4-Track NLE Timeline + Magnetic Beat Snap + AI Razor Playhead
      if (surroundFade > 0.01) {
        this._renderNLETimeline(vecCtx, t, lt, messyP, aiSweepP, playheadX, diveP, surroundFade);
      }

      // 4) Center Program Monitor (AI Rotoscoping + Teal-Orange Grade + Kinetic Captions -> Borderless Portal into S05!)
      this._renderProgramMonitor(vecCtx, t, lt, aiSweepP, diveP);

      // 5) Top Floating AI Status Pill (during AI Auto-Edit Sweep)
      if (surroundFade > 0.05) {
        this._renderTopEditPill(vecCtx, lt, aiSweepP, surroundFade);
      }

      vecCtx.restore();

      // Foreground Vignette & Pure Documentary Voiceover Subtitles
      this._renderForeground(t, lt, diveP, fgCtx, width, height);
    }

    _updateStage3D(t, lt) {
      const diveP = E.cinematicInOut(E.clamp((lt - 7.45) / 1.32));
      this.stage.camera.position.set(
        Math.sin(t * 0.5) * 0.35 * (1 - diveP),
        Math.cos(t * 0.4) * 0.25 * (1 - diveP),
        E.lerp(12.5, 6.2, diveP)
      );
      this.stage.camera.lookAt(0, 0, 0);
      this.stage.renderer.render(this.stage.scene, this.stage.camera);
    }

    _drawStudioGrid(ctx, alpha) {
      ctx.save();
      ctx.strokeStyle = `rgba(52, 211, 153, ${0.03 * alpha})`;
      ctx.lineWidth = 1;
      for (let gx = -760; gx <= 760; gx += 64) {
        ctx.beginPath(); ctx.moveTo(gx, -440); ctx.lineTo(gx, 440); ctx.stroke();
      }
      for (let gy = -440; gy <= 440; gy += 64) {
        ctx.beginPath(); ctx.moveTo(-760, gy); ctx.lineTo(760, gy); ctx.stroke();
      }
      ctx.restore();
    }

    // =========================================================================
    // FLANKING NLE PANELS (Media Bin on Left, Speed-Ramp & Color Wheels on Right)
    // =========================================================================
    _renderFlankingPanels(ctx, t, lt, aiSweepP, diveP, fade) {
      ctx.save();
      // Match S03's parent `(0, -142)` coordinate offset!
      ctx.translate(0, -142);
      ctx.globalAlpha = fade;

      const pushOut = diveP * 160;
      const pw = 268;
      const ph = 304;

      // ---------------------------------------------------------
      // LEFT PANEL: Media Bin (`🎞 素材库 · MEDIA BIN`)
      // ---------------------------------------------------------
      const lx = -590 - pushOut;
      const ly = -152;
      ctx.fillStyle = 'rgba(9, 15, 29, 0.92)';
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(lx, ly, pw, ph, 16);
      ctx.fill();
      ctx.stroke();

      ctx.font = '700 13px "PingFang SC", "Inter", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText('🎞  素材库 · MEDIA BIN', lx + 18, ly + 26);

      const thumbCols = ['#0284c7', '#7c3aed', '#0d9488', '#db2777', '#4f46e5', '#ea580c'];
      const thumbNames = ['A01_RAW', 'A02_WIDE', 'B01_CITY', 'B02_NEON', 'FX_GLOW', 'LUT_FILM'];
      thumbCols.forEach((tc, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const tx = lx + 18 + col * 120;
        const ty = ly + 48 + row * 78;
        const tagged = aiSweepP > 0.12 + i * 0.10;

        ctx.save();
        ctx.fillStyle = tc;
        ctx.globalAlpha = fade * (tagged ? 0.90 : 0.72);
        ctx.beginPath();
        ctx.roundRect(tx, ty, 110, 62, 8);
        ctx.fill();

        if (tagged) {
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 1.8;
          ctx.stroke();
        }

        ctx.font = '600 10px "JetBrains Mono", monospace';
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(tagged ? `✓ ${thumbNames[i]}` : thumbNames[i], tx + 8, ty + 52);
        ctx.restore();
      });

      // ---------------------------------------------------------
      // RIGHT PANEL: Speed-Ramp Bezier S-Curve & Color Wheels (`⚡ 变速与调色`)
      // ---------------------------------------------------------
      const rx = 322 + pushOut;
      const ry = -152;
      ctx.fillStyle = 'rgba(9, 15, 29, 0.92)';
      ctx.strokeStyle = aiSweepP > 0.3 ? 'rgba(56, 189, 248, 0.55)' : 'rgba(148, 163, 184, 0.28)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(rx, ry, pw, ph, 16);
      ctx.fill();
      ctx.stroke();

      ctx.font = '700 13px "PingFang SC", "Inter", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'left';
      ctx.fillText('⚡  变速与调色 · INSPECTOR', rx + 18, ry + 26);

      // Speed Curve Graph Box
      const gx = rx + 18, gy = ry + 52, gw = pw - 36, gh = 136;
      ctx.fillStyle = '#050811';
      ctx.beginPath();
      ctx.roundRect(gx, gy, gw, gh, 10);
      ctx.fill();

      // Subtle graph grid lines
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(gx, gy + gh * 0.5); ctx.lineTo(gx + gw, gy + gh * 0.5);
      ctx.moveTo(gx + gw * 0.5, gy); ctx.lineTo(gx + gw * 0.5, gy + gh);
      ctx.stroke();

      // Morph straight linear line -> Silky S-Curve Speed Ramp (`curveP`)!
      const curveP = E.spring(E.clamp((aiSweepP - 0.15) / 0.55), 14, 0.68);
      const xStart = rx + 34, yStart = ry + 168;
      const xEnd = rx + pw - 34, yEnd = ry + 72;
      const cp1x = E.lerp(E.lerp(xStart, xEnd, 0.33), xStart + 92, curveP);
      const cp1y = E.lerp(E.lerp(yStart, yEnd, 0.33), yStart - 2, curveP);
      const cp2x = E.lerp(E.lerp(xStart, xEnd, 0.66), xEnd - 92, curveP);
      const cp2y = E.lerp(E.lerp(yStart, yEnd, 0.66), yEnd + 2, curveP);

      // Glowing area fill under S-curve when AI activates
      if (curveP > 0.05) {
        const areaG = ctx.createLinearGradient(0, yEnd, 0, yStart);
        areaG.addColorStop(0, `rgba(0, 245, 255, ${0.28 * E.clamp(curveP)})`);
        areaG.addColorStop(1, 'rgba(0, 245, 255, 0)');
        ctx.fillStyle = areaG;
        ctx.beginPath();
        ctx.moveTo(xStart, yStart);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, xEnd, yEnd);
        ctx.lineTo(xEnd, gy + gh - 8);
        ctx.lineTo(xStart, gy + gh - 8);
        ctx.closePath();
        ctx.fill();
      }

      ctx.strokeStyle = curveP > 0.2 ? '#00f5ff' : 'rgba(56, 189, 248, 0.45)';
      ctx.lineWidth = curveP > 0.2 ? 2.8 : 2.0;
      ctx.beginPath();
      ctx.moveTo(xStart, yStart);
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, xEnd, yEnd);
      ctx.stroke();

      // Bezier tangent handles on S-curve
      if (curveP > 0.2) {
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(xStart, yStart, 4, 0, Math.PI * 2);
        ctx.arc(xEnd, yEnd, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '700 10.5px "JetBrains Mono", monospace';
        ctx.fillStyle = '#7dd3fc';
        ctx.fillText('AI SPEED RAMP · S-CURVE', gx + 12, gy + 18);
      }

      // Dual Cinema Color Grading Wheels below Speed Graph (`Shadows Teal` / `Highlights Amber`)
      const wheelAppear = E.snappyOut(E.clamp((lt - 0.35) / 0.5));
      if (wheelAppear > 0.02) {
        ctx.save();
        ctx.globalAlpha = fade * wheelAppear;
        const wy = ry + 244;
        const wheels = [
          { cx: rx + 82, col: '#00f5ff', label: 'SHADOWS', dx: -6 * curveP, dy: 5 * curveP },
          { cx: rx + 186, col: '#f97316', label: 'HIGHLIGHTS', dx: 7 * curveP, dy: -6 * curveP }
        ];
        wheels.forEach((w) => {
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(w.cx, wy, 28, 0, Math.PI * 2);
          ctx.stroke();

          const wg = ctx.createRadialGradient(w.cx + w.dx, wy + w.dy, 2, w.cx, wy, 28);
          wg.addColorStop(0, w.col);
          wg.addColorStop(1, 'rgba(15, 23, 42, 0.2)');
          ctx.fillStyle = wg;
          ctx.fill();

          // Crosshair puck inside color wheel
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(w.cx + w.dx, wy + w.dy, 3.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = '600 9.5px "Inter", sans-serif';
          ctx.fillStyle = '#94a3b8';
          ctx.textAlign = 'center';
          ctx.fillText(w.label, w.cx, wy + 42);
        });
        ctx.restore();
      }

      ctx.restore();
    }

    // =========================================================================
    // CENTER PROGRAM MONITOR (VFX Studio Supercar Roto -> 4K Sunset Master -> Borderless Portal to S05!)
    // =========================================================================
    _renderProgramMonitor(ctx, t, lt, aiSweepP, diveP) {
      // At diveP=0: center=(0, -142), w=590, h=304 (100% locked to S03 end!)
      // At diveP=1: expands to 644x364 so with `camZoom = 2.02` it fills 1280x720 borderlessly!
      const cx = 0;
      const cy = -142;
      const w = E.lerp(590, 644, diveP);
      const h = E.lerp(304, 364, diveP);
      const x0 = -w / 2;
      const y0 = -h / 2;
      const headerH = 42 * (1 - E.smoothstep(E.clamp(diveP / 0.42)));
      const shellBorderAlpha = 1 - E.smoothstep(E.clamp(diveP / 0.35));

      ctx.save();
      ctx.translate(cx, cy);

      // Hide outer window border & shadow completely during Portal Dive (`diveP > 0.35`)!
      if (shellBorderAlpha > 0.01) {
        ctx.shadowColor = `rgba(0, 0, 0, ${0.58 * shellBorderAlpha})`;
        ctx.shadowBlur = 36 * shellBorderAlpha;
        ctx.fillStyle = '#09101f';
        ctx.beginPath();
        ctx.roundRect(x0, y0, w, h, 20 * shellBorderAlpha);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = aiSweepP > 0.25
          ? `rgba(0, 245, 255, ${0.75 * shellBorderAlpha})`
          : `rgba(168, 85, 247, ${0.65 * shellBorderAlpha})`;
        ctx.lineWidth = 2.2;
        ctx.stroke();
      }

      ctx.save();
      if (shellBorderAlpha > 0.01) {
        ctx.beginPath();
        ctx.roundRect(x0, y0, w, h, 20 * shellBorderAlpha);
        ctx.clip();
      }

      // Video Viewport Coordinates (expands seamlessly to full `w x h` as `headerH -> 0`)
      const vx = x0;
      const vy = y0 + headerH;
      const vw = w;
      const vh = h - headerH;

      // Grade & AI Smart-Key progression (`0` = Raw VFX Green-Screen Cyclorama, `1` = 4K Teal-Orange Sunset Master!)
      const gradeP = E.snappyOut(E.clamp((aiSweepP - 0.12) / 0.45));
      const rawAlpha = E.clamp(1 - gradeP);

      // 1A) Base Raw Unedited VFX Green-Screen Studio Cyclorama (`gradeP = 0` matches S03 0.00px!)
      if (rawAlpha > 0.01) {
        const rawBg = ctx.createLinearGradient(vx, vy, vx, vy + vh);
        rawBg.addColorStop(0, '#132226');
        rawBg.addColorStop(0.65, '#192d32');
        rawBg.addColorStop(1, '#0d171c');
        ctx.fillStyle = rawBg;
        ctx.fillRect(vx, vy, vw, vh);

        // VFX Green-Screen Tracking Markers (`+`) on studio wall
        ctx.save();
        ctx.strokeStyle = `rgba(52, 211, 153, ${0.38 * rawAlpha})`;
        ctx.lineWidth = 1.5;
        const markers = [
          [-210, -68], [-95, -82], [95, -82], [210, -68],
          [-225, 8], [225, 8]
        ];
        const mcy = vy + vh * 0.5;
        markers.forEach(([mx, my]) => {
          ctx.beginPath();
          ctx.moveTo(mx - 6, mcy + my); ctx.lineTo(mx + 6, mcy + my);
          ctx.moveTo(mx, mcy + my - 6); ctx.lineTo(mx, mcy + my + 6);
          ctx.stroke();
        });

        // Studio floor horizon line & raw viewfinder safe-zone
        const floorY = vy + vh * 0.62 + 37;
        ctx.strokeStyle = `rgba(148, 163, 184, ${0.18 * rawAlpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(vx, floorY);
        ctx.lineTo(vx + vw, floorY);
        ctx.stroke();
        ctx.strokeRect(vx + 28, vy + 20, vw - 56, vh - 40);
        ctx.restore();
      }

      // 1B) AI Keyed & Graded 4K Cinema Teal-Orange Sunset Coastal Highway (`gradeP: 0 -> 1`)
      if (gradeP > 0.01) {
        ctx.save();
        ctx.globalAlpha = E.clamp(gradeP);

        const sky = ctx.createLinearGradient(vx, vy, vx, vy + vh);
        sky.addColorStop(0, '#06283d');    // Deep cinema teal upper sky
        sky.addColorStop(0.38, '#0c4a6e'); // Rich twilight azure
        sky.addColorStop(0.60, '#ea580c'); // Golden-amber sunset horizon band
        sky.addColorStop(0.74, '#1e1b2e'); // Coastal asphalt transition
        sky.addColorStop(1, '#070b14');    // Wet reflective highway surface
        ctx.fillStyle = sky;
        ctx.fillRect(vx, vy, vw, vh);

        // Glowing Sunset Solar Disc + Depth-Separated 3D Typography BEHIND the keyed Supercar!
        ctx.save();
        ctx.globalAlpha = E.clamp(gradeP) * (1 - diveP * 0.45);
        const sunY = vy + vh * 0.54;
        const sunG = ctx.createRadialGradient(0, sunY, 6, 0, sunY, 138);
        sunG.addColorStop(0, 'rgba(254, 240, 138, 0.94)');
        sunG.addColorStop(0.42, 'rgba(249, 115, 22, 0.48)');
        sunG.addColorStop(1, 'rgba(249, 115, 22, 0)');
        ctx.fillStyle = sunG;
        ctx.beginPath();
        ctx.arc(0, sunY, 138, 0, Math.PI * 2);
        ctx.fill();

        // Bold 3D Depth Title tucked behind the car's fastback roofline!
        ctx.font = '900 56px "Inter", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.90)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('VISION', 0, vy + vh * 0.36);
        ctx.restore();

        ctx.restore();
      }

      // Perspective Highway Speed-Grid Lines (accelerates smoothly into S05 Warp Corridor during `diveP`!)
      if (gradeP > 0.15 || diveP > 0.01) {
        ctx.save();
        const gridAlpha = Math.max(E.clamp(gradeP) * 0.36, diveP * 0.74);
        const horizonY = vy + vh * E.lerp(0.68, 0.50, diveP);
        ctx.strokeStyle = `rgba(0, 245, 255, ${gridAlpha})`;
        ctx.lineWidth = 1.4;
        for (let i = -6; i <= 6; i++) {
          ctx.beginPath();
          ctx.moveTo(i * 18, horizonY);
          ctx.lineTo(i * 118, vy + vh);
          ctx.stroke();
        }
        const roadScroll = (t * (2.6 + gradeP * 3.8 + diveP * 5.0)) % 1;
        for (let r = 0; r < 5; r++) {
          const ry = horizonY + Math.pow(((r + roadScroll) / 5), 1.85) * (vy + vh - horizonY);
          ctx.beginPath();
          ctx.moveTo(vx, ry);
          ctx.lineTo(vx + vw, ry);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 2) Sleek 4:1 Aerodynamic Supercar Subject:
      //    - `lt = 0`: 0.00px lock with S03's raw ungraded coupe (`wheelAngle = t * 5.0`)
      //    - `lt = 2.15s -> 4.50s`: Manual yellow Bezier pen-tool points click along fastback roofline (`抠像`)
      //    - `lt >= 4.52s`: AI Smart-Key cyan rim aura + liquid metallic sunset reflections + neon speed trails
      //    - `diveP > 0`: Supercar rockets forward cleanly out of frame as camera dives into S05 horizon!
      const carFade = 1 - E.smoothstep(E.clamp((diveP - 0.52) / 0.38));
      if (carFade > 0.01) {
        ctx.save();
        ctx.globalAlpha = carFade;

        const carLaunchX = Math.pow(diveP, 1.75) * 480;
        const carY = vy + vh * 0.62 + diveP * 14;
        const wheelAngle = t * 5.0 + Math.max(0, lt - 4.52) * 14.0 * aiSweepP;
        const aiRimGlow = aiSweepP > 0.05
          ? Math.sin(E.clamp((aiSweepP - 0.05) / 0.72) * Math.PI) * 0.90 + E.clamp(gradeP) * 0.32
          : 0;

        this._drawStudioSupercar(ctx, carLaunchX, carY, wheelAngle, E.clamp(gradeP), aiRimGlow);

        // Manual Tedious Bezier Pen-Tool Polygon Points along Supercar Roofline (`lt = 2.15s -> 4.50s`, on “逐帧对齐的抠像”!)
        if (lt >= 2.15 && gradeP < 0.35) {
          const manualAlpha = E.snappyOut(E.clamp((lt - 2.15) / 0.35)) * (1 - gradeP / 0.35);
          ctx.save();
          ctx.translate(carLaunchX, carY);
          ctx.globalAlpha = carFade * manualAlpha;
          const pts = [
            [-132, -6], [-98, -24], [-54, -44], [-6, -48], [40, -39], [96, -20], [133, 6]
          ];
          const count = Math.min(pts.length, Math.max(2, Math.floor((lt - 2.05) * 4.8)));
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 1.6;
          ctx.setLineDash([4, 3]);
          ctx.beginPath();
          for (let i = 0; i < count; i++) {
            if (i === 0) ctx.moveTo(pts[i][0], pts[i][1]);
            else ctx.lineTo(pts[i][0], pts[i][1]);
          }
          ctx.stroke();
          ctx.setLineDash([]);

          for (let i = 0; i < count; i++) {
            // Subtle Bezier tangent ears on roof anchor points
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.55)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pts[i][0] - 12, pts[i][1] + 2);
            ctx.lineTo(pts[i][0] + 12, pts[i][1] - 2);
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 1.4;
            ctx.fillRect(pts[i][0] - 3.5, pts[i][1] - 3.5, 7, 7);
            ctx.strokeRect(pts[i][0] - 3.5, pts[i][1] - 3.5, 7, 7);
          }
          ctx.restore();
        }

        ctx.restore();
      }

      // 3) Video Overlay Badges & Broadcast Auto-Captions inside Monitor
      if (diveP < 0.35) {
        const uiFade = 1 - diveP / 0.35;
        ctx.save();
        ctx.globalAlpha = uiFade;

        // Top-Left Badge: `RAW · LOG-C` -> `✦ 4K HDR · AI MASTER`
        ctx.font = '700 11px "JetBrains Mono", monospace';
        const tagTxt = gradeP > 0.5 ? '✦ 4K HDR · AI MASTER' : 'RAW · LOG-C';
        const tw = Math.ceil(ctx.measureText(tagTxt).width) + 22;
        ctx.fillStyle = gradeP > 0.5 ? 'rgba(6, 78, 59, 0.88)' : 'rgba(15, 23, 42, 0.78)';
        ctx.beginPath();
        ctx.roundRect(vx + 38, vy + 24, tw, 24, 6);
        ctx.fill();
        ctx.fillStyle = gradeP > 0.5 ? '#6ee7b7' : '#cbd5e1';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tagTxt, vx + 38 + tw / 2, vy + 36);

        // In-Monitor Subtitle Overlay (`lt >= 2.95s` unaligned draft -> `gradeP > 0.4` crisp commercial film caption!)
        if (lt >= 2.95) {
          const capAlpha = E.snappyOut(E.clamp((lt - 2.95) / 0.30));
          ctx.globalAlpha = uiFade * capAlpha;
          ctx.font = gradeP > 0.4
            ? '700 14.5px "PingFang SC", "Inter", sans-serif'
            : '500 12.5px "JetBrains Mono", "PingFang SC", sans-serif';
          const capTxt = gradeP > 0.4 ? '破界疾驰 · UNLEASH VISION' : '⏱ 00:02:14  待手动打轴对齐语音...';
          const cw = Math.ceil(ctx.measureText(capTxt).width) + 28;
          const cyCap = vy + vh - 28;

          ctx.fillStyle = gradeP > 0.4 ? 'rgba(9, 14, 28, 0.84)' : 'rgba(30, 41, 59, 0.74)';
          ctx.beginPath();
          ctx.roundRect(-cw / 2, cyCap - 14, cw, 28, 14);
          ctx.fill();

          ctx.fillStyle = gradeP > 0.4 ? '#fde047' : '#94a3b8';
          ctx.fillText(capTxt, 0, cyCap);
        }

        ctx.restore();
      }

      // 4) Top Program Monitor Header Bar (matches S03 end at lt=0, dissolves cleanly on diveP!)
      if (headerH > 2) {
        ctx.save();
        ctx.globalAlpha = shellBorderAlpha;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x0, y0, w, headerH);

        ctx.font = '700 13px "JetBrains Mono", "Inter", monospace';
        ctx.fillStyle = '#e2e8f0';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('▶  PROGRAM MONITOR  ·  4K 60FPS', x0 + 20, y0 + headerH * 0.5);

        const frames = Math.floor((lt * 60) % 60);
        const secs = Math.floor(lt);
        const tc = `TC  00:00:0${secs}:${String(frames).padStart(2, '0')}`;
        ctx.fillStyle = aiSweepP > 0.2 ? '#34d399' : '#38bdf8';
        ctx.textAlign = 'right';
        ctx.fillText(tc, x0 + w - 20, y0 + headerH * 0.5);
        ctx.restore();
      }

      ctx.restore(); // end clip
      ctx.restore();
    }

    // Precision 4:1 Side-Profile Aerodynamic Supercar (0.00px lock with S03 at `gradeP = 0` -> 4K Sunset Reflections & Neon Trails at `gradeP = 1`!)
    _drawStudioSupercar(ctx, cx, cy, wheelAngle, gradeP, aiRimGlow) {
      ctx.save();
      ctx.translate(cx, cy);

      // 1) High-Speed Neon Taillight Streaks & Forward Headlight Beam (when AI Graded!)
      if (gradeP > 0.05) {
        ctx.save();
        ctx.globalAlpha *= gradeP;

        // Crimson-amber motion light trails behind rear spoiler/taillight
        const trailG = ctx.createLinearGradient(-290, 0, -118, 0);
        trailG.addColorStop(0, 'rgba(244, 63, 94, 0)');
        trailG.addColorStop(0.55, 'rgba(251, 113, 133, 0.38)');
        trailG.addColorStop(1, 'rgba(253, 224, 71, 0.92)');
        ctx.fillStyle = trailG;
        ctx.fillRect(-290, -14, 172, 4.5);

        const lowerTrailG = ctx.createLinearGradient(-240, 0, -122, 0);
        lowerTrailG.addColorStop(0, 'rgba(0, 245, 255, 0)');
        lowerTrailG.addColorStop(1, 'rgba(0, 245, 255, 0.52)');
        ctx.fillStyle = lowerTrailG;
        ctx.fillRect(-240, 12, 118, 2.5);

        // Volumetric xenon/cyan headlight cone cutting forward
        const beamG = ctx.createLinearGradient(124, -6, 285, 8);
        beamG.addColorStop(0, 'rgba(186, 230, 253, 0.68)');
        beamG.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = beamG;
        ctx.beginPath();
        ctx.moveTo(124, -8);
        ctx.lineTo(285, -24);
        ctx.lineTo(285, 22);
        ctx.lineTo(128, 2);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      // 2) Contact Shadow + Sunset Road Reflection under Chassis
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.beginPath();
      ctx.ellipse(0, 35, 134, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      if (gradeP > 0.1) {
        ctx.save();
        ctx.globalAlpha *= gradeP * 0.45;
        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.ellipse(0, 37, 116, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Helper path for sculpted 4:1 low-slung chassis
      const traceChassis = () => {
        ctx.beginPath();
        ctx.moveTo(-128, 14);
        ctx.lineTo(-132, -6);
        ctx.quadraticCurveTo(-126, -22, -98, -24);
        ctx.bezierCurveTo(-72, -30, -48, -48, -6, -48);
        ctx.bezierCurveTo(32, -48, 66, -25, 96, -20);
        ctx.bezierCurveTo(118, -17, 133, -8, 134, 10);
        ctx.lineTo(126, 16);
        ctx.lineTo(-124, 16);
        ctx.closePath();
      };

      // 3) AI Smart-Key Rotoscope Cyan Rim Glow (`抠像` edge detection highlight!)
      if (aiRimGlow > 0.02) {
        ctx.save();
        ctx.shadowColor = '#00f5ff';
        ctx.shadowBlur = 18 * E.clamp(aiRimGlow);
        ctx.strokeStyle = `rgba(0, 245, 255, ${E.clamp(aiRimGlow)})`;
        ctx.lineWidth = 3.2;
        traceChassis();
        ctx.stroke();
        ctx.restore();
      }

      // 4) Raw LOG-C Matte Slate Body (`gradeP = 0`, 100% identical to S03)
      const rawBodyG = ctx.createLinearGradient(-132, -48, 134, 20);
      rawBodyG.addColorStop(0, '#334155');
      rawBodyG.addColorStop(0.48, '#64748b');
      rawBodyG.addColorStop(1, '#1e293b');
      ctx.fillStyle = rawBodyG;
      traceChassis();
      ctx.fill();

      // Graded Liquid-Titanium & Sunset Horizon Metallic Paint Overlay (`gradeP: 0 -> 1`)
      if (gradeP > 0.01) {
        ctx.save();
        ctx.globalAlpha *= gradeP;
        const gradedBodyG = ctx.createLinearGradient(0, -48, 0, 18);
        gradedBodyG.addColorStop(0, '#e2e8f0');    // Crisp sky-lit silver roof crest
        gradedBodyG.addColorStop(0.36, '#38bdf8'); // Cinema teal sky reflection
        gradedBodyG.addColorStop(0.62, '#0f172a'); // Deep horizon beltline contrast
        gradedBodyG.addColorStop(0.88, '#f97316'); // Warm sunset reflection on lower rocker
        gradedBodyG.addColorStop(1, '#1e293b');
        ctx.fillStyle = gradedBodyG;
        traceChassis();
        ctx.fill();
        ctx.restore();
      }

      // 5) Tinted Teardrop Cockpit Glass Canopy
      const glassG = ctx.createLinearGradient(-60, -46, 68, -20);
      glassG.addColorStop(0, '#090f1d');
      glassG.addColorStop(0.6, gradeP > 0.3 ? '#0c4a6e' : '#1e293b');
      glassG.addColorStop(1, '#0f172a');
      ctx.fillStyle = glassG;
      ctx.beginPath();
      ctx.moveTo(-66, -23);
      ctx.bezierCurveTo(-44, -43, -8, -44, 24, -42);
      ctx.bezierCurveTo(46, -40, 64, -26, 74, -21);
      ctx.lineTo(-58, -21);
      ctx.closePath();
      ctx.fill();

      // Side Aero Intake Blade & Specular Shoulder Line
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(-30, -16);
      ctx.lineTo(-10, -16);
      ctx.lineTo(-22, 10);
      ctx.lineTo(-36, 10);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = gradeP > 0.3
        ? 'rgba(254, 240, 138, 0.85)'
        : 'rgba(226, 232, 240, 0.55)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(-118, -14);
      ctx.bezierCurveTo(-40, -18, 45, -16, 122, -6);
      ctx.stroke();

      // LED Headlight & Taillight Blades
      ctx.strokeStyle = gradeP > 0.3 ? '#e0f2fe' : '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(108, -11); ctx.lineTo(130, -5); ctx.stroke();
      ctx.strokeStyle = gradeP > 0.3 ? '#fda4af' : '#fb7185';
      ctx.beginPath(); ctx.moveTo(-131, -11); ctx.lineTo(-112, -11); ctx.stroke();

      // 6) Recessed Wheel Wells + Spinning 6-Spoke Alloy Wheels & Crimson Brake Calipers
      [-78, 80].forEach((wx) => {
        const wy = 14;
        ctx.fillStyle = '#050811';
        ctx.beginPath(); ctx.arc(wx, wy, 25, 0, Math.PI * 2); ctx.fill();

        // Tire
        ctx.fillStyle = '#111827';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(wx, wy, 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Alloy Rim + Spokes
        ctx.strokeStyle = gradeP > 0.3 ? '#f1f5f9' : '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(wx, wy, 14.5, 0, Math.PI * 2); ctx.stroke();
        for (let s = 0; s < 6; s++) {
          const a = wheelAngle + (s * Math.PI) / 3;
          ctx.beginPath();
          ctx.moveTo(wx, wy);
          ctx.lineTo(wx + Math.cos(a) * 14, wy + Math.sin(a) * 14);
          ctx.stroke();
        }
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath(); ctx.arc(wx, wy, 3.5, 0, Math.PI * 2); ctx.fill();
      });

      ctx.restore();
    }

    // =========================================================================
    // BOTTOM 4-TRACK NLE TIMELINE (Messy Gaps -> AI Razor Magnetic Beat-Snap!)
    // =========================================================================
    _renderNLETimeline(ctx, t, lt, messyP, aiSweepP, playheadX, diveP, fade) {
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.translate(0, diveP * 190);

      // Dock Shell (`x = -590..590`, `y = 32..322` — exact match with S03 end!)
      ctx.fillStyle = '#080d19';
      ctx.strokeStyle = aiSweepP > 0.05 && aiSweepP < 0.98
        ? 'rgba(0, 245, 255, 0.58)'
        : 'rgba(148, 163, 184, 0.32)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(-590, 32, 1180, 290, 18);
      ctx.fill();
      ctx.stroke();

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(-590, 32, 1180, 290, 18);
      ctx.clip();

      // Top Timecode Ruler (`y = 32..66`)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-590, 32, 1180, 34);

      ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
      ctx.lineWidth = 1;
      for (let tx = -450; tx <= 560; tx += 40) {
        const major = ((tx + 450) % 160) === 0;
        ctx.beginPath();
        ctx.moveTo(tx, 66);
        ctx.lineTo(tx, major ? 50 : 58);
        ctx.stroke();
      }

      // 4 Track Lanes (`V2`, `V1`, `T1`, `A1`)
      const trackLabels = [
        { tag: 'V2 · 特效', y: 92, col: '#c084fc' },
        { tag: 'V1 · 画面', y: 142, col: '#38bdf8' },
        { tag: 'T1 · 字幕', y: 192, col: '#fbbf24' },
        { tag: 'A1 · 音乐', y: 254, col: '#34d399' }
      ];
      ctx.font = '700 13px "JetBrains Mono", "PingFang SC", sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      trackLabels.forEach((tr) => {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.58)';
        ctx.fillRect(-588, tr.y - 20, 1176, 40);
        ctx.fillStyle = tr.col;
        ctx.fillText(tr.tag, -572, tr.y);
      });

      // Vertical Beat Alignment Guides (`lt >= 3.35s`, right on Yunxi saying “与卡点”!)
      if (lt >= 3.35) {
        const beatGuideAlpha = E.smoothstep(E.clamp((lt - 3.35) / 0.35)) * 0.38;
        ctx.save();
        ctx.strokeStyle = `rgba(0, 245, 255, ${beatGuideAlpha})`;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 4]);
        this.beatXs.forEach((bx) => {
          ctx.beginPath();
          ctx.moveTo(bx, 66);
          ctx.lineTo(bx, 276);
          ctx.stroke();
        });
        ctx.setLineDash([]);
        ctx.restore();
      }

      // Track A1 Audio Beat Waveform Spectrum (`y = 254` — exact match with S03 at lt=0!)
      for (let i = 0; i < 62; i++) {
        const wx = -445 + i * 16;
        const isBeat = i % 10 === 4;
        const passed = lt >= 4.52 && playheadX >= wx;
        const pulse = passed ? 1.18 : 1.0;
        const amp = (isBeat ? 34 : 8 + Math.abs(Math.sin(i * 1.3 + t * 2.2 * messyP)) * 16) * pulse;
        ctx.fillStyle = isBeat
          ? (passed ? '#fde047' : '#00f5ff')
          : (passed ? 'rgba(56, 189, 248, 0.85)' : 'rgba(52, 211, 153, 0.72)');
        ctx.beginPath();
        ctx.roundRect(wx, 254 - amp / 2, 9, amp, 3);
        ctx.fill();
      }

      // Render Timeline Clips (drift slightly messy in Beat A -> Magnetically Snap onto Beat Grid as AI Playhead crosses!)
      this.timelineClips.forEach((cl) => {
        const unalignedX = E.lerp(cl.s3X, cl.messyX, messyP);
        // Trigger magnetic spring snap as soon as AI Sweep Playhead reaches `cl.snapX`!
        const snapTrigger = lt >= 4.52
          ? E.clamp((playheadX - (cl.snapX - 40)) / 135)
          : 0;
        const snapSpring = E.spring(snapTrigger, 16, 0.66);

        const x = E.lerp(unalignedX, cl.snapX, snapSpring);
        const w = E.lerp(cl.s3W, cl.snapW, E.clamp(snapSpring, 0, 1.05));
        const h = cl.h;
        const y = cl.y;

        ctx.save();
        ctx.globalAlpha = fade * 0.94;
        ctx.fillStyle = cl.col;
        ctx.beginPath();
        ctx.roundRect(x, y - h / 2, w, h, 8);
        ctx.fill();

        // Crisp emerald/gold highlight flash right when clip snaps onto beat!
        const snapFlash = snapTrigger > 0.05 && snapTrigger < 0.85
          ? Math.sin((snapTrigger / 0.85) * Math.PI)
          : 0;
        ctx.strokeStyle = snapFlash > 0.1
          ? `rgba(253, 224, 71, ${0.45 + 0.55 * snapFlash})`
          : (snapTrigger >= 0.85 ? 'rgba(110, 231, 183, 0.72)' : 'rgba(255, 255, 255, 0.35)');
        ctx.lineWidth = snapFlash > 0.1 ? 2.2 : 1.2;
        ctx.stroke();

        // Clip label inside rounded rect
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x + 4, y - h / 2, Math.max(8, w - 8), h, 6);
        ctx.clip();
        ctx.font = '600 12px "JetBrains Mono", "PingFang SC", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(cl.label, x + 12, y);
        ctx.restore();

        ctx.restore();
      });

      // Glowing AI Razor Playhead + Neon Motion Trail (`playheadX`)
      if (lt >= 4.52 && aiSweepP < 0.99) {
        const trailG = ctx.createLinearGradient(playheadX - 110, 0, playheadX, 0);
        trailG.addColorStop(0, 'rgba(0, 245, 255, 0)');
        trailG.addColorStop(1, 'rgba(0, 245, 255, 0.26)');
        ctx.fillStyle = trailG;
        ctx.fillRect(playheadX - 110, 66, 110, 248);
      }

      ctx.strokeStyle = lt >= 4.52 ? '#fde047' : '#00f5ff';
      ctx.lineWidth = lt >= 4.52 ? 3.2 : 2.6;
      ctx.shadowColor = lt >= 4.52 ? '#fde047' : '#00f5ff';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.moveTo(playheadX, 42);
      ctx.lineTo(playheadX, 314);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Playhead Pentagon Cap
      ctx.fillStyle = lt >= 4.52 ? '#fde047' : '#00f5ff';
      ctx.beginPath();
      ctx.moveTo(playheadX - 8, 36);
      ctx.lineTo(playheadX + 8, 36);
      ctx.lineTo(playheadX + 8, 46);
      ctx.lineTo(playheadX, 54);
      ctx.lineTo(playheadX - 8, 46);
      ctx.closePath();
      ctx.fill();

      ctx.restore(); // end dock clip
      ctx.restore();
    }

    _renderTopEditPill(ctx, lt, aiSweepP, fade) {
      if (lt < 4.35 || lt > 7.40) return;
      const enter = E.snappyOut(E.clamp((lt - 4.35) / 0.28));
      const exit = 1 - E.smoothstep(E.clamp((lt - 7.05) / 0.35));
      const alpha = enter * exit * fade;
      if (alpha <= 0.01) return;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = '600 19px "PingFang SC", "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const txt = aiSweepP > 0.72
        ? '✦  自动抠像 · 语音打轴 · 鼓点磁吸卡点 —— 4K 成片就绪'
        : '✦  AI 智能成片引擎：自动边缘抠像 + 节拍磁吸对齐 + 曲线变速';
      const barW = Math.ceil(ctx.measureText(txt).width) + 68;
      const barY = -346;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.72)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-barW / 2, barY, barW, 46, 23);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#e0f2fe';
      ctx.fillText(txt, 0, barY + 23);
      ctx.restore();
    }

    _renderForeground(t, lt, diveP, ctx, width, height) {
      // Soft cinema vignette
      const vig = ctx.createRadialGradient(
        width * 0.5, height * 0.5, width * 0.36,
        width * 0.5, height * 0.5, width * 0.80
      );
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(2,4,10,0.50)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, width, height);

      // Voiceover Subtitle (Synced to Yunxi `s04` word boundaries, zero trailing comma, zero meta notes)
      const subY = height - Math.max(36, height * 0.072);
      const subFont = Math.max(15, Math.round(width * 0.0175));
      ctx.save();
      ctx.font = `600 ${subFont}px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let subText = '';
      let subAlpha = 0;

      if (lt >= 0.06 && lt < 4.20) {
        subText = '它改变了剪辑——曾经逐帧对齐的抠像、字幕与卡点';
        subAlpha = E.smoothstep(E.invLerp(0.06, 0.28, lt)) * (1 - E.smoothstep(E.invLerp(3.96, 4.20, lt)));
      } else if (lt >= 4.24 && lt < 7.85) {
        subText = '现在一眨眼，凌乱素材就能自动成片。';
        subAlpha = E.smoothstep(E.invLerp(4.24, 4.46, lt)) * (1 - E.smoothstep(E.invLerp(7.52, 7.85, lt)));
      }

      if (subAlpha > 0.01 && subText) {
        const padX = 24;
        const pillH = Math.round(subFont * 1.95);
        const pillW = Math.ceil(ctx.measureText(subText).width) + padX * 2;
        ctx.globalAlpha = subAlpha;
        ctx.fillStyle = 'rgba(4, 8, 18, 0.62)';
        ctx.beginPath();
        ctx.roundRect(width / 2 - pillW / 2, subY - pillH / 2, pillW, pillH, pillH / 2);
        ctx.fill();

        ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
        ctx.shadowBlur = 6;
        ctx.fillStyle = 'rgba(248, 250, 252, 0.98)';
        ctx.fillText(subText, width / 2, subY + 1);
      }
      ctx.restore();
    }
  }

  window.ShotS04Editing = ShotS04Editing;
})();
