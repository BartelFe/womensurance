import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function Loader({ onComplete }) {
  const root = useRef(null);
  const counterRef = useRef(null);
  const thinRef = useRef(null);
  const heavyRef = useRef(null);
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

    if (thinRef.current && heavyRef.current) {
      // "Dicker werden": Lato ist statisch, deshalb Crossfade zwischen
      // zwei exakt überlagerten Schnitten (Light 300 → Black 900).
      tl.to(thinRef.current, { opacity: 0, duration: 2.4, ease: 'power2.inOut' }, '<');
      tl.to(heavyRef.current, { opacity: 1, duration: 2.4, ease: 'power2.inOut' }, '<');
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

      {/* Zwei überlagerte Schnitte für den Dünn→Dick-Effekt */}
      <div
        className="relative text-paper text-center px-4"
        style={{
          fontFamily: "'Lato', system-ui, sans-serif",
          fontSize: 'clamp(1.6rem, 5.5vw, 5.5rem)',
          letterSpacing: '-0.02em',
          lineHeight: 1.05,
          whiteSpace: 'nowrap',
        }}
      >
        <div ref={thinRef} style={{ fontWeight: 300 }}>
          Wie sicher bist du wirklich?
        </div>
        <div
          ref={heavyRef}
          className="absolute inset-0"
          style={{ fontWeight: 900, opacity: 0 }}
          aria-hidden="true"
        >
          Wie sicher bist du wirklich?
        </div>
      </div>

      <div className="mt-12 flex items-baseline gap-3 font-mono text-paper/60">
        <span className="text-xs uppercase tracking-[0.2em]">Gender Pension Gap</span>
        <span ref={counterRef} className="data-num text-paper text-3xl">0.0</span>
        <span className="text-paper/60">%</span>
      </div>
    </div>
  );
}
