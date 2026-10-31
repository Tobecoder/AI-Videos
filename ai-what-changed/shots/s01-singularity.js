/**
 * SHOT S01 (00:00 - 00:05.40): 第一幕 · 提示词提问 -> 三大领域卡片裂变 -> 一镜穿卡进入 S02 设计画布
 *
 * Crystal-Clear Concrete Storytelling (Zero abstract clutter, Zero PPT cuts):
 *   [0.00 - 1.92s] Sleek AI Prompt Input Bar (`✦`) -> Types "AI 到底改变了什么？" -> Cursor clicks Send (`↑`)
 *   [1.92 - 3.95s] Prompt bar compresses & unfolds into bold editorial title + 3 concrete floating cards:
 *                  Left: [✒ 设计 Design]  |  Top-Right: [</> 编程 Code]  |  Bottom-Right: [🎞 剪辑 Video Edit]
 *   [3.95 - 5.40s] One-Take Portal Transition: Camera smoothly pans & zooms INSIDE the [✒ 设计] card,
 *                  whose miniature Bezier artboard seamlessly expands into the full-screen S02 Design Canvas!
 */
(function () {
  const E = window.MGEasing;

  class ShotS01Singularity {
    constructor(stage3D) {
      this.stage = stage3D;
      this.duration = 5.2;

      // Realistic human typing schedule for "AI 到底改变了什么？"
      this.promptSchedule = [
        { time: 0.36, str: 'A' },
        { time: 0.46, str: 'AI' },
        { time: 0.56, str: 'AI ' },
        { time: 0.68, str: 'AI 到' },
        { time: 0.78, str: 'AI 到底' },
        { time: 0.90, str: 'AI 到底改' },
        { time: 1.00, str: 'AI 到底改变' },
        { time: 1.11, str: 'AI 到底改变了' },
        { time: 1.22, str: 'AI 到底改变了什' },
        { time: 1.32, str: 'AI 到底改变了什么' },
        { time: 1.44, str: 'AI 到底改变了什么？' }
      ];

      this.titleChars = ['到', '底', '改', '变', '了', '什', '么', '？'];
    }

    _getTypedPrompt(t) {
      let current = '';
      for (let i = 0; i < this.promptSchedule.length; i++) {
        if (t >= this.promptSchedule[i].time) {
          current = this.promptSchedule[i].str;
        } else {
          break;
        }
      }
      return current;
    }

    render(t, vecCtx, fgCtx, width, height) {
      this.stage.updateS01(t);

      vecCtx.clearRect(0, 0, width, height);
      fgCtx.clearRect(0, 0, width, height);

      // Virtual 1280x720 stage scaling so proportions are rock-solid on every resolution
      const baseW = 1280;
      const baseH = 720;
      const scaleFit = Math.min(width / baseW, height / baseH);

      // =========================================================================
      // CONTINUOUS VIRTUAL CAMERA RIG (Drives smooth push, burst & S02 card dive)
      // =========================================================================
      let camX = 0;      // offset from center (640, 360) in virtual units
      let camY = 0;
      let camZoom = 1.0;
      let camRoll = 0;

      // Design Card center in virtual world coords (relative to 640, 360)
      const designCardWX = -395;
      const designCardWY = -18;

      if (t < 1.92) {
        // Gentle cinematic push-in while typing & clicking Send
        const p = E.smoothstep(t / 1.92);
        camZoom = E.lerp(0.94, 1.03, p);
      } else if (t < 3.95) {
        // Elastic punch-out on burst, then continuous slow forward drift
        const bt = t - 1.92;
        const punch = Math.exp(-bt * 6.5) * 0.06;
        const drift = (bt / 2.03) * 0.065;
        camZoom = 1.0 - punch + drift;
        camX = Math.sin(bt * 1.2) * 6;
        camY = Math.cos(bt * 0.9) * 4;
      } else {
        // [3.95s - 5.20s] ONE-TAKE PORTAL ZOOM straight into the Left Design Card (exact 4.0x = 1280x720 1:1 lock at 5.20s)!
        const zp = E.cinematicInOut(E.clamp((t - 3.95) / 1.20));
        camZoom = 1.065 * Math.pow(4.0 / 1.065, zp);
        camX = E.lerp(0, designCardWX, zp);
        camY = E.lerp(0, designCardWY, zp);
        camRoll = Math.sin(zp * Math.PI) * -0.022;
      }

      // Ambient soft radial spotlight behind active focal area
      this._renderBackdropGlow(t, vecCtx, width, height);

      vecCtx.save();
      vecCtx.translate(width / 2, height / 2);
      vecCtx.scale(scaleFit * camZoom, scaleFit * camZoom);
      vecCtx.rotate(camRoll);
      vecCtx.translate(-camX, -camY);

      // =========================================================================
      // BEAT 1 (0.00s - 2.12s): SLEEK AI PROMPT INPUT BAR + TYPING + SEND CLICK
      // =========================================================================
      if (t < 2.14) {
        this._renderPromptBarSequence(t, vecCtx);
      }

      // =========================================================================
      // BEAT 2 & 3 (1.95s - 5.40s): KINETIC TITLE + 3 TOOL CARDS + S02 PORTAL DIVE
      // =========================================================================
      if (t >= 1.94) {
        this._renderBurstAndPortalScene(t, vecCtx, designCardWX, designCardWY);
      }

      vecCtx.restore();

      // =========================================================================
      // FOREGROUND LAYER: Click Shockwave, Subtle Vignette & Cinema Subtitle
      // =========================================================================
      this._renderForeground(t, fgCtx, width, height);
    }

    _renderBackdropGlow(t, ctx, width, height) {
      const burstP = E.smoothstep(E.clamp((t - 1.92) / 0.6));
      const g = ctx.createRadialGradient(
        width * 0.5, height * 0.48, 10,
        width * 0.5, height * 0.48, width * 0.52
      );
      g.addColorStop(0, `rgba(14, 116, 190, ${0.14 + burstP * 0.10})`);
      g.addColorStop(0.55, `rgba(15, 23, 42, ${0.08 + burstP * 0.05})`);
      g.addColorStop(1, 'rgba(5, 8, 16, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);

      // Borderless full-screen studio canvas crossfade during Portal Dive -> matches S02 `#080d1a` at 5.20s!
      const portalBg = E.cinematicInOut(E.clamp((t - 3.95) / 1.20));
      if (portalBg > 0.005) {
        ctx.fillStyle = `rgba(8, 13, 26, ${portalBg})`;
        ctx.fillRect(0, 0, width, height);
      }
    }

    _renderPromptBarSequence(t, ctx) {
      // Entrance spring (0.00 -> 0.45s) & Compression into AI Spark Core (1.92 -> 2.12s)
      const enterS = E.spring(E.clamp(t / 0.48), 14, 0.68);
      const collapseP = E.cinematicInOut(E.clamp((t - 1.92) / 0.20));

      const fullW = 680;
      const barH = 74;
      const barW = E.lerp(fullW, 74, collapseP);
      const alpha = E.clamp(t / 0.18) * (1 - E.clamp((t - 2.04) / 0.10));
      if (alpha <= 0.01) return;

      ctx.save();
      ctx.globalAlpha = alpha;
      const yOffset = (1 - enterS) * 28;
      ctx.translate(0, yOffset);
      const scalePop = E.lerp(0.88, 1.0, enterS) * (1 + collapseP * 0.08);
      ctx.scale(scalePop, scalePop);

      const x0 = -barW / 2;
      const y0 = -barH / 2;
      const radius = 22;

      // Soft outer glow under the prompt bar
      ctx.shadowColor = 'rgba(0, 212, 255, 0.28)';
      ctx.shadowBlur = 34;
      ctx.fillStyle = 'rgba(13, 20, 36, 0.92)';
      ctx.beginPath();
      ctx.roundRect(x0, y0, barW, barH, radius);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Glassmorphic gradient border
      const borderGrad = ctx.createLinearGradient(x0, y0, x0 + barW, y0 + barH);
      borderGrad.addColorStop(0, 'rgba(56, 224, 255, 0.72)');
      borderGrad.addColorStop(0.5, 'rgba(148, 163, 184, 0.25)');
      borderGrad.addColorStop(1, 'rgba(99, 102, 241, 0.65)');
      ctx.strokeStyle = borderGrad;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Clip interior to rounded pill so text hides cleanly as bar collapses
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x0, y0, barW, barH, radius);
      ctx.clip();

      // 1. Left AI Sparkle Emblem `✦`
      const sparkX = collapseP > 0.01 ? E.lerp(x0 + 38, 0, collapseP) : x0 + 38;
      this._drawSparkleIcon(ctx, sparkX, 0, 14 + collapseP * 5, t * 1.4);

      // 2. Typed Prompt Text + Blinking Caret `|`
      if (collapseP < 0.65) {
        const textAlpha = 1 - collapseP / 0.65;
        const typed = this._getTypedPrompt(t);
        const textStartX = x0 + 68;

        ctx.font = '500 24px "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';

        if (!typed) {
          // Subtle placeholder before first keystroke at 0.36s
          ctx.fillStyle = `rgba(148, 163, 184, ${0.48 * textAlpha})`;
          ctx.fillText('向 AI 提问...', textStartX, 1);

          // Blinking vertical caret at start
          const caretOn = Math.floor(t * 5) % 2 === 0;
          if (caretOn) {
            ctx.fillStyle = `rgba(56, 224, 255, ${0.95 * textAlpha})`;
            ctx.fillRect(textStartX - 2, -14, 2.5, 28);
          }
        } else {
          ctx.fillStyle = `rgba(241, 245, 249, ${0.98 * textAlpha})`;
          ctx.fillText(typed, textStartX, 1);

          const textW = ctx.measureText(typed).width;
          // Caret stays solid while actively typing, blinks once finished
          const isTypingNow = t >= 0.36 && t <= 1.48;
          const caretVisible = isTypingNow || Math.floor((t - 1.48) * 6) % 2 === 0;
          if (caretVisible) {
            ctx.fillStyle = `rgba(0, 240, 255, ${0.95 * textAlpha})`;
            ctx.fillRect(textStartX + textW + 4, -14, 2.6, 28);
          }
        }

        // 3. Right Circular Send Button `↑`
        const sendReady = E.smoothstep(E.clamp((t - 1.32) / 0.2));
        const clickSquash = (t >= 1.76 && t <= 1.94)
          ? 1 - Math.sin(((t - 1.76) / 0.18) * Math.PI) * 0.20
          : 1;

        const btnX = x0 + barW - 38;
        const btnY = 0;
        const btnR = 21 * clickSquash;

        ctx.save();
        ctx.translate(btnX, btnY);
        const btnGrad = ctx.createLinearGradient(-btnR, -btnR, btnR, btnR);
        if (sendReady > 0.05) {
          btnGrad.addColorStop(0, `rgba(0, 229, 255, ${0.25 + sendReady * 0.75})`);
          btnGrad.addColorStop(1, `rgba(37, 99, 235, ${0.25 + sendReady * 0.75})`);
        } else {
          btnGrad.addColorStop(0, 'rgba(51, 65, 85, 0.65)');
          btnGrad.addColorStop(1, 'rgba(30, 41, 59, 0.65)');
        }
        ctx.fillStyle = btnGrad;
        if (sendReady > 0.4) {
          ctx.shadowColor = 'rgba(0, 229, 255, 0.65)';
          ctx.shadowBlur = 16 * sendReady;
        }
        ctx.beginPath();
        ctx.arc(0, 0, btnR, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Crisp upward arrow icon `↑`
        ctx.strokeStyle = sendReady > 0.3 ? '#ffffff' : 'rgba(148, 163, 184, 0.7)';
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        const aS = 7.5 * clickSquash;
        ctx.beginPath();
        ctx.moveTo(0, aS);
        ctx.lineTo(0, -aS);
        ctx.moveTo(-aS * 0.78, -aS * 0.2);
        ctx.lineTo(0, -aS);
        ctx.lineTo(aS * 0.78, -aS * 0.2);
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore(); // end pill clip

      // 4. Crisp Pointer Cursor gliding in & clicking Send Button (1.42s - 1.95s)
      if (t >= 1.40 && t < 1.96) {
        const moveP = E.snappyOut(E.clamp((t - 1.40) / 0.36));
        const targetX = fullW / 2 - 36;
        const targetY = 4;
        const curX = E.lerp(targetX + 110, targetX, moveP);
        const curY = E.lerp(targetY + 115, targetY, moveP);
        const curScale = (t >= 1.76 && t <= 1.92) ? 0.86 : 1.0;
        const curFade = E.clamp((t - 1.40) / 0.12) * (1 - E.clamp((t - 1.88) / 0.08));

        this._drawPointerArrow(ctx, curX, curY, curScale, curFade);
      }

      // Click ripple ring on Send button at t = 1.78s
      if (t >= 1.78 && t < 2.12) {
        const rp = (t - 1.78) / 0.34;
        ctx.strokeStyle = `rgba(0, 240, 255, ${(1 - rp) * 0.85})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(fullW / 2 - 38, 0, 21 + E.expoOut(rp) * 44, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    }

    _drawSparkleIcon(ctx, x, y, r, rot) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.sin(rot) * 0.15);
      const g = ctx.createLinearGradient(-r, -r, r, r);
      g.addColorStop(0, '#00f5ff');
      g.addColorStop(0.55, '#60a5fa');
      g.addColorStop(1, '#a855f7');
      ctx.fillStyle = g;
      ctx.shadowColor = 'rgba(0, 240, 255, 0.7)';
      ctx.shadowBlur = 12;

      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.quadraticCurveTo(0, 0, 0, r);
      ctx.quadraticCurveTo(0, 0, -r, 0);
      ctx.quadraticCurveTo(0, 0, 0, -r);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();
    }

    _drawPointerArrow(ctx, x, y, scale, alpha) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.globalAlpha = alpha;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
      ctx.shadowBlur = 10;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 24);
      ctx.lineTo(6.5, 18.5);
      ctx.lineTo(11.5, 28);
      ctx.lineTo(15.5, 26);
      ctx.lineTo(10.5, 16.8);
      ctx.lineTo(18.5, 16.8);
      ctx.closePath();

      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.restore();
    }

    // =========================================================================
    // BEAT 2 & 3: EDITORIAL TITLE + 3 CONCRETE TOOL CARDS + PORTAL ZOOM TO S02
    // =========================================================================
    _renderBurstAndPortalScene(t, ctx, designWX, designWY) {
      const bt = t - 1.94;
      const portalP = E.cinematicInOut(E.clamp((t - 3.95) / 1.20));
      const nonPortalFade = 1 - E.smoothstep(E.clamp((t - 3.95) / 0.55));

      // Initial crisp shockwave ring from center spark (1.94s - 2.65s)
      if (bt < 0.75) {
        const sp = bt / 0.75;
        ctx.save();
        ctx.strokeStyle = `rgba(56, 224, 255, ${(1 - sp) * 0.55})`;
        ctx.lineWidth = 2.2 * (1 - sp * 0.6);
        ctx.beginPath();
        ctx.arc(0, 0, E.expoOut(sp) * 440, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 3 Concrete Floating Cards positions
      const cards = [
        { id: 'design', wx: designWX, wy: designWY, w: 268, h: 162, delay: 0.10, color: '#00f0ff', title: '设计 · DESIGN', sub: '一句话生成十种视觉构图' },
        { id: 'code', wx: 392, wy: -136, w: 248, h: 138, delay: 0.17, color: '#34d399', title: '编程 · CODE', sub: '几秒钟千行代码跑通上线' },
        { id: 'edit', wx: 382, wy: 142, w: 248, h: 138, delay: 0.24, color: '#a855f7', title: '剪辑 · VIDEO', sub: '自动抠像 · 字幕 · 卡点成片' }
      ];

      // 1. Curved Luminous Energy Ribbons connecting Center Title -> 3 Tool Cards
      if (nonPortalFade > 0.01) {
        ctx.save();
        ctx.globalAlpha = nonPortalFade;
        cards.forEach((c, idx) => {
          const rP = E.snappyOut(E.clamp((bt - c.delay) / 0.55));
          if (rP <= 0) return;

          const start = { x: c.wx < 0 ? -150 : 150, y: 0 };
          const cp1 = { x: start.x + (c.wx - start.x) * 0.45, y: 0 };
          const cp2 = { x: start.x + (c.wx - start.x) * 0.55, y: c.wy };
          const end = { x: c.wx + (c.wx < 0 ? c.w * 0.48 : -c.w * 0.48), y: c.wy };

          const [a0, a1, a2, a3] = E.splitCubicBezier(start, cp1, cp2, end, rP);
          const grad = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
          grad.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
          grad.addColorStop(1, c.id === 'design' ? 'rgba(0, 240, 255, 0.55)' : c.id === 'code' ? 'rgba(52, 211, 153, 0.48)' : 'rgba(168, 85, 247, 0.48)');

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.8;
          ctx.setLineDash([5, 5]);
          ctx.lineDashOffset = -t * 42;
          ctx.beginPath();
          ctx.moveTo(a0.x, a0.y);
          ctx.bezierCurveTo(a1.x, a1.y, a2.x, a2.y, a3.x, a3.y);
          ctx.stroke();
          ctx.setLineDash([]);

          // Flowing light packet along the ribbon
          if (rP > 0.7) {
            const pulseT = ((t * 0.85 + idx * 0.33) % 1);
            const pt = E.evalCubic2D(start, cp1, cp2, end, pulseT);
            ctx.fillStyle = c.color;
            ctx.shadowColor = c.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 3.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
        ctx.restore();
      }

      // 2. Render Centerpiece Editorial Title: `AI 到底改变了什么？`
      if (nonPortalFade > 0.01) {
        this._renderCenterEditorialTitle(bt, t, ctx, nonPortalFade);
      }

      // 3. Render Code Card & Video Edit Card (fade cleanly as camera dives into Design Card)
      if (nonPortalFade > 0.01) {
        this._renderCodeToolCard(bt, t, ctx, cards[1], nonPortalFade);
        this._renderVideoToolCard(bt, t, ctx, cards[2], nonPortalFade);
      }

      // 4. Render Left DESIGN CARD — Which Seamlessly Becomes the Full-Screen S02 Workspace during Portal Dive!
      this._renderDesignPortalCard(bt, t, ctx, cards[0], portalP);
    }

    _renderCenterEditorialTitle(bt, t, ctx, fade) {
      const enter = E.spring(E.clamp((bt - 0.04) / 0.55), 14, 0.68);
      if (enter <= 0.01) return;

      ctx.save();
      ctx.globalAlpha = fade * E.clamp(bt / 0.16);
      const floatY = Math.sin(t * 1.8) * 3;
      ctx.translate(0, floatY + (1 - enter) * 22);

      // Sleek top eyebrow label
      const eyeAlpha = E.smoothstep(E.clamp((bt - 0.22) / 0.35));
      if (eyeAlpha > 0.02) {
        ctx.font = '600 13px "Inter", "PingFang SC", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = `rgba(125, 211, 252, ${0.78 * eyeAlpha})`;
        ctx.fillText('✦  THE GREAT SHIFT · 效率革命与创作边界', 0, -54);
      }

      // Layout `AI` badge + `到底改变了什么？` centered cleanly between [-225 .. +235]
      const startX = -212;

      // `AI` Glowing Cyan-Blue Badge
      const badgeW = 84;
      const badgeH = 56;
      const bx = startX;
      const by = -badgeH / 2;

      const bGrad = ctx.createLinearGradient(bx, by, bx + badgeW, by + badgeH);
      bGrad.addColorStop(0, 'rgba(0, 229, 255, 0.24)');
      bGrad.addColorStop(1, 'rgba(37, 99, 235, 0.16)');
      ctx.fillStyle = bGrad;
      ctx.strokeStyle = 'rgba(56, 224, 255, 0.85)';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = 'rgba(0, 229, 255, 0.35)';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.roundRect(bx, by, badgeW, badgeH, 13);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.font = '800 38px "Inter", "SF Pro Display", "Segoe UI", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('AI', bx + badgeW / 2, 1);

      // Per-character staggered kinetic reveal for `到底改变了什么？`
      ctx.font = '700 42px "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
      const charSpacing = 44;
      const firstCharX = bx + badgeW + 32;

      for (let i = 0; i < this.titleChars.length; i++) {
        const cAge = bt - (0.08 + i * 0.042);
        if (cAge <= 0) continue;
        const cSpring = E.spring(E.clamp(cAge / 0.48), 15, 0.68);
        const cMask = E.snappyOut(E.clamp(cAge / 0.34));
        const cx = firstCharX + i * charSpacing;
        const cy = (1 - cSpring) * 26;

        ctx.save();
        ctx.beginPath();
        ctx.rect(cx - 26, -34, 52, 68 * cMask);
        ctx.clip();

        const isQ = i === this.titleChars.length - 1;
        ctx.fillStyle = isQ ? '#38bdf8' : '#f8fafc';
        if (isQ) {
          ctx.shadowColor = 'rgba(56, 189, 248, 0.65)';
          ctx.shadowBlur = 14;
        }
        ctx.fillText(this.titleChars[i], cx, cy);
        ctx.restore();
      }

      // Clean luminous underline accent sweeping beneath the title
      const lineP = E.snappyOut(E.clamp((bt - 0.25) / 0.65));
      if (lineP > 0.01) {
        const totalW = 446 * lineP;
        const uGrad = ctx.createLinearGradient(-212, 42, -212 + totalW, 42);
        uGrad.addColorStop(0, '#00f0ff');
        uGrad.addColorStop(0.65, 'rgba(99, 102, 241, 0.75)');
        uGrad.addColorStop(1, 'rgba(99, 102, 241, 0)');
        ctx.strokeStyle = uGrad;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(-212, 42);
        ctx.lineTo(-212 + totalW, 42);
        ctx.stroke();
      }

      ctx.restore();
    }

    _renderCodeToolCard(bt, t, ctx, card, fade) {
      const age = bt - card.delay;
      if (age <= 0) return;
      const pop = E.spring(E.clamp(age / 0.58), 14, 0.68);
      const hoverY = Math.sin(t * 2.1 + 1.2) * 5;

      ctx.save();
      ctx.globalAlpha = fade * E.clamp(age / 0.18);
      ctx.translate(card.wx * E.snappyOut(E.clamp(age / 0.48)), card.wy * E.snappyOut(E.clamp(age / 0.48)) + hoverY);
      ctx.scale(0.65 + 0.35 * pop, 0.65 + 0.35 * pop);

      const x0 = -card.w / 2, y0 = -card.h / 2;
      this._drawGlassCardShell(ctx, x0, y0, card.w, card.h, 'rgba(52, 211, 153, 0.55)');

      // Header: macOS window dots + `</> 编程 · CODE`
      const dotColors = ['#fb7185', '#fbbf24', '#34d399'];
      dotColors.forEach((dc, idx) => {
        ctx.fillStyle = dc;
        ctx.beginPath();
        ctx.arc(x0 + 18 + idx * 11, y0 + 20, 3.3, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.font = '700 13px "PingFang SC", "Inter", sans-serif';
      ctx.fillStyle = '#6ee7b7';
      ctx.textAlign = 'right';
      ctx.fillText('</>  编程 · CODE', x0 + card.w - 16, y0 + 24);

      // Animated cascading syntax code bars inside miniature IDE
      const lines = [
        { indent: 0, w: 78, col: '#38bdf8' },
        { indent: 16, w: 128, col: '#34d399' },
        { indent: 32, w: 104, col: '#a78bfa' },
        { indent: 16, w: 142, col: '#6ee7b7' },
        { indent: 0, w: 64, col: '#94a3b8' }
      ];
      lines.forEach((ln, idx) => {
        const grow = E.snappyOut(E.clamp((age - 0.18 - idx * 0.06 + Math.sin(t * 3 + idx) * 0.04) / 0.35));
        const ly = y0 + 44 + idx * 15;
        ctx.fillStyle = ln.col;
        ctx.globalAlpha = fade * 0.85;
        ctx.beginPath();
        ctx.roundRect(x0 + 18 + ln.indent, ly, Math.max(8, ln.w * grow), 7, 3.5);
        ctx.fill();
      });

      ctx.globalAlpha = fade * 0.78;
      ctx.font = '500 11.5px "PingFang SC", sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.textAlign = 'left';
      ctx.fillText(card.sub, x0 + 18, y0 + card.h - 14);

      ctx.restore();
    }

    _renderVideoToolCard(bt, t, ctx, card, fade) {
      const age = bt - card.delay;
      if (age <= 0) return;
      const pop = E.spring(E.clamp(age / 0.58), 14, 0.68);
      const hoverY = Math.cos(t * 1.9 + 2.4) * 5;

      ctx.save();
      ctx.globalAlpha = fade * E.clamp(age / 0.18);
      ctx.translate(card.wx * E.snappyOut(E.clamp(age / 0.48)), card.wy * E.snappyOut(E.clamp(age / 0.48)) + hoverY);
      ctx.scale(0.65 + 0.35 * pop, 0.65 + 0.35 * pop);

      const x0 = -card.w / 2, y0 = -card.h / 2;
      this._drawGlassCardShell(ctx, x0, y0, card.w, card.h, 'rgba(168, 85, 247, 0.55)');

      // Header
      ctx.font = '700 13px "PingFang SC", "Inter", sans-serif';
      ctx.fillStyle = '#d8b4fe';
      ctx.textAlign = 'left';
      ctx.fillText('🎬  剪辑 · VIDEO EDIT', x0 + 16, y0 + 24);

      // Multi-track Video NLE Timeline clips + Audio Waveform + Moving Playhead!
      const trackX = x0 + 16;
      const trackW = card.w - 32;

      // Track 1: Video clips
      ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      [
        { x: 0, w: 68 },
        { x: 74, w: 56 },
        { x: 136, w: 78 }
      ].forEach((clip) => {
        ctx.beginPath();
        ctx.roundRect(trackX + clip.x, y0 + 40, clip.w, 16, 4);
        ctx.fill();
        ctx.stroke();
      });

      // Track 2: B-roll / Subtitle bar
      ctx.fillStyle = 'rgba(192, 132, 252, 0.35)';
      ctx.strokeStyle = '#c084fc';
      ctx.beginPath();
      ctx.roundRect(trackX + 24, y0 + 62, 148, 12, 4);
      ctx.fill();
      ctx.stroke();

      // Track 3: Animated Audio Waveform Bars
      const barCount = 28;
      for (let b = 0; b < barCount; b++) {
        const bx = trackX + b * (trackW / barCount) + 2;
        const amp = 4 + Math.abs(Math.sin(b * 0.7 + t * 6.5)) * 14;
        ctx.fillStyle = b % 4 === 0 ? '#00f5ff' : 'rgba(168, 85, 247, 0.75)';
        ctx.fillRect(bx, y0 + 90 - amp / 2, 3.2, amp);
      }

      // Sweeping Playhead needle
      const phX = trackX + ((t * 58) % trackW);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(phX, y0 + 36);
      ctx.lineTo(phX, y0 + 102);
      ctx.stroke();

      ctx.globalAlpha = fade * 0.78;
      ctx.font = '500 11.5px "PingFang SC", sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.textAlign = 'left';
      ctx.fillText(card.sub, x0 + 16, y0 + card.h - 14);

      ctx.restore();
    }

    /**
     * LEFT DESIGN CARD & SEAMLESS PORTAL TRANSITION INTO S02!
     * High-craft Designer Elements (drawn in native high-res coordinate space via 0.25x sub-scaling
     * so strokes, gradients, and fonts never suffer from sub-8px browser font hinting!):
     *   - Stage A (2.00-4.30s): Blueprint Wireframe of 3D Studio Headphones Card -> swept by `✦ AI` scan bar -> Glossy 3D Product & UI Render!
     *   - Stage B (4.30-5.60s): 1 Draft fans out into 5 Designer-Grade Showcases:
     *       [01 品牌标志 VI]  [02 3D 视觉海报]  [✦ 03 灵动岛 App UI]  [04 产品商业主图]  [05 插画画刊封面]
     */
    _renderDesignPortalCard(bt, t, ctx, card, portalP) {
      const age = bt - card.delay;
      if (age <= 0) return;

      const pop = E.spring(E.clamp(age / 0.58), 14, 0.68);
      const hoverY = Math.sin(t * 2.0) * 5 * (1 - portalP);

      const curX = card.wx * E.snappyOut(E.clamp(age / 0.48));
      const curY = card.wy * E.snappyOut(E.clamp(age / 0.48)) + hoverY;

      ctx.save();
      ctx.globalAlpha = E.clamp(age / 0.18);
      ctx.translate(curX, curY);
      const s = 0.65 + 0.35 * pop;
      ctx.scale(s, s);

      const w = E.lerp(card.w, 320, portalP);
      const h = E.lerp(card.h, 180, portalP);
      const x0 = -w / 2;
      const y0 = -h / 2;

      // Hide the outer card border & rectangular shell completely during `穿卡进入设计` (t >= 3.95s)!
      const shellAlpha = 1 - E.smoothstep(E.clamp((t - 3.75) / 0.20));
      if (shellAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha *= shellAlpha;
        this._drawGlassCardShell(ctx, x0, y0, w, h, `rgba(0, 240, 255, ${0.62 * shellAlpha})`, shellAlpha);
        ctx.restore();
      }

      ctx.save();
      if (shellAlpha > 0.01) {
        ctx.beginPath();
        ctx.roundRect(x0, y0, w, h, 16);
        ctx.clip();
      }

      // Switch to 4x high-resolution internal coordinate system (W = 4*w, H = 4*h => up to 1280x720!)
      // This guarantees crisp 14px-28px DirectWrite typography and detailed vector illustration at all zoom levels!
      ctx.save();
      ctx.scale(0.25, 0.25);
      const W = w * 4;
      const H = h * 4;
      const X0 = -W / 2;
      const Y0 = -H / 2;

      // Subtle architectural grid: inside thumbnail before 3.95s, borderless infinite grid during Portal Dive!
      if (shellAlpha > 0.01) {
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.07 * shellAlpha})`;
        ctx.lineWidth = 1.4;
        for (let gx = X0; gx <= X0 + W; gx += 64) {
          ctx.beginPath(); ctx.moveTo(gx, Y0); ctx.lineTo(gx, Y0 + H); ctx.stroke();
        }
        for (let gy = Y0; gy <= Y0 + H; gy += 64) {
          ctx.beginPath(); ctx.moveTo(X0, gy); ctx.lineTo(X0 + W, gy); ctx.stroke();
        }
      }
      if (portalP > 0.01) {
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.13 * portalP})`;
        ctx.lineWidth = 1.4;
        const spanX = 960;
        const spanY = 620;
        for (let gx = -spanX; gx <= spanX; gx += 64) {
          ctx.beginPath(); ctx.moveTo(gx, -spanY); ctx.lineTo(gx, spanY); ctx.stroke();
        }
        for (let gy = -spanY; gy <= spanY; gy += 64) {
          ctx.beginPath(); ctx.moveTo(-spanX, gy); ctx.lineTo(spanX, gy); ctx.stroke();
        }
      }

      // Thumbnail Card Header (fades smoothly as camera dives inside)
      const chromeAlpha = 1 - E.clamp(portalP / 0.50);
      if (chromeAlpha > 0.02) {
        ctx.save();
        ctx.globalAlpha = chromeAlpha;

        // Custom geometric layered diamond design emblem (no emoji!)
        this._drawDesignLayersIcon(ctx, X0 + 82, Y0 + 74, 24);

        ctx.font = '700 50px "PingFang SC", "Inter", sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('设计 · DESIGN', X0 + 122, Y0 + 76);

        // Sleek Color Wheel Ring + Swatch Pills on top-right
        const swatchCols = ['#00f5ff', '#f43f5e', '#fbbf24', '#a855f7'];
        swatchCols.forEach((scCol, i) => {
          ctx.fillStyle = scCol;
          ctx.beginPath();
          ctx.arc(X0 + W - 216 + i * 50, Y0 + 74, 15, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.font = '500 44px "PingFang SC", sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.textAlign = 'left';
        ctx.fillText(card.sub, X0 + 64, Y0 + H - 46);
        ctx.restore();
      }

      // =========================================================================
      // STAGE A (2.00s - 4.30s): WIREFRAME HEADPHONE PRODUCT CARD -> AI SCAN -> LUSH 3D RENDER!
      // =========================================================================
      const singleFade = 1 - E.smoothstep(E.clamp((t - 4.26) / 0.30));
      if (singleFade > 0.01) {
        this._drawHeadphoneSplitScan(ctx, t, portalP, singleFade);
      }

      // =========================================================================
      // STAGE B (4.28s - 5.60s): 5 HIGH-CRAFT DESIGN SHOWCASES FAN OUT IN 1264x720!
      // =========================================================================
      if (t >= 4.26) {
        this._drawFiveDesignShowcases(ctx, t);
      }

      ctx.restore(); // end 0.25x high-res space
      ctx.restore(); // end card clip
      ctx.restore();
    }

    _drawDesignLayersIcon(ctx, cx, cy, r) {
      ctx.save();
      ctx.translate(cx, cy);
      // Top cyan diamond
      ctx.fillStyle = '#00f5ff';
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.85);
      ctx.lineTo(r, -r * 0.2);
      ctx.lineTo(0, r * 0.45);
      ctx.lineTo(-r, -r * 0.2);
      ctx.closePath();
      ctx.fill();

      // Bottom violet layer chevron
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(-r * 0.9, r * 0.28);
      ctx.lineTo(0, r * 0.88);
      ctx.lineTo(r * 0.9, r * 0.28);
      ctx.stroke();
      ctx.restore();
    }

    _drawHeadphoneSplitScan(ctx, t, portalP, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;

      const fw = E.lerp(860, 660, E.clamp(portalP * 1.4));
      const fh = E.lerp(348, 390, E.clamp(portalP * 1.4));
      const fyOffset = E.lerp(8, 0, E.clamp(portalP * 1.5));
      const fx = -fw / 2;
      const fy = -fh / 2 + fyOffset;

      const scanRatio = portalP < 0.15
        ? 0.24 + 0.58 * (0.5 + 0.5 * Math.sin(t * 2.8 - 0.5))
        : E.clamp(0.38 + portalP * 0.95, 0, 1);
      const scanX = fx + fw * scanRatio;

      const hcx = fx + fw * 0.28;
      const hcy = fy + fh * 0.52;
      const hr = fh * 0.28;

      // ---------------------------------------------------------
      // 1) RIGHT OF SCAN: CAD / Blueprint Wireframe Draft (`线框草图`)
      // ---------------------------------------------------------
      ctx.save();
      ctx.beginPath();
      ctx.rect(scanX, fy, fx + fw - scanX, fh);
      ctx.clip();

      ctx.fillStyle = '#0b1324';
      ctx.beginPath();
      ctx.roundRect(fx, fy, fw, fh, 26);
      ctx.fill();

      // Blueprint construction grid & circles around headphone silhouette
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.arc(hcx, hcy, hr * 1.28, 0, Math.PI * 2);
      ctx.moveTo(hcx - hr * 1.45, hcy); ctx.lineTo(hcx + hr * 1.45, hcy);
      ctx.moveTo(hcx, hcy - hr * 1.45); ctx.lineTo(hcx, hcy + hr * 1.45);
      ctx.stroke();
      ctx.setLineDash([]);

      // Wireframe Studio Headphones outline!
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.72)';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(hcx, hcy + 6, hr * 0.85, Math.PI, 0);
      ctx.stroke();
      // Wireframe left & right earcups
      ctx.beginPath();
      ctx.roundRect(hcx - hr * 1.02, hcy - 4, hr * 0.36, hr * 0.82, 14);
      ctx.roundRect(hcx + hr * 0.66, hcy - 4, hr * 0.36, hr * 0.82, 14);
      ctx.stroke();

      // Right-half wireframe UI skeleton
      const tx = fx + fw * 0.54;
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(tx, fy + 52, 128, 30);
      ctx.fillStyle = 'rgba(148, 163, 184, 0.38)';
      ctx.fillRect(tx, fy + 104, fw * 0.36, 26);
      ctx.fillStyle = 'rgba(148, 163, 184, 0.22)';
      ctx.fillRect(tx, fy + 148, fw * 0.28, 16);
      ctx.fillRect(tx, fy + 176, fw * 0.32, 16);
      ctx.strokeRect(tx, fy + fh - 92, 168, 48);
      ctx.restore();

      // ---------------------------------------------------------
      // 2) LEFT OF SCAN: Lush Aurora 3D Rendered Product & UI Card!
      // ---------------------------------------------------------
      ctx.save();
      ctx.beginPath();
      ctx.rect(fx, fy, Math.max(0, scanX - fx), fh);
      ctx.clip();

      // Rich Aurora Midnight -> Electric Indigo -> Rose Mesh Backdrop
      const bg = ctx.createLinearGradient(fx, fy, fx + fw, fy + fh);
      bg.addColorStop(0, '#0f172a');
      bg.addColorStop(0.45, '#1e1b4b');
      bg.addColorStop(1, '#701a75');
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.roundRect(fx, fy, fw, fh, 26);
      ctx.fill();

      // Ambient cyan & coral glow orbs behind headphones
      const orb1 = ctx.createRadialGradient(hcx - 24, hcy - 20, 8, hcx, hcy, hr * 1.55);
      orb1.addColorStop(0, 'rgba(0, 245, 255, 0.55)');
      orb1.addColorStop(0.55, 'rgba(99, 102, 241, 0.28)');
      orb1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = orb1;
      ctx.beginPath();
      ctx.arc(hcx, hcy, hr * 1.55, 0, Math.PI * 2);
      ctx.fill();

      // 3D Glossy Studio Headphones Render!
      // Metallic headband arch
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(hcx, hcy + 8, hr * 0.84, Math.PI * 1.04, -Math.PI * 0.04);
      ctx.stroke();

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(hcx, hcy + 8, hr * 0.89, Math.PI * 1.12, -Math.PI * 0.12);
      ctx.stroke();

      // Glossy 3D Left & Right Earcups with specular gradient
      [-1, 1].forEach((side) => {
        const ex = side < 0 ? hcx - hr * 1.04 : hcx + hr * 0.64;
        const ey = hcy - 8;
        const ew = hr * 0.40;
        const eh = hr * 0.88;

        const cupG = ctx.createLinearGradient(ex, ey, ex + ew, ey + eh);
        cupG.addColorStop(0, '#38bdf8');
        cupG.addColorStop(0.5, '#2563eb');
        cupG.addColorStop(1, '#1e1b4b');
        ctx.fillStyle = cupG;
        ctx.shadowColor = 'rgba(0, 240, 255, 0.45)';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.roundRect(ex, ey, ew, eh, 18);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Specular highlight strip on earcup
        ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.beginPath();
        ctx.roundRect(ex + ew * 0.22, ey + 10, ew * 0.18, eh - 20, 6);
        ctx.fill();
      });

      // Right-half Finished High-Craft UI Typography & CTA Button
      const rtx = fx + fw * 0.54;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(rtx, fy + 48, 146, 34, 17);
      ctx.fill();
      ctx.stroke();

      ctx.font = '700 18px "Inter", sans-serif';
      ctx.fillStyle = '#7dd3fc';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✦ AI STUDIO', rtx + 73, fy + 65);

      ctx.font = '800 34px "Inter", "PingFang SC", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText('SONIC PRO', rtx, fy + 118);

      ctx.fillStyle = 'rgba(226, 232, 240, 0.75)';
      ctx.beginPath();
      ctx.roundRect(rtx, fy + 150, fw * 0.30, 12, 6);
      ctx.roundRect(rtx, fy + 172, fw * 0.22, 12, 6);
      ctx.fill();

      // Vibrant gradient CTA pill button
      const ctaG = ctx.createLinearGradient(rtx, fy + fh - 94, rtx + 176, fy + fh - 44);
      ctaG.addColorStop(0, '#00f5ff');
      ctaG.addColorStop(1, '#ec4899');
      ctx.fillStyle = ctaG;
      ctx.beginPath();
      ctx.roundRect(rtx, fy + fh - 92, 174, 48, 24);
      ctx.fill();

      ctx.font = '700 20px "Inter", "PingFang SC", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('立即体验  →', rtx + 87, fy + fh - 68);
      ctx.restore();

      // Clean glassmorphic rounded border (no clunky corner squares!)
      const frameRim = ctx.createLinearGradient(fx, fy, fx + fw, fy + fh);
      frameRim.addColorStop(0, 'rgba(56, 224, 255, 0.85)');
      frameRim.addColorStop(0.5, 'rgba(148, 163, 184, 0.35)');
      frameRim.addColorStop(1, 'rgba(168, 85, 247, 0.75)');
      ctx.strokeStyle = frameRim;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(fx, fy, fw, fh, 26);
      ctx.stroke();

      // Glowing Vertical `✦ AI` Scan Beam
      if (scanRatio > 0.03 && scanRatio < 0.98) {
        const beamGlow = ctx.createLinearGradient(scanX - 36, 0, scanX + 36, 0);
        beamGlow.addColorStop(0, 'rgba(0, 245, 255, 0)');
        beamGlow.addColorStop(0.5, 'rgba(0, 245, 255, 0.38)');
        beamGlow.addColorStop(1, 'rgba(0, 245, 255, 0)');
        ctx.fillStyle = beamGlow;
        ctx.fillRect(scanX - 36, fy, 72, fh);

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 5;
        ctx.shadowColor = '#00f5ff';
        ctx.shadowBlur = 24;
        ctx.beginPath();
        ctx.moveTo(scanX, fy - 14);
        ctx.lineTo(scanX, fy + fh + 14);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      ctx.restore();
    }

    /**
     * STAGE B (4.26s - 5.60s): 5 HIGH-AESTHETIC DESIGN SHOWCASE PIECES IN 1264x720 NATIVE SPACE!
     */
    _drawFiveDesignShowcases(ctx, t) {
      // Top floating AI prompt pill (dynamically sized to text width + 72px padding!)
      const topP = E.snappyOut(E.clamp((t - 4.34) / 0.45));
      if (topP > 0.02) {
        ctx.save();
        ctx.globalAlpha = topP;
        ctx.font = '600 22px "PingFang SC", "Inter", sans-serif';
        const pillTxt = '✦  一句话生成：品牌 VI · 3D 海报 · App UI · 产品主图 · 插画封面';
        const pillW = Math.ceil(ctx.measureText(pillTxt).width) + 72;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
        ctx.strokeStyle = 'rgba(56, 224, 255, 0.65)';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.roundRect(-pillW / 2, -262, pillW, 56, 28);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#e0f2fe';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pillTxt, 0, -234);
        ctx.restore();
      }

      const specs = [
        { dx: -446, dy: 28, rot: -0.055, kind: 'logo', label: '01 · 品牌标志 VI' },
        { dx: -226, dy: 12, rot: -0.025, kind: 'poster3d', label: '02 · 3D 视觉海报' },
        { dx: 0, dy: 2, rot: 0.0, kind: 'iphone', label: '✦ 03 · 交互界面 UI', hero: true },
        { dx: 226, dy: 12, rot: 0.025, kind: 'product', label: '04 · 商业产品主图' },
        { dx: 446, dy: 28, rot: 0.055, kind: 'editorial', label: '05 · 插画书籍封面' }
      ];

      // Draw outer cards first, center Hero iPhone UI card last on top!
      [0, 4, 1, 3, 2].forEach((idx) => {
        const sp = specs[idx];
        const delay = Math.abs(idx - 2) * 0.075;
        const vp = E.spring(E.clamp((t - 4.28 - delay) / 0.58), 14, 0.68);
        if (vp <= 0.01) return;

        ctx.save();
        ctx.translate(sp.dx * vp, sp.dy * vp + 26);
        ctx.rotate(sp.rot * vp);
        const cardScale = (sp.hero ? 1.08 : 0.94) * E.clamp(vp * 1.04, 0, 1.08);
        ctx.scale(cardScale, cardScale);

        const cw = 192;
        const ch = 278;
        const cx0 = -cw / 2;
        const cy0 = -ch / 2;

        ctx.shadowColor = 'rgba(0, 0, 0, 0.62)';
        ctx.shadowBlur = 34;
        ctx.shadowOffsetY = 14;

        if (sp.kind === 'logo') {
          this._drawShowcaseLogoVI(ctx, cx0, cy0, cw, ch);
        } else if (sp.kind === 'poster3d') {
          this._drawShowcase3DPoster(ctx, cx0, cy0, cw, ch, t);
        } else if (sp.kind === 'iphone') {
          this._drawShowcaseIPhoneUI(ctx, cx0, cy0, cw, ch, t);
        } else if (sp.kind === 'product') {
          this._drawShowcaseProductKV(ctx, cx0, cy0, cw, ch);
        } else {
          this._drawShowcaseEditorialCover(ctx, cx0, cy0, cw, ch);
        }

        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // Crisp label below each card
        ctx.font = '600 20px "PingFang SC", "Inter", sans-serif';
        ctx.fillStyle = sp.hero ? '#38bdf8' : 'rgba(226, 232, 240, 0.86)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sp.label, 0, cy0 + ch + 30);

        ctx.restore();
      });
    }

    // Card 01: Brand Logo Golden-Ratio Grid & Pantone Swatches
    _drawShowcaseLogoVI(ctx, x, y, w, h) {
      const g = ctx.createLinearGradient(x, y, x + w, y + h);
      g.addColorStop(0, '#06201e');
      g.addColorStop(1, '#091122');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 20);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 20);
      ctx.clip();

      const lcx = 0, lcy = -26;
      // Golden ratio construction grid & circles
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(lcx - 56, lcy - 56, 112, 112);
      ctx.beginPath();
      ctx.arc(lcx, lcy, 56, 0, Math.PI * 2);
      ctx.arc(lcx, lcy, 34, 0, Math.PI * 2);
      ctx.moveTo(lcx - 68, lcy); ctx.lineTo(lcx + 68, lcy);
      ctx.moveTo(lcx, lcy - 68); ctx.lineTo(lcx, lcy + 68);
      ctx.stroke();

      // Sleek Geometric Mobius / Wing Brand Emblem
      const lg = ctx.createLinearGradient(-46, lcy - 44, 46, lcy + 44);
      lg.addColorStop(0, '#34d399');
      lg.addColorStop(0.5, '#00f5ff');
      lg.addColorStop(1, '#3b82f6');
      ctx.strokeStyle = lg;
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(lcx - 16, lcy, 24, Math.PI * 0.25, Math.PI * 1.75);
      ctx.arc(lcx + 16, lcy, 24, Math.PI * 1.25, Math.PI * 0.75);
      ctx.stroke();

      // Pantone Color Swatch Chips at bottom
      const chips = ['#34d399', '#00f5ff', '#3b82f6'];
      chips.forEach((col, i) => {
        const cxp = x + 18 + i * 54;
        const cyp = y + h - 72;
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.roundRect(cxp, cyp, 46, 36, 7);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cxp, cyp + 25, 46, 11);
      });

      ctx.restore();
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.55)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 20);
      ctx.stroke();
    }

    // Card 02: 3D Glossy Torus & Iridescent Sphere Key-Visual Poster
    _drawShowcase3DPoster(ctx, x, y, w, h, t) {
      const g = ctx.createLinearGradient(x, y, x + w, y + h);
      g.addColorStop(0, '#1e1b4b');
      g.addColorStop(0.55, '#4c1d95');
      g.addColorStop(1, '#be185d');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 20);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 20);
      ctx.clip();

      // Editorial Masthead
      ctx.font = '800 22px "Inter", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText('VISION', x + 18, y + 34);
      ctx.font = '600 14px "Inter", sans-serif';
      ctx.fillStyle = '#f9a8d4';
      ctx.textAlign = 'right';
      ctx.fillText('2026', x + w - 18, y + 32);

      // 3D Iridescent Torus Ring
      ctx.save();
      ctx.translate(0, 6);
      ctx.rotate(-0.35 + Math.sin(t * 2) * 0.05);
      const rg = ctx.createLinearGradient(-64, -28, 64, 28);
      rg.addColorStop(0, '#00f5ff');
      rg.addColorStop(0.5, '#f472b6');
      rg.addColorStop(1, '#fde047');
      ctx.strokeStyle = rg;
      ctx.lineWidth = 18;
      ctx.beginPath();
      ctx.ellipse(0, 0, 58, 28, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Floating 3D Pearl Sphere in center
      const sg = ctx.createRadialGradient(-10, -8, 3, 0, 2, 30);
      sg.addColorStop(0, '#ffffff');
      sg.addColorStop(0.45, '#93c5fd');
      sg.addColorStop(1, '#312e81');
      ctx.fillStyle = sg;
      ctx.beginPath();
      ctx.arc(0, 2, 26, 0, Math.PI * 2);
      ctx.fill();

      // Editorial bottom caption lines
      ctx.fillStyle = 'rgba(255,255,255,0.88)';
      ctx.fillRect(x + 18, y + h - 52, 92, 8);
      ctx.fillStyle = 'rgba(255,255,255,0.48)';
      ctx.fillRect(x + 18, y + h - 36, 134, 5);
      ctx.fillRect(x + 18, y + h - 26, 76, 5);

      ctx.restore();
      ctx.strokeStyle = 'rgba(244, 114, 182, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 20);
      ctx.stroke();
    }

    // Card 03 (CENTER HERO): Bezel-less iPhone Mockup with Dynamic Island & Bento App UI!
    _drawShowcaseIPhoneUI(ctx, x, y, w, h, t) {
      // Sleek Titanium Bezel + Dark OLED Screen
      ctx.fillStyle = '#090d1a';
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 30);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x + 6, y + 6, w - 12, h - 12, 25);
      ctx.clip();

      // Dynamic Island Pill at top
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.roundRect(-28, y + 14, 56, 14, 7);
      ctx.fill();

      // Hero Gradient Analytics / Creative Card inside App
      const hg = ctx.createLinearGradient(x + 14, y + 38, x + w - 14, y + 126);
      hg.addColorStop(0, '#0284c7');
      hg.addColorStop(0.55, '#4f46e5');
      hg.addColorStop(1, '#9333ea');
      ctx.fillStyle = hg;
      ctx.beginPath();
      ctx.roundRect(x + 14, y + 38, w - 28, 88, 16);
      ctx.fill();

      ctx.font = '700 13px "Inter", sans-serif';
      ctx.fillStyle = 'rgba(224, 242, 254, 0.85)';
      ctx.textAlign = 'left';
      ctx.fillText('CREATIVE PULSE', x + 26, y + 60);

      ctx.font = '800 24px "Inter", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('+248%', x + 26, y + 86);

      // Glowing smooth sparkline curve inside Hero Card
      ctx.strokeStyle = '#67e8f9';
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      const sx0 = x + 26;
      ctx.moveTo(sx0, y + 112);
      ctx.bezierCurveTo(sx0 + 38, y + 114, sx0 + 52, y + 92, sx0 + 88, y + 96);
      ctx.bezierCurveTo(sx0 + 112, y + 98, sx0 + 122, y + 72, sx0 + 140, y + 68);
      ctx.stroke();

      // Two Bento Grid Widgets side-by-side
      // Left widget: Circular Progress Ring `86%`
      ctx.fillStyle = 'rgba(30, 41, 59, 0.88)';
      ctx.beginPath();
      ctx.roundRect(x + 14, y + 136, 78, 82, 14);
      ctx.roundRect(x + 100, y + 136, 78, 82, 14);
      ctx.fill();

      const rcx = x + 53, rcy = y + 177;
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(rcx, rcy, 22, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#00f5ff';
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(rcx, rcy, 22, -Math.PI * 0.5, Math.PI * (1.15 + Math.sin(t * 2) * 0.08));
      ctx.stroke();

      ctx.font = '700 13px "Inter", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('86%', rcx, rcy + 1);

      // Right widget: Theme Swatch Cards
      ['#38bdf8', '#f43f5e', '#fbbf24'].forEach((col, i) => {
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.roundRect(x + 112, y + 148 + i * 21, 54, 14, 7);
        ctx.fill();
      });

      // Bottom Floating Glass Dock Bar
      ctx.fillStyle = 'rgba(51, 65, 85, 0.65)';
      ctx.beginPath();
      ctx.roundRect(x + 22, y + h - 42, w - 44, 24, 12);
      ctx.fill();
      [-42, -14, 14, 42].forEach((dx, idx) => {
        ctx.fillStyle = idx === 1 ? '#00f5ff' : 'rgba(226, 232, 240, 0.65)';
        ctx.beginPath();
        ctx.arc(dx, y + h - 30, 4.5, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      // Sleek Titanium-Cyan Specular Bezel Rim on Hero iPhone (clean rounded silhouette, no corner blocks!)
      const bezelGrad = ctx.createLinearGradient(x, y, x + w, y + h);
      bezelGrad.addColorStop(0, '#7dd3fc');
      bezelGrad.addColorStop(0.45, '#38bdf8');
      bezelGrad.addColorStop(1, '#818cf8');
      ctx.strokeStyle = bezelGrad;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 30);
      ctx.stroke();

      // Subtle inner glass hairline highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(x + 4, y + 4, w - 8, h - 8, 27);
      ctx.stroke();
    }

    // Card 04: Studio Spotlit Minimalist Perfume / Essence Bottle Commercial KV
    _drawShowcaseProductKV(ctx, x, y, w, h) {
      const g = ctx.createLinearGradient(x, y, x, y + h);
      g.addColorStop(0, '#451a03');
      g.addColorStop(0.55, '#9a3412');
      g.addColorStop(1, '#1c1917');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 20);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 20);
      ctx.clip();

      // Warm radial studio backlight
      const spot = ctx.createRadialGradient(0, -10, 8, 0, 0, 96);
      spot.addColorStop(0, 'rgba(253, 224, 71, 0.55)');
      spot.addColorStop(1, 'rgba(251, 146, 60, 0)');
      ctx.fillStyle = spot;
      ctx.beginPath();
      ctx.arc(0, 0, 96, 0, Math.PI * 2);
      ctx.fill();

      // Cylindrical Studio Pedestal
      ctx.fillStyle = '#292524';
      ctx.fillRect(-62, 68, 124, 56);
      ctx.fillStyle = '#57534e';
      ctx.beginPath();
      ctx.ellipse(0, 68, 62, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // Sleek Glass Perfume Bottle + Metallic Gold Cap + Label!
      const bg = ctx.createLinearGradient(-34, -36, 34, 62);
      bg.addColorStop(0, 'rgba(254, 240, 138, 0.92)');
      bg.addColorStop(0.5, 'rgba(249, 115, 22, 0.85)');
      bg.addColorStop(1, 'rgba(154, 52, 18, 0.95)');
      ctx.fillStyle = bg;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.roundRect(-34, -26, 68, 88, 14);
      ctx.fill();
      ctx.stroke();

      // Bottle neck & gold cap
      ctx.fillStyle = '#fde047';
      ctx.fillRect(-10, -40, 20, 14);
      ctx.beginPath();
      ctx.roundRect(-18, -62, 36, 22, 5);
      ctx.fill();

      // Minimalist white cream front label on bottle
      ctx.fillStyle = '#fffbeb';
      ctx.fillRect(-22, -2, 44, 42);
      ctx.fillStyle = '#1c1917';
      ctx.font = '800 11px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('AURA', 0, 16);
      ctx.fillRect(-12, 26, 24, 2.5);

      ctx.restore();
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.55)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 20);
      ctx.stroke();
    }

    // Card 05: Editorial Sunset Mountain & Waves Book / Magazine Cover
    _drawShowcaseEditorialCover(ctx, x, y, w, h) {
      ctx.fillStyle = '#faf3e0';
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 20);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 20);
      ctx.clip();

      // Framed Illustration Window inside cream editorial cover
      const ix = x + 16, iy = y + 48, iw = w - 32, ih = h - 92;
      const sky = ctx.createLinearGradient(ix, iy, ix, iy + ih);
      sky.addColorStop(0, '#fda4af');
      sky.addColorStop(0.55, '#fed7aa');
      sky.addColorStop(1, '#1e3a8a');
      ctx.fillStyle = sky;
      ctx.fillRect(ix, iy, iw, ih);

      // Crimson Rising Sun
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(0, iy + 64, 30, 0, Math.PI * 2);
      ctx.fill();

      // Layered Indigo Mountain Silhouettes
      ctx.fillStyle = '#312e81';
      ctx.beginPath();
      ctx.moveTo(ix, iy + ih);
      ctx.lineTo(ix + 46, iy + 92);
      ctx.lineTo(ix + 104, iy + 132);
      ctx.lineTo(ix + 138, iy + 104);
      ctx.lineTo(ix + iw, iy + ih);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(ix, iy + ih);
      ctx.lineTo(ix + 82, iy + 118);
      ctx.lineTo(ix + iw, iy + 148);
      ctx.lineTo(ix + iw, iy + ih);
      ctx.closePath();
      ctx.fill();

      // Crisp Dark Editorial Masthead & Footer on Cream Border
      ctx.font = '800 18px "Inter", serif';
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'center';
      ctx.fillText('ART & FORM', 0, y + 29);

      ctx.fillStyle = '#475569';
      ctx.fillRect(-38, y + h - 26, 76, 4);

      ctx.restore();
      ctx.strokeStyle = 'rgba(248, 250, 252, 0.65)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 20);
      ctx.stroke();
    }

    _drawGlassCardShell(ctx, x, y, w, h, borderColor, shadowStrength = 1) {
      if (shadowStrength > 0.05) {
        ctx.shadowColor = `rgba(0, 0, 0, ${0.55 * shadowStrength})`;
        ctx.shadowBlur = 26 * shadowStrength;
        ctx.shadowOffsetY = 10 * shadowStrength;
      }
      const bg = ctx.createLinearGradient(x, y, x, y + h);
      bg.addColorStop(0, 'rgba(15, 23, 42, 0.88)');
      bg.addColorStop(1, 'rgba(8, 13, 26, 0.94)');
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 16);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }

    _renderForeground(t, ctx, width, height) {
      // Soft cinema vignette
      const vig = ctx.createRadialGradient(
        width * 0.5, height * 0.5, width * 0.34,
        width * 0.5, height * 0.5, width * 0.78
      );
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(2,4,10,0.52)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, width, height);

      // Cinema Voiceover Subtitle (Synced to Yunxi neural voiceover, zero meta notes)
      const subY = height - Math.max(36, height * 0.072);
      const subFont = Math.max(15, Math.round(width * 0.0175));
      ctx.save();
      ctx.font = `600 ${subFont}px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let subText = '';
      let subAlpha = 0;
      if (t >= 1.90 && t < 4.35) {
        subText = 'AI，到底改变了什么？';
        subAlpha = E.smoothstep(E.invLerp(1.90, 2.15, t)) * (1 - E.smoothstep(E.invLerp(4.00, 4.35, t)));
      }

      if (subAlpha > 0.01 && subText) {
        this._drawSubtitlePill(ctx, subText, width / 2, subY, subFont, subAlpha);
      }
      ctx.restore();
    }

    _drawSubtitlePill(ctx, text, cx, cy, fontSize, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      const padX = 24;
      const pillH = Math.round(fontSize * 1.95);
      const pillW = Math.ceil(ctx.measureText(text).width) + padX * 2;
      ctx.fillStyle = 'rgba(4, 8, 18, 0.62)';
      ctx.beginPath();
      ctx.roundRect(cx - pillW / 2, cy - pillH / 2, pillW, pillH, pillH / 2);
      ctx.fill();

      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 6;
      ctx.fillStyle = 'rgba(248, 250, 252, 0.98)';
      ctx.fillText(text, cx, cy + 1);
      ctx.restore();
    }
  }

  window.ShotS01Singularity = ShotS01Singularity;
})();
