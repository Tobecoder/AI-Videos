"""Procedurally synthesize background music + sound effects (no copyrighted audio).

Writes WAV files into public/audio/.
  bgm_tense.wav  - D minor pulse, used for hook / crash / mistakes
  bgm_bull.wav   - A major upbeat, used for the 924 rally + holiday
  bgm_sad.wav    - A minor slow piano, used for the comparison + lessons
  sfx_*.wav      - one-shots
"""
from pathlib import Path
import wave

import numpy as np

SR = 44100
OUT = Path(__file__).resolve().parent.parent / "public" / "audio"
OUT.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(924)


# ----------------------------------------------------------------- helpers
def write(name, x, peak=0.89):
    x = np.asarray(x, dtype=np.float64)
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    m = np.max(np.abs(x)) or 1.0
    x = x / m * peak
    data = (x * 32767).astype("<i2")
    with wave.open(str(OUT / name), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())
    print(f"  {name}: {len(x) / SR:.2f}s")


def t_arr(dur):
    return np.arange(int(dur * SR)) / SR


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def adsr(n, a=0.005, d=0.1, s=0.6, r=0.2, sus_len=None):
    a_n, d_n, r_n = int(a * SR), int(d * SR), int(r * SR)
    s_n = max(0, n - a_n - d_n - r_n) if sus_len is None else int(sus_len * SR)
    env = np.concatenate([
        np.linspace(0, 1, a_n, endpoint=False),
        np.linspace(1, s, d_n, endpoint=False),
        np.full(s_n, s),
        np.linspace(s, 0, r_n),
    ])
    if len(env) < n:
        env = np.pad(env, (0, n - len(env)))
    return env[:n]


