import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    // Hide on touch devices
    if (matchMedia('(pointer: coarse)').matches) {
      dot.style.display = 'none';
      ring.style.display = 'none';
      return;
    }

    const dotPos = { x: 0, y: 0 };
    const ringPos = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const move = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    window.addEventListener('mousemove', move);

    let raf;
    const tick = () => {
      dotPos.x += (target.x - dotPos.x) * 0.65;
      dotPos.y += (target.y - dotPos.y) * 0.65;
      ringPos.x += (target.x - ringPos.x) * 0.18;
      ringPos.y += (target.y - ringPos.y) * 0.18;
      dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%,-50%)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    };
    tick();

    // Context-aware states
    const setMode = (mode, text) => {
      if (mode === 'link') {
        gsap.to(ring, { width: 56, height: 56, borderColor: 'var(--color-pink)', backgroundColor: 'rgba(255,46,136,0.12)', duration: 0.35, ease: 'power3.out' });
        gsap.to(dot, { scale: 0, duration: 0.2 });
        label.textContent = '';
        gsap.to(label, { opacity: 0, duration: 0.2 });
      } else if (mode === 'image') {
        gsap.to(ring, { width: 96, height: 96, borderColor: 'rgba(244,237,228,0.6)', backgroundColor: 'rgba(244,237,228,0.05)', duration: 0.35, ease: 'power3.out' });
        gsap.to(dot, { scale: 0, duration: 0.2 });
        label.textContent = text || 'view';
        gsap.to(label, { opacity: 1, duration: 0.25, delay: 0.1 });
      } else if (mode === 'toggle') {
        gsap.to(ring, { width: 64, height: 64, borderColor: 'var(--color-pink)', backgroundColor: 'rgba(255,46,136,0.18)', duration: 0.35, ease: 'power3.out' });
        gsap.to(dot, { scale: 0, duration: 0.2 });
        label.textContent = text || '+';
        gsap.to(label, { opacity: 1, duration: 0.25, delay: 0.1 });
      } else {
        gsap.to(ring, { width: 28, height: 28, borderColor: 'rgba(244,237,228,0.4)', backgroundColor: 'transparent', duration: 0.35, ease: 'power3.out' });
        gsap.to(dot, { scale: 1, duration: 0.2 });
        gsap.to(label, { opacity: 0, duration: 0.2 });
      }
    };

    const handleOver = (e) => {
      const t = e.target;
      if (!t || !t.closest) return;
      const link = t.closest('a, button, [data-cursor="link"]');
      const img = t.closest('[data-cursor="image"]');
      const toggle = t.closest('[data-cursor="toggle"]');
      if (toggle) setMode('toggle', toggle.dataset.cursorLabel || '+');
      else if (img) setMode('image', img.dataset.cursorLabel || 'view');
      else if (link) setMode('link');
      else setMode('default');
    };

    document.addEventListener('mouseover', handleOver);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', handleOver);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] flex h-7 w-7 items-center justify-center rounded-full border border-paper/40 mix-blend-difference"
        style={{ willChange: 'transform, width, height' }}
      >
        <span ref={labelRef} className="text-[10px] uppercase tracking-[0.2em] opacity-0 font-mono text-paper">view</span>
      </div>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-paper mix-blend-difference"
        style={{ willChange: 'transform' }}
      />
    </>
  );
}
