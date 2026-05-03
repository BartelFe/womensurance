import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function Loader({ onComplete }) {
  const root = useRef(null);
  const counterRef = useRef(null);
  const lineRef = useRef(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setDone(true);
        onComplete?.();
      },
    });

    const counter = counterRef.current;
    const obj = { v: 0 };
    tl.to(obj, {
      v: 39.4,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (counter) counter.textContent = obj.v.toFixed(1);
      },
    });

    if (lineRef.current) {
      tl.fromTo(
        lineRef.current,
        { fontVariationSettings: '"opsz" 96, "wght" 200, "SOFT" 100' },
        { fontVariationSettings: '"opsz" 144, "wght" 700, "SOFT" 0', duration: 1.6, ease: 'power2.inOut' },
        '<'
      );
    }

    tl.to({}, { duration: 0.4 });
    tl.to(root.current, { y: '-100%', duration: 1.0, ease: 'expo.inOut' });

    return () => tl.kill();
  }, [onComplete]);

  if (done) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-ink overflow-hidden"
    >
      <div className="eyebrow text-paper/40 mb-8">Womensurance · Lade Wahrheit</div>

      {/*
        white-space: nowrap prevents line-break reflow as font weight increases.
        The height stays stable (determined by font-size, not text width).
      */}
      <div
        ref={lineRef}
        className="display-xl text-paper text-center"
        style={{
          fontSize: 'clamp(2.2rem, 5.5vw, 5.5rem)',
          fontVariationSettings: '"opsz" 96, "wght" 200, "SOFT" 100',
          whiteSpace: 'nowrap',
        }}
      >
        Wie sicher bist du wirklich?
      </div>

      <div className="mt-12 flex items-baseline gap-3 font-mono text-paper/60">
        <span className="text-xs uppercase tracking-[0.2em]">Gender Pension Gap</span>
        <span ref={counterRef} className="data-num text-paper text-3xl">0.0</span>
        <span className="text-paper/60">%</span>
      </div>
    </div>
  );
}
