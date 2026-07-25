import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGap, TOGGLE_META, BASE_EURO, RETIREMENT_YEARS } from '../../hooks/useGapState';
import { BOOKING_URL } from '../../config/site';

gsap.registerPlugin(ScrollTrigger);

const fmt = (n) => Math.round(n).toLocaleString('de-DE');

/**
 * "Der Kassenzettel" — übersetzt die Hero-Interaktion in Euro.
 *
 * WICHTIG (Pin-Stabilität): Die Timeline wird EINMAL gebaut und nie
 * neu aufgesetzt — sonst verschieben sich die Pin-Spacer und die
 * nachfolgende Horizontal-Section bricht ein. Alle 5 möglichen Posten
 * sind immer Teil der Timeline; inaktive sind nur per CSS versteckt.
 * Live-Werte (€) kommen aus Refs, nicht aus Closure-Variablen.
 * ⚠️ Beispielrechnung mit Platzhalter-Werten — mit Julia validieren.
 */
export default function TheReceipt() {
  const root = useRef(null);
  const pinRef = useRef(null);
  const monthlyRef = useRef(null);
  const lifetimeRef = useRef(null);

  const { toggles, euroGap, activeMeta, gap } = useGap();

  // Live-Werte für die Scrub-Tweens (Timeline bleibt statisch)
  const euroLive = useRef(euroGap);
  const tMonthly = useRef(0);
  const tLifetime = useRef(0);
  useEffect(() => {
    euroLive.current = euroGap;
    // Wenn der Bon schon (teil-)gescrollt ist, Anzeige an neue Summe angleichen
    if (monthlyRef.current && tMonthly.current > 0) {
      monthlyRef.current.textContent = `−${fmt(tMonthly.current * euroGap)} €`;
    }
    if (lifetimeRef.current && tLifetime.current > 0) {
      lifetimeRef.current.textContent = `−${fmt(tLifetime.current * euroGap * 12 * RETIREMENT_YEARS)} €`;
    }
  }, [euroGap]);

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

      // Früh sichtbar werden — sonst wirkt der Pin-Einstieg wie ein schwarzer Screen
      tl.fromTo(intro, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.2 }, 0);
      tl.fromTo(card, { opacity: 0, yPercent: 8, rotate: 0 }, { opacity: 1, yPercent: 0, rotate: -1.2, duration: 0.45 }, 0.1);

      // Posten stempeln sich ein (alle 5 immer in der Timeline)
      rows.forEach((row, i) => {
        tl.fromTo(
          row,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.35 },
          0.8 + i * 0.3
        );
      });
      const afterRows = 0.8 + rows.length * 0.3 + 0.25;

      // Monatssumme zählt hoch — Zielwert live aus Ref
      tl.fromTo(sumBlock, { opacity: 0 }, { opacity: 1, duration: 0.3 }, afterRows);
      const objM = { t: 0 };
      tl.to(
        objM,
        {
          t: 1,
          duration: 0.8,
          ease: 'none',
          onUpdate: () => {
            tMonthly.current = objM.t;
            if (monthlyRef.current) {
              monthlyRef.current.textContent = `−${fmt(objM.t * euroLive.current)} €`;
            }
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
      const objL = { t: 0 };
      tl.to(
        objL,
        {
          t: 1,
          duration: 0.9,
          ease: 'power1.in',
          onUpdate: () => {
            tLifetime.current = objL.t;
            if (lifetimeRef.current) {
              lifetimeRef.current.textContent = `−${fmt(objL.t * euroLive.current * 12 * RETIREMENT_YEARS)} €`;
            }
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

    // Sicherheitsnetz: alle Trigger einmal sauber in Dokument-Reihenfolge vermessen
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, []); // ← bewusst leer: Timeline wird nie neu gebaut

  return (
    <section ref={root} id="gap" className="relative bg-ink text-paper">
      <div ref={pinRef} className="relative h-[100svh] overflow-hidden flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-5 md:gap-16 items-center">

          {/* ── Links: die These (mobil nur die Überschrift) ── */}
          <div data-receipt-intro>
            <div className="eyebrow text-paper/40 mb-3 md:mb-6">Die Rechnung</div>
            <h2 className="display-xl text-paper text-balance" style={{ fontSize: 'clamp(1.8rem, 4.5vw, 4.2rem)' }}>
              Was die Prozente in{' '}
              <span className="display-italic text-pink">Euros</span> bedeuten.
            </h2>
            <p className="hidden md:block mt-8 max-w-md body-lead text-paper/55" style={{ fontSize: 'clamp(0.95rem, 1.1vw, 1.2rem)' }}>
              {gap.toFixed(1)} % klingen abstrakt. Aber die Lücke hat einen
              Preis — jeden Monat, zwanzig Rentenjahre lang. Das hier ist
              dein Bon.
            </p>
            <p
              className={`hidden md:block mt-6 max-w-md font-mono text-xs text-paper/35 leading-relaxed ${activeMeta.length === 0 ? '' : 'md:invisible'}`}
            >
              Tipp: Wähl oben im Diagramm an, was auf dich zutrifft — der
              Kassenzettel rechnet live mit.
            </p>
          </div>

          {/* ── Rechts: der Kassenzettel ── */}
          <div className="flex justify-center md:justify-end">
            <div
              data-receipt-card
              className="relative w-full max-w-[330px] md:max-w-sm bg-bone text-ink font-mono shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)] text-[11px] md:text-[12px]"
              style={{ lineHeight: 1.65 }}
            >
              {/* Perforationskante oben */}
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
              <div className="px-5 pb-5 pt-2 md:px-8 md:pb-6">
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

                {/* Posten — Basis immer, Lebensereignisse je nach Auswahl */}
                <div className="flex justify-between text-ink/45 text-[10px] tracking-[0.12em] mb-2">
                  <span>POSITION</span>
                  <span>€ / MONAT</span>
                </div>
                <div data-row className="flex items-baseline justify-between gap-3 py-1">
                  <div className="min-w-0">
                    <div className="truncate">Gender Pension Gap · Basis</div>
                    <div className="text-ink/40 text-[10px] truncate">Ø Rente Frau vs. Mann, Deutschland</div>
                  </div>
                  <div className="shrink-0 font-bold">−{fmt(BASE_EURO)}</div>
                </div>
                {TOGGLE_META.map((m) => (
                  <div
                    key={m.id}
                    data-row
                    className={`flex items-baseline justify-between gap-3 py-1 ${toggles[m.id] ? '' : 'hidden'}`}
                  >
                    <div className="min-w-0">
                      <div className="truncate">{m.receiptLabel}</div>
                      <div className="text-ink/40 text-[10px] truncate">{m.receiptSub}</div>
                    </div>
                    <div className="shrink-0 font-bold">−{fmt(m.euro)}</div>
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
              {/* Perforationskante unten */}
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
