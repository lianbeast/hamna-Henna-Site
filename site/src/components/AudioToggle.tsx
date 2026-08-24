import { useRef, useState, useCallback, useEffect } from 'react';

/**
 * Web Audio API tanpura drone synthesizer.
 *
 * Tanpura fundamentals: Sa (middle C ~ 261.63 Hz) and Pa (G ~ 392 Hz),
 * with detuned copies and filtered noise to approximate the jawari buzz.
 */
function buildTanpura(ctx: AudioContext): {
  masterGain: GainNode;
  start(): void;
  stop(): void;
} {
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0;
  masterGain.connect(ctx.destination);

  const oscillators: OscillatorNode[] = [];
  const noiseSources: AudioBufferSourceNode[] = [];

  // ── Drone voices ──────────────────────────────────────
  const voices: Array<{ freq: number; detune: number; gain: number }> = [
    // Sa (tonic) — 3 detuned copies for rich chorusing
    { freq: 130.81, detune: -8, gain: 0.22 },   // C3
    { freq: 130.81, detune: 0, gain: 0.25 },
    { freq: 130.81, detune: +8, gain: 0.22 },
    // Sa octave
    { freq: 261.63, detune: -5, gain: 0.10 },
    // Pa (fifth) — 2 copies
    { freq: 196.00, detune: -6, gain: 0.16 },
    { freq: 196.00, detune: +6, gain: 0.16 },
    // Higher shimmer
    { freq: 392.00, detune: -4, gain: 0.06 },
  ];

  for (const v of voices) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = v.freq;
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

  // Bandpass centered around 1–3 kHz for the bridge buzz
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
    masterGain,
    start() {
      const now = ctx.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setValueAtTime(masterGain.gain.value, now);
      masterGain.gain.linearRampToValueAtTime(0.42, now + 2.5);
    },
    stop() {
      const now = ctx.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setValueAtTime(masterGain.gain.value, now);
      masterGain.gain.linearRampToValueAtTime(0, now + 2.0);
    },
  };
}

/* ── React component ──────────────────────────────────────── */

interface AudioToggleProps {
  /** When true, removes fixed positioning & circular shape (toolbar owns layout). */
  compact?: boolean;
}

export default function AudioToggle({ compact = false }: AudioToggleProps) {
  const [playing, setPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const droneRef = useRef<ReturnType<typeof buildTanpura> | null>(null);

  // Only mount (and show) on the client
  useEffect(() => {
    setMounted(true);
    return () => {
      droneRef.current?.stop();
      ctxRef.current?.close();
    };
  }, []);

  const toggle = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }

    const ctx = ctxRef.current;

    // Resume if suspended (autoplay policy)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    if (!droneRef.current) {
      droneRef.current = buildTanpura(ctx);
    }

    if (playing) {
      droneRef.current.stop();
      setPlaying(false);
    } else {
      droneRef.current.start();
      setPlaying(true);
    }
  }, [playing]);

  if (!mounted) return null;

  return (
    <button
      type="button"
      className={`audio-btn ${compact ? 'audio-btn--compact' : 'audio-toggle'}`}
      onClick={toggle}
      aria-label={playing ? 'Pause ambient drone' : 'Play ambient drone'}
      title={playing ? 'Pause tanpura drone' : 'Play tanpura drone'}
      data-playing={playing ? 'true' : 'false'}
    >
      {/* Speaker icon with sound-wave bars */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M11 5 6 9 2 9 2 15 6 15 11 19 11 5Z" />
        {playing && (
          <>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" opacity="0.9" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" opacity="0.6" />
          </>
        )}
      </svg>
    </button>
  );
}