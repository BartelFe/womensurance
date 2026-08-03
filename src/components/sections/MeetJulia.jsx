import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Satz, Bild, fuellen } from '../../lib/inhalt';
import { CALL_MINUTES } from '../../config/site';
import julia from '../../content/julia.json';

gsap.registerPlugin(ScrollTrigger);

export default function MeetJulia() {
  const root = useRef(null);

  useEffect(() => {
    const root_ = root.current;
    if (!root_) return;

    const images = root_.querySelectorAll('[data-image]');
    const imageTriggers = [];
    images.forEach((img) => {
      const t = gsap.fromTo(
        img,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.4,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: img,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
      imageTriggers.push(t);
    });

    const quote = root_.querySelector('[data-quote]');
    if (quote) {
      gsap.fromTo(
        quote,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: quote, start: 'top 80%' },
        }
      );
    }

    const bioPars = root_.querySelectorAll('[data-bio] p');
    if (bioPars.length) {
      gsap.fromTo(
        bioPars,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: root_.querySelector('[data-bio]'), start: 'top 75%' },
        }
      );
    }

    return () => {
      imageTriggers.forEach((t) => t.scrollTrigger?.kill());
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger && root_.contains(st.trigger)) st.kill();
      });
    };
  }, []);

  return (
    <section ref={root} id="julia" className="bg-paper text-ink overflow-hidden">

      {/* ── Part 1: Identity ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-24 md:pt-36 pb-0">
        <div className="grid md:grid-cols-12 gap-6 md:gap-10 items-start">

          {/* Left: Giant name + quote */}
          <div className="md:col-span-6 lg:col-span-7 flex flex-col justify-between md:pb-0">
            <div>
              <div
                className="display-italic text-pink-display leading-none"
                style={{ fontSize: 'clamp(6rem, 14vw, 16rem)', letterSpacing: '-0.03em' }}
              >
                {julia.vorname}
              </div>

              <div className="eyebrow text-ink/75 mt-4 mb-10 md:mb-16">{julia.rolle}</div>
            </div>

            <blockquote data-quote className="display-lg text-ink" style={{ fontSize: 'clamp(1.5rem, 2.4vw, 2.8rem)', lineHeight: 1.1 }}>
              &ldquo;<Satz teile={julia.zitat} grund="hell" />&rdquo;
              <footer className="mt-5 eyebrow text-ink/75 not-italic">{julia.zitatQuelle}</footer>
            </blockquote>
          </div>

          {/* Right: Portrait collage */}
          <div className="md:col-span-6 lg:col-span-5">
            <div className="flex gap-4 items-start">
              {/* Main portrait — pink blazer */}
              <div
                data-image
                data-cursor="image"
                data-cursor-label="Julia"
                className="flex-1 relative overflow-hidden rounded-sm"
                style={{ aspectRatio: '3/4' }}
              >
                <Bild
                  quelle={julia.portraet}
                  breiten={[400, 600, 800]}
                  sizes="(min-width: 768px) 30vw, 60vw"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </div>

              {/* Side column — mobil breiter, sonst passt "Versicherungs-
                  schwester" nicht in den Infokasten */}
              <div className="flex flex-col gap-4 mt-10 md:mt-16 w-[52%] md:w-[42%]">
                {/* Headshot — pink bg */}
                <div
                  data-image
                  data-cursor="image"
                  className="relative overflow-hidden rounded-sm aspect-square"
                >
                  <Bild
                    quelle={julia.zweitbild}
                    breiten={[300, 450, 600]}
                    sizes="(min-width: 768px) 15vw, 30vw"
                    className="absolute inset-0 w-full h-full object-cover object-[center_28%]"
                  />
                </div>

                {/* Info card */}
                <div className="bg-ink text-paper p-4 md:p-5 rounded-sm">
                  <div className="eyebrow text-pink mb-2 md:mb-3">{julia.infokarteTitel}</div>
                  <p className="text-xs text-paper/70 leading-relaxed font-light hyphens-auto break-words">
                    {julia.infokarteText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Part 2: Bio strip ─────────────────────────────────────── */}
      {/* Mobil mehr Luft als früher (py-20 → py-24, gap-6 → gap-12):
          Bild, Überschrift und Fließtext standen auf dem Handy fast
          aneinander (Wunsch Felix 02.08.2026). */}
      <div className="bg-ink text-paper mt-16 md:mt-24 py-24 md:py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-12 md:gap-10 items-center">

            {/* Ein großes Bild statt des früheren Paars (Wunsch Julia 08/2026).
                Das Seitenverhältnis 5/7 entspricht fast exakt der Originaldatei
                (1058 × 1476), es wird also nichts weggeschnitten. Die Spalte
                bleibt bei col-span-5: mehr Breite als ~530 px würde die
                Auflösung auf Retina-Displays sichtbar weich machen. */}
            <div className="md:col-span-5">
              <div
                data-image
                data-cursor="image"
                data-cursor-label="Julia"
                className="relative overflow-hidden rounded-sm"
                style={{ aspectRatio: '5/7' }}
              >
                <Bild
                  quelle={julia.geschichteBild}
                  breiten={[420, 640, 1060]}
                  sizes="(min-width: 768px) 40vw, 90vw"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </div>
            </div>

            {/* Bio text */}
            <div
              data-bio
              className="md:col-span-6 md:col-start-7 space-y-7 md:space-y-6"
            >
              {/* Satzbild wie „4 Schritte. Ein Konzept." (TheMethod.jsx):
                  display-lg in Paper, der Markenname kursiv in Pink.
                  Kleinere Obergrenze als dort, weil die Überschrift hier
                  nicht über die volle Breite läuft, sondern in einer
                  6-Spalten-Spalte steht (Wunsch Felix 02.08.2026). */}
              <h2
                className="display-lg text-paper mb-6 md:mb-8 text-balance"
                style={{ fontSize: 'clamp(2.1rem, 3.8vw, 3.8rem)' }}
              >
                <Satz teile={julia.geschichteUeberschrift} />
              </h2>

              {julia.geschichteAbsaetze.map((p) => (
                <p key={p.slice(0, 24)} className="body-lead text-paper/75" style={{ fontSize: 'clamp(0.95rem, 1.05vw, 1.1rem)' }}>
                  {p}
                </p>
              ))}
              {julia.anspruchText && (
                <p className="body-lead text-paper/75" style={{ fontSize: 'clamp(0.95rem, 1.05vw, 1.1rem)' }}>
                  <strong className="text-paper font-medium">{julia.anspruchTitel}</strong><br />
                  {julia.anspruchText}
                </p>
              )}

              {/* Credentials */}
              <div className="pt-6 border-t border-paper/10 grid grid-cols-2 gap-4">
                {julia.kurzprofil.map(({ wert, label }) => (
                  <div key={label} className="flex flex-col">
                    <span className="data-num text-pink text-3xl md:text-4xl leading-none">
                      {fuellen(wert, { minuten: CALL_MINUTES })}
                    </span>
                    <span className="eyebrow text-paper/55 mt-1">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
