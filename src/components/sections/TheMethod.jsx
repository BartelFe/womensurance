import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { methodSteps } from '../../data/methodSteps';

export default function TheMethod() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = root.current.querySelectorAll('[data-method-card]');

      cards.forEach((card, i) => {
        // Each card stacks on top of the previous as it enters
        gsap.fromTo(
          card,
          { y: 80, opacity: 0, rotate: i % 2 === 0 ? -1.5 : 1.5 },
          {
            y: 0,
            opacity: 1,
            rotate: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 78%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Slight scale-down for previous cards as new ones enter
        if (i > 0) {
          const prevCards = Array.from(cards).slice(0, i);
          gsap.to(prevCards, {
            scale: (idx) => 1 - (i - idx) * 0.02,
            yPercent: (idx) => -(i - idx) * 4,
            scrollTrigger: {
              trigger: card,
              start: 'top 70%',
              end: 'top 30%',
              scrub: 0.6,
            },
          });
        }
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="method" className="bg-ink text-paper py-32 md:py-48 px-6 md:px-12 relative">
      <div className="max-w-6xl mx-auto">
        <div className="eyebrow text-paper/40 mb-6">Akt 05 · Mein Weg</div>
        <h2 className="display-lg text-paper text-balance mb-20" style={{ fontSize: 'clamp(2.4rem, 5vw, 5rem)' }}>
          4 Schritte. <span className="display-italic text-pink">Ein Konzept.</span>
        </h2>

        <div className="space-y-6 md:space-y-8 max-w-4xl">
          {methodSteps.map((step) => (
            <article
              key={step.n}
              data-method-card
              className="group relative bg-paper text-ink rounded-sm p-8 md:p-12 border border-clay-light shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]"
            >
              {/* Mobil gestapelt (Nummer über Titel), Desktop nebeneinander */}
              <div className="grid grid-cols-12 gap-4 md:gap-8 items-start">
                <div className="col-span-12 md:col-span-2">
                  <div
                    className="display-italic text-pink"
                    style={{ fontSize: 'clamp(2.4rem, 5vw, 5rem)', lineHeight: 0.9 }}
                  >
                    {step.n}
                  </div>
                </div>
                <div className="col-span-12 md:col-span-10">
                  <h3
                    className="display-lg text-ink mb-4 text-balance"
                    style={{ fontSize: 'clamp(1.5rem, 2.4vw, 2.4rem)' }}
                  >
                    {step.title}
                  </h3>
                  <p className="body-lead text-ink/65 max-w-2xl">{step.body}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