def fft_filter(x, lo=None, hi=None, slope=1.0):
    """Smooth band filter in the frequency domain."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    g = np.ones_like(f)
    if hi:
        g *= 1 / (1 + (f / hi) ** (4 * slope))
    if lo:
        g *= 1 / (1 + (lo / np.maximum(f, 1e-3)) ** (4 * slope))
    return np.fft.irfft(X * g, n=len(x))


def reverb(x, seconds=2.2, wet=0.3, damp=4000):
    n = int(seconds * SR)
    tt = np.arange(n) / SR
    ir = rng.standard_normal(n) * np.exp(-tt * 6.9 / seconds)
    ir = fft_filter(ir, hi=damp)
    ir[: int(0.012 * SR)] = 0  # pre-delay
    ir /= np.sqrt(np.sum(ir ** 2))
    L = len(x) + n
    nfft = 1 << (L - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, nfft) * np.fft.rfft(ir, nfft), nfft)[: len(x)]
    return x * (1 - wet) + y * wet * 0.6


def loop_reverb(x, **kw):
    """Reverb that wraps the tail around so the clip loops seamlessly."""
    y = reverb(np.concatenate([x, x]), **kw)
    return y[len(x):]


def place(buf, clip, at):
    i = int(at * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(clip))
    buf[i:j] += clip[: j - i]


def place_wrap(buf, clip, at):
    """Place a clip, wrapping overflow to the start (for loops)."""
    i = int(at * SR) % len(buf)
    n = len(clip)
    first = min(n, len(buf) - i)
    buf[i:i + first] += clip[:first]
    if n > first:
        buf[: n - first] += clip[first:]


# ----------------------------------------------------------------- instruments
def pluck(freq, dur=0.6, bright=0.6, decay=0.996):
    """Vectorized Karplus-Strong."""
    n = int(dur * SR)
    N = max(2, int(SR / freq))
    y = np.zeros(n + N + 1)
    y[: N + 1] = fft_filter(rng.uniform(-1, 1, N + 1), hi=2000 + 8000 * bright) if N > 64 else rng.uniform(-1, 1, N + 1)
    pos = N + 1
    while pos < len(y):
        end = min(len(y), pos + N)
        k = end - pos
        y[pos:end] = decay * 0.5 * (y[pos - N:pos - N + k] + y[pos - N - 1:pos - N - 1 + k])
        pos = end
    out = y[N + 1:N + 1 + n]
    return out * np.linspace(1, 0, n) ** 0.5


def keys(freq, dur=1.5, vel=1.0):
    """Soft electric-piano-ish tone."""
    t = t_arr(dur)
    x = np.zeros_like(t)
    for h, amp in [(1, 1.0), (2, 0.45), (3, 0.18), (4, 0.1), (6, 0.04)]:
        x += amp * np.sin(2 * np.pi * freq * h * t * (1 + 0.0007 * h)) * np.exp(-t * (1.6 + h * 0.9))
    x += 0.15 * np.sin(2 * np.pi * freq * 7.0 * t) * np.exp(-t * 30)  # tine attack
    return x * adsr(len(t), a=0.004, d=0.05, s=1.0, r=0.08) * vel


def pad(freqs, dur, cutoff=1400, detune=0.004, att=0.6, rel=0.8):
    t = t_arr(dur)
    x = np.zeros_like(t)
    for f in freqs:
        for d in (-detune, 0, detune):
            ph = rng.uniform(0, 2 * np.pi)
            # band-limited-ish saw: few harmonics
            for h in range(1, 9):
                x += np.sin(2 * np.pi * f * (1 + d) * h * t + ph * h) / h * 0.33
    x = fft_filter(x, hi=cutoff)
    return x * adsr(len(t), a=att, d=0.2, s=0.9, r=rel)


def bass(freq, dur, cutoff=600):
    t = t_arr(dur)
    x = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * freq * 2 * t) + 0.15 * np.sign(np.sin(2 * np.pi * freq * t))
    x = fft_filter(x, hi=cutoff)
    return x * adsr(len(t), a=0.004, d=0.08, s=0.7, r=0.05)


def kick(dur=0.45, f0=150, f1=42):
    t = t_arr(dur)
    f = f1 + (f0 - f1) * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-t * 7)
    x += 0.4 * rng.standard_normal(len(t)) * np.exp(-t * 400)
    return x


def hat(dur=0.06, open_=False):
    t = t_arr(0.25 if open_ else dur)
    x = fft_filter(rng.standard_normal(len(t)), lo=7000)
    return x * np.exp(-t * (14 if open_ else 70)) * 0.5


def clap(dur=0.25):
    t = t_arr(dur)
    x = fft_filter(rng.standard_normal(len(t)), lo=900, hi=5000)
    env = np.exp(-t * 18)
    for off in (0.0, 0.011, 0.022):
        env += 0.6 * np.exp(-np.maximum(t - off, 0) * 180) * (t >= off)
    return x * env * 0.6


def tick_sound(dur=0.03, f=3200):
    t = t_arr(dur)
    return np.sin(2 * np.pi * f * t) * np.exp(-t * 220)


# ----------------------------------------------------------------- tracks
def bgm_bull():
    """A major, 124 bpm, 8 bars: A  E  F#m  D  x2. Euphoric 'bull market' groove."""
    bpm = 124
    beat = 60 / bpm
    bars = 8
    L = int(bars * 4 * beat * SR)
    buf = np.zeros(L)
    prog = [(57, [57, 61, 64]), (52, [56, 59, 64]), (54, [57, 61, 66]), (50, [57, 62, 66])] * 2
    arp_pat = [0, 1, 2, 1, 3, 2, 1, 2]
    for b, (root, chord) in enumerate(prog):
        t0 = b * 4 * beat
        # pad
        place_wrap(buf, pad([midi(n) for n in chord], 4 * beat + 0.3, cutoff=1800, att=0.08, rel=0.3) * 0.10, t0)
        # bass: syncopated eighths
        for i, on in enumerate([1, 0, 1, 1, 0, 1, 1, 1]):
            if on:
                place_wrap(buf, bass(midi(root - 12), beat * 0.45) * 0.42, t0 + i * beat / 2)
        # pluck arpeggio 16ths, two octaves
        notes = [chord[0] + 12, chord[1] + 12, chord[2] + 12, chord[0] + 24]
        for i in range(16):
            n = notes[arp_pat[i % 8]]
            place_wrap(buf, pluck(midi(n), 0.4, bright=0.7) * (0.20 if i % 4 == 0 else 0.13), t0 + i * beat / 4)
        # drums
        for q in range(4):
            place_wrap(buf, kick() * 0.85, t0 + q * beat)
            place_wrap(buf, hat(open_=True) * 0.35, t0 + q * beat + beat / 2)
            for s in range(4):
                place_wrap(buf, hat() * (0.22 if s % 2 else 0.12), t0 + q * beat + s * beat / 4)
            if q in (1, 3):
                place_wrap(buf, clap() * 0.55, t0 + q * beat)
    # top-line hook
    mel = [(76, 0, 1), (78, 1, 0.5), (76, 1.5, 0.5), (73, 2, 1), (71, 3, 1),
           (71, 4, 1), (73, 5, 0.5), (76, 5.5, 1.5), (78, 8, 1), (76, 9, 1), (73, 10, 2),
           (74, 12, 1), (73, 13, 1), (71, 14, 0.5), (69, 14.5, 1.5)]
    for rep in range(2):
        for n, st, d in mel:
            place_wrap(buf, keys(midi(n), d * beat + 0.4) * 0.22, (rep * 16 + st) * beat)
    return loop_reverb(buf, seconds=1.4, wet=0.22)


