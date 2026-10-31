/**
 * SHOT S06 (37.80s - 45.20s): 第三幕 · 全能幻觉过载（“一秒能生成万物，就以为自己无所不能”）
 *
 * Zero-Seam One-Take Continuity:
 *   [37.80s / lt=0.00s] Exact 0.00px lock with S05's Light Pillar + 3D Octahedral Sovereign Core & Neon Halo Crown!
 *   [37.90s - 41.15s]   Yunxi: “于是，我们很容易产生一种错觉”
 *                       Camera tilts into an intoxicating low-angle hero perspective; Sovereign Core & Halo Crown expand
 *                       as sleek floating glassmorphic badges (`✦ 一键生成`, `10x SPEED`, `AUTO MASTER`) bloom outward.
 *   [41.15s - 44.85s]   Yunxi: “一秒能生成万物，就以为自己无所不能。”
 *                       Exponential popup frenzy! 26 layered neon glassmorphic windows (`GOD MODE`, `100x OUTPUT`,
 *                       `一秒生成万物`, `∞ UNLIMITED`, `一键成神`) multiply across 3 depth rings; triple halo crowns spin
 *                       wildly as radial light rays, camera shake & RGB chromatic aberration push to blinding overload!
 *   [44.85s - 45.20s]   A razor-thin cold obsidian-steel needle slices in from the foreground straight into the core's
 *                       incandescent heart at exact `t = 45.20s` -> triggering S07's 2-frame invert flash & shatter!
 */
