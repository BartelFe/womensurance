import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import BackgroundField from '../canvas/BackgroundField';
import { splitChars } from '../../utils/splitText';
import ScrollHint from '../ui/ScrollHint';

export default function OpeningStatement() {
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const eyebrowRef = useRef(null);
  const maleLineRef = useRef(null);
  const femaleLineRef = useRef(null);

  useEffect(() => {
    if (!headlineRef.current) return;

    const lines = headlineRef.current.querySelectorAll('[data-line]');
    lines.forEach((line) => splitChars(line));
    const allChars = headlineRef.current.querySelectorAll('.char');

    const maleLine = maleLineRef.current;
    const femaleLine = femaleLineRef.current;

    // Prime the draw animation (set dashoffset = full length = invisible)
    if (maleLine && femaleLine) {
      const mLen = maleLine.getTotalLength();
      const fLen = femaleLine.getTotalLength();
      gsap.set(maleLine, { strokeDasharray: mLen, strokeDashoffset: mLen });
      gsap.set(femaleLine, { strokeDasharray: fLen, strokeDashoffset: fLen });
    }

    const tl = gsap.timeline({ delay: 1.4 });

    tl.fromTo(
      eyebrowRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );

    tl.fromTo(
      allChars,
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0, opacity: 1, duration: 0.9,
        stagger: { each: 0.012, from: 'start' },
        ease: 'power4.out',
      },
      '-=0.2'
    );

    tl.fromTo(
      subRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      '-=0.4'
    );

    // Draw the diverging lines after headline finishes
    if (maleLine && femaleLine) {
      tl.to(maleLine, { strokeDashoffset: 0, duration: 2.2, ease: 'power1.inOut' }, '-=0.3');
      tl.to(femaleLine, { strokeDashoffset: 0, duration: 2.2, ease: 'power1.inOut' }, '<0.15');
    }

    return () => tl.kill();
  }, []);

  return (
    <section
      id="hero"
      className="relative h-[100svh] overflow-hidden bg-ink"
      style={{ display: 'grid', gridTemplateRows: 'auto 1fr auto' }}
    >
      <BackgroundField />

      {/* Row 1: Top eyebrow */}
      <div className="relative z-10 px-6 md:px-12 pt-24">
        <div ref={eyebrowRef} className="eyebrow text-paper/40 flex items-center gap-3">
          <span className="h-px w-8 bg-paper/30" />
          <span>Eine Studie zur Lücke · Womensurance</span>
        </div>
      </div>

      {/* Row 2: Headline (left) + abstract lines (right) */}
      <div className="relative z-10 flex items-center px-6 md:px-12 gap-0">
        {/* Left: text content */}
        <div className="w-full md:w-[55%] shrink-0">
          <h1
            ref={headlineRef}
            className="display-xl text-paper"
            style={{ fontSize: 'clamp(2.2rem, min(9vw, 12vh), 9.5rem)' }}
          >
            <span className="block line-mask"><span data-line>Über deine</span></span>
            <span className="block line-mask"><span data-line>Zukunft wird</span></span>
            <span className="block line-mask">
              <span data-line className="display-italic text-pink">im Stillen</span>
            </span>
            <span className="block line-mask"><span data-line>entschieden.</span></span>
          </h1>

          <div
            ref={subRef}
            className="mt-8 max-w-md body-lead text-paper/60"
            style={{ fontSize: 'clamp(0.9rem, 1.1vw, 1.1rem)' }}
          >
            Eine Beratung, die nicht zuhört, ist eine Verkaufsfläche. Diese Seite fängt nicht mit einem Produkt an. Sie fängt mit einer Zahl an, die dich betrifft.
          </div>
        </div>

        {/* Right: abstract diverging lines — desktop only */}
        <div className="hidden md:block flex-1 self-stretch relative pointer-events-none">
          <svg
            viewBox="0 0 600 400"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              {/* Fade mask: transparent → opaque → transparent, left to right */}
              <linearGradient id="heroLineFade" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="white" stopOpacity="0" />
                <stop offset="14%"  stopColor="white" stopOpacity="1" />
                <stop offset="80%"  stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <mask id="heroLineMask">
                <rect width="600" height="400" fill="url(#heroLineFade)" />
              </mask>
            </defs>

            <g mask="url(#heroLineMask)">
              {/* White line — diverges upward */}
              <path
                ref={maleLineRef}
                d="M 0 198 C 80 196, 200 178, 340 148 S 510 80, 600 48"
                fill="none"
                stroke="#f4ede4"
                strokeWidth="0.85"
                opacity="0.45"
              />
              {/* Pink line — diverges downward */}
              <path
                ref={femaleLineRef}
                d="M 0 202 C 80 204, 200 222, 340 256 S 510 328, 600 358"
                fill="none"
                stroke="#ff2e88"
                strokeWidth="0.85"
                opacity="0.75"
              />
            </g>
          </svg>
        </div>
      </div>

      {/* Row 3: Bottom bar */}
      <div className="relative z-10 px-6 md:px-12 pb-10 flex items-end justify-between">
        <ScrollHint label="Beginnen" />
        <div className="hidden md:flex flex-col items-end gap-3 text-right">
          <div className="eyebrow text-paper/40">Issue 01 · 2026</div>
          <div className="font-mono text-xs text-paper/30 leading-relaxed">
            Lesedauer ≈ 4 min<br />
            Durchscrollen → die Zahl wächst.
          </div>
        </div>
      </div>
    </section>
  );
}
