import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGap } from '../../hooks/useGapState';

export default function TheTruth() {
  const root = useRef(null);
  const numRef = useRef(null);
  const headRef = useRef(null);
  const subRef = useRef(null);
  const { gap } = useGap();

  useEffect(() => {
    if (!numRef.current) return;
    numRef.current.textContent = gap.toFixed(1);
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
        <div className="eyebrow text-paper/40 mb-10">Akt 03 · Die Wahrheit</div>

        <div ref={headRef} className="display-xl text-paper text-balance" style={{ fontSize: 'clamp(2.6rem, 9vw, 10rem)' }}>
          <span className="block line-mask"><span data-line>Deine Lücke:</span></span>
          <span className="block line-mask">
            <span data-line>
              <span ref={numRef} className="display-italic text-pink">{gap.toFixed(1)}</span>
              <span className="display-italic text-pink">&nbsp;%</span>
            </span>
          </span>
          <span className="block line-mask">
            <span data-line className="text-paper/60">Aber sie ist kein Schicksal.</span>
          </span>
        </div>

        <div
          ref={subRef}
          className="mt-12 max-w-xl body-lead text-paper/55"
          style={{ fontSize: 'clamp(1rem, 1.2vw, 1.2rem)' }}
        >
          Diese Zahl ist eine Statistik. Was sie für dich bedeutet — wie groß deine individuelle Lücke wirklich ist, und was du jetzt konkret tun kannst, erfährst du in einem kostenlosen Talk mit mir.
        </div>
      </div>

      {/* Decorative oversized text */}
      <div
        className="absolute -bottom-8 -right-8 display-italic text-paper/[0.025] select-none pointer-events-none"
        style={{ fontSize: '32vw', lineHeight: 0.8 }}
      >
        Lücke
      </div>
    </section>
  );
}
