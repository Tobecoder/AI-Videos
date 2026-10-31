/**
 * SHOT S05 (29.00s - 37.80s): 第二幕 · 踏平各行各业技术围墙
 *
 * Zero-Seam One-Take Continuity:
 *   [29.00s / lt=0.00s] Exact 0.00px lock with S04's borderless Sunset Highway Horizon Portal!
 *   [29.10s - 32.45s]   Yunxi: “还有翻译、配乐、写作、科研……”
 *                       Sunset morphs smoothly into a hyper-speed 3D Spatial Warp Tunnel as 4 bespoke domain streams
 *                       (Multi-script Neural Translation, 5-Line Musical Staff, Fountain-Pen Prose, 3D DNA Double Helix)
 *                       fly past the camera in crisp 3D perspective synced to each exact word!
 *   [32.45s - 35.25s]   Yunxi: “曾经苦练几年的技术围墙”
 *                       7 towering, oppressive black obsidian "Technical Barrier" monoliths (`10,000 HOURS`, `底层编译`, etc.)
 *                       rise across the horizon, blocking the path ahead in an imposing low-angle architectural wall.
 *   [35.25s - 36.55s]   Yunxi: “一夜之间，被推平到了地面。”
 *                       A supersonic cyan-gold AI shockwave slams into the wall -> glowing fracture seams crack open ->
 *                       all 7 monoliths topple like dominoes to the ground, shattering into hundreds of luminous compute particles!
 *   [36.55s - 37.80s]   One-Take Transition -> S06: Compute particles spiral into a central vertical Pillar of Light,
 *                       crystallizing a levitating 3D Octahedral Sovereign Core + Rotating Neon Halo Crown for S06!
 */
