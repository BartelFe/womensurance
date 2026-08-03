import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGap } from '../../hooks/useGapState';
import { de1 } from '../../utils/format';
import { fuellen } from '../../lib/inhalt';
import startseite from '../../content/startseite.json';

export default function TheTruth() {
  const root = useRef(null);
  const numRef = useRef(null);
  const headRef = useRef(null);
  const subRef = useRef(null);
  const { gap, baseGap } = useGap();

  useEffect(() => {
    if (!numRef.current) return;
    numRef.current.textContent = de1(gap);
  }, [gap]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headLines = headRef.current.querySelectorAll('[data-line]');
      gsap.fromTo(
        headLines,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: root.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        subRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: subRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="bg-ink text-paper py-32 md:py-48 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Obergrenze 6,5rem, nicht 10rem wie früher: „Deine Rentenlücke:" ist
            sechs Zeichen länger als das frühere „Deine Lücke:". Ab ~104px
            Schriftgrad bricht „Aber sie ist kein Schicksal." in der 1152px
            breiten Spalte um — und ein Umbruch innerhalb einer `line-mask`
            zerlegt die zeilenweise Einblendung. */}
        <div ref={headRef} className="display-xl text-paper text-balance" style={{ fontSize: 'clamp(2.2rem, 7vw, 6.5rem)' }}>
          <span className="block line-mask"><span data-line>{startseite.lueckeZeile1}</span></span>
          {/* „durchschnittlich" steht immer da und in voller Schriftgröße
              (Wunsch Felix 02.08.2026) — also auch dann, wenn im Hero
              Lebensereignisse angeklickt sind und die Zahl über dem
              Basiswert liegt. `not-italic`, damit nur die Zahl kursiv bleibt. */}
          <span className="block line-mask">
            <span data-line>
              <span className="not-italic">{startseite.lueckeVorZahl} </span>
              <span ref={numRef} className="display-italic text-pink">{de1(gap)}</span>
              <span className="display-italic text-pink">&nbsp;%</span>
              <span>.</span>
            </span>
          </span>
          <span className="block line-mask">
            <span data-line className="text-paper">{startseite.lueckeZeile3}</span>
          </span>
        </div>

        <div
          ref={subRef}
          className="mt-12 max-w-xl body-lead text-paper/55"
          style={{ fontSize: 'clamp(1rem, 1.2vw, 1.2rem)' }}
        >
          {fuellen(startseite.lueckeText, { basiswert: de1(baseGap) })}
        </div>
      </div>

      {/* Decorative oversized text — Inhalt kommt per CSS, siehe globals.css */}
      <div
        aria-hidden="true"
        data-deko="Lücke"
        className="deko-wasserzeichen absolute -bottom-8 -right-8 display-italic text-paper/[0.025] select-none pointer-events-none"
        style={{ fontSize: '32vw', lineHeight: 0.8 }}
      />
    </section>
  );
}
