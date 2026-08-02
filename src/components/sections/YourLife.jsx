import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { lifePhases } from '../../data/lifePhases';
import { useGap } from '../../hooks/useGapState';
import { de1 } from '../../utils/format';

gsap.registerPlugin(ScrollTrigger);

/**
 * "Dein Leben" — die Lebensphasen-Kacheln.
 *
 * Umbau 02.08.2026 (Wunsch Felix): KEIN Horizontal-Scroll mehr. Die Kacheln
 * stehen auf allen Breiten untereinander. Ab md stapeln sie sich per
 * `position: sticky` übereinander — jede Kachel bleibt etwas tiefer stehen
 * als ihre Vorgängerin (STICK_BASE + i * STICK_STEP), sodass ein schmaler
 * Rand der darunterliegenden Karten sichtbar bleibt. Mobil bleibt alles wie
 * gehabt: schlicht untereinander, mit Fade beim Scrollen.
 *
 * Die Prozentzahl rechts ist ab md ebenfalls sticky und steht damit die
 * ganze Sektion über im Blick.
 *
 * ⚠️ Kein `overflow: hidden` auf einem Vorfahren dieser Sektion — das würde
 * jedes `position: sticky` darin still abschalten.
 */

// in rem
const STICK_BASE = 6.5; // Abstand der ersten Karte zum Viewport-Rand (unter der Nav)
const STICK_STEP = 0.75; // sichtbarer Rand je bereits gestapelter Karte

