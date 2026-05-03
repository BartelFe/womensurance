import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import BackgroundField from '../canvas/BackgroundField';
import { splitChars } from '../../utils/splitText';
import ScrollHint from '../ui/ScrollHint';

// Life phases mapped to percentage positions across the right chart area (0–100 %)
// SVG viewBox is 0 0 600 400 → multiply pos by 6 to get SVG x-coordinate
const LIFE_PHASES = [
  { age: '25', label: 'AUSBILDUNG',   pos: 4  },
  { age: '28', label: 'ERSTER JOB',  pos: 18 },
  { age: '32', label: 'BEZIEHUNG',   pos: 34 },
  { age: '35', label: 'KIND',        pos: 50 },
  { age: '42', label: 'TEILZEIT',    pos: 65 },
  { age: '50', label: 'CARE-ARBEIT', pos: 80 },
  { age: '67', label: 'RENTE',       pos: 96 },
];

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
      { yPercent: 0, opacity: 1, duration: 0.9, stagger: { each: 0.012, from: 'start' }, ease: 'power4.out' },
      '-=0.2'
    );
    tl.fromTo(
      subRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      '-=0.4'
    );

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

      {/* Row 1 */}
      <div className="relative z-10 px-6 md:px-12 pt-24">
        <div ref={eyebrowRef} className="eyebrow text-paper/40 flex items-center gap-3">
          <span className="h-px w-8 bg-paper/30" />
          <span>Eine Studie zur Lücke · Womensurance</span>
        </div>
      </div>

      {/* Row 2: text (left) + chart area (right) */}
      <div className="relative z-10 flex items-center px-6 md:px-12">

        {/* ── Left column: typography, unchanged ── */}
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
            Eine Beratung, die nicht zuhört, ist eine Verkaufsfläche. Diese Seite fängt
            nicht mit einem Produkt an. Sie fängt mit einer Zahl an, die dich betrifft.
          </div>
        </div>

        {/* ── Right column: life-phase grid + diverging curves ── */}
        <div className="hidden md:block flex-1 self-stretch relative pointer-events-none">

          {/* Left-edge fade — blends chart into the typography column */}
          <div
            className="absolute inset-y-0 left-0 w-20 z-20 pointer-events-none"
            style={{ background: 'linear-gradient(to right, #0a0807, transparent)' }}
          />

          {/* Life-phase vertical grid lines + labels — z-[5], behind curves */}
          <div className="absolute inset-0 z-[5]">
            {LIFE_PHASES.map(({ age, label, pos }) => (
              <div
                key={age}
                className="absolute top-0 bottom-0 flex flex-col items-center"
                style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
              >
                {/* Age + station label */}
                <div className="pt-[76px] flex flex-col items-center gap-[4px]">
                  <span
                    className="font-mono"
                    style={{ fontSize: '8px', letterSpacing: '0.2em', color: 'rgba(244,237,228,0.25)' }}
                  >
                    {age}
                  </span>
                  <span
                    className="font-mono"
                    style={{ fontSize: '7px', letterSpacing: '0.15em', color: 'rgba(244,237,228,0.12)', whiteSpace: 'nowrap' }}
                  >
                    {label}
                  </span>
                </div>
                {/* Vertical rule */}
                <div
                  className="w-px mt-2"
                  style={{ flex: 1, background: 'rgba(244,237,228,0.07)' }}
                />
              </div>
            ))}
          </div>

          {/*
            SVG curves — z-[10], on top of the grid.

            SVG x-coordinates match grid positions:
              pos %  ×  6  =  SVG x
              AUSBILDUNG  24  · ERSTER JOB 108 · BEZIEHUNG 204
              KIND       300  · TEILZEIT   390 · CARE      480  · RENTE 576

            Both lines start at y=200 (vertical centre).
            Male  rises  → pension keeps growing.
            Female drops → gap opens from KIND onward.
          */}
          <svg
            viewBox="0 0 600 400"
            className="absolute inset-0 w-full h-full z-[10]"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Male — diverges upward */}
            <path
              ref={maleLineRef}
              d="M 0,200 C 40,198 85,193 108,187
                 C 165,172 240,154 300,136
                 C 355,120 430,94 480,70
                 C 528,48 568,38 600,33"
              fill="none"
              stroke="#f4ede4"
              strokeWidth="1"
              opacity="0.4"
            />
            {/* Female — diverges downward */}
            <path
              ref={femaleLineRef}
              d="M 0,200 C 40,202 85,207 108,213
                 C 165,227 240,248 300,268
                 C 355,284 430,318 480,344
                 C 528,368 568,378 600,384"
              fill="none"
              stroke="#ff2e88"
              strokeWidth="1"
              opacity="0.8"
            />
          </svg>
        </div>
      </div>

      {/* Row 3 */}
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
