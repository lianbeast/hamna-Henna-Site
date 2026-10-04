import { useEffect, useRef, useState } from 'react';

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#packages', label: 'Packages' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#contact', label: 'Contact' },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDialogElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    if (!panel) return;
    // The native modal keeps the background inert and restores trigger focus.
    panel.showModal();
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const controls = panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    panel.addEventListener('keydown', trapFocus);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const desktop = window.matchMedia('(min-width: 64rem)');
    const onResize = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener('change', onResize);
    onResize();

    return () => {
      desktop.removeEventListener('change', onResize);
      panel.removeEventListener('keydown', trapFocus);
      panel.close();
      document.body.style.overflow = prevOverflow;
      if (desktop.matches) {
        document.querySelector<HTMLElement>('.brand')?.focus({ preventScroll: true });
      } else {
        buttonRef.current?.focus({ preventScroll: true });
      }
    };
  }, [open]);

  const navigate = (href: string) => {
    setOpen(false);
    requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;
      const previousTabIndex = target.getAttribute('tabindex');
      target.tabIndex = -1;
      target.focus({ preventScroll: true });
      target.addEventListener('blur', () => {
        if (previousTabIndex === null) target.removeAttribute('tabindex');
        else target.setAttribute('tabindex', previousTabIndex);
      }, { once: true });
    });
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="btn btn-ghost h-11 w-11 !px-0 lg:hidden"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
          focusable="false"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M3 6h18M3 12h18M3 18h18" />
          )}
        </svg>
      </button>

      <dialog
        id="mobile-nav"
        ref={panelRef}
        aria-label="Site navigation"
        onCancel={(event) => {
          event.preventDefault();
          setOpen(false);
        }}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain border-0 bg-ivory px-6 pt-5 pb-10 text-espresso backdrop:bg-espresso/20 lg:hidden"
      >
        <div className="mb-8 flex items-center justify-between gap-4">
          <span className="script text-2xl">Henna by Hamna</span>
          <button
            type="button"
            autoFocus
            className="btn btn-ghost !px-4"
            onClick={() => setOpen(false)}
          >
            Close
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <nav aria-label="Mobile">
          <ul className="space-y-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="block min-h-11 py-3 font-[family-name:var(--font-display)] text-3xl text-espresso transition-colors hover:text-forest"
                  onClick={() => navigate(l.href)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href="#contact"
          onClick={() => navigate('#contact')}
          className="btn btn-primary mt-10 w-full"
        >
          Book Your Date
        </a>
      </dialog>
    </>
  );
}
