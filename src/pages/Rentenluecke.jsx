import TopicPage from '../components/topic/TopicPage';
import PensionGapChart from '../components/topic/PensionGapChart';
import ParttimeCalculator from '../components/topic/ParttimeCalculator';
import { themenseite, topicProps, useSeitenkopf } from '../lib/themenseite';

/**
 * Unterseite "Teilzeit & Care-Arbeit".
 *
 * Sämtliche Texte, Zahlen und Fragen kommen aus dem Redaktionssystem
 * (src/content/themenseiten.json, Eintrag `rentenluecke`). Hier steht nur
 * noch, welche beiden Rechenbausteine unter dem Kopfbereich sitzen.
 */
export default function Rentenluecke() {
  const seite = themenseite('rentenluecke');
  useSeitenkopf(seite);

  return (
    <TopicPage
      {...topicProps(seite)}
      afterHero={
        <>
          <PensionGapChart />
          <ParttimeCalculator />
        </>
      }
    />
  );
}
