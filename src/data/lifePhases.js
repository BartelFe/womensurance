// Lebensphasen für Section 03 (Dein Leben). Horizontaler scroll mit Toggles.

export const lifePhases = [
  {
    id: 'study',
    age: '18–24',
    title: 'Ausbildung',
    body: 'Du investierst in dich. Ein Studium oder eine Ausbildung — Zeit ohne nennenswertes Einkommen, aber mit der Grundlage für alles, was kommt.',
    insurance: 'Krankenversicherung der Eltern, später eigene. Haftpflicht. Erste Berufsunfähigkeit.',
  },
  {
    id: 'firstjob',
    age: '24–28',
    title: 'Erster Job',
    body: 'Vollzeit, eigenes Gehalt, eigene Wohnung. Hier wird die Weiche gestellt — und genau hier setzt die Lücke unbemerkt ein.',
    insurance: 'Berufsunfähigkeit jetzt abschließen ist günstiger als später. Erste Vorsorge.',
  },
  {
    id: 'partner',
    age: '28–32',
    title: 'Beziehung',
    body: 'Zusammenziehen, vielleicht heiraten. Finanzen werden geteilt — aber selten gleich. Wer hat welches Konto, welche Police, welche Vollmacht?',
    insurance: 'Gemeinsame Haftpflicht. Risikoleben für Verbindlichkeiten. Verfügungen klären.',
  },
  {
    id: 'children',
    age: '30–35',
    title: 'Kind',
    body: 'Elternzeit. Karenzgeld. Reduzierte Rentenpunkte. Die emotional größte und finanziell tiefste Zäsur — fast immer für die Mutter.',
    insurance: 'Risikoleben für Kind. Vorsorge prüfen. Ehegattensplitting verstehen.',
  },
  {
    id: 'parttime',
    age: '35–50',
    title: 'Teilzeit',
    body: '49 % aller erwerbstätigen Frauen arbeiten Teilzeit. Jede Stunde weniger ist auch ein Euro weniger Rente — multipliziert über 15 Jahre.',
    insurance: 'BU-Höhe an reduziertes Einkommen anpassen. Vorsorgelücke aktiv ausgleichen.',
  },
  {
    id: 'pause',
    age: '45–55',
    title: 'Care-Arbeit',
    body: 'Pflege der Eltern, oft zusätzlich zur Erwerbstätigkeit. Oft unbezahlt, oft unsichtbar — und wieder: mehr für Frauen als für Männer.',
    insurance: 'Eigene BU prüfen — Pflege belastet auch dich. Generationenvorsorge.',
  },
  {
    id: 'retirement',
    age: '67+',
    title: 'Rente',
    body: 'Die Lücke wird zur Realität. Was über vier Jahrzehnte unsichtbar war, steht plötzlich auf dem Rentenbescheid. Aber sie ist kein Schicksal.',
    insurance: 'Private Rente, Wohneigentum, ETF-Sparplan, Witwenrente verstehen.',
  },
];

export const lifeToggles = [
  { id: 'parttime', label: 'Teilzeit gearbeitet', impact: '+12 %' },
  { id: 'children', label: 'Kinder bekommen', impact: '+8 %' },
  { id: 'care', label: 'Angehörige gepflegt', impact: '+6 %' },
  { id: 'pause', label: 'Karrierepause', impact: '+5 %' },
];
