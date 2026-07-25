import { useEffect } from 'react';
import TopicPage from '../components/topic/TopicPage';

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
      eyebrow="Themenseite · Scheidung"
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
          label: 'deiner Ansprüche stehen auf dem Spiel, wenn Verträge und Anrechte falsch bewertet werden.',
          source: 'Platzhalter — mit Julia präzisieren*',
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
          kicker: 'Die Falle',
          title: 'Warum ausgerechnet Frauen hier verlieren',
          paragraphs: [
            'Eigentlich ist der Versorgungsausgleich für den wirtschaftlich schwächeren Partner gedacht — meistens die Frau, die für Familie und Care-Arbeit zurückgesteckt hat. Doch genau hier passieren die teuersten Fehler: falsch bewertete Verträge, vergessene Anrechte, unüberprüfte Auskünfte, nachteilige Vereinbarungen im Ehevertrag oder in der Scheidungsfolgenvereinbarung.',
            'Ein einziger übersehener Vertrag oder eine ungeprüfte Bewertung kann im Alter hunderte Euro im Monat kosten — über zwanzig Rentenjahre gerechnet ein sechsstelliger Betrag. Und anders als beim Haus merkt man den Verlust erst Jahrzehnte später, wenn nichts mehr zu korrigieren ist.',
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
          body: 'Gesetzliche Rente, Betriebsrenten, private Verträge, Versorgungswerke — erst die vollständige Liste zeigt, was überhaupt geteilt wird. Vergessene Verträge sind der häufigste Fehler.',
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
      ctaHeadline="Bevor unterschrieben wird: reden wir."
      ctaBody="Ob du mitten im Verfahren steckst, es vor dir liegt oder schon hinter dir — deine Ansprüche verdienen einen zweiten Blick. 30 Minuten, kostenlos, vertraulich. Keine Rechtsberatung, sondern Klarheit über deine Vorsorge."
    />
  );
}
