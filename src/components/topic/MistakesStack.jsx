import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// "5 Fehler, die viele Frauen nach einer Scheidung erst zu spät bemerken"
// — Sticky-Stack (gleiche Mechanik wie TheMethod auf der Startseite).
// ✅ Texte von Julia, eingepflegt 02.08.2026.
// `cost` ist jetzt ein ganzer Merksatz, kein Kürzel — deshalb steht er
// nicht mehr als `eyebrow` in Versalien, sondern in normaler Schreibweise.

const MISTAKES = [
  {
    n: '01',
    title: 'Die eigenen Rentenansprüche nicht kennen',
    cost: 'Wer seine Ansprüche nicht kennt, kann keine guten Entscheidungen treffen.',
    body: 'Viele Frauen haben neben der gesetzlichen Rente weitere Rentenansprüche, zum Beispiel aus einer betrieblichen Altersvorsorge oder einer privaten Rentenversicherung. Nur wenn alle Ansprüche bekannt sind, lässt sich einschätzen, welche Auswirkungen der Versorgungsausgleich auf die eigene Altersvorsorge hat.',
  },
  {
    n: '02',
    title: 'Den Versorgungsausgleich nicht verstehen',
    cost: 'Nicht alles sollte ungeprüft unterschrieben werden.',
    body: 'Der Versorgungsausgleich ist komplex und für viele schwer nachvollziehbar. Deshalb lohnt es sich, die Berechnungen und die berücksichtigten Rentenansprüche genau zu verstehen. Nur so weißt du, welche Auswirkungen die Aufteilung auf deine spätere Altersvorsorge hat.',
  },
  {
    n: '03',
    title: 'Die eigene Vorsorge nach der Scheidung nicht neu planen',
    cost: 'Der Versorgungsausgleich ersetzt keine Altersvorsorge.',
    body: 'Der Versorgungsausgleich regelt die während der Ehe erworbenen Rentenansprüche. Er ersetzt jedoch nicht die Vorsorge für die Zukunft. Gerade nach einer Scheidung lohnt es sich, die eigene Altersvorsorge an die neue Lebenssituation anzupassen.',
  },
  {
    n: '04',
    title: 'Übertragene Ansprüche nicht überprüfen',
    cost: 'Die neue Lebenssituation braucht eine neue Strategie.',
    body: 'Nach einer Scheidung verändern sich Ziele, Einkommen und Zukunftspläne. Deshalb sollte geprüft werden, ob bestehende Vorsorgelösungen noch zur eigenen Situation passen oder angepasst werden sollten.',
  },
  {
    n: '05',
    title: 'Versicherungen nach der Scheidung nicht aktualisieren',
    cost: 'Ein neuer Lebensabschnitt braucht auch eine neue Absicherung.',
    body: 'Bezugsberechtigungen, gemeinsame Verträge oder veränderte Lebensumstände sollten nach einer Scheidung überprüft und angepasst werden. So stellst du sicher, dass deine Absicherung auch weiterhin zu deinem Leben passt.',
  },
];

export default function MistakesStack() {
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
          5 Fehler, die viele Frauen nach einer Scheidung{' '}
          <span className="display-italic text-pink-display">erst zu spät bemerken.</span>
        </h2>

        <div className="space-y-6 md:space-y-8 max-w-4xl">
          {MISTAKES.map((m) => (
            <article
              key={m.n}
              data-mistake-card
              className="relative bg-bone text-ink rounded-sm p-6 md:p-12 border border-clay-light shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)]"
            >
              <div className="grid grid-cols-12 gap-4 md:gap-8 items-start">
                <div className="col-span-12 md:col-span-2">
                  <div className="display-italic text-pink-display" style={{ fontSize: 'clamp(2.2rem, 5vw, 5rem)', lineHeight: 0.9 }}>
                    {m.n}
                  </div>
                </div>
                <div className="col-span-12 md:col-span-10">
                  <h3 className="display-lg text-ink mb-2 text-balance" style={{ fontSize: 'clamp(1.4rem, 2.2vw, 2.2rem)' }}>
                    {m.title}
                  </h3>
                  {/* Braun statt Pink: #ff2e88 schafft auf hellem Grund maximal
                      3,5:1, kleiner Text braucht 4,5:1. Statt eines abgedunkelten
                      Pinks nehmen wir hier das Palettenbraun (Wunsch Felix
                      02.08.2026), siehe YourLife.jsx. */}
                  <p
                    className="font-medium text-clay-deep mb-4 max-w-2xl"
                    style={{ fontSize: 'clamp(0.95rem, 1.1vw, 1.1rem)' }}
                  >
                    {m.cost}
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
