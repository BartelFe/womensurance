import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGap } from '../../hooks/useGapState';
import { de1 } from '../../utils/format';

export default function TheTruth() {
  const root = useRef(null);
  const numRef = useRef(null);
  const headRef = useRef(null);
  const subRef = useRef(null);
  const { gap, baseGap, activeMeta } = useGap();
  // „durchschnittlich" stimmt nur, solange niemand ein Lebensereignis
  // angeklickt hat — danach steht dort die personalisierte Zahl.
  const istDurchschnitt = activeMeta.length === 0;

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
        {/* Schriftgröße bewusst kleiner als früher: „Deine Rentenlücke:" ist
            sechs Zeichen länger als das frühere „Deine Lücke:" und würde bei
            10rem aus dem Container laufen (line-mask kappt per overflow). */}
        {/* Obergrenze 6,5rem, nicht 10rem wie früher: „Deine Rentenlücke:" ist
            sechs Zeichen länger als das frühere „Deine Lücke:". Ab ~104px
            Schriftgrad bricht „Aber sie ist kein Schicksal." in der 1152px
            breiten Spalte um — und ein Umbruch innerhalb einer `line-mask`
            zerlegt die zeilenweise Einblendung. */}
        <div ref={headRef} className="display-xl text-paper text-balance" style={{ fontSize: 'clamp(2.2rem, 7vw, 6.5rem)' }}>
          <span className="block line-mask"><span data-line>Deine Rentenlücke:</span></span>
          <span className="block line-mask">
            <span data-line>
              {istDurchschnitt && (
                <span className="not-italic text-paper/70" style={{ fontSize: '0.4em' }}>
                  durchschnittlich{' '}
                </span>
              )}
              <span ref={numRef} className="display-italic text-pink">{de1(gap)}</span>
              <span className="display-italic text-pink">&nbsp;%</span>
              <span>.</span>
            </span>
          </span>
          <span className="block line-mask">
            <span data-line className="text-paper">Aber sie ist kein Schicksal.</span>
          </span>
        </div>

        <div
          ref={subRef}
          className="mt-12 max-w-xl body-lead text-paper/55"
          style={{ fontSize: 'clamp(1rem, 1.2vw, 1.2rem)' }}
        >
          Die {de1(baseGap)} % sind ein Durchschnittswert. Wie groß deine
          persönliche Rentenlücke tatsächlich ist, hängt von deiner individuellen
          Lebenssituation ab. Gemeinsam finden wir heraus, was diese Zahl für
          dich bedeutet und welche Möglichkeiten du hast, schon heute
          gegenzusteuern.
        </div>
      </div>

      {/* Decorative oversized text */}
      <div
        aria-hidden="true"
        className="absolute -bottom-8 -right-8 display-italic text-paper/[0.025] select-none pointer-events-none"
        style={{ fontSize: '32vw', lineHeight: 0.8 }}
      >
        Lücke
      </div>
    </section>
  );
}
