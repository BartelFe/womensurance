/**
 * Eine Kennzahl aus dem Datenband der Startseite.
 *
 * Achtung: Der Wert der Kennzahl "Gender Pension Gap" ist zugleich der
 * Ausgangswert des Rechners im Hero. Aendert sich die Zahl, aendert sich also
 * auch die Zahl, die die Besucherin beim Klicken der Lebensereignisse sieht.
 * Deshalb steht die Quelle als Pflichtfeld daneben.
 */
export default {
  name: 'kennzahl',
  title: 'Kennzahl',
  type: 'document',
  fields: [
    {
      name: 'kennung',
      title: 'Technische Kennung',
      type: 'string',
      readOnly: true,
      description: 'Nicht aenderbar.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'reihenfolge',
      title: 'Reihenfolge',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(1),
    },
    {
      name: 'wert',
      title: 'Wert',
      type: 'number',
      description: 'Nur die Zahl, ohne Prozentzeichen. Dezimaltrennzeichen ist der Punkt, also 39.4 fuer 39,4.',
      validation: (Rule) => Rule.required().min(0).max(1000),
    },
    {
      name: 'einheit',
      title: 'Einheit',
      type: 'string',
      description: 'Beispiel: %',
      validation: (Rule) => Rule.max(6),
    },
    {
      name: 'label',
      title: 'Bezeichnung',
      type: 'string',
      description: 'Beispiel: "Gender Pension Gap".',
      validation: (Rule) => Rule.required().max(48),
    },
    {
      name: 'hinweis',
      title: 'Erklaerender Satz',
      type: 'text',
      rows: 3,
      description: 'Ein Satz, der die Zahl einordnet.',
      validation: (Rule) => Rule.required().max(220),
    },
    {
      name: 'quelle',
      title: 'Quelle',
      type: 'string',
      description:
        'Pflicht. Wer hat die Zahl erhoben und aus welchem Jahr stammt sie? '
        + 'Beispiel: "Statistisches Bundesamt, 2024". Ohne Quelle keine Zahl auf der Seite.',
      validation: (Rule) => Rule.required().max(120),
    },
  ],
  orderings: [
    { title: 'Reihenfolge auf der Seite', name: 'reihenfolgeAsc', by: [{ field: 'reihenfolge', direction: 'asc' }] },
  ],
  preview: {
    select: { label: 'label', wert: 'wert', einheit: 'einheit', quelle: 'quelle' },
    prepare({ label, wert, einheit, quelle }) {
      return { title: `${wert ?? '?'}${einheit || ''} ${label || ''}`, subtitle: quelle };
    },
  },
};
