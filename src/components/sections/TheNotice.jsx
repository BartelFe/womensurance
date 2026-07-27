import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGap, TOGGLE_META, BASE_EURO, RETIREMENT_YEARS } from '../../hooks/useGapState';
import { BOOKING_URL } from '../../config/site';

gsap.registerPlugin(ScrollTrigger);

const fmt = (n) => Math.round(n).toLocaleString('de-DE');

/**
 * "Der Rentenbescheid" — übersetzt die Hero-Interaktion in Euro,
 * im Look der Renteninformation, die jede Frau ab 27 jährlich per Post bekommt.
 *
 * Höhen-Konzept: Die Basis-Schriftgröße des Dokuments hängt an der
 * Viewport-HÖHE (clamp + vh), alle inneren Maße sind in em. Dadurch
 * skaliert der komplette Bescheid mit dem tatsächlich sichtbaren
 * Browserfenster (Suchleisten etc. eingerechnet) und wird nie
 * abgeschnitten. Inhalt bewusst auf den Kern reduziert.
 *
 * WICHTIG (Pin-Stabilität): Die Timeline wird EINMAL gebaut und nie
 * neu aufgesetzt — sonst verschieben sich die Pin-Spacer und die
 * nachfolgende Horizontal-Section bricht ein. Alle 5 möglichen Posten
 * sind immer Teil der Timeline UND des Layouts; inaktive sind nur
 * `invisible` (Platz bleibt reserviert → Dokumenthöhe konstant).
 * Live-Werte (€) kommen aus Refs, nicht aus Closure-Variablen.
 * ⚠️ Beispielrechnung mit Platzhalter-Werten — mit Julia validieren.
 */
