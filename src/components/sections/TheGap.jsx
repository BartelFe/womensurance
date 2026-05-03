import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gapStats, HERO_GAP_VALUE } from '../../data/gapStats';

gsap.registerPlugin(ScrollTrigger);

export default function TheGap() {
  const root = useRef(null);
  const pinRef = useRef(null);
  const numRef = useRef(null);
  const labelRef = useRef(null);
  const introMobileRef = useRef(null);
  const introDesktopRef = useRef(null);
  const linesRef = useRef(null);
  const tickerRef = useRef(null);

  useEffect(() => {
    const root_ = root.current;
    const pin = pinRef.current;
    const num = numRef.current;
    const label = labelRef.current;
    const lines = linesRef.current;
    const ticker = tickerRef.current;
    if (!root_ || !pin || !num || !label || !lines || !ticker) return;

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

    // Fade out intro question(s) — both mobile and desktop elements, whichever is visible
    const introEls = [introMobileRef.current, introDesktopRef.current].filter(Boolean);
    if (introEls.length) {
      tl.to(introEls, { opacity: 0, y: 30, duration: 0.5 }, 0);
    }

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

        {/* SVG chart — occupies upper portion */}
        <div className="flex-1 relative min-h-0">
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

            <text x="1090" y="108" fill="#f4ede4" fontSize="13" fontFamily="JetBrains Mono" opacity="0.6">Männer</text>
            <text x="1090" y="490" fill="#ff2e88" fontSize="13" fontFamily="JetBrains Mono">Frauen</text>

            <text x="60" y="530" fill="#f4ede4" fontSize="11" fontFamily="JetBrains Mono" opacity="0.4">25</text>
            <text x="345" y="530" fill="#f4ede4" fontSize="11" fontFamily="JetBrains Mono" opacity="0.4">35</text>
            <text x="630" y="530" fill="#f4ede4" fontSize="11" fontFamily="JetBrains Mono" opacity="0.4">45</text>
            <text x="915" y="530" fill="#f4ede4" fontSize="11" fontFamily="JetBrains Mono" opacity="0.4">55</text>
            <text x="1130" y="530" fill="#f4ede4" fontSize="11" fontFamily="JetBrains Mono" opacity="0.4">67</text>
          </svg>
        </div>

        {/* Bottom data bar */}
        <div className="relative z-10 shrink-0 border-t border-paper/10 bg-ink/80 backdrop-blur-sm px-6 md:px-12 py-6">

          {/* Mobile: intro question sits above the number, centered */}
          <div
            ref={introMobileRef}
            className="md:hidden text-center mb-5 pointer-events-none"
          >
            <div className="eyebrow text-paper/40 mb-2">Akt 01 · Die Lücke</div>
            <h2
              className="display-xl text-paper text-balance"
              style={{ fontSize: 'clamp(1.4rem, 4.5vw, 2.2rem)', lineHeight: 1.15 }}
            >
              Wenn zwei gleich starten,<br />
              warum endet sie <span className="display-italic text-pink">unten</span>?
            </h2>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            {/* Number + desktop intro question side by side */}
            <div className="flex flex-col md:flex-row md:items-end md:gap-10">
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

              {/* Desktop: intro question at same height as number */}
              <div
                ref={introDesktopRef}
                className="hidden md:block pointer-events-none mb-3"
              >
                <div className="eyebrow text-paper/40 mb-3">Akt 01 · Die Lücke</div>
                <h2
                  className="display-xl text-paper text-balance max-w-lg"
                  style={{ fontSize: 'clamp(1.8rem, 2.8vw, 3.2rem)', lineHeight: 1.1 }}
                >
                  Wenn zwei gleich starten,<br />
                  warum endet sie <span className="display-italic text-pink">unten</span>?
                </h2>
              </div>
            </div>

            {/* Stats ticker */}
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