export default function YourLife() {
  const root = useRef(null);
  const trackRef = useRef(null);
  const counterRef = useRef(null);
  const [expandedId, setExpandedId] = useState(null);

  // Toggles leben jetzt ausschließlich im Hero — hier nur noch die Anzeige
  const { gap, baseGap } = useGap();

  // Animate counter on gap change
  useEffect(() => {
    if (!counterRef.current) return;
    const obj = { v: parseFloat(counterRef.current.dataset.current || '0') };
    const tween = gsap.to(obj, {
      v: gap,
      duration: 0.8,
      ease: 'power3.out',
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = de1(obj.v);
          counterRef.current.dataset.current = obj.v;
        }
      },
    });
    return () => tween.kill();
  }, [gap]);

  // Set initial number on mount
  useEffect(() => {
    if (counterRef.current) {
      counterRef.current.textContent = de1(baseGap);
      counterRef.current.dataset.current = baseGap;
    }
  }, [baseGap]);

  useEffect(() => {
    const root_ = root.current;
    const track = trackRef.current;
    if (!root_ || !track) return;

    /**
     * Absolute Dokumentposition einer Kachel im normalen Fluss.
     * Bewusst NICHT über `offsetTop` oder `getBoundingClientRect()`: sobald
     * eine Karte klebt, liefern beide die verschobene Position. Die Höhen der
     * Vorgängerinnen sind dagegen von `sticky` unberührt.
     */
    const flowTopOf = (card) => {
      const cards = track.querySelectorAll('[data-phase-card]');
      const gapPx = parseFloat(getComputedStyle(track).rowGap) || 0;
      let y = track.getBoundingClientRect().top + window.scrollY;
      for (const c of cards) {
        if (c === card) break;
        y += c.offsetHeight + gapPx;
      }
      return y;
    };

    // Nav-Dropdown und /#phase-<id> springen gezielt zu einer Kachel
    window.__scrollToPhase = (phaseId, { duration = 1.2 } = {}) => {
      const card = track.querySelector(`[data-phase-id="${phaseId}"]`);
      if (!card) return;
      // Ab md ist `top` die Klebeposition, mobil "auto" → fester Nav-Abstand.
      const stick = parseFloat(getComputedStyle(card).top);
      const offset = Number.isFinite(stick) ? stick + 12 : 88;
      const y = Math.max(0, flowTopOf(card) - offset);
      const reduced = document.documentElement.dataset.reducedMotion === 'true';
      if (window.__lenis) {
        window.__lenis.scrollTo(y, { duration: reduced ? 0 : duration });
      } else {
        window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
      }
    };

    // Fade beim Scrollen nur mobil. Ab md übernimmt das Stapeln selbst die
    // Choreografie — ein ScrollTrigger auf einer klebenden Karte würde seine
    // Start-/Endpunkte an der verschobenen Position messen.
    const mm = gsap.matchMedia();
    mm.add('(max-width: 767px)', () => {
      const cards = track.querySelectorAll('[data-phase-card]');
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none reverse' },
          }
        );
      });
    });

    return () => {
      delete window.__scrollToPhase;
      mm.revert();
    };
  }, []);

  return (
    <section ref={root} id="life" className="relative bg-paper text-ink">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 md:pt-28 pb-24 md:pb-32">
        <div className="md:grid md:grid-cols-12 md:gap-10">

          {/* Zähler — mobil im Fluss über den Karten, ab md sticky in der
              rechten Spalte, damit die Zahl die ganze Sektion über sichtbar
              bleibt. Die Grid-Zelle streckt sich über die volle Zeilenhöhe;
              nur deshalb hat das sticky überhaupt Laufweg. */}
          <div className="md:col-span-4 md:col-start-9 md:row-start-1 pb-10 md:pb-0">
            <div className="md:sticky md:top-28 pointer-events-none">
              <div className="flex items-baseline justify-end md:justify-start gap-1">
                <span className="data-num text-ink text-4xl md:text-6xl">−</span>
                <span ref={counterRef} className="data-num text-pink-display text-5xl md:text-7xl">{de1(baseGap)}</span>
                <span className="data-num text-ink text-4xl md:text-6xl">%</span>
              </div>
              <div className="text-xs text-ink/75 mt-1 text-right md:text-left">der Männer-Rente</div>
            </div>
          </div>

          {/* Kachel-Stapel */}
          <div
            ref={trackRef}
            className="relative md:col-span-7 md:col-start-1 md:row-start-1 flex flex-col gap-6 md:gap-8"
          >
            {lifePhases.map((phase, i) => (
              <article
                key={phase.id}
                data-phase-card
                data-phase-id={phase.id}
                style={{ top: `${STICK_BASE + i * STICK_STEP}rem` }}
                /* focus-within:z-50 — sonst könnte eine bereits gestapelte
                   Karte das per Tastatur fokussierte Element verdecken. */
                className="relative md:sticky md:min-h-[58vh] md:scroll-mt-32 focus-within:z-50 w-full bg-bone border border-clay-light/60 p-6 md:p-10 xl:p-12 rounded-sm flex flex-col overflow-hidden md:shadow-[0_30px_80px_-30px_rgba(42,33,27,0.45)]"
              >
                <div className="mb-4 md:mb-6">
                  <span className="text-xs text-ink/75">Alter {phase.age}</span>
                </div>

                <h3
                  className="display-lg text-ink mb-3 md:mb-5"
                  style={{ fontSize: 'clamp(1.6rem, 3vw, 3rem)' }}
                >
                  {phase.title}
                </h3>

                <p
                  className="body-lead text-ink/70 mb-4 md:mb-6 max-w-2xl"
                  style={{ fontSize: 'clamp(0.95rem, 1vw, 1.3rem)' }}
                >
                  {phase.body}
                </p>

                <div className="mt-auto pt-4 md:pt-6 border-t border-clay-light/60">
                  {/* Braun statt Pink (Wunsch Felix 02.08.2026): #ff2e88
                      erreicht selbst auf REINWEISS nur 3,5:1, kleiner Text
                      braucht nach WCAG 1.4.3 aber 4,5:1. Statt eines
                      abgedunkelten Pinks nehmen wir das Palettenbraun. */}
                  <div className="eyebrow text-clay-deep mb-1.5 md:mb-2">Was zählt jetzt</div>
                  <p
                    className="text-ink/75 leading-relaxed max-w-2xl"
                    style={{ fontSize: 'clamp(0.8rem, 0.85vw, 1.05rem)' }}
                  >
                    {phase.insurance}
                  </p>

                  {/* Aufklappen (Karten mit Zusatztext) oder Unterseite (Teilzeit/Scheidung) */}
                  {phase.details && (
                    <button
                      onClick={() => setExpandedId(phase.id)}
                      data-cursor="link"
                      className="mt-5 inline-flex items-center gap-2 eyebrow text-clay-deep hover:text-ink transition-colors"
                    >
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-current text-[10px] leading-none">+</span>
                      Mehr erfahren
                    </button>
                  )}
                  {phase.subpage && (
                    <Link
                      to={phase.subpage}
                      data-cursor="link"
                      className="mt-4 md:mt-5 group relative z-10 inline-flex items-center gap-3 rounded-full bg-ink text-paper px-5 py-3 md:px-6 md:py-3.5 text-xs md:text-sm font-bold whitespace-nowrap hover:bg-pink hover:text-ink transition-colors"
                    >
                      <span className="md:hidden">{phase.subpageShort || phase.subpageLabel}</span>
                      <span className="hidden md:inline">{phase.subpageLabel}</span>
                      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 14 14" fill="none" className="shrink-0 transition-transform duration-300 group-hover:translate-x-1">
                        <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  )}
                </div>

                {/* Deko-Ziffer — auch mobil sichtbar (kleiner, damit sie die
                    Buttons nur leicht überlagert) */}
                <div
                  aria-hidden="true"
                  className="absolute -bottom-5 -right-1 md:-bottom-6 md:-right-2 display-italic text-clay-light/40 select-none pointer-events-none"
                  style={{ fontSize: 'clamp(4.5rem, 15vw, 8rem)', lineHeight: 1 }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Aufklapp-Overlay: legt sich über die Kachel, kein Layout-Shift */}
                <div
                  inert={expandedId === phase.id ? undefined : ''}
                  className={`absolute inset-0 z-20 bg-ink text-paper p-8 md:p-10 flex flex-col transition-all duration-500 ${
                    expandedId === phase.id ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
                  }`}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <div className="eyebrow text-pink mb-2">Mehr zu dieser Phase</div>
                      <h4 className="display-lg text-paper" style={{ fontSize: 'clamp(1.4rem, 2vw, 2rem)' }}>
                        {phase.title}
                      </h4>
                    </div>
                    <button
                      onClick={() => setExpandedId(null)}
                      aria-label="Schließen"
                      data-cursor="link"
                      className="text-paper/55 hover:text-pink text-2xl leading-none -mt-1"
                    >
                      ×
                    </button>
                  </div>
                  <p className="body-lead text-paper/75 overflow-y-auto pr-1" style={{ fontSize: 'clamp(0.95rem, 0.95vw, 1.15rem)' }}>
                    {phase.details}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
