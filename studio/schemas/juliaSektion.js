/**
 * Die Vorstellungssektion auf der Startseite ("Julia" plus "Die Geschichte
 * hinter womensurance"). Existiert genau einmal, deshalb ohne Liste.
 *
 * Hinweis zu den Bildern: Sie werden nicht direkt von Sanity ausgeliefert,
 * sondern ueber womensurance.de/api/image. Fuer die Redaktion aendert das
 * nichts, es ist aber der Grund, warum in der Datenschutzerklaerung steht,
 * dass Besucherinnen keine Verbindung zu Sanity aufbauen.
 */
export default {
  name: 'juliaSektion',
  title: 'Vorstellung (Julia)',
  type: 'document',
  groups: [
    { name: 'kopf', title: 'Kopfbereich', default: true },
    { name: 'geschichte', title: 'Die Geschichte' },
    { name: 'zahlen', title: 'Kurzprofil' },
  ],
  fields: [
    {
      name: 'vorname',
      title: 'Grosser Vorname',
      type: 'string',
      group: 'kopf',
      description: 'Der sehr gross gesetzte Schriftzug links oben.',
      validation: (Rule) => Rule.required().max(12),
    },
    {
      name: 'rolle',
      title: 'Qualifikationszeile',
      type: 'string',
      group: 'kopf',
      description: 'Beispiel: "Fachwirtin fuer Versicherungen und Finanzen · DVM Ingolstadt".',
      validation: (Rule) => Rule.required().max(90),
    },
    {
      name: 'zitat',
      title: 'Zitat',
      type: 'array',
      of: [{ type: 'satzteil' }],
      group: 'kopf',
      description:
        'Das grosse Zitat unter dem Namen, in Teilen erfasst. Ein Teil kann hervorgehoben werden. '
        + 'Anfuehrungszeichen setzt die Website selbst.',
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: 'zitatQuelle',
      title: 'Zitat-Unterzeile',
      type: 'string',
      group: 'kopf',
      description: 'Beispiel: "Julia Pashchenko, Gruenderin".',
      validation: (Rule) => Rule.required().max(60),
    },
    {
      name: 'portraet',
      title: 'Grosses Portraet',
      type: 'bild',
      group: 'kopf',
      description: 'Hochformat 3:4. Mindestens 700 Pixel breit.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'zweitbild',
      title: 'Kleines quadratisches Bild',
      type: 'bild',
      group: 'kopf',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'infokarteTitel',
      title: 'Infokarte: Ueberschrift',
      type: 'string',
      group: 'kopf',
      validation: (Rule) => Rule.required().max(24),
    },
    {
      name: 'infokarteText',
      title: 'Infokarte: Text',
      type: 'text',
      rows: 3,
      group: 'kopf',
      description: 'Die kleine dunkle Karte rechts. Sehr knapp halten, der Platz ist eng.',
      validation: (Rule) => Rule.required().max(160).warning('Ueber 160 Zeichen wird die Karte unruhig.'),
    },

    {
      name: 'geschichteUeberschrift',
      title: 'Ueberschrift',
      type: 'array',
      of: [{ type: 'satzteil' }],
      group: 'geschichte',
      description: 'Beispiel: "Die Geschichte hinter" (normal) plus "womensurance" (hervorgehoben).',
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: 'geschichteBild',
      title: 'Bild zur Geschichte',
      type: 'bild',
      group: 'geschichte',
      description:
        'Hochformat 5:7. Wird bis etwa 530 Pixel breit angezeigt, die Datei sollte fuer scharfe '
        + 'Darstellung also mindestens 1060 Pixel breit sein.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'geschichteAbsaetze',
      title: 'Fliesstext',
      type: 'array',
      of: [{ type: 'absatz' }],
      group: 'geschichte',
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: 'anspruchTitel',
      title: 'Schlussabsatz: fette Zeile',
      type: 'string',
      group: 'geschichte',
      description: 'Beispiel: "Mein Anspruch:".',
      validation: (Rule) => Rule.max(40),
    },
    {
      name: 'anspruchText',
      title: 'Schlussabsatz: Text',
      type: 'text',
      rows: 3,
      group: 'geschichte',
      validation: (Rule) => Rule.max(300),
    },

    {
      name: 'kurzprofil',
      title: 'Vier Kurzangaben',
      type: 'array',
      group: 'zahlen',
      description: 'Die vier Zahlen unter dem Text. Genau vier, sonst bricht das zweispaltige Raster.',
      of: [
        {
          type: 'object',
          name: 'profilwert',
          fields: [
            {
              name: 'wert',
              title: 'Wert',
              type: 'string',
              description: 'Beispiel: "5+", "100%", "IHK".',
              validation: (Rule) => Rule.required().max(8),
            },
            {
              name: 'label',
              title: 'Bezeichnung',
              type: 'string',
              validation: (Rule) => Rule.required().max(24),
            },
          ],
          preview: {
            select: { title: 'wert', subtitle: 'label' },
          },
        },
      ],
      validation: (Rule) => Rule.required().length(4).error('Es muessen genau vier Angaben sein.'),
    },
  ],
  preview: {
    prepare() {
      return { title: 'Vorstellung (Julia)' };
    },
  },
};
