import fs from 'node:fs';
import path from 'node:path';

const SAMPLE_RATE = 44100;
const DURATION_SECONDS = 28.5;
const NUM_SAMPLES = Math.ceil(SAMPLE_RATE * DURATION_SECONDS);
const FPS = 30;

const buffer = new Float32Array(NUM_SAMPLES);

function frameToTime(frame) {
  return frame / FPS;
}

// Add a synth tone with optional frequency glide and harmonics
function addTone({
  startTime,
  duration,
  freqStart,
  freqEnd = freqStart,
  gain = 0.2,
  type = 'bell',
}) {
  const startSample = Math.max(0, Math.floor(startTime * SAMPLE_RATE));
  const totalSamples = Math.floor(duration * SAMPLE_RATE);
  let phase = 0;

  for (let i = 0; i < totalSamples; i++) {
    const idx = startSample + i;
    if (idx >= NUM_SAMPLES) break;

    const t = i / totalSamples;
    const sec = i / SAMPLE_RATE;
    const freq = freqStart + (freqEnd - freqStart) * Math.pow(t, 0.7);
    phase += (2 * Math.PI * freq) / SAMPLE_RATE;

    // Envelope: fast attack, exponential decay
    const attack = Math.min(1, sec / 0.008);
    const decay = Math.exp(-3.8 * t) * (1 - t);
    const env = attack * decay;

    let wave = Math.sin(phase);
    if (type === 'bell') {
      wave = 0.7 * Math.sin(phase) + 0.22 * Math.sin(phase * 2) + 0.08 * Math.sin(phase * 3);
    } else if (type === 'warm') {
      wave = 0.75 * Math.sin(phase) + 0.25 * Math.sin(phase * 1.5);
    } else if (type === 'alert') {
      wave = 0.6 * Math.sin(phase) + 0.3 * Math.sin(phase * 2.5) + 0.1 * Math.sin(phase * 4);
    }

    buffer[idx] += wave * gain * env;
  }
}

// Add a soft transition whoosh / sparkle chime
function addTransition(frame) {
  const t0 = frameToTime(frame);
  addTone({ startTime: t0, duration: 0.24, freqStart: 320, freqEnd: 640, gain: 0.14, type: 'warm' });
  addTone({ startTime: t0 + 0.05, duration: 0.28, freqStart: 480, freqEnd: 960, gain: 0.12, type: 'bell' });
}

// 1. Scene 1 (0 - 3.5s, frames 0..105): Title pop, ripples, subtitle & legend pops
addTone({ startTime: frameToTime(6), duration: 0.35, freqStart: 260, freqEnd: 587.33, gain: 0.25, type: 'bell' });
addTone({ startTime: frameToTime(10), duration: 0.45, freqStart: 587.33, freqEnd: 880, gain: 0.2, type: 'bell' });
// Ripple chimes
[14, 22, 30].forEach((f, idx) => {
  addTone({
    startTime: frameToTime(f),
    duration: 0.28,
    freqStart: 523.25 * Math.pow(1.12, idx),
    freqEnd: 659.25 * Math.pow(1.12, idx),
    gain: 0.12,
    type: 'bell',
  });
});
// Legend pop
addTone({ startTime: frameToTime(34), duration: 0.22, freqStart: 440, freqEnd: 660, gain: 0.16, type: 'bell' });

// 2. Scene 2 (3.5 - 9s, frames 105..270): Stairs rising + Ball jumps (+1 +2 +1 +1) & landing bounces
addTransition(105);
// 6 stairs rising
for (let i = 0; i < 6; i++) {
  addTone({
    startTime: frameToTime(105 + i * 5),
    duration: 0.14,
    freqStart: 300 + i * 45,
    freqEnd: 420 + i * 50,
    gain: 0.13,
    type: 'bell',
  });
}
// Ball appear
addTone({ startTime: frameToTime(105 + 18), duration: 0.2, freqStart: 380, freqEnd: 720, gain: 0.2, type: 'bell' });

// Jumps: +1 (42->66), +2 (76->104), +1 (114->138), +1 (148->172)
const jumps = [
  { start: 42, end: 66, step: 1 },
  { start: 76, end: 104, step: 2 },
  { start: 114, end: 138, step: 1 },
  { start: 148, end: 172, step: 1 },
];
jumps.forEach((j, idx) => {
  // Boing jump launch
  const baseFreq = 360 + idx * 55;
  const topFreq = j.step === 2 ? baseFreq * 1.85 : baseFreq * 1.45;
  addTone({
    startTime: frameToTime(105 + j.start),
    duration: 0.25,
    freqStart: baseFreq,
    freqEnd: topFreq,
    gain: 0.22,
    type: 'bell',
  });
  // Squash & rebound landing thud-pop
  addTone({
    startTime: frameToTime(105 + j.end),
    duration: 0.18,
    freqStart: topFreq * 0.8,
    freqEnd: baseFreq * 1.25,
    gain: 0.2,
    type: 'warm',
  });
});
// Goal reached chord at stair 5 (frame 105 + 172 -> ~270)
[523.25, 659.25, 783.99].forEach((freq) => {
  addTone({ startTime: frameToTime(105 + 150), duration: 0.4, freqStart: freq, freqEnd: freq, gain: 0.12, type: 'bell' });
});