def bgm_tense():
    """D minor, 100 bpm, 8 bars: Dm  Bb  Gm  A. Ticking clock, pulsing bass."""
    bpm = 100
    beat = 60 / bpm
    bars = 8
    L = int(bars * 4 * beat * SR)
    buf = np.zeros(L)
    prog = [(50, [62, 65, 69]), (46, [62, 65, 70]), (43, [62, 67, 70]), (45, [61, 64, 69])] * 2
    for b, (root, chord) in enumerate(prog):
        t0 = b * 4 * beat
        place_wrap(buf, pad([midi(n - 12) for n in chord], 4 * beat + 0.6, cutoff=900, att=0.5, rel=0.6) * 0.16, t0)
        for i in range(8):  # pulsing eighth bass
            v = 0.5 if i % 2 == 0 else 0.32
            place_wrap(buf, bass(midi(root - 12), beat * 0.38, cutoff=420) * v, t0 + i * beat / 2)
        for q in range(4):  # clock tick + low heartbeat
            place_wrap(buf, tick_sound(f=2600 if q % 2 else 3400) * 0.16, t0 + q * beat)
            if q in (0, 2):
                place_wrap(buf, kick(0.4, f0=110, f1=40) * 0.6, t0 + q * beat)
        if b % 2 == 1:  # high plucked motif
            for k, n in enumerate([chord[2] + 12, chord[1] + 12, chord[0] + 12]):
                place_wrap(buf, pluck(midi(n), 0.9, bright=0.4, decay=0.998) * 0.12, t0 + 2 * beat + k * beat * 0.5)
    return loop_reverb(buf, seconds=2.8, wet=0.32)


def bgm_sad():
    """A minor, 72 bpm piano: Am  F  C  G  x2, sparse melody, big reverb."""
    bpm = 72
    beat = 60 / bpm
    bars = 8
    L = int(bars * 4 * beat * SR)
    buf = np.zeros(L)
    prog = [(45, [57, 60, 64]), (41, [57, 60, 65]), (48, [55, 60, 64]), (43, [55, 59, 62])] * 2
    for b, (root, chord) in enumerate(prog):
        t0 = b * 4 * beat
        place_wrap(buf, keys(midi(root - 12), 4 * beat) * 0.45, t0)
        place_wrap(buf, keys(midi(root), 4 * beat) * 0.25, t0)
        # broken chord
        for i, n in enumerate([chord[0], chord[1], chord[2], chord[1], chord[0] + 12, chord[2], chord[1], chord[2]]):
            place_wrap(buf, keys(midi(n), 1.6) * 0.17, t0 + i * beat / 2)
        place_wrap(buf, pad([midi(n) for n in chord], 4 * beat + 1, cutoff=1100, att=1.2, rel=1.2) * 0.05, t0)
    mel = [(76, 0, 2), (74, 2, 1), (72, 3, 1), (72, 4, 3), (71, 7, 1), (72, 8, 2), (74, 10, 2),
           (71, 12, 4), (76, 16, 2), (77, 18, 1), (76, 19, 1), (72, 20, 4), (71, 24, 2), (72, 26, 1), (74, 27, 1), (69, 28, 4)]
    for n, st, d in mel:
        place_wrap(buf, keys(midi(n), d * beat + 0.8) * 0.26, st * beat)
    return loop_reverb(buf, seconds=3.5, wet=0.42, damp=3000)


# ----------------------------------------------------------------- sfx
def sfx_ding():
    t = t_arr(1.2)
    x = np.zeros_like(t)
    for f, a, d in [(1568, 1, 3), (2093, 0.7, 3.5), (3136, 0.35, 5), (4186, 0.2, 7)]:
        x += a * np.sin(2 * np.pi * f * t) * np.exp(-t * d)
    second = np.zeros_like(t)
    off = int(0.09 * SR)
    second[off:] = x[: len(t) - off] * 0.8
    return reverb(x + second, seconds=1.0, wet=0.2)


def sfx_cash():
    t = t_arr(1.0)
    clk = fft_filter(rng.standard_normal(len(t)), lo=2000) * np.exp(-t * 90) * 0.8
    bell = np.zeros_like(t)
    for f, a in [(2637, 1), (3520, 0.6), (5274, 0.3)]:
        bell += a * np.sin(2 * np.pi * f * t) * np.exp(-t * 4)
    bell = np.roll(bell, int(0.06 * SR)) * (t > 0.06)
    return reverb(clk + bell * 0.7, seconds=0.8, wet=0.18)


