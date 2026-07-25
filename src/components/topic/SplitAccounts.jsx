import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Scroll-Erklärgrafik: Versorgungsausgleich als zwei Rentenkonten.
// Beim Scrollen wandern 4 der 14 Punkte hälftig rüber (14/6 → 10/10) —
// und ein Betriebsrenten-Token bleibt auf halbem Weg hängen:
// "Geteilt wird nur, was auf dem Tisch liegt."
// ⚠️ Punktzahlen/€ = illustrative Beispielwerte, mit Julia validieren.

const HIS_START = 14;
const HER_START = 6;
const TRANSFER = 4;

// Punkt-Positionen in % des Canvas (links = ihr Konto, rechts = seins)
const HER_DOTS = [
  { x: 8, y: 22 }, { x: 16, y: 22 }, { x: 24, y: 22 },
  { x: 8, y: 42 }, { x: 16, y: 42 }, { x: 24, y: 42 },
];
const HER_EMPTY = [
  { x: 8, y: 62 }, { x: 16, y: 62 }, { x: 24, y: 62 }, { x: 32, y: 62 },
];
const HIS_DOTS = [
  { x: 68, y: 22 }, { x: 76, y: 22 }, { x: 84, y: 22 }, { x: 92, y: 22 },
  { x: 68, y: 42 }, { x: 76, y: 42 }, { x: 84, y: 42 }, { x: 92, y: 42 },
  { x: 68, y: 62 }, { x: 76, y: 62 },
  // die letzten 4 wandern rüber:
  { x: 84, y: 62 }, { x: 92, y: 62 }, { x: 84, y: 82 }, { x: 92, y: 82 },
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
      const stuck = root.current.querySelector('[data-sa-stuck]');
      const stuckLabel = root.current.querySelector('[data-sa-stuck-label]');
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

      // Der Betriebsrenten-Token bleibt auf halbem Weg hängen
      tl.to(stuck, { left: '47%', top: '82%', duration: 0.45, ease: 'power2.in' }, 2.7);
      tl.to(stuck, { x: 4, duration: 0.05, repeat: 5, yoyo: true, ease: 'none' }, 3.15);
      tl.to(stuck, { borderColor: 'var(--color-pink)', color: 'var(--color-pink)', duration: 0.2 }, 3.15);
      tl.fromTo(stuckLabel, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 }, 3.4);

      tl.fromTo(outro, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4 }, 3.9);
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
      <div ref={pinRef} className="relative h-[100svh] overflow-hidden flex flex-col justify-center px-6 md:px-12 py-10">
        <div className="max-w-6xl mx-auto w-full">

          {/* Intro */}
          <div data-sa-intro className="text-center mb-6 md:mb-10">
            <div className="eyebrow text-paper/40 mb-3">So funktioniert der Versorgungsausgleich</div>
            <h2 className="display-lg text-paper text-balance" style={{ fontSize: 'clamp(1.7rem, 3.6vw, 3.4rem)' }}>
              Alles aus der Ehezeit wird{' '}
              <span className="display-italic text-pink">hälftig</span> geteilt.
            </h2>
          </div>

          {/* Bühne: zwei Konten + wandernde Punkte */}
          <div data-sa-stage className="relative">
            <div className="relative w-full" style={{ height: 'min(44vh, 380px)' }}>

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

              {/* Der hängende Betriebsrenten-Token */}
              <div
                data-sa-stuck
                className="absolute -translate-x-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 rotate-45 border-2 border-paper/50 text-paper/50"
                style={{ left: '92%', top: '92%', background: 'rgb(var(--paper-rgb) / 0.08)' }}
              />
              <div
                data-sa-stuck-label
                className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none"
                style={{ top: '88%', width: 'min(70vw, 340px)' }}
              >
                <div className="font-mono text-[10px] md:text-[11px] text-pink leading-relaxed mt-6">
                  Seine Betriebsrente — nie gemeldet, nie geteilt.
                  <br />
                  Dein Verlust: für immer.
                </div>
              </div>

              {/* Zähler in den Karten */}
              <div className="absolute left-0 bottom-4 w-[42%] md:w-[38%] text-center">
                <span ref={herCountRef} className="data-num text-pink" style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)' }}>
                  {HER_START}
                </span>
                <span className="font-mono text-[10px] text-paper/40 ml-2">Punkte</span>
              </div>
              <div className="absolute right-0 bottom-4 w-[42%] md:w-[38%] text-center">
                <span ref={hisCountRef} className="data-num text-paper/80" style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)' }}>
                  {HIS_START}
                </span>
                <span className="font-mono text-[10px] text-paper/40 ml-2">Punkte</span>
              </div>
            </div>
          </div>

          {/* Outro */}
          <div data-sa-outro className="text-center mt-8 md:mt-12">
            <p className="display-lg text-paper text-balance mx-auto max-w-3xl" style={{ fontSize: 'clamp(1.3rem, 2.6vw, 2.4rem)' }}>
              Hälftig klingt fair. Geteilt wird aber nur,{' '}
              <span className="display-italic text-pink">was auf dem Tisch liegt.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
