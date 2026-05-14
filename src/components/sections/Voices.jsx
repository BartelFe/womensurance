import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { voices } from '../../data/voices';

export default function Voices() {
  const root = useRef(null);

  useEffect(() => {
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

  return (
    <section ref={root} id="voices" className="bg-paper text-ink relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-12">
        <div className="eyebrow text-clay mb-6">Akt 06 · Stimmen</div>
        <h2 className="display-lg text-ink text-balance" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4.5rem)' }}>
          Drei Frauen. Drei <span className="display-italic text-pink">Geschichten.</span>
        </h2>
      </div>

      <div className="divide-y divide-clay-light/60">
        {voices.map((v, i) => (
          <article key={v.id} data-voice className="py-20 md:py-28">
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-12 gap-6 md:gap-10">
              <div data-voice-idx className="col-span-12 md:col-span-2">
                <div
                  className="display-italic text-pink"
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
                <div className="text-sm text-ink/60 mb-4">{v.role} · {v.age}, {v.location}</div>
                <div className="eyebrow text-clay mb-2">Kontext</div>
                <div className="text-xs font-mono text-ink/55 leading-relaxed">{v.context}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
