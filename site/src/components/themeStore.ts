/**
 * Simple reactive theme store.
 *
 * Shared between React DOM and @react-three/fiber reconcilers
 * (same pattern as scrollStore.ts).
 */

type Listener = (dark: boolean) => void;

let _dark = false;
const listeners = new Set<Listener>();

const KEY = 'henna-theme';

/** Initialize from localStorage (call once at app start). */
export function initTheme(): void {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === 'dark') _dark = true;
  } catch { /* ignore */ }
  applyToDOM(_dark);
}

/** Is dark mode active? */
export function isDark(): boolean {
  return _dark;
}

/** Toggle and persist. */
export function toggleTheme(): boolean {
  _dark = !_dark;
  try {
    localStorage.setItem(KEY, _dark ? 'dark' : 'light');
  } catch { /* ignore */ }
  applyToDOM(_dark);
  for (const fn of listeners) fn(_dark);
  return _dark;
}

/** Subscribe to changes. Returns unsubscribe function. */
export function onThemeChange(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function applyToDOM(dark: boolean): void {
  document.documentElement.classList.toggle('theme-dark', dark);
}