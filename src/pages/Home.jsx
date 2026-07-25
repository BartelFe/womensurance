import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Loader from '../components/layout/Loader';
import OpeningStatement from '../components/sections/OpeningStatement';
import TheReceipt from '../components/sections/TheReceipt';
import YourLife from '../components/sections/YourLife';
import TheTruth from '../components/sections/TheTruth';
import MeetJulia from '../components/sections/MeetJulia';
import TheMethod from '../components/sections/TheMethod';
import Voices from '../components/sections/Voices';
import TheStep from '../components/sections/TheStep';

const INTRO_KEY = 'wmns-intro-seen';

export default function Home() {
  const location = useLocation();
  // Loader nur beim ersten Besuch pro Tab-Session — nicht bei jeder Rückkehr von einer Unterseite
  const [showLoader] = useState(() => {
    try {
      return !sessionStorage.getItem(INTRO_KEY);
    } catch {
      return true;
    }
  });

  const markIntroSeen = () => {
    try {
      sessionStorage.setItem(INTRO_KEY, '1');
    } catch {
      /* noop */
    }
  };

  // Hash-Navigation: /#gap, /#julia … oder /#phase-<id> (Kachel in der Horizontal-Section)
  useEffect(() => {
    const hash = location.hash;
    if (!hash) return;
    const t = setTimeout(() => {
      ScrollTrigger.refresh();
      if (hash.startsWith('#phase-')) {
        window.__scrollToPhase?.(hash.slice('#phase-'.length));
      } else {
        const el = document.querySelector(hash);
        if (el) {
          if (window.__lenis) window.__lenis.scrollTo(el, { offset: -40, duration: 1.4 });
          else el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, showLoader ? 4400 : 500);
    return () => clearTimeout(t);
  }, [location.hash, showLoader]);

  return (
    <>
      {showLoader && <Loader onComplete={markIntroSeen} />}
      <main className="relative">
        <OpeningStatement />
        <TheReceipt />
        <YourLife />
        <TheTruth />
        <MeetJulia />
        <TheMethod />
        <Voices />
        <TheStep />
      </main>
    </>
  );
}
