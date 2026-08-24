import { useEffect, useRef, useState } from 'react';
import { AUDIO_NOTES, AUDIO_TYPES, setNote, setVolume, setType, onAudioChange, getAudioState } from './audioStore';

export default function AudioSettings() {
  const [open, setOpen] = useState(false);
  const [note, setNoteState] = useState(getAudioState().note);
  const [volume, setVolumeState] = useState(getAudioState().volume);
  const [type, setTypeState] = useState(getAudioState().type);
  const rootRef = useRef<HTMLDivElement>(null);

  // Keep local state in sync with the store
  useEffect(() => {
    return onAudioChange(() => {
      const s = getAudioState();
      setNoteState(s.note);
      setVolumeState(s.volume);
      setTypeState(s.type);
    });
  }, []);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocMouseDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="audio-settings" ref={rootRef}>
      <button
        type="button"
        className="tune-btn"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Ambient drone settings"
        title="Tanpura settings"
      >
        {/* Sliders icon */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" />
          <path d="M1 14h6M9 8h6M17 16h6" />
        </svg>
      </button>

      {open && (
        <div className="audio-panel" role="dialog" aria-label="Ambient drone settings">
          <p className="audio-panel-title">Tanpura drone</p>

          <div className="audio-row">
            <span className="audio-row-label" id="audio-pitch-label">Pitch</span>
            <div className="audio-notes" role="group" aria-labelledby="audio-pitch-label">
              {AUDIO_NOTES.map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`audio-note${n === note ? ' audio-note--active' : ''}`}
                  onClick={() => setNote(n)}
                  aria-pressed={n === note}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="audio-row">
            <span className="audio-row-label" id="audio-type-label">Character</span>
            <div className="audio-notes" role="group" aria-labelledby="audio-type-label">
              {AUDIO_TYPES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  className={`audio-note${c.value === type ? ' audio-note--active' : ''}`}
                  onClick={() => setType(c.value)}
                  aria-pressed={c.value === type}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="audio-row">
            <span className="audio-row-label" id="audio-vol-label">Volume</span>
            <input
              type="range"
              className="audio-range"
              min={0}
              max={100}
              step={1}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-labelledby="audio-vol-label"
            />
            <span className="audio-vol">{volume}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
