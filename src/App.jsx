import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from './hooks/useLenis';
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

export default function App() {
  useLenis();

  return (
    <GapProvider>
      <ScrollManager />
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
      </Routes>

      <Footer />
      <CookieConsent />
    </GapProvider>
  );
}