// 3. Scene 3 (9 - 14.5s, frames 270..435): Recursion tree layers + duplicate pulse
addTransition(270);
const layerStarts = [10, 32, 56, 78];
layerStarts.forEach((relF, idx) => {
  addTone({
    startTime: frameToTime(270 + relF),
    duration: 0.22,
    freqStart: 400 + idx * 70,
    freqEnd: 520 + idx * 80,
    gain: 0.18,
    type: 'bell',
  });
});
// Duplicate nodes f(3), f(2) pulsing alert + O(2^n) badge
[95, 112, 129].forEach((relF) => {
  addTone({
    startTime: frameToTime(270 + relF),
    duration: 0.26,
    freqStart: 370,
    freqEnd: 311.13,
    gain: 0.18,
    type: 'alert',
  });
});

// 4. Scene 4 (14.5 - 24s, frames 435..720): DP Table filling with ascending pitch & final chord!
addTransition(435);
const dpStepRelFrames = [18, 40, 82, 120, 153, 181, 204, 223];
// C5 major scale ascending: C5, D5, E5, F5, G5, A5, B5, C6
const scaleFreqs = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 987.77, 1046.5];

dpStepRelFrames.forEach((relF, idx) => {
  const absFrame = 435 + relF;
  const noteFreq = scaleFreqs[idx];

  // Crisp ascending pop for each cell
  addTone({
    startTime: frameToTime(absFrame),
    duration: 0.32,
    freqStart: noteFreq * 0.85,
    freqEnd: noteFreq,
    gain: 0.24,
    type: 'bell',
  });

  // Final cell (idx === 7, value 21): glorious major chord!
  if (idx === 7) {
    const chordFreqs = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.5];
    chordFreqs.forEach((cf, cIdx) => {
      addTone({
        startTime: frameToTime(absFrame) + cIdx * 0.025,
        duration: 1.35,
        freqStart: cf,
        freqEnd: cf,
        gain: 0.14,
        type: 'bell',
      });
    });
  }
});

// 5. Scene 5 (24 - 28.5s, frames 720..855): Summary Three Cards
addTransition(720);
const cardDelays = [14, 42, 70];
const cardNotes = [523.25, 659.25, 783.99];
cardDelays.forEach((relF, idx) => {
  const absFrame = 720 + relF;
  addTone({
    startTime: frameToTime(absFrame),
    duration: 0.38,
    freqStart: cardNotes[idx] * 0.8,
    freqEnd: cardNotes[idx],
    gain: 0.22,
    type: 'bell',
  });
});

// Final resolution chord at frame 800
[523.25, 659.25, 783.99, 1046.5].forEach((cf, i) => {
  addTone({
    startTime: frameToTime(800) + i * 0.03,
    duration: 1.4,
    freqStart: cf,
    freqEnd: cf,
    gain: 0.13,
    type: 'bell',
  });
});

// Encode as 16-bit PCM WAV
function writeWavFile(filePath, samples) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (SAMPLE_RATE * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = samples.length * 2;
  const bufferWav = Buffer.alloc(44 + dataSize);

  bufferWav.write('RIFF', 0);
  bufferWav.writeUInt32LE(36 + dataSize, 4);
  bufferWav.write('WAVE', 8);
  bufferWav.write('fmt ', 12);
  bufferWav.writeUInt32LE(16, 16); // PCM chunk size
  bufferWav.writeUInt16LE(1, 20);  // PCM format
  bufferWav.writeUInt16LE(numChannels, 22);
  bufferWav.writeUInt32LE(SAMPLE_RATE, 24);
  bufferWav.writeUInt32LE(byteRate, 28);
  bufferWav.writeUInt16LE(blockAlign, 32);
  bufferWav.writeUInt16LE(bitsPerSample, 34);
  bufferWav.write('data', 36);
  bufferWav.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-0.98, Math.min(0.98, samples[i]));
    const intVal = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
    bufferWav.writeInt16LE(Math.round(intVal), 44 + i * 2);
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, bufferWav);
  console.log(`Generated ${filePath} (${(bufferWav.length / 1024).toFixed(1)} KB)`);
}

const outPath = path.resolve('public/sfx.wav');
writeWavFile(outPath, buffer);
