import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import MagneticButton from '../ui/MagneticButton';
import { BOOKING_URL, CALL_MINUTES } from '../../config/site';
import { RETIREMENT_YEARS } from '../../hooks/useGapState';

// Offizielle Entgeltpunkt-Logik (vereinfacht):
//  EP/Jahr = eigenes Jahresbrutto ÷ Durchschnittsentgelt (gedeckelt ~BBG)
//  Verlust = volle EP × Teilzeit-Anteil × Jahre × aktueller Rentenwert
// Konstanten mit Julia validieren / jährlich pflegen:
const RENTENWERT = 40.79; // €/Entgeltpunkt·Monat, Stand 07/2025
const AVG_INCOME_YEAR = 50493; // Durchschnittsentgelt 2025 (vorläufig)
const EP_CAP = 2.07; // Deckel nahe Beitragsbemessungsgrenze
const FULL_HOURS = 40;

const fmt = (n) => Math.round(n).toLocaleString('de-DE');

function Slider({ label, value, display, min, max, step, onChange }) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-2">
        <span className="eyebrow text-clay-deep">{label}</span>
        <span className="tnum text-sm text-ink font-bold">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        // Ohne aria-valuetext liest der Screenreader nur die nackte Zahl ("25")
        aria-valuetext={display}
        className="w-full h-1.5 cursor-pointer appearance-none rounded-full bg-clay-light
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgb(var(--pink-rgb)/0.25)]
          [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:border-0
          [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-pink"
      />
    </label>
  );
}

/**
 * "Rentenlücke berechnen" — der SEO- und Lead-Magnet der Themenseite.
 * Live-Rechner: Stunden + Jahre + Gehalt → €/Monat Rentenverlust.
 */
export default function ParttimeCalculator() {
  const [hours, setHours] = useState(25);
  const [years, setYears] = useState(10);
  const [salary, setSalary] = useState(4200);

  const monthlyRef = useRef(null);
  const lifetimeRef = useRef(null);
  const displayed = useRef(0);
  const [announced, setAnnounced] = useState('');

  const monthly = useMemo(() => {
    const epFull = Math.min((salary * 12) / AVG_INCOME_YEAR, EP_CAP);
    const lostShare = Math.max(0, 1 - hours / FULL_HOURS);
    return epFull * lostShare * years * RENTENWERT;
  }, [hours, years, salary]);

  const lifetime = monthly * 12 * RETIREMENT_YEARS;

  useEffect(() => {
    const obj = { v: displayed.current };
    const tween = gsap.to(obj, {
      v: monthly,
      duration: 0.6,
      ease: 'power3.out',
      onUpdate: () => {
        displayed.current = obj.v;
        if (monthlyRef.current) monthlyRef.current.textContent = `−${fmt(obj.v)} €`;
        if (lifetimeRef.current) {
          lifetimeRef.current.textContent = `−${fmt(obj.v * 12 * RETIREMENT_YEARS)} €`;
        }
      },
    });
    return () => tween.kill();
  }, [monthly]);

  // Das Ergebnis wird per GSAP direkt ins DOM geschrieben — davon bekommt ein
  // Screenreader nichts mit. Deshalb eine eigene Live-Region, die erst ansagt,
  // wenn die Nutzerin den Regler losgelassen hat (sonst Dauerfeuer beim Ziehen).
  useEffect(() => {
    const t = setTimeout(() => {
      setAnnounced(
        `${fmt(monthly)} Euro weniger Rente pro Monat. ` +
          `Über ${RETIREMENT_YEARS} Rentenjahre ${fmt(lifetime)} Euro.`
      );
    }, 700);
    return () => clearTimeout(t);
  }, [monthly, lifetime]);

  return (
    <section id="rechner" className="bg-paper text-ink px-6 md:px-12 py-24 md:py-32">
      <div className="max-w-6xl mx-auto">
        <h2 className="display-lg text-ink text-balance mb-4" style={{ fontSize: 'clamp(1.9rem, 4vw, 3.8rem)' }}>
          Rentenlücke berechnen: Was kostet dich{' '}
          <span className="display-italic text-pink-display">Teilzeit?</span>
        </h2>
        <p className="body-lead text-ink/75 max-w-2xl mb-12" style={{ fontSize: 'clamp(0.95rem, 1.1vw, 1.15rem)' }}>
          Drei Regler, deine Zahl. Gerechnet mit der offiziellen
          Entgeltpunkt-Formel der gesetzlichen Rente.
        </p>

        <div className="grid md:grid-cols-2 gap-8 md:gap-14 items-stretch">
          {/* Eingaben — auf großen Screens verteilen sich die Regler über die
              volle Höhe der Ergebnis-Karte (gap = Mindestabstand). */}
          <div className="bg-bone border border-clay-light/60 rounded-sm p-7 md:p-10 flex flex-col gap-8 md:justify-between">
            <Slider
              label="Stunden pro Woche"
              value={hours}
              display={`${hours} Std.`}
              min={10}
              max={40}
              step={1}
              onChange={setHours}
            />
            <Slider
              label="Jahre in Teilzeit"
              value={years}
              display={`${years} ${years === 1 ? 'Jahr' : 'Jahre'}`}
              min={1}
              max={30}
              step={1}
              onChange={setYears}
            />
            <Slider
              label="Dein Vollzeit-Brutto / Monat"
              value={salary}
              display={`${fmt(salary)} €`}
              min={1500}
              max={8000}
              step={100}
              onChange={setSalary}
            />
            <p className="text-[12px] text-ink/75 leading-relaxed">
              Vereinfachte Beispielrechnung · Rentenwert {RENTENWERT.toFixed(2).replace('.', ',')} €
              (Stand 07/2025) · Vollzeit = 40 Std. · ohne Lohnentwicklung &amp; Ausgleichszeiten.
            </p>
          </div>

          {/* Ergebnis */}
          <div className="bg-ink text-paper rounded-sm p-7 md:p-10 flex flex-col justify-between relative overflow-hidden">
            <div
              className="absolute -right-16 -top-16 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgb(var(--pink-rgb) / 0.2) 0%, transparent 70%)' }}
            />
            <div className="relative">
              {/* Live-Region für Screenreader — die animierten Zahlen darunter
                  sind für sie ausgeblendet, weil GSAP sie 60×/s überschreibt. */}
              <p className="sr-only" aria-live="polite">{announced}</p>

              <div className="eyebrow text-paper/55 mb-3">Deine Teilzeit kostet dich</div>
              <div ref={monthlyRef} aria-hidden="true" className="data-num text-pink" style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
                −0 €
              </div>
              <div className="text-xs text-paper/55 mt-2">Rente · jeden Monat · lebenslang</div>

              <div className="mt-8 pt-6 border-t border-paper/10">
                <div className="eyebrow text-paper/55 mb-2">Über {RETIREMENT_YEARS} Rentenjahre</div>
                <div ref={lifetimeRef} aria-hidden="true" className="data-num text-paper" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}>
                  −0 €
                </div>
              </div>
            </div>

            <div className="relative mt-10">
              <MagneticButton href={BOOKING_URL} target="_blank" variant="pink">
                <span className="font-medium tracking-wide">Ergebnis besprechen — kostenlos</span>
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </MagneticButton>
              <p className="mt-4 text-[11px] text-paper/55 leading-relaxed max-w-sm">
                Die echte Zahl hängt an deinem Rentenkonto — Ausgleichszeiten,
                Kindererziehung, Verträge. In {CALL_MINUTES} Minuten rechnen wir sie gemeinsam.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