def sfx_whoosh(dur=0.7, up=True):
    n = int(dur * SR)
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    win = 2048
    hop = win // 4
    w = np.hanning(win)
    for s in range(0, n - win, hop):
        p = s / n
        fc = 300 * (20 ** (p if up else 1 - p))
        seg = fft_filter(noise[s:s + win] * w, lo=fc * 0.6, hi=fc * 1.8)
        out[s:s + win] += seg
    env = np.sin(np.linspace(0, np.pi, n)) ** 1.5
    return out * env


def sfx_boom():
    t = t_arr(2.0)
    f = 30 + 90 * np.exp(-t * 12)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2)
    x += fft_filter(rng.standard_normal(len(t)), hi=900) * np.exp(-t * 6) * 0.5
    return reverb(x, seconds=2.2, wet=0.35, damp=1500)


def sfx_sad_trombone():
    """wah wah wah waaah"""
    notes = [(63, 0.42), (62, 0.42), (61, 0.42), (60, 1.5)]
    parts = []
    for i, (n, d) in enumerate(notes):
        t = t_arr(d)
        f = midi(n - 12)
        if i == 3:
            f = f * (1 + 0.012 * np.sin(2 * np.pi * 5.5 * t) * np.minimum(t * 2, 1))
        ph = 2 * np.pi * np.cumsum(np.broadcast_to(f, t.shape)) / SR
        x = sum(np.sin(ph * h) / h ** 0.9 for h in range(1, 14))
        # 'wah': opening filter per note
        x = fft_filter(x, hi=1600)
        env = adsr(len(t), a=0.04, d=0.08, s=0.8, r=0.12)
        wah = 0.55 + 0.45 * np.sin(np.minimum(t / 0.25, 1) * np.pi / 2)
        parts.append(x * env * wah)
    return reverb(np.concatenate(parts), seconds=1.2, wet=0.18)


def sfx_glitch():
    t = t_arr(0.45)
    x = np.sign(np.sin(2 * np.pi * 180 * t)) * 0.4 + rng.standard_normal(len(t)) * 0.4
    gate = (np.floor(t * 40) % 3 != 1).astype(float)
    x = np.round(x * 4) / 4 * gate
    return fft_filter(x, hi=6000) * np.exp(-t * 4)


def sfx_stamp():
    t = t_arr(0.6)
    x = np.sin(2 * np.pi * np.cumsum(70 + 120 * np.exp(-t * 40)) / SR) * np.exp(-t * 12)
    x += fft_filter(rng.standard_normal(len(t)), lo=200, hi=3000) * np.exp(-t * 35) * 0.7
    return x


def sfx_pop():
    t = t_arr(0.12)
    f = 500 + 900 * np.exp(-t * 60)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 40)


def sfx_tick():
    return tick_sound(0.04, 2800)


def sfx_riser(dur=1.6):
    t = t_arr(dur)
    f = 200 * (8 ** (t / dur))
    x = sum(np.sin(2 * np.pi * np.cumsum(f * (1 + d)) / SR) for d in (-0.01, 0, 0.01))
    x += sfx_whoosh(dur, up=True) * 0.6
    return x * (t / dur) ** 2


def sfx_alarm():
    t = t_arr(1.2)
    f = np.where((t * 4) % 1 < 0.5, 880, 660)
    x = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.5
    return fft_filter(x, hi=3000) * np.minimum(1, (1.2 - t) * 4)


if __name__ == "__main__":
    print("music:")
    write("bgm_bull.wav", bgm_bull(), peak=0.8)
    write("bgm_tense.wav", bgm_tense(), peak=0.8)
    write("bgm_sad.wav", bgm_sad(), peak=0.8)
    print("sfx:")
    write("sfx_ding.wav", sfx_ding())
    write("sfx_cash.wav", sfx_cash())
    write("sfx_whoosh.wav", sfx_whoosh())
    write("sfx_whoosh_down.wav", sfx_whoosh(0.9, up=False))
    write("sfx_boom.wav", sfx_boom())
    write("sfx_trombone.wav", sfx_sad_trombone())
    write("sfx_glitch.wav", sfx_glitch())
    write("sfx_stamp.wav", sfx_stamp())
    write("sfx_pop.wav", sfx_pop())
    write("sfx_tick.wav", sfx_tick(), peak=0.6)
    write("sfx_riser.wav", sfx_riser())
    write("sfx_alarm.wav", sfx_alarm(), peak=0.6)
