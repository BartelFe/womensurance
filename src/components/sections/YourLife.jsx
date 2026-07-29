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
 * Zwei Modi (gsap.matchMedia):
 *  - ab md: gepinnte Horizontal-Section wie gehabt.
 *  - mobil: KEIN Horizontal-Scroll (Wunsch Julia 07/2026) — die Kacheln
 *    stehen schlicht untereinander und faden beim Scrollen ein.
 */
export default function YourLife() {
  const root = useRef(null);
  const pinRef = useRef(null);
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
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!root_ || !pin || !track) return;

    const mm = gsap.matchMedia();

    // ── Desktop / Tablet: gepinnter Horizontal-Scroll ──
    mm.add('(min-width: 768px)', () => {
      const scrollDistance = () => track.scrollWidth - window.innerWidth + 200;

      const mainTween = gsap.to(track, {
        x: () => -scrollDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root_,
          start: 'top top',
          end: () => `+=${scrollDistance() + window.innerHeight}`,
          scrub: 1,
          pin,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const cards = track.querySelectorAll('[data-phase-card]');
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0.3, scale: 0.94 },
          {
            opacity: 1,
            scale: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'left 80%',
              end: 'left 30%',
              scrub: 0.5,
              containerAnimation: mainTween,
            },
          }
        );
      });

      // Nav-Dropdown kann gezielt zu einer Kachel springen
      window.__scrollToPhase = (phaseId) => {
        const st = mainTween.scrollTrigger;
        const card = track.querySelector(`[data-phase-id="${phaseId}"]`);
        if (!st || !card) return;
        const ratio = Math.max(0, Math.min(1, (card.offsetLeft - 48) / scrollDistance()));
        const y = st.start + ratio * (st.end - st.start);
        if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.6 });
        else window.scrollTo({ top: y, behavior: 'smooth' });
      };

      return () => {
        gsap.set(track, { clearProps: 'transform' });
      };
    });

    // ── Mobil: gestapelt, kein Pin, kein Horizontal-Scroll ──
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

      // Nav-Dropdown: schlicht zur Kachel scrollen
      window.__scrollToPhase = (phaseId) => {
        const card = track.querySelector(`[data-phase-id="${phaseId}"]`);
        if (!card) return;
        const y = card.getBoundingClientRect().top + window.scrollY - 80;
        if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.2 });
        else window.scrollTo({ top: y, behavior: 'smooth' });
      };
    });

    return () => {
      delete window.__scrollToPhase;
      mm.revert();
    };
  }, []);

  return (
    <section ref={root} id="life" className="relative bg-paper text-ink">
      <div ref={pinRef} className="relative md:h-[100svh] md:overflow-hidden pt-20 pb-20 md:py-0">
        {/* Zähler — mobil im Fluss, ab md oben rechts über den Karten.
            Der Desktop-Abstand nach oben ist bewusst großzügig, damit die
            Zahl nie über den Kacheln liegt. */}
        <div className="relative md:absolute md:top-0 md:right-0 z-30 px-6 md:px-0 md:pt-20 md:pr-10 pb-8 md:pb-0 pointer-events-none">
          <div className="flex items-baseline justify-end gap-1">
            <span className="data-num text-ink text-4xl md:text-6xl">−</span>
            <span ref={counterRef} className="data-num text-pink text-5xl md:text-7xl">{de1(baseGap)}</span>
            <span className="data-num text-ink text-4xl md:text-6xl">%</span>
          </div>
          <div className="text-xs text-ink/50 mt-1 text-right">der Männer-Rente</div>
        </div>

        {/* Track: ab md horizontal + volle Höhe, mobil einfach untereinander */}
        <div className="md:absolute md:inset-0 md:flex md:items-stretch md:pt-52 md:pb-12">
          <div
            ref={trackRef}
            className="flex flex-col md:flex-row gap-6 md:gap-8 px-6 md:px-0 md:pl-12 md:h-full md:items-stretch md:will-change-transform"
          >
            {lifePhases.map((phase, i) => (
              <article
                key={phase.id}
                data-phase-card
                data-phase-id={phase.id}
                className="shrink-0 w-full md:w-[440px] xl:w-[520px] 2xl:w-[580px] md:h-full bg-bone border border-clay-light/60 p-6 md:p-10 xl:p-12 rounded-sm relative flex flex-col overflow-hidden"
              >
                <div className="mb-4 md:mb-6">
                  <span className="text-xs text-ink/50">Alter {phase.age}</span>
                </div>

                <h3
                  className="display-lg text-ink mb-3 md:mb-5"
                  style={{ fontSize: 'clamp(1.6rem, 3vw, 3rem)' }}
                >
                  {phase.title}
                </h3>

                <p
                  className="body-lead text-ink/70 mb-4 md:mb-6"
                  style={{ fontSize: 'clamp(0.95rem, 1vw, 1.3rem)' }}
                >
                  {phase.body}
                </p>

                <div className="mt-auto pt-4 md:pt-6 border-t border-clay-light/60">
                  <div className="eyebrow text-clay mb-1.5 md:mb-2">Was zählt jetzt</div>
                  <p
                    className="text-ink/65 leading-relaxed"
                    style={{ fontSize: 'clamp(0.8rem, 0.85vw, 1.05rem)' }}
                  >
                    {phase.insurance}
                  </p>

                  {/* Aufklappen (Karten mit Zusatztext) oder Unterseite (Teilzeit/Scheidung) */}
                  {phase.details && (
                    <button
                      onClick={() => setExpandedId(phase.id)}
                      data-cursor="link"
                      className="mt-5 inline-flex items-center gap-2 eyebrow text-clay hover:text-pink transition-colors"
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
                      <svg width="15" height="15" viewBox="0 0 14 14" fill="none" className="shrink-0 transition-transform duration-300 group-hover:translate-x-1">
                        <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  )}
                </div>

                {/* Deko-Ziffer — auch mobil sichtbar (kleiner, damit sie die
                    Buttons nur leicht überlagert) */}
                <div
                  className="absolute -bottom-5 -right-1 md:-bottom-6 md:-right-2 display-italic text-clay-light/40 select-none pointer-events-none"
                  style={{ fontSize: 'clamp(4.5rem, 15vw, 8rem)', lineHeight: 1 }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Aufklapp-Overlay: legt sich über die Kachel, kein Layout-Shift im Pin */}
                <div
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
                      className="text-paper/50 hover:text-pink text-2xl leading-none -mt-1"
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

            {/* End spacer — nur im Horizontal-Modus nötig */}
            <div className="hidden md:block shrink-0 w-[20vw]" />
          </div>
        </div>
      </div>
    </section>
  );
}
