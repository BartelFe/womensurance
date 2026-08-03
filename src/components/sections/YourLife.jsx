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
 * Umbau 02.08.2026 (Wunsch Felix, zweite Runde): weder Horizontal-Scroll noch
 * `position: sticky`-Stapel. Die Kacheln stehen auf ALLEN Breiten schlicht
 * untereinander und blenden sich beim Scrollen ein — dieselbe Mechanik wie
 * „4 Schritte. Ein Konzept." (TheMethod.jsx).
 *
 * Bewusst OHNE den Scrub aus TheMethod, der bereits gescrollte Karten leicht
 * verkleinert und übereinanderschiebt: dort sind die Karten ~250px hoch, hier
 * 500–900px. Derselbe Wert würde die Vorgängerkarten sichtbar über die
 * nachfolgenden ziehen — also genau der Stapel-Look, der raus sollte.
 *
 * Die Prozentzahl klebt auf allen Breiten (mobil oben rechts als Kachel über
 * dem Inhalt, ab md in der rechten Spalte) und ist damit die ganze Sektion
 * über sichtbar. Das funktioniert nur, weil Zähler und Kachel-Spalte
 * GESCHWISTER im selben Container sind: ein sticky-Element klebt nur so
 * lange, wie sein Elternelement im Bild ist.
 */

/** `body`/`details` in lifePhases.js dürfen String oder Absatz-Array sein. */
const asParagraphs = (v) => (Array.isArray(v) ? v : v ? [v] : []);

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

  // Der Aufklapptext liegt im Fluss, die Kachel wächst also beim Öffnen.
  // Dadurch verschieben sich alle Trigger darunter.
  useEffect(() => {
    const t = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(t);
  }, [expandedId]);

  useEffect(() => {
    const root_ = root.current;
    const track = trackRef.current;
    if (!root_ || !track) return;

    /**
     * Absolute Dokumentposition einer Kachel im normalen Fluss.
     * Bewusst NICHT über `getBoundingClientRect()`: die Einblendung setzt
     * währenddessen ein `transform: translateY(80px)` auf die Karte, das dort
     * mitgemessen würde. Die Höhen der Vorgängerinnen sind davon unberührt.
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
      const y = Math.max(0, flowTopOf(card) - 96); // 96 = Nav + Luft
      const reduced = document.documentElement.dataset.reducedMotion === 'true';
      if (window.__lenis) {
        window.__lenis.scrollTo(y, { duration: reduced ? 0 : duration });
      } else {
        window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
      }
    };

    const ctx = gsap.context(() => {
      const cards = track.querySelectorAll('[data-phase-card]');
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 80, opacity: 0, rotate: i % 2 === 0 ? -1.5 : 1.5 },
          {
            y: 0,
            opacity: 1,
            rotate: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' },
          }
        );
      });
    }, root_);

    return () => {
      delete window.__scrollToPhase;
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} id="life" className="relative bg-paper text-ink">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 md:pt-28 pb-24 md:pb-32">
        <div className="md:grid md:grid-cols-12 md:gap-10">

          {/* Zähler — klebt auf allen Breiten. Mobil als kompakte dunkle
              Kachel oben rechts über den Karten (Wunsch Felix 02.08.2026),
              ab md ruhig in der rechten Spalte. Die Grid-Zelle streckt sich
              über die volle Zeilenhöhe; nur deshalb hat das sticky Laufweg. */}
          {/* `sticky` sitzt auf dem Grid-Element SELBST, nicht auf einem Kind:
              mobil ist dieser Container nur so hoch wie die Kachel, ein
              sticky Kind hätte darin praktisch keinen Laufweg. Ab md braucht
              es dafür `self-start`, sonst streckt das Grid die Zelle auf die
              volle Zeilenhöhe und das sticky greift wieder nicht. */}
          <div className="sticky top-20 z-30 pointer-events-none md:top-28 md:self-start md:col-span-4 md:col-start-9 md:row-start-1 pb-8 md:pb-0">
            {/* Mobil: große freie Zahl in der rechten oberen Ecke, ohne Band
                und ohne Hintergrund (Wunsch Felix 08/2026). Sie klebt die
                ganze Sektion über oben rechts und darf dabei über den
                Kacheltexten liegen; die Größe orientiert sich an den
                Deko-Ziffern unten rechts in den Kacheln. */}
            <div className="text-right md:text-left">
              <div className="flex items-baseline justify-end gap-1 md:justify-start">
                <span className="data-num text-ink text-3xl md:text-6xl">−</span>
                <span
                  ref={counterRef}
                  className="data-num text-pink-display text-[clamp(3.4rem,16vw,4.5rem)] md:text-7xl"
                >
                  {de1(baseGap)}
                </span>
                <span className="data-num text-ink text-3xl md:text-6xl">%</span>
              </div>
              <div className="text-[11px] text-ink/75 mt-1 md:mt-1.5 md:text-xs">der Männer-Rente</div>
            </div>
          </div>

          {/* Kacheln — untereinander, keine Überlappung */}
          <div
            ref={trackRef}
            className="relative md:col-span-7 md:col-start-1 md:row-start-1 flex flex-col gap-6 md:gap-8"
          >
            {lifePhases.map((phase, i) => (
              <article
                key={phase.id}
                data-phase-card
                data-phase-id={phase.id}
                className="relative scroll-mt-28 w-full bg-bone border border-clay-light/60 p-6 md:p-10 xl:p-12 rounded-sm flex flex-col overflow-hidden shadow-[0_30px_80px_-30px_rgba(42,33,27,0.35)]"
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

                <div className="mb-4 md:mb-6 space-y-3">
                  {asParagraphs(phase.body).map((p, j) => (
                    <p
                      key={j}
                      className="body-lead text-ink/70 max-w-2xl"
                      style={{ fontSize: 'clamp(0.95rem, 1vw, 1.3rem)' }}
                    >
                      {p}
                    </p>
                  ))}
                </div>

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
                      onClick={() => setExpandedId(expandedId === phase.id ? null : phase.id)}
                      aria-expanded={expandedId === phase.id}
                      data-cursor="link"
                      className="mt-5 inline-flex items-center gap-2 eyebrow text-clay-deep hover:text-ink transition-colors"
                    >
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-current text-[10px] leading-none">
                        {expandedId === phase.id ? '−' : '+'}
                      </span>
                      {expandedId === phase.id ? 'Weniger anzeigen' : 'Mehr erfahren'}
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

                {/* Aufklapp-Text — auf allen Breiten IM FLUSS, die Kachel
                    wächst also. Das frühere Overlay war nötig, solange die
                    Karten klebten; ohne Stapel gibt es keinen Grund mehr,
                    Julias langen Text in ein Scrollfenster zu sperren. */}
                {phase.details && (
                  <div
                    hidden={expandedId !== phase.id}
                    className="relative z-10 mt-5 md:mt-6 rounded-sm bg-ink text-paper p-6 md:p-8"
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
                    <div className="space-y-3 md:space-y-4">
                      {asParagraphs(phase.details).map((p, j) => (
                        <p
                          key={j}
                          className="body-lead text-paper/75"
                          style={{ fontSize: 'clamp(0.9rem, 0.9vw, 1.05rem)' }}
                        >
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
