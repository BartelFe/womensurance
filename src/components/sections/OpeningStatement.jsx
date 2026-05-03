import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import BackgroundField from '../canvas/BackgroundField';
import { splitChars } from '../../utils/splitText';

const LIFE_PHASES = [
  { age: '25', label: 'AUSBILDUNG',   pos: 4,  mobileLabel: false },
  { age: '28', label: 'ERSTER JOB',  pos: 18, mobileLabel: true  },
  { age: '32', label: 'BEZIEHUNG',   pos: 34, mobileLabel: false },
  { age: '35', label: 'KIND',        pos: 50, mobileLabel: true  },
  { age: '42', label: 'TEILZEIT',    pos: 65, mobileLabel: false },
  { age: '50', label: 'CARE-ARBEIT', pos: 80, mobileLabel: false },
  { age: '67', label: 'RENTE',       pos: 96, mobileLabel: true  },
];

const BOOKING_URL = 'https://outlook.office.com/book/Womensurance@dvm.de/?ismsaljsauthenabled';

export default function OpeningStatement() {
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const maleLineRef = useRef(null);
  const femaleLineRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    if (!headlineRef.current) return;

    const lines = headlineRef.current.querySelectorAll('[data-line]');
    lines.forEach((line) => splitChars(line));
    const allChars = headlineRef.current.querySelectorAll('.char');

    const maleLine = maleLineRef.current;
    const femaleLine = femaleLineRef.current;

    if (maleLine && femaleLine) {
      const mLen = maleLine.getTotalLength();
      const fLen = femaleLine.getTotalLength();
      gsap.set(maleLine, { strokeDasharray: mLen, strokeDashoffset: mLen });
      gsap.set(femaleLine, { strokeDasharray: fLen, strokeDashoffset: fLen });
    }

    // Grid columns — set initial hidden state
    const gridCols = gridRef.current?.querySelectorAll('[data-grid-col]');
    if (gridCols?.length) {
      gsap.set(gridCols, { scaleY: 0, transformOrigin: 'top', opacity: 0 });
    }

    const tl = gsap.timeline({ delay: 1.4 });

    tl.fromTo(
      allChars,
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.9, stagger: { each: 0.012, from: 'start' }, ease: 'power4.out' }
    );
    tl.fromTo(
      subRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      '-=0.4'
    );

    if (maleLine && femaleLine) {
      tl.addLabel('linesStart', '-=0.3');
      tl.to(maleLine, { strokeDashoffset: 0, duration: 2.2, ease: 'power1.inOut' }, 'linesStart');
      tl.to(femaleLine, { strokeDashoffset: 0, duration: 2.2, ease: 'power1.inOut' }, 'linesStart+=0.15');

      // Grid columns build left → right alongside the SVG lines
      if (gridCols?.length) {
        tl.to(
          gridCols,
          { scaleY: 1, opacity: 1, duration: 0.5, stagger: 0.12, ease: 'power2.out' },
          'linesStart'
        );
      }
    }

    return () => tl.kill();
  }, []);

  return (
    <section
      id="hero"
      className="relative h-[100svh] overflow-hidden bg-ink flex flex-col"
    >
      <BackgroundField />

      {/* Fixed-nav clearance */}
      <div className="h-28 md:h-24 shrink-0" />

      {/* ── Main content row: text left + chart right ── */}
      <div className="flex-1 relative z-10 flex flex-col md:flex-row md:items-center px-6 md:px-12 min-h-0">

        {/* Text column */}
        <div className="shrink-0 w-full md:w-[48%] text-center md:text-left">
          <h1
            ref={headlineRef}
            className="display-xl text-paper"
            style={{ fontSize: 'clamp(3rem, min(9vw, 12vh), 9.5rem)' }}
          >
            <span className="block line-mask"><span data-line>Über deine</span></span>
            <span className="block line-mask"><span data-line>Zukunft wird</span></span>
            <span className="block line-mask">
              <span data-line className="display-italic text-pink">im Stillen</span>
            </span>
            <span className="block line-mask"><span data-line>entschieden.</span></span>
          </h1>

          {/* Subtitle — desktop only */}
          <div
            ref={subRef}
            className="hidden md:block mt-8 max-w-md body-lead text-paper/60"
            style={{ fontSize: 'clamp(0.9rem, 1.1vw, 1.1rem)' }}
          >
            Eine Beratung, die nicht zuhört, ist eine Verkaufsfläche. Diese Seite fängt
            nicht mit einem Produkt an. Sie fängt mit einer Zahl an, die dich betrifft.
          </div>
        </div>

        {/* ── Chart column: life-phase grid + diverging curves ── */}
        <div className="flex-1 relative min-h-0 mt-2 md:mt-0 md:self-stretch">

          {/* Left fade — desktop only */}
          <div
            className="hidden md:block absolute inset-y-0 left-0 w-20 z-20 pointer-events-none"
            style={{ background: 'linear-gradient(to right, #0a0807, transparent)' }}
          />

          {/* Life-phase grid lines — both mobile and desktop */}
          <div ref={gridRef} className="absolute inset-0 z-[5]">
            {LIFE_PHASES.map(({ age, label, pos, mobileLabel }) => (
              <div
                key={age}
                data-grid-col
                className="absolute top-0 bottom-0 flex flex-col items-center"
                style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
              >
                <div className="pt-2 md:pt-[76px] flex flex-col items-center gap-[4px]">
                  <span
                    className="font-mono"
                    style={{ fontSize: '8px', letterSpacing: '0.2em', color: 'rgba(244,237,228,0.60)' }}
                  >
                    {age}
                  </span>
                  <span
                    className={`font-mono${mobileLabel ? '' : ' hidden md:block'}`}
                    style={{ fontSize: '7px', letterSpacing: '0.15em', color: 'rgba(244,237,228,0.38)', whiteSpace: 'nowrap' }}
                  >
                    {label}
                  </span>
                </div>
                <div
                  className="w-px mt-2"
                  style={{ flex: 1, background: 'rgba(244,237,228,0.15)' }}
                />
              </div>
            ))}
          </div>

          {/*
            SVG curves — shown on both mobile and desktop.

            Desktop: sits over the life-phase grid. Grid columns at pos% × 6 = SVG x.
            White line (Männer): rises from y=200 to y=141 — stays below label area.
            Pink  line (Frauen): falls from y=200 to y=384 — gap opens at KIND (x=300).
          */}
          <svg
            viewBox="0 0 600 400"
            className="absolute inset-0 w-full h-full z-[10]"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Male — gentle upward rise, stays well below label area */}
            <path
              ref={maleLineRef}
              d="M 0,200 C 60,197 130,190 204,177
                 C 265,167 285,163 300,160
                 C 350,154 420,150 480,146
                 C 530,143 570,142 600,141"
              fill="none"
              stroke="#f4ede4"
              strokeWidth="1"
              opacity="0.4"
            />
            {/* Female — clear downward fall */}
            <path
              ref={femaleLineRef}
              d="M 0,200 C 60,203 130,212 204,228
                 C 265,242 285,248 300,258
                 C 350,276 420,312 480,342
                 C 530,364 570,378 600,384"
              fill="none"
              stroke="#ff2e88"
              strokeWidth="1"
              opacity="0.8"
            />
          </svg>
        </div>
      </div>

      {/* ── Bottom bar: CTA always visible ── */}
      <div className="shrink-0 relative z-10 px-6 md:px-12 pb-10 pt-4 flex items-center justify-center md:justify-between">
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-2 eyebrow text-paper border border-paper/30 hover:border-pink hover:text-pink rounded-full px-5 py-3 transition-colors"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-pink animate-pulse" />
          Erstgespräch buchen
        </a>

      </div>
    </section>
  );
}
