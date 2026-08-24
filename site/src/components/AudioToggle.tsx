import { useRef, useState, useCallback, useEffect } from 'react';
import { togglePlay, onAudioChange, getAudioState } from './audioStore';

interface AudioToggleProps {
  /** When true, removes fixed positioning & circular shape (toolbar owns layout). */
  compact?: boolean;
}

export default function AudioToggle({ compact = false }: AudioToggleProps) {
  const [playing, setPlaying] = useState(() => getAudioState().playing);
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    setMounted(true);
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Keep local state in sync with the store
  useEffect(() => {
    return onAudioChange(() => {
      if (mountedRef.current) setPlaying(getAudioState().playing);
    });
  }, []);

  const toggle = useCallback(() => {
    void togglePlay();
  }, []);

  if (!mounted) return null;

  return (
    <button
      type="button"
      className={`audio-btn ${compact ? 'audio-btn--compact' : 'audio-toggle'}`}
      onClick={toggle}
      aria-label={playing ? 'Pause ambient drone' : 'Play ambient drone'}
      title={playing ? 'Pause tanpura drone (M)' : 'Play tanpura drone (M)'}
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
