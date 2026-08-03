/**
 * Eine Kundinnenstimme (Sektion "Stimmen" auf der Startseite).
 *
 * Zwei Dinge sind hier bewusst streng:
 *
 * 1. `einverstaendnis` muss angehakt sein, sonst laesst sich das Dokument nicht
 *    veroeffentlichen. Die Auftragsverarbeitungsvereinbarung mit der DVM nennt
 *    "in Testimonials genannte Personen" ausdruecklich als betroffene Gruppe.
 *    Der Haken ist die Erinnerung daran, dass die Zustimmung vorliegen muss.
 *
 * 2. Die Sektion blendet sich komplett aus, solange keine Stimme veroeffentlicht
 *    ist. Erfundene Beispielstimmen duerfen nicht online gehen (§ 5b Abs. 3 UWG).
 */
export default {
  name: 'stimme',
  title: 'Stimme (Testimonial)',
  type: 'document',
  fields: [
    {
      name: 'einverstaendnis',
      title: 'Einverstaendnis der genannten Person liegt vor',
      type: 'boolean',
      initialValue: false,
      description:
        'Pflicht. Die Person muss der Veroeffentlichung ihres Zitats zugestimmt haben. '
        + 'Ohne Haken laesst sich die Stimme nicht veroeffentlichen.',
      validation: (Rule) =>
        Rule.required().custom((wert) =>
          wert === true ? true : 'Ohne Einverstaendnis darf die Stimme nicht veroeffentlicht werden.'
        ),
    },
    {
      name: 'reihenfolge',
      title: 'Reihenfolge',
      type: 'number',
      description: '1 = steht ganz oben.',
      validation: (Rule) => Rule.required().integer().min(1),
    },
    {
      name: 'zitat',
      title: 'Zitat',
      type: 'text',
      rows: 5,
      description:
        'Woertlich, in der Sprache der Kundin. Gute Laenge sind 40 bis 70 Woerter. '
        + 'Anfuehrungszeichen setzt die Website selbst, bitte nicht mittippen.',
      validation: (Rule) =>
        Rule.required()
          .min(80)
          .max(420)
          .warning('Unter 80 Zeichen wirkt das Zitat duenn, ueber 420 Zeichen wird der Block sehr hoch.'),
    },
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'So, wie die Person genannt werden moechte. Beispiel: "Sarah M.".',
      validation: (Rule) => Rule.required().max(40),
    },
    {
      name: 'rolle',
      title: 'Beruf',
      type: 'string',
      description: 'Beispiel: Pflegefachkraft.',
      validation: (Rule) => Rule.required().max(40),
    },
    {
      name: 'alter',
      title: 'Alter',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(18).max(99),
    },
    {
      name: 'ort',
      title: 'Ort',
      type: 'string',
      validation: (Rule) => Rule.required().max(40),
    },
    {
      name: 'kontext',
      title: 'Kontext',
      type: 'string',
      description:
        'Die kleine Zeile rechts unter dem Namen, Angaben mit Mittelpunkt getrennt. '
        + 'Beispiel: "2 Kinder · Teilzeit · ohne BU bis 32".',
      validation: (Rule) => Rule.required().max(80),
    },
  ],
  orderings: [
    { title: 'Reihenfolge auf der Seite', name: 'reihenfolgeAsc', by: [{ field: 'reihenfolge', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'name', rolle: 'rolle', reihenfolge: 'reihenfolge', ok: 'einverstaendnis' },
    prepare({ title, rolle, reihenfolge, ok }) {
      return {
        title: `${reihenfolge ?? '?'}. ${title || '(ohne Name)'}`,
        subtitle: `${rolle || ''}${ok ? '' : '  ·  Einverstaendnis fehlt'}`,
      };
    },
  },
};
