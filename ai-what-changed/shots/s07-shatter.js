/**
 * SHOT S07 (45.20s - 54.40s): 第三幕 · 一镜拉远反差（褪去色彩 · 直面千篇一律的海报、无灵魂快剪与零用户产品）
 *
 * Zero-Slideshow, High-Contrast Apple/Linear Editorial Continuity:
 *   [45.20s / lt=0.00s] Exact 0.00px lock with S06's full-screen dazzling "AI Masterpiece" Hero Poster!
 *                       BGM cuts abruptly -> Camera SNAP-PULLS OUT (`scale: 3.00 -> 0.98`), exposing that your
 *                       "masterpiece" is just cell `[1, 3]` inside a `7×3` wall of 21 IDENTICAL AI-template clones
 *                       (`AI 咖啡节 / 科技峰会 / 潮牌首发...`), as color drains into crisp Platinum-Silver Monochrome!
 *   [48.45s - 50.95s]   Yunxi: “丝滑却毫无灵魂的快剪”
 *                       Center row's 5 frames physically reshape (`166×222 -> 196×352`) into 5 sleek 9:16 vertical
 *                       short-video phone screens playing in 100% robotic unison: identical zoom-punches, identical
 *                       “注意看！！/ 3秒黄金开头” viral banners, hollow `♡ 0` likes & synchronized “↑ 秒划走” trails!
 *   [50.65s - 53.25s]   Yunxi: “跑得通，却没人需要的产品……”
 *                       The 5 phones merge & expand horizontally into a razor-sharp SaaS Launchpad (`1020×448`):
 *                       Left column runs like clockwork (`✓ 编译通过 / ✓ 12ms 响应 / ✓ 自动空转`), while Right main
 *                       retention chart plunges from Day 1 straight onto a dead `0 人在线` flatline (`当前真实用户：0`)!
 *   [53.15s - 54.40s]   One-Take Morph -> S08: Self-running mechanical rings & grid fold onto the LEFT half (`x < 0`)
 *                       into 3 interlocking 60fps cold engineering blueprint gears (`HOW · 怎么做`)!
 */
