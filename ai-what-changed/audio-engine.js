/**
 * Cinema Audio Engine v2 — Yunxi Neural Voiceover + Multi-Voice Cinematic Score + SFX
 * - Decodes embedded `window.VOICEOVER_PACK` (Microsoft `zh-CN-YunxiNeural`) for 100% offline `file://` playback
 * - Multi-layered 112 BPM chord progression (`Am9 -> Fmaj7 -> Cmaj9 -> Gadd9`) with pad, sub-bass, arpeggiator & pulse groove
 * - Automatic Sidechain Voice Ducking: gently lowers BGM when Yunxi speaks, swells during visual transitions
 */
(function () {
  // 4-bar emotional sci-fi documentary chord progression (frequencies in Hz)
  // Bar 0: Am9  (A1 bass, A3-C4-E4-B4 arp/pad)
  // Bar 1: Fmaj7(F1 bass, F3-A3-C4-E4 arp/pad)
  // Bar 2: Cmaj9(C2 bass, G3-C4-D4-E4 arp/pad)
  // Bar 3: Gadd9(G1 bass, G3-A3-B3-D4 arp/pad)
  const CHORDS = [
    { bass: 55.00,  pad: [220.00, 261.63, 329.63], arp: [220.00, 329.63, 493.88, 523.25, 659.25, 523.25, 493.88, 329.63] },
    { bass: 43.65,  pad: [174.61, 220.00, 261.63], arp: [174.61, 261.63, 329.63, 440.00, 523.25, 440.00, 329.63, 261.63] },
    { bass: 65.41,  pad: [196.00, 261.63, 329.63], arp: [261.63, 329.63, 392.00, 587.33, 659.25, 587.33, 392.00, 329.63] },
    { bass: 49.00,  pad: [196.00, 246.94, 293.66], arp: [196.00, 293.66, 440.00, 493.88, 587.33, 493.88, 440.00, 293.66] }
  ];

  const BPM = 112;
  const BEAT_SEC = 60 / BPM;        // ~0.5357s
  const STEP_SEC = BEAT_SEC / 4;    // 16th note ~0.1339s
  const BAR_SEC = BEAT_SEC * 4;     // ~2.1429s

  // Exact timeline start positions for Yunxi voiceover clips
  const VO_SCHEDULE = [
    { id: 's01', start: 1.88, trimEnd: 0.35 },
    { id: 's02', start: 5.22, trimEnd: 0.25 },
    { id: 's03', start: 13.08, trimEnd: 0.25 },
    { id: 's04', start: 20.28, trimEnd: 0.25 },
    { id: 's05', start: 29.10, trimEnd: 0.25 },
    { id: 's06', start: 37.90, trimEnd: 0.20 },
    { id: 's07', start: 45.75, trimEnd: 0.20 },
    { id: 's08', start: 54.55, trimEnd: 0.20 },
    { id: 's09', start: 62.75, trimEnd: 0.20 },
    { id: 's10', start: 72.55, trimEnd: 0.20 },
    { id: 's11', start: 80.78, trimEnd: 0.20 },
    { id: 's12', start: 87.95, trimEnd: 0.20 },
    { id: 's13', start: 96.95, trimEnd: 0.15 }
  ];

  function base64DataUriToArrayBuffer(dataUri) {
    const commaIdx = dataUri.indexOf(',');
    const b64 = commaIdx >= 0 ? dataUri.slice(commaIdx + 1) : dataUri;
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      bytes[i] = bin.charCodeAt(i);
    }
    return bytes.buffer;
  }

  class CinemaAudioEngine {
    constructor() {
      this.ctx = null;
      this.master = null;
      this.voBus = null;
      this.musicBus = null;
      this.sfxBus = null;

      this.muted = false;
      this.unlocked = false;
      this.triggered = new Set();
      this.lastTime = 0;
      this.lastStepIndex = -1;
      this.currentChordIdx = -1;

      // Continuous pad & bass oscillators
      this.bassOsc = null;
      this.bassGain = null;
      this.padOscs = [];
      this.padFilter = null;
      this.padGain = null;

      // Decoded Yunxi voiceover AudioBuffers & active playback state
      this.voBuffers = {};
      this.activeVo = null; // { id, source, startedAtTimeline, rate }
    }

    init() {
      if (this.ctx) {
        if (this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
        return;
      }
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      this.ctx = new AudioCtx();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      // Master Glue Compressor -> Destination
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.90;

      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -10;
      comp.knee.value = 16;
      comp.ratio.value = 4;
      comp.attack.value = 0.004;
      comp.release.value = 0.18;

      this.master.connect(comp);
      comp.connect(this.ctx.destination);

      // 1) Voiceover Bus (Crisp Broadcast EQ for Yunxi Male Voice)
      this.voBus = this.ctx.createGain();
      this.voBus.gain.value = 1.08;

      const voHp = this.ctx.createBiquadFilter();
      voHp.type = 'highpass';
      voHp.frequency.value = 85;

      const voPresence = this.ctx.createBiquadFilter();
      voPresence.type = 'peaking';
      voPresence.frequency.value = 3200;
      voPresence.Q.value = 1.1;
      voPresence.gain.value = 2.2;

      this.voBus.connect(voHp);
      voHp.connect(voPresence);
      voPresence.connect(this.master);

      // 2) Music Bus (Ducks automatically under Yunxi Voiceover!)
      this.musicBus = this.ctx.createGain();
      this.musicBus.gain.value = 0.36;
      this.musicBus.connect(this.master);

      // 3) SFX Bus (Subtle, tasteful UI & transition accents)
      this.sfxBus = this.ctx.createGain();
      this.sfxBus.gain.value = 0.48;
      this.sfxBus.connect(this.master);

      this._setupContinuousPadAndBass();
      this._decodeVoiceoverPack();

      this.unlocked = true;
    }

    _setupContinuousPadAndBass() {
      // Warm Deep Sub-Bass
      this.bassOsc = this.ctx.createOscillator();
      const bassFilter = this.ctx.createBiquadFilter();
      this.bassGain = this.ctx.createGain();
      this.bassOsc.type = 'triangle';
      this.bassOsc.frequency.value = CHORDS[0].bass;
      bassFilter.type = 'lowpass';
      bassFilter.frequency.value = 165;
      this.bassGain.gain.value = 0.0001;

      this.bassOsc.connect(bassFilter);
      bassFilter.connect(this.bassGain);
      this.bassGain.connect(this.musicBus);
      this.bassOsc.start();

      // Lush 3-Voice Detuned Analog Pad
      this.padFilter = this.ctx.createBiquadFilter();
      this.padFilter.type = 'lowpass';
      this.padFilter.frequency.value = 780;
      this.padGain = this.ctx.createGain();
      this.padGain.gain.value = 0.0001;
      this.padFilter.connect(this.padGain);
      this.padGain.connect(this.musicBus);

      for (let i = 0; i < 3; i++) {
        const oscA = this.ctx.createOscillator();
        const oscB = this.ctx.createOscillator();
        const voiceGain = this.ctx.createGain();

        oscA.type = 'sawtooth';
        oscB.type = 'triangle';
        oscA.detune.value = -7;
        oscB.detune.value = +7;
        oscA.frequency.value = CHORDS[0].pad[i];
        oscB.frequency.value = CHORDS[0].pad[i];
        voiceGain.gain.value = 0.075;

        oscA.connect(voiceGain);
        oscB.connect(voiceGain);
        voiceGain.connect(this.padFilter);
        oscA.start();
        oscB.start();
        this.padOscs.push({ oscA, oscB });
      }
    }

    _decodeVoiceoverPack() {
      const pack = window.VOICEOVER_PACK;
      if (!pack || !this.ctx) return;

      Object.keys(pack).forEach((id) => {
        const entry = pack[id];
        if (!entry || !entry.dataUri) return;
        try {
          const ab = base64DataUriToArrayBuffer(entry.dataUri);
          this.ctx.decodeAudioData(
            ab,
            (audioBuf) => {
              this.voBuffers[id] = audioBuf;
            },
            () => {}
          );
        } catch (e) {}
      });
    }

    setMuted(m) {
      this.muted = m;
      if (this.master && this.ctx) {
        this.master.gain.setTargetAtTime(m ? 0 : 0.90, this.ctx.currentTime, 0.03);
      }
    }

    stopVoiceover() {
      if (this.activeVo) {
        try {
          this.activeVo.source.onended = null;
          this.activeVo.source.stop();
          this.activeVo.source.disconnect();
        } catch (e) {}
        this.activeVo = null;
      }
    }

    resetCues() {
      this.triggered.clear();
      this.lastStepIndex = -1;
      this.stopVoiceover();
    }

    // =========================================================================
    // PROCEDURAL MUSIC INSTRUMENTS (Arpeggiator, Soft Pulse Kick, Velvet Hat)
    // =========================================================================
    _playArpPluck(freq, vol = 0.09, bright = 1400) {
      if (!this.ctx || this.muted || this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const sub = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      sub.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      sub.frequency.setValueAtTime(freq * 2, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(bright, now);
      filter.frequency.exponentialRampToValueAtTime(340, now + 0.32);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

      const subGain = this.ctx.createGain();
      subGain.gain.value = 0.24;

      osc.connect(filter);
      sub.connect(subGain);
      subGain.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicBus);

      osc.start(now);
      sub.start(now);
      osc.stop(now + 0.42);
      sub.stop(now + 0.42);
    }

    _playSoftPulseKick(vol = 0.24) {
      if (!this.ctx || this.muted || this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(118, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.14);

      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.musicBus);
      osc.start(now);
      osc.stop(now + 0.24);
    }

    _playVelvetHat(vol = 0.04) {
      if (!this.ctx || this.muted || this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;
      const len = Math.floor(this.ctx.sampleRate * 0.045);
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.28));
      }
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      const hp = this.ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 6500;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(vol, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

      src.connect(hp);
      hp.connect(g);
      g.connect(this.musicBus);
      src.start(now);
    }

    // =========================================================================
    // SOUND DESIGN CUES (Routed to `sfxBus`)
    // =========================================================================
    playSonarPing(freq = 987.77, vol = 0.16) {
      if (!this.ctx || this.muted || this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.994, now + 0.7);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);

      osc.connect(gain);
      gain.connect(this.sfxBus);
      osc.start(now);
      osc.stop(now + 0.8);
    }

    playMechTick(freq = 1800, vol = 0.10) {
      if (!this.ctx || this.muted || this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.032);

      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.036);

      osc.connect(gain);
      gain.connect(this.sfxBus);
      osc.start(now);
      osc.stop(now + 0.04);
    }

    playSingularityImpact() {
      if (!this.ctx || this.muted || this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;

      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(125, now);
      sub.frequency.exponentialRampToValueAtTime(36, now + 0.55);
      subGain.gain.setValueAtTime(0.42, now);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
      sub.connect(subGain);
      subGain.connect(this.sfxBus);
      sub.start(now);
      sub.stop(now + 0.75);

      [523.25, 783.99, 1174.66].forEach((f, idx) => {
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(f, now + idx * 0.015);
        g.gain.setValueAtTime(0.0001, now + idx * 0.015);
        g.gain.linearRampToValueAtTime(0.06, now + idx * 0.015 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);
        o.connect(g);
        g.connect(this.sfxBus);
        o.start(now + idx * 0.015);
        o.stop(now + 0.8);
      });
    }

    playQuestionChord() {
      if (!this.ctx || this.muted || this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;
      [587.33, 880, 1318.51].forEach((f, i) => {
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = i === 0 ? 'triangle' : 'sine';
        o.frequency.setValueAtTime(f, now);
        g.gain.setValueAtTime(0.001, now);
        g.gain.linearRampToValueAtTime(0.075 / (i + 1), now + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
        o.connect(g);
        g.connect(this.sfxBus);
        o.start(now);
        o.stop(now + 0.95);
      });
    }

    playWhipWhoosh() {
      if (!this.ctx || this.muted || this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.48);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }
      const src = this.ctx.createBufferSource();
      src.buffer = buffer;
      const bp = this.ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.Q.value = 3.0;
      bp.frequency.setValueAtTime(280, now);
      bp.frequency.exponentialRampToValueAtTime(2400, now + 0.22);
      bp.frequency.exponentialRampToValueAtTime(420, now + 0.46);

      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.20, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.46);
      src.connect(bp);
      bp.connect(g);
      g.connect(this.sfxBus);
      src.start(now);
    }

    playMonolithCollapseBoom() {
      if (!this.ctx || this.muted || this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;

      // Deep seismic sub-drop (`96Hz -> 28Hz`)
      const sub = this.ctx.createOscillator();
      const subG = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(96, now);
      sub.frequency.exponentialRampToValueAtTime(28, now + 0.85);
      subG.gain.setValueAtTime(0.46, now);
      subG.gain.exponentialRampToValueAtTime(0.0001, now + 0.92);
      sub.connect(subG);
      subG.connect(this.sfxBus);
      sub.start(now);
      sub.stop(now + 0.95);

      // Filtered stone/architectural rumble burst
      const len = Math.floor(this.ctx.sampleRate * 0.78);
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.36));
      }
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      const lp = this.ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(520, now);
      lp.frequency.exponentialRampToValueAtTime(110, now + 0.75);
      const rg = this.ctx.createGain();
      rg.gain.setValueAtTime(0.26, now);
      rg.gain.exponentialRampToValueAtTime(0.001, now + 0.78);
      src.connect(lp);
      lp.connect(rg);
      rg.connect(this.sfxBus);
      src.start(now);
    }

    playOverloadRiser(dur = 3.25) {
      if (!this.ctx || this.muted || this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(260, now);
      osc1.frequency.exponentialRampToValueAtTime(2400, now + dur);
      osc2.frequency.setValueAtTime(390, now);
      osc2.frequency.exponentialRampToValueAtTime(3600, now + dur);

      const lp = this.ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(600, now);
      lp.frequency.exponentialRampToValueAtTime(4800, now + dur);

      g.gain.setValueAtTime(0.001, now);
      g.gain.exponentialRampToValueAtTime(0.16, now + dur * 0.96);
      g.gain.linearRampToValueAtTime(0.0001, now + dur + 0.02);

      osc1.connect(lp);
      osc2.connect(lp);
      lp.connect(g);
      g.connect(this.sfxBus);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + dur + 0.04);
      osc2.stop(now + dur + 0.04);
    }

    playGlassShatterCutoff() {
      if (!this.ctx || this.muted || this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;

      // 1) Crisp Mechanical Camera-Shutter / Power-Relay Snap (`1650Hz -> 180Hz` in 24ms)
      const snap = this.ctx.createOscillator();
      const snapG = this.ctx.createGain();
      snap.type = 'triangle';
      snap.frequency.setValueAtTime(1650, now);
      snap.frequency.exponentialRampToValueAtTime(180, now + 0.024);
      snapG.gain.setValueAtTime(0.32, now);
      snapG.gain.exponentialRampToValueAtTime(0.0001, now + 0.032);
      snap.connect(snapG);
      snapG.connect(this.sfxBus);
      snap.start(now);
      snap.stop(now + 0.036);

      // 2) Smooth Reverse-Zoom Air Pull-Back (`1800Hz -> 240Hz` matching the 5x camera snap pull-out!)
      const len = Math.floor(this.ctx.sampleRate * 0.52);
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.35));
      }
      const nSrc = this.ctx.createBufferSource();
      nSrc.buffer = buf;
      const bp = this.ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.Q.value = 2.8;
      bp.frequency.setValueAtTime(1800, now);
      bp.frequency.exponentialRampToValueAtTime(240, now + 0.48);
      const ng = this.ctx.createGain();
      ng.gain.setValueAtTime(0.24, now);
      ng.gain.exponentialRampToValueAtTime(0.0001, now + 0.50);
      nSrc.connect(bp);
      bp.connect(ng);
      ng.connect(this.sfxBus);
      nSrc.start(now);

      // 3) Deep Cinema Vacuum Sub-Drop (`104Hz -> 24Hz` as BGM cuts to stark silence!)
      const drop = this.ctx.createOscillator();
      const dg = this.ctx.createGain();
      drop.type = 'sine';
      drop.frequency.setValueAtTime(104, now);
      drop.frequency.exponentialRampToValueAtTime(24, now + 0.82);
      dg.gain.setValueAtTime(0.46, now);
      dg.gain.exponentialRampToValueAtTime(0.0001, now + 0.88);
      drop.connect(dg);
      dg.connect(this.sfxBus);
      drop.start(now);
      drop.stop(now + 0.90);
    }

    playClockSecondTick(isTick = true) {
      if (!this.ctx || this.muted || this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      const f = isTick ? 2450 : 1920;
      osc.frequency.setValueAtTime(f, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.022);
      g.gain.setValueAtTime(0.11, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.028);
      osc.connect(g);
      g.connect(this.sfxBus);
      osc.start(now);
      osc.stop(now + 0.032);
    }

    // Warm Acoustic Felt Piano (Acts 4-6 Human Awakening Score)
    _playWarmFeltPiano(freq, vol = 0.14, dur = 1.65) {
      if (!this.ctx || this.muted || this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const osc3 = this.ctx.createOscillator();
      const g2 = this.ctx.createGain();
      const g3 = this.ctx.createGain();
      const lp = this.ctx.createBiquadFilter();
      const env = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc3.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * 2, now);
      osc3.frequency.setValueAtTime(freq * 3, now);
      osc2.detune.value = 2.5;

      g2.gain.value = 0.18;
      g3.gain.value = 0.045;

      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(1450, now);
      lp.frequency.exponentialRampToValueAtTime(420, now + dur * 0.72);

      env.gain.setValueAtTime(0.0001, now);
      env.gain.linearRampToValueAtTime(vol, now + 0.014);
      env.gain.exponentialRampToValueAtTime(vol * 0.42, now + 0.28);
      env.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      osc1.connect(lp);
      osc2.connect(g2);
      g2.connect(lp);
      osc3.connect(g3);
      g3.connect(lp);
      lp.connect(env);
      env.connect(this.musicBus);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);
      osc1.stop(now + dur + 0.05);
      osc2.stop(now + dur + 0.05);
      osc3.stop(now + dur + 0.05);
    }

    playPaperTearAndPencil(dur = 0.80) {
      if (!this.ctx || this.muted || this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;
      const len = Math.floor(this.ctx.sampleRate * dur);
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        const u = i / len;
        const env = Math.sin(u * Math.PI) * (0.75 + 0.25 * Math.sin(i * 0.04));
        data[i] = (Math.random() * 2 - 1) * env;
      }
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      const bp = this.ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.Q.value = 1.9;
      bp.frequency.setValueAtTime(920, now);
      bp.frequency.exponentialRampToValueAtTime(1750, now + dur * 0.45);
      bp.frequency.exponentialRampToValueAtTime(720, now + dur);

      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.14, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + dur);
      src.connect(bp);
      bp.connect(g);
      g.connect(this.sfxBus);
      src.start(now);
    }

    playPencilSketchRustle(dur = 0.34) {
      if (!this.ctx || this.muted || this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;
      const len = Math.floor(this.ctx.sampleRate * dur);
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / len) * Math.PI);
      }
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      const bp = this.ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.Q.value = 2.4;
      bp.frequency.value = 2350;

      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.06, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + dur);
      src.connect(bp);
      bp.connect(g);
      g.connect(this.sfxBus);
      src.start(now);
    }

    playGlassWindChime() {
      if (!this.ctx || this.muted || this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;
      [1567.98, 2093.00, 2637.02].forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        const st = now + idx * 0.055;
        osc.frequency.setValueAtTime(f, st);
        g.gain.setValueAtTime(0.0001, st);
        g.gain.linearRampToValueAtTime(0.068 / (1 + idx * 0.35), st + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, st + 1.45);
        osc.connect(g);
        g.connect(this.sfxBus);
        osc.start(st);
        osc.stop(st + 1.50);
      });
    }

    // Warm Orchestral Concert Bass Drum (`Gran Cassa`) for Act 6 Climax
    playConcertGranCassa(vol = 0.34) {
      if (!this.ctx || this.muted || this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(76, now);
      osc.frequency.exponentialRampToValueAtTime(31, now + 0.75);
      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(vol, now + 0.018);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);
      osc.connect(g);
      g.connect(this.sfxBus);
      osc.start(now);
      osc.stop(now + 1.20);
    }

    // =========================================================================
    // VOICEOVER + SCORE MASTER TIMELINE SYNC
    // =========================================================================
    _syncVoiceover(t, isPlaying, playbackRate) {
      if (!isPlaying || this.ctx.state !== 'running') {
        if (this.activeVo) this.stopVoiceover();
        return false;
      }

      // Find which voiceover clip covers current timeline `t`
      let targetClip = null;
      for (let i = 0; i < VO_SCHEDULE.length; i++) {
        const spec = VO_SCHEDULE[i];
        const buf = this.voBuffers[spec.id];
        if (!buf) continue;
        const end = spec.start + Math.max(0.2, buf.duration - (spec.trimEnd || 0));
        if (t >= spec.start && t < end - 0.06) {
          targetClip = { spec, buf, end };
          break;
        }
      }

      if (!targetClip) {
        if (this.activeVo) this.stopVoiceover();
        return false;
      }

      const expectedOffset = t - targetClip.spec.start;

      // Check if already playing this exact clip in sync!
      if (this.activeVo && this.activeVo.id === targetClip.spec.id) {
        const elapsedAudio = (this.ctx.currentTime - this.activeVo.ctxStart) * this.activeVo.rate;
        const currentClipOffset = this.activeVo.initialOffset + elapsedAudio;
        const drift = Math.abs(currentClipOffset - expectedOffset);
        const rateChanged = Math.abs(this.activeVo.rate - playbackRate) > 0.02;

        if (drift < 0.22 && !rateChanged) {
          return true; // Speaking cleanly in sync!
        }
        this.stopVoiceover();
      } else if (this.activeVo) {
        this.stopVoiceover();
      }

      // Start `AudioBufferSourceNode` from exact `expectedOffset`!
      const src = this.ctx.createBufferSource();
      src.buffer = targetClip.buf;
      src.playbackRate.value = playbackRate;
      src.connect(this.voBus);

      const safeOffset = Math.max(0, Math.min(targetClip.buf.duration - 0.05, expectedOffset));
      src.start(0, safeOffset);

      const voState = {
        id: targetClip.spec.id,
        source: src,
        ctxStart: this.ctx.currentTime,
        initialOffset: safeOffset,
        rate: playbackRate
      };
      this.activeVo = voState;
      src.onended = () => {
        if (this.activeVo === voState) {
          this.activeVo = null;
        }
      };
      return true;
    }

    _updateMusicScore(t, isPlaying, isSpeaking) {
      const now = this.ctx.currentTime;

      if (!isPlaying || this.muted || this.ctx.state !== 'running') {
        this.bassGain.gain.setTargetAtTime(0.0001, now, 0.06);
        this.padGain.gain.setTargetAtTime(0.0001, now, 0.06);
        return;
      }

      // S07 & Early S08 (`45.20s <= t < 57.08s`): Stark monochrome/blueprint silence until the hand-torn paper rips open!
      if (t >= 45.20 && t < 57.08) {
        this.bassGain.gain.setTargetAtTime(0.0001, now, 0.008);
        this.padGain.gain.setTargetAtTime(0.0001, now, 0.008);
        return;
      }

      // Update continuous Pad & Sub-Bass chord every bar (`~2.14s`)
      const barIdx = Math.floor(t / BAR_SEC) % CHORDS.length;
      const chord = CHORDS[barIdx];
      if (barIdx !== this.currentChordIdx) {
        this.currentChordIdx = barIdx;
        this.bassOsc.frequency.setTargetAtTime(chord.bass, now, 0.08);
        for (let i = 0; i < 3; i++) {
          this.padOscs[i].oscA.frequency.setTargetAtTime(chord.pad[i], now, 0.12);
          this.padOscs[i].oscB.frequency.setTargetAtTime(chord.pad[i], now, 0.12);
        }
      }

      // =====================================================================
      // ACTS 4-6 (`t >= 57.08s`): WARM ACOUSTIC FELT PIANO & SYMPHONIC CELLO ARC
      // =====================================================================
      if (t >= 57.08) {
        // S11-S12 (`82.5s - 95.8s`) swells into majestic warm symphonic strings; S13 (`96.8s - 102.0s`) gently settles to hush!
        const act6Swell = t >= 82.50 && t < 96.40 ? Math.min(1, (t - 82.50) / 5.5) : 0;
        const outroHush = t >= 96.40 ? Math.min(1, (t - 96.40) / 4.2) : 0;

        const baseWarmVol = (isSpeaking ? 0.28 : 0.48) + act6Swell * 0.08;
        const targetWarmVol = baseWarmVol * (1 - outroHush * 0.65);
        this.musicBus.gain.setTargetAtTime(targetWarmVol, now, isSpeaking ? 0.08 : 0.25);

        const targetBass = (0.17 + act6Swell * 0.08) * (1 - outroHush * 0.72);
        const targetPad = (0.74 + act6Swell * 0.24) * (1 - outroHush * 0.58);
        const targetCutoff = 610 + act6Swell * 480 - outroHush * 180;

        this.bassGain.gain.setTargetAtTime(Math.max(0.03, targetBass), now, 0.25);
        this.padGain.gain.setTargetAtTime(Math.max(0.18, targetPad), now, 0.28);
        this.padFilter.frequency.setTargetAtTime(Math.max(440, targetCutoff), now, 0.25);

        const stepIdx = Math.floor(t / STEP_SEC);
        if (stepIdx !== this.lastStepIndex) {
          this.lastStepIndex = stepIdx;
          const stepInBar = ((stepIdx % 16) + 16) % 16;

          if (outroHush > 0.72) {
            // Final 2.5s (`99.5s - 102.0s`): only let lingering piano harmonics decay naturally into S01!
            return;
          }

          // Expressive Felt Piano notes (grows into rich rising arpeggio during S10-S12 climax!)
          if (stepInBar === 0) {
            this._playWarmFeltPiano(chord.pad[0], 0.13 + act6Swell * 0.03, 1.95);
            this._playWarmFeltPiano(chord.arp[2], 0.14 + act6Swell * 0.03, 1.85);
          } else if (stepInBar === 4 && (t >= 77.50 && t < 96.40)) {
            this._playWarmFeltPiano(chord.arp[1], 0.105, 1.45);
          } else if (stepInBar === 6) {
            this._playWarmFeltPiano(chord.arp[3], 0.11 + act6Swell * 0.02, 1.55);
          } else if (stepInBar === 10 && act6Swell > 0.2) {
            this._playWarmFeltPiano(chord.arp[6], 0.105, 1.45);
          } else if (stepInBar === 12) {
            this._playWarmFeltPiano(chord.arp[4], 0.12 + act6Swell * 0.02, 1.65);
          } else if (stepInBar === 14 && barIdx % 2 === 1) {
            this._playWarmFeltPiano(chord.arp[5], 0.085, 1.35);
          }
        }
        return;
      }

      // Sidechain Ducking: smoothly lower BGM under Yunxi's voice, swell on visual transitions!
      const s06Overload = t >= 37.80 && t < 45.20 ? Math.min(1, (t - 37.80) / 6.8) : 0;
      const targetMusicVol = (isSpeaking ? 0.24 : 0.44) + s06Overload * 0.12;
      this.musicBus.gain.setTargetAtTime(targetMusicVol, now, isSpeaking ? 0.06 : 0.22);

      // Pad & Bass energy builds from intimate intro (`0-1.9s`) -> Act 2 (`t >= 5.2s`) -> Warp (`t >= 29.0s`) -> S06 Overload (`37.8-45.2s`)
      const act2 = t >= 5.20;
      const s05Climax = t >= 29.00;
      this.bassGain.gain.setTargetAtTime(s05Climax ? 0.26 + s06Overload * 0.08 : (act2 ? 0.22 : (t > 1.85 ? 0.15 : 0.08)), now, 0.12);
      this.padGain.gain.setTargetAtTime(s05Climax ? 0.94 + s06Overload * 0.18 : (act2 ? 0.85 : (t > 1.85 ? 0.72 : 0.45)), now, 0.15);
      this.padFilter.frequency.setTargetAtTime(
        s06Overload > 0 ? 1620 + s06Overload * 2200 : (s05Climax ? 1620 : (act2 ? 1150 : 760)),
        now,
        0.15
      );

      // 16th-Note Step Sequencer (Arpeggiator + Act 2 Electronic Groove)
      const stepIdx = Math.floor(t / STEP_SEC);
      if (stepIdx !== this.lastStepIndex) {
        this.lastStepIndex = stepIdx;
        const stepInBar = ((stepIdx % 16) + 16) % 16;

        // Crystalline Arpeggiator (plays gentle 8th notes in S01, full 16th shimmer in S02-S06!)
        if (act2 || stepInBar % 2 === 0) {
          const note = chord.arp[stepInBar % chord.arp.length];
          const accent = (stepInBar % 4 === 0) ? 1.2 : 0.78;
          this._playArpPluck(
            note * (s06Overload > 0.65 && stepInBar % 2 === 1 ? 2 : 1),
            (act2 ? 0.085 + s06Overload * 0.03 : 0.062) * accent,
            act2 ? 1850 + s06Overload * 1400 : 1200
          );
        }

        // Act 2 (`t >= 5.20s`): Warm Four-on-the-Floor Pulse Kick + Off-beat Velvet Hat!
        if (act2) {
          if (stepInBar % 4 === 0) {
            this._playSoftPulseKick(0.24);
          } else if (stepInBar % 4 === 2) {
            this._playVelvetHat(0.042);
          } else if (stepInBar === 15) {
            this._playVelvetHat(0.025);
          }
        }
      }
    }

    update(t, isPlaying, playbackRate = 1.0) {
      if (!this.ctx || !this.unlocked) return;

      if (t < this.lastTime - 0.15) {
        this.resetCues();
      }
      this.lastTime = t;

      const isSpeaking = this._syncVoiceover(t, isPlaying, playbackRate);
      this._updateMusicScore(t, isPlaying, isSpeaking);

      if (!isPlaying || this.ctx.state !== 'running') return;

      const fire = (id, cueTime, fn) => {
        if (t >= cueTime && t < cueTime + 0.18 && !this.triggered.has(id)) {
          this.triggered.add(id);
          fn();
        }
      };

      // S01 (`0.00s - 5.20s`): Typing -> Send Click -> Burst -> Portal Dive
      const keyTimes = [0.36, 0.46, 0.56, 0.68, 0.78, 0.90, 1.00, 1.11, 1.22, 1.32, 1.44];
      keyTimes.forEach((kt, idx) => {
        fire('s01_key_' + idx, kt, () => this.playMechTick(1650 + (idx % 4) * 140, 0.08));
      });
      fire('s01_send_click', 1.78, () => this.playMechTick(2800, 0.14));
      fire('s01_burst', 1.92, () => this.playSingularityImpact());
      fire('s01_portal_dive', 3.96, () => this.playWhipWhoosh());
      fire('s01_poster_bloom', 4.38, () => this.playQuestionChord());

      // S02 (`5.20s - 13.00s`): 10-Card Pop -> AI Prism Wave (`9.12s`) -> 3D Flip (`11.50s`)
      [5.38, 5.46, 5.54, 5.62, 5.70].forEach((ct, idx) => {
        fire('s02_row2_' + idx, ct, () => this.playMechTick(1420 + idx * 150, 0.065));
      });
      fire('s02_prism_sweep', 9.12, () => this.playWhipWhoosh());
      [9.40, 9.75, 10.10, 10.45].forEach((wt, idx) => {
        fire('s02_restyle_' + idx, wt, () => this.playSonarPing(1174.66 + idx * 140, 0.065));
      });
      fire('s02_dev_toggle', 11.32, () => this.playMechTick(2850, 0.12));
      fire('s02_flip_whoosh', 11.75, () => this.playWhipWhoosh());
      fire('s02_code_compile', 12.05, () => this.playQuestionChord());

      // S03 (`13.00s - 20.20s`): Red Bugs (`13.88s`) -> AI Laser Scan (`16.60s`) -> Live App (`17.45s`) -> NLE Morph (`18.82s`)
      [13.88, 14.08, 14.28].forEach((et, idx) => {
        fire('s03_err_' + idx, et, () => this.playMechTick(420 - idx * 45, 0.11));
      });
      fire('s03_ai_scan', 16.60, () => this.playWhipWhoosh());
      [16.82, 17.05, 17.28].forEach((ht, idx) => {
        fire('s03_heal_' + idx, ht, () => this.playSonarPing(1318.51 + idx * 180, 0.075));
      });
      fire('s03_live_deploy', 17.46, () => this.playQuestionChord());
      fire('s03_nle_morph', 18.84, () => this.playWhipWhoosh());

      // S04 (`20.20s - 29.00s`): Manual Pen/Beat Ticks -> AI Razor Sweep (`24.72s`) -> Magnetic Beat Snaps -> Portal Dive (`27.68s`)
      [22.42, 22.65, 22.88].forEach((pt, idx) => {
        fire('s04_pen_' + idx, pt, () => this.playMechTick(1350 + idx * 90, 0.06));
      });
      fire('s04_ai_razor', 24.72, () => this.playWhipWhoosh());
      [24.95, 25.32, 25.68, 26.05, 26.42].forEach((st, idx) => {
        fire('s04_snap_' + idx, st, () => this.playMechTick(2150 + idx * 140, 0.085));
      });
      fire('s04_master_grade', 25.15, () => this.playQuestionChord());
      fire('s04_portal_dive', 27.68, () => this.playWhipWhoosh());

      // S05 (`29.00s - 37.80s`): 4 Domain Streams -> Monolith Rise -> Supersonic Shockwave & Domino Collapse -> Sovereign Core
      [29.42, 30.12, 30.81, 31.72].forEach((dt, idx) => {
        fire('s05_domain_' + idx, dt, () => this.playSonarPing(1046.5 + idx * 165, 0.07));
      });
      fire('s05_wall_rise', 32.35, () => this.playMechTick(280, 0.12));
      fire('s05_shockwave', 34.54, () => this.playWhipWhoosh());
      fire('s05_wall_collapse', 35.22, () => this.playMonolithCollapseBoom());
      [35.38, 35.56, 35.74].forEach((rt, idx) => {
        fire('s05_domino_' + idx, rt, () => this.playMechTick(520 - idx * 60, 0.09));
      });
      fire('s05_sovereign_core', 36.62, () => this.playQuestionChord());

      // S06 (`37.80s - 45.20s`): Exponential Popup Cascade -> Overload Riser -> Cold Needle Strike!
      [38.75, 39.28, 39.80, 40.32].forEach((pt, idx) => {
        fire('s06_pop_early_' + idx, pt, () => this.playMechTick(1680 + idx * 140, 0.065));
      });
      fire('s06_overload_riser', 41.85, () => this.playOverloadRiser(3.28));
      [41.25, 41.65, 42.05, 42.45, 42.85, 43.25, 43.65, 44.05].forEach((ft, idx) => {
        fire('s06_frenzy_' + idx, ft, () => this.playMechTick(2100 + idx * 160, 0.075));
      });
      fire('s06_hero_lock', 43.35, () => this.playQuestionChord());

      // S07 (`45.20s - 54.40s`): SNAP ZOOM-OUT & BGM CUT -> Robotic Fast-Cut Snaps -> Lonely Clock Ticks -> Gear Lock!
      fire('s07_glass_shatter', 45.20, () => this.playGlassShatterCutoff());
      [48.75, 49.21, 49.67, 50.13].forEach((bt, idx) => {
        fire('s07_robocut_' + idx, bt, () => this.playMechTick(1450, 0.075));
      });
      [46.2, 47.2, 51.2, 52.2, 53.2].forEach((ct, idx) => {
        fire('s07_clock_' + idx, ct, () => this.playClockSecondTick(idx % 2 === 0));
      });
      [53.35, 53.68, 54.02].forEach((gt, idx) => {
        fire('s07_gear_lock_' + idx, gt, () => this.playMechTick(920 + idx * 180, 0.09));
      });

      // S08 (`54.40s - 62.60s`): Cold Blueprint Ticks -> Hand-Torn Paper Rip + First Warm Piano Drop (`57.08s`) -> Idea Bloom!
      [55.10, 56.10].forEach((mt, idx) => {
        fire('s08_cad_tick_' + idx, mt, () => this.playClockSecondTick(idx % 2 === 0));
      });
      fire('s08_paper_tear', 57.08, () => {
        this.playPaperTearAndPencil(0.82);
        this._playWarmFeltPiano(261.63, 0.16, 2.2);
        this._playWarmFeltPiano(392.00, 0.14, 2.1);
        this._playWarmFeltPiano(659.25, 0.13, 2.0);
      });
      [57.95, 58.45].forEach((pt, idx) => {
        fire('s08_pencil_' + idx, pt, () => this.playPencilSketchRustle(0.36));
      });
      fire('s08_idea_bloom', 59.95, () => this._playWarmFeltPiano(783.99, 0.15, 2.1));
      fire('s08_wave_left', 61.38, () => this.playPaperTearAndPencil(0.65));

      // S09 (`62.60s - 72.40s`): Cold Swatch/Metronome Ticks -> Sunset Wash -> Pencil Eaves -> Evening Wind-Chime (`69.38s`)!
      [64.75, 65.28, 65.82].forEach((bt, idx) => {
        fire('s09_quant_beat_' + idx, bt, () => this.playMechTick(1950, 0.055));
      });
      fire('s09_eaves_sketch', 66.85, () => this.playPencilSketchRustle(0.42));
      fire('s09_soft_windchime', 69.38, () => this.playGlassWindChime());
      fire('s09_filament_rise', 70.95, () => this._playWarmFeltPiano(880.00, 0.13, 2.0));

      // S10 (`72.40s - 80.60s`): Upstream Emotion Blooms (`偏爱` / `痛感`) -> Lightbulb Chime Ignition (`78.12s`)!
      fire('s10_love_bloom', 75.72, () => this._playWarmFeltPiano(659.25, 0.12, 1.7));
      fire('s10_pain_pulse', 77.02, () => this._playWarmFeltPiano(783.99, 0.13, 1.7));
      fire('s10_bulb_ignite', 78.12, () => {
        this.playGlassWindChime();
        this._playWarmFeltPiano(523.25, 0.15, 2.2);
        this._playWarmFeltPiano(1046.50, 0.13, 2.2);
      });

      // S11 (`80.60s - 87.80s`): Sand Dissolve -> Golden Brush Sweep (`82.55s`) -> Concert Gran Cassa on `昂贵` (`85.45s`)!
      fire('s11_sand_erode', 81.92, () => this.playPencilSketchRustle(0.45));
      fire('s11_gold_brush', 82.52, () => {
        this.playPencilSketchRustle(0.40);
        this._playWarmFeltPiano(587.33, 0.14, 2.0);
      });
      fire('s11_precious_drum', 85.45, () => {
        this.playConcertGranCassa(0.36);
        this._playWarmFeltPiano(220.00, 0.16, 2.5);
        this._playWarmFeltPiano(880.00, 0.15, 2.4);
      });

      // S12 (`87.80s - 96.80s`): Engine Thruster Whoosh (`91.15s`) -> Human Helm Lock & Symphonic Apex (`93.65s`)!
      fire('s12_engine_roar', 91.15, () => this.playWhipWhoosh());
      fire('s12_captain_lock', 93.65, () => {
        this.playConcertGranCassa(0.38);
        this.playQuestionChord();
        this._playWarmFeltPiano(261.63, 0.16, 2.5);
        this._playWarmFeltPiano(1046.50, 0.14, 2.4);
      });

      // S13 (`96.80s - 102.00s`): Intimate Soul Flame Piano Harmonics -> Crystal High Octave Lingering into S01!
      fire('s13_soul_open', 97.02, () => {
        this._playWarmFeltPiano(440.00, 0.14, 2.8);
        this._playWarmFeltPiano(659.25, 0.12, 2.8);
      });
      fire('s13_closing_harmonic', 100.35, () => {
        this._playWarmFeltPiano(880.00, 0.11, 2.6);
        this._playWarmFeltPiano(1318.51, 0.085, 2.5);
      });
    }
  }

  window.CinemaAudioEngine = CinemaAudioEngine;
})();
