/**
 * Master Continuous Timeline Controller
 * Auto-plays immediately at 60fps; syncs Yunxi neural voiceover + multi-voice score + S01-S13 seamless loop.
 */
(function () {
  window.addEventListener('DOMContentLoaded', () => {
    const stageContainer = document.getElementById('stageContainer');
    const webglMount = document.getElementById('webglMount');
    const vectorCanvas = document.getElementById('vectorCanvas');
    const fgCanvas = document.getElementById('fgCanvas');
    const vecCtx = vectorCanvas.getContext('2d');
    const fgCtx = fgCanvas.getContext('2d');

    const playBtn = document.getElementById('playBtn');
    const prevFrameBtn = document.getElementById('prevFrameBtn');
    const nextFrameBtn = document.getElementById('nextFrameBtn');
    const scrubber = document.getElementById('scrubber');
    const timeReadout = document.getElementById('timeReadout');
    const audioHint = document.getElementById('audioHint');
    const muteBtn = document.getElementById('muteBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const speedBtns = document.querySelectorAll('.speed-btn');
    const beatPills = document.querySelectorAll('.beat-pill');

    const stage3D = new window.SpatialStage3D(webglMount);
    const shotS01 = new window.ShotS01Singularity(stage3D);
    const shotS02 = new window.ShotS02Design(stage3D, shotS01);
    const shotS03 = new window.ShotS03Code(stage3D);
    const shotS04 = new window.ShotS04Editing(stage3D);
    const shotS05 = new window.ShotS05Walls(stage3D);
    const shotS06 = new window.ShotS06Illusion(stage3D);
    const shotS07 = new window.ShotS07Shatter(stage3D, shotS06);
    const shotS08 = new window.ShotS08Divide(stage3D);
    const shotS09 = new window.ShotS09Warmth(stage3D);
    const shotS10 = new window.ShotS10Upstream(stage3D);
    const shotS11 = new window.ShotS11Thesis(stage3D);
    const shotS12 = new window.ShotS12Helm(stage3D);
    const shotS13 = new window.ShotS13Spark(stage3D);
    const audio = new window.CinemaAudioEngine();

    const DURATION = shotS13.endTime; // 102.00s continuous S01 - S13 One-Take Infinite Loop
    scrubber.max = DURATION.toFixed(3);

    let currentTime = 0;
    let isPlaying = true; // Auto-play immediately!
    let playbackRate = 1.0;
    let lastRaf = performance.now();
    let width = 1280;
    let height = 720;

    function syncSize() {
      const rect = stageContainer.getBoundingClientRect();
      width = Math.max(320, Math.round(rect.width));
      height = Math.max(180, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      stage3D.resize(width, height);

      [vectorCanvas, fgCanvas].forEach((c) => {
        c.width = Math.round(width * dpr);
        c.height = Math.round(height * dpr);
      });
      vecCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      renderVisualsOnly(currentTime);
    }

    function renderVisualsOnly(t) {
      if (t < shotS07.startTime && t >= shotS01.duration) {
        stage3D.gridMat.opacity = 0.16;
        stage3D.pMat.opacity = 0.45;
      }
      if (t < shotS01.duration) {
        shotS01.render(t, vecCtx, fgCtx, width, height);
      } else if (t < shotS02.endTime) {
        shotS02.render(t, vecCtx, fgCtx, width, height);
      } else if (t < shotS03.endTime) {
        shotS03.render(t, vecCtx, fgCtx, width, height);
      } else if (t < shotS04.endTime) {
        shotS04.render(t, vecCtx, fgCtx, width, height);
      } else if (t < shotS05.endTime) {
        shotS05.render(t, vecCtx, fgCtx, width, height);
      } else if (t < shotS06.endTime) {
        shotS06.render(t, vecCtx, fgCtx, width, height);
      } else if (t < shotS07.endTime) {
        shotS07.render(t, vecCtx, fgCtx, width, height);
      } else if (t < shotS08.endTime) {
        shotS08.render(t, vecCtx, fgCtx, width, height);
      } else if (t < shotS09.endTime) {
        shotS09.render(t, vecCtx, fgCtx, width, height);
      } else if (t < shotS10.endTime) {
        shotS10.render(t, vecCtx, fgCtx, width, height);
      } else if (t < shotS11.endTime) {
        shotS11.render(t, vecCtx, fgCtx, width, height);
      } else if (t < shotS12.endTime) {
        shotS12.render(t, vecCtx, fgCtx, width, height);
      } else {
        shotS13.render(t, vecCtx, fgCtx, width, height);
      }
    }

    window.addEventListener('resize', syncSize);
    syncSize();

    function unlockAudioOnce() {
      if (!audio.unlocked) {
        audio.init();
        if (audioHint) audioHint.classList.add('hidden');
        return true;
      }
      if (audio.ctx && audio.ctx.state === 'suspended') {
        audio.ctx.resume().catch(() => {});
      }
      if (audioHint) audioHint.classList.add('hidden');
      return false;
    }

    document.addEventListener('pointerdown', () => unlockAudioOnce(), { passive: true });
    if (audioHint) {
      audioHint.addEventListener('click', (e) => {
        e.stopPropagation();
        unlockAudioOnce();
        currentTime = 0;
        audio.resetCues();
        setPlaying(true);
        renderAt(0);
      });
    }

    stageContainer.addEventListener('click', () => {
      const justUnlocked = unlockAudioOnce();
      if (!justUnlocked) {
        setPlaying(!isPlaying);
      }
    });

    function setPlaying(play) {
      isPlaying = play;
      playBtn.textContent = isPlaying ? '⏸ 暂停' : '▶ 播放';
      if (!isPlaying) {
        audio.update(currentTime, false, playbackRate);
      }
      lastRaf = performance.now();
    }

    playBtn.addEventListener('click', () => {
      unlockAudioOnce();
      setPlaying(!isPlaying);
    });

    prevFrameBtn.addEventListener('click', () => {
      setPlaying(false);
      currentTime = Math.max(0, currentTime - 1 / 60);
      renderAt(currentTime);
    });

    nextFrameBtn.addEventListener('click', () => {
      setPlaying(false);
      currentTime = Math.min(DURATION, currentTime + 1 / 60);
      renderAt(currentTime);
    });

    scrubber.addEventListener('input', () => {
      unlockAudioOnce();
      currentTime = parseFloat(scrubber.value) || 0;
      audio.resetCues();
      renderAt(currentTime);
    });

    muteBtn.addEventListener('click', () => {
      unlockAudioOnce();
      audio.setMuted(!audio.muted);
      muteBtn.textContent = audio.muted ? '🔇 静音' : '🔊 声音';
    });

    speedBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        unlockAudioOnce();
        playbackRate = parseFloat(btn.dataset.speed) || 1.0;
        speedBtns.forEach((b) => b.classList.toggle('active', b === btn));
      });
    });

    beatPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        unlockAudioOnce();
        currentTime = parseFloat(pill.dataset.time) || 0;
        audio.resetCues();
        renderAt(currentTime);
      });
    });

    function toggleFullscreen() {
      unlockAudioOnce();
      const docEl = document.documentElement;
      if (!document.fullscreenElement) {
        if (docEl.requestFullscreen) docEl.requestFullscreen().catch(() => {});
      } else if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }

    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', toggleFullscreen);
    }

    window.addEventListener('keydown', (e) => {
      unlockAudioOnce();
      if (e.code === 'Space') {
        e.preventDefault();
        setPlaying(!isPlaying);
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setPlaying(false);
        currentTime = Math.max(0, currentTime - 1 / 60);
        renderAt(currentTime);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setPlaying(false);
        currentTime = Math.min(DURATION, currentTime + 1 / 60);
        renderAt(currentTime);
      }
    });

    function updateHud(t) {
      scrubber.value = t.toFixed(3);
      const frame = Math.floor(t * 60);
      timeReadout.textContent = `${t.toFixed(2)}s / F${String(frame).padStart(3, '0')}`;

      let activeIdx = 0;
      if (t >= 96.80) {
        activeIdx = 12;
      } else if (t >= 87.80) {
        activeIdx = 11;
      } else if (t >= 80.60) {
        activeIdx = 10;
      } else if (t >= 72.40) {
        activeIdx = 9;
      } else if (t >= 62.60) {
        activeIdx = 8;
      } else if (t >= 54.40) {
        activeIdx = 7;
      } else if (t >= 45.20) {
        activeIdx = 6;
      } else if (t >= 37.80) {
        activeIdx = 5;
      } else if (t >= 29.00) {
        activeIdx = 4;
      } else if (t >= 20.20) {
        activeIdx = 3;
      } else if (t >= 13.00) {
        activeIdx = 2;
      } else if (t >= 5.20) {
        activeIdx = 1;
      } else {
        activeIdx = 0;
      }

      beatPills.forEach((p, idx) => p.classList.toggle('active', idx === activeIdx));
    }

    function renderAt(t) {
      renderVisualsOnly(t);
      audio.update(t, isPlaying, playbackRate);
      updateHud(t);
    }

    function tick(now) {
      const dt = Math.min(0.05, Math.max(0, (now - lastRaf) / 1000));
      lastRaf = now;

      if (isPlaying) {
        currentTime += dt * playbackRate;
        if (currentTime >= DURATION) {
          currentTime = currentTime % DURATION;
          audio.resetCues();
        }
        renderAt(currentTime);
      }

      requestAnimationFrame(tick);
    }

    renderAt(0);

    // Optional URL ?t=... query hook for instant frame preview / visual inspection
    const params = new URLSearchParams(window.location.search);
    if (params.has('t')) {
      const targetT = Math.max(0, Math.min(DURATION, parseFloat(params.get('t')) || 0));
      setPlaying(false);
      currentTime = targetT;
      renderAt(targetT);
    }

    requestAnimationFrame(tick);

    // Expose hook for automated visual & frame verification
    window.__app = {
      stage3D,
      shotS01,
      shotS02,
      shotS03,
      shotS04,
      shotS05,
      shotS06,
      shotS07,
      shotS08,
      shotS09,
      shotS10,
      shotS11,
      shotS12,
      shotS13,
      audio,
      seek: (t) => {
        setPlaying(false);
        currentTime = t;
        renderAt(t);
      },
      getState: () => ({ currentTime, isPlaying, width, height })
    };
  });
})();
