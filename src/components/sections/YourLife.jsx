import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { lifePhases, lifeToggles } from '../../data/lifePhases';
import { useGap } from '../../hooks/useGapState';

gsap.registerPlugin(ScrollTrigger);

export default function YourLife() {
  const root = useRef(null);
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const counterRef = useRef(null);
  const [expandedId, setExpandedId] = useState(null);

  const { toggles, toggle, gap, baseGap } = useGap();

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
          counterRef.current.textContent = obj.v.toFixed(1);
          counterRef.current.dataset.current = obj.v;
        }
      },
    });
    return () => tween.kill();
  }, [gap]);

  // Set initial number on mount
  useEffect(() => {
    if (counterRef.current) {
      counterRef.current.textContent = baseGap.toFixed(1);
      counterRef.current.dataset.current = baseGap;
    }
  }, [baseGap]);

  // Horizontal scroll pin
  useEffect(() => {
    const root_ = root.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!root_ || !pin || !track) return;

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

    const cardTweens = [];
    const cards = track.querySelectorAll('[data-phase-card]');
    cards.forEach((card) => {
      cardTweens.push(
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
        )
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
      delete window.__scrollToPhase;
      cardTweens.forEach((t) => t.scrollTrigger?.kill());
      mainTween.scrollTrigger?.kill();
      mainTween.kill();
    };
  }, []);

  return (
    <section ref={root} id="life" className="relative bg-paper text-ink">
      <div ref={pinRef} className="relative h-[100svh] overflow-hidden">
        {/* Top bar — counter sits where the navbar was on mobile (navbar gone when in this section) */}
        <div className="absolute top-0 right-0 z-30 pt-5 pr-6 pb-4 md:pt-24 md:pr-10 pointer-events-none">
          <div className="flex items-baseline justify-end gap-1">
            <span className="data-num text-ink text-4xl md:text-6xl">−</span>
            <span ref={counterRef} className="data-num text-pink text-5xl md:text-7xl">{baseGap.toFixed(1)}</span>
            <span className="data-num text-ink text-4xl md:text-6xl">%</span>
          </div>
          <div className="text-xs font-mono text-ink/50 mt-1 text-right">der Männer-Rente</div>
        </div>

        {/* Horizontal track */}
        <div className="absolute inset-0 flex items-center pt-28 pb-48 md:pt-32 md:pb-36">
          <div ref={trackRef} className="flex gap-8 pl-6 md:pl-12 will-change-transform">
            {lifePhases.map((phase, i) => (
              <article
                key={phase.id}
                data-phase-card
                data-phase-id={phase.id}
                className="shrink-0 w-[78vw] md:w-[440px] xl:w-[520px] 2xl:w-[580px] bg-bone border border-clay-light/60 p-8 md:p-10 xl:p-12 rounded-sm relative flex flex-col overflow-hidden"
                style={{ minHeight: '50vh' }}
              >
                <div className="flex items-baseline justify-between mb-6">
                  <span className="eyebrow text-clay">{String(i + 1).padStart(2, '0')} / {String(lifePhases.length).padStart(2, '0')}</span>
                  <span className="font-mono text-xs text-ink/50">Alter {phase.age}</span>
                </div>

                <h3
                  className="display-lg text-ink mb-5"
                  style={{ fontSize: 'clamp(2rem, 3vw, 3rem)' }}
                >
                  {phase.title}
                </h3>

                <p
                  className="body-lead text-ink/70 mb-6"
                  style={{ fontSize: 'clamp(1.05rem, 1vw, 1.3rem)' }}
                >
                  {phase.body}
                </p>

                <div className="mt-auto pt-6 border-t border-clay-light/60">
                  <div className="eyebrow text-clay mb-2">Was zählt jetzt</div>
                  <p
                    className="text-ink/65 leading-relaxed"
                    style={{ fontSize: 'clamp(0.875rem, 0.85vw, 1.05rem)' }}
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
                      className="mt-5 inline-flex items-center gap-2 eyebrow text-pink hover:text-pink-deep transition-colors"
                    >
                      {phase.subpageLabel || 'Zur Themenseite'}
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                        <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  )}
                </div>

                {/* Decorative number */}
                <div
                  className="absolute -bottom-6 -right-2 display-italic text-clay-light/40 select-none pointer-events-none"
                  style={{ fontSize: '8rem', lineHeight: 1 }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Aufklapp-Overlay: legt sich über die Kachel, kein Layout-Shift im Pin */}
                <div
                  className={`absolute inset-0 z-10 bg-ink text-paper p-8 md:p-10 flex flex-col transition-all duration-500 ${
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

            {/* End spacer */}
            <div className="shrink-0 w-[20vw]" />
          </div>
        </div>

        {/* Bottom: Toggle pills */}
        <div className="absolute bottom-0 left-0 right-0 z-30 p-4 md:p-8 pointer-events-none flex justify-center md:justify-center">
          <div className="px-1 py-2 w-full md:w-fit pointer-events-auto">
            <span className="eyebrow text-ink/40 px-3 hidden md:inline">Tippe an, was auf dich zutrifft</span>
            {/* 2×2 grid on mobile, single row on desktop */}
            <div className="grid grid-cols-2 gap-2 md:flex md:flex-row md:items-center md:gap-2">
              {lifeToggles.map((t) => {
                const on = toggles[t.id];
                return (
                  <button
                    key={t.id}
                    onClick={() => toggle(t.id)}
                    data-cursor="toggle"
                    data-cursor-label={on ? '−' : '+'}
                    className={`group inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 ${
                      on
                        ? 'bg-pink text-ink shadow-[0_0_0_1px_var(--color-pink)]'
                        : 'bg-ink/10 text-ink hover:bg-ink/15'
                    }`}
                  >
                    <span className={`inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[10px] ${on ? 'bg-ink text-pink' : 'bg-ink/15'}`}>
                      {on ? '✓' : '+'}
                    </span>
                    <span>{t.label}</span>
                    <span className="font-mono opacity-60">{t.impact}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
