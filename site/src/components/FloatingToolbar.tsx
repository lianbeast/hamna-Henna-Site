import { useState, useEffect } from 'react';
import AudioToggle from './AudioToggle';
import AudioSettings from './AudioSettings';
import ShortcutHelp from './ShortcutHelp';
import ThemeToggle from './ThemeToggle';
import { toggleTheme } from './themeStore';
import { togglePlay } from './audioStore';

/**
 * Global keyboard shortcuts: T toggles the theme, M toggles the drone.
 * Ignored while typing in form fields or when modifier keys are held.
 */
function useToolbarShortcuts() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.repeat) return;

      // Don't hijack keys while the visitor is typing
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      const typing =
        tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || !!target?.isContentEditable;
      if (typing) return;

      const key = e.key.toLowerCase();
      if (key === 't') {
        toggleTheme();
      } else if (key === 'm') {
        void togglePlay();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}

export default function FloatingToolbar() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useToolbarShortcuts();

  if (!mounted) return null;

  return (
    <div className="toolbar-pill" role="toolbar" aria-label="Site controls">
      <ThemeToggle compact />
      <span className="toolbar-divider" aria-hidden="true" />
      <AudioToggle compact />
      <span className="toolbar-divider" aria-hidden="true" />
      <AudioSettings />
      <span className="toolbar-divider" aria-hidden="true" />
      <ShortcutHelp />
    </div>
  );
}
