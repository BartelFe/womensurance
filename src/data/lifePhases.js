// Lebensphasen für Section "Dein Leben" (horizontaler Scroll).
// `details` = aufklappbarer Zusatztext in der Kachel (Karten 1–4).
// `subpage` = eigene Unterseite (Teilzeit/Care-Arbeit → Rentenlücke, Scheidung → Versorgungsausgleich).
// ⚠️ Alle Texte sind redaktionelle Platzhalter — vor Live-Schaltung mit Julia abstimmen.

export const lifePhases = [
  {
    id: 'study',
    age: '18–24',
    title: 'Ausbildung/Studium',
    body: 'Du investierst in dich. Ein Studium oder eine Ausbildung — Zeit ohne nennenswertes Einkommen, aber mit der Grundlage für alles, was kommt.',
    insurance: 'Krankenversicherung der Eltern, später eigene. Haftpflicht. Erste Berufsunfähigkeit.',
    details:
      'In dieser Phase fühlt sich Vorsorge weit weg an — dabei ist sie hier am günstigsten. Eine Berufsunfähigkeitsversicherung kostet mit Anfang 20 oft nur die Hälfte, weil du jung und gesund bist. Auch wichtig: Ab 18 haftest du selbst — ohne private Haftpflicht kann ein Moment Unachtsamkeit zur lebenslangen Schuld werden. Und wer früh auch nur kleine Beträge zurücklegt, lässt den Zinseszins vier Jahrzehnte für sich arbeiten.',
  },
  {
    id: 'firstjob',
    age: '24–28',
    title: 'Erster Job',
    body: 'Vollzeit, eigenes Gehalt, eigene Wohnung. Hier wird die Weiche gestellt — und genau hier setzt die Lücke unbemerkt ein.',
    insurance: 'Berufsunfähigkeit jetzt abschließen ist günstiger als später. Erste Vorsorge.',
    details:
      'Das erste eigene Gehalt ist der Moment, in dem aus „später mal" ein „jetzt" wird. Wer hier 10–15 % vom Netto in die eigene Vorsorge lenkt, spürt es kaum — und baut trotzdem ein Fundament, das keine spätere Gehaltserhöhung ersetzen kann. Gleichzeitig gilt: Schon beim Gehaltsverhandeln beginnt der Pay Gap. Frauen verhandeln seltener nach — und jede Lücke im Einstiegsgehalt wächst über Jahrzehnte mit.',
  },
  {
    id: 'partner',
    age: '28–32',
    title: 'Beziehung',
    body: 'Zusammenziehen, vielleicht heiraten. Finanzen werden geteilt — aber selten gleich. Wer hat welches Konto, welche Police, welche Vollmacht?',
    insurance: 'Gemeinsame Haftpflicht. Risikoleben für Verbindlichkeiten. Verfügungen klären.',
    details:
      'Liebe ist kein Finanzkonzept. Gemeinsame Konten, gemeinsame Kredite, gemeinsame Pläne — gut. Aber: Behalte immer eigenes Geld, eigene Vorsorge, eigene Absicherung. Statistisch trägt in Paarhaushalten meist einer die Finanzentscheidungen — und das ist selten die Frau. Wer die eigenen Verträge kennt und eine eigene Altersvorsorge bespart, bleibt handlungsfähig. In jeder Lebenslage.',
  },
  {
    id: 'children',
    age: '30–35',
    title: 'Kind',
    body: 'Elternzeit. Karenzgeld. Reduzierte Rentenpunkte. Die emotional größte und finanziell tiefste Zäsur — fast immer für die Mutter.',
    insurance: 'Risikoleben für Kind. Vorsorge prüfen. Ehegattensplitting verstehen.',
    details:
      'Jedes Jahr Elternzeit hinterlässt Spuren auf dem Rentenkonto — Kindererziehungszeiten gleichen nur einen Teil aus. Dazu kommt: Wer nach der Elternzeit in Teilzeit zurückkehrt, verlängert die Lücke oft um Jahre. Was hilft: die Vorsorge während der Elternzeit nicht pausieren (auch kleine Beiträge zählen), Ausgleichszahlungen vom Partner mitdenken und die eigene Berufsunfähigkeitsabsicherung nicht kündigen — gerade jetzt trägst du Verantwortung für mehr als dich selbst.',
  },
  {
    id: 'parttime',
    age: '35–50',
    title: 'Teilzeit / Care-Arbeit',
    body: '49 % aller erwerbstätigen Frauen arbeiten Teilzeit — oft zusätzlich zu unbezahlter Sorgearbeit. Jede Stunde weniger ist auch ein Euro weniger Rente, multipliziert über Jahre.',
    insurance: 'BU-Höhe an reduziertes Einkommen anpassen. Vorsorgelücke aktiv ausgleichen.',
    subpage: '/rentenluecke',
    subpageLabel: 'Deine Rentenlücke verstehen & schließen',
  },
  {
    id: 'divorce',
    age: '30–55',
    title: 'Scheidung',
    body: 'Jede dritte Ehe wird geschieden. Im Versorgungsausgleich entscheidet sich, was von deinen Rentenansprüchen bleibt — und hier verlieren Frauen am häufigsten, ohne es zu merken.',
    insurance: 'Versorgungsausgleich verstehen. Eigene Policen sichern. Ansprüche prüfen lassen.',
    subpage: '/scheidung',
    subpageLabel: 'Was du jetzt tun kannst',
  },
];
// Hinweis: Die frühere 7. Kachel "Rente" ist bewusst entfernt —
// das Rententhema lebt in der Unterseite /rentenluecke (Teilzeit/Care-Arbeit).

export const lifeToggles = [
  { id: 'parttime', label: 'Teilzeit gearbeitet', impact: '+12 %' },
  { id: 'children', label: 'Kinder bekommen', impact: '+8 %' },
  { id: 'care', label: 'Angehörige gepflegt', impact: '+6 %' },
  { id: 'pause', label: 'Karrierepause', impact: '+5 %' },
];
