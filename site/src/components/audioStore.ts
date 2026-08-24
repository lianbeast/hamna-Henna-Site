/**
 * Shared ambient-audio engine + store.
 *
 * Owns the AudioContext and tanpura drone so the play/pause button and
 * the settings popover can both control it live. Pitch and volume are
 * persisted so returning visitors keep their preference.
 *
 * Same module-level listener pattern as scrollStore/themeStore.
 */

/* ── Tanpura synthesizer ─────────────────────────────────── */

interface Tanpura {
  start(): void;
  stop(onStopped?: () => void): void;
  setRoot(freq: number): void;
  setVolume(v: number): void;
}

const BASE_GAIN = 0.42;
const FADE_OUT_MS = 2000;

/** Pitch choices — Sa (tonic) offered as natural keys in octave 3. */
export const AUDIO_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
export type AudioNote = (typeof AUDIO_NOTES)[number];

export const NOTE_FREQ: Record<AudioNote, number> = {
  C: 130.81, // C3
  D: 146.83,
  E: 164.81,
  F: 174.61,
  G: 196.0,  // G3
  A: 220.0,
  B: 246.94,
};

function buildTanpura(ctx: AudioContext, initial: { rootFreq: number; volume: number }): Tanpura {
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0;
  masterGain.connect(ctx.destination);

  const volumeRef = { current: initial.volume };

  // Voice table — frequencies are multiples of the Sa root.
  const voices: Array<{ mult: number; detune: number; gain: number }> = [
    // Sa (tonic) — 3 detuned copies for rich chorusing
    { mult: 1, detune: -8, gain: 0.22 },
    { mult: 1, detune: 0, gain: 0.25 },
    { mult: 1, detune: +8, gain: 0.22 },
    // Sa octave
    { mult: 2, detune: -5, gain: 0.1 },
    // Pa (fifth) — 2 copies
    { mult: 1.5, detune: -6, gain: 0.16 },
    { mult: 1.5, detune: +6, gain: 0.16 },
    // Higher shimmer
    { mult: 3, detune: -4, gain: 0.06 },
  ];

  const oscillators: OscillatorNode[] = [];

  for (const v of voices) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = initial.rootFreq * v.mult;
    osc.detune.value = v.detune;
    gain.gain.value = v.gain;
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start();
    oscillators.push(osc);
  }

  // ── Jawari buzz (filtered noise) ──────────────────────
  const noiseLen = 4; // seconds, will loop
  const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * noiseLen, ctx.sampleRate);
  const data = noiseBuf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.5;
  }

  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.06;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.value = 1800;
  bandpass.Q.value = 0.7;

  const highpass = ctx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 600;

  noiseGain.connect(bandpass);
  bandpass.connect(highpass);
  highpass.connect(masterGain);

  const noiseSrc = ctx.createBufferSource();
  noiseSrc.buffer = noiseBuf;
  noiseSrc.loop = true;
  noiseSrc.connect(noiseGain);
  noiseSrc.start();

  // ── Gentle amplitude wobble LFO ───────────────────────
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.type = 'sine';
  lfo.frequency.value = 0.09; // very slow
  lfoGain.gain.value = 0.04;
  lfo.connect(lfoGain);
  lfoGain.connect(masterGain.gain);
  lfo.start();

  return {
    start() {
      const now = ctx.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setValueAtTime(masterGain.gain.value, now);
      masterGain.gain.linearRampToValueAtTime(BASE_GAIN * volumeRef.current, now + 2.5);
    },
    stop(onStopped) {
      const now = ctx.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setValueAtTime(masterGain.gain.value, now);
      masterGain.gain.linearRampToValueAtTime(0, now + FADE_OUT_MS / 1000);
      if (onStopped) window.setTimeout(onStopped, FADE_OUT_MS + 120);
    },
    setRoot(freq) {
      const now = ctx.currentTime;
      for (let i = 0; i < oscillators.length; i++) {
        oscillators[i].frequency.setTargetAtTime(freq * voices[i].mult, now, 0.12);
      }
    },
    setVolume(v) {
      volumeRef.current = v;
      const now = ctx.currentTime;
      masterGain.gain.setTargetAtTime(BASE_GAIN * v, now, 0.08);
    },
  };
}

/* ── Store ───────────────────────────────────────────────── */

type Listener = () => void;
const listeners = new Set<Listener>();

const STORAGE_KEY = 'henna-audio';

let ctx: AudioContext | null = null;
let drone: Tanpura | null = null;
let playing = false;
let note: AudioNote = 'C';
let volume = 70;

function loadPrefs(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const p = JSON.parse(raw);
    if (typeof p.note === 'string' && p.note in NOTE_FREQ) note = p.note as AudioNote;
    if (typeof p.volume === 'number' && p.volume >= 0 && p.volume <= 100) volume = Math.round(p.volume);
  } catch { /* ignore */ }
}

function persist(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ note, volume }));
  } catch { /* ignore */ }
}

function ensureEngine(): { ctx: AudioContext; drone: Tanpura } {
  if (!ctx || ctx.state === 'closed') {
    ctx = new AudioContext();
  }
  if (!drone) {
    drone = buildTanpura(ctx, { rootFreq: NOTE_FREQ[note], volume: volume / 100 });
  }
  return { ctx, drone };
}

function emit(): void {
  for (const fn of listeners) fn();
}

/** Toggle play/pause. Returns the new playing state. */
export async function togglePlay(): Promise<boolean> {
  const { ctx: c, drone: d } = ensureEngine();

  if (playing) {
    d.stop(() => {
      if (c.state === 'running') c.suspend();
    });
    playing = false;
  } else {
    if (c.state === 'suspended') await c.resume();
    d.start();
    playing = true;
  }
  emit();
  return playing;
}

export function setNote(n: AudioNote): void {
  if (!(n in NOTE_FREQ)) return;
  note = n;
  persist();
  drone?.setRoot(NOTE_FREQ[n]);
  emit();
}

export function setVolume(v: number): void {
  volume = Math.max(0, Math.min(100, Math.round(v)));
  persist();
  drone?.setVolume(volume / 100);
  emit();
}

export function getAudioState(): { playing: boolean; note: AudioNote; volume: number } {
  return { playing, note, volume };
}

export function onAudioChange(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

// Load persisted preferences once at import time.
loadPrefs();
