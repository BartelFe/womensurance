/** Einer der vier Schritte in der Sektion "4 Schritte. Ein Konzept." */
export default {
  name: 'methodenschritt',
  title: 'Schritt der Beratung',
  type: 'document',
  fields: [
    {
      name: 'reihenfolge',
      title: 'Reihenfolge',
      type: 'number',
      description: '1 bis 4. Die Nummer wird auf der Karte gross angezeigt.',
      validation: (Rule) => Rule.required().integer().min(1).max(9),
    },
    {
      name: 'titel',
      title: 'Titel',
      type: 'string',
      description: 'Ein Wort oder eine kurze Fuegung. Beispiel: "Bestandsaufnahme".',
      validation: (Rule) => Rule.required().max(28).warning('Ueber 28 Zeichen bricht der Titel auf der Karte um.'),
    },
    {
      name: 'body',
      title: 'Text',
      type: 'text',
      rows: 5,
      description: 'Zwei bis vier Saetze. Die Karten sind bewusst flach, sehr lange Texte sprengen den Rhythmus.',
      validation: (Rule) => Rule.required().max(400).warning('Ueber 400 Zeichen wird die Karte deutlich hoeher als die anderen.'),
    },
  ],
  orderings: [
    { title: 'Reihenfolge auf der Seite', name: 'reihenfolgeAsc', by: [{ field: 'reihenfolge', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'titel', reihenfolge: 'reihenfolge' },
    prepare({ title, reihenfolge }) {
      return { title: `${String(reihenfolge ?? 0).padStart(2, '0')} ${title || '(ohne Titel)'}` };
    },
  },
};
