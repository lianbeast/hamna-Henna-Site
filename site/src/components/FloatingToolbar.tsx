import { useState, useEffect } from 'react';
import AudioToggle from './AudioToggle';
import ThemeToggle from './ThemeToggle';

export default function FloatingToolbar() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="toolbar-pill" role="toolbar" aria-label="Site controls">
      <ThemeToggle compact />
      <span className="toolbar-divider" aria-hidden="true" />
      <AudioToggle compact />
    </div>
  );
}