/**
 * SHOT S02 (05.20s - 11.20s): 第二幕 · 改变了设计 -> 无缝 3D 翻转进入 S03 编程宇宙
 *
 * Sub-pixel 0.00px continuity handoff from S01 at t = 5.20s!
 *   [5.20 - 6.95s] Camera pulls back on the infinite Figma artboard: Row 1 aligns & Row 2 springs in -> 10 Rich Design Showcases!
 *   [6.85 - 8.95s] Live AI Prompt wave sweeps diagonally across all 10 cards, dynamically morphing lighting, palettes & motion!
 *   [8.95 - 11.20s] Seamless Match-Cut (S02 -> S03): Camera zooms onto Center Hero iPhone UI, toggles `[</> Dev Mode]`,
 *                   highlights `<HeroChart />` component bounds, and 3D-flips 180° directly into the full-screen S03 Code IDE!
 */
(function () {
  const E = window.MGEasing;

  class ShotS02Design {
    constructor(stage3D, shotS01) {
      this.stage = stage3D;
      this.s01 = shotS01;
      this.startTime = 5.20;
      this.endTime = 13.00;
      this.duration = this.endTime - this.startTime; // 7.80s (synced to Yunxi s02 voiceover!)

      this.cards = [
        // Row 1 (Exact match with S01's 5 fanned-out cards at t = 5.20s!)
        { id: 1, row: 0, col: 0, s01X: -446, s01Y: 54, s01Rot: -0.055, s01Scale: 0.94, kind: 'logo', label: '01 · 品牌标志 VI' },
        { id: 2, row: 0, col: 1, s01X: -226, s01Y: 38, s01Rot: -0.025, s01Scale: 0.94, kind: 'poster3d', label: '02 · 3D 视觉海报' },
        { id: 3, row: 0, col: 2, s01X: 0,    s01Y: 28, s01Rot: 0.0,    s01Scale: 1.08, kind: 'iphone', label: '✦ 03 · 交互界面 UI', hero: true },
        { id: 4, row: 0, col: 3, s01X: 226,  s01Y: 38, s01Rot: 0.025,  s01Scale: 0.94, kind: 'product', label: '04 · 商业产品主图' },
        { id: 5, row: 0, col: 4, s01X: 446,  s01Y: 54, s01Rot: 0.055,  s01Scale: 0.94, kind: 'editorial', label: '05 · 插画书籍封面' },

        // Row 2 (5 Brand-New High-Aesthetic Design Domains -> Total 10 Possibilities!)
        { id: 6, row: 1, col: 0, kind: 'watch',     label: '06 · 智能表盘设计' },
        { id: 7, row: 1, col: 1, kind: 'supercar',  label: '07 · 工业流线光影' },
        { id: 8, row: 1, col: 2, kind: 'arch',      label: '08 · 空间建筑渲染' },
        { id: 9, row: 1, col: 3, kind: 'vinyl',     label: '09 · 黑胶音乐包装' },
        { id: 10, row: 1, col: 4, kind: 'dataviz',  label: '10 · 数据大屏设计' }
      ];
    }

    render(t, vecCtx, fgCtx, width, height) {
      const lt = Math.max(0, t - this.startTime); // 0.00 -> 6.00s

      // Update subtle 3D depth backdrop
      this._updateStageBackdrop(t, lt);

      vecCtx.clearRect(0, 0, width, height);
      fgCtx.clearRect(0, 0, width, height);

      const baseW = 1280;
      const baseH = 720;
      const scaleFit = Math.min(width / baseW, height / baseH);

      // Phase timings in local time `lt` (0.00 -> 7.80s, synced word-for-word to Yunxi!)
      // 1) Grid Pull-Back & 10-Card Layout: lt = 0.00 -> 1.25s (“它改变了设计——熬几个通宵打磨的草图与光影，”)
      const gridExpandP = E.cinematicInOut(E.clamp(lt / 1.25));

      // 2) Diagonal AI Prism Restyle Wave: lt = 3.92 -> 5.95s (“现在一句话，就能铺开十种视觉可能。”)
      const waveProgress = E.invLerp(3.92, 5.95, lt);

      // 3) Zoom into Hero Card #03 & 180° 3D Dev-Mode Flip into S03 Code IDE: lt = 5.85 -> 7.80s
      const focusHeroP = E.cinematicInOut(E.clamp((lt - 5.85) / 1.05));
      // 3D Flip angle: 0 -> PI (90 deg edge-on right at lt = 6.82s => t = 12.02s!)
      const flipP = E.cinematicInOut(E.clamp((lt - 6.30) / 1.04));
      const flipAngle = flipP * Math.PI;
      const isCodeBackface = flipAngle >= Math.PI * 0.5;

      // =========================================================================
      // CONTINUOUS CAMERA RIG FOR S02 (Zero static frames!)
      // =========================================================================
      let camZoom = E.lerp(1.0, 0.82, gridExpandP);
      let camX = Math.sin(lt * 1.1) * 5 * gridExpandP * (1 - focusHeroP);
      let camY = E.lerp(0, 18, gridExpandP);

      if (focusHeroP > 0) {
        const heroTargetY = -112 * (1 - flipP);
        camY = E.lerp(camY, heroTargetY, focusHeroP);
        const midZoom = E.lerp(0.82, 2.15, focusHeroP);
        const ideSettle = E.snappyOut(E.clamp((lt - 6.82) / 0.88));
        camZoom = isCodeBackface ? E.lerp(2.15, 1.0, ideSettle) : midZoom;
      }

      // Dark Design Studio / Code Studio Canvas Backdrop
      vecCtx.fillStyle = isCodeBackface ? '#060a14' : '#080d1a';
      vecCtx.fillRect(0, 0, width, height);

      vecCtx.save();
      vecCtx.translate(width / 2, height / 2);
      vecCtx.scale(scaleFit * camZoom, scaleFit * camZoom);
      vecCtx.translate(-camX, -camY);

      // Infinite Figma Architectural Grid (fades cleanly when flipped to S03 Code IDE)
      if (!isCodeBackface) {
        this._drawInfiniteArtboardGrid(vecCtx, gridExpandP, focusHeroP);
      }

      // =========================================================================
      // FRONT WORLD (Before 90° Flip): 10 DESIGN SHOWCASES + AI RESTYLE WAVE
      // =========================================================================
      if (!isCodeBackface) {
        const otherFade = 1 - E.smoothstep(E.clamp((lt - 5.95) / 0.65));

        // Smart Figma pink spacing guides between cards during grid snap
        if (gridExpandP > 0.25 && otherFade > 0.1) {
          this._drawFigmaSmartGuides(vecCtx, gridExpandP, otherFade);
        }

        // Draw non-hero cards (1,2,4,5 and 6..10) first, then Hero Card #03 last on top!
        const drawOrder = [0, 4, 1, 3, 5, 9, 6, 8, 7, 2];
        for (let k = 0; k < drawOrder.length; k++) {
          const card = this.cards[drawOrder[k]];
          if (!card.hero && otherFade <= 0.01) continue;
          this._renderDesignShowcaseItem(vecCtx, card, t, lt, gridExpandP, waveProgress, focusHeroP, flipAngle, otherFade);
        }

        // Diagonal Prismatic AI Lighting/Palette Wave & Multiplayer AI Cursor
        if (waveProgress > 0.01 && waveProgress < 0.99 && otherFade > 0.2) {
          this._drawAIPrismWaveAndCursor(vecCtx, waveProgress, otherFade);
        }

        // Top Floating AI Prompt Bar (matches S01 position at lt=0, updates prompt live!)
        if (otherFade > 0.02) {
          this._drawTopDesignPromptBar(vecCtx, lt, gridExpandP, waveProgress, otherFade);
        }
      } else {
        // =========================================================================
        // BACK WORLD (Past 90° Flip -> 180°): SEAMLESS UNFOLD INTO S03 CODE IDE!
        // =========================================================================
        this._renderS03CodeBackfaceUnfold(vecCtx, t, lt, flipAngle);
      }

      vecCtx.restore();

      // Edge-on Emerald/Cyan Energy Flash right at 90° flip (lt ≈ 4.92s) + Vignette + Subtitle
      this._renderForeground(t, lt, flipAngle, fgCtx, width, height);
    }

    _updateStageBackdrop(t, lt) {
      this.stage.camera.position.set(Math.sin(t * 0.6) * 0.4, Math.cos(t * 0.5) * 0.3, 12.5);
      this.stage.camera.lookAt(0, 0, 0);
      this.stage.renderer.render(this.stage.scene, this.stage.camera);
    }

    _drawInfiniteArtboardGrid(ctx, gridExpandP, focusHeroP) {
      ctx.save();
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.13 - focusHeroP * 0.06})`;
      ctx.lineWidth = 1.4;
      const spanX = 960;
      const spanY = 620;
      for (let gx = -spanX; gx <= spanX; gx += 64) {
        ctx.beginPath(); ctx.moveTo(gx, -spanY); ctx.lineTo(gx, spanY); ctx.stroke();
      }
      for (let gy = -spanY; gy <= spanY; gy += 64) {
        ctx.beginPath(); ctx.moveTo(-spanX, gy); ctx.lineTo(spanX, gy); ctx.stroke();
      }
      ctx.restore();
    }

    _drawFigmaSmartGuides(ctx, gridExpandP, fade) {
      const gAlpha = Math.sin(E.clamp((gridExpandP - 0.25) / 0.75) * Math.PI) * 0.45 * fade;
      if (gAlpha <= 0.02) return;
      ctx.save();
      ctx.strokeStyle = `rgba(244, 63, 94, ${gAlpha})`;
      ctx.lineWidth = 1.3;
      ctx.setLineDash([4, 4]);
      // Horizontal alignment guide between Row 1 and Row 2
      ctx.beginPath();
      ctx.moveTo(-620, 48);
      ctx.lineTo(620, 48);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    _drawTopDesignPromptBar(ctx, lt, gridExpandP, waveProgress, fade) {
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.font = '600 22px "PingFang SC", "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const txtA = '✦  一句话生成：品牌 VI · 3D 海报 · App UI · 产品主图 · 插画封面';
      const txtB = '✦  一句话铺开十套视觉：品牌 VI · 3D 海报 · App UI · 智能表盘 · 超跑 · 大屏';
      const txtC = '✦  AI 实时重塑光影与配色 —— 十套视觉方案毫秒级同步演进';

      const wA = Math.ceil(ctx.measureText(txtA).width) + 72;
      const wB = Math.ceil(ctx.measureText(txtB).width) + 72;
      const wC = Math.ceil(ctx.measureText(txtC).width) + 72;

      let activeTxt = txtA;
      let textColor = '#e0f2fe';
      let smoothW = wA;

      if (lt < 0.28) {
        activeTxt = txtA;
        smoothW = E.lerp(wA, wB, E.snappyOut(E.clamp((lt - 0.04) / 0.24)));
      } else if (lt < 3.88) {
        activeTxt = txtB;
        smoothW = wB;
      } else {
        activeTxt = txtC;
        textColor = '#fde68a';
        smoothW = E.lerp(wB, wC, E.snappyOut(E.clamp((lt - 3.88) / 0.32)));
      }

      const activeMinW = Math.ceil(ctx.measureText(activeTxt).width) + 72;
      const barW = Math.max(smoothW, activeMinW);
      const barY = E.lerp(-262, -356, gridExpandP);
      const bx = -barW / 2;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
      ctx.strokeStyle = waveProgress > 0.05 && waveProgress < 0.95
        ? 'rgba(251, 191, 36, 0.85)'
        : 'rgba(56, 224, 255, 0.65)';
      ctx.lineWidth = 2.2;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.roundRect(bx, barY, barW, 56, 28);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = textColor;
      ctx.fillText(activeTxt, 0, barY + 28);

      ctx.restore();
    }

    _renderDesignShowcaseItem(ctx, card, t, lt, gridExpandP, waveProgress, focusHeroP, flipAngle, otherFade) {
      // Target grid coordinates in panoramic 2x5 layout
      const colX = (card.col - 2) * 256; // [-512, -256, 0, +256, +512]
      const rowY = card.row === 0 ? -112 : 204;

      let x, y, rot, scale, alpha = 1;

      if (card.row === 0) {
        // Exact sub-pixel interpolation from S01's t=5.20s positions!
        x = E.lerp(card.s01X, colX, gridExpandP);
        y = E.lerp(card.s01Y, rowY, gridExpandP);
        rot = E.lerp(card.s01Rot, 0, gridExpandP);
        scale = E.lerp(card.s01Scale, card.hero ? 0.96 : 0.88, gridExpandP);
      } else {
        // Row 2 springs up into place cleanly as camera pulls back!
        const r2Delay = 0.16 + card.col * 0.065;
        const r2Spring = E.spring(E.clamp((lt - r2Delay) / 0.62), 14, 0.68);
        if (r2Spring <= 0.01) return;
        x = colX;
        y = rowY + (1 - r2Spring) * 110;
        rot = (1 - r2Spring) * (card.col - 2) * 0.03;
        scale = 0.88 * E.clamp(r2Spring, 0, 1.04);
        alpha = E.clamp((lt - r2Delay) / 0.20);
      }

      // Push non-hero cards radially outward during S02 -> S03 Hero Focus
      if (!card.hero) {
        x += (card.col - 2) * 90 * focusHeroP;
        y += (card.row === 0 ? -40 : 120) * focusHeroP;
        alpha *= otherFade;
      }

      // Compute per-card AI Restyle factor (0 -> 1) as the diagonal Prism Wave sweeps past!
      const cardWaveTrigger = (card.col * 0.14) + (card.row * 0.18) + 0.08;
      const restyleP = E.snappyOut(E.clamp((waveProgress - cardWaveTrigger) / 0.24));
      const waveBounce = (waveProgress > cardWaveTrigger && waveProgress < cardWaveTrigger + 0.26)
        ? Math.sin(((waveProgress - cardWaveTrigger) / 0.26) * Math.PI) * 0.065
        : 0;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.rotate(rot);

      // 3D Y-Axis Flip foreshortening & perspective skew on Hero Card #03 (`lt >= 4.35s`)!
      let flipCos = 1;
      if (card.hero && flipAngle > 0.001) {
        flipCos = Math.max(0.02, Math.cos(flipAngle));
        const skewY = Math.sin(flipAngle) * 0.14;
        ctx.transform(flipCos, skewY, 0, 1, 0, 0);
      }

      const finalScale = scale * (1 + waveBounce);
      ctx.scale(finalScale, finalScale);

      const cw = 192;
      const ch = 278;
      const cx0 = -cw / 2;
      const cy0 = -ch / 2;

      ctx.shadowColor = 'rgba(0, 0, 0, 0.58)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 12;

      // Render each of the 10 high-craft cards (with live `restyleP` lighting/palette transformation!)
      switch (card.kind) {
        case 'logo':
          this._drawRestyledLogoVI(ctx, cx0, cy0, cw, ch, restyleP);
          break;
        case 'poster3d':
          this._drawRestyled3DPoster(ctx, cx0, cy0, cw, ch, t, restyleP);
          break;
        case 'iphone':
          this._drawRestyledIPhoneUI(ctx, cx0, cy0, cw, ch, t, lt, restyleP, focusHeroP);
          break;
        case 'product':
          this._drawRestyledProductKV(ctx, cx0, cy0, cw, ch, restyleP);
          break;
        case 'editorial':
          this._drawRestyledEditorial(ctx, cx0, cy0, cw, ch, restyleP);
          break;
        case 'watch':
          this._drawShowcaseSmartwatch(ctx, cx0, cy0, cw, ch, restyleP);
          break;
        case 'supercar':
          this._drawShowcaseSupercarLight(ctx, cx0, cy0, cw, ch, restyleP);
          break;
        case 'arch':
          this._drawShowcaseArchitecture(ctx, cx0, cy0, cw, ch, restyleP);
          break;
        case 'vinyl':
          this._drawShowcaseVinylAlbum(ctx, cx0, cy0, cw, ch, t, restyleP);
          break;
        case 'dataviz':
          this._drawShowcaseDataScreen(ctx, cx0, cy0, cw, ch, t, restyleP);
          break;
      }

      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Card title caption below (hides on Hero Card as it flips into S03)
      const labelFade = card.hero ? (1 - E.clamp((lt - 6.00) / 0.4)) : 1;
      if (labelFade > 0.02) {
        ctx.globalAlpha = alpha * labelFade;
        ctx.font = '600 19px "PingFang SC", "Inter", sans-serif';
        ctx.fillStyle = card.hero ? '#38bdf8' : (restyleP > 0.5 ? '#fde68a' : 'rgba(226, 232, 240, 0.85)');
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(card.label, 0, cy0 + ch + 26);
      }

      // Floating `[🎨 Design | </> Code]` Mode Switcher Pill above Hero iPhone before 3D Flip!
      if (card.hero && lt >= 5.80 && flipAngle < Math.PI * 0.46) {
        const pillAlpha = E.snappyOut(E.clamp((lt - 5.80) / 0.28)) * (1 - E.clamp((flipAngle - 0.9) / 0.5));
        const devActive = lt >= 6.12;
        ctx.save();
        ctx.globalAlpha = pillAlpha;
        ctx.fillStyle = 'rgba(9, 14, 28, 0.95)';
        ctx.strokeStyle = devActive ? '#34d399' : '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-88, cy0 - 44, 176, 32, 16);
        ctx.fill();
        ctx.stroke();

        // Sliding active highlight pill
        const slideX = E.snappyOut(E.clamp((lt - 6.08) / 0.22));
        ctx.fillStyle = devActive ? 'rgba(16, 185, 129, 0.32)' : 'rgba(56, 189, 248, 0.28)';
        ctx.beginPath();
        ctx.roundRect(E.lerp(-84, 2, slideX), cy0 - 40, 82, 24, 12);
        ctx.fill();

        ctx.font = '700 12px "Inter", "PingFang SC", sans-serif';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = devActive ? '#94a3b8' : '#ffffff';
        ctx.fillText('🎨 Design', -43, cy0 - 28);
        ctx.fillStyle = devActive ? '#6ee7b7' : '#94a3b8';
        ctx.fillText('</> Code', 43, cy0 - 28);
        ctx.restore();
      }

      ctx.restore();
    }

    // -------------------------------------------------------------------------
    // ROW 1 CARDS (Exact match with S01 at restyleP=0, evolve smoothly at restyleP->1!)
    // -------------------------------------------------------------------------
    _drawRestyledLogoVI(ctx, x, y, w, h, rp) {
      if (rp <= 0.01) {
        this.s01._drawShowcaseLogoVI(ctx, x, y, w, h);
        return;
      }
      const g = ctx.createLinearGradient(x, y, x + w, y + h);
      g.addColorStop(0, rp > 0.5 ? '#1f1638' : '#06201e');
      g.addColorStop(1, '#091122');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 20);
      ctx.fill();
      ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

      ctx.save();
      ctx.beginPath(); ctx.roundRect(x, y, w, h, 20); ctx.clip();
      const lcx = 0, lcy = -26;
      ctx.strokeStyle = `rgba(251, 191, 36, ${0.28 * rp + 0.15})`;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(lcx - 56, lcy - 56, 112, 112);
      ctx.beginPath();
      ctx.arc(lcx, lcy, 56, 0, Math.PI * 2);
      ctx.arc(lcx, lcy, 34, 0, Math.PI * 2);
      ctx.stroke();

      const lg = ctx.createLinearGradient(-46, lcy - 44, 46, lcy + 44);
      lg.addColorStop(0, rp > 0.4 ? '#fbbf24' : '#34d399');
      lg.addColorStop(0.5, rp > 0.4 ? '#f472b6' : '#00f5ff');
      lg.addColorStop(1, '#818cf8');
      ctx.strokeStyle = lg;
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(lcx - 16, lcy, 24, Math.PI * 0.25, Math.PI * 1.75);
      ctx.arc(lcx + 16, lcy, 24, Math.PI * 1.25, Math.PI * 0.75);
      ctx.stroke();

      const chips = rp > 0.4 ? ['#fbbf24', '#f472b6', '#818cf8'] : ['#34d399', '#00f5ff', '#3b82f6'];
      chips.forEach((col, i) => {
        const cxp = x + 18 + i * 54, cyp = y + h - 72;
        ctx.fillStyle = col;
        ctx.beginPath(); ctx.roundRect(cxp, cyp, 46, 36, 7); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cxp, cyp + 25, 46, 11);
      });
      ctx.restore();
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.65)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(x, y, w, h, 20); ctx.stroke();
    }

    _drawRestyled3DPoster(ctx, x, y, w, h, t, rp) {
      this.s01._drawShowcase3DPoster(ctx, x, y, w, h, t + rp * 1.8);
      if (rp > 0.05) {
        ctx.save();
        ctx.strokeStyle = `rgba(0, 245, 255, ${0.65 * rp})`;
        ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.roundRect(x, y, w, h, 20); ctx.stroke();
        ctx.restore();
      }
    }

    _drawRestyledIPhoneUI(ctx, x, y, w, h, t, lt, rp, focusHeroP) {
      this.s01._drawShowcaseIPhoneUI(ctx, x, y, w, h, t + rp * 1.4);

      // When `[</> Code]` Dev Mode activates (lt >= 4.08s), draw glowing emerald Component X-Ray Inspector bounds!
      const xrayP = E.snappyOut(E.clamp((lt - 4.08) / 0.35));
      if (xrayP > 0.02) {
        ctx.save();
        ctx.globalAlpha = xrayP;
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(x + 12, y + 36, w - 24, 92);
        ctx.strokeRect(x + 12, y + 134, 82, 86);
        ctx.strokeRect(x + 98, y + 134, 82, 86);
        ctx.setLineDash([]);

        // Component tag `<HeroChart />`
        ctx.fillStyle = '#065f46';
        ctx.beginPath();
        ctx.roundRect(x + 14, y + 26, 86, 16, 4);
        ctx.fill();
        ctx.font = '700 9.5px "JetBrains Mono", "Consolas", monospace';
        ctx.fillStyle = '#6ee7b7';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('<HeroChart/>', x + 19, y + 34);
        ctx.restore();
      }
    }

    _drawRestyledProductKV(ctx, x, y, w, h, rp) {
      this.s01._drawShowcaseProductKV(ctx, x, y, w, h);
      if (rp > 0.05) {
        // Add golden rim lens flare on bottle during AI restyle!
        ctx.save();
        const flare = ctx.createRadialGradient(-24, -22, 2, -24, -22, 42 * rp);
        flare.addColorStop(0, `rgba(255, 255, 255, ${0.85 * rp})`);
        flare.addColorStop(0.4, `rgba(253, 224, 71, ${0.45 * rp})`);
        flare.addColorStop(1, 'rgba(253, 224, 71, 0)');
        ctx.fillStyle = flare;
        ctx.beginPath(); ctx.arc(-24, -22, 42, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }

    _drawRestyledEditorial(ctx, x, y, w, h, rp) {
      this.s01._drawShowcaseEditorialCover(ctx, x, y, w, h);
      if (rp > 0.05) {
        ctx.save();
        ctx.strokeStyle = `rgba(251, 146, 60, ${0.7 * rp})`;
        ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.roundRect(x, y, w, h, 20); ctx.stroke();
        ctx.restore();
      }
    }

    // -------------------------------------------------------------------------
    // ROW 2 CARDS (06 - 10: 5 Brand-New Designer-Grade Showcases!)
    // -------------------------------------------------------------------------

    // Card 06: Luxury Titanium Smartwatch Chronograph & Wearable Dial UI
    _drawShowcaseSmartwatch(ctx, x, y, w, h, rp) {
      const g = ctx.createLinearGradient(x, y, x + w, y + h);
      g.addColorStop(0, rp > 0.4 ? '#1c1917' : '#0b1324');
      g.addColorStop(1, '#050811');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.roundRect(x, y, w, h, 20); ctx.fill();
      ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

      ctx.save();
      ctx.beginPath(); ctx.roundRect(x, y, w, h, 20); ctx.clip();

      // Top & Bottom Watch Strap Bands (subtle ribbed fluoroelastomer texture)
      ctx.fillStyle = rp > 0.4 ? '#44403c' : '#1e293b';
      ctx.beginPath();
      ctx.roundRect(-34, y - 10, 68, 76, 10);
      ctx.roundRect(-34, 62, 68, 86, 10);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 2;
      for (let sy = -112; sy <= -74; sy += 9) {
        ctx.beginPath(); ctx.moveTo(-26, sy); ctx.lineTo(26, sy); ctx.stroke();
      }
      for (let sy = 76; sy <= 114; sy += 9) {
        ctx.beginPath(); ctx.moveTo(-26, sy); ctx.lineTo(26, sy); ctx.stroke();
      }

      // Digital Crown & Side Action Button on right edge of watch case
      ctx.fillStyle = rp > 0.4 ? '#fbbf24' : '#94a3b8';
      ctx.beginPath();
      ctx.roundRect(62, -32, 9, 26, 4);
      ctx.roundRect(62, 8, 6, 18, 3);
      ctx.fill();

      // Brushed Titanium Rounded Watch Case + Pitch-Black OLED Dial
      const caseGrad = ctx.createLinearGradient(-64, -74, 64, 74);
      caseGrad.addColorStop(0, rp > 0.4 ? '#fde68a' : '#cbd5e1');
      caseGrad.addColorStop(0.5, rp > 0.4 ? '#b45309' : '#475569');
      caseGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = caseGrad;
      ctx.beginPath();
      ctx.roundRect(-64, -72, 128, 144, 34);
      ctx.fill();

      ctx.fillStyle = '#04060c';
      ctx.beginPath();
      ctx.roundRect(-57, -65, 114, 130, 28);
      ctx.fill();

      // Precision 36-Tick Radial Chronograph Ring
      const accent = rp > 0.4 ? '#fbbf24' : '#00f5ff';
      for (let i = 0; i < 36; i++) {
        const a = (i / 36) * Math.PI * 2;
        const isMajor = i % 3 === 0;
        const rIn = isMajor ? 40 : 44;
        const rOut = 48;
        ctx.strokeStyle = isMajor ? accent : 'rgba(148, 163, 184, 0.4)';
        ctx.lineWidth = isMajor ? 2.2 : 1.1;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * rIn, Math.sin(a) * rIn);
        ctx.lineTo(Math.cos(a) * rOut, Math.sin(a) * rOut);
        ctx.stroke();
      }

      // Inner Sub-Complication Activity Ring
      ctx.strokeStyle = rp > 0.4 ? 'rgba(251, 191, 36, 0.28)' : 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(0, 18, 13, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = rp > 0.4 ? '#f97316' : '#34d399';
      ctx.beginPath(); ctx.arc(0, 18, 13, -Math.PI * 0.5, Math.PI * 0.85); ctx.stroke();

      // Crisp Hour & Minute Watch Hands + Glowing Sweeping Second Hand
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-18, -20); ctx.stroke();
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(26, -24 + rp * 14); ctx.stroke();

      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.8;
      const secAngle = -0.7 + rp * 2.1;
      ctx.beginPath();
      ctx.moveTo(-Math.cos(secAngle) * 10, -Math.sin(secAngle) * 10);
      ctx.lineTo(Math.cos(secAngle) * 42, Math.sin(secAngle) * 42);
      ctx.stroke();

      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill();

      ctx.restore();
      ctx.strokeStyle = rp > 0.4 ? 'rgba(251, 191, 36, 0.55)' : 'rgba(125, 211, 252, 0.48)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(x, y, w, h, 20); ctx.stroke();
    }

    // Card 07: Aerodynamic Supercar Silhouette & Glowing LED Tail-Bar Render
    _drawShowcaseSupercarLight(ctx, x, y, w, h, rp) {
      ctx.fillStyle = '#05070e';
      ctx.beginPath(); ctx.roundRect(x, y, w, h, 20); ctx.fill();
      ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

      ctx.save();
      ctx.beginPath(); ctx.roundRect(x, y, w, h, 20); ctx.clip();

      // Dramatic overhead studio softbox reflection arc
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.72)';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(-76, 12);
      ctx.bezierCurveTo(-42, -32, 28, -36, 78, 8);
      ctx.stroke();

      // Sweeping fastback roofline & rear haunch
      const bodyG = ctx.createLinearGradient(-76, -24, 76, 36);
      bodyG.addColorStop(0, '#1e293b');
      bodyG.addColorStop(0.5, '#475569');
      bodyG.addColorStop(1, '#0f172a');
      ctx.fillStyle = bodyG;
      ctx.beginPath();
      ctx.moveTo(-80, 26);
      ctx.bezierCurveTo(-48, -22, 26, -26, 80, 18);
      ctx.lineTo(80, 44);
      ctx.lineTo(-80, 44);
      ctx.closePath();
      ctx.fill();

      // Iconic Continuous Neon LED Taillight Blade!
      const ledCol = rp > 0.4 ? '#00f5ff' : '#f43f5e';
      ctx.shadowColor = ledCol;
      ctx.shadowBlur = 22;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(-70, 22);
      ctx.lineTo(70, 22);
      ctx.stroke();
      ctx.strokeStyle = ledCol;
      ctx.lineWidth = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Wet floor reflection below car
      const floorG = ctx.createLinearGradient(0, 48, 0, 110);
      floorG.addColorStop(0, rp > 0.4 ? 'rgba(0, 245, 255, 0.35)' : 'rgba(244, 63, 94, 0.35)');
      floorG.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = floorG;
      ctx.fillRect(-72, 48, 144, 58);

      ctx.font = '800 16px "Inter", sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'left';
      ctx.fillText('AERO GT', x + 18, y + 34);

      ctx.restore();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.42)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(x, y, w, h, 20); ctx.stroke();
    }

    // Card 08: Minimalist Architectural Pavilion & Golden Sunlight Reflection
    _drawShowcaseArchitecture(ctx, x, y, w, h, rp) {
      const sky = ctx.createLinearGradient(x, y, x, y + h);
      sky.addColorStop(0, rp > 0.4 ? '#312e81' : '#0c4a6e');
      sky.addColorStop(0.6, rp > 0.4 ? '#f97316' : '#bae6fd');
      sky.addColorStop(1, '#0f172a');
      ctx.fillStyle = sky;
      ctx.beginPath(); ctx.roundRect(x, y, w, h, 20); ctx.fill();
      ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

      ctx.save();
      ctx.beginPath(); ctx.roundRect(x, y, w, h, 20); ctx.clip();

      // Cantilevered Modernist Concrete Roof & Warm Lit Glass Interior
      ctx.fillStyle = '#fde68a';
      ctx.fillRect(-48, -22, 96, 66);

      // Architectural columns & cantilevered slab
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-72, -36, 144, 16);
      ctx.fillStyle = '#334155';
      ctx.fillRect(-48, -20, 12, 64);
      ctx.fillRect(28, -20, 14, 64);
      ctx.fillRect(-72, 44, 144, 10);

      // Reflecting Pool Water ripples at bottom
      ctx.fillStyle = 'rgba(15, 23, 42, 0.68)';
      ctx.fillRect(x, 54, w, h);
      ctx.fillStyle = 'rgba(253, 230, 138, 0.38)';
      for (let r = 0; r < 4; r++) {
        ctx.fillRect(-38 + r * 4, 64 + r * 14, 72 - r * 8, 5);
      }

      ctx.restore();
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.48)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(x, y, w, h, 20); ctx.stroke();
    }

    // Card 09: Vinyl Record Album Sleeve & Grooved Spinning Disc
    _drawShowcaseVinylAlbum(ctx, x, y, w, h, t, rp) {
      const g = ctx.createLinearGradient(x, y, x + w, y + h);
      g.addColorStop(0, '#18181b');
      g.addColorStop(1, '#27272a');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.roundRect(x, y, w, h, 20); ctx.fill();
      ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

      ctx.save();
      ctx.beginPath(); ctx.roundRect(x, y, w, h, 20); ctx.clip();

      // Peeking Black Vinyl Disc on top/right
      const pullOut = 22 + rp * 18;
      const vcy = -28 - pullOut * 0.5;
      ctx.fillStyle = '#09090b';
      ctx.beginPath(); ctx.arc(0, vcy, 58, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.16)';
      ctx.lineWidth = 1.5;
      [48, 38, 28].forEach((gr) => {
        ctx.beginPath(); ctx.arc(0, vcy, gr, 0, Math.PI * 2); ctx.stroke();
      });
      // Center vinyl label
      ctx.fillStyle = rp > 0.4 ? '#00f5ff' : '#fb7185';
      ctx.beginPath(); ctx.arc(0, vcy, 18, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#09090b';
      ctx.beginPath(); ctx.arc(0, vcy, 4, 0, Math.PI * 2); ctx.fill();

      // Square Album Cover Sleeve in front
      const sg = ctx.createLinearGradient(-68, -12, 68, 118);
      sg.addColorStop(0, rp > 0.4 ? '#06b6d4' : '#f43f5e');
      sg.addColorStop(1, '#4f46e5');
      ctx.fillStyle = sg;
      ctx.beginPath(); ctx.roundRect(-68, -6, 136, 124, 10); ctx.fill();

      ctx.font = '800 18px "Inter", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText('SYNTH', -54, 24);
      ctx.fillText('WAVE', -54, 46);

      ctx.restore();
      ctx.strokeStyle = 'rgba(244, 114, 182, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(x, y, w, h, 20); ctx.stroke();
    }

    // Card 10: Cyber Glassmorphic Data Visualization Big-Screen
    _drawShowcaseDataScreen(ctx, x, y, w, h, t, rp) {
      ctx.fillStyle = '#071120';
      ctx.beginPath(); ctx.roundRect(x, y, w, h, 20); ctx.fill();
      ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

      ctx.save();
      ctx.beginPath(); ctx.roundRect(x, y, w, h, 20); ctx.clip();

      // Glowing Multi-Ring Radial Telemetry Gauge
      const gcx = 0, gcy = -28;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.lineWidth = 8;
      ctx.beginPath(); ctx.arc(gcx, gcy, 44, 0, Math.PI * 2); ctx.stroke();

      ctx.strokeStyle = rp > 0.4 ? '#fbbf24' : '#00f5ff';
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(gcx, gcy, 44, -Math.PI * 0.6, Math.PI * (0.9 + rp * 0.4)); ctx.stroke();

      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(gcx, gcy, 30, 0, Math.PI * 1.35); ctx.stroke();

      ctx.font = '800 18px "Inter", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(rp > 0.4 ? '99.4' : '94.2', gcx, gcy);

      // Equalizer Bar Columns at bottom
      for (let i = 0; i < 8; i++) {
        const bx = x + 22 + i * 19;
        const bh = 22 + Math.abs(Math.sin(i * 0.9 + t * 4)) * 42;
        ctx.fillStyle = i % 2 === 0 ? '#00f5ff' : '#6366f1';
        ctx.beginPath();
        ctx.roundRect(bx, y + h - 22 - bh, 12, bh, 4);
        ctx.fill();
      }

      ctx.restore();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(x, y, w, h, 20); ctx.stroke();
    }

    _drawAIPrismWaveAndCursor(ctx, waveProgress, fade) {
      const wx = E.lerp(-760, 760, waveProgress);
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.globalCompositeOperation = 'lighter';

      const wg = ctx.createLinearGradient(wx - 120, -400, wx + 120, 400);
      wg.addColorStop(0, 'rgba(0, 245, 255, 0)');
      wg.addColorStop(0.45, 'rgba(0, 245, 255, 0.22)');
      wg.addColorStop(0.5, 'rgba(253, 224, 71, 0.36)');
      wg.addColorStop(0.55, 'rgba(236, 72, 153, 0.22)');
      wg.addColorStop(1, 'rgba(0, 245, 255, 0)');

      ctx.fillStyle = wg;
      ctx.beginPath();
      ctx.moveTo(wx - 90, -480);
      ctx.lineTo(wx + 150, -480);
      ctx.lineTo(wx + 30, 480);
      ctx.lineTo(wx - 210, 480);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // =========================================================================
    // SEAMLESS BACK-FACE UNFOLD INTO S03 CODE IDE (90° -> 180°, t = 10.12s - 11.20s)
    // =========================================================================
    _renderS03CodeBackfaceUnfold(ctx, t, lt, flipAngle) {
      // flipAngle goes from PI/2 (edge-on at lt=6.82s) to PI (flat 1.0 facing viewer!)
      const cosBack = Math.max(0.02, -Math.cos(flipAngle));
      const skewY = -Math.sin(flipAngle) * 0.10;
      const expandP = E.snappyOut(E.clamp((lt - 6.82) / 0.88));

      const ideW = E.lerp(460, 1140, expandP);
      const ideH = E.lerp(560, 620, expandP);
      const ix = -ideW / 2;
      const iy = -ideH / 2;

      ctx.save();
      ctx.transform(cosBack, skewY, 0, 1, 0, 0);

      // Sleek Dark Code IDE Window (`S03 · 改变了编程` opening frame!)
      ctx.shadowColor = 'rgba(16, 185, 129, 0.25)';
      ctx.shadowBlur = 42;
      ctx.fillStyle = '#090f1d';
      ctx.beginPath();
      ctx.roundRect(ix, iy, ideW, ideH, 20);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = 'rgba(52, 211, 153, 0.68)';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(ix, iy, ideW, ideH, 20);
      ctx.clip();

      // Top IDE Titlebar
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(ix, iy, ideW, 46);
      ['#fb7185', '#fbbf24', '#34d399'].forEach((dc, i) => {
        ctx.fillStyle = dc;
        ctx.beginPath(); ctx.arc(ix + 26 + i * 20, iy + 23, 6, 0, Math.PI * 2); ctx.fill();
      });

      ctx.font = '600 15px "JetBrains Mono", "Consolas", monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('</>  main.py — AI Code Synthesizer', 0, iy + 23);

      // Left Explorer Sidebar (appears as IDE widens)
      const sideW = 210 * expandP;
      if (sideW > 30) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
        ctx.fillRect(ix, iy + 46, sideW, ideH - 46);
        ctx.strokeStyle = 'rgba(51, 65, 85, 0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ix + sideW, iy + 46);
        ctx.lineTo(ix + sideW, iy + ideH);
        ctx.stroke();

        ctx.font = '500 13px "JetBrains Mono", "Consolas", monospace';
        ctx.textAlign = 'left';
        const files = ['▾ project-omega', '  ✦ main.py', '  ✦ agent_core.py', '  ✦ neural_engine.py', '  ✓ deploy.yml'];
        files.forEach((f, idx) => {
          ctx.fillStyle = idx === 1 ? '#34d399' : '#64748b';
          ctx.fillText(f, ix + 18, iy + 82 + idx * 28);
        });
      }

      // Live Streaming Multi-Token Syntax-Highlighted Code Lines (`print("Rule the world")`)!
      const editorLeft = ix + sideW;
      const codeX = editorLeft + 28;
      const codeLines = [
        {
          tokens: [
            { col: '#64748b', txt: '# Generated by AI in 0.02s' }
          ]
        },
        {
          tokens: [
            { col: '#c084fc', txt: 'import ' },
            { col: '#38bdf8', txt: 'ai_engine ' },
            { col: '#c084fc', txt: 'as ' },
            { col: '#e2e8f0', txt: 'ai' }
          ]
        },
        {
          tokens: [
            { col: '#e2e8f0', txt: 'ai.' },
            { col: '#60a5fa', txt: 'unlock_all_capabilities' },
            { col: '#94a3b8', txt: '()' }
          ]
        },
        {
          active: true,
          tokens: [
            { col: '#c084fc', txt: 'print' },
            { col: '#cbd5e1', txt: '(' },
            { col: '#fde047', txt: '"Rule the world"' },
            { col: '#cbd5e1', txt: ')' }
          ]
        }
      ];

      ctx.font = '600 21px "JetBrains Mono", "Consolas", monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      codeLines.forEach((ln, idx) => {
        const lineP = E.snappyOut(E.clamp((lt - 6.84 - idx * 0.08) / 0.34));
        if (lineP <= 0.01) return;
        const ly = iy + 104 + idx * 48;

        // Subtle glowing emerald active-line bar behind `print("Rule the world")`
        if (ln.active) {
          ctx.fillStyle = `rgba(16, 185, 129, ${0.13 * lineP})`;
          ctx.fillRect(editorLeft + 1, ly - 22, ideW - sideW - 2, 44);
          ctx.fillStyle = `rgba(52, 211, 153, ${0.95 * lineP})`;
          ctx.fillRect(editorLeft + 1, ly - 22, 3.5, 44);
        }

        ctx.globalAlpha = lineP;
        ctx.fillStyle = ln.active ? '#34d399' : 'rgba(100, 116, 139, 0.55)';
        ctx.fillText(String(idx + 1).padStart(2, '0'), codeX, ly);

        const totalChars = ln.tokens.reduce((acc, tk) => acc + tk.txt.length, 0);
        let rem = Math.ceil(totalChars * lineP);
        let curX = codeX + 52;

        for (let ti = 0; ti < ln.tokens.length && rem > 0; ti++) {
          const tk = ln.tokens[ti];
          const sliceTxt = tk.txt.slice(0, rem);
          ctx.fillStyle = tk.col;
          ctx.fillText(sliceTxt, curX, ly);
          curX += ctx.measureText(sliceTxt).width;
          rem -= sliceTxt.length;
        }
      });
      ctx.globalAlpha = 1;

      // Bottom Integrated Terminal Output Panel (`> Rule the world`)
      const termH = 166;
      const termY = iy + ideH - termH;
      const termAppear = E.snappyOut(E.clamp((lt - 7.06) / 0.36));
      if (termAppear > 0.01) {
        ctx.save();
        ctx.globalAlpha = termAppear;
        ctx.fillStyle = '#050913';
        ctx.fillRect(editorLeft, termY, ideW - sideW, termH);

        ctx.strokeStyle = 'rgba(52, 211, 153, 0.32)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(editorLeft, termY);
        ctx.lineTo(ix + ideW, termY);
        ctx.stroke();

        // Terminal Header Label
        ctx.font = '700 12px "JetBrains Mono", "Inter", monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.textAlign = 'left';
        ctx.fillText('TERMINAL  ·  STDOUT', codeX, termY + 24);

        // Command execution line
        ctx.font = '500 15px "JetBrains Mono", "Consolas", monospace';
        ctx.fillStyle = '#64748b';
        ctx.fillText('$ python main.py', codeX, termY + 58);

        // Bold `> Rule the world` output!
        const outP = E.snappyOut(E.clamp((lt - 7.28) / 0.34));
        if (outP > 0.01) {
          const outStr = 'Rule the world';
          const shownOut = outStr.slice(0, Math.ceil(outStr.length * outP));
          ctx.font = '700 26px "JetBrains Mono", "Consolas", monospace';
          ctx.fillStyle = '#34d399';
          ctx.shadowColor = 'rgba(52, 211, 153, 0.45)';
          ctx.shadowBlur = 14;
          ctx.fillText('> ' + shownOut, codeX, termY + 102);
          ctx.shadowBlur = 0;

          // Blinking terminal block cursor after `Rule the world`
          const blink = Math.sin(t * 10) > -0.2 ? 0.9 : 0.15;
          const outW = ctx.measureText('> ' + shownOut).width;
          ctx.fillStyle = `rgba(52, 211, 153, ${blink * outP})`;
          ctx.fillRect(codeX + outW + 8, termY + 89, 12, 24);
        }
        ctx.restore();
      }

      // Bottom-Right Live Green Build Badge (`S03` Ready!)
      if (expandP > 0.45) {
        const badgeP = E.spring(E.clamp((expandP - 0.45) / 0.55), 14, 0.68);
        const bx = ix + ideW - 266;
        const by = iy + ideH - 64;
        ctx.save();
        ctx.translate(bx + 118, by + 20);
        ctx.scale(badgeP, badgeP);
        ctx.fillStyle = 'rgba(6, 78, 59, 0.92)';
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-118, -20, 236, 40, 20);
        ctx.fill();
        ctx.stroke();

        ctx.font = '700 14px "JetBrains Mono", "Inter", monospace';
        ctx.fillStyle = '#6ee7b7';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('✓  Executed in 0.02s', 0, 0);
        ctx.restore();
      }

      ctx.restore(); // end IDE clip
      ctx.restore();
    }

    _renderForeground(t, lt, flipAngle, ctx, width, height) {
      // Crisp Emerald-Cyan Energy Streak right at 90° Card Flip (`flipAngle ≈ PI/2`)!
      const edgeDist = Math.abs(flipAngle - Math.PI * 0.5);
      if (edgeDist < 0.35 && lt > 6.3 && lt < 7.3) {
        const flash = (1 - edgeDist / 0.35) * 0.42;
        const g = ctx.createLinearGradient(0, height * 0.5, width, height * 0.5);
        g.addColorStop(0, 'rgba(0, 245, 255, 0)');
        g.addColorStop(0.5, `rgba(52, 211, 153, ${flash})`);
        g.addColorStop(1, 'rgba(0, 245, 255, 0)');
        ctx.fillStyle = g;
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

      // Voiceover Subtitle (Synced to Yunxi word boundaries, zero meta notes)
      const subY = height - Math.max(36, height * 0.072);
      const subFont = Math.max(15, Math.round(width * 0.0175));
      ctx.save();
      ctx.font = `600 ${subFont}px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let subText = '';
      let subAlpha = 0;

      if (lt >= 0.04 && lt < 3.86) {
        subText = '它改变了设计——熬几个通宵打磨的草图与光影';
        subAlpha = E.smoothstep(E.invLerp(0.04, 0.26, lt)) * (1 - E.smoothstep(E.invLerp(3.62, 3.86, lt)));
      } else if (lt >= 3.88 && lt < 6.95) {
        subText = '现在一句话，就能铺开十种视觉可能。';
        subAlpha = E.smoothstep(E.invLerp(3.88, 4.10, lt)) * (1 - E.smoothstep(E.invLerp(6.62, 6.95, lt)));
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

  window.ShotS02Design = ShotS02Design;
})();
