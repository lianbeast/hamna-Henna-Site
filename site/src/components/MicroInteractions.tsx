import { useEffect, useRef } from 'react';

/**
 * Lightweight micro-interactions applied via event delegation:
 * 1. Card tilt — glass panels tilt toward the mouse cursor in 3D
 * 2. Button pulse — CTA buttons pulse once when they scroll into view
 * 3. Number counters — .counter elements count up from 0 when visible
 */
export default function MicroInteractions() {
  const rafRef = useRef(0);

  useEffect(() => {
    // ── 1. Card tilt on hover ─────────────────────────────
    const onCardMouseMove = (e: MouseEvent) => {
      const card = (e.currentTarget as HTMLElement);
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const tiltX = (0.5 - y) * 8;  // max ±4deg
      const tiltY = (x - 0.5) * 8;
      card.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.01)`;
    };

    const onCardMouseLeave = (e: MouseEvent) => {
      const card = (e.currentTarget as HTMLElement);
      card.style.transform = '';
    };

    // Attach tilt to all glass panels
    const attachTilt = () => {
      document.querySelectorAll('.glass-panel').forEach((el) => {
        el.addEventListener('mousemove', onCardMouseMove as EventListener);
        el.addEventListener('mouseleave', onCardMouseLeave as EventListener);
      });
    };

    // ── 2. Button pulse on scroll-into-view ───────────────
    const pulseObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('pulse-in');
            pulseObserver.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.5 },
    );

    const attachPulse = () => {
      document.querySelectorAll('.pricing-cta, .ig-follow-btn').forEach((el) => {
        pulseObserver.observe(el);
      });
    };

    // ── 3. Number counters ────────────────────────────────
    const animateCounter = (el: Element) => {
      const target = parseInt(el.getAttribute('data-count') || '0', 10);
      if (isNaN(target) || target === 0) return;
      const duration = 1200;
      const start = performance.now();

      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out quad
        const eased = 1 - (1 - progress) * (1 - progress);
        el.textContent = String(Math.round(eased * target));
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.5 },
    );

    const attachCounters = () => {
      document.querySelectorAll('.counter').forEach((el) => {
        counterObserver.observe(el);
      });
    };

    // Initial attach
    attachTilt();
    attachPulse();
    attachCounters();

    // Re-attach when new content loads (FAQ accordion, lazy sections)
    const mutationObserver = new MutationObserver(() => {
      attachTilt();
      attachPulse();
      attachCounters();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.querySelectorAll('.glass-panel').forEach((el) => {
        el.removeEventListener('mousemove', onCardMouseMove as EventListener);
        el.removeEventListener('mouseleave', onCardMouseLeave as EventListener);
      });
      pulseObserver.disconnect();
      counterObserver.disconnect();
      mutationObserver.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return null; // No DOM output — pure side-effect component
}
