/**
 * Menuestruktur der Redaktionsoberflaeche.
 *
 * Die Standardstruktur von Sanity listet schlicht alle Dokumenttypen
 * alphabetisch. Hier ist sie stattdessen nach der Reihenfolge der Website
 * sortiert, damit sich jemand, der die Seite kennt, ohne Erklaerung
 * zurechtfindet. "Startseite" und "Vorstellung" gibt es jeweils nur einmal,
 * sie oeffnen deshalb direkt das Formular statt einer Liste mit einem Eintrag.
 */

const EINZELSTUECKE = [
  { id: 'startseite', typ: 'startseite', titel: 'Startseite', symbol: () => '🏠' },
  { id: 'juliaSektion', typ: 'juliaSektion', titel: 'Vorstellung (Julia)', symbol: () => '👤' },
];

const EINZELSTUECK_BY_ID = Object.fromEntries(EINZELSTUECKE.map((e) => [e.id, e]));

const einzelstueckItem = (S, id) => {
  const { typ, titel, symbol } = EINZELSTUECK_BY_ID[id];
  return S.listItem()
    .title(titel)
    .id(id)
    .icon(symbol)
    .child(S.document().schemaType(typ).documentId(id).title(titel));
};

export const structure = (S) =>
  S.list()
    .title('Inhalte')
    .items([
      einzelstueckItem(S, 'startseite'),

      S.listItem()
        .title('Lebensphasen')
        .icon(() => '🧭')
        .child(
          S.documentTypeList('lebensphase')
            .title('Lebensphasen')
            .defaultOrdering([{ field: 'reihenfolge', direction: 'asc' }])
        ),

      einzelstueckItem(S, 'juliaSektion'),

      S.divider(),

      S.listItem()
        .title('Schritte der Beratung')
        .icon(() => '🪜')
        .child(
          S.documentTypeList('methodenschritt')
            .title('Schritte der Beratung')
            .defaultOrdering([{ field: 'reihenfolge', direction: 'asc' }])
        ),

      S.listItem()
        .title('Testimonials')
        .icon(() => '💬')
        .child(
          S.documentTypeList('stimme')
            .title('Testimonials')
            .defaultOrdering([{ field: 'reihenfolge', direction: 'asc' }])
        ),

      S.listItem()
        .title('Kennzahlen')
        .icon(() => '📊')
        .child(
          S.documentTypeList('kennzahl')
            .title('Kennzahlen')
            .defaultOrdering([{ field: 'reihenfolge', direction: 'asc' }])
        ),

      S.divider(),

      S.listItem()
        .title('Unterseiten')
        .icon(() => '📄')
        .child(S.documentTypeList('themenseite').title('Unterseiten')),
    ]);

/**
 * Die beiden Einzelstuecke sollen nicht ueber "Neu erstellen" vervielfaeltigt
 * und nicht geloescht werden koennen. Sonst steht die Website ploetzlich ohne
 * Kopfbereich da.
 */
export const dokumentAktionen = (vorgaben, kontext) => {
  const einzeln = EINZELSTUECKE.map((e) => e.typ);
  if (!einzeln.includes(kontext.schemaType)) return vorgaben;
  return vorgaben.filter(({ action }) => !['unpublish', 'delete', 'duplicate'].includes(action));
};

export const NEUE_DOKUMENTE_AUSBLENDEN = EINZELSTUECKE.map((e) => e.typ);
