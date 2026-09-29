const KEY = 'hbh-theme';

function current(): 'light' | 'dark' {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('theme-dark') ? 'dark' : 'light';
}

function apply(next: 'light' | 'dark') {
  document.documentElement.classList.toggle('theme-dark', next === 'dark');
  try {
    localStorage.setItem(KEY, next);
  } catch {
    // private mode / storage disabled — the class is still applied
  }
  document.dispatchEvent(new CustomEvent('hbh:theme', { detail: next }));
}

export const themeStore = {
  get: current,
  set: apply,
  toggle() {
    apply(current() === 'dark' ? 'light' : 'dark');
  },
};
