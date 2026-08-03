import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { voices } from '../../data/voices';
import { Satz, zahlwort } from '../../lib/inhalt';
import startseite from '../../content/startseite.json';

export default function Voices() {
  const root = useRef(null);

  useEffect(() => {
    // Ohne veröffentlichte Stimmen rendert die Sektion nichts, dann gibt es
    // auch nichts zu animieren.
    if (!root.current) return undefined;

    const ctx = gsap.context(() => {
      const items = root.current.querySelectorAll('[data-voice]');
      items.forEach((item) => {
        const quote = item.querySelector('[data-voice-quote]');
        const meta = item.querySelector('[data-voice-meta]');
        const idx = item.querySelector('[data-voice-idx]');

        gsap.fromTo(
          [idx, quote, meta],
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // Solange keine echte Kundinnenstimme veröffentlicht ist, entfällt die
  // Sektion ersatzlos. Ein Platzhalter wäre hier keine Option: erfundene
  // Bewertungen sind wettbewerbsrechtlich angreifbar (§ 5b Abs. 3 UWG).
  if (!voices.length) return null;

  return (
    <section ref={root} id="voices" className="bg-paper text-ink relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-12">
        <h2 className="display-lg text-ink text-balance" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4.5rem)' }}>
          <Satz
            teile={startseite.stimmenUeberschrift}
            werte={{ anzahl: zahlwort(voices.length) }}
            grund="hell"
          />
        </h2>
      </div>

      <div className="divide-y divide-clay-light/60">
        {voices.map((v, i) => (
          <article key={v.id} data-voice className="py-20 md:py-28">
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-12 gap-6 md:gap-10">
              <div data-voice-idx className="col-span-12 md:col-span-2">
                <div
                  className="display-italic text-pink-display"
                  style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', lineHeight: 0.9 }}
                >
                  №{String(i + 1).padStart(2, '0')}
                </div>
              </div>

              <blockquote
                data-voice-quote
                className="col-span-12 md:col-span-7 display-lg text-ink text-balance"
                style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2.6rem)', lineHeight: 1.18 }}
              >
                <span className="display-italic text-clay opacity-60 mr-1">&ldquo;</span>
                {v.quote}
                <span className="display-italic text-clay opacity-60 ml-1">&rdquo;</span>
              </blockquote>

              <div data-voice-meta className="col-span-12 md:col-span-3 md:pl-6 md:border-l border-clay-light/80">
                <div className="font-medium text-ink mb-1">{v.name}</div>
                <div className="text-sm text-ink/75 mb-4">{v.role} · {v.age}, {v.location}</div>
                <div className="eyebrow text-clay-deep mb-2">Kontext</div>
                <div className="text-xs text-ink/75 leading-relaxed">{v.context}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
