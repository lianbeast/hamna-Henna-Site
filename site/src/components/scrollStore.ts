/**
 * Simple reactive scroll-progress store.
 *
 * React DOM and @react-three/fiber run in separate reconcilers so
 * React context doesn't cross the boundary.  A plain module-level
 * object with a callback list solves that cleanly.
 */

type Listener = (progress: number) => void;

let _progress = 0;
const listeners = new Set<Listener>();

/** Current scroll progress 0–1 (0 = top of hero, 1 = hero fully scrolled past). */
export function getScrollProgress(): number {
  return _progress;
}

/** Set progress and notify all listeners. */
export function setScrollProgress(v: number): void {
  const clamped = Math.max(0, Math.min(1, v));
  if (clamped === _progress) return;
  _progress = clamped;
  for (const fn of listeners) fn(clamped);
}

/** Subscribe to changes. Returns an unsubscribe function. */
export function onScrollProgress(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}