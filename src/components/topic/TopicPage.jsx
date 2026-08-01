import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '../ui/MagneticButton';
import DataNumber from '../ui/DataNumber';
import { SOCIAL_ICONS } from '../ui/SocialIcons';
import FaqSection from './FaqSection';
import { BOOKING_URL, SOCIALS, CALL_MINUTES } from '../../config/site';

gsap.registerPlugin(ScrollTrigger);

/**
 * Gemeinsames Layout der Themen-Unterseiten (Rentenlücke, Scheidung).
 * Editorial-Aufbau: Hero → Zahlen → Kapitel → Zitat → Handlungsliste → CTA.
 * Ab einem gewissen Punkt ist jede Situation individuell — deshalb läuft
 * jede Seite bewusst auf das Erstgespräch als nächsten logischen Schritt zu.
 */
export default function TopicPage({
  eyebrow,
  titleLines,
  lead,
  stats,
  chapters,
  quote,
  actions,
  ctaHeadline,
  ctaBody,
  afterHero = null,
  afterQuote = null,
  faq = null,
}) {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none reverse' },
          }
        );
      });

      // Handlungskarten stapeln sich wie die 4-Schritte-Methode
      const cards = root.current.querySelectorAll('[data-action-card]');
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
            scrollTrigger: { trigger: card, start: 'top 78%', toggleActions: 'play none none reverse' },
          }
        );

        if (i > 0) {
          const prevCards = Array.from(cards).slice(0, i);
          gsap.to(prevCards, {
            scale: (idx) => 1 - (i - idx) * 0.02,
            yPercent: (idx) => -(i - idx) * 4,
            scrollTrigger: { trigger: card, start: 'top 70%', end: 'top 30%', scrub: 0.6 },
          });
        }
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <main id="main" tabIndex={-1} ref={root} className="relative">
      {/* ── Hero ── */}
      <section className="bg-ink text-paper px-6 md:px-12 pt-40 md:pt-48 pb-20 md:pb-28 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="eyebrow text-pink mb-8">{eyebrow}</div>
          <h1 className="display-xl text-paper text-balance" style={{ fontSize: 'clamp(2.8rem, 8vw, 8rem)' }}>
            {titleLines.map((line, i) => (
              <span key={i} className={`block ${line.italic ? 'display-italic text-pink' : ''}`}>
                {line.text}
              </span>
            ))}
          </h1>
          <p className="mt-10 max-w-2xl body-lead text-paper/60" style={{ fontSize: 'clamp(1.05rem, 1.3vw, 1.35rem)' }}>
            {lead}
          </p>
        </div>
        <div
          className="absolute -bottom-10 -right-6 display-italic text-paper/[0.03] select-none pointer-events-none"
          style={{ fontSize: '26vw', lineHeight: 0.8 }}
          aria-hidden="true"
        >
          Lücke
        </div>
      </section>

      {/* ── Optionale Grafik-Sektion direkt nach dem Hero ── */}
      {afterHero}

      {/* ── Zahlen-Band ── */}
      <section className="bg-ink text-paper border-t border-paper/10 px-6 md:px-12 py-14">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {stats.map((s) => (
            <div key={s.label} data-reveal className="border-l-2 border-pink/60 pl-5">
              <div className="data-num text-pink" style={{ fontSize: 'clamp(2.6rem, 4.5vw, 4.2rem)' }}>
                <DataNumber value={s.value} decimals={s.decimals ?? 0} suffix={s.unit} />
              </div>
              <div className="mt-2 text-sm text-paper/55 leading-snug max-w-[26ch]">{s.label}</div>
              {s.source && <div className="mt-1 text-[11px] text-paper/55">{s.source}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── Kapitel ── */}
      <section className="bg-paper text-ink px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-6xl mx-auto space-y-20 md:space-y-28">
          {chapters.map((ch, i) => (
            <article key={ch.kicker} data-reveal className="grid md:grid-cols-12 gap-6 md:gap-10">
              <div className="md:col-span-4">
                <div className="eyebrow text-clay-deep mb-3">
                  {String(i + 1).padStart(2, '0')} · {ch.kicker}
                </div>
                <h2 className="display-lg text-ink" style={{ fontSize: 'clamp(1.7rem, 2.6vw, 2.6rem)' }}>
                  {ch.title}
                </h2>
              </div>
              <div className="md:col-span-7 md:col-start-6 space-y-5">
                {ch.paragraphs.map((p, j) => (
                  <p key={j} className="body-lead text-ink/70" style={{ fontSize: 'clamp(1rem, 1.15vw, 1.2rem)' }}>
                    {p}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Zitat ── */}
      <section className="bg-ink text-paper px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-5xl mx-auto" data-reveal>
          <blockquote className="display-lg text-paper text-balance" style={{ fontSize: 'clamp(1.6rem, 3.2vw, 3.2rem)', lineHeight: 1.15 }}>
            &ldquo;{quote.text}&rdquo;
            <footer className="mt-6 eyebrow text-paper/55 not-italic">— {quote.author}</footer>
          </blockquote>
        </div>
      </section>

      {/* ── Optionale Sektion(en) nach dem Zitat ── */}
      {afterQuote}

      {/* ── Handlungsliste ── */}
      <section className="bg-paper text-ink px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-6xl mx-auto">
          <div data-reveal>
            <h2 className="display-lg text-ink mb-14" style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}>
              Was du <span className="display-italic text-pink">jetzt</span> tun kannst.
            </h2>
          </div>
          {/* Gestapelte Karten — gleiches Layout wie die 4-Schritte-Methode
              auf der Startseite (Wunsch Julia 07/2026). */}
          <div className="space-y-6 md:space-y-8 max-w-4xl">
            {actions.map((a, i) => (
              <article
                key={a.title}
                data-action-card
                className="relative bg-bone text-ink rounded-sm p-6 md:p-12 border border-clay-light shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)]"
              >
                <div className="grid grid-cols-12 gap-4 md:gap-8 items-start">
                  <div className="col-span-12 md:col-span-2">
                    <div className="display-italic text-pink" style={{ fontSize: 'clamp(2.2rem, 5vw, 5rem)', lineHeight: 0.9 }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-10">
                    <h3 className="display-lg text-ink mb-3 text-balance" style={{ fontSize: 'clamp(1.4rem, 2.2vw, 2.2rem)' }}>
                      {a.title}
                    </h3>
                    <p className="body-lead text-ink/75 max-w-2xl">{a.body}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ (SEO) ── */}
      {faq && <FaqSection title={faq.title} items={faq.items} note={faq.note} />}

      {/* ── CTA ── */}
      <section className="bg-ink text-paper px-6 md:px-12 py-28 md:py-40 relative overflow-hidden">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[110vw] h-[110vw] md:w-[70vw] md:h-[70vw] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgb(var(--pink-rgb) / 0.16) 0%, transparent 60%)' }}
        />
        <div className="relative max-w-4xl mx-auto text-center" data-reveal>
          <h2 className="display-xl text-paper text-balance" style={{ fontSize: 'clamp(2.2rem, 6vw, 6rem)' }}>
            {ctaHeadline}
          </h2>
          <p className="mt-8 max-w-xl mx-auto body-lead text-paper/55">{ctaBody}</p>
          <div className="mt-10 flex flex-col items-center gap-5">
            <MagneticButton href={BOOKING_URL} target="_blank" variant="pink">
              <span className="font-medium tracking-wide">Erstgespräch buchen</span>
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </MagneticButton>
            <div className="eyebrow text-paper/55">{CALL_MINUTES} Minuten · Kostenlos · Vertraulich</div>

            {/* Social Media — wie auf der Startseite */}
            <div className="mt-6 flex flex-col items-center gap-4">
              <div className="eyebrow text-paper/55">Oder folge mir</div>
              <div className="flex items-center justify-center gap-3">
                {SOCIALS.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="w-12 h-12 rounded-full border border-paper/25 text-paper/70 hover:border-pink hover:text-pink transition-colors flex items-center justify-center"
                  >
                    {SOCIAL_ICONS[s.id]}
                  </a>
                ))}
              </div>
            </div>

            <Link to="/#life" className="eyebrow text-paper/55 hover:text-pink transition-colors mt-4">
              ← Zurück zu allen Lebensphasen
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
