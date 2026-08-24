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

/**
 * Initialize from the DOM class already applied by the inline head script
 * (Layout.astro), falling back to the system preference. Notifies listeners
 * so subscribers (e.g. the 3D scene) pick up the initial theme too.
 */
export function initTheme(): void {
  try {
    // The head script runs before paint and has already resolved the theme —
    // adopt it as the source of truth to stay in sync.
    _dark = document.documentElement.classList.contains('theme-dark');

    // If nothing is stored yet, persist the resolved preference so future
    // loads are consistent even if the OS theme later changes.
    if (localStorage.getItem(KEY) === null) {
      localStorage.setItem(KEY, _dark ? 'dark' : 'light');
    }
  } catch { /* ignore */ }

  applyToDOM(_dark);
  for (const fn of listeners) fn(_dark);
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
