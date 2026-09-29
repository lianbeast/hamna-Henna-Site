import { useEffect, useState } from 'react';
import { themeStore } from '../stores/themeStore';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setTheme(themeStore.get());
    const onChange = (e: Event) =>
      setTheme((e as CustomEvent<'light' | 'dark'>).detail);
    document.addEventListener('hbh:theme', onChange);
    return () => document.removeEventListener('hbh:theme', onChange);
  }, []);

  const dark = theme === 'dark';

  return (
    <button
      type="button"
      className="btn btn-ghost h-11 w-11 !px-0"
      aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`}
      aria-pressed={dark}
      onClick={() => themeStore.toggle()}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        aria-hidden="true"
        focusable="false"
      >
        {dark ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
          </>
        ) : (
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        )}
      </svg>
    </button>
  );
}
