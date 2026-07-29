import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// "Die 5 teuersten Fehler im Versorgungsausgleich" — Sticky-Stack
// (gleiche Mechanik wie TheMethod auf der Startseite).
// ⚠️ €-Größenordnungen = illustrative Beispiele, mit Julia validieren.

const MISTAKES = [
  {
    n: '01',
    title: 'Die eigenen Anrechte nicht kennen',
    cost: 'Klarheit fehlt genau dann, wenn sie zählt',
    body: 'Die alte Betriebsrente aus dem Job vor zehn Jahren, die kleine private Police aus den Zwanzigern: Wer die eigene Aufstellung nicht kennt, kann auch nicht einschätzen, was der Ausgleich für sie bedeutet — und was danach an eigener Vorsorge übrig bleibt.',
  },
  {
    n: '02',
    title: 'Auskünfte ungeprüft übernehmen',
    cost: 'fünfstellige Abweichungen möglich',
    body: 'Die Versorgungsträger melden dem Gericht Werte — und niemand prüft nach. Falsche Ehezeitanteile, veraltete Bewertungen, Rechenfehler: Was im Beschluss steht, ist später kaum noch zu korrigieren.',
  },
  {
    n: '03',
    title: 'Pauschal auf den Ausgleich verzichten',
    cost: 'der teuerste Einzelfehler',
    body: '"Jeder behält seins" klingt nach einem fairen, schnellen Frieden. Aber wer jahrelang für die Familie zurückgesteckt hat, verzichtet damit auf genau die Jahre, die der Ausgleich ausgleichen sollte.',
  },
  {
    n: '04',
    title: 'Übertragene Anrechte schlecht anlegen',
    cost: 'Rendite-Verlust über Jahrzehnte',
    body: 'Bei der externen Teilung wird Kapital übertragen — und du entscheidest, wohin. Wer es unbesehen in den erstbesten Vertrag lenkt, verliert über zwanzig, dreißig Jahre bares Geld.',
  },
  {
    n: '05',
    title: 'Nach der Scheidung nichts anpassen',
    cost: 'das neue Leben, unversichert',
    body: 'Begünstigte in alten Verträgen, gemeinsame Policen, fehlende eigene Absicherung: Wer nach dem Beschluss die Ordner zuklappt, zahlt später — oder die falsche Person bekommt im Ernstfall das Geld.',
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
        <div className="eyebrow text-clay mb-4">Aus der Praxis</div>
        <h2 className="display-lg text-ink text-balance mb-16 md:mb-20" style={{ fontSize: 'clamp(1.9rem, 4.2vw, 4.2rem)' }}>
          Die 5 teuersten Fehler im{' '}
          <span className="display-italic text-pink">Versorgungsausgleich.</span>
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
                  <div className="display-italic text-pink" style={{ fontSize: 'clamp(2.2rem, 5vw, 5rem)', lineHeight: 0.9 }}>
                    {m.n}
                  </div>
                </div>
                <div className="col-span-12 md:col-span-10">
                  <h3 className="display-lg text-ink mb-2 text-balance" style={{ fontSize: 'clamp(1.4rem, 2.2vw, 2.2rem)' }}>
                    {m.title}
                  </h3>
                  <div className="eyebrow text-pink-deep mb-4">{m.cost}</div>
                  <p className="body-lead text-ink/65 max-w-2xl">{m.body}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-10 text-[12px] text-ink/35 leading-relaxed max-w-2xl">
          * Größenordnungen aus typischen Fallkonstellationen — dein Fall ist individuell.
          Keine Rechtsberatung; wir schauen auf die Vorsorge-Seite.
        </p>
      </div>
    </section>
  );
}
