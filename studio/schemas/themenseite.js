/**
 * Die beiden Unterseiten "Rentenluecke" und "Scheidung". Beide haben denselben
 * Aufbau: Kopf, Zahlenband, Kapitel, Zitat, Handlungsliste, Fragen, Abschluss.
 *
 * Nicht redaktionell und deshalb hier nicht zu finden: der Rentenluecken-Rechner,
 * die Grafik der geteilten Rentenkonten und die Grafik zum Gender Pension Gap.
 * Das sind Rechen- und Zeichenbausteine, keine Texte.
 */
export default {
  name: 'themenseite',
  title: 'Unterseite',
  type: 'document',
  groups: [
    { name: 'kopf', title: 'Kopf', default: true },
    { name: 'zahlen', title: 'Zahlenband' },
    { name: 'kapitel', title: 'Kapitel' },
    { name: 'handlungen', title: 'Was du tun kannst' },
    { name: 'fehler', title: 'Haeufige Fehler' },
    { name: 'faq', title: 'Haeufige Fragen' },
    { name: 'abschluss', title: 'Abschluss' },
    { name: 'suchmaschine', title: 'SEO' },
  ],
  fields: [
    {
      name: 'kennung',
      title: 'Technische Kennung',
      type: 'string',
      readOnly: true,
      group: 'kopf',
      description: 'Nicht aenderbar. Legt fest, welche Adresse die Seite hat.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'eyebrow',
      title: 'Kleine Zeile ueber dem Titel',
      type: 'string',
      group: 'kopf',
      description: 'Wird in Grossbuchstaben dargestellt. Beispiel: "Teilzeit / Care-Arbeit".',
      validation: (Rule) => Rule.required().max(32),
    },
    {
      name: 'titelZeilen',
      title: 'Grosse Ueberschrift',
      type: 'array',
      of: [{ type: 'satzteil' }],
      group: 'kopf',
      validation: (Rule) => Rule.required().min(1).max(4),
    },
    {
      name: 'lead',
      title: 'Einleitung',
      type: 'text',
      rows: 6,
      group: 'kopf',
      description: 'Der Absatz direkt unter der Ueberschrift.',
      validation: (Rule) => Rule.required().max(800),
    },

    {
      name: 'kennzahlen',
      title: 'Drei Zahlen',
      type: 'array',
      group: 'zahlen',
      description: 'Genau drei, sie stehen nebeneinander in einem dreispaltigen Raster.',
      of: [
        {
          type: 'object',
          name: 'seitenkennzahl',
          fields: [
            {
              name: 'wert',
              title: 'Wert',
              type: 'number',
              description: 'Nur die Zahl. Dezimaltrennzeichen ist der Punkt, also 36.0 fuer 36,0.',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'nachkommastellen',
              title: 'Nachkommastellen',
              type: 'number',
              initialValue: 0,
              description: '0 fuer ganze Zahlen, 1 fuer eine Nachkommastelle.',
              validation: (Rule) => Rule.required().integer().min(0).max(2),
            },
            { name: 'einheit', title: 'Einheit', type: 'string', validation: (Rule) => Rule.max(6) },
            {
              name: 'label',
              title: 'Erklaerung',
              type: 'text',
              rows: 3,
              description: 'Schliesst den Satz an die Zahl an. Etwa 100 Zeichen sind ideal.',
              validation: (Rule) => Rule.required().max(180),
            },
            {
              name: 'quelle',
              title: 'Quelle',
              type: 'string',
              description: 'Pflicht. Beispiel: "Quelle: Statistisches Bundesamt, 2024".',
              validation: (Rule) => Rule.required().max(120),
            },
          ],
          preview: { select: { title: 'label', subtitle: 'quelle' } },
        },
      ],
      validation: (Rule) => Rule.required().length(3).error('Es muessen genau drei Zahlen sein.'),
    },

    {
      name: 'kapitel',
      title: 'Kapitel',
      type: 'array',
      group: 'kapitel',
      of: [
        {
          type: 'object',
          name: 'kapiteleintrag',
          fields: [
            {
              name: 'kicker',
              title: 'Kleine Zeile darueber',
              type: 'string',
              description: 'Beispiel: "Der Mechanismus".',
              validation: (Rule) => Rule.required().max(32),
            },
            {
              name: 'titel',
              title: 'Ueberschrift',
              type: 'string',
              validation: (Rule) => Rule.required().max(70),
            },
            {
              name: 'absaetze',
              title: 'Text',
              type: 'array',
              of: [{ type: 'absatz' }],
              validation: (Rule) => Rule.required().min(1),
            },
          ],
          preview: { select: { title: 'titel', subtitle: 'kicker' } },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    },

    {
      name: 'zitat',
      title: 'Zitat',
      type: 'object',
      group: 'kapitel',
      fields: [
        {
          name: 'text',
          title: 'Text',
          type: 'text',
          rows: 4,
          validation: (Rule) => Rule.required().max(320),
        },
        { name: 'autor', title: 'Autorin', type: 'string', validation: (Rule) => Rule.required().max(40) },
      ],
    },

    {
      name: 'handlungenUeberschrift',
      title: 'Ueberschrift',
      type: 'array',
      of: [{ type: 'satzteil' }],
      group: 'handlungen',
      description: 'Leer lassen, wenn die Standardueberschrift stehen bleiben soll.',
    },
    {
      name: 'handlungen',
      title: 'Karten',
      type: 'array',
      group: 'handlungen',
      of: [
        {
          type: 'object',
          name: 'handlung',
          fields: [
            { name: 'titel', title: 'Titel', type: 'string', validation: (Rule) => Rule.required().max(60) },
            {
              name: 'lead',
              title: 'Merksatz',
              type: 'string',
              description: 'Optionaler Satz ueber dem Text. Beispiel: "Erst die vollstaendige Uebersicht schafft Klarheit."',
              validation: (Rule) => Rule.max(90),
            },
            {
              name: 'body',
              title: 'Text',
              type: 'text',
              rows: 5,
              validation: (Rule) => Rule.required().max(500),
            },
          ],
          preview: { select: { title: 'titel', subtitle: 'lead' } },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    },

    {
      name: 'fehlerUeberschrift',
      title: 'Ueberschrift',
      type: 'array',
      of: [{ type: 'satzteil' }],
      group: 'fehler',
      description: 'Nur auf der Scheidungsseite in Gebrauch. Leer lassen, um die Sektion auszublenden.',
    },
    {
      name: 'fehler',
      title: 'Fehler',
      type: 'array',
      group: 'fehler',
      of: [
        {
          type: 'object',
          name: 'fehlereintrag',
          fields: [
            { name: 'titel', title: 'Titel', type: 'string', validation: (Rule) => Rule.required().max(70) },
            {
              name: 'merksatz',
              title: 'Merksatz',
              type: 'string',
              description: 'Die hervorgehobene Zeile unter dem Titel.',
              validation: (Rule) => Rule.required().max(90),
            },
            {
              name: 'body',
              title: 'Text',
              type: 'text',
              rows: 5,
              validation: (Rule) => Rule.required().max(500),
            },
          ],
          preview: { select: { title: 'titel', subtitle: 'merksatz' } },
        },
      ],
    },

    {
      name: 'faqUeberschrift',
      title: 'Ueberschrift',
      type: 'array',
      of: [{ type: 'satzteil' }],
      group: 'faq',
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: 'faqEintraege',
      title: 'Fragen und Antworten',
      type: 'array',
      group: 'faq',
      description:
        'Diese Fragen werden zusaetzlich maschinenlesbar an Google uebergeben. Formuliere die Frage so, '
        + 'wie eine Kundin sie tatsaechlich eintippen wuerde.',
      of: [
        {
          type: 'object',
          name: 'faqEintrag',
          fields: [
            { name: 'frage', title: 'Frage', type: 'string', validation: (Rule) => Rule.required().max(120) },
            {
              name: 'antwort',
              title: 'Antwort',
              type: 'array',
              of: [{ type: 'absatz' }],
              validation: (Rule) => Rule.required().min(1),
            },
          ],
          preview: { select: { title: 'frage' } },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: 'faqHinweis',
      title: 'Hinweis unter den Fragen',
      type: 'text',
      rows: 3,
      group: 'faq',
      description: 'Der Haftungshinweis, dass die Antworten keine Rechts- oder Steuerberatung ersetzen.',
      validation: (Rule) => Rule.max(300),
    },

    {
      name: 'ctaUeberschrift',
      title: 'Ueberschrift',
      type: 'array',
      of: [{ type: 'satzteil' }],
      group: 'abschluss',
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: 'ctaText',
      title: 'Text',
      type: 'text',
      rows: 4,
      group: 'abschluss',
      description: 'Der Platzhalter {minuten} wird durch die Laenge des Erstgespraechs ersetzt.',
      validation: (Rule) => Rule.required().max(400),
    },

    {
      name: 'metaTitel',
      title: 'Titel in der Google-Trefferliste',
      type: 'string',
      group: 'suchmaschine',
      description: 'Etwa 55 bis 60 Zeichen. Laengere Titel schneidet Google ab.',
      validation: (Rule) => Rule.required().max(70).warning('Ueber 60 Zeichen kuerzt Google den Titel.'),
    },
    {
      name: 'metaBeschreibung',
      title: 'Beschreibung in der Google-Trefferliste',
      type: 'text',
      rows: 3,
      group: 'suchmaschine',
      description: 'Etwa 150 bis 160 Zeichen.',
      validation: (Rule) => Rule.required().max(200).warning('Ueber 160 Zeichen kuerzt Google die Beschreibung.'),
    },
  ],
  preview: {
    select: { kennung: 'kennung', eyebrow: 'eyebrow' },
    prepare({ kennung, eyebrow }) {
      return { title: eyebrow || kennung, subtitle: `/${kennung || ''}` };
    },
  },
};