export default function TheNotice() {
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
    // Wenn der Bescheid schon (teil-)gescrollt ist, Anzeige an neue Summe angleichen
    if (monthlyRef.current && tMonthly.current > 0) {
      monthlyRef.current.textContent = `−${fmt(tMonthly.current * euroGap)} €`;
    }
    if (lifetimeRef.current && tLifetime.current > 0) {
      lifetimeRef.current.textContent = `−${fmt(tLifetime.current * euroGap * 12 * RETIREMENT_YEARS)} €`;
    }
  }, [euroGap]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const intro = root.current.querySelector('[data-doc-intro]');
      const card = root.current.querySelector('[data-doc-card]');
      const rows = root.current.querySelectorAll('[data-row]');
      const sumBlock = root.current.querySelector('[data-sum]');
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
      tl.fromTo(card, { opacity: 0, yPercent: 8, rotate: 0 }, { opacity: 1, yPercent: 0, rotate: -0.8, duration: 0.45 }, 0.1);

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

      // Monatliche Minderung zählt hoch — Zielwert live aus Ref
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

      // Lebenssumme
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
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-4 md:gap-16 items-center">

          {/* ── Links: die These (mobil nur die Überschrift) ── */}
          <div data-doc-intro>
            <div className="eyebrow text-paper/40 mb-2 md:mb-6">Die Rechnung</div>
            <h2 className="display-xl text-paper text-balance" style={{ fontSize: 'clamp(1.6rem, 4.5vw, 4.2rem)' }}>
              Was die Prozente in{' '}
              <span className="display-italic text-pink">Euros</span> bedeuten.
            </h2>
            <p className="hidden md:block mt-8 max-w-md body-lead text-paper/55" style={{ fontSize: 'clamp(0.95rem, 1.1vw, 1.2rem)' }}>
              {gap.toFixed(1)} % klingen abstrakt. Aber die Lücke hat einen
              Preis — jeden Monat, zwanzig Rentenjahre lang. Das hier ist
              dein Bescheid.
            </p>
            <p
              className={`hidden md:block mt-6 max-w-md font-mono text-xs text-paper/35 leading-relaxed ${activeMeta.length === 0 ? '' : 'md:invisible'}`}
            >
              Tipp: Wähl oben im Diagramm an, was auf dich zutrifft — der
              Bescheid rechnet live mit.
            </p>
          </div>

          {/* ── Rechts: der Rentenbescheid ──
              Basis-Schriftgröße hängt an der Viewport-Höhe → das ganze
              Dokument skaliert mit dem sichtbaren Fenster. */}
          <div className="flex justify-center md:justify-end">
            <div
              data-doc-card
              className="relative w-full max-w-[344px] md:max-w-[430px] bg-bone text-ink shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)]"
              style={{ fontSize: 'clamp(9px, 1.5vh, 13px)', lineHeight: 1.5 }}
            >
              <div className="px-[1.5em] py-[1.3em] md:px-[2em] md:py-[1.6em]">

                {/* ── Briefkopf ── */}
                <div className="flex items-baseline justify-between gap-[1em]">
                  <div className="font-bold tracking-[0.2em] text-[1.05em]">WOMENSURANCE</div>
                  <div className="font-bold tracking-[0.12em] text-[0.85em] text-ink/70">RENTENINFORMATION</div>
                </div>

                <div className="border-b-2 border-ink/70 mt-[0.7em]" />

                {/* ── Betreff ── */}
                <div className="mt-[0.9em] font-bold text-[1.15em]">
                  Deine voraussichtliche Altersrente
                </div>

                {/* ── Posten ── */}
                <div className="mt-[0.5em]">
                  <div data-row className="flex items-baseline justify-between gap-[1em] border-b border-ink/10 py-[0.45em]">
                    <div className="truncate">Gender Pension Gap · Basis</div>
                    <div className="shrink-0 font-mono font-bold">−{fmt(BASE_EURO)} €</div>
                  </div>

                  {TOGGLE_META.map((m) => (
                    <div
                      key={m.id}
                      data-row
                      className={`flex items-baseline justify-between gap-[1em] border-b border-ink/10 py-[0.45em] ${toggles[m.id] ? '' : 'invisible'}`}
                    >
                      <div className="truncate">{m.receiptLabel}</div>
                      <div className="shrink-0 font-mono font-bold">−{fmt(m.euro)} €</div>
                    </div>
                  ))}
                </div>

                {/* ── Kennzahlen-Boxen ── */}
                <div data-sum className="mt-[0.9em] border border-ink/60 px-[1em] py-[0.55em] flex items-baseline justify-between gap-[1em]">
                  <span className="font-bold tracking-[0.06em] text-[0.85em] uppercase whitespace-nowrap">Monatlich</span>
                  <span ref={monthlyRef} className="font-mono font-bold text-[1.3em] text-pink-deep whitespace-nowrap">−0 €</span>
                </div>

                <div data-life className="relative mt-[0.7em] border-2 border-ink px-[1em] py-[0.65em] bg-ink/[0.03] flex items-baseline justify-between gap-[1em]">
                  <span className="font-bold tracking-[0.06em] text-[0.85em] uppercase whitespace-nowrap">
                    {RETIREMENT_YEARS} Rentenjahre
                  </span>
                  <span
                    ref={lifetimeRef}
                    className="data-num text-pink-deep whitespace-nowrap text-[1.9em]"
                  >
                    −0 €
                  </span>
                  {/* Stempel — eigener Positions-Wrapper, damit GSAP-Transforms das Zentrieren nicht überschreiben */}
                  <div className="absolute -top-[0.9em] left-1/2 -translate-x-1/2 pointer-events-none">
                    <div
                      data-stamp
                      className="border-[0.22em] border-pink text-pink font-bold tracking-[0.25em] text-[0.95em] px-[0.9em] py-[0.2em] select-none bg-bone/70 whitespace-nowrap"
                    >
                      VERMEIDBAR
                    </div>
                  </div>
                </div>

                {/* ── Widerspruch + CTA ── */}
                <div data-outro className="mt-[0.9em] border-t border-ink/25 pt-[0.8em] text-center">
                  <p className="text-ink/70">
                    Gegen diesen Bescheid kannst du{' '}
                    <span className="font-bold text-ink">Widerspruch einlegen</span>.
                  </p>
                  <a
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="link"
                    className="mt-[0.7em] inline-flex items-center rounded-full bg-ink text-paper px-[1.6em] py-[0.75em] text-[0.88em] font-bold tracking-[0.08em] whitespace-nowrap hover:bg-pink hover:text-ink transition-colors"
                  >
                    WIDERSPRUCH EINLEGEN — 30 MIN, KOSTENLOS
                  </a>
                  <div className="text-ink/35 text-[0.72em] mt-[0.8em] leading-snug">
                    * Beispielrechnung mit Durchschnittswerten — kein amtliches Dokument.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
