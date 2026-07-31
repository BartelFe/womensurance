import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { de1 } from '../../utils/format';

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
        if (counter) counter.textContent = de1(obj.v);
      },
    });

    if (lineRef.current) {
      // Lineares Dickerwerden wie mit der alten Variable Font:
      // Lato ist statisch, deshalb wächst eine Text-Kontur (text-stroke)
      // kontinuierlich von 0 auf ~0.035em — die Buchstaben legen
      // gleichmäßig an Gewicht zu, ohne Sprünge und ohne Reflow.
      const line = lineRef.current;
      const stroke = { v: 0 };
      tl.to(
        stroke,
        {
          v: 0.035,
          duration: 2.4,
          ease: 'none',
          onUpdate: () => {
            line.style.webkitTextStroke = `${stroke.v.toFixed(4)}em var(--color-paper)`;
          },
        },
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
      // Intro-Animation ohne Informationswert — für assistive Technologien
      // reicht der Ladehinweis; alles darunter wird übersprungen.
      role="status"
      aria-label="Die Seite wird geladen"
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-ink overflow-hidden"
    >
      <div aria-hidden="true" className="eyebrow text-paper/55 mb-8">Womensurance · Lade Wahrheit</div>

      {/* Dünn→Dick: Lato Light + linear wachsende Text-Kontur */}
      <div
        ref={lineRef}
        aria-hidden="true"
        className="text-paper text-center px-4"
        style={{
          fontFamily: "'Lato', system-ui, sans-serif",
          fontWeight: 300,
          fontSize: 'clamp(1.6rem, 5.5vw, 5.5rem)',
          letterSpacing: '-0.015em',
          lineHeight: 1.05,
          whiteSpace: 'nowrap',
        }}
      >
        Wie sicher bist du wirklich?
      </div>

      <div aria-hidden="true" className="mt-12 flex items-baseline gap-3 text-paper/60">
        <span className="text-xs uppercase tracking-[0.2em]">Gender Pension Gap</span>
        <span ref={counterRef} className="data-num text-paper text-3xl">0.0</span>
        <span className="text-paper/60">%</span>
      </div>
    </div>
  );
}
