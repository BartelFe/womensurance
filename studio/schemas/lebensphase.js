/**
 * Eine der sechs Kacheln in der Sektion "Dein Leben".
 *
 * `kennung` ist die technische Kennung der Phase. Daran haengen die Sprungziele
 * aus dem Navigations-Dropdown und die Verlinkung zu den Unterseiten. Sie darf
 * nicht veraendert werden, deshalb steht sie schreibgeschuetzt im Formular.
 */
export default {
  name: 'lebensphase',
  title: 'Lebensphase',
  type: 'document',
  fields: [
    {
      name: 'kennung',
      title: 'Technische Kennung',
      type: 'string',
      readOnly: true,
      description: 'Nicht aenderbar. Daran haengen die Sprungmarken der Navigation.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'reihenfolge',
      title: 'Reihenfolge',
      type: 'number',
      description: 'Bestimmt, an welcher Stelle die Kachel auf der Startseite steht (1 = oben).',
      validation: (Rule) => Rule.required().integer().min(1),
    },
    {
      name: 'titel',
      title: 'Titel der Kachel',
      type: 'string',
      description: 'Kurz halten. Beispiel: "Erster Job".',
      validation: (Rule) => Rule.required().max(30).warning('Laenger als 30 Zeichen bricht die Kachelueberschrift um.'),
    },
    {
      name: 'alter',
      title: 'Altersspanne',
      type: 'string',
      description: 'Beispiel: 24–28. Erscheint klein ueber dem Titel.',
      validation: (Rule) => Rule.required().max(12),
    },
    {
      name: 'body',
      title: 'Einleitungstext',
      type: 'array',
      of: [{ type: 'absatz' }],
      description: 'Der immer sichtbare Text auf der Kachel. Ein bis zwei Absaetze.',
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: 'versicherungen',
      title: 'Was jetzt zaehlt',
      type: 'string',
      description:
        'Die Stichwortzeile unten auf der Kachel, Begriffe mit Punkt getrennt. '
        + 'Beispiel: "Berufsunfaehigkeitsversicherung. Altersvorsorge. Haftpflicht."',
      validation: (Rule) => Rule.required().max(180),
    },
    {
      name: 'details',
      title: 'Aufklapptext ("Mehr erfahren")',
      type: 'array',
      of: [{ type: 'absatz' }],
      description:
        'Erscheint, wenn die Besucherin auf "Mehr erfahren" klickt. Leer lassen, wenn die Kachel '
        + 'stattdessen auf eine Unterseite verweist (siehe unten). Beides zusammen geht nicht.',
    },
    {
      name: 'unterseite',
      title: 'Verweist auf Unterseite',
      type: 'string',
      options: {
        list: [
          { title: 'Keine', value: '' },
          { title: 'Rentenluecke (Teilzeit / Care-Arbeit)', value: '/rentenluecke' },
          { title: 'Scheidung (Versorgungsausgleich)', value: '/scheidung' },
        ],
      },
      description: 'Statt eines Aufklapptexts fuehrt die Kachel dann auf die jeweilige Unterseite.',
    },
    {
      name: 'unterseiteLabel',
      title: 'Beschriftung des Unterseiten-Links',
      type: 'string',
      description: 'Nur ausfuellen, wenn oben eine Unterseite gewaehlt ist.',
      validation: (Rule) => Rule.max(60),
    },
    {
      name: 'unterseiteKurz',
      title: 'Beschriftung im Navigationsmenue',
      type: 'string',
      description: 'Kuerzere Fassung fuer das Aufklappmenue oben auf der Seite.',
      validation: (Rule) => Rule.max(45),
    },
  ],
  orderings: [
    {
      title: 'Reihenfolge auf der Seite',
      name: 'reihenfolgeAsc',
      by: [{ field: 'reihenfolge', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'titel', alter: 'alter', reihenfolge: 'reihenfolge' },
    prepare({ title, alter, reihenfolge }) {
      return { title: `${reihenfolge ?? '?'}. ${title || '(ohne Titel)'}`, subtitle: alter };
    },
  },
};
