import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function Nav() {
  const root = useRef(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!root.current) return;
    gsap.fromTo(
      root.current,
      { y: -32, opacity: 0 },
      { y: 0, opacity: 1, delay: 1.6, duration: 0.8, ease: 'power3.out' }
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

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -40, duration: 1.4 });
    else el.scrollIntoView({ behavior: 'smooth' });
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
      <a href="#hero" onClick={scrollTo('hero')} className="flex items-baseline gap-2 group">
        <span className="display-italic text-paper text-2xl">womensurance</span>
        <span className="eyebrow text-paper/40 hidden md:inline">— DVM</span>
      </a>

      {/* Center links — minimal */}
      <div className="hidden md:flex items-center gap-10 eyebrow text-paper/60">
        <a href="#gap" onClick={scrollTo('gap')} className="hover:text-pink transition-colors">Die Lücke</a>
        <a href="#life" onClick={scrollTo('life')} className="hover:text-pink transition-colors">Dein Leben</a>
        <a href="#julia" onClick={scrollTo('julia')} className="hover:text-pink transition-colors">Julia</a>
        <a href="#method" onClick={scrollTo('method')} className="hover:text-pink transition-colors">Weg</a>
      </div>

      {/* CTA */}
      <a
        href="https://outlook.office.com/book/Womensurance@dvm.de/?ismsaljsauthenabled"
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
