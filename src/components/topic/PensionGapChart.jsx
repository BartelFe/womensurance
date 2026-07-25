import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BASE_GAP, BASE_EURO } from '../../hooks/useGapState';

gsap.registerPlugin(ScrollTrigger);

// Scroll-Scrub-Chart (v1 "Die Lücke") — hier rein auf die Rentenlücke bezogen:
// zwei Erwerbsleben starten gleich, die Kurven ziehen sich beim Scrollen auf,
// der Zähler läuft auf −450 €/Monat.

const AXIS_LABELS = [
  { age: '25', left: '5%' },
  { age: '35', left: '28.75%' },
  { age: '45', left: '52.5%' },
  { age: '55', left: '76.25%' },
  { age: '67', left: '94.2%' },
];

export default function PensionGapChart() {
  const root = useRef(null);
  const pinRef = useRef(null);
  const numRef = useRef(null);
  const labelRef = useRef(null);
  const introRef = useRef(null);
  const linesRef = useRef(null);

  useEffect(() => {
    const root_ = root.current;
    const pin = pinRef.current;
    const num = numRef.current;
    const label = labelRef.current;
    const intro = introRef.current;
    const lines = linesRef.current;
    if (!root_ || !pin || !num || !label || !intro || !lines) return;

    const malePath = lines.querySelector('#rl-male-line');
    const femalePath = lines.querySelector('#rl-female-line');
    const dashedPath = lines.querySelector('#rl-projection-line');

    [malePath, femalePath, dashedPath].forEach((p) => {
      if (!p) return;
      const len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root_,
        start: 'top top',
        end: '+=250%',
        scrub: 0.8,
        pin,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    tl.fromTo(intro, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.2 }, 0);
    tl.to(intro, { opacity: 0, y: -30, duration: 0.4 }, 0.7);
    tl.to(malePath, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0.9);
    tl.to(femalePath, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 1.1);
    tl.to(dashedPath, { strokeDashoffset: 0, duration: 0.6, ease: 'none' }, 1.7);

    const obj = { v: 0 };
    tl.to(
      obj,
      {
        v: BASE_EURO,
        duration: 1.3,
        ease: 'none',
        onUpdate: () => {
          num.textContent = '−' + Math.round(obj.v);
        },
      },
      1.4
    );

    tl.fromTo(label, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4 }, 2.3);
    tl.to({}, { duration: 0.4 });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section ref={root} className="relative bg-ink text-paper border-t border-paper/10">
      <div ref={pinRef} className="relative h-[100svh] overflow-hidden flex flex-col">

        {/* Chart area */}
        <div className="flex-1 relative min-h-0 overflow-hidden">
          <svg
            ref={linesRef}
            viewBox="0 0 1200 540"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
          >
            <g opacity="0.08" stroke="var(--color-paper)" strokeWidth="1">
              {Array.from({ length: 5 }).map((_, i) => (
                <line key={i} x1={0} x2={1200} y1={(i + 1) * 108} y2={(i + 1) * 108} />
              ))}
              {Array.from({ length: 7 }).map((_, i) => (
                <line key={i} x1={(i + 1) * 150} x2={(i + 1) * 150} y1={0} y2={540} />
              ))}
            </g>

            <path
              id="rl-male-line"
              d="M 60 440 C 250 415, 450 360, 700 270 S 1050 160, 1140 120"
              fill="none" stroke="var(--color-paper)" strokeWidth="2.2" opacity="0.6"
            />
            <path
              id="rl-female-line"
              d="M 60 440 C 250 438, 420 430, 600 422 S 950 432, 1140 470"
              fill="none" stroke="var(--color-pink)" strokeWidth="2.5"
            />
            <path
              id="rl-projection-line"
              d="M 1140 120 L 1140 470"
              fill="none" stroke="var(--color-pink)" strokeWidth="1.5"
              strokeDasharray="4 6" opacity="0.6"
            />
          </svg>

          {/* Linien-Labels (HTML, unverzerrt) */}
          <div className="absolute font-mono text-[11px] text-paper/60 pointer-events-none"
               style={{ left: '90.8%', top: '18%', transform: 'translateX(-50%)' }}>
            Männer
          </div>
          <div className="absolute font-mono text-[11px] text-pink pointer-events-none"
               style={{ left: '90.8%', top: '88%', transform: 'translateX(-50%)' }}>
            Frauen
          </div>

          {/* Achsen-Labels */}
          {AXIS_LABELS.map(({ age, left }) => (
            <div
              key={age}
              className="absolute bottom-2 font-mono text-[10px] text-paper/40 pointer-events-none"
              style={{ left, transform: 'translateX(-50%)' }}
            >
              {age}
            </div>
          ))}

          {/* Intro-Frage */}
          <div
            ref={introRef}
            className="absolute inset-0 flex items-center justify-center px-6 md:px-16 z-20 pointer-events-none"
          >
            <h2
              className="display-xl text-paper text-balance text-center"
              style={{ fontSize: 'clamp(2.2rem, 6vw, 5.5rem)', lineHeight: 1.05 }}
            >
              Zwei starten gleich.<br />
              Eine geht in <span className="display-italic text-pink">Teilzeit</span>.
            </h2>
          </div>
        </div>

        {/* Bottom data bar */}
        <div className="relative z-10 shrink-0 border-t border-paper/10 bg-ink/80 backdrop-blur-sm px-6 md:px-12 py-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="eyebrow text-paper/40 mb-2">Die Rentenlücke</div>
              <div className="flex items-baseline gap-2">
                <div
                  ref={numRef}
                  className="data-num text-pink leading-none"
                  style={{ fontSize: 'clamp(3.4rem, 10vw, 9rem)' }}
                >
                  −0
                </div>
                <div className="data-num text-pink" style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)' }}>€</div>
              </div>
              <div
                ref={labelRef}
                className="display-italic text-paper/80 mt-2 max-w-md"
                style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.5rem)' }}
              >
                Jeden Monat. Im Schnitt. Das sind {BASE_GAP.toFixed(1).replace('.', ',')} % weniger Rente.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
