import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { lifePhases } from '../../data/lifePhases';
import { BOOKING_URL } from '../../config/site';
import { scrollToSection } from '../../lib/scrollTo';

const LINKS = [
  { id: 'gap', label: 'Die Lücke' },
  { id: 'life', label: 'Dein Leben', dropdown: true },
  { id: 'julia', label: 'Vorstellung' },
  { id: 'method', label: 'Ablauf' },
];

export default function Nav() {
  const root = useRef(null);
  const [hidden, setHidden] = useState(false);
  const [lifeOpen, setLifeOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    if (!root.current) return;
    gsap.fromTo(
      root.current,
      { y: -32, opacity: 0 },
      {
        y: 0, opacity: 1, delay: 1.6, duration: 0.8, ease: 'power3.out',
        onComplete: () => {
          // Clear GSAP's inline transform/opacity so Tailwind's translate classes take over
          if (root.current) gsap.set(root.current, { clearProps: 'transform,opacity' });
        },
      }
    );

    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      if (window.innerWidth < 768) {
        // Mobile: disappear as soon as user starts scrolling
        setHidden(y > 40);
      } else {
        // Desktop: only hide when scrolling downward past 200px
        setHidden(y > last && y > 200);
      }
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /** Zu einer Section scrollen — von Unterseiten aus erst zur Startseite navigieren */
  const goToSection = (id) => (e) => {
    e.preventDefault();
    setLifeOpen(false);
    if (!isHome) {
      navigate(`/#${id}`);
      return;
    }
    scrollToSection(id);
  };

  /** Zu einer bestimmten Kachel in der Horizontal-Section scrollen */
  const goToPhase = (phaseId) => (e) => {
    e.preventDefault();
    setLifeOpen(false);
    if (!isHome) {
      navigate(`/#phase-${phaseId}`);
      return;
    }
    window.__scrollToPhase?.(phaseId);
  };

  return (
    <nav
      ref={root}
      className={`fixed top-0 left-0 right-0 z-[300] flex items-center justify-between px-6 md:px-10 py-5 transition-transform duration-500
        bg-ink/20 backdrop-blur-xl border-b border-white/[0.07]
        shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_4px_24px_rgba(0,0,0,0.3)]
        ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      {/* Logo wordmark */}
      <a href="/#hero" onClick={goToSection('hero')} className="flex items-baseline gap-2 group">
        <span className="display-italic text-paper text-2xl">womensurance</span>
        <span className="eyebrow text-paper/40 hidden md:inline">— DVM</span>
      </a>

      {/* Center links */}
      <div className="hidden md:flex items-center gap-10 eyebrow text-paper/60">
        {LINKS.map((link) =>
          link.dropdown ? (
            <div
              key={link.id}
              className="relative"
              onMouseEnter={() => setLifeOpen(true)}
              onMouseLeave={() => setLifeOpen(false)}
            >
              <a
                href={`/#${link.id}`}
                onClick={goToSection(link.id)}
                aria-haspopup="true"
                aria-expanded={lifeOpen}
                className={`inline-flex items-center gap-1.5 transition-colors ${lifeOpen ? 'text-pink' : 'hover:text-pink'}`}
              >
                {link.label}
                <svg
                  width="8" height="8" viewBox="0 0 8 8" fill="none"
                  className={`transition-transform duration-300 ${lifeOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M1 2.5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>

              {/* Dropdown: Kachel-Überschriften der Horizontal-Section */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 top-full pt-4 transition-all duration-300 ${
                  lifeOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'
                }`}
              >
                <div className="min-w-[240px] bg-ink/90 backdrop-blur-xl border border-white/[0.08] rounded-md shadow-2xl py-3">
                  {lifePhases.map((phase, i) => (
                    <a
                      key={phase.id}
                      href={`/#phase-${phase.id}`}
                      onClick={goToPhase(phase.id)}
                      className="flex items-baseline gap-3 px-5 py-2 text-paper/60 hover:text-pink hover:bg-white/[0.04] transition-colors"
                    >
                      <span className="tnum text-[10px] font-bold text-paper/30">{String(i + 1).padStart(2, '0')}</span>
                      <span className="normal-case tracking-normal font-body text-[13px] font-normal">{phase.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <a
              key={link.id}
              href={`/#${link.id}`}
              onClick={goToSection(link.id)}
              className="hover:text-pink transition-colors"
            >
              {link.label}
            </a>
          )
        )}
      </div>

      {/* CTA */}
      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noreferrer"
        className="group inline-flex items-center gap-2 eyebrow text-paper border border-paper/30 hover:border-pink hover:text-pink rounded-full px-4 py-2.5 transition-colors"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-pink animate-pulse" />
        Erstgespräch
      </a>
    </nav>
  );
}
