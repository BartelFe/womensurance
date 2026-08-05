import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGap, TOGGLE_META, BASE_EURO, RETIREMENT_YEARS } from '../../hooks/useGapState';
import { BOOKING_URL, CALL_MINUTES } from '../../config/site';
import { de1 } from '../../utils/format';
import { Satz, fuellen } from '../../lib/inhalt';
import startseite from '../../content/startseite.json';

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

  // Textfassung der beiden animierten Kennzahlen für die Live-Region
  const spokenSummary = `Monatliche Minderung ${fmt(euroGap)} Euro. `
    + `Über ${RETIREMENT_YEARS} Rentenjahre ${fmt(euroGap * 12 * RETIREMENT_YEARS)} Euro.`;

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
      const multLine = root.current.querySelector('[data-mult]');
      const lifeBlock = root.current.querySelector('[data-life]');
      const stamp = root.current.querySelector('[data-stamp]');
      const outro = root.current.querySelector('[data-outro]');

      /* Vorlauf: Bescheid und Überschrift blenden ein, WÄHREND die Sektion
         hereinscrollt — also bevor der Pin greift.

         Vorher hingen beide in der gepinnten Timeline unten, die erst bei
         `start: 'top top'` loslegt. Dazwischen lag ein totes Stück: Der
         Kopfbereich ist 100svh hoch, sobald er nach oben rausgescrollt ist,
         steht der Bescheid noch auf Deckkraft 0. Auf dem Handy gemessen
         (375x812): bei scrollY 700 endete der letzte sichtbare Inhalt bei
         106 px, darunter waren 706 px leer, das sind 87 % des Bildschirms.
         Gemeldet von Felix am 06.08.2026 mit Screenshot.

         Eigener Trigger statt frühere Startzeit in der Timeline, weil der
         Pin zwingend bei 'top top' beginnen muss. Beim Zurückscrollen
         blendet es sauber wieder aus, die gewünschte Überblendung bleibt. */
      const einblenden = {
        trigger: root.current,
        start: 'top 85%',
        end: 'top 20%',
        scrub: 0.5,
      };
      gsap.fromTo(intro, { opacity: 0, y: 20 }, { opacity: 1, y: 0, ease: 'none', scrollTrigger: einblenden });
      // Karte kommt gerade herein (kein Kippwinkel — Wunsch Julia 07/2026)
      gsap.fromTo(card, { opacity: 0, yPercent: 8 }, { opacity: 1, yPercent: 0, ease: 'none', scrollTrigger: einblenden });

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

      // Posten stempeln sich ein (alle 5 immer in der Timeline)
      // Start bei 0.25 statt 0.8: Die 0.8 waren der Platz, den Überschrift
      // und Karte in dieser Timeline gebraucht haben. Die laufen jetzt im
      // Vorlauf, also darf der erste Posten sofort kommen. Alles Weitere
      // hängt an `afterRows` und rutscht automatisch mit.
      const rowsStart = 0.25;
      rows.forEach((row, i) => {
        tl.fromTo(
          row,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.35 },
          rowsStart + i * 0.3
        );
      });
      const afterRows = rowsStart + rows.length * 0.3 + 0.25;

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

      // Stempel knallt quer über den ganzen Bescheid
      tl.fromTo(
        stamp,
        { opacity: 0, scale: 2.6, rotate: -2 },
        { opacity: 1, scale: 1, rotate: -13, duration: 0.3, ease: 'power4.in' },
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

  const today = new Date().toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <section ref={root} id="gap" className="relative bg-ink text-paper">
      <div ref={pinRef} className="relative h-[100svh] overflow-hidden flex items-center">
        {/* Zwischen md und lg bekommt der Bescheid mehr Breite als die
            Überschrift (0,8fr / 1,2fr). Bei 50/50 blieben auf einem 768er
            Tablet nur 316px Spalte übrig — der Bescheid kann aber nicht
            unter 28,8em, seine Schrift wäre dort auf 10,7px geschrumpft.
            Ab lg wieder 50/50, dort ist Platz genug. `minmax(0, …)` statt
            `…fr`, sonst verhindert die Auto-Mindestbreite der Grid-Zellen
            das Schrumpfen. Die Divisoren in `.notice-doc` (globals.css)
            hängen an genau diesen Anteilen. */}
        <div className="w-full max-w-6xl mx-auto px-6 md:px-12 grid md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:grid-cols-2 gap-4 md:gap-10 items-center">

          {/* ── Links: die These (mobil nur die Überschrift) ── */}
          <div data-doc-intro>
            <h2 className="display-xl text-paper text-balance" style={{ fontSize: 'clamp(1.6rem, 4.5vw, 4.2rem)' }}>
              <Satz teile={startseite.bescheidUeberschrift} />
            </h2>
            {/* Die Prozentzahl bleibt bewusst dynamisch: sie folgt den Toggles
                im Hero, sonst widerspräche der Text dem Bescheid daneben. */}
            {/* Erst ab lg: zwischen md und lg ist die linke Spalte nur rund
                250px breit, da steht neben der Überschrift kein Fließtext. */}
            {startseite.bescheidAbsaetze?.[0] && (
              <p className="hidden lg:block mt-8 max-w-md body-lead text-paper/55" style={{ fontSize: 'clamp(0.95rem, 1.1vw, 1.2rem)' }}>
                {fuellen(startseite.bescheidAbsaetze[0], { gap: de1(gap) })}
              </p>
            )}
            {/* Der zweite Absatz ist der Bedienhinweis: er verschwindet, sobald
                die Besucherin tatsächlich etwas angeklickt hat. */}
            {startseite.bescheidAbsaetze?.[1] && (
              <p
                className={`hidden lg:block mt-6 max-w-md text-sm text-paper/55 leading-relaxed ${activeMeta.length === 0 ? '' : 'lg:invisible'}`}
              >
                {fuellen(startseite.bescheidAbsaetze[1], { gap: de1(gap) })}
              </p>
            )}
          </div>

          {/* ── Rechts: der Rentenbescheid ──
              Basis-Schriftgröße hängt an der Viewport-Höhe (.notice-doc in
              globals.css), alle inneren Maße in em → das Dokument füllt die
              verfügbare Höhe und wird nie abgeschnitten. */}
          {/* min-w-0: Grid-Items haben min-width:auto — ohne das setzt sich die
              max-w-[360px] des Bescheids gegen das px-6 des Containers durch
              und der rechte Rand wird vom overflow-hidden gekappt (WCAG 1.4.10). */}
          <div className="flex justify-center min-w-0">
            <div
              data-doc-card
              className="notice-doc relative w-full max-w-[360px] md:max-w-none md:w-[33em] bg-bone text-ink shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)]"
            >
              {/* VERMEIDBAR — quer über den ganzen Bescheid gestempelt.
                  Eigener Positions-Wrapper, damit die GSAP-Transforms
                  (scale/rotate) das Zentrieren nicht überschreiben. */}
              <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none overflow-hidden">
                <div
                  data-stamp
                  className="border-[0.1em] border-pink-display text-pink-display font-black tracking-[0.14em] text-[2.7em] md:text-[3.15em] leading-none px-[0.42em] py-[0.16em] select-none whitespace-nowrap"
                >
                  VERMEIDBAR
                </div>
              </div>

              <div className="px-[1.5em] py-[1.3em] md:px-[2.2em] md:py-[1.7em]">

                {/* ── Briefkopf ── */}
                <div className="flex items-start justify-between gap-[1em]">
                  <div>
                    <div className="font-bold tracking-[0.2em] text-[1.05em]">WOMENSURANCE</div>
                    <div className="text-ink/75 text-[0.78em] tracking-[0.05em] mt-[0.1em] whitespace-nowrap">
                      Eine Marke der DVM · Ingolstadt
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold tracking-[0.12em] text-[0.85em]">RENTENINFORMATION</div>
                    <div className="tnum text-[0.8em] text-ink/75 mt-[0.15em]">Stand: {today}</div>
                  </div>
                </div>

                <div className="border-b-2 border-ink/70 mt-[0.8em]" />

                {/* ── Anschriftfeld ── */}
                <div className="mt-[1em]">
                  <div className="font-bold">Für dich.</div>
                  <div className="tnum text-[0.82em] text-ink/75">
                    Versichertennummer 39 400394 W 001
                  </div>
                </div>

                {/* ── Betreff ── */}
                <div className="mt-[1em] font-bold text-[1.15em]">
                  Deine voraussichtliche Altersrente
                </div>

                {/* ── Tabelle: Berechnungsgrundlagen ── */}
                <div className="mt-[0.8em]">
                  <div className="flex justify-between text-ink/75 text-[0.75em] tracking-[0.12em] uppercase border-b border-ink/25 pb-[0.3em]">
                    <span>Berechnungsgrundlagen</span>
                    <span>€ / Monat</span>
                  </div>

                  <div data-row className="flex items-baseline justify-between gap-[1em] border-b border-ink/10 py-[0.5em]">
                    <div className="min-w-0">
                      <div className="truncate">Gender Pension Gap · Basis</div>
                      <div className="hidden md:block text-ink/75 text-[0.8em] truncate">Ø Rente Frau vs. Mann, Deutschland</div>
                    </div>
                    <div className="shrink-0 tnum font-bold">−{fmt(BASE_EURO)} €</div>
                  </div>

                  {TOGGLE_META.map((m) => (
                    <div
                      key={m.id}
                      data-row
                      className={`flex items-baseline justify-between gap-[1em] border-b border-ink/10 py-[0.5em] ${toggles[m.id] ? '' : 'invisible'}`}
                    >
                      <div className="min-w-0">
                        <div className="truncate">{m.receiptLabel}</div>
                        <div className="hidden md:block text-ink/75 text-[0.8em] truncate">{m.receiptSub}</div>
                      </div>
                      <div className="shrink-0 tnum font-bold">−{fmt(m.euro)} €</div>
                    </div>
                  ))}
                </div>

                {/* ── Kennzahlen-Boxen ── */}
                {/* Beide Zahlen werden per GSAP hochgezählt und sind deshalb für
                    Screenreader ausgeblendet; die Live-Region unten sagt das
                    Ergebnis einmal an, wenn es sich geändert hat. */}
                <p className="sr-only" aria-live="polite">{spokenSummary}</p>

                <div data-sum className="mt-[1em] border border-ink/60 px-[1em] py-[0.6em]">
                  <div className="flex items-baseline justify-between gap-[1em]">
                    <span className="font-bold tracking-[0.06em] text-[0.85em] uppercase whitespace-nowrap">Monatliche Minderung</span>
                    <span ref={monthlyRef} aria-hidden="true" className="tnum font-black text-[1.35em] text-clay-deep whitespace-nowrap">−0 €</span>
                  </div>
                  <div data-mult className="tnum text-ink/75 text-[0.78em] text-right mt-[0.15em]">
                    × 12 Monate × {RETIREMENT_YEARS} Jahre Rente
                  </div>
                </div>

                <div data-life className="relative mt-[0.7em] border-2 border-ink px-[1em] py-[0.65em] bg-ink/[0.03] flex items-baseline justify-between gap-[1em]">
                  <span className="font-bold tracking-[0.06em] text-[0.85em] uppercase whitespace-nowrap">
                    Über {RETIREMENT_YEARS} Rentenjahre
                  </span>
                  <span
                    ref={lifetimeRef}
                    aria-hidden="true"
                    className="data-num text-pink-display whitespace-nowrap text-[2em]"
                  >
                    −0 €
                  </span>
                </div>

                {/* ── CTA ── (die Rechtsbehelfsbelehrung ist bewusst raus:
                    schafft Platz für einen Button in Standardgröße) */}
                <div data-outro className="mt-[1em] border-t border-ink/25 pt-[1em] text-center">
                  <a
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="link"
                    className="group inline-flex items-center gap-[0.7em] rounded-full bg-ink text-paper px-[2em] py-[1.05em] text-[1em] font-bold whitespace-nowrap hover:bg-pink hover:text-ink transition-colors"
                  >
                    Widerspruch einlegen
                    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 transition-transform duration-300 group-hover:translate-x-1">
                      <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                  <div className="text-ink/75 text-[0.8em] mt-[0.6em]">
                    {CALL_MINUTES} Minuten · kostenlos · unverbindlich
                  </div>
                  <div className="text-ink/75 text-[0.75em] mt-[0.5em] leading-snug">
                    * Beispielrechnung mit Durchschnittswerten — kein amtliches Dokument.
                    Deine echten Zahlen klären wir gemeinsam.
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
