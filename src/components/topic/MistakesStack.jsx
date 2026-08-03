import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Satz } from '../../lib/inhalt';

gsap.registerPlugin(ScrollTrigger);

// "5 Fehler, die viele Frauen nach einer Scheidung erst zu spät bemerken"
// — Sticky-Stack (gleiche Mechanik wie TheMethod auf der Startseite).
// Texte von Julia; sie liegen seit der CMS-Anbindung im Redaktionssystem und
// kommen als Props von `pages/Scheidung.jsx`.
// `merksatz` ist ein ganzer Satz, kein Kürzel — deshalb steht er nicht als
// `eyebrow` in Versalien, sondern in normaler Schreibweise.


export default function MistakesStack({ ueberschrift, eintraege = [] }) {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = root.current.querySelectorAll('[data-mistake-card]');

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
            scrollTrigger: {
              trigger: card,
              start: 'top 78%',
              toggleActions: 'play none none reverse',
            },
          }
        );

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
    <section ref={root} className="bg-paper text-ink py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Eine Stufe kleiner als früher: die Überschrift ist jetzt gut doppelt
            so lang und stand bei 4,2rem vierzeilig über der halben Sektion. */}
        <h2 className="display-lg text-ink text-balance mb-16 md:mb-20" style={{ fontSize: 'clamp(1.7rem, 3.2vw, 3.2rem)' }}>
          <Satz teile={ueberschrift} grund="hell" />
        </h2>

        <div className="space-y-6 md:space-y-8 max-w-4xl">
          {eintraege.map((m, i) => (
            <article
              key={m.titel}
              data-mistake-card
              className="relative bg-bone text-ink rounded-sm p-6 md:p-12 border border-clay-light shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)]"
            >
              <div className="grid grid-cols-12 gap-4 md:gap-8 items-start">
                <div className="col-span-12 md:col-span-2">
                  <div className="display-italic text-pink-display" style={{ fontSize: 'clamp(2.2rem, 5vw, 5rem)', lineHeight: 0.9 }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                </div>
                <div className="col-span-12 md:col-span-10">
                  <h3 className="display-lg text-ink mb-2 text-balance" style={{ fontSize: 'clamp(1.4rem, 2.2vw, 2.2rem)' }}>
                    {m.titel}
                  </h3>
                  {/* Braun statt Pink: #ff2e88 schafft auf hellem Grund maximal
                      3,5:1, kleiner Text braucht 4,5:1. Statt eines abgedunkelten
                      Pinks nehmen wir hier das Palettenbraun (Wunsch Felix
                      02.08.2026), siehe YourLife.jsx. */}
                  <p
                    className="font-medium text-clay-deep mb-4 max-w-2xl"
                    style={{ fontSize: 'clamp(0.95rem, 1.1vw, 1.1rem)' }}
                  >
                    {m.merksatz}
                  </p>
                  <p className="body-lead text-ink/75 max-w-2xl">{m.body}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-10 text-[12px] text-ink/75 leading-relaxed max-w-2xl">
          Hinweis: Jede Scheidung ist individuell. Die genannten Beispiele dienen
          der ersten Orientierung und ersetzen keine Rechtsberatung. Ich
          unterstütze dich dabei, die Auswirkungen auf deine Altersvorsorge und
          Versicherungen verständlich einzuordnen.
        </p>
      </div>
    </section>
  );
}
