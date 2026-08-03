// Lebensphasen für Section "Dein Leben".
//
// Der Inhalt kommt seit der CMS-Anbindung aus `src/content/lebensphasen.json`
// (gefüllt beim Bauen der Seite aus Sanity, siehe scripts/fetch-content.mjs).
// Diese Datei bleibt bestehen und übersetzt die Feldnamen des
// Redaktionssystems in die Namen, die die Komponenten schon immer benutzen.
// Dadurch musste am Rendering nichts angefasst werden.
//
// Hinweise:
// - Die frühere 7. Kachel "Rente" ist bewusst entfernt, das Rententhema
//   lebt in der Unterseite /rentenluecke (Teilzeit/Care-Arbeit).
// - Die Lebensereignis-Toggles (inkl. €-Beträge) leben zentral in
//   src/hooks/useGapState.jsx (TOGGLE_META). Sie sind Rechenlogik und
//   bewusst nicht redaktionell pflegbar.

import roh from '../content/lebensphasen.json';

export const lifePhases = [...roh]
  .sort((a, b) => (a.reihenfolge ?? 0) - (b.reihenfolge ?? 0))
  .map((p) => ({
    id: p.kennung,
    age: p.alter,
    title: p.titel,
    body: p.body,
    insurance: p.versicherungen,
    details: p.details?.length ? p.details : undefined,
    subpage: p.unterseite || undefined,
    subpageLabel: p.unterseiteLabel || undefined,
    subpageShort: p.unterseiteKurz || undefined,
  }));
