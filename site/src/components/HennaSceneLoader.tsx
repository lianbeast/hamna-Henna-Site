import { Suspense, lazy, useEffect, useRef } from 'react';
import { setScrollProgress } from './scrollStore';

const HennaScene3D = lazy(() => import('./HennaScene'));

function Fallback() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <div
        style={{
          width: 48,
          height: 48,
          border: '2px solid rgba(194, 154, 75, 0.3)',
          borderTopColor: '#C29A4B',
          borderRadius: '50%',
          animation: 'henna-spin 1s linear infinite',
        }}
      />
      <style>{`@keyframes henna-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function HennaSceneLoader() {
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const onScroll = () => {
      // Cancel any pending rAF so we only fire once per frame
      if (raf.current !== null) cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        raf.current = null;
        const rect = hero.getBoundingClientRect();
        const heroHeight = rect.height;
        // progress: 0 when hero top is at viewport top,
        //          1 when hero bottom leaves viewport top
        const raw = -rect.top / heroHeight;
        setScrollProgress(raw);
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Fire once for initial value
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <Suspense fallback={<Fallback />}>
      <HennaScene3D />
    </Suspense>
  );
}