(function () {
  const E = window.MGEasing;

  class ShotS05Walls {
    constructor(stage3D) {
      this.stage = stage3D;
      this.startTime = 29.00;
      this.endTime = 37.80;
      this.duration = this.endTime - this.startTime; // 8.80s

      // 7 Towering Black "Technical Barrier" Monoliths across the horizon
      this.monoliths = [
        { idx: 0, x: -505, w: 108, h: 226, title: '语言鸿沟', sub: 'FLUENCY WALL', lean: -0.28 },
        { idx: 1, x: -348, w: 116, h: 256, title: '乐理混音', sub: 'HARMONY & MIX', lean: -0.20 },
        { idx: 2, x: -182, w: 124, h: 282, title: '逐帧后期', sub: 'MANUAL ROTO', lean: -0.11 },
        { idx: 3, x: 0,    w: 146, h: 318, title: '十年苦练壁垒', sub: '10,000 HOURS', lean: 0.00 },
        { idx: 4, x: 182,  w: 124, h: 282, title: '底层编译', sub: 'KERNEL & C++', lean: 0.11 },
        { idx: 5, x: 348,  w: 116, h: 256, title: '三维拓扑', sub: '3D TOPOLOGY', lean: 0.20 },
        { idx: 6, x: 505,  w: 108, h: 226, title: '科研建模', sub: 'LAB SIMULATION', lean: 0.28 }
      ];

      // Pre-seeded deterministic compute particles spawned when monoliths shatter onto the ground
      this.particles = [];
      for (let i = 0; i < 252; i++) {
        const mIdx = i % 7;
        const m = this.monoliths[mIdx];
        const s1 = Math.sin(i * 12.9898 + 4.1414) * 43758.5453;
        const r1 = s1 - Math.floor(s1);
        const s2 = Math.sin(i * 78.233 + 1.732) * 29432.1234;
        const r2 = s2 - Math.floor(s2);
        const s3 = Math.sin(i * 39.425 + 9.117) * 19283.771;
        const r3 = s3 - Math.floor(s3);

        this.particles.push({
          mIdx,
          originX: m.x + (r1 - 0.5) * m.w * 1.15,
          originYOffset: -r2 * m.h * 0.45,
          vx: (r1 - 0.5) * 240 + m.lean * 210,
          vy: 28 + r3 * 165,
          size: 2.0 + r2 * 3.8,
          hueType: i % 4, // cyan, emerald, gold, violet
          spinPhase: r3 * Math.PI * 2
        });
      }

      // Warp speed peripheral star-streaks
      this.warpStreaks = [];
      for (let i = 0; i < 64; i++) {
        const a = (i / 64) * Math.PI * 2 + (i % 3) * 0.09;
        const r = 0.15 + ((i * 37) % 100) / 100 * 0.85;
        this.warpStreaks.push({
          angle: a,
          offset: r,
          speed: 0.65 + (i % 5) * 0.16,
          col: i % 3 === 0 ? '#00f5ff' : (i % 3 === 1 ? '#38bdf8' : '#a855f7')
        });
      }
    }

    render(t, vecCtx, fgCtx, width, height) {
      const lt = Math.max(0, t - this.startTime); // 0.00 -> 8.80s
      this._updateStage3D(t, lt);

      vecCtx.clearRect(0, 0, width, height);
      fgCtx.clearRect(0, 0, width, height);

      const baseW = 1280;
      const baseH = 720;
      const scaleFit = Math.min(width / baseW, height / baseH);

      // Master sub-beat curves:
      // 1) Entry crossfade from S04's Sunset Highway -> Deep Cosmic Warp Corridor (`0.00s -> 0.85s`)
      const warpEnterP = E.smoothstep(E.clamp(lt / 0.85));
      // 2) Imposing Low-Angle Camera Tilt as Black Monoliths Rise (`3.25s -> 6.35s`)
      const wallPhaseP = E.smoothstep(E.clamp((lt - 3.20) / 0.85)) * (1 - E.smoothstep(E.clamp((lt - 6.85) / 0.85)));
      // 3) Shockwave Impact Camera Shake (`6.22s -> 6.95s`, right as monoliths slam down!)
      const impactEnv = lt >= 6.20 && lt < 7.15
        ? Math.sin(E.clamp((lt - 6.20) / 0.95) * Math.PI)
        : 0;
      const shakeX = Math.sin(lt * 58) * 7.5 * impactEnv;
      const shakeY = Math.cos(lt * 67) * 6.0 * impactEnv;
      // 4) End Vortex Convergence (`7.35s -> 8.80s` -> S06 Sovereign Core!)
      const vortexP = E.cinematicInOut(E.clamp((lt - 7.35) / 1.42));

      const horizonY = E.lerp(0, 56, wallPhaseP) * (1 - vortexP);

      vecCtx.save();
      vecCtx.translate(width / 2, height / 2);
      vecCtx.scale(scaleFit, scaleFit);
      vecCtx.translate(shakeX, shakeY);

      // 1) Sky & Seamless S04 Sunset Entry Backdrop (`lt = 0.00s` is 0.00px identical to S04 end!)
      this._renderBackdropAndHorizon(vecCtx, t, lt, warpEnterP, vortexP, horizonY);

      // 2) Floor & Ceiling Perspective Warp Tunnel + Peripheral Speed Streaks
      this._renderWarpCorridorGrid(vecCtx, t, lt, warpEnterP, wallPhaseP, vortexP, horizonY);

      // 3) Four Flying 3D Domain Streams (`翻译 · 配乐 · 写作 · 科研` synced to Yunxi!)
      if (lt >= 0.22 && lt < 4.15) {
        this._renderFlyingDomainStreams(vecCtx, t, lt, horizonY);
      }

      // 4) Towering Black "Technical Barrier" Monoliths -> Shockwave -> Domino Collapse -> Compute Particles!
      if (lt >= 3.20) {
        this._renderMonolithsAndCollapse(vecCtx, t, lt, horizonY, vortexP);
      }

      // 5) Supersonic AI Shockwave Ring (`lt = 5.52s -> 6.95s`)
      if (lt >= 5.52 && lt < 7.05) {
        this._renderSupersonicShockwave(vecCtx, lt, horizonY);
      }

      // 6) One-Take Convergence -> Towering Light Pillar & 3D Sovereign Prism Core for S06 (`lt >= 7.25s`)
      if (lt >= 7.25) {
        this._renderSovereignCoreConvergence(vecCtx, t, lt, vortexP);
      }

      vecCtx.restore();

      // Foreground Cinema Vignette & Pure Documentary Voiceover Subtitles
      this._renderForeground(t, lt, fgCtx, width, height);
    }

    _updateStage3D(t, lt) {
      const warpP = E.smoothstep(E.clamp(lt / 0.85));
      const vortexP = E.cinematicInOut(E.clamp((lt - 7.35) / 1.42));

      // Continuous forward surge through 3D ambient particle space
      const zPos = E.lerp(6.2, 4.2, warpP) + vortexP * 3.8;
      this.stage.camera.position.set(
        Math.sin(t * 0.9) * 0.18 * (1 - vortexP),
        Math.cos(t * 0.7) * 0.12 * (1 - vortexP),
        zPos
      );
      this.stage.camera.lookAt(0, 0, 0);
      this.stage.renderer.render(this.stage.scene, this.stage.camera);
    }

    // =========================================================================
    // 1. BACKDROP & ZERO-SEAM S04 SUNSET PORTAL HANDOFF
    // =========================================================================
    _renderBackdropAndHorizon(ctx, t, lt, warpEnterP, vortexP, horizonY) {
      // Exact S04 end viewport bounds (`644 * 2.02 = 1300.88`, `364 * 2.02 = 735.28`)
      const x0 = -660;
      const y0 = -367.64;
      const w = 1320;
      const h = 735.28;

      // Deep Cosmic Warp Space Backdrop
      const deepBg = ctx.createLinearGradient(0, -380, 0, 380);
      deepBg.addColorStop(0, '#040814');
      deepBg.addColorStop(0.48, '#08142c');
      deepBg.addColorStop(0.55, '#0b1936');
      deepBg.addColorStop(1, '#04060e');
      ctx.fillStyle = deepBg;
      ctx.fillRect(-720, -420, 1440, 840);

      // Crossfade from S04's exact Teal-Orange Sunset Horizon at `lt = 0.00s` (`sunsetAlpha = 1 -> 0`)!
      const sunsetAlpha = 1 - warpEnterP;
      if (sunsetAlpha > 0.005) {
        ctx.save();
        ctx.globalAlpha = sunsetAlpha;

        const sky = ctx.createLinearGradient(0, y0, 0, y0 + h);
        sky.addColorStop(0, '#06283d');
        sky.addColorStop(0.38, '#0c4a6e');
        sky.addColorStop(0.60, '#ea580c');
        sky.addColorStop(0.74, '#1e1b2e');
        sky.addColorStop(1, '#070b14');
        ctx.fillStyle = sky;
        ctx.fillRect(x0, y0, w, h);

        // S04's Sunset Solar Disc + `VISION` receding past camera (`lt = 0 -> 0.55s`)
        const flyPastScale = 1 + E.smoothstep(E.clamp(lt / 0.55)) * 0.85;
        const sunFade = 0.55 * (1 - E.smoothstep(E.clamp(lt / 0.48)));
        if (sunFade > 0.005) {
          ctx.save();
          ctx.globalAlpha = sunFade;
          const sunY = 29.41;
          const sunR = 278.76;
          const sunG = ctx.createRadialGradient(0, sunY, 12, 0, sunY, sunR);
          sunG.addColorStop(0, 'rgba(254, 240, 138, 0.94)');
          sunG.addColorStop(0.42, 'rgba(249, 115, 22, 0.48)');
          sunG.addColorStop(1, 'rgba(249, 115, 22, 0)');
          ctx.fillStyle = sunG;
          ctx.beginPath();
          ctx.arc(0, sunY, sunR, 0, Math.PI * 2);
          ctx.fill();

          ctx.translate(0, -102.9 * flyPastScale);
          ctx.scale(flyPastScale, flyPastScale);
          ctx.font = '900 113.1px "Inter", sans-serif';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.90)';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('VISION', 0, 0);
          ctx.restore();
        }

        ctx.restore();
      }

      // Horizon Atmospheric Glow Band (shifts from cyan warp -> ominous crimson-amber under monoliths -> golden clarity after collapse!)
      const wallOminous = E.smoothstep(E.clamp((lt - 3.35) / 0.85)) * (1 - E.smoothstep(E.clamp((lt - 6.25) / 0.45)));
      const clearDawn = E.smoothstep(E.clamp((lt - 6.25) / 0.75));
      if (warpEnterP > 0.05) {
        ctx.save();
        ctx.globalAlpha = warpEnterP * 0.75;
        const glowG = ctx.createRadialGradient(0, horizonY, 10, 0, horizonY, 540);
        if (clearDawn > 0.3) {
          glowG.addColorStop(0, 'rgba(56, 189, 248, 0.42)');
          glowG.addColorStop(0.45, 'rgba(168, 85, 247, 0.18)');
          glowG.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else if (wallOminous > 0.3) {
          glowG.addColorStop(0, `rgba(249, 115, 22, ${0.26 * wallOminous})`);
          glowG.addColorStop(0.5, 'rgba(30, 41, 59, 0.22)');
          glowG.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
          glowG.addColorStop(0, 'rgba(0, 245, 255, 0.30)');
          glowG.addColorStop(0.5, 'rgba(59, 130, 246, 0.12)');
          glowG.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }
        ctx.fillStyle = glowG;
        ctx.fillRect(-700, -400, 1400, 800);
        ctx.restore();
      }
    }

    // =========================================================================
    // 2. PERSPECTIVE WARP TUNNEL GRID & SPEED STREAKS
    // =========================================================================
    _renderWarpCorridorGrid(ctx, t, lt, warpEnterP, wallPhaseP, vortexP, horizonY) {
      const bottomY = 367.64;
      const topY = -367.64;

      // Floor Perspective Grid (exact match with S04 at lt=0: `i = -6..6`, `36.36 -> 238.36`, `lineWidth = 2.83`, `alpha = 0.74`)
      ctx.save();
      const floorAlpha = E.lerp(0.74, 0.48, warpEnterP) * (1 - vortexP * 0.45);
      ctx.strokeStyle = `rgba(0, 245, 255, ${floorAlpha})`;
      ctx.lineWidth = E.lerp(2.83, 1.8, warpEnterP);

      const maxIdx = warpEnterP > 0.3 ? 9 : 6;
      for (let i = -maxIdx; i <= maxIdx; i++) {
        const extraFade = Math.abs(i) > 6 ? E.clamp((warpEnterP - 0.3) / 0.5) : 1;
        ctx.globalAlpha = extraFade;
        ctx.beginPath();
        ctx.moveTo(i * 36.36 * (1 - vortexP * 0.65), horizonY);
        ctx.lineTo(i * 238.36, bottomY);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Continuous phase-matched road scroll (`S04` at t=29.00s uses `(t * 11.4) % 1`!)
      const roadScroll = (t * 11.4) % 1;
      for (let r = 0; r < 5; r++) {
        const ry = horizonY + Math.pow(((r + roadScroll) / 5), 1.85) * (bottomY - horizonY);
        ctx.beginPath();
        ctx.moveTo(-680, ry);
        ctx.lineTo(680, ry);
        ctx.stroke();
      }
      ctx.restore();

      // Mirrored Upper Ceiling Grid (closes into a 3D Warp Corridor during Beat 1!)
      const ceilingAlpha = warpEnterP * (1 - wallPhaseP * 0.72) * (1 - vortexP * 0.85) * 0.30;
      if (ceilingAlpha > 0.01) {
        ctx.save();
        ctx.strokeStyle = `rgba(56, 189, 248, ${ceilingAlpha})`;
        ctx.lineWidth = 1.4;
        for (let i = -8; i <= 8; i++) {
          ctx.beginPath();
          ctx.moveTo(i * 36.36, horizonY - 24);
          ctx.lineTo(i * 220, topY);
          ctx.stroke();
        }
        for (let r = 0; r < 4; r++) {
          const ry = (horizonY - 24) - Math.pow(((r + roadScroll) / 4), 1.85) * ((horizonY - 24) - topY);
          ctx.beginPath();
          ctx.moveTo(-680, ry);
          ctx.lineTo(680, ry);
          ctx.stroke();
        }
        ctx.restore();
      }

      // High-Speed Radial Warp Streaks flying past peripheral vision (`lt = 0.20s -> 6.20s`)
      const streakEnv = warpEnterP * (1 - E.smoothstep(E.clamp((lt - 5.80) / 0.80)));
      if (streakEnv > 0.02) {
        ctx.save();
        this.warpStreaks.forEach((st) => {
          const prog = (st.offset + lt * st.speed * 0.95) % 1;
          const rInner = 65 + Math.pow(prog, 2.3) * 680;
          const rOuter = rInner + 22 + Math.pow(prog, 2.3) * 145;
          if (rInner > 740) return;

          const ca = Math.cos(st.angle);
          const sa = Math.sin(st.angle) * 0.62;
          ctx.strokeStyle = st.col;
          ctx.globalAlpha = streakEnv * Math.sin(prog * Math.PI) * 0.55;
          ctx.lineWidth = 1.2 + prog * 2.2;
          ctx.beginPath();
          ctx.moveTo(ca * rInner, horizonY + sa * rInner);
          ctx.lineTo(ca * rOuter, horizonY + sa * rOuter);
          ctx.stroke();
        });
        ctx.restore();
      }
    }

    // =========================================================================
    // 3. FOUR 3D PERSPECTIVE DOMAIN STREAMS (`翻译 · 配乐 · 写作 · 科研`)
    // =========================================================================
    _renderFlyingDomainStreams(ctx, t, lt, horizonY) {
      // Synced to Yunxi `s05` word boundaries (`VO starts at lt = 0.10s`):
      // - `翻译` @ 0.42s | `配乐` @ 1.12s | `写作` @ 1.81s | `科研` @ 2.72s
      const streams = [
        { id: 'trans', spawn: 0.18, dur: 1.85, sideX: -1.0, sideY: -0.18, accent: '#00f5ff', badge: '翻译 · NEURAL MT' },
        { id: 'music', spawn: 0.82, dur: 1.85, sideX:  1.0, sideY: -0.14, accent: '#34d399', badge: '配乐 · SYMPHONY AI' },
        { id: 'write', spawn: 1.52, dur: 1.85, sideX: -0.92, sideY: -0.58, accent: '#fbbf24', badge: '写作 · PROSE ENGINE' },
        { id: 'sci',   spawn: 2.32, dur: 1.75, sideX:  0.94, sideY: -0.52, accent: '#c084fc', badge: '科研 · HELIX FOLD' }
      ];

      streams.forEach((s) => {
        const u = (lt - s.spawn) / s.dur;
        if (u <= 0 || u >= 1) return;

        // Perspective depth expansion (`z -> camera`): slow emergence near horizon, whooshes past foreground!
        const depthP = Math.pow(u, 1.72);
        const cx = s.sideX * E.lerp(54, 520, depthP);
        const cy = horizonY + s.sideY * E.lerp(28, 250, depthP);
        const scale = E.lerp(0.28, 1.38, depthP);
        const alpha = E.smoothstep(E.clamp(u / 0.18)) * (1 - E.smoothstep(E.clamp((u - 0.76) / 0.24)));

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(cx, cy);
        ctx.scale(scale, scale);

        // Subtle perspective shear toward vanishing point
        ctx.transform(1, s.sideX * 0.08, 0, 1, 0, 0);

        // Translucent Spatial Glass Card Frame (`286 x 138`)
        const cw = 286, ch = 138;
        ctx.shadowColor = s.accent;
        ctx.shadowBlur = 22;
        ctx.fillStyle = 'rgba(8, 15, 32, 0.86)';
        ctx.strokeStyle = s.accent;
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.roundRect(-cw / 2, -ch / 2, cw, ch, 16);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Auto-sized Top Domain Pill
        ctx.font = '700 12px "PingFang SC", "JetBrains Mono", sans-serif';
        const bw = Math.ceil(ctx.measureText(s.badge).width) + 24;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
        ctx.beginPath();
        ctx.roundRect(-cw / 2 + 14, -ch / 2 + 12, bw, 24, 12);
        ctx.fill();
        ctx.fillStyle = s.accent;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(s.badge, -cw / 2 + 14 + bw / 2, -ch / 2 + 24);

        if (s.id === 'trans') {
          // Multi-script Live Neural Translation Alignment (`你好 ⇄ Hello ⇄ Bonjour ⇄ こんにちは`)
          ctx.font = '700 20px "PingFang SC", "Inter", sans-serif';
          ctx.fillStyle = '#f8fafc';
          ctx.textAlign = 'left';
          ctx.fillText('你好', -118, 4);
          ctx.fillStyle = '#38bdf8';
          ctx.fillText('Hello', -42, 4);
          ctx.fillStyle = '#6ee7b7';
          ctx.fillText('Bonjour', 32, 4);

          ctx.font = '600 13px "Inter", sans-serif';
          ctx.fillStyle = '#94a3b8';
          ctx.fillText('こんにちは  ·  Hola  ·  مرحبا', -118, 38);

          // Glowing semantic bridge arcs
          ctx.strokeStyle = 'rgba(0, 245, 255, 0.75)';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(-72, -8); ctx.quadraticCurveTo(-56, -24, -40, -8);
          ctx.moveTo(10, -8); ctx.quadraticCurveTo(26, -24, 42, -8);
          ctx.stroke();
        } else if (s.id === 'music') {
          // 5-Line Musical Staff (`五线谱`) + Vector Beamed Eighth Notes & Harmonic Bars!
          ctx.strokeStyle = 'rgba(110, 231, 183, 0.42)';
          ctx.lineWidth = 1.2;
          for (let l = 0; l < 5; l++) {
            const ly = -6 + l * 10;
            ctx.beginPath();
            ctx.moveTo(-122, ly);
            ctx.quadraticCurveTo(0, ly + Math.sin(t * 5 + l) * 4, 122, ly);
            ctx.stroke();
          }
          // Crisp Vector Musical Notes (`♪`, `♫`)
          const noteXs = [-82, -28, 28, 82];
          const noteYs = [24, 14, 4, 18];
          noteXs.forEach((nx, ni) => {
            const ny = noteYs[ni] + Math.sin(t * 7 + ni) * 3;
            ctx.fillStyle = ni % 2 === 0 ? '#fde047' : '#34d399';
            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.ellipse(nx, ny, 6.5, 4.8, -0.35, 0, Math.PI * 2);
            ctx.fill();
            // Note stem + flag
            ctx.beginPath();
            ctx.moveTo(nx + 5.5, ny);
            ctx.lineTo(nx + 5.5, ny - 24);
            ctx.quadraticCurveTo(nx + 16, ny - 18, nx + 13, ny - 10);
            ctx.stroke();
          });
        } else if (s.id === 'write') {
          // Precision Vector Fountain-Pen Nib + Streaming Golden Editorial Lines
          ctx.save();
          ctx.translate(-96, 16);
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.moveTo(0, -24);
          ctx.lineTo(14, 4);
          ctx.lineTo(6, 22);
          ctx.lineTo(-6, 22);
          ctx.lineTo(-14, 4);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#09101f';
          ctx.beginPath();
          ctx.arc(0, -2, 3.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Streaming structured prose lines
          const widths = [168, 146, 178, 118];
          widths.forEach((lw, li) => {
            const grow = E.clamp((u * 2.2) - li * 0.18);
            ctx.fillStyle = li === 0 ? '#fde047' : 'rgba(226, 232, 240, 0.78)';
            ctx.beginPath();
            ctx.roundRect(-62, -8 + li * 14, lw * grow, 6.5, 3);
            ctx.fill();
          });
        } else if (s.id === 'sci') {
          // Rotating 3D Double-Helix Molecular Strand (`双螺旋分子链`)
          for (let k = 0; k <= 14; k++) {
            const hx = -114 + k * 16.2;
            const phase = t * 5.5 + k * 0.52;
            const yA = 16 + Math.sin(phase) * 24;
            const yB = 16 - Math.sin(phase) * 24;

            // Base-pair rung
            ctx.strokeStyle = 'rgba(192, 132, 252, 0.45)';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(hx, yA);
            ctx.lineTo(hx, yB);
            ctx.stroke();

            // Dual sugar-phosphate nodes
            ctx.fillStyle = '#00f5ff';
            ctx.beginPath(); ctx.arc(hx, yA, 3.6, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#e879f9';
            ctx.beginPath(); ctx.arc(hx, yB, 3.6, 0, Math.PI * 2); ctx.fill();
          }
        }

        ctx.restore();
      });
    }

    // =========================================================================
    // 4. SEVEN TOWERING BLACK MONOLITHS -> DOMINO COLLAPSE -> COMPUTE PARTICLES
    // =========================================================================
    _renderMonolithsAndCollapse(ctx, t, lt, horizonY, vortexP) {
      // Camera pushes menacingly closer to the monolith wall (`3.20s -> 6.30s`)
      const approachScale = E.lerp(0.76, 1.12, E.smoothstep(E.clamp((lt - 3.20) / 3.05)));

      // Draw outer monoliths first, center monolith last for clean 3D painter's occlusion!
      const drawOrder = [0, 6, 1, 5, 2, 4, 3];

      drawOrder.forEach((mIdx) => {
        const m = this.monoliths[mIdx];
        const distFromCenter = Math.abs(m.idx - 3);

        // Rise from horizon (`lt = 3.25s + stagger`)
        const riseStart = 3.22 + distFromCenter * 0.08;
        const riseP = E.snappyOut(E.clamp((lt - riseStart) / 0.68));
        if (riseP <= 0.01) return;

        // Domino Shockwave Impact Time (`center = 6.22s`, ripples outward `0.085s` per slab!)
        const impactStart = 6.22 + distFromCenter * 0.085;
        const crackP = E.clamp((lt - (impactStart - 0.14)) / 0.22);
        const fallRaw = E.clamp((lt - impactStart) / 0.62);
        // Accelerating gravity fall (`t^2` slam onto ground!)
        const fallP = fallRaw * fallRaw;
        const shatteredP = E.clamp((lt - (impactStart + 0.50)) / 0.45);

        // Render standing / toppling 3D Obsidian Slab until it shatters completely on ground impact
        if (shatteredP < 0.99) {
          ctx.save();
          ctx.globalAlpha = (1 - shatteredP) * (1 - vortexP);

          const baseX = m.x * approachScale;
          const baseY = horizonY + 18 + distFromCenter * 4;
          const slabW = m.w * approachScale;
          const fullH = m.h * approachScale * riseP;

          // 3D Backward Topple Foreshortening:
          // As `tilt` goes `0 -> PI/2`, vertical height compresses by `cos(tilt)` while top edge recedes & leans outward!
          const tilt = fallP * (Math.PI * 0.48);
          const projH = fullH * Math.cos(tilt);
          const recedeShiftX = m.lean * fullH * Math.sin(tilt) * 0.95;
          const recedeShiftY = -fullH * Math.sin(tilt) * 0.16;

          const blX = baseX - slabW / 2;
          const brX = baseX + slabW / 2;
          const tlX = blX + recedeShiftX + slabW * 0.04 * fallP;
          const trX = brX + recedeShiftX - slabW * 0.04 * fallP;
          const topEdgeY = baseY - projH + recedeShiftY;

          // Ground shadow under monolith
          ctx.fillStyle = 'rgba(0, 0, 0, 0.68)';
          ctx.beginPath();
          ctx.ellipse(baseX + recedeShiftX * 0.4, baseY + 4, slabW * 0.68, 9 + fallP * 18, 0, 0, Math.PI * 2);
          ctx.fill();

          // 3D Extruded Side Bevel Face (gives true architectural thickness!)
          const depthX = (m.idx <= 3 ? 18 : -18) * approachScale;
          const depthY = -8 * approachScale;
          ctx.fillStyle = '#0f172a';
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          if (m.idx <= 3) {
            ctx.moveTo(brX, baseY);
            ctx.lineTo(brX + depthX, baseY + depthY);
            ctx.lineTo(trX + depthX, topEdgeY + depthY);
            ctx.lineTo(trX, topEdgeY);
          } else {
            ctx.moveTo(blX, baseY);
            ctx.lineTo(blX + depthX, baseY + depthY);
            ctx.lineTo(tlX + depthX, topEdgeY + depthY);
            ctx.lineTo(tlX, topEdgeY);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Top Roof Thickness Bevel (visible especially as monolith tilts backward!)
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.moveTo(tlX, topEdgeY);
          ctx.lineTo(trX, topEdgeY);
          ctx.lineTo(trX + depthX * 0.6, topEdgeY - 8 - fallP * 14);
          ctx.lineTo(tlX + depthX * 0.6, topEdgeY - 8 - fallP * 14);
          ctx.closePath();
          ctx.fill();

          // Oppressive Obsidian Front Face
          const faceG = ctx.createLinearGradient(baseX, topEdgeY, baseX, baseY);
          faceG.addColorStop(0, '#090d16');
          faceG.addColorStop(0.55, '#111827');
          faceG.addColorStop(1, '#050811');
          ctx.fillStyle = faceG;
          ctx.strokeStyle = crackP > 0.05
            ? `rgba(0, 245, 255, ${0.45 + 0.55 * crackP})`
            : 'rgba(249, 115, 22, 0.42)';
          ctx.lineWidth = crackP > 0.05 ? 2.4 : 1.5;

          ctx.beginPath();
          ctx.moveTo(blX, baseY);
          ctx.lineTo(brX, baseY);
          ctx.lineTo(trX, topEdgeY);
          ctx.lineTo(tlX, topEdgeY);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Engraved Barrier Title & Sub-Label (foreshortens cleanly as slab tilts!)
          if (fallP < 0.68 && projH > 65) {
            ctx.save();
            const midX = (blX + brX + tlX + trX) * 0.25;
            const midY = (baseY + topEdgeY) * 0.5;
            ctx.translate(midX, midY);
            ctx.scale(1, Math.max(0.2, Math.cos(tilt)));

            // Warning hazard bar near top of monolith
            ctx.fillStyle = crackP > 0.1 ? '#00f5ff' : '#ea580c';
            ctx.fillRect(-slabW * 0.28, -fullH * 0.34, slabW * 0.56, 3.5);

            ctx.font = `800 ${m.idx === 3 ? 18 : 15}px "PingFang SC", "Inter", sans-serif`;
            ctx.fillStyle = '#e2e8f0';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(m.title, 0, -10);

            ctx.font = '700 10.5px "JetBrains Mono", monospace';
            ctx.fillStyle = '#64748b';
            ctx.fillText(m.sub, 0, 14);
            ctx.restore();
          }

          // Glowing Cyan Fracture Lightning Cracks right on Shockwave Impact!
          if (crackP > 0.05) {
            ctx.save();
            ctx.strokeStyle = '#fde047';
            ctx.shadowColor = '#00f5ff';
            ctx.shadowBlur = 16;
            ctx.lineWidth = 2.2;
            const cxMid = (blX + brX) * 0.5;
            ctx.beginPath();
            ctx.moveTo(cxMid - slabW * 0.32, baseY - projH * 0.22);
            ctx.lineTo(cxMid + slabW * 0.08, baseY - projH * 0.48);
            ctx.lineTo(cxMid - slabW * 0.14, baseY - projH * 0.68);
            ctx.lineTo(tlX + slabW * 0.62, topEdgeY + projH * 0.12);
            ctx.stroke();
            ctx.restore();
          }

          ctx.restore();
        }

        // Ground Slam Shock Ring when each monolith hits the ground (`fallRaw ~ 0.85..1.4`)
        const slamT = lt - (impactStart + 0.52);
        if (slamT > 0 && slamT < 0.65) {
          const sp = slamT / 0.65;
          ctx.save();
          ctx.strokeStyle = `rgba(0, 245, 255, ${(1 - sp) * 0.80})`;
          ctx.lineWidth = 2.5 * (1 - sp);
          ctx.beginPath();
          ctx.ellipse(
            m.x * approachScale + m.lean * 90,
            horizonY + 24,
            30 + sp * 135,
            8 + sp * 28,
            0, 0, Math.PI * 2
          );
          ctx.stroke();
          ctx.restore();
        }
      });

      // Luminous Compute Particle Stream (`算力粒子流`) born from shattered monoliths -> Spirals into S06 Vortex!
      if (lt >= 6.45) {
        ctx.save();
        const cols = ['#00f5ff', '#34d399', '#fde047', '#c084fc'];
        this.particles.forEach((p) => {
          const distFromCenter = Math.abs(p.mIdx - 3);
          const birthT = 6.52 + distFromCenter * 0.085;
          const age = lt - birthT;
          if (age <= 0) return;

          const scatterT = Math.min(age, 1.35);
          // Ground scatter position
          const sx = p.originX * 1.08 + p.vx * scatterT * 0.55;
          const sy = horizonY + 22 + p.originYOffset * Math.exp(-scatterT * 3.2) + p.vy * scatterT * 0.42;

          // Spiral inward into Central Light Pillar `(0, -24)` as `vortexP` goes `0 -> 1`!
          const swirlAngle = vortexP * 4.2 + p.spinPhase * 0.25;
          const radiusScale = 1 - E.smoothstep(E.clamp(vortexP * 1.08));
          const vx = sx * radiusScale * Math.cos(swirlAngle * 0.55);
          const vy = E.lerp(sy, -24 + Math.sin(p.spinPhase * 5) * 145 * (1 - vortexP * 0.6), vortexP);

          ctx.fillStyle = cols[p.hueType];
          ctx.globalAlpha = E.clamp(age / 0.18) * (0.65 + 0.35 * Math.sin(t * 12 + p.spinPhase));
          const sz = p.size * (1 + vortexP * 0.35);
          ctx.beginPath();
          ctx.arc(vx, vy, sz, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }
    }

    // =========================================================================
    // 5. SUPERSONIC AI SHOCKWAVE (`lt = 5.52s -> 7.05s`)
    // =========================================================================
    _renderSupersonicShockwave(ctx, lt, horizonY) {
      const p = E.clamp((lt - 5.52) / 1.45);
      const easeP = 1 - Math.pow(1 - p, 2.4);
      const rx = E.lerp(80, 980, easeP);
      const ry = E.lerp(24, 195, easeP);
      const cy = E.lerp(290, horizonY + 18, E.clamp(p / 0.62));
      const alpha = Math.sin(p * Math.PI) * 0.92;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = '#00f5ff';
      ctx.shadowBlur = 28;
      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = 5.5 * (1 - p * 0.65);
      ctx.beginPath();
      ctx.ellipse(0, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(253, 224, 71, 0.75)';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.ellipse(0, cy, rx * 0.86, ry * 0.86, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // =========================================================================
    // 6. TOWERING LIGHT PILLAR & 3D OCTAHEDRAL SOVEREIGN CORE (0.00px Lock -> S06!)
    // =========================================================================
    _renderSovereignCoreConvergence(ctx, t, lt, vortexP) {
      const pillarP = E.snappyOut(E.clamp((lt - 7.30) / 1.15));
      if (pillarP <= 0.01) return;

      ctx.save();

      // 1) Monumental Vertical Pillar of Cyan-Gold Compute Light (`冲天算力光柱`)
      const pillarW = E.lerp(28, 176, pillarP);
      const pillarG = ctx.createLinearGradient(-pillarW, 0, pillarW, 0);
      pillarG.addColorStop(0, 'rgba(0, 245, 255, 0)');
      pillarG.addColorStop(0.28, `rgba(56, 189, 248, ${0.26 * pillarP})`);
      pillarG.addColorStop(0.50, `rgba(254, 249, 195, ${0.62 * pillarP})`);
      pillarG.addColorStop(0.72, `rgba(168, 85, 247, ${0.28 * pillarP})`);
      pillarG.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.fillStyle = pillarG;
      ctx.fillRect(-pillarW, -380, pillarW * 2, 760);

      // Concentric Energy Pedestal Rings on Ground (`y = 148`)
      const ringAlpha = E.smoothstep(E.clamp((vortexP - 0.25) / 0.65));
      if (ringAlpha > 0.01) {
        [95, 165, 245].forEach((rr, idx) => {
          ctx.strokeStyle = idx === 0
            ? `rgba(253, 224, 71, ${0.75 * ringAlpha})`
            : `rgba(0, 245, 255, ${(0.55 - idx * 0.14) * ringAlpha})`;
          ctx.lineWidth = idx === 0 ? 2.4 : 1.5;
          ctx.beginPath();
          ctx.ellipse(0, 148, rr * ringAlpha, rr * 0.24 * ringAlpha, 0, 0, Math.PI * 2);
          ctx.stroke();
        });
      }

      // 2) Levitating 3D Octahedral Sovereign Prism Core + Neon Halo Crown (`coreP` -> exact lock at `t = 37.80s` for S06!)
      const coreP = E.spring(E.clamp((lt - 7.62) / 1.05), 14, 0.72);
      if (coreP > 0.01) {
        const coreY = E.lerp(68, -24, E.clamp(coreP, 0, 1.08));
        const coreScale = E.clamp(coreP, 0, 1.12);
        this._drawSovereignOctahedronAndCrown(ctx, 0, coreY, coreScale, t * 1.65);
      }

      ctx.restore();
    }

    // Shared High-Craft 3D Octahedral Sovereign Core + Rotating Neon Crown (locks 0.00px into S06!)
    _drawSovereignOctahedronAndCrown(ctx, cx, cy, scale, rotAngle) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);

      // Radial aura behind Sovereign Core
      const aura = ctx.createRadialGradient(0, 0, 8, 0, 0, 135);
      aura.addColorStop(0, 'rgba(254, 240, 138, 0.65)');
      aura.addColorStop(0.45, 'rgba(0, 245, 255, 0.30)');
      aura.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(0, 0, 135, 0, Math.PI * 2);
      ctx.fill();

      // 3D Octahedron Vertices (`top`, `bottom`, and 4 rotating equatorial vertices!)
      const topV = { x: 0, y: -74 };
      const botV = { x: 0, y: 74 };
      const rx = 56;
      const ry = 18;
      const eq = [];
      for (let i = 0; i < 4; i++) {
        const a = rotAngle + (i * Math.PI) / 2;
        eq.push({
          x: Math.cos(a) * rx,
          y: Math.sin(a) * ry,
          z: Math.sin(a)
        });
      }

      // Draw front-facing & translucent crystal facets
      for (let i = 0; i < 4; i++) {
        const p1 = eq[i];
        const p2 = eq[(i + 1) % 4];
        const frontness = (p1.z + p2.z) * 0.5;

        // Upper pyramid facet
        ctx.fillStyle = frontness >= 0
          ? 'rgba(56, 189, 248, 0.42)'
          : 'rgba(30, 41, 59, 0.48)';
        ctx.strokeStyle = frontness >= 0 ? '#e0f2fe' : 'rgba(56, 189, 248, 0.55)';
        ctx.lineWidth = frontness >= 0 ? 2.2 : 1.2;
        ctx.beginPath();
        ctx.moveTo(topV.x, topV.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Lower pyramid facet
        ctx.fillStyle = frontness >= 0
          ? 'rgba(168, 85, 247, 0.38)'
          : 'rgba(15, 23, 42, 0.55)';
        ctx.beginPath();
        ctx.moveTo(botV.x, botV.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // Inner Incandescent Singularity Diamond
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.moveTo(0, -24);
      ctx.lineTo(16, 0);
      ctx.lineTo(0, 24);
      ctx.lineTo(-16, 0);
      ctx.closePath();
      ctx.fill();

      // Rotating Neon-Gold Sovereign Halo Crown hovering above apex (`y = -104`)!
      const crownY = -104;
      ctx.save();
      ctx.shadowColor = '#fde047';
      ctx.shadowBlur = 16;
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.ellipse(0, crownY, 44, 11, 0, 0, Math.PI * 2);
      ctx.stroke();

      // 6 Floating Geometric Crown Spires orbiting along the halo ellipse
      for (let k = 0; k < 6; k++) {
        const ca = -rotAngle * 1.2 + (k * Math.PI) / 3;
        const sx = Math.cos(ca) * 44;
        const sy = crownY + Math.sin(ca) * 11;
        const spireH = 12 + (Math.sin(ca) + 1) * 4.5;
        ctx.fillStyle = k % 2 === 0 ? '#fde047' : '#00f5ff';
        ctx.beginPath();
        ctx.moveTo(sx - 4, sy);
        ctx.lineTo(sx, sy - spireH);
        ctx.lineTo(sx + 4, sy);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      ctx.restore();
    }

    _renderForeground(t, lt, ctx, width, height) {
      // Soft cinema vignette (exact match with S04!)
      const vig = ctx.createRadialGradient(
        width * 0.5, height * 0.5, width * 0.36,
        width * 0.5, height * 0.5, width * 0.80
      );
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(2,4,10,0.50)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, width, height);

      // Voiceover Subtitles (Synced to Yunxi `s05` word boundaries, zero trailing commas, zero meta notes!)
      const subY = height - Math.max(36, height * 0.072);
      const subFont = Math.max(15, Math.round(width * 0.0175));
      ctx.save();
      ctx.font = `600 ${subFont}px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let subText = '';
      let subAlpha = 0;

      if (lt >= 0.08 && lt < 3.38) {
        subText = '还有翻译、配乐、写作、科研……';
        subAlpha = E.smoothstep(E.invLerp(0.08, 0.28, lt)) * (1 - E.smoothstep(E.invLerp(3.16, 3.38, lt)));
      } else if (lt >= 3.42 && lt < 5.42) {
        subText = '曾经苦练几年的技术围墙';
        subAlpha = E.smoothstep(E.invLerp(3.42, 3.64, lt)) * (1 - E.smoothstep(E.invLerp(5.20, 5.42, lt)));
      } else if (lt >= 5.46 && lt < 8.15) {
        subText = '一夜之间，被推平到了地面。';
        subAlpha = E.smoothstep(E.invLerp(5.46, 5.68, lt)) * (1 - E.smoothstep(E.invLerp(7.80, 8.15, lt)));
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

  window.ShotS05Walls = ShotS05Walls;
})();
