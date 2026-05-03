import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '../ui/MagneticButton';

export default function TheStep() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headLines = root.current.querySelectorAll('[data-line]');
      gsap.fromTo(
        headLines,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: 'expo.out',
          scrollTrigger: { trigger: root.current, start: 'top 70%' },
        }
      );

      const cta = root.current.querySelector('[data-cta]');
      gsap.fromTo(
        cta,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: cta, start: 'top 80%' },
        }
      );

      // Pulsing background circle
      const orb = root.current.querySelector('[data-orb]');
      if (orb) {
        gsap.to(orb, {
          scale: 1.15,
          opacity: 0.7,
          duration: 4,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        });
      }
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="step"
      className="relative bg-ink text-paper overflow-hidden py-32 md:py-48 px-6 md:px-12"
    >
      <div data-orb className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] md:w-[80vw] md:h-[80vw] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,46,136,0.18) 0%, transparent 60%)' }}
      />

      <div className="relative max-w-6xl mx-auto text-center">
        <div className="eyebrow text-paper/40 mb-10 inline-flex items-center gap-3">
          <span className="h-px w-8 bg-paper/30" />
          Akt 07 · Der Schritt
          <span className="h-px w-8 bg-paper/30" />
        </div>

        <h2 className="display-xl text-paper text-balance" style={{ fontSize: 'clamp(2.6rem, 9vw, 10rem)' }}>
          <span className="block line-mask"><span data-line>30 Minuten.</span></span>
          <span className="block line-mask"><span data-line>Kostenlos.</span></span>
          <span className="block line-mask"><span data-line className="display-italic text-pink">Auf Augenhöhe.</span></span>
        </h2>

        <p className="mt-12 max-w-xl mx-auto body-lead text-paper/55">
          Wenn nach diesem Gespräch klar ist, dass wir nicht passen — auch okay. Aber du gehst mit drei Sachen raus, die du vorher nicht hattest: Klarheit, eine erste Strategie und keine Verkaufsversuche.
        </p>

        <div data-cta className="mt-12 flex flex-col items-center gap-6">
          <MagneticButton
            href="https://outlook.office.com/book/Womensurance@dvm.de/?ismsaljsauthenabled"
            target="_blank"
            variant="pink"
          >
            <span className="font-medium tracking-wide">Erstgespräch buchen</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </MagneticButton>

          <div className="eyebrow text-paper/30 mt-2">Kein Anruf · Direkt im Outlook-Kalender</div>
        </div>
      </div>
    </section>
  );
}
