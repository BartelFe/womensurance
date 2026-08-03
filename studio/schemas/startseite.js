/**
 * Alle einzelnen Texte der Startseite, die nicht zu einer eigenen Liste
 * gehoeren (Lebensphasen, Stimmen, Schritte und Kennzahlen liegen getrennt).
 * Existiert genau einmal.
 *
 * Bewusst NICHT redaktionell: der nachgebaute Rentenbescheid in der Sektion
 * "Was 300 Euro bedeuten". Dessen Beschriftungen sitzen auf einem in em
 * kalibrierten Raster, dort wuerde ein laengeres Wort das Dokument aus seiner
 * Spalte schieben. Aenderungen daran laufen ueber den Wartungsvertrag.
 */
export default {
  name: 'startseite',
  title: 'Startseite',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero Section', default: true },
    { name: 'bescheid', title: 'Rentenbescheid' },
    { name: 'luecke', title: 'Deine Rentenluecke' },
    { name: 'methode', title: '4 Schritte Methode' },
    { name: 'stimmen', title: 'Testimonials' },
    { name: 'abschluss', title: 'Erstgespraech' },
    { name: 'einstellungen', title: 'Einstellungen' },
  ],
  fields: [
    {
      name: 'heroZeilen',
      title: 'Grosse Ueberschrift',
      type: 'array',
      of: [{ type: 'satzteil' }],
      group: 'hero',
      description:
        'Zeile fuer Zeile. Die Schrift ist sehr gross, mehr als vier Zeilen passen nicht auf ein Handydisplay.',
      validation: (Rule) => Rule.required().min(1).max(5),
    },
    {
      name: 'heroUntertitel',
      title: 'Untertitel',
      type: 'text',
      rows: 2,
      group: 'hero',
      description: 'Der hellere Satz unter der Ueberschrift. Nur auf grossen Bildschirmen sichtbar.',
      validation: (Rule) => Rule.required().max(140),
    },
    {
      name: 'heroZusatz',
      title: 'Zusatzzeile',
      type: 'text',
      rows: 2,
      group: 'hero',
      description: 'Die kleinere Zeile darunter, meist die Spezialisierung.',
      validation: (Rule) => Rule.required().max(140),
    },
    {
      name: 'heroChipsHinweis',
      title: 'Aufforderung ueber den Auswahlknoepfen',
      type: 'string',
      group: 'hero',
      description: 'Beispiel: "Und bei dir? Tippe an, was zutrifft".',
      validation: (Rule) => Rule.required().max(60),
    },

    {
      name: 'bescheidUeberschrift',
      title: 'Ueberschrift',
      type: 'array',
      of: [{ type: 'satzteil' }],
      group: 'bescheid',
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: 'bescheidAbsaetze',
      title: 'Text neben dem Bescheid',
      type: 'array',
      of: [{ type: 'absatz' }],
      group: 'bescheid',
      description: 'Erscheint erst ab Bildschirmbreite eines Laptops, daneben ist sonst kein Platz.',
      validation: (Rule) => Rule.max(2),
    },

    {
      name: 'lueckeZeile1',
      title: 'Ueberschrift, erste Zeile',
      type: 'string',
      group: 'luecke',
      description: 'Beispiel: "Deine Rentenluecke:".',
      validation: (Rule) => Rule.required().max(30),
    },
    {
      name: 'lueckeVorZahl',
      title: 'Wort vor der Zahl',
      type: 'string',
      group: 'luecke',
      description:
        'Beispiel: "durchschnittlich". Direkt dahinter setzt die Website die Prozentzahl, '
        + 'die sich mitbewegt, wenn im Kopfbereich Lebensereignisse angeklickt werden.',
      validation: (Rule) => Rule.max(24),
    },
    {
      name: 'lueckeZeile3',
      title: 'Ueberschrift, dritte Zeile',
      type: 'string',
      group: 'luecke',
      description: 'Beispiel: "Aber sie ist kein Schicksal." Ueber 30 Zeichen bricht die Zeile um.',
      validation: (Rule) => Rule.required().max(32).warning('Ueber 32 Zeichen bricht die Zeile um und die Einblendung zerfaellt.'),
    },
    {
      name: 'lueckeText',
      title: 'Text darunter',
      type: 'text',
      rows: 5,
      group: 'luecke',
      description: 'Der Platzhalter {basiswert} wird durch den Ausgangswert der Rentenluecke ersetzt, aktuell 39,4.',
      validation: (Rule) => Rule.required().max(500),
    },

    {
      name: 'methodeUeberschrift',
      title: 'Ueberschrift',
      type: 'array',
      of: [{ type: 'satzteil' }],
      group: 'methode',
      validation: (Rule) => Rule.required().min(1),
    },

    {
      name: 'stimmenUeberschrift',
      title: 'Ueberschrift',
      type: 'array',
      of: [{ type: 'satzteil' }],
      group: 'stimmen',
      description:
        'Der Platzhalter {anzahl} wird durch die Zahl der veroeffentlichten Stimmen ersetzt, '
        + 'ausgeschrieben. Beispiel: "{anzahl} Frauen. {anzahl} Geschichten." Sind keine Stimmen '
        + 'veroeffentlicht, blendet sich die ganze Sektion aus.',
      validation: (Rule) => Rule.required().min(1),
    },

    {
      name: 'abschlussZeilen',
      title: 'Grosse Ueberschrift',
      type: 'array',
      of: [{ type: 'satzteil' }],
      group: 'abschluss',
      description: 'Der Platzhalter {minuten} wird durch die Laenge des Erstgespraechs ersetzt (siehe Einstellungen).',
      validation: (Rule) => Rule.required().min(1).max(4),
    },
    {
      name: 'abschlussText',
      title: 'Text',
      type: 'text',
      rows: 5,
      group: 'abschluss',
      validation: (Rule) => Rule.required().max(500),
    },
    {
      name: 'abschlussButton',
      title: 'Beschriftung des Knopfes',
      type: 'string',
      group: 'abschluss',
      description: 'Steht so auch im Kopfbereich der Seite.',
      validation: (Rule) => Rule.required().max(30),
    },
    {
      name: 'abschlussSocialHinweis',
      title: 'Zeile ueber den Social-Media-Symbolen',
      type: 'string',
      group: 'abschluss',
      validation: (Rule) => Rule.required().max(30),
    },

    {
      name: 'gespraechsdauer',
      title: 'Laenge des Erstgespraechs in Minuten',
      type: 'number',
      group: 'einstellungen',
      description:
        'Wird an allen Stellen der Website eingesetzt, an denen die Dauer genannt wird, '
        + 'auch auf den Unterseiten. Nur hier pflegen, dann bleibt es ueberall gleich.',
      validation: (Rule) => Rule.required().integer().min(10).max(180),
    },
    {
      name: 'buchungsUrl',
      title: 'Link zur Terminbuchung',
      type: 'url',
      group: 'einstellungen',
      description: 'Alle "Erstgespraech buchen"-Knoepfe der Website fuehren hierhin.',
      validation: (Rule) => Rule.required().uri({ scheme: ['https'] }),
    },
    {
      name: 'socialProfile',
      title: 'Social-Media-Profile',
      type: 'array',
      group: 'einstellungen',
      of: [
        {
          type: 'object',
          name: 'profil',
          fields: [
            {
              name: 'netzwerk',
              title: 'Netzwerk',
              type: 'string',
              options: {
                list: [
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'LinkedIn', value: 'linkedin' },
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            { name: 'label', title: 'Bezeichnung', type: 'string', validation: (Rule) => Rule.required().max(20) },
            {
              name: 'url',
              title: 'Adresse',
              type: 'url',
              validation: (Rule) => Rule.required().uri({ scheme: ['https'] }),
            },
          ],
          preview: { select: { title: 'label', subtitle: 'url' } },
        },
      ],
      description: 'Nur Instagram und LinkedIn sind vorgesehen, fuer weitere Netzwerke fehlen die Symbole.',
    },
  ],
  preview: {
    prepare() {
      return { title: 'Startseite' };
    },
  },
};
