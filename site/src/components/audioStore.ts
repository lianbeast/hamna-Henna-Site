/**
 * Shared ambient-audio engine + store.
 *
 * Owns the AudioContext and tanpura drone so the play/pause button and
 * the settings popover can both control it live. Pitch, volume, sound
 * character, and reverb are persisted so returning visitors keep their
 * preference.
 *
 * Same module-level listener pattern as scrollStore/themeStore.
 */

/* ── Tanpura synthesizer ─────────────────────────────────── */

interface Tanpura {
  start(): void;
  stop(onStopped?: () => void): void;
  setRoot(freq: number): void;
  setVolume(v: number): void;
  setType(type: OscillatorType): void;
  setReverb(enabled: boolean, mix: number): void;
}

const BASE_GAIN = 0.42;
const FADE_OUT_MS = 2000;

/** Sound characters: oscillator waveform + matching jawari buzz level. */
export const AUDIO_TYPES: Array<{ value: OscillatorType; label: string; noise: number }> = [
  { value: 'sine', label: 'Soft', noise: 0.028 },
  { value: 'triangle', label: 'Mellow', noise: 0.042 },
  { value: 'sawtooth', label: 'Rich', noise: 0.06 },
];

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

/* ── Schroeder reverb ──────────────────────────────────── */

function buildReverb(
  ctx: AudioContext,
  input: GainNode,
  mix: number,
): { dryGain: GainNode; wetGain: GainNode; setMix(m: number): void } {
  const sampleRate = ctx.sampleRate;

  const dryGain = ctx.createGain();
  dryGain.gain.value = 1 - mix;

  const wetGain = ctx.createGain();
  wetGain.gain.value = mix;

  // Dry path: input → dryGain → output
  // Wet path: input → combs → allpasses → wetGain → output
  // (Caller connects dryGain and wetGain to a merger)

  // ── 4 parallel comb filters ──────────────────────────
  const combDelays = [1557, 1617, 1491, 1422]; // ms — tuned for warm room
  const combFeedbacks = [0.84, 0.82, 0.80, 0.78];
  const combNodes: DelayNode[] = [];
  const combFbNodes: GainNode[] = [];

  for (let i = 0; i < 4; i++) {
    const delay = ctx.createDelay(2.0); // max delay 2s
    const fb = ctx.createGain();
    const filter = ctx.createBiquadFilter(); // lowpass for warm tail

    delay.delayTime.value = (sampleRate * combDelays[i]) / 1000;
    fb.gain.value = combFeedbacks[i];
    filter.type = 'lowpass';
    filter.frequency.value = 3500;
    filter.Q.value = 0.5;

    // input → delay → filter → fb → delay  (feedback loop)
    // input → delay (for wet output)
    input.connect(delay);
    delay.connect(filter);
    filter.connect(fb);
    fb.connect(delay);
    // Tap the delay output to the allpass chain
    delay.connect(filter); // already done above, just ensure we tap from filter output

    combNodes.push(delay);
    combFbNodes.push(fb);
  }

  // ── 2 cascaded allpass filters ────────────────────────
  const allpassDelays = [225, 556]; // ms
  const allpassFb = 0.5;

  let chainNode: DelayNode | BiquadFilterNode = combFbNodes[0]; // start from first comb's feedback tap
  // Actually, mix comb outputs first into a summing gain
  const combSum = ctx.createGain();
  combSum.gain.value = 1;
  for (let i = 0; i < 4; i++) {
    // Tap from the filter output (which is in the feedback loop)
    const tapGain = ctx.createGain();
    tapGain.gain.value = 0.25;
    // Reconnect: input → comb, and tap from filter for summing
    // We need to tap the filter output. Let's redo the routing cleanly.
  }

  // Let me redo this more cleanly with explicit routing:
  // The above comb routing is tangled. Let me build it properly.

  // Clean approach: build the wet path separately
  // input → [parallel combs] → sum → [series allpasses] → wetGain

  const wetInput = ctx.createGain();
  wetInput.gain.value = 1;

  // 4 parallel combs, each with its own feedback loop
  const combSumGain = ctx.createGain();
  combSumGain.gain.value = 1;

  for (let i = 0; i < 4; i++) {
    const delayTime = (sampleRate * combDelays[i]) / 1000;
    const delay = ctx.createDelay(2.0);
    delay.delayTime.value = delayTime;

    const fbGain = ctx.createGain();
    fbGain.gain.value = combFeedbacks[i];

    const lpFilter = ctx.createBiquadFilter();
    lpFilter.type = 'lowpass';
    lpFilter.frequency.value = 3200;
    lpFilter.Q.value = 0.5;

    // wetInput → delay → lpFilter → fbGain → delay  (loop)
    //                          ↓
    //                     combSumGain  (tap)
    wetInput.connect(delay);
    delay.connect(lpFilter);
    lpFilter.connect(fbGain);
    fbGain.connect(delay);
    // Tap output
    const tap = ctx.createGain();
    tap.gain.value = 0.25;
    lpFilter.connect(tap);
    tap.connect(combSumGain);
  }

  // 2 series allpass filters
  let allpassChain: GainNode = combSumGain;

  for (let i = 0; i < 2; i++) {
    const delayTime = (sampleRate * allpassDelays[i]) / 1000;
    const delay = ctx.createDelay(2.0);
    delay.delayTime.value = delayTime;

    const apFb = ctx.createGain();
    apFb.gain.value = allpassFb;

    const apFwd = ctx.createGain();
    apFwd.gain.value = 1;

    const apSum = ctx.createGain();
    apSum.gain.value = 1;

    // Allpass: in → delay → fbFb → in  (feedback)
    //          in → apFwd → out
    //          delay → apSum → out
    allpassChain.connect(delay);
    delay.connect(apFb);
    apFb.connect(delay);   // feedback loop
    delay.connect(apSum);  // delayed signal

    allpassChain.connect(apFwd);
    apFwd.connect(apSum);  // dry signal

    allpassChain = apSum;
  }

  // Connect: wetInput ← input, allpassChain → wetGain
  input.connect(wetInput);
  allpassChain.connect(wetGain);

  return {
    dryGain,
    wetGain,
    setMix(m) {
      const now = ctx.currentTime;
      dryGain.gain.setTargetAtTime(1 - m, now, 0.05);
      wetGain.gain.setTargetAtTime(m, now, 0.05);
    },
  };
}

