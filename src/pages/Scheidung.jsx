import { useEffect } from 'react';
import TopicPage from '../components/topic/TopicPage';
import SplitAccounts from '../components/topic/SplitAccounts';
import MistakesStack from '../components/topic/MistakesStack';
import { CALL_MINUTES } from '../config/site';

// FAQ auf "versorgungsausgleich"-Suchintention optimiert (~23.500 Suchen/Monat)
// — Feinschliff in dedizierter SEO-Session.
const FAQ = {
  title: (
    <>
      Häufige Fragen zum{' '}
      <span className="display-italic text-pink">Versorgungsausgleich</span>
    </>
  ),
  items: [
    {
      q: 'Was ist der Versorgungsausgleich?',
      a: 'Der Versorgungsausgleich regelt, wie die während der Ehe erworbenen Renten- und Versorgungsansprüche zwischen beiden Ehepartnern aufgeteilt werden. Das Verfahren wird im Rahmen der Scheidung grundsätzlich automatisch vom Familiengericht durchgeführt.',
    },
    {
      q: 'Wie wird der Versorgungsausgleich berechnet?',
      a: 'Für jeden Rentenanspruch wird geprüft, welcher Teil während der Ehe erworben wurde. Dieser sogenannte Ehezeitanteil wird grundsätzlich zwischen beiden Ehepartnern aufgeteilt. Die Berechnungen erfolgen durch die jeweiligen Versorgungsträger und bilden die Grundlage für die Entscheidung des Familiengerichts.',
    },
    {
      q: 'Welche Rentenansprüche werden berücksichtigt?',
      a: 'Zum Versorgungsausgleich gehören grundsätzlich die gesetzliche Rentenversicherung, Betriebsrenten, Beamtenversorgungen, berufsständische Versorgungswerke sowie viele private Altersvorsorgeverträge. Welche Ansprüche im Einzelfall berücksichtigt werden, hängt von der jeweiligen Vertragsart ab.',
    },
    {
      q: 'Kann man den Versorgungsausgleich ausschließen?',
      a: 'Ja. Durch einen notariellen Ehevertrag oder eine Scheidungsfolgenvereinbarung kann der Versorgungsausgleich ganz oder teilweise ausgeschlossen oder verändert werden. Bevor du einer solchen Vereinbarung zustimmst, solltest du genau verstehen, welche Auswirkungen sie auf deine spätere Altersvorsorge haben kann.',
    },
    {
      q: 'Was passiert bei einer kurzen Ehe?',
      a: 'Bei einer Ehe von bis zu drei Jahren wird der Versorgungsausgleich grundsätzlich nur durchgeführt, wenn einer der Ehepartner ihn beantragt. Ob sich ein Antrag lohnt, hängt von der individuellen Situation ab.',
    },
    {
      q: 'Kann der Versorgungsausgleich später noch geändert werden?',
      a: 'Änderungen sind nur in wenigen gesetzlich geregelten Ausnahmefällen möglich. Deshalb ist es wichtig, die Unterlagen und Berechnungen bereits während des Scheidungsverfahrens sorgfältig zu prüfen und offene Fragen frühzeitig zu klären.',
    },
  ],
  note: 'Hinweis: Die Antworten dienen einer ersten Orientierung und ersetzen keine Rechtsberatung. Für rechtliche Fragen solltest du dich an eine Rechtsanwältin oder einen Notar wenden. Ich unterstütze dich dabei, die Auswirkungen auf deine Altersvorsorge und Versicherungen verständlich einzuordnen.',
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
      lead="Mit einer Scheidung endet nicht nur eine Ehe. Auch die gemeinsame finanzielle Zukunft wird neu geregelt. Dabei werden die während der Ehe erworbenen Renten- und Versorgungsansprüche grundsätzlich zwischen beiden Ehepartnern aufgeteilt. Dieses Verfahren nennt sich Versorgungsausgleich. Was das für deine persönliche Altersvorsorge bedeutet, wissen die wenigsten. Genau deshalb schauen wir uns gemeinsam an, welche Auswirkungen das auf deine spätere Rente hat und wo du gegebenenfalls neu vorsorgen solltest."
      stats={[
        {
          value: 35,
          unit: '%',
          label: 'der Ehen in Deutschland werden nach durchschnittlich rund 15 Jahren geschieden.',
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
            'Mit einer Scheidung verändert sich nicht nur dein Alltag, sondern auch deine finanzielle Zukunft. Die Renten- und Versorgungsansprüche, die während der Ehe aufgebaut wurden, werden grundsätzlich zwischen beiden Ehepartnern aufgeteilt. Dieses Verfahren nennt sich Versorgungsausgleich und läuft automatisch über das Familiengericht.',
            'Gerade deshalb ist es wichtig zu wissen, welche Ansprüche berücksichtigt werden und welche Auswirkungen die Aufteilung auf deine spätere Rente hat. Wer seine Unterlagen versteht und die Berechnung nachvollziehen kann, trifft bessere Entscheidungen für die eigene Zukunft.',
          ],
        },
        {
          kicker: 'Die Rechnung danach',
          title: 'Warum der Versorgungsausgleich allein oft nicht ausreicht',
          paragraphs: [
            'Der Versorgungsausgleich verteilt die Rentenansprüche, die während der Ehe aufgebaut wurden. Was er jedoch nicht ausgleicht, sind die finanziellen Auswirkungen von Elternzeit, Teilzeit oder längeren Erwerbsunterbrechungen. Gerade Frauen haben dadurch häufig auch nach der Scheidung eine geringere Altersvorsorge.',
            'Nach einer Scheidung lohnt es sich deshalb, die eigene finanzielle Situation neu zu betrachten. Welche Rentenansprüche bleiben bestehen? Welche Versicherungen müssen angepasst werden? Und wo entstehen Versorgungslücken? Gemeinsam schaffen wir Klarheit und entwickeln eine Lösung, die zu deiner neuen Lebenssituation passt.',
          ],
        },
        {
          kicker: 'Danach',
          title: 'Der Neustart braucht ein eigenes Fundament',
          paragraphs: [
            'Nach einer Scheidung beginnt nicht nur ein neuer Lebensabschnitt, sondern oft auch ein finanzieller Neuanfang. Jetzt ist der richtige Zeitpunkt, deine Absicherung und Altersvorsorge neu aufzustellen, passend zu deinem Leben und deinen Zukunftsplänen.',
            'Gemeinsam prüfen wir bestehende Verträge, passen Bezugsberechtigungen an und schließen mögliche Versorgungslücken. So schaffst du dir Schritt für Schritt ein finanzielles Fundament, das unabhängig ist und zu deiner neuen Lebenssituation passt.',
          ],
        },
      ]}
      quote={{
        text: 'Die meisten meiner Kundinnen treffe ich erst, wenn die Scheidung bereits abgeschlossen ist. Dann können wir vieles neu aufbauen, aber manches nicht mehr verändern. Deshalb wünsche ich mir, Frauen schon vorher begleiten zu dürfen.',
        author: 'Julia Pashchenko',
      }}
      actionsHeadline={
        <>
          Was du jetzt <span className="display-italic text-pink-display">konkret</span> tun kannst
        </>
      }
      actions={[
        {
          title: 'Alle Rentenansprüche sammeln',
          lead: 'Erst die vollständige Übersicht schafft Klarheit.',
          body: 'Dazu gehören die gesetzliche Rente, Betriebsrenten, private Rentenversicherungen und mögliche Versorgungswerke. Nur wenn alle Ansprüche bekannt sind, lässt sich einschätzen, welche Auswirkungen der Versorgungsausgleich auf deine spätere Altersvorsorge hat.',
        },
        {
          title: 'Die Unterlagen verstehen und prüfen',
          lead: 'Nicht jede Zahl erklärt sich von selbst.',
          body: 'Die Berechnungen im Versorgungsausgleich sind oft schwer nachvollziehbar. Deshalb lohnt es sich, die Unterlagen genau anzuschauen und zu verstehen, welche Rentenansprüche berücksichtigt wurden und was das für deine persönliche Situation bedeutet.',
        },
        {
          title: 'Vereinbarungen bewusst entscheiden',
          lead: 'Schnelle Lösungen sind nicht immer die besten.',
          body: 'Eheverträge oder Scheidungsfolgenvereinbarungen können den Versorgungsausgleich beeinflussen. Bevor du etwas unterschreibst, solltest du verstehen, welche Auswirkungen die Regelung langfristig auf deine Altersvorsorge haben kann.',
        },
        {
          title: 'Deine Vorsorge neu aufstellen',
          lead: 'Der Neustart braucht ein eigenes Fundament.',
          body: 'Nach der Scheidung sollten Bezugsberechtigungen, gemeinsame Verträge und deine persönliche Absicherung überprüft werden. Gemeinsam schauen wir, wie du deine Altersvorsorge und finanzielle Sicherheit passend zu deiner neuen Lebenssituation aufbauen kannst.',
        },
      ]}
      ctaHeadline={
        <>
          Bevor der Scheidungsantrag gestellt wird,{' '}
          <span className="display-italic text-pink">lass uns sprechen.</span>
        </>
      }
      ctaBody={`Ob das Verfahren noch vor dir liegt, gerade läuft oder bereits abgeschlossen ist: Gemeinsam verschaffen wir dir Klarheit über deine Altersvorsorge, deine Versicherungen und die nächsten sinnvollen Schritte. ${CALL_MINUTES} Minuten. Kostenlos. Vertraulich. Auf Augenhöhe.`}
    />
  );
}