(function () {
  const E = window.MGEasing;

  class ShotS07Shatter {
    constructor(stage3D, shotS06) {
      this.stage = stage3D;
      this.shotS06 = shotS06;
      this.startTime = 45.20;
      this.endTime = 54.40;
      this.duration = this.endTime - this.startTime; // 9.20s

      // 21 Absurdly Interchangeable Titles on the EXACT SAME 3D Torus AI Template (`7 cols x 3 rows`)
      // Center cell `[row 1, col 3]` (`idx = 10`) is `'未来先锋视觉大赏'` — exact 0.00px match with S06 end!
      this.cloneTitles = [
        'AI 咖啡生活节', '全球云端峰会', '数字艺术双年展', '新锐潮牌首发', '未来音乐盛典', '高端地产品鉴', '智能汽车之夜',
        '元宇宙开发者日', '先锋设计周',   '新消费品牌峰会', '未来先锋视觉大赏', '青年科创论坛', '电竞总决赛夜', '未来家居大展',
        'AIGC 创作者节', '春季时尚大秀', '威士忌品鉴会',   '城市光影艺术季', '独立游戏大赏', '前沿商业年鉴', '户外机能新品周'
      ];

      // Exact Gear Specs at `lt = 9.20s` (locks 0.00px with S08's Left-Half Mechanical Blueprint!)
      this.gears = [
        { cx: -340, cy: -40,  r: 112, teeth: 18, speed:  1.20, phase: 0.00 },
        { cx: -176, cy: -148, r: 74,  teeth: 12, speed: -1.80, phase: 0.26 },
        { cx: -188, cy:  102, r: 86,  teeth: 14, speed: -1.54, phase: 0.15 }
      ];
    }

    render(t, vecCtx, fgCtx, width, height) {
      const lt = Math.max(0, t - this.startTime); // 0.00 -> 9.20s
      this._updateStage3D(t, lt);

      vecCtx.clearRect(0, 0, width, height);
      fgCtx.clearRect(0, 0, width, height);

      const baseW = 1280;
      const baseH = 720;
      const scaleFit = Math.min(width / baseW, height / baseH);

      // Master One-Take Choreography Curves:
      // 1) Snap Pull-Back (`lt = 0.00s -> 1.32s`): `gridZoom` drops `3.00 -> 0.98` exposing all 21 clones!
      const zoomOutP = E.snappyOut(E.clamp(lt / 1.32));
      // 2) Radial Color-Drain Wave (`lt = 0.28s -> 1.75s`): drains neon into crisp silver-obsidian monochrome!
      const desatWaveP = E.smoothstep(E.clamp((lt - 0.28) / 1.45));
      // 3) Morph 1 (`lt = 3.22s -> 3.88s`): Poster Grid -> 5 Synchronized 9:16 Short-Video Phones!
      const toPhonesP = E.cinematicInOut(E.clamp((lt - 3.22) / 0.66));
      // 4) Morph 2 (`lt = 5.42s -> 6.08s`): 5 Phones -> Crisp High-Contrast Zero-User SaaS Dashboard!
      const toProductP = E.cinematicInOut(E.clamp((lt - 5.42) / 0.66));
      // 5) Morph 3 (`lt = 7.95s -> 9.20s`): Dashboard Mechanical Fold -> Left-Half Blueprint Gears (`S08`)!
      const compressP = E.cinematicInOut(E.clamp((lt - 7.95) / 1.22));

      // Crisp Architectural Obsidian Backdrop (`#090c14` -> `#080a0f` -> `#070b14`)
      vecCtx.fillStyle = compressP > 0.45 ? '#070b14' : '#080a10';
      vecCtx.fillRect(0, 0, width, height);

      vecCtx.save();
      vecCtx.translate(width / 2, height / 2);
      vecCtx.scale(scaleFit, scaleFit);

      // Subtle high-contrast silver gallery grid in background
      this._renderGalleryGrid(vecCtx, desatWaveP, compressP);

      // PHASE A (`lt = 0.00s -> 3.88s`): One-Take Snap Zoom-Out of 21 Identical Posters -> Morphing into 5 Phones!
      if (toPhonesP < 0.999) {
        this._renderClonePosterGridAndMorph(vecCtx, t, lt, zoomOutP, desatWaveP, toPhonesP);
      }

      // PHASE B (`lt = 3.22s -> 6.08s`): 5 Robotic Synchronized 9:16 Short-Video Fast-Cut Phones -> Morphing into SaaS!
      if (toPhonesP > 0.001 && toProductP < 0.999) {
        this._renderSynchronizedFastCutPhones(vecCtx, t, lt, toPhonesP, toProductP);
      }

      // PHASE C (`lt = 5.42s -> 9.05s`): Flawlessly Running Yet Zero-User SaaS Product Dashboard!
      if (toProductP > 0.001 && compressP < 0.96) {
        this._renderZeroUserProductDashboard(vecCtx, t, lt, toProductP, compressP);
      }

      // PHASE D (`lt >= 7.85s` -> S08): Left-Half 60fps Engineering Blueprint Gears!
      if (compressP > 0.01) {
        this._renderLeftBlueprintGears(vecCtx, t, lt, compressP);
      }

      vecCtx.restore();

      // Cinema Vignette & Sober Voiceover Subtitles
      this._renderForeground(t, lt, fgCtx, width, height);
    }

    _updateStage3D(t, lt) {
      const desatP = E.smoothstep(E.clamp((lt - 0.28) / 1.45));
      const compressP = E.cinematicInOut(E.clamp((lt - 7.95) / 1.22));
      this.stage.gridMat.opacity = E.lerp(0.16, 0.03, desatP) + compressP * 0.08;
      this.stage.pMat.opacity = E.lerp(0.35, 0.02, desatP);
      this.stage.camera.position.set(0, 0, E.lerp(4.6, 11.5, E.snappyOut(E.clamp(lt / 1.32))));
      this.stage.camera.lookAt(0, 0, 0);
      this.stage.renderer.render(this.stage.scene, this.stage.camera);
    }

    _renderGalleryGrid(ctx, desatP, compressP) {
      if (compressP > 0.95) return;
      ctx.save();
      ctx.strokeStyle = `rgba(203, 213, 225, ${0.045 * desatP * (1 - compressP)})`;
      ctx.lineWidth = 1;
      for (let gx = -640; gx <= 640; gx += 64) {
        ctx.beginPath(); ctx.moveTo(gx, -360); ctx.lineTo(gx, 360); ctx.stroke();
      }
      for (let gy = -360; gy <= 360; gy += 64) {
        ctx.beginPath(); ctx.moveTo(-640, gy); ctx.lineTo(640, gy); ctx.stroke();
      }
      ctx.restore();
    }

    // =========================================================================
    // PHASE A: 5x SNAP ZOOM-OUT REVEALING 21 IDENTICAL AI-TEMPLATE POSTERS!
    // =========================================================================
    _renderClonePosterGridAndMorph(ctx, t, lt, zoomOutP, desatWaveP, toPhonesP) {
      // At `lt = 0.00s` (`zoomOutP = 0`): `gridScale = 3.00`, center card `[1, 3]` sits at `(0, 0)` -> 0.00px lock with S06!
      // At `zoomOutP = 1`: `gridScale = 0.96`, revealing all `7 cols × 3 rows = 21` identical posters!
      const gridScale = E.lerp(3.00, 0.96, zoomOutP);
      const colStep = 178;
      const rowStep = 232;

      ctx.save();
      ctx.scale(gridScale, gridScale);

      // Draw outer rows (`r = 0, 2`) first so center row (`r = 1`) stays cleanly on top during `toPhonesP` morph!
      const rowOrder = [0, 2, 1];
      rowOrder.forEach((r) => {
        for (let c = 0; c < 7; c++) {
          const idx = r * 7 + c;
          const isCenterRow = r === 1;
          const isPhoneCol = c >= 1 && c <= 5;

          // Base grid coordinates
          let cx = (c - 3) * colStep;
          let cy = (r - 1) * rowStep;
          let cardAlpha = 1.0;

          // During `toPhonesP` (`3.22s -> 3.88s`):
          // - Top/Bottom rows (`r = 0, 2`) tuck smoothly behind center row & fade
          // - Outer columns (`c = 0, 6`) slide outward offscreen
          // - The 5 center cards (`r = 1, c = 1..5`) glide to exact 5-Phone X slots `(-456, -228, 0, 228, 456)`!
          if (toPhonesP > 0.001) {
            if (!isCenterRow) {
              cy = E.lerp(cy, 0, toPhonesP);
              cardAlpha = 1 - E.smoothstep(E.clamp(toPhonesP / 0.58));
            } else if (!isPhoneCol) {
              cx = cx + (c === 0 ? -240 : 240) * toPhonesP;
              cardAlpha = 1 - E.smoothstep(E.clamp(toPhonesP / 0.55));
            } else {
              const targetPhoneX = ((c - 3) * 228) / gridScale;
              cx = E.lerp(cx, targetPhoneX, toPhonesP);
              cardAlpha = 1 - E.smoothstep(E.clamp((toPhonesP - 0.35) / 0.55));
            }
          }

          if (cardAlpha <= 0.01) continue;

          // Skip offscreen outer cards at `lt = 0` for clean performance
          if (cx * gridScale < -820 || cx * gridScale > 820 || cy * gridScale < -520 || cy * gridScale > 520) {
            continue;
          }

          // Radial Color-Drain Wave ripples outward from center `(0, 0)`!
          const ringDist = Math.hypot(c - 3, r - 1) / 3.2;
          const localDesat = E.clamp((desatWaveP * 1.45) - ringDist * 0.38);

          const topTag = localDesat > 0.65
            ? `TEMPLATE CLONE #${990 + idx}`
            : (idx === 10 ? '✦ AI MASTERPIECE · 01s' : `✦ AI GENERATED · 01s`);

          ctx.save();
          ctx.globalAlpha = cardAlpha;
          if (this.shotS06 && this.shotS06.drawMasterpiecePoster) {
            this.shotS06.drawMasterpiecePoster(
              ctx,
              cx,
              cy,
              1.0,
              localDesat,
              this.cloneTitles[idx],
              topTag,
              idx === 10 && zoomOutP < 0.6
            );
          }
          ctx.restore();
        }
      });

      ctx.restore();

      // Crisp High-Contrast Top Diagnostic Badge once zoomed out (`lt = 1.15s -> 3.25s`)
      if (lt >= 1.10 && toPhonesP < 0.65) {
        const badgeIn = E.snappyOut(E.clamp((lt - 1.10) / 0.32));
        const badgeOut = 1 - E.smoothstep(E.clamp(toPhonesP / 0.55));
        const ba = badgeIn * badgeOut;
        if (ba > 0.01) {
          ctx.save();
          ctx.globalAlpha = ba;
          const txt = '同款光影  ·  同款构图  ·  21 张海报构图重合度 99.8%';
          ctx.font = '700 14px "PingFang SC", "JetBrains Mono", sans-serif';
          const bw = Math.ceil(ctx.measureText(txt).width) + 40;
          ctx.fillStyle = 'rgba(15, 20, 28, 0.92)';
          ctx.strokeStyle = 'rgba(226, 232, 240, 0.65)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(-bw / 2, -338, bw, 36, 18);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#f8fafc';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(txt, 0, -320);
          ctx.restore();
        }
      }
    }

    // =========================================================================
    // PHASE B: 5 ROBOTIC SYNCHRONIZED 9:16 SHORT-VIDEO FAST-CUT PHONES!
    // =========================================================================
    _renderSynchronizedFastCutPhones(ctx, t, lt, toPhonesP, toProductP) {
      const phoneSlots = [-456, -228, 0, 228, 456];

      // Mechanical synchronized beat cycle (`0.46s` robotic fast-cut interval!)
      const beatPeriod = 0.46;
      const localCutT = Math.max(0, lt - 3.55);
      const beatIdx = Math.floor(localCutT / beatPeriod);
      const beatFrac = (localCutT % beatPeriod) / beatPeriod;

      // Identical robotic zoom-punch (`1.18 -> 1.00`) & strobe flash across ALL 5 PHONES!
      const zoomPunch = lt >= 3.55 ? 1.0 + Math.exp(-beatFrac * 7.0) * 0.20 : 1.0;
      const cutFlash = lt >= 3.55 ? Math.exp(-beatFrac * 14.0) * 0.48 : 0;

      const hookCaptions = [
        '“注意看！！”',
        '“3秒黄金开头”',
        '“千万别划走！”',
        '“99%的人不知道”',
        '“建议反复观看”'
      ];
      const activeHook = hookCaptions[beatIdx % hookCaptions.length];

      ctx.save();

      phoneSlots.forEach((slotX, idx) => {
        const isCenter = idx === 2;

        // Morph geometry:
        // From Poster (`160 × 214`) -> 9:16 Phone (`196 × 346`) -> SaaS Dashboard (`1020 × 448` for center!)
        let x = E.lerp(slotX, isCenter ? 0 : -360, toProductP);
        let y = E.lerp(-18, 0, toProductP);
        let w = E.lerp(160, 196, toPhonesP);
        let h = E.lerp(214, 346, toPhonesP);
        let radius = E.lerp(12, 26, toPhonesP);
        let alpha = E.smoothstep(E.clamp((toPhonesP - 0.15) / 0.55));

        if (toProductP > 0.001) {
          if (isCenter) {
            w = E.lerp(196, 1020, toProductP);
            h = E.lerp(346, 448, toProductP);
            radius = E.lerp(26, 18, toProductP);
            alpha *= (1 - E.smoothstep(E.clamp((toProductP - 0.45) / 0.45)));
          } else {
            alpha *= (1 - E.smoothstep(E.clamp(toProductP / 0.52)));
          }
        }

        if (alpha <= 0.01) return;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(x, y);

        // Sleek High-Contrast Titanium Monochrome Phone Bezel
        ctx.fillStyle = '#10141d';
        ctx.strokeStyle = 'rgba(226, 232, 240, 0.68)';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.roundRect(-w / 2, -h / 2, w, h, radius);
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(-w / 2 + 3, -h / 2 + 3, w - 6, h - 6, Math.max(8, radius - 3));
        ctx.clip();

        // Synchronized Zoom-Punching Video Interior (ALL 5 phones run the EXACT SAME cut!)
        ctx.save();
        ctx.scale(zoomPunch, zoomPunch);

        // High-contrast monochrome geometric background switching identically on every beat!
        ctx.fillStyle = beatIdx % 2 === 0 ? '#181e29' : '#131720';
        ctx.fillRect(-w / 2, -h / 2, w, h);

        // Identical talking-head / product geometric framing in all 5 phones
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.30)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(0, -14, 44, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.arc(0, -14, 24, 0, Math.PI * 2);
        ctx.fill();

        // Robotic Synchronized Viral Hook Banner (`“注意看！！”`) across ALL 5 phones!
        if (toPhonesP > 0.7 && toProductP < 0.3) {
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(-w * 0.42, -96, w * 0.84, 30);
          ctx.font = '900 14px "PingFang SC", "Inter", sans-serif';
          ctx.fillStyle = '#090c12';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(activeHook, 0, -81);
        }

        ctx.restore(); // end zoomPunch

        // Synchronized White Whip-Cut Flash on every beat
        if (cutFlash > 0.02) {
          ctx.fillStyle = `rgba(255, 255, 255, ${cutFlash})`;
          ctx.fillRect(-w / 2, -h / 2, w, h);
        }

        // Dynamic Island Notch + Cold Unclicked Right-Side Interaction Column (`♡ 0`)
        if (toPhonesP > 0.6 && toProductP < 0.35) {
          // Dynamic Island
          ctx.fillStyle = '#05070b';
          ctx.beginPath();
          ctx.roundRect(-28, -h / 2 + 10, 56, 14, 7);
          ctx.fill();

          // Hollow unliked heart & zero engagement on right edge
          ctx.font = '700 13px "Inter", sans-serif';
          ctx.fillStyle = 'rgba(148, 163, 184, 0.65)';
          ctx.textAlign = 'center';
          ctx.fillText('♡', w / 2 - 22, 34);
          ctx.font = '600 9.5px "JetBrains Mono", monospace';
          ctx.fillText('0', w / 2 - 22, 50);

          // Synchronized Upward "Swipe-Away / 划走" Ghost Trail on every phone!
          const swipeU = ((lt * 1.35) % 1);
          const sy = E.lerp(110, -40, swipeU);
          ctx.strokeStyle = `rgba(226, 232, 240, ${Math.sin(swipeU * Math.PI) * 0.55})`;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(0, sy + 36);
          ctx.lineTo(0, sy);
          ctx.lineTo(-6, sy + 8);
          ctx.moveTo(0, sy);
          ctx.lineTo(6, sy + 8);
          ctx.stroke();

          // Bottom Formulaic Progress Bar
          ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
          ctx.fillRect(-w / 2 + 14, h / 2 - 22, w - 28, 4);
          ctx.fillStyle = '#e2e8f0';
          ctx.fillRect(-w / 2 + 14, h / 2 - 22, (w - 28) * beatFrac, 4);

          ctx.font = '600 10.5px "PingFang SC", sans-serif';
          ctx.fillStyle = '#94a3b8';
          ctx.fillText(`套模板快剪 #0${idx + 1}`, 0, h / 2 - 38);
        }

        ctx.restore(); // end phone clip
        ctx.restore();
      });

      // Unified Mechanical Beat-Clone Bar Underneath all 5 Phones (`y = +198`)
      const barAlpha = E.smoothstep(E.clamp((toPhonesP - 0.65) / 0.30)) * (1 - E.smoothstep(E.clamp(toProductP / 0.35)));
      if (barAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = barAlpha;
        const bw = 980, bh = 44, by = 198;
        ctx.fillStyle = 'rgba(15, 20, 28, 0.92)';
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.42)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.roundRect(-bw / 2, by - bh / 2, bw, bh, 12);
        ctx.fill();
        ctx.stroke();

        // Identical equal-spaced razor ticks across timeline
        for (let k = 0; k < 20; k++) {
          const kx = -bw / 2 + 24 + k * 48;
          ctx.fillStyle = (k % 4 === beatIdx % 4) ? '#f8fafc' : '#475569';
          ctx.fillRect(kx, by - 10, 38, 20);
        }
        ctx.restore();
      }

      ctx.restore();
    }

    // =========================================================================
    // PHASE C: FLAWLESSLY RUNNING YET ZERO-USER SAAS PRODUCT WORKSPACE!
    // =========================================================================
    _renderZeroUserProductDashboard(ctx, t, lt, toProductP, compressP) {
      const enterAlpha = E.smoothstep(E.clamp((toProductP - 0.30) / 0.55));
      const exitAlpha = 1 - E.smoothstep(E.clamp((compressP - 0.25) / 0.60));
      const alpha = enterAlpha * exitAlpha;
      if (alpha <= 0.01) return;

      const w = 1020;
      const h = 448;
      const shiftLeft = compressP * 180;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(-shiftLeft, 0);

      // High-Contrast Studio Monochrome Application Window
      ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
      ctx.shadowBlur = 32;
      ctx.fillStyle = '#0f131c';
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.62)';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, 18);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(-w / 2 + 2, -h / 2 + 2, w - 4, h - 4, 16);
      ctx.clip();

      // Top Window Bar (`46px`)
      ctx.fillStyle = '#181e2b';
      ctx.fillRect(-w / 2, -h / 2, w, 46);

      // Window traffic dots (monochrome)
      [-482, -464, -446].forEach((dx) => {
        ctx.fillStyle = '#64748b';
        ctx.beginPath(); ctx.arc(dx, -h / 2 + 23, 5, 0, Math.PI * 2); ctx.fill();
      });

      ctx.font = '700 13.5px "PingFang SC", "JetBrains Mono", sans-serif';
      ctx.fillStyle = '#e2e8f0';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('AI 万能套壳工作台 v4.0  ·  PRODUCTION DEPLOYED', -420, -h / 2 + 23);

      const statusBadge = '✓ BUILD PASSED  ·  0 ERRORS  ·  UPTIME 99.99%';
      ctx.font = '700 11.5px "JetBrains Mono", monospace';
      ctx.fillStyle = '#cbd5e1';
      ctx.textAlign = 'right';
      ctx.fillText(statusBadge, w / 2 - 24, -h / 2 + 23);

      // Vertical Divider between LEFT ("跑得通 · 机器完美空转") and RIGHT ("没人需要 · 0 真实用户")!
      const divX = -110;
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(divX, -h / 2 + 46);
      ctx.lineTo(divX, h / 2);
      ctx.stroke();

      // -----------------------------------------------------------------------
      // LEFT COLUMN (`x = -510 .. -110`): "跑得通" — Self-Running Clockwork Modules!
      // -----------------------------------------------------------------------
      ctx.font = '700 14px "PingFang SC", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'left';
      ctx.fillText('系统运行状态（完美跑通）', -480, -h / 2 + 80);

      const sysItems = [
        { title: '✓ 前端界面自动生成', sub: '60fps 丝滑渲染正常' },
        { title: '✓ 后端接口全部联调', sub: '12ms 极速响应无报错' },
        { title: '✓ 24h 定时任务空转', sub: '云端容器持续计费中' }
      ];
      sysItems.forEach((item, idx) => {
        const cy = -82 + idx * 96;
        ctx.fillStyle = '#161c28';
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.30)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(-482, cy - 34, 344, 74, 12);
        ctx.fill();
        ctx.stroke();

        ctx.font = '700 14.5px "PingFang SC", sans-serif';
        ctx.fillStyle = '#f1f5f9';
        ctx.fillText(item.title, -462, cy - 10);

        ctx.font = '500 12px "PingFang SC", sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(item.sub, -462, cy + 16);

        // Smoothly spinning automated progress ring on right of each module (idling endlessly!)
        const rx = -172;
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(rx, cy + 2, 16, 0, Math.PI * 2); ctx.stroke();

        ctx.strokeStyle = '#e2e8f0';
        const spinA = t * (3.2 + idx * 0.7);
        ctx.beginPath(); ctx.arc(rx, cy + 2, 16, spinA, spinA + Math.PI * 1.35); ctx.stroke();
      });

      // -----------------------------------------------------------------------
      // RIGHT MAIN PANEL (`x = -110 .. +510`): "却没人需要" — Cliff-Drop to ZERO USERS!
      // -----------------------------------------------------------------------
      ctx.font = '700 14px "PingFang SC", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'left';
      ctx.fillText('真实用户留存与点击统计（上线 30 天）', divX + 34, -h / 2 + 80);

      // Chart Box (`x = -76 .. +476`, `y = -112 .. +176`)
      const gx = divX + 34;
      const gy = -112;
      const gw = 552;
      const gh = 286;

      ctx.fillStyle = '#090c12';
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.26)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.roundRect(gx, gy, gw, gh, 14);
      ctx.fill();
      ctx.stroke();

      // Subtle horizontal chart grid lines
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
      ctx.lineWidth = 1;
      for (let r = 1; r <= 3; r++) {
        const ly = gy + (gh / 4) * r;
        ctx.beginPath(); ctx.moveTo(gx + 20, ly); ctx.lineTo(gx + gw - 20, ly); ctx.stroke();
      }

      // Cliff-Drop Curve: Brief Day-1 curiosity blip -> Plummets straight to DEAD `0` Flatline!
      const drawProgress = E.smoothstep(E.clamp((lt - 5.75) / 1.35));
      const zeroY = gy + gh - 44;
      const pts = [
        [gx + 36, zeroY - 12],
        [gx + 72, gy + 56],    // Day 1 launch tweet spike
        [gx + 118, zeroY - 4], // Day 2 cliff drop
        [gx + 142, zeroY],     // Hits 0!
        [gx + gw - 36, zeroY]  // Dead flatline at 0 forever
      ];

      ctx.save();
      ctx.beginPath();
      ctx.rect(gx, gy, gw * drawProgress, gh);
      ctx.clip();

      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      ctx.lineTo(pts[1][0], pts[1][1]);
      ctx.lineTo(pts[2][0], pts[2][1]);
      ctx.lineTo(pts[3][0], pts[3][1]);
      ctx.lineTo(pts[4][0], pts[4][1]);
      ctx.stroke();
      ctx.restore();

      // X-Axis Day Labels
      const dayLabels = ['Day 1', 'Day 3', 'Day 7', 'Day 14', 'Day 30'];
      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'center';
      dayLabels.forEach((dl, di) => {
        ctx.fillText(dl, gx + 60 + di * 108, gy + gh - 18);
      });

      // Stark High-Contrast Callout in Center of Dead Flatline!
      const zeroBadgeAlpha = E.snappyOut(E.clamp((lt - 6.25) / 0.45));
      if (zeroBadgeAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = alpha * zeroBadgeAlpha;
        const cxZero = gx + gw * 0.58;
        const cyZero = gy + gh * 0.44;

        ctx.font = '900 36px "JetBrains Mono", "Inter", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('0 ACTIVE USERS', cxZero, cyZero - 8);

        ctx.font = '700 15px "PingFang SC", sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('代码完美跑通  ·  却没有一个人真正需要', cxZero, cyZero + 28);
        ctx.restore();
      }

      ctx.restore(); // end window clip
      ctx.restore();
    }

    // =========================================================================
    // PHASE D: ONE-TAKE MORPH -> LEFT-HALF 60FPS ENGINEERING BLUEPRINT GEARS (Locks to S08!)
    // =========================================================================
    _renderLeftBlueprintGears(ctx, t, lt, compressP) {
      ctx.save();
      ctx.globalAlpha = compressP;

      // Full-screen Engineering Blueprint Grid (Right side will be torn open by warm paper in S08!)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      for (let gx = -640; gx <= 640; gx += 32) {
        ctx.beginPath(); ctx.moveTo(gx, -360); ctx.lineTo(gx, 360); ctx.stroke();
      }
      for (let gy = -360; gy <= 360; gy += 32) {
        ctx.beginPath(); ctx.moveTo(-640, gy); ctx.lineTo(640, gy); ctx.stroke();
      }

      // Center vertical blueprint axis line (`x = 0`)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(0, -360);
      ctx.lineTo(0, 360);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3 Interlocking 60fps Precision Wireframe Gears emerging from the left-side spinning rings!
      this.gears.forEach((g, idx) => {
        const startX = -352;
        const startY = -80 + idx * 96;
        const gx = E.lerp(startX, g.cx, E.cinematicInOut(compressP));
        const gy = E.lerp(startY, g.cy, E.cinematicInOut(compressP));
        const scaleIn = E.lerp(0.25, 1.0, E.spring(compressP, 14, 0.76));
        const angle = g.phase + t * g.speed;
        this._drawPrecisionGear(ctx, gx, gy, g.r * scaleIn, g.teeth, angle);
      });

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

    _renderForeground(t, lt, ctx, width, height) {
      // Cinema monochrome vignette
      const vig = ctx.createRadialGradient(
        width * 0.5, height * 0.5, width * 0.36,
        width * 0.5, height * 0.5, width * 0.82
      );
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(0,0,0,0.56)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, width, height);

      // Sober Documentary Subtitles (Synced to Yunxi `s07` starting at `45.75s / lt = 0.55s`, zero trailing commas!)
      const subY = height - Math.max(36, height * 0.072);
      const subFont = Math.max(15, Math.round(width * 0.0175));
      ctx.save();
      ctx.font = `600 ${subFont}px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let subText = '';
      let subAlpha = 0;

      if (lt >= 0.55 && lt < 3.65) {
        subText = '可看看四周：精致却千篇一律的海报';
        subAlpha = E.smoothstep(E.invLerp(0.55, 0.78, lt)) * (1 - E.smoothstep(E.invLerp(3.42, 3.65, lt)));
      } else if (lt >= 3.70 && lt < 5.72) {
        subText = '丝滑却毫无灵魂的快剪';
        subAlpha = E.smoothstep(E.invLerp(3.70, 3.92, lt)) * (1 - E.smoothstep(E.invLerp(5.50, 5.72, lt)));
      } else if (lt >= 5.76 && lt < 8.65) {
        subText = '跑得通，却没人需要的产品……';
        subAlpha = E.smoothstep(E.invLerp(5.76, 5.98, lt)) * (1 - E.smoothstep(E.invLerp(8.30, 8.65, lt)));
      }

      if (subAlpha > 0.01 && subText) {
        const padX = 24;
        const pillH = Math.round(subFont * 1.95);
        const pillW = Math.ceil(ctx.measureText(subText).width) + padX * 2;
        ctx.globalAlpha = subAlpha;
        ctx.fillStyle = 'rgba(8, 10, 14, 0.78)';
        ctx.beginPath();
        ctx.roundRect(width / 2 - pillW / 2, subY - pillH / 2, pillW, pillH, pillH / 2);
        ctx.fill();

        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 6;
        ctx.fillStyle = 'rgba(241, 245, 249, 0.98)';
        ctx.fillText(subText, width / 2, subY + 1);
      }
      ctx.restore();
    }
  }

  window.ShotS07Shatter = ShotS07Shatter;
})();
