import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Scroll-Erklärgrafik: Versorgungsausgleich als zwei Rentenkonten.
// Beim Scrollen wandern 4 der 14 Punkte hälftig rüber (14/6 → 10/10);
// danach fährt die Raute als Klammer zwischen die Konten und zeigt,
// was im Versorgungsausgleich überhaupt alles geteilt wird.
// (Umbau 07/2026: das frühere "geteilt wird nur, was auf dem Tisch liegt"
// unterstellte Verheimlichung — nicht plausibel, deshalb raus.)
// ⚠️ Punktzahlen = illustrative Beispielwerte, mit Julia validieren.

const HIS_START = 14;
const HER_START = 6;
const TRANSFER = 4;

// Was der Versorgungsausgleich erfasst
const SHARED = [
  'Gesetzliche Rente',
  'Betriebsrente',
  'Private Rentenversicherung',
  'Riester & Rürup',
  'Beamtenversorgung',
  'Versorgungswerke',
];

// Punkt-Positionen in % des Canvas (links = ihr Konto, rechts = seins)
// y-Werte enden bei 74 %, damit die Punkte nicht in die Zähler am
// Kartenfuß laufen.
const HER_DOTS = [
  { x: 8, y: 20 }, { x: 16, y: 20 }, { x: 24, y: 20 },
  { x: 8, y: 38 }, { x: 16, y: 38 }, { x: 24, y: 38 },
];
const HER_EMPTY = [
  { x: 8, y: 56 }, { x: 16, y: 56 }, { x: 24, y: 56 }, { x: 32, y: 56 },
];
const HIS_DOTS = [
  { x: 68, y: 20 }, { x: 76, y: 20 }, { x: 84, y: 20 }, { x: 92, y: 20 },
  { x: 68, y: 38 }, { x: 76, y: 38 }, { x: 84, y: 38 }, { x: 92, y: 38 },
  { x: 68, y: 56 }, { x: 76, y: 56 },
  // die letzten 4 wandern rüber:
  { x: 84, y: 56 }, { x: 92, y: 56 }, { x: 84, y: 74 }, { x: 92, y: 74 },
];

