import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gapStats, HERO_GAP_VALUE } from '../../data/gapStats';

gsap.registerPlugin(ScrollTrigger);

// HTML label positions derived from SVG viewBox 0 0 1200 540
const AXIS_LABELS = [
  { age: '25', left: '5%' },
  { age: '35', left: '28.75%' },
  { age: '45', left: '52.5%' },
  { age: '55', left: '76.25%' },
  { age: '67', left: '94.2%' },
];

export default function TheGap() {
  const root = useRef(null);
  const pinRef = useRef(null);
  const numRef = useRef(null);
  const labelRef = useRef(null);
  const introRef = useRef(null);
  const linesRef = useRef(null);
  const tickerRef = useRef(null);

  useEffect(() => {
    const root_ = root.current;
    const pin = pinRef.current;
    const num = numRef.current;
    const label = labelRef.current;
    const intro = introRef.current;
    const lines = linesRef.current;
    const ticker = tickerRef.current;
    if (!root_ || !pin || !num || !label || !intro || !lines || !ticker) return;

    const malePath = lines.querySelector('#male-line');
    const femalePath = lines.querySelector('#female-line');
    const dashedPath = lines.querySelector('#projection-line');

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
        end: '+=300%',
        scrub: 0.8,
        pin,
        anticipatePin: 1,
      },
    });

    // Intro text fades out first, then lines draw
    tl.to(intro, { opacity: 0, y: 40, duration: 0.5 }, 0);
    tl.to(malePath, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0.3);
    tl.to(femalePath, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0.5);
    tl.to(dashedPath, { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 1.0);

    const obj = { v: 0 };
    tl.to(
      obj,
      {
        v: HERO_GAP_VALUE,
        duration: 1.5,
        ease: 'none',
        onUpdate: () => { num.textContent = '−' + obj.v.toFixed(1); },
      },
      0.8
    );

    tl.fromTo(label, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, 1.6);
    tl.fromTo(
      ticker.querySelectorAll('[data-stat]'),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
      2.0
    );

    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  }, []);

  return (
    <section ref={root} id="gap" className="relative bg-ink text-paper">
      <div ref={pinRef} className="relative h-[100svh] overflow-hidden flex flex-col">

        {/* Chart area */}
        <div className="flex-1 relative min-h-0 overflow-hidden">

          {/* SVG — paths only, no text (text distorts with preserveAspectRatio="none") */}
          <svg
            ref={linesRef}
            viewBox="0 0 1200 540"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
          >
            <g opacity="0.08" stroke="#f4ede4" strokeWidth="1">
              {Array.from({ length: 5 }).map((_, i) => (
                <line key={i} x1={0} x2={1200} y1={(i + 1) * 108} y2={(i + 1) * 108} />
              ))}
              {Array.from({ length: 7 }).map((_, i) => (
                <line key={i} x1={(i + 1) * 150} x2={(i + 1) * 150} y1={0} y2={540} />
              ))}
            </g>

            <path
              id="male-line"
              d="M 60 440 C 250 415, 450 360, 700 270 S 1050 160, 1140 120"
              fill="none" stroke="#f4ede4" strokeWidth="2.2" opacity="0.6"
            />
            <path
              id="female-line"
              d="M 60 440 C 250 438, 420 430, 600 422 S 950 432, 1140 470"
              fill="none" stroke="#ff2e88" strokeWidth="2.5"
            />
            <path
              id="projection-line"
              d="M 1140 120 L 1140 470"
              fill="none" stroke="#ff2e88" strokeWidth="1.5"
              strokeDasharray="4 6" opacity="0.6"
            />
          </svg>

          {/* HTML line labels — undistorted */}
          <div className="absolute font-mono text-[11px] text-paper/60 pointer-events-none"
               style={{ left: '90.8%', top: '18%', transform: 'translateX(-50%)' }}>
            Männer
          </div>
          <div className="absolute font-mono text-[11px] text-pink pointer-events-none"
               style={{ left: '90.8%', top: '88%', transform: 'translateX(-50%)' }}>
            Frauen
          </div>

          {/* HTML axis labels — undistorted */}
          {AXIS_LABELS.map(({ age, left }) => (
            <div
              key={age}
              className="absolute bottom-2 font-mono text-[10px] text-paper/40 pointer-events-none"
              style={{ left, transform: 'translateX(-50%)' }}
            >
              {age}
            </div>
          ))}

          {/* Intro question — centered in chart, large and prominent */}
          <div
            ref={introRef}
            className="absolute inset-0 flex items-center justify-center px-6 md:px-16 z-20 pointer-events-none"
          >
            <h2
              className="display-xl text-paper text-balance text-center"
              style={{ fontSize: 'clamp(2.6rem, 6.5vw, 6rem)', lineHeight: 1.05 }}
            >
              Wenn zwei gleich starten,<br />
              warum endet sie{' '}
              <span className="display-italic text-pink">unten</span>?
            </h2>
          </div>
        </div>

        {/* Bottom data bar */}
        <div className="relative z-10 shrink-0 border-t border-paper/10 bg-ink/80 backdrop-blur-sm px-6 md:px-12 py-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="eyebrow text-paper/40 mb-2">Gender Pension Gap</div>
              <div
                ref={numRef}
                className="data-num text-pink leading-none"
                style={{ fontSize: 'clamp(4rem, 12vw, 12rem)' }}
              >
                −0.0
              </div>
              <div
                ref={labelRef}
                className="display-italic text-paper/80 mt-2 max-w-sm"
                style={{ fontSize: 'clamp(1rem, 1.5vw, 1.5rem)' }}
              >
                Prozent weniger Rente. Im Schnitt. In Deutschland. Heute.
              </div>
            </div>

            <div ref={tickerRef} className="flex flex-col gap-3 md:max-w-xs md:pb-1">
              {gapStats.slice(1).map((s) => (
                <div key={s.id} data-stat className="flex items-baseline gap-3 border-l-2 border-pink/60 pl-3">
                  <div className="data-num text-paper text-2xl md:text-3xl">{s.value}{s.unit}</div>
                  <div className="text-xs text-paper/50 leading-snug">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
