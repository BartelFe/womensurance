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

    // Gesamt-Anzeigedauer 3.0s (2.0s Original +50 %):
    // Counter & Headline-Animation füllen 2.4s, danach 0.6s Halten.
    const counter = counterRef.current;
    const obj = { v: 0 };
    tl.to(obj, {
      v: 39.4,
      duration: 2.4,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (counter) counter.textContent = obj.v.toFixed(1);
      },
    });

    if (lineRef.current) {
      // Lato ist statisch (kein Variable-Font-Tween) — stattdessen
      // "Scharfstellen": Opazität + Scale + Letter-Spacing ziehen sich zu.
      tl.fromTo(
        lineRef.current,
        { opacity: 0.12, scale: 0.94, letterSpacing: '0.04em' },
        { opacity: 1, scale: 1, letterSpacing: '-0.03em', duration: 2.4, ease: 'power2.inOut' },
        '<'
      );
    }

    tl.to({}, { duration: 0.6 });
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

      <div
        ref={lineRef}
        className="display-xl text-paper text-center text-balance px-6"
        style={{ fontSize: 'clamp(2.2rem, 5.5vw, 5.5rem)' }}
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