(function () {
  const E = window.MGEasing;

  class ShotS06Illusion {
    constructor(stage3D) {
      this.stage = stage3D;
      this.startTime = 37.80;
      this.endTime = 45.20;
      this.duration = this.endTime - this.startTime; // 7.40s

      // 26 Exponential Euphoria Glassmorphic Popups arranged from inner gentle ring -> outer overload frenzy!
      const labels = [
        { tag: '✦ 1-CLICK CREATE', main: '一键生成海报', accent: '#00f5ff' },
        { tag: '⚡ 10x OUTPUT', main: '十倍产能狂飙', accent: '#34d399' },
        { tag: '★ AUTO CODE', main: '零基础全栈上线', accent: '#38bdf8' },
        { tag: '✦ INSTANT FILM', main: '一秒自动成片', accent: '#c084fc' },
        { tag: '⚡ 100x EFFICIENCY', main: '百倍效率神话', accent: '#fde047' },
        { tag: '★ MASTER SYMPHONY', main: '大师级交响配乐', accent: '#34d399' },
        { tag: '✦ 10,000 WORDS/S', main: '万字长文秒出', accent: '#fb923c' },
        { tag: '⚡ ZERO BARRIER', main: '彻底无视门槛', accent: '#00f5ff' },
        { tag: '★ GOD MODE · ON', main: '全能造物主模式', accent: '#f43f5e' },
        { tag: '✦ ∞ VARIATIONS', main: '一秒生成万物', accent: '#fde047' },
        { tag: '⚡ 1000x SCALE', main: '批量量产一切', accent: '#a855f7' },
        { tag: '★ OMNIPOTENT', main: '无所不能 · 错觉', accent: '#00f5ff' },
        { tag: '✦ NO SKILL NEEDED', main: '告别十年苦练', accent: '#34d399' },
        { tag: '⚡ AUTO DESIGNER', main: '顶配视觉总监', accent: '#ec4899' },
        { tag: '★ AUTO ARCHITECT', main: '首席系统架构师', accent: '#38bdf8' },
        { tag: '✦ AUTO DIRECTOR', main: '好莱坞级导演', accent: '#fde047' },
        { tag: '⚡ HYPER OUTPUT', main: '日产千张大片', accent: '#00f5ff' },
        { tag: '★ GOD MODE · MAX', main: '掌控所有领域', accent: '#f43f5e' },
        { tag: '✦ INSTANT GENIUS', main: '一键化身天才', accent: '#c084fc' },
        { tag: '⚡ ∞ COMPUTE', main: '算力即全知全能', accent: '#fde047' },
        { tag: '★ ZERO EFFORT', main: '零成本无限复制', accent: '#34d399' },
        { tag: '✦ ULTRA CREATOR', main: '超级个体神话', accent: '#38bdf8' },
        { tag: '⚡ MAX OVERLOAD', main: '全自动印钞流水线', accent: '#fb923c' },
        { tag: '★ OMNISCIENT', main: '无所不知 · 幻象', accent: '#f43f5e' }
      ];

      this.popups = labels.map((item, idx) => {
        // Golden-angle spiral distribution around center `(0, -24)` avoiding direct center occlusion early on
        const goldenAngle = idx * 2.39996 + 0.45;
        const ringFactor = idx < 4 ? 0.52 : (idx < 12 ? 0.78 : 1.04);
        const rx = (235 + (idx % 5) * 48) * ringFactor;
        const ry = (128 + (idx % 4) * 34) * ringFactor;

        // Exponential spawn curve: slow first 4 (`lt = 0.85..2.8s`), then explosive cascade (`lt = 3.25..5.95s`)!
        const spawnLt = idx < 4
          ? 0.85 + idx * 0.52
          : 3.22 + Math.pow((idx - 4) / 20, 1.35) * 2.68;

        return {
          idx,
          spawnLt,
          x: Math.cos(goldenAngle) * rx,
          y: -18 + Math.sin(goldenAngle) * ry,
          scale: idx >= 12 ? 0.86 + (idx % 3) * 0.10 : 0.94,
          tag: item.tag,
          main: item.main,
          accent: item.accent,
          phase: idx * 1.17
        };
      });
    }

    render(t, vecCtx, fgCtx, width, height) {
      const lt = Math.max(0, t - this.startTime); // 0.00 -> 7.40s
      this._updateStage3D(t, lt);

      vecCtx.clearRect(0, 0, width, height);
      fgCtx.clearRect(0, 0, width, height);

      const baseW = 1280;
      const baseH = 720;
      const scaleFit = Math.min(width / baseW, height / baseH);

      // Sub-beat curves synced to Yunxi `s06` (`starts at lt = 0.10s`):
      // - Inflating ego curve (`0.35s -> 6.00s`)
      const inflateP = E.smoothstep(E.clamp((lt - 0.35) / 5.65));
      // - Frenzy overload (`lt = 3.30s -> 6.20s`, right from “一秒能生成万物” -> “无所不能”!)
      const overloadP = Math.pow(E.clamp((lt - 3.30) / 2.90), 1.50);
      // - Hero "1-Second Masterpiece" Card crystallizes & zooms front-and-center (`lt = 5.45s -> 7.40s`),
      //   setting up S07's shocking 1-Take Snap Zoom-Out (`一镜拉远反差`) with 0.00px continuity!
      const heroLockP = E.cinematicInOut(E.clamp((lt - 5.45) / 1.85));

      // Escalating Camera Shake during popup storm -> locks rock-steady onto the "Masterpiece" at `lt = 7.40s`!
      const shakeAmp = overloadP * 9.5 * (1 - heroLockP);
      const shakeX = Math.sin(lt * 67.3) * shakeAmp + Math.cos(lt * 93.1) * shakeAmp * 0.4;
      const shakeY = Math.cos(lt * 74.9) * shakeAmp * 0.85;
      const rawZoom = 1.0 + inflateP * 0.16 + overloadP * 0.12;
      const camZoom = E.lerp(rawZoom, 1.0, heroLockP);

      vecCtx.save();
      vecCtx.translate(width / 2, height / 2);
      vecCtx.scale(scaleFit * camZoom, scaleFit * camZoom);
      vecCtx.translate(shakeX, shakeY);

      // 1) Deep Space Backdrop + Escalating Overload God-Rays (`lt = 0.00s` matches S05 end 0.00px!)
      this._renderBackdropAndGodRays(vecCtx, t, lt, inflateP, overloadP, heroLockP);

      // 2) Perspective Floor Grid & Expanding Altar Pedestal Rings (`lt = 0.00s` matches S05 end 0.00px!)
      if (heroLockP < 0.98) {
        vecCtx.save();
        vecCtx.globalAlpha = 1 - heroLockP;
        this._renderGridAndAltar(vecCtx, t, lt, inflateP, overloadP);
        vecCtx.restore();
      }

      // 3) Back-Layer Glassmorphic Euphoria Popups (`idx >= 10`)
      if (heroLockP < 0.98) {
        vecCtx.save();
        vecCtx.globalAlpha = 1 - E.smoothstep(E.clamp((heroLockP - 0.15) / 0.75));
        this._renderPopupBatch(vecCtx, t, lt, overloadP, 10, this.popups.length);
        vecCtx.restore();
      }

      // 4) Inflating Towering Light Pillar + Over-Sized 3D Sovereign Core & Triple Neon Crown!
      if (heroLockP < 0.96) {
        vecCtx.save();
        vecCtx.globalAlpha = 1 - E.smoothstep(E.clamp((heroLockP - 0.10) / 0.72));
        this._renderInflatingSovereignCore(vecCtx, t, lt, inflateP, overloadP);
        vecCtx.restore();
      }

      // 5) Front-Layer Glassmorphic Euphoria Popups (`idx 0..9`)
      if (heroLockP < 0.96) {
        vecCtx.save();
        vecCtx.globalAlpha = 1 - E.smoothstep(E.clamp((heroLockP - 0.20) / 0.72));
        this._renderPopupBatch(vecCtx, t, lt, overloadP, 0, 10);
        vecCtx.restore();
      }

      // 6) Chromatic Aberration Overload Rings
      if (overloadP > 0.25 && heroLockP < 0.95) {
        this._renderOverloadChromaticFringe(vecCtx, t, overloadP * (1 - heroLockP));
      }

      // 7) Dazzling Full-Color "AI Masterpiece" Hero Poster (`lt >= 5.45s` -> locks 0.00px with S07 center tile!)
      if (heroLockP > 0.01) {
        this._renderHeroMasterpieceLock(vecCtx, t, heroLockP);
      }

      vecCtx.restore();

      // Foreground Cinema Vignette, Overload Bloom & Pure Documentary Voiceover Subtitles
      this._renderForeground(t, lt, overloadP, heroLockP, fgCtx, width, height);
    }

    _updateStage3D(t, lt) {
      const overloadP = Math.pow(E.clamp((lt - 3.30) / 3.75), 1.65);
      // Matches S05 end (`z = 8.0`) at `lt = 0`, then pushes dramatically closer into core!
      const zPos = E.lerp(8.0, 4.6, E.smoothstep(E.clamp(lt / 6.8)));
      this.stage.camera.position.set(
        Math.sin(t * 2.2) * 0.22 * overloadP,
        -0.35 * E.smoothstep(E.clamp(lt / 3.5)),
        zPos
      );
      this.stage.camera.lookAt(0, 0.15 * overloadP, 0);
      this.stage.renderer.render(this.stage.scene, this.stage.camera);
    }

    // =========================================================================
    // 1. BACKDROP & ESCALATING NEON GOD-RAYS
    // =========================================================================
    _renderBackdropAndGodRays(ctx, t, lt, inflateP, overloadP, heroLockP = 0) {
      // Exact S05 end backdrop gradient at `lt = 0`, settling to `#090c14` gallery dark at `heroLockP = 1`
      const deepBg = ctx.createLinearGradient(0, -380, 0, 380);
      deepBg.addColorStop(0, heroLockP > 0.5 ? '#090c14' : '#040814');
      deepBg.addColorStop(0.48, heroLockP > 0.5 ? '#0d121f' : (overloadP > 0.4 ? '#160b2e' : '#08142c'));
      deepBg.addColorStop(0.55, heroLockP > 0.5 ? '#0d121f' : (overloadP > 0.4 ? '#1e0936' : '#0b1936'));
      deepBg.addColorStop(1, '#06080f');
      ctx.fillStyle = deepBg;
      ctx.fillRect(-740, -440, 1480, 880);

      // Exact S05 end atmospheric glow at `lt = 0` (`alpha = 0.75`), intensifying into neon magenta/gold overload!
      ctx.save();
      ctx.globalAlpha = (0.75 + overloadP * 0.25) * (1 - heroLockP * 0.55);
      const glowG = ctx.createRadialGradient(0, 0, 10, 0, 0, 540 + overloadP * 180);
      glowG.addColorStop(0, overloadP > 0.35 ? 'rgba(253, 224, 71, 0.58)' : 'rgba(56, 189, 248, 0.42)');
      glowG.addColorStop(0.45, overloadP > 0.35 ? 'rgba(236, 72, 153, 0.32)' : 'rgba(168, 85, 247, 0.18)');
      glowG.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowG;
      ctx.fillRect(-720, -420, 1440, 840);
      ctx.restore();

      // Rotating Volumetric radial God-Rays behind Sovereign Core as illusion inflates!
      if (inflateP > 0.08) {
        ctx.save();
        ctx.translate(0, -24);
        const rayAlpha = (inflateP * 0.16 + overloadP * 0.28);
        const rayCount = 16;
        for (let i = 0; i < rayCount; i++) {
          const a = t * (0.45 + overloadP * 0.9) + (i * Math.PI * 2) / rayCount;
          ctx.fillStyle = i % 2 === 0
            ? `rgba(0, 245, 255, ${rayAlpha})`
            : `rgba(253, 224, 71, ${rayAlpha * 0.85})`;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a - 0.055) * 780, Math.sin(a - 0.055) * 780);
          ctx.lineTo(Math.cos(a + 0.055) * 780, Math.sin(a + 0.055) * 780);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }
    }

    // =========================================================================
    // 2. PERSPECTIVE FLOOR GRID & ALTAR PEDESTAL (0.00px Lock with S05 End!)
    // =========================================================================
    _renderGridAndAltar(ctx, t, lt, inflateP, overloadP) {
      // Low-angle camera drop shifts horizon downward (`0 -> +92`) to make Core tower overhead!
      const horizonY = inflateP * 92;
      const bottomY = 367.64 + inflateP * 40;

      // Floor Grid (`lt = 0`: `alpha = 0.264`, `lineWidth = 1.8`, `i = -9..9` from `i*36.36*0.35` to `i*238.36`)
      ctx.save();
      const floorAlpha = 0.264 + overloadP * 0.28;
      ctx.strokeStyle = overloadP > 0.5
        ? `rgba(244, 114, 182, ${floorAlpha})`
        : `rgba(0, 245, 255, ${floorAlpha})`;
      ctx.lineWidth = 1.8;

      for (let i = -9; i <= 9; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 36.36 * 0.35, horizonY);
        ctx.lineTo(i * 238.36, bottomY);
        ctx.stroke();
      }

      const roadScroll = (t * (11.4 + overloadP * 14.0)) % 1;
      for (let r = 0; r < 5; r++) {
        const ry = horizonY + Math.pow(((r + roadScroll) / 5), 1.85) * (bottomY - horizonY);
        ctx.beginPath();
        ctx.moveTo(-720, ry);
        ctx.lineTo(720, ry);
        ctx.stroke();
      }
      ctx.restore();

      // Concentric Energy Pedestal Rings (`y = 148` at `lt = 0`, exact match with S05 end!)
      const altarY = 148 + inflateP * 54;
      const pulse = 1 + Math.sin(t * 14) * 0.05 * overloadP;
      [95, 165, 245].forEach((rr, idx) => {
        ctx.strokeStyle = idx === 0
          ? 'rgba(253, 224, 71, 0.75)'
          : `rgba(0, 245, 255, ${0.55 - idx * 0.14 + overloadP * 0.2})`;
        ctx.lineWidth = idx === 0 ? 2.4 : 1.6;
        ctx.beginPath();
        ctx.ellipse(0, altarY, rr * (1 + inflateP * 0.35) * pulse, rr * 0.24 * (1 + inflateP * 0.2), 0, 0, Math.PI * 2);
        ctx.stroke();
      });
    }

    // =========================================================================
    // 3. INFLATING LIGHT PILLAR, 3D SOVEREIGN CORE & MULTI-HALO CROWN
    // =========================================================================
    _renderInflatingSovereignCore(ctx, t, lt, inflateP, overloadP) {
      ctx.save();

      // Vertical Pillar of Light (`pillarW = 176` at `lt = 0` -> swells to `310` in overload!)
      const pillarW = 176 + inflateP * 54 + overloadP * 85;
      const pillarG = ctx.createLinearGradient(-pillarW, 0, pillarW, 0);
      pillarG.addColorStop(0, 'rgba(0, 245, 255, 0)');
      pillarG.addColorStop(0.28, `rgba(56, 189, 248, ${0.26 + overloadP * 0.22})`);
      pillarG.addColorStop(0.50, `rgba(254, 249, 195, ${0.62 + overloadP * 0.32})`);
      pillarG.addColorStop(0.72, `rgba(236, 72, 153, ${0.28 + overloadP * 0.28})`);
      pillarG.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.fillStyle = pillarG;
      ctx.fillRect(-pillarW, -440, pillarW * 2, 880);

      // Core scale & spin nonlinearly inflate (`scale = 1.0` at `lt = 0` -> `1.92` at climax!)
      const coreScale = 1.0 + inflateP * 0.45 + overloadP * 0.48 + Math.sin(t * 22) * 0.035 * overloadP;
      const coreY = -24 + inflateP * 10;
      // Phase-continuous rotation (`t * 1.65` at `lt = 0` matches S05 end 100%!)
      const rotAngle = t * 1.65 + Math.pow(lt, 2.2) * 0.26;

      ctx.save();
      ctx.translate(0, coreY);
      ctx.scale(coreScale, coreScale);

      // Radial Core Aura
      const aura = ctx.createRadialGradient(0, 0, 8, 0, 0, 135 + overloadP * 40);
      aura.addColorStop(0, 'rgba(254, 240, 138, 0.78)');
      aura.addColorStop(0.45, overloadP > 0.4 ? 'rgba(244, 63, 94, 0.42)' : 'rgba(0, 245, 255, 0.30)');
      aura.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(0, 0, 155, 0, Math.PI * 2);
      ctx.fill();

      // 3D Octahedron Facets
      const topV = { x: 0, y: -74 };
      const botV = { x: 0, y: 74 };
      const eq = [];
      for (let i = 0; i < 4; i++) {
        const a = rotAngle + (i * Math.PI) / 2;
        eq.push({ x: Math.cos(a) * 56, y: Math.sin(a) * 18, z: Math.sin(a) });
      }

      for (let i = 0; i < 4; i++) {
        const p1 = eq[i];
        const p2 = eq[(i + 1) % 4];
        const frontness = (p1.z + p2.z) * 0.5;

        ctx.fillStyle = frontness >= 0
          ? (overloadP > 0.5 ? 'rgba(251, 113, 133, 0.48)' : 'rgba(56, 189, 248, 0.42)')
          : 'rgba(30, 41, 59, 0.48)';
        ctx.strokeStyle = frontness >= 0 ? '#ffffff' : 'rgba(56, 189, 248, 0.55)';
        ctx.lineWidth = frontness >= 0 ? 2.2 : 1.2;

        ctx.beginPath();
        ctx.moveTo(topV.x, topV.y); ctx.lineTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = frontness >= 0
          ? 'rgba(168, 85, 247, 0.44)'
          : 'rgba(15, 23, 42, 0.55)';
        ctx.beginPath();
        ctx.moveTo(botV.x, botV.y); ctx.lineTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
      }

      // Inner Incandescent Singularity Heart (target of the cold steel needle!)
      const heartPulse = 1 + overloadP * 0.42;
      ctx.fillStyle = overloadP > 0.6 ? '#ffffff' : '#fef08a';
      ctx.shadowColor = '#fde047';
      ctx.shadowBlur = 24 * overloadP;
      ctx.beginPath();
      ctx.moveTo(0, -24 * heartPulse);
      ctx.lineTo(16 * heartPulse, 0);
      ctx.lineTo(0, 24 * heartPulse);
      ctx.lineTo(-16 * heartPulse, 0);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      // Primary Golden-Neon Sovereign Halo Crown (`y = -104`, exact match with S05 at `lt = 0`!)
      const crownY = -104 - inflateP * 8;
      ctx.save();
      ctx.shadowColor = '#fde047';
      ctx.shadowBlur = 16 + overloadP * 14;
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(0, crownY, 44 + inflateP * 14, 11 + inflateP * 3, 0, 0, Math.PI * 2);
      ctx.stroke();

      const crownRx = 44 + inflateP * 14;
      const crownRy = 11 + inflateP * 3;
      for (let k = 0; k < 6; k++) {
        const ca = -rotAngle * 1.2 + (k * Math.PI) / 3;
        const sx = Math.cos(ca) * crownRx;
        const sy = crownY + Math.sin(ca) * crownRy;
        const spireH = (12 + (Math.sin(ca) + 1) * 4.5) * (1 + inflateP * 0.45);
        ctx.fillStyle = k % 2 === 0 ? '#fde047' : '#00f5ff';
        ctx.beginPath();
        ctx.moveTo(sx - 4.5, sy);
        ctx.lineTo(sx, sy - spireH);
        ctx.lineTo(sx + 4.5, sy);
        ctx.closePath();
        ctx.fill();
      }

      // Secondary Exaggerated Outer "Omnipotence" Halo Ring (`blooms during overload!`)
      if (inflateP > 0.25) {
        const outerAlpha = E.clamp((inflateP - 0.25) / 0.45);
        ctx.globalAlpha = outerAlpha;
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.ellipse(0, crownY - 12, crownRx * 1.55, crownRy * 1.45, 0.14 * Math.sin(t * 4), 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      ctx.restore();
      ctx.restore();
    }

    // =========================================================================
    // 4. EXPONENTIAL GLASSMORPHIC POPUP FRENZY (`100x / GOD MODE / 一秒生成万物`)
    // =========================================================================
    _renderPopupBatch(ctx, t, lt, overloadP, startIdx, endIdx) {
      for (let i = startIdx; i < endIdx; i++) {
        const p = this.popups[i];
        const age = lt - p.spawnLt;
        if (age <= 0) continue;

        const popScale = E.spring(E.clamp(age / 0.36), 16, 0.62) * p.scale;
        if (popScale <= 0.02) continue;

        const floatY = Math.sin(t * 3.8 + p.phase) * 6;
        const jitterX = overloadP > 0.45 ? Math.sin(t * 48 + p.idx) * 3.2 * overloadP : 0;

        ctx.save();
        ctx.translate(p.x + jitterX, p.y + floatY);
        ctx.scale(popScale, popScale);

        // Auto-measure text so zero labels ever overflow their glass card!
        ctx.font = '800 15px "PingFang SC", "Inter", sans-serif';
        const mainW = ctx.measureText(p.main).width;
        ctx.font = '700 10.5px "JetBrains Mono", monospace';
        const tagW = ctx.measureText(p.tag).width;
        const cw = Math.max(158, Math.ceil(Math.max(mainW, tagW)) + 34);
        const ch = 64;

        ctx.shadowColor = p.accent;
        ctx.shadowBlur = 14 + overloadP * 10;
        ctx.fillStyle = 'rgba(10, 16, 34, 0.88)';
        ctx.strokeStyle = p.accent;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.roundRect(-cw / 2, -ch / 2, cw, ch, 12);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Top Neon Tag
        ctx.font = '700 10.5px "JetBrains Mono", monospace';
        ctx.fillStyle = p.accent;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.tag, -cw / 2 + 14, -ch / 2 + 18);

        // Main Euphoria Headline
        ctx.font = '800 15px "PingFang SC", "Inter", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(p.main, -cw / 2 + 14, -ch / 2 + 43);

        ctx.restore();
      }
    }

    // =========================================================================
    // 5. HERO "1-SECOND MASTERPIECE" POSTER LOCK (0.00px Handoff into S07 Zoom-Out!)
    // =========================================================================
    _renderOverloadChromaticFringe(ctx, t, overloadP) {
      const alpha = Math.max(0, (overloadP - 0.25) * 0.50);
      if (alpha <= 0.01) return;
      const shift = overloadP * 9;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 2.5;

      ctx.strokeStyle = '#00f5ff';
      ctx.strokeRect(-610 - shift, -335, 1220, 670);

      ctx.strokeStyle = '#f43f5e';
      ctx.strokeRect(-610 + shift, -335, 1220, 670);
      ctx.restore();
    }

    _renderHeroMasterpieceLock(ctx, t, heroLockP) {
      // Scales smoothly up to `scale = 3.00` at `(0, 0)` (`166*3 = 498px` wide x `222*3 = 666px` tall),
      // looking like a breathtaking flagship key-visual masterpiece right before S07's 5x Snap Zoom-Out!
      const s = E.lerp(0.85, 3.00, heroLockP);
      ctx.save();
      ctx.globalAlpha = E.smoothstep(E.clamp(heroLockP / 0.38));
      this.drawMasterpiecePoster(ctx, 0, 0, s, 0.0, '未来先锋视觉大赏', '✦ AI MASTERPIECE · 01s', true);
      ctx.restore();
    }

    // Shared High-Craft Editorial Key-Visual Poster (`desat = 0` dazzling neon -> `desat = 1` stark platinum monochrome!)
    drawMasterpiecePoster(ctx, cx, cy, scale, desat, title, topTag, showGlow = false) {
      const w = 166;
      const h = 222;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);

      if (showGlow && desat < 0.8) {
        ctx.shadowColor = `rgba(0, 245, 255, ${(1 - desat) * 0.45})`;
        ctx.shadowBlur = 28;
      }

      // Deep Studio Card Base (`#0c1224` rich indigo -> `#12161f` crisp monochrome slate)
      ctx.fillStyle = desat > 0.5 ? '#12161f' : '#0c1224';
      ctx.strokeStyle = desat > 0.5
        ? 'rgba(226, 232, 240, 0.52)'
        : 'rgba(56, 189, 248, 0.78)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, 12);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(-w / 2 + 1, -h / 2 + 1, w - 2, h - 2, 11);
      ctx.clip();

      // Atmospheric Studio Backlight Arch inside Poster
      const archG = ctx.createRadialGradient(0, -16, 6, 0, -16, 86);
      if (desat < 0.99) {
        archG.addColorStop(0, `rgba(244, 63, 94, ${0.46 * (1 - desat) + 0.18 * desat})`);
        archG.addColorStop(0.52, `rgba(56, 189, 248, ${0.32 * (1 - desat) + 0.10 * desat})`);
        archG.addColorStop(1, 'rgba(15, 23, 42, 0)');
      } else {
        archG.addColorStop(0, 'rgba(226, 232, 240, 0.20)');
        archG.addColorStop(0.55, 'rgba(148, 163, 184, 0.08)');
        archG.addColorStop(1, 'rgba(15, 23, 42, 0)');
      }
      ctx.fillStyle = archG;
      ctx.fillRect(-w / 2, -h / 2, w, h);

      // Architectural Framing Arch + Fine Editorial Crosshairs
      ctx.strokeStyle = desat > 0.5 ? 'rgba(203, 213, 225, 0.28)' : 'rgba(125, 211, 252, 0.34)';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.arc(0, -16, 52, Math.PI, 0);
      ctx.lineTo(52, 54);
      ctx.lineTo(-52, 54);
      ctx.closePath();
      ctx.stroke();

      // Centerpiece 3D Sculpted Mobius Torus Ring + Levitating Specular Sphere!
      ctx.save();
      ctx.translate(0, -14);
      ctx.rotate(-0.38);

      // Outer 3D Iridescent / Platinum Torus Ring
      const torusG = ctx.createLinearGradient(-48, -22, 48, 22);
      if (desat < 0.5) {
        torusG.addColorStop(0, '#00f5ff');
        torusG.addColorStop(0.48, '#fde047');
        torusG.addColorStop(1, '#f43f5e');
      } else {
        torusG.addColorStop(0, '#f8fafc');
        torusG.addColorStop(0.5, '#94a3b8');
        torusG.addColorStop(1, '#475569');
      }
      ctx.strokeStyle = torusG;
      ctx.lineWidth = 11;
      ctx.beginPath();
      ctx.ellipse(0, 0, 44, 19, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Crisp inner rim highlight on torus
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.ellipse(0, -1.5, 44, 19, 0, Math.PI * 1.1, Math.PI * 1.95);
      ctx.stroke();
      ctx.restore();

      // Levitating Chrome / Pearl Center Sphere overlapping Torus
      const spG = ctx.createRadialGradient(-7, -22, 2, 0, -14, 21);
      spG.addColorStop(0, '#ffffff');
      spG.addColorStop(0.45, desat < 0.5 ? '#38bdf8' : '#cbd5e1');
      spG.addColorStop(1, desat < 0.5 ? '#1e1b4b' : '#1e293b');
      ctx.fillStyle = spG;
      ctx.beginPath();
      ctx.arc(0, -14, 20, 0, Math.PI * 2);
      ctx.fill();

      // Top Micro Editorial Metadata Header
      ctx.font = '700 8.5px "JetBrains Mono", monospace';
      ctx.fillStyle = desat > 0.5 ? '#94a3b8' : '#7dd3fc';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(topTag, 0, -92);

      // Bold High-Contrast Poster Title + Minimalist Sub-Bar at Bottom
      ctx.font = '800 13.5px "PingFang SC", "Inter", sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(title, 0, 74);

      ctx.fillStyle = desat > 0.5 ? 'rgba(148, 163, 184, 0.55)' : 'rgba(253, 224, 71, 0.80)';
      ctx.fillRect(-34, 91, 68, 3);

      ctx.restore();
      ctx.restore();
    }

    _renderForeground(t, lt, overloadP, heroLockP, ctx, width, height) {
      // Subtle edge bloom during overload climax
      if (overloadP > 0.35 && heroLockP < 0.95) {
        const glare = ctx.createRadialGradient(
          width * 0.5, height * 0.48, 40,
          width * 0.5, height * 0.48, width * (0.65 + heroLockP * 0.1)
        );
        glare.addColorStop(0, `rgba(255, 255, 255, ${(overloadP - 0.35) * 0.16 * (1 - heroLockP)})`);
        glare.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glare;
        ctx.fillRect(0, 0, width, height);
      }

      // Soft cinema vignette
      const vig = ctx.createRadialGradient(
        width * 0.5, height * 0.5, width * 0.36,
        width * 0.5, height * 0.5, width * 0.80
      );
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(2,4,10,0.50)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, width, height);

      // Voiceover Subtitles (Synced to Yunxi `s06` word boundaries, zero trailing commas, zero meta notes!)
      const subY = height - Math.max(36, height * 0.072);
      const subFont = Math.max(15, Math.round(width * 0.0175));
      ctx.save();
      ctx.font = `600 ${subFont}px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let subText = '';
      let subAlpha = 0;

      if (lt >= 0.08 && lt < 3.25) {
        subText = '于是，我们很容易产生一种错觉';
        subAlpha = E.smoothstep(E.invLerp(0.08, 0.28, lt)) * (1 - E.smoothstep(E.invLerp(3.02, 3.25, lt)));
      } else if (lt >= 3.30 && lt < 6.95) {
        subText = '一秒能生成万物，就以为自己无所不能。';
        subAlpha = E.smoothstep(E.invLerp(3.30, 3.52, lt)) * (1 - E.smoothstep(E.invLerp(6.65, 6.95, lt)));
      }

      if (subAlpha > 0.01 && subText) {
        const padX = 24;
        const pillH = Math.round(subFont * 1.95);
        const pillW = Math.ceil(ctx.measureText(subText).width) + padX * 2;
        ctx.globalAlpha = subAlpha;
        ctx.fillStyle = 'rgba(4, 8, 18, 0.70)';
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

  window.ShotS06Illusion = ShotS06Illusion;
})();
