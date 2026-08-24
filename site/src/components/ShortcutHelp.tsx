import { useEffect, useRef, useState } from 'react';

const SHOWN_KEY = 'henna-help-shown';

export default function ShortcutHelp() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [auto, setAuto] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // First visit: briefly show the hint, then remember it's been shown.
  useEffect(() => {
    if (!mounted) return;
    let shown = false;
    try {
      shown = localStorage.getItem(SHOWN_KEY) === '1';
    } catch { /* ignore */ }
    if (shown) return;

    setAuto(true);
    const t = setTimeout(() => {
      setAuto(false);
      try {
        localStorage.setItem(SHOWN_KEY, '1');
      } catch { /* ignore */ }
    }, 6000);
    return () => clearTimeout(t);
  }, [mounted]);

  // Close the manually opened popover on outside click or Escape
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

  if (!mounted) return null;

  const visible = open || auto;

  return (
    <div className="shortcut-help" ref={rootRef}>
      <button
        type="button"
        className="help-btn"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Keyboard shortcuts"
        title="Keyboard shortcuts (T · M)"
      >
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
          <circle cx="12" cy="12" r="9" />
          <path d="M9.4 9a2.6 2.6 0 0 1 5.1.8c0 1.7-2.5 2.2-2.5 3.7" />
          <path d="M12 17h.01" />
        </svg>
      </button>

      {visible && (
        <div className="help-panel" role="dialog" aria-label="Keyboard shortcuts">
          <p className="help-panel-title">Keyboard shortcuts</p>
          <div className="help-row">
            <kbd className="help-key">T</kbd>
            <span className="help-action">Toggle light / dark theme</span>
          </div>
          <div className="help-row">
            <kbd className="help-key">M</kbd>
            <span className="help-action">Play / pause ambient drone</span>
          </div>
        </div>
      )}
    </div>
  );
}
