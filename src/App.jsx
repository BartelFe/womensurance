import { useState } from 'react';
import { useLenis } from './hooks/useLenis';
import { GapProvider } from './hooks/useGapState';

import Cursor from './components/layout/Cursor';
import GrainOverlay from './components/layout/GrainOverlay';
import Loader from './components/layout/Loader';
import Nav from './components/layout/Nav';
import Footer from './components/layout/Footer';

import OpeningStatement from './components/sections/OpeningStatement';
import TheGap from './components/sections/TheGap';
import YourLife from './components/sections/YourLife';
import TheTruth from './components/sections/TheTruth';
import MeetJulia from './components/sections/MeetJulia';
import TheMethod from './components/sections/TheMethod';
import Voices from './components/sections/Voices';
import TheStep from './components/sections/TheStep';

export default function App() {
  const [loaderDone, setLoaderDone] = useState(false);
  useLenis();

  return (
    <GapProvider>
      <Loader onComplete={() => setLoaderDone(true)} />
      <Cursor />
      <GrainOverlay />
      <Nav />

      <main className="relative">
        <OpeningStatement />
        <TheGap />
        <YourLife />
        <TheTruth />
        <MeetJulia />
        <TheMethod />
        <Voices />
        <TheStep />
      </main>

      <Footer />
    </GapProvider>
  );
}
