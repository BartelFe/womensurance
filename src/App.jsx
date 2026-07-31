import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from './hooks/useLenis';
import { useReducedMotion } from './hooks/useReducedMotion';
import { GapProvider } from './hooks/useGapState';

import Cursor from './components/layout/Cursor';
import GrainOverlay from './components/layout/GrainOverlay';
import Nav from './components/layout/Nav';
import Footer from './components/layout/Footer';
import ThemePanel from './components/layout/ThemePanel';
import CookieConsent from './components/layout/CookieConsent';

import Home from './pages/Home';
import Rentenluecke from './pages/Rentenluecke';
import Scheidung from './pages/Scheidung';
import Impressum from './pages/Impressum';
import Datenschutz from './pages/Datenschutz';
import Barrierefreiheit from './pages/Barrierefreiheit';

/** Scrollt bei Seitenwechsel nach oben und aktualisiert ScrollTrigger */
function ScrollManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    // ScrollTrigger nach dem Paint der neuen Seite neu vermessen
    const t = setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}

/** Erster fokussierbarer Link der Seite — überspringt Nav und Theme-Panel (WCAG 2.4.1) */
function SkipLink() {
  const jump = (e) => {
    e.preventDefault();
    const el = document.getElementById('main');
    if (!el) return;
    el.focus();
    if (window.__lenis) window.__lenis.scrollTo(el, { immediate: true });
    else el.scrollIntoView();
  };

  return (
    <a href="#main" className="skip-link" onClick={jump}>
      Zum Inhalt springen
    </a>
  );
}

export default function App() {
  const reduced = useReducedMotion();
  useLenis(reduced);

  // Bei „Bewegung reduzieren" laufen GSAP-Einblendungen praktisch sofort durch.
  // Die gepinnten Sektionen bleiben — sie sind das Seitenlayout, keine Deko;
  // ihr Fortschritt hängt am Scroll und nicht an einer Zeitachse.
  useEffect(() => {
    gsap.globalTimeline.timeScale(reduced ? 100 : 1);
    document.documentElement.dataset.reducedMotion = reduced ? 'true' : 'false';
  }, [reduced]);

  return (
    <GapProvider>
      <ScrollManager />
      <SkipLink />
      <Cursor />
      <GrainOverlay />
      <Nav />
      <ThemePanel />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rentenluecke" element={<Rentenluecke />} />
        <Route path="/scheidung" element={<Scheidung />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/datenschutz" element={<Datenschutz />} />
        <Route path="/barrierefreiheit" element={<Barrierefreiheit />} />
      </Routes>

      <Footer />
      <CookieConsent />
    </GapProvider>
  );
}
