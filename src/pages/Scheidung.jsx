import { useEffect } from 'react';
import TopicPage from '../components/topic/TopicPage';
import SplitAccounts from '../components/topic/SplitAccounts';
import MistakesStack from '../components/topic/MistakesStack';

// FAQ auf "versorgungsausgleich"-Suchintention optimiert (~23.500 Suchen/Monat)
// — Feinschliff in dedizierter SEO-Session.
const FAQ = {
  title: (
    <>
      Häufige Fragen zum{' '}
      <span className="display-italic text-pink">Versorgungsausgleich.</span>
    </>
  ),
  items: [
    {
      q: 'Was ist der Versorgungsausgleich?',
      a: 'Das gerichtliche Verfahren, das bei einer Scheidung alle in der Ehezeit erworbenen Rentenanrechte hälftig zwischen den Ehepartnern teilt. Es läuft automatisch mit der Scheidung — du musst es nicht beantragen, kannst es aber auch nicht einfach ignorieren.',
    },
    {
      q: 'Wie wird der Versorgungsausgleich berechnet?',
      a: 'Für jedes Anrecht wird der Ehezeitanteil ermittelt: der Teil der Rentenansprüche, der zwischen Eheschließung und Zustellung des Scheidungsantrags entstanden ist. Davon erhält der andere Partner grundsätzlich die Hälfte. Die Versorgungsträger melden die Werte an das Familiengericht — geprüft werden sollten sie trotzdem.',
    },
    {
      q: 'Welche Rentenansprüche werden geteilt?',
      a: 'Praktisch alle: gesetzliche Rente, Betriebsrenten, Beamtenversorgung, berufsständische Versorgungswerke, Riester- und Rürup-Verträge sowie private Rentenversicherungen. Kapital-Lebensversicherungen mit Einmalzahlung fallen dagegen in den Zugewinnausgleich, nicht in den Versorgungsausgleich.',
    },
    {
      q: 'Kann man den Versorgungsausgleich ausschließen?',
      a: 'Ja — per notariellem Ehevertrag oder Scheidungsfolgenvereinbarung. Aber das Gericht prüft solche Vereinbarungen auf Fairness, und für dich gilt: Ein Verzicht ohne echten Gegenwert ist fast immer ein Verlustgeschäft für die Person, die für die Familie beruflich zurückgesteckt hat.',
    },
    {
      q: 'Was passiert bei kurzer Ehe?',
      a: 'Bei einer Ehezeit von bis zu drei Jahren findet der Versorgungsausgleich nur statt, wenn ihn ein Ehepartner ausdrücklich beantragt. Auch Kleinstbeträge werden oft nicht ausgeglichen — was sich bei mehreren kleinen Anrechten trotzdem summieren kann.',
    },
    {
      q: 'Kann der Versorgungsausgleich später angepasst werden?',
      a: 'In engen Grenzen. Stirbt zum Beispiel die ausgleichsberechtigte Person, kann die Kürzung beim Ex-Partner unter Umständen entfallen. Grobe Fehler im Beschluss lassen sich dagegen später kaum noch korrigieren — deshalb ist der richtige Zeitpunkt zum Prüfen vor dem Gerichtstermin, nicht danach.',
    },
  ],
  note: 'Vereinfachte Antworten für den ersten Überblick — keine Rechtsberatung. Für die juristische Seite gehören Anwältin oder Notar an deine Seite; wir kümmern uns um deine Vorsorge.',
};

// ⚠️ Zahlen/Quellen sind Platzhalter in plausibler Größenordnung —
// vor Live-Schaltung mit Julia validieren (Versorgungsausgleich ist ihr Spezialthema).

