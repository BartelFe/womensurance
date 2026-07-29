import { useEffect } from 'react';
import TopicPage from '../components/topic/TopicPage';
import PensionGapChart from '../components/topic/PensionGapChart';
import ParttimeCalculator from '../components/topic/ParttimeCalculator';

// FAQ auf Suchintention optimiert ("rentenlücke berechnen", "teilzeit rente",
// "elternzeit rente") — Feinschliff in dedizierter SEO-Session.
const FAQ = {
  title: (
    <>
      Häufige Fragen zur <span className="display-italic text-pink">Rentenlücke.</span>
    </>
  ),
  items: [
    {
      q: 'Wie kann ich meine Rentenlücke berechnen?',
      a: 'Der schnellste Weg: unser Rechner oben auf dieser Seite — Stunden, Jahre und Gehalt einstellen, fertig. Für die genaue Zahl brauchst du deine jährliche Renteninformation der Deutschen Rentenversicherung: Dort steht deine bisher erreichte Anwartschaft. Die Lücke ist die Differenz zwischen dieser Zahl (nach Abzug von Inflation und Abgaben) und dem, was du im Alter monatlich brauchst.',
    },
    {
      q: 'Wie stark reduziert Teilzeit meine Rente?',
      a: 'Die gesetzliche Rente rechnet in Entgeltpunkten: Wer die Hälfte arbeitet, sammelt die Hälfte der Punkte. Zehn Jahre halbe Stelle bei Durchschnittsgehalt kosten rund 200 Euro Monatsrente — lebenslang. Jede Stunde weniger wirkt also doppelt: heute weniger Gehalt, später weniger Rente.',
    },
    {
      q: 'Zählt Elternzeit für die Rente?',
      a: 'Ja. Pro Kind werden bis zu drei Jahre Kindererziehungszeit angerechnet — ungefähr so, als hättest du durchschnittlich verdient. Die eigentliche Lücke entsteht meist danach: durch den Wiedereinstieg in Teilzeit und die langsamere Gehaltsentwicklung. Genau diese Folgejahre gleicht der Staat nicht aus.',
    },
    {
      q: 'Werden Pflegezeiten bei der Rente angerechnet?',
      a: 'Unter Bedingungen ja: Wer eine Person mit mindestens Pflegegrad 2 wenigstens zehn Stunden pro Woche an mindestens zwei Tagen pflegt und selbst nicht mehr als 30 Stunden arbeitet, bekommt Rentenbeiträge von der Pflegekasse — aber nur, wenn es gemeldet wird. Viele verschenken diese Punkte, weil niemand ihnen davon erzählt hat.',
    },
    {
      q: 'Wann sollte ich anfangen, meine Rentenlücke zu schließen?',
      a: 'So früh wie möglich — nicht, weil das dramatischer klingt, sondern wegen des Zinseszinses: Wer mit 30 anfängt, braucht für dieselbe Zusatzrente ungefähr die Hälfte des Monatsbeitrags wie jemand, der mit 45 startet. Aber auch mit 50 ist mehr möglich, als die meisten denken.',
    },
    {
      q: 'Was ist der Gender Pension Gap?',
      a: 'Der geschlechtsspezifische Unterschied bei den Alterseinkünften. In Deutschland erhalten Frauen aus eigenen Ansprüchen im Schnitt 39,4 Prozent weniger Alterssicherung als Männer (Statistisches Bundesamt, 2023, ohne Hinterbliebenenrenten). Hauptursachen: Teilzeit, Care-Arbeit, Erwerbspausen und der Gender Pay Gap.',
    },
  ],
  note: 'Vereinfachte Antworten für den ersten Überblick — keine Steuer- oder Rechtsberatung. Deine konkrete Situation klären wir im Gespräch.',
};

// ⚠️ Zahlen/Quellen sind Platzhalter in plausibler Größenordnung —
// vor Live-Schaltung mit Julia validieren und exakte Quellen (Destatis, DRV) einsetzen.

