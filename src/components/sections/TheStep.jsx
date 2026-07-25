import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '../ui/MagneticButton';
import { BOOKING_URL, SOCIALS } from '../../config/site';

const SOCIAL_ICONS = {
  instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
  tiktok: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.6 3c.4 2.1 1.8 3.7 3.9 4v3c-1.5 0-2.9-.5-3.9-1.3v6.6c0 3.4-2.7 6.2-6.1 6.2S4.4 18.7 4.4 15.3c0-3.3 2.6-6 5.9-6.2v3.1c-1.6.2-2.8 1.5-2.8 3.1 0 1.7 1.4 3.1 3 3.1s3-1.4 3-3.1V3h3.1z" />
    </svg>
  ),
  linkedin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.25h4.56V23H.22V8.25zM8.34 8.25h4.37v2.02h.06c.61-1.15 2.1-2.37 4.32-2.37 4.62 0 5.47 3.04 5.47 7v8.1h-4.55v-7.18c0-1.71-.03-3.91-2.38-3.91-2.39 0-2.75 1.86-2.75 3.78V23H8.34V8.25z" />
    </svg>
  ),
};

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
          <span className="block line-mask"><span data-line>30 Minuten.</span></span>
          <span className="block line-mask"><span data-line>Kostenlos.</span></span>
          <span className="block line-mask"><span data-line className="display-italic text-pink">Auf Augenhöhe.</span></span>
        </h2>

        <p className="mt-12 max-w-xl mx-auto body-lead text-paper/55">
          Wenn nach diesem Gespräch klar ist, dass wir nicht passen — auch okay. Aber du gehst mit Klarheit und den nächsten relevanten Schritten raus.
        </p>

        <div data-cta className="mt-12 flex flex-col items-center gap-6">
          <MagneticButton href={BOOKING_URL} target="_blank" variant="pink">
            <span className="font-medium tracking-wide">Erstgespräch buchen</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </MagneticButton>

          {/* Social Media — sichtbar unter dem CTA */}
          <div className="mt-6 flex flex-col items-center gap-4">
            <div className="eyebrow text-paper/40">Oder folge mir</div>
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