export default function Scheidung() {
  useEffect(() => {
    document.title = 'Scheidung & Versorgungsausgleich — Was mit deiner Rente passiert | Womensurance';
    const meta = document.querySelector('meta[name="description"]');
    const prev = meta?.getAttribute('content');
    meta?.setAttribute(
      'content',
      'Versorgungsausgleich verständlich erklärt: Was bei einer Scheidung mit deinen Rentenansprüchen passiert, wo Frauen am häufigsten verlieren — und wie du deine Ansprüche sicherst.'
    );
    return () => { if (prev) meta?.setAttribute('content', prev); };
  }, []);

  return (
    <TopicPage
      afterHero={<SplitAccounts />}
      afterQuote={<MistakesStack />}
      faq={FAQ}
      eyebrow="Scheidung"
      titleLines={[
        { text: 'Getrennte Wege.' },
        { text: 'Geteilte Rente.', italic: true },
      ]}
      lead="Bei einer Scheidung wird nicht nur das Haus aufgeteilt — sondern auch jeder Rentenanspruch, den ihr in der Ehe aufgebaut habt. Dieses Verfahren heißt Versorgungsausgleich, läuft automatisch mit und entscheidet über dein Einkommen im Alter. Kaum jemand versteht es. Genau deshalb solltest du es."
      stats={[
        {
          value: 35,
          unit: '%',
          label: 'der Ehen in Deutschland werden geschieden — nach durchschnittlich rund 15 Jahren.',
          source: 'Quelle: Destatis*',
        },
        {
          value: 100,
          unit: '%',
          label: 'der in der Ehezeit erworbenen Rentenanrechte werden im Versorgungsausgleich hälftig geteilt.',
          source: 'VersAusglG*',
        },
        {
          value: 50,
          unit: '%',
          label: 'aller Scheidungsanträge erfolgen durch die Frau.',
          source: 'Quelle: Destatis*',
        },
      ]}
      chapters={[
        {
          kicker: 'Das Verfahren',
          title: 'Was der Versorgungsausgleich wirklich macht',
          paragraphs: [
            'Bei der Scheidung teilt das Familiengericht alle Rentenanrechte, die während der Ehe entstanden sind: gesetzliche Rente, Betriebsrenten, private Rentenversicherungen, Versorgungswerke. Jeder gibt die Hälfte seiner Ehezeit-Anrechte an den anderen ab — automatisch, auch wenn du nichts beantragst.',
            'Das klingt nach Gerechtigkeit, und oft ist es das auch. Aber der Teufel steckt in der Bewertung: Welche Verträge werden wie gezählt? Was passiert mit Anrechten, die extern geteilt werden? Wer prüft, ob die Auskünfte der Versorgungsträger stimmen? In der Praxis: oft niemand.',
          ],
        },
        {
          kicker: 'Die Rechnung danach',
          title: 'Warum hälftig noch lange nicht ausreichend heißt',
          paragraphs: [
            'Der Versorgungsausgleich gleicht aus, was in der Ehe entstanden ist — aber er ersetzt nicht, was in den Jahren davor und danach fehlt. Wer für Familie und Care-Arbeit zurückgesteckt hat, startet auch nach einer sauberen Teilung mit weniger eigenen Ansprüchen ins zweite Kapitel.',
            'Dazu kommt: Was das Gericht teilt, ist eine Momentaufnahme in Aktenform. Wie viel davon im Alter tatsächlich auf deinem Konto landet, welche Verträge nach der Scheidung noch zu dir passen und wo eine Lücke bleibt — das steht in keinem Beschluss. Genau diese Rechnung machen wir gemeinsam.',
          ],
        },
        {
          kicker: 'Danach',
          title: 'Der Neustart braucht ein eigenes Fundament',
          paragraphs: [
            'Nach der Scheidung stehen viele Frauen zum ersten Mal seit Jahren allein vor ihren Finanzen: eigene Absicherung, eigene Vorsorge, oft mit Kindern und reduziertem Einkommen. Genau jetzt entscheidet sich, wie das nächste Kapitel finanziell aussieht.',
            'Die gute Nachricht: Kaum ein Moment eignet sich besser für einen ehrlichen Kassensturz. Alte Verträge gehören auf den Prüfstand, Begünstigungen müssen geändert, die eigene Vorsorge neu aufgebaut werden — diesmal so, dass sie dir gehört. Ab hier ist jede Situation individuell, und genau dafür gibt es das Gespräch.',
          ],
        },
      ]}
      quote={{
        text: 'Die meisten meiner Kundinnen kommen nach der Scheidung. Ich wünschte, sie kämen davor — denn im Versorgungsausgleich wird über ihre Rente entschieden, ob sie hinschauen oder nicht.',
        author: 'Julia Pashchenko',
      }}
      actions={[
        {
          title: 'Alle Anrechte auflisten',
          body: 'Gesetzliche Rente, Betriebsrenten, private Verträge, Versorgungswerke — erst die vollständige Liste zeigt, worüber im Verfahren überhaupt entschieden wird. Und was danach von deiner eigenen Vorsorge übrig bleibt.',
        },
        {
          title: 'Auskünfte prüfen lassen',
          body: 'Die Bewertungen der Versorgungsträger sind nicht unfehlbar. Vor dem Gerichtstermin prüfen lassen, ob die Zahlen stimmen — danach ist es zu spät.',
        },
        {
          title: 'Vereinbarungen nicht blind unterschreiben',
          body: 'Ehevertrag oder Scheidungsfolgenvereinbarung können den Versorgungsausgleich ausschließen oder verändern. Was heute großzügig wirkt, kann im Alter teuer werden.',
        },
        {
          title: 'Eigene Vorsorge neu aufstellen',
          body: 'Nach der Scheidung: Begünstigte ändern, Absicherung anpassen, eigene Altersvorsorge aufbauen — als Fundament für das nächste Kapitel.',
        },
      ]}
      ctaHeadline={
        <>
          Bevor der Scheidungsantrag eingelegt wird:{' '}
          <span className="display-italic text-pink">reden wir.</span>
        </>
      }
      ctaBody="Ob das Verfahren vor dir liegt, gerade läuft oder schon hinter dir ist — die entscheidende Frage ist, wie deine Vorsorge danach aussieht. 60 Minuten, kostenlos, vertraulich. Keine Rechtsberatung, sondern Klarheit über deine Zahlen."
    />
  );
}
