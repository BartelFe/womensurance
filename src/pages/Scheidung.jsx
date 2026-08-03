import TopicPage from '../components/topic/TopicPage';
import SplitAccounts from '../components/topic/SplitAccounts';
import MistakesStack from '../components/topic/MistakesStack';
import { themenseite, topicProps, useSeitenkopf } from '../lib/themenseite';

/**
 * Unterseite "Scheidung / Versorgungsausgleich".
 *
 * Texte aus dem Redaktionssystem (src/content/themenseiten.json, Eintrag
 * `scheidung`). Hier stehen nur die beiden Grafikbausteine: die geteilten
 * Rentenkonten unter dem Kopf, die Fehlerliste nach dem Zitat.
 */
export default function Scheidung() {
  const seite = themenseite('scheidung');
  useSeitenkopf(seite);

  return (
    <TopicPage
      {...topicProps(seite)}
      afterHero={<SplitAccounts />}
      afterQuote={<MistakesStack ueberschrift={seite.fehlerUeberschrift} eintraege={seite.fehler} />}
    />
  );
}