function buildTanpura(
  ctx: AudioContext,
  initial: { rootFreq: number; volume: number; type: OscillatorType; noise: number; reverbMix: number; reverbEnabled: boolean },
): Tanpura {
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0;

  // ── Reverb insert between masterGain and destination ──
  const reverbInput = ctx.createGain(); // same node as masterGain for reverb tap
  const reverb = buildReverb(ctx, masterGain, initial.reverbEnabled ? initial.reverbMix : 0);

  // Merge dry + wet → destination
  const outputMerger = ctx.createGain();
  outputMerger.gain.value = 1;
  reverb.dryGain.connect(outputMerger);
  reverb.wetGain.connect(outputMerger);
  outputMerger.connect(ctx.destination);

  const volumeRef = { current: initial.volume };
  const reverbMixRef = { current: initial.reverbEnabled ? initial.reverbMix : 0 };
  const reverbEnabledRef = { current: initial.reverbEnabled };

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
    osc.type = initial.type;
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
  noiseGain.gain.value = initial.noise;
  const noiseGainRef = { current: initial.noise };

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
    setType(type) {
      const now = ctx.currentTime;
      for (const osc of oscillators) osc.type = type;
      const entry = AUDIO_TYPES.find((t) => t.value === type);
      const noise = entry ? entry.noise : 0.06;
      noiseGainRef.current = noise;
      noiseGain.gain.setTargetAtTime(noise, now, 0.1);
    },
    setReverb(enabled, mix) {
      reverbEnabledRef.current = enabled;
      reverbMixRef.current = mix;
      reverb.setMix(enabled ? mix : 0);
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
let type: OscillatorType = 'sawtooth';
let reverbEnabled = true;
let reverbMix = 35; // 0–100, maps to 0–0.6 wet

function loadPrefs(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const p = JSON.parse(raw);
    if (typeof p.note === 'string' && p.note in NOTE_FREQ) note = p.note as AudioNote;
    if (typeof p.volume === 'number' && p.volume >= 0 && p.volume <= 100) volume = Math.round(p.volume);
    if (typeof p.type === 'string' && AUDIO_TYPES.some((t) => t.value === p.type)) type = p.type as OscillatorType;
    if (typeof p.reverbEnabled === 'boolean') reverbEnabled = p.reverbEnabled;
    if (typeof p.reverbMix === 'number' && p.reverbMix >= 0 && p.reverbMix <= 100) reverbMix = Math.round(p.reverbMix);
  } catch { /* ignore */ }
}

function persist(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ note, volume, type, reverbEnabled, reverbMix }));
  } catch { /* ignore */ }
}

function ensureEngine(): { ctx: AudioContext; drone: Tanpura } {
  if (!ctx || ctx.state === 'closed') {
    ctx = new AudioContext();
  }
  if (!drone) {
    const char = AUDIO_TYPES.find((t) => t.value === type) ?? AUDIO_TYPES[2];
    drone = buildTanpura(ctx, {
      rootFreq: NOTE_FREQ[note],
      volume: volume / 100,
      type: char.value,
      noise: char.noise,
      reverbMix: reverbMix / 100,
      reverbEnabled,
    });
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

export function setType(t: OscillatorType): void {
  if (!AUDIO_TYPES.some((c) => c.value === t)) return;
  type = t;
  persist();
  drone?.setType(t);
  emit();
}

export function setReverb(enabled: boolean): void {
  reverbEnabled = enabled;
  persist();
  drone?.setReverb(enabled, reverbMix / 100);
  emit();
}

export function setReverbMix(m: number): void {
  reverbMix = Math.max(0, Math.min(100, Math.round(m)));
  persist();
  if (reverbEnabled) drone?.setReverb(true, reverbMix / 100);
  emit();
}

export function getAudioState(): {
  playing: boolean;
  note: AudioNote;
  volume: number;
  type: OscillatorType;
  reverbEnabled: boolean;
  reverbMix: number;
} {
  return { playing, note, volume, type, reverbEnabled, reverbMix };
}

export function onAudioChange(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

// Load persisted preferences once at import time.
loadPrefs();
