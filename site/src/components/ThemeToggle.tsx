import { useState, useEffect, useCallback } from 'react';
import { initTheme, isDark, toggleTheme, onThemeChange } from './themeStore';

interface ThemeToggleProps {
  /** When true, removes fixed positioning & circular shape (toolbar owns layout). */
  compact?: boolean;
}

export default function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initTheme();
    setDark(isDark());
    setMounted(true);
    return onThemeChange(setDark);
  }, []);

  const toggle = useCallback(() => {
    toggleTheme();
    // setDark will update via the listener above
  }, []);

  if (!mounted) return null;

  return (
    <button
      type="button"
      className={`theme-btn ${compact ? 'theme-btn--compact' : 'theme-toggle'}`}
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Switch to light mode (T)' : 'Switch to dark mode (T)'}
      data-dark={dark ? 'true' : 'false'}
    >
      {/* Moon / Sun icon */}
      {dark ? (
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
          {/* Sun */}
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
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
          {/* Moon */}
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}