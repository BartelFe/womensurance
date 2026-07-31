import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '../ui/MagneticButton';
import { SOCIAL_ICONS } from '../ui/SocialIcons';
import { BOOKING_URL, SOCIALS, CALL_MINUTES } from '../../config/site';

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
        style={{ background: 'radial-gradient(circle, rgb(var(--pink-rgb) / 0.18) 0%, transparent 60%)' }}
      />

      <div className="relative max-w-6xl mx-auto text-center">
        <h2 className="display-xl text-paper text-balance" style={{ fontSize: 'clamp(2.6rem, 9vw, 10rem)' }}>
          <span className="block line-mask"><span data-line>{CALL_MINUTES} Minuten.</span></span>
          <span className="block line-mask"><span data-line>Kostenlos.</span></span>
          <span className="block line-mask"><span data-line className="display-italic text-pink">Auf Augenhöhe.</span></span>
        </h2>

        <p className="mt-12 max-w-xl mx-auto body-lead text-paper/55">
          Wenn nach diesem Gespräch klar ist, dass wir nicht passen — auch okay. Aber du gehst mit Klarheit und den nächsten relevanten Schritten raus.
        </p>

        <div data-cta className="mt-12 flex flex-col items-center gap-6">
          <MagneticButton href={BOOKING_URL} target="_blank" variant="pink">
            <span className="font-medium tracking-wide">Erstgespräch buchen</span>
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </MagneticButton>

          {/* Social Media — sichtbar unter dem CTA */}
          <div className="mt-6 flex flex-col items-center gap-4">
            <div className="eyebrow text-paper/55">Oder folge mir</div>
            <div className="flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="w-12 h-12 rounded-full border border-paper/25 text-paper/70 hover:border-pink hover:text-pink transition-colors flex items-center justify-center"
                >
                  {SOCIAL_ICONS[s.id]}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