export default function Rentenluecke() {
  useEffect(() => {
    document.title = 'Die Rentenlücke — Teilzeit & Care-Arbeit | Womensurance';
    const meta = document.querySelector('meta[name="description"]');
    const prev = meta?.getAttribute('content');
    meta?.setAttribute(
      'content',
      'Warum Teilzeit und Care-Arbeit die Rentenlücke von Frauen vergrößern — und was du dagegen tun kannst. Rentenlücke verstehen, berechnen, schließen.'
    );
    return () => { if (prev) meta?.setAttribute('content', prev); };
  }, []);

  return (
    <TopicPage
      afterHero={
        <>
          <PensionGapChart />
          <ParttimeCalculator />
        </>
      }
      faq={FAQ}
      eyebrow="Themenseite · Teilzeit / Care-Arbeit"
      titleLines={[
        { text: 'Die Rentenlücke' },
        { text: 'wächst leise.', italic: true },
      ]}
      lead="Teilzeit fühlt sich wie eine Übergangslösung an — für ein paar Jahre, solange die Kinder klein sind, solange die Eltern Hilfe brauchen. Aber die Rente vergisst kein einziges Jahr. Diese Seite zeigt dir, wie aus reduzierten Stunden eine Lücke von mehreren hundert Euro im Monat wird — und warum sie kein Schicksal ist."
      stats={[
        {
          value: 49,
          unit: '%',
          label: 'der erwerbstätigen Frauen in Deutschland arbeiten Teilzeit — bei Männern sind es 12 %.',
          source: 'Quelle: Statistisches Bundesamt*',
        },
        {
          value: 39.4,
          unit: '%',
          decimals: 1,
          label: 'weniger Rente erhalten Frauen im Schnitt als Männer (Gender Pension Gap).',
          source: 'Quelle: Destatis*',
        },
        {
          value: 44,
          unit: '%',
          label: 'mehr unbezahlte Sorgearbeit leisten Frauen täglich gegenüber Männern.',
          source: 'Quelle: Zeitverwendungserhebung*',
        },
      ]}
      chapters={[
        {
          kicker: 'Der Mechanismus',
          title: 'Warum jede Stunde doppelt zählt',
          paragraphs: [
            'Die gesetzliche Rente rechnet in Entgeltpunkten: Wer ein Jahr lang das Durchschnittsgehalt verdient, bekommt einen Punkt. Wer halbtags arbeitet, bekommt einen halben. Das klingt fair — aber es bedeutet: Zehn Jahre Teilzeit sind fünf verlorene Rentenjahre.',
            'Dazu kommt der zweite, unsichtbare Effekt: Wer weniger arbeitet, macht seltener Karriereschritte, verhandelt seltener Gehalt und zahlt weniger in betriebliche und private Vorsorge ein. Die Lücke multipliziert sich — Jahr für Jahr, still und ohne Kontoauszug.',
          ],
        },
        {
          kicker: 'Care-Arbeit',
          title: 'Die unbezahlte zweite Schicht',
          paragraphs: [
            'Kinder, Haushalt, pflegebedürftige Eltern: Der größte Teil der Sorgearbeit in Deutschland wird von Frauen geleistet — unbezahlt und ohne Rentenpunkte. Pflegezeiten können zwar angerechnet werden, aber nur unter Bedingungen, die viele nicht kennen und deshalb nicht nutzen.',
            'Das Ergebnis: Ausgerechnet die Frauen, die am meisten für andere da sind, stehen am Ende mit der kleinsten eigenen Absicherung da. Nicht, weil sie etwas falsch gemacht haben — sondern weil ihnen niemand gezeigt hat, wo die Stellschrauben sind.',
          ],
        },
        {
          kicker: 'Der Ausweg',
          title: 'Die Lücke lässt sich schließen — wenn du sie kennst',
          paragraphs: [
            'Der erste Schritt ist Klarheit: Wie groß ist deine persönliche Lücke wirklich? Renteninformation lesen, Vorsorgeverträge prüfen, Pflege- und Erziehungszeiten anrechnen lassen — vieles davon kostet nichts außer einem Nachmittag.',
            'Der zweite Schritt ist ein Plan, der zu deinem Leben passt: Ausgleichsbeiträge während der Teilzeit, eine private Vorsorge in der richtigen Höhe, eine faire Aufteilung mit dem Partner. Ab hier ist jede Situation individuell — und genau da beginnt Beratung.',
          ],
        },
      ]}
      quote={{
        text: 'Teilzeit ist fast nie die Entscheidung einer Frau allein. Aber die Rentenlücke trägt sie allein. Das ändern wir.',
        author: 'Julia Pashchenko',
      }}
      actions={[
        {
          title: 'Renteninformation verstehen',
          body: 'Der jährliche Brief der Rentenversicherung zeigt deine Ansprüche — aber die entscheidende Zahl (was nach Inflation wirklich bleibt) steht nicht drin. Wir rechnen sie gemeinsam aus.',
        },
        {
          title: 'Pflege- & Erziehungszeiten anrechnen',
          body: 'Kindererziehungs- und Pflegezeiten können Rentenpunkte bringen — aber nur, wenn sie beantragt werden. Viele verschenken hier bares Geld.',
        },
        {
          title: 'Teilzeit-Lücke aktiv ausgleichen',
          body: 'Schon kleine monatliche Beiträge in die richtige Vorsorgeform gleichen reduzierte Stunden aus — je früher, desto günstiger.',
        },
        {
          title: 'Fair teilen statt still tragen',
          body: 'Wenn Teilzeit eine gemeinsame Familienentscheidung ist, kann auch die Vorsorge gemeinsam getragen werden — z. B. über Ausgleichszahlungen des Partners.',
        },
      ]}
      ctaHeadline={
        <>
          Wie groß ist <span className="display-italic text-pink">deine Lücke?</span>
        </>
      }
      ctaBody="Bis hierhin war alles Statistik. Deine Zahl hängt von deinem Leben ab — Stunden, Jahren, Verträgen. In 60 Minuten schauen wir gemeinsam drauf: kostenlos, ehrlich und in deinem Tempo."
    />
  );
}
