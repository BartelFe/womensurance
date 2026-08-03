/**
 * Wiederverwendbare Bausteine, die in mehreren Dokumenttypen vorkommen.
 *
 * Hintergrund zu `satzteil`: Die grossen Ueberschriften der Website bestehen
 * aus mehreren Zeilen, von denen eine kursiv in Pink gesetzt ist. Rich Text
 * (Fettdruck, Farben frei waehlbar) waere hier falsch, weil die Redaktion
 * damit das Schriftbild zerlegen koennte. Stattdessen: Zeile fuer Zeile,
 * pro Zeile nur die Entscheidung "hervorheben ja/nein".
 */

export const satzteil = {
  name: 'satzteil',
  title: 'Zeile',
  type: 'object',
  fields: [
    {
      name: 'text',
      title: 'Text',
      type: 'string',
      validation: (Rule) => Rule.required().max(40).warning('Ab etwa 40 Zeichen bricht die Zeile im Layout um.'),
    },
    {
      name: 'stil',
      title: 'Darstellung',
      type: 'string',
      initialValue: 'normal',
      options: {
        list: [
          { title: 'Normal', value: 'normal' },
          { title: 'Kursiv und Pink', value: 'betont' },
          { title: 'Nur kursiv', value: 'kursiv' },
        ],
        layout: 'radio',
      },
      description: 'In der Regel ist genau ein Teil einer Ueberschrift hervorgehoben.',
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: { title: 'text', stil: 'stil' },
    prepare({ title, stil }) {
      const beschriftung = { betont: 'kursiv und Pink', kursiv: 'nur kursiv' };
      return { title: title || '(leer)', subtitle: beschriftung[stil] || '' };
    },
  },
};

export const bild = {
  name: 'bild',
  title: 'Bild',
  type: 'image',
  options: { hotspot: true },
  fields: [
    {
      name: 'alt',
      title: 'Alternativtext',
      type: 'string',
      description:
        'Beschreibt das Bild fuer blinde Nutzerinnen und fuer Google. Ein ganzer Satz, kein Stichwort. '
        + 'Beispiel: "Julia Pashchenko im pinken Blazer an ihrem Schreibtisch". Pflichtfeld nach BFSG.',
      validation: (Rule) => Rule.required().max(160),
    },
  ],
};

/** Ein Absatz Fliesstext. Als eigenes Array-Element, damit die Reihenfolge per Drag-and-drop stimmt. */
export const absatz = {
  name: 'absatz',
  title: 'Absatz',
  type: 'object',
  fields: [{ name: 'text', title: 'Text', type: 'text', rows: 4, validation: (Rule) => Rule.required() }],
  preview: {
    select: { title: 'text' },
    prepare({ title }) {
      return { title: title ? `${title.slice(0, 70)}${title.length > 70 ? '…' : ''}` : '(leer)' };
    },
  },
};