export default function SplitAccounts() {
  const root = useRef(null);
  const pinRef = useRef(null);
  const herCountRef = useRef(null);
  const hisCountRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const intro = root.current.querySelector('[data-sa-intro]');
      const stage = root.current.querySelector('[data-sa-stage]');
      const movers = root.current.querySelectorAll('[data-sa-mover]');
      const hub = root.current.querySelector('[data-sa-hub]');
      const hubMark = root.current.querySelector('[data-sa-hub-mark]');
      const listLabel = root.current.querySelector('[data-sa-list-label]');
      const chips = root.current.querySelectorAll('[data-sa-chip]');
      const outro = root.current.querySelector('[data-sa-outro]');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=230%',
          scrub: 0.7,
          pin: pinRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(intro, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.25 }, 0);
      tl.fromTo(stage, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5 }, 0.2);

      // 4 Punkte wandern hälftig rüber, Zähler ticken synchron
      movers.forEach((dot, i) => {
        const target = HER_EMPTY[i];
        tl.to(
          dot,
          {
            left: `${target.x}%`,
            top: `${target.y}%`,
            backgroundColor: 'var(--color-pink)',
            duration: 0.5,
            ease: 'power2.inOut',
          },
          1.0 + i * 0.35
        );
      });
      const counts = { her: HER_START, his: HIS_START };
      tl.to(
        counts,
        {
          her: HER_START + TRANSFER,
          his: HIS_START - TRANSFER,
          duration: 0.35 * TRANSFER + 0.5,
          ease: 'none',
          onUpdate: () => {
            if (herCountRef.current) herCountRef.current.textContent = Math.round(counts.her);
            if (hisCountRef.current) hisCountRef.current.textContent = Math.round(counts.his);
          },
        },
        1.0
      );

      // Die Raute fährt als Klammer in die Mitte zwischen beide Konten …
      tl.to(hub, { top: '42%', duration: 0.55, ease: 'power2.out' }, 2.7);
      tl.fromTo(
        hubMark,
        { opacity: 0, scale: 0.3, rotate: 0 },
        { opacity: 1, scale: 1, rotate: 45, duration: 0.55, ease: 'power2.out' },
        2.7
      );

      // … und darunter steht, was dort überhaupt alles landet
      tl.fromTo(listLabel, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 }, 3.15);
      tl.fromTo(
        chips,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.08 },
        3.3
      );

      tl.fromTo(outro, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4 }, 4.0);
      tl.to({}, { duration: 0.5 });
    }, root);

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className="relative bg-ink text-paper border-t border-paper/10">
      <div ref={pinRef} className="relative h-[100svh] overflow-hidden flex flex-col justify-center px-6 md:px-12 py-8">
        <div className="max-w-6xl mx-auto w-full">

          {/* Intro */}
          <div data-sa-intro className="text-center mb-5 md:mb-8">
            <div className="eyebrow text-paper/40 mb-3">So funktioniert der Versorgungsausgleich</div>
            <h2 className="display-lg text-paper text-balance" style={{ fontSize: 'clamp(1.7rem, 3.6vw, 3.4rem)' }}>
              Alles aus der Ehezeit wird{' '}
              <span className="display-italic text-pink">hälftig</span> geteilt.
            </h2>
          </div>

          {/* Bühne: zwei Konten + wandernde Punkte */}
          <div data-sa-stage className="relative">
            <div className="relative w-full" style={{ height: 'min(34vh, 300px)' }}>

              {/* Konto-Karten */}
              <div className="absolute left-0 top-0 bottom-0 w-[42%] md:w-[38%] bg-bone/[0.06] border border-paper/15 rounded-md" />
              <div className="absolute right-0 top-0 bottom-0 w-[42%] md:w-[38%] bg-bone/[0.06] border border-paper/15 rounded-md" />

              {/* Karten-Köpfe */}
              <div className="absolute left-0 top-3 w-[42%] md:w-[38%] text-center">
                <div className="eyebrow text-pink">Dein Rentenkonto</div>
              </div>
              <div className="absolute right-0 top-3 w-[42%] md:w-[38%] text-center">
                <div className="eyebrow text-paper/50">Sein Rentenkonto</div>
              </div>

              {/* Ihre Punkte */}
              {HER_DOTS.map((p, i) => (
                <div
                  key={`her-${i}`}
                  className="absolute h-2.5 w-2.5 md:h-3.5 md:w-3.5 rounded-full bg-pink -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                />
              ))}

              {/* Seine Punkte (die letzten 4 wandern) */}
              {HIS_DOTS.map((p, i) => {
                const isMover = i >= HIS_DOTS.length - TRANSFER;
                return (
                  <div
                    key={`his-${i}`}
                    data-sa-mover={isMover ? '' : undefined}
                    className="absolute h-2.5 w-2.5 md:h-3.5 md:w-3.5 rounded-full -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${p.x}%`,
                      top: `${p.y}%`,
                      backgroundColor: 'rgb(var(--paper-rgb) / 0.55)',
                    }}
                  />
                );
              })}

              {/* Die Raute: das Verfahren, das zwischen beiden Konten steht.
                  Eigener Positions-Wrapper — GSAP animiert left/top hier,
                  scale/rotate am inneren Element. */}
              <div
                data-sa-hub
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ left: '50%', top: '108%' }}
              >
                <div
                  data-sa-hub-mark
                  className="h-6 w-6 md:h-8 md:w-8 border-2 border-pink"
                  style={{ background: 'rgb(var(--pink-rgb) / 0.15)' }}
                />
              </div>

              {/* Zähler in den Karten */}
              <div className="absolute left-0 bottom-4 w-[42%] md:w-[38%] text-center">
                <span ref={herCountRef} className="data-num text-pink" style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)' }}>
                  {HER_START}
                </span>
                <span className="text-base md:text-xl font-bold text-paper/55 ml-2">Punkte</span>
              </div>
              <div className="absolute right-0 bottom-4 w-[42%] md:w-[38%] text-center">
                <span ref={hisCountRef} className="data-num text-paper/80" style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)' }}>
                  {HIS_START}
                </span>
                <span className="text-base md:text-xl font-bold text-paper/55 ml-2">Punkte</span>
              </div>
            </div>
          </div>

          {/* Was im Versorgungsausgleich landet */}
          <div className="mt-5 md:mt-7 text-center">
            <div data-sa-list-label className="eyebrow text-paper/40 mb-3">
              Geteilt wird alles davon
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {SHARED.map((s) => (
                <span
                  key={s}
                  data-sa-chip
                  className="rounded-full border border-paper/20 px-3 py-1.5 text-[11px] md:text-xs text-paper/70"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Outro */}
          <div data-sa-outro className="text-center mt-5 md:mt-8">
            <p className="display-lg text-paper text-balance mx-auto max-w-3xl" style={{ fontSize: 'clamp(1.3rem, 2.6vw, 2.4rem)' }}>
              Hälftig klingt fair.{' '}
              <span className="display-italic text-pink">Aber was jetzt?</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
