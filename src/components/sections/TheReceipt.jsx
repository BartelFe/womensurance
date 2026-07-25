import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGap, RETIREMENT_YEARS } from '../../hooks/useGapState';
import { BOOKING_URL } from '../../config/site';

gsap.registerPlugin(ScrollTrigger);

const fmt = (n) => Math.round(n).toLocaleString('de-DE');

/**
 * "Der Kassenzettel" — übersetzt die Hero-Interaktion in Euro.
 * Gepinnte Scroll-Sequenz: Posten stempeln sich nacheinander ein,
 * Monatssumme zählt hoch, dann die Lebenssumme + VERMEIDBAR-Stempel.
 * ⚠️ Beispielrechnung mit Platzhalter-Werten — mit Julia validieren.
 */
export default function TheReceipt() {
  const root = useRef(null);
  const pinRef = useRef(null);
  const monthlyRef = useRef(null);
  const lifetimeRef = useRef(null);

  const { euroGap, baseEuro, activeMeta, gap } = useGap();
  const lifetime = euroGap * 12 * RETIREMENT_YEARS;

  const items = [
    {
      id: 'base',
      label: 'Gender Pension Gap · Basis',
      sub: 'Ø Rente Frau vs. Mann, Deutschland',
      euro: baseEuro,
    },
    ...activeMeta.map((m) => ({
      id: m.id,
      label: m.receiptLabel,
      sub: m.receiptSub,
      euro: m.euro,
    })),
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const intro = root.current.querySelector('[data-receipt-intro]');
      const card = root.current.querySelector('[data-receipt-card]');
      const rows = root.current.querySelectorAll('[data-row]');
      const sumBlock = root.current.querySelector('[data-sum]');
      const multLine = root.current.querySelector('[data-mult]');
      const lifeBlock = root.current.querySelector('[data-life]');
      const stamp = root.current.querySelector('[data-stamp]');
      const outro = root.current.querySelector('[data-outro]');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=250%',
          scrub: 0.7,
          pin: pinRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(intro, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5 }, 0);
      tl.fromTo(card, { opacity: 0, yPercent: 10, rotate: 0 }, { opacity: 1, yPercent: 0, rotate: -1.2, duration: 0.7 }, 0.3);

      // Posten stempeln sich ein
      rows.forEach((row, i) => {
        tl.fromTo(
          row,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.35 },
          1.1 + i * 0.35
        );
      });
      const afterRows = 1.1 + rows.length * 0.35 + 0.25;

      // Monatssumme zählt hoch
      tl.fromTo(sumBlock, { opacity: 0 }, { opacity: 1, duration: 0.3 }, afterRows);
      const objM = { v: 0 };
      tl.to(
        objM,
        {
          v: euroGap,
          duration: 0.8,
          ease: 'none',
          onUpdate: () => {
            if (monthlyRef.current) monthlyRef.current.textContent = `−${fmt(objM.v)} €`;
          },
        },
        afterRows
      );

      // × Monate × Jahre → Lebenssumme
      tl.fromTo(multLine, { opacity: 0 }, { opacity: 1, duration: 0.3 }, afterRows + 0.7);
      tl.fromTo(
        lifeBlock,
        { opacity: 0, scale: 1.15 },
        { opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out' },
        afterRows + 1.0
      );
      const objL = { v: 0 };
      tl.to(
        objL,
        {
          v: lifetime,
          duration: 0.9,
          ease: 'power1.in',
          onUpdate: () => {
            if (lifetimeRef.current) lifetimeRef.current.textContent = `−${fmt(objL.v)} €`;
          },
        },
        afterRows + 1.0
      );

      // Stempel knallt drauf
      tl.fromTo(
        stamp,
        { opacity: 0, scale: 2.4, rotate: 4 },
        { opacity: 1, scale: 1, rotate: -8, duration: 0.3, ease: 'power4.in' },
        afterRows + 2.1
      );

      tl.fromTo(outro, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4 }, afterRows + 2.5);

      // Puffer am Ende, damit der letzte Zustand kurz steht
      tl.to({}, { duration: 0.6 });
    }, root);

    return () => ctx.revert();
    // Bei Toggle-Änderung neu aufbauen (Posten kommen dazu/fallen weg)
  }, [items.length, euroGap, lifetime]);

  return (
    <section ref={root} id="gap" className="relative bg-ink text-paper">
      <div ref={pinRef} className="relative h-[100svh] overflow-hidden flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-10 md:gap-16 items-center">

          {/* ── Links: die These ── */}
          <div data-receipt-intro>
            <div className="eyebrow text-paper/40 mb-6">Die Rechnung</div>
            <h2 className="display-xl text-paper text-balance" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 5.5rem)' }}>
              Prozente fühlst du nicht.{' '}
              <span className="display-italic text-pink">Euro schon.</span>
            </h2>
            <p className="mt-8 max-w-md body-lead text-paper/55" style={{ fontSize: 'clamp(0.95rem, 1.1vw, 1.2rem)' }}>
              {gap.toFixed(1)} % klingen abstrakt. Aber die Lücke hat einen
              Preis — jeden Monat, zwanzig Rentenjahre lang. Das hier ist
              dein Bon.
            </p>
            {activeMeta.length === 0 && (
              <p className="mt-6 max-w-md font-mono text-xs text-paper/35 leading-relaxed">
                Tipp: Wähl oben im Diagramm an, was auf dich zutrifft — der
                Kassenzettel rechnet live mit.
              </p>
            )}
          </div>

          {/* ── Rechts: der Kassenzettel ── */}
          <div className="flex justify-center md:justify-end">
            <div
              data-receipt-card
              className="relative w-full max-w-sm bg-bone text-ink font-mono shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)]"
              style={{ fontSize: '12px', lineHeight: 1.7 }}
            >
              {/* Perforationskante oben/unten */}
              <div
                className="h-2 w-full"
                style={{
                  background:
                    'linear-gradient(-45deg, transparent 70%, var(--color-bone) 71%), linear-gradient(45deg, transparent 70%, var(--color-bone) 71%)',
                  backgroundSize: '10px 8px',
                  backgroundRepeat: 'repeat-x',
                  transform: 'translateY(-7px)',
                }}
              />
              <div className="px-6 pb-6 pt-2 md:px-8">
                {/* Kopf */}
                <div className="text-center">
                  <div className="font-bold tracking-[0.3em] text-[13px]">WOMENSURANCE</div>
                  <div className="text-ink/50 tracking-[0.15em] text-[10px] mt-1">
                    KASSENZETTEL · DEIN LEBEN
                  </div>
                  <div className="text-ink/40 text-[10px] mt-1">
                    Beleg 039-4 · gültig: dein Rentenbeginn
                  </div>
                </div>

                <div className="border-t border-dashed border-ink/25 my-4" />

                {/* Posten */}
                <div className="flex justify-between text-ink/45 text-[10px] tracking-[0.12em] mb-2">
                  <span>POSITION</span>
                  <span>€ / MONAT</span>
                </div>
                {items.map((it) => (
                  <div key={it.id} data-row className="flex items-baseline justify-between gap-3 py-1">
                    <div className="min-w-0">
                      <div className="truncate">{it.label}</div>
                      <div className="text-ink/40 text-[10px] truncate">{it.sub}</div>
                    </div>
                    <div className="shrink-0 font-bold">−{fmt(it.euro)}</div>
                  </div>
                ))}

                <div className="border-t border-dashed border-ink/25 my-4" />

                {/* Monatssumme */}
                <div data-sum className="flex items-baseline justify-between">
                  <span className="font-bold tracking-[0.08em]">SUMME / MONAT</span>
                  <span ref={monthlyRef} className="font-bold text-[16px] text-pink-deep">−0 €</span>
                </div>
                <div data-mult className="text-ink/45 text-[10px] mt-1 text-right">
                  × 12 Monate × {RETIREMENT_YEARS} Jahre Rente
                </div>

                <div className="border-t-2 border-ink/70 my-4" />

                {/* Lebenssumme + Stempel */}
                <div data-life className="relative">
                  <div className="flex items-baseline justify-between">
                    <span className="font-bold tracking-[0.08em]">LEBENSSUMME</span>
                    <span
                      ref={lifetimeRef}
                      className="data-num font-sans text-pink-deep"
                      style={{ fontSize: 'clamp(1.6rem, 2.4vw, 2.1rem)' }}
                    >
                      −0 €
                    </span>
                  </div>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none">
                    <div
                      data-stamp
                      className="border-[3px] border-pink text-pink font-bold tracking-[0.25em] text-[13px] px-3 py-1 select-none"
                    >
                      VERMEIDBAR
                    </div>
                  </div>
                </div>

                <div className="border-t border-dashed border-ink/25 my-4" />

                {/* Abbinder */}
                <div data-outro className="text-center">
                  <div className="text-ink/60">
                    Dieser Beleg ist <span className="font-bold">stornierbar</span>.
                  </div>
                  <a
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="link"
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-ink text-paper px-5 py-2.5 text-[11px] font-bold tracking-[0.08em] hover:bg-pink hover:text-ink transition-colors"
                  >
                    ERSTGESPRÄCH BUCHEN — 30 MIN, KOSTENLOS
                  </a>
                  <div className="text-ink/35 text-[9px] mt-3 leading-relaxed">
                    * Beispielrechnung mit Durchschnittswerten.
                    Deine echten Zahlen klären wir gemeinsam.
                  </div>
                </div>
              </div>
              <div
                className="h-2 w-full"
                style={{
                  background:
                    'linear-gradient(-135deg, transparent 70%, var(--color-bone) 71%), linear-gradient(135deg, transparent 70%, var(--color-bone) 71%)',
                  backgroundSize: '10px 8px',
                  backgroundRepeat: 'repeat-x',
                  transform: 'translateY(7px)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
