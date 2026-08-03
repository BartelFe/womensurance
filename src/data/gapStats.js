// Kennzahlen aus dem Redaktionssystem.
//
// ⚠️ WICHTIG, das war einmal anders: Diese Datei wurde lange von niemandem
// importiert. Julia konnte die Kennzahlen im Studio bearbeiten, ohne dass sich
// auf der Website irgendetwas änderte, weil die sichtbaren Zahlen hartcodiert
// in `useGapState.jsx` und `Loader.jsx` standen. Seit 04.08.2026 stimmt es
// wieder mit dem überein, was das Schema (`studio/schemas/kennzahl.js`) immer
// behauptet hat: Der Wert der Kennzahl `pension` ist der Ausgangswert des
// Rechners im Kopfbereich UND die Zahl, die der Ladebildschirm hochzählt.
//
// Wer diese Kopplung wieder auflöst, baut die Falle neu ein. Dann bitte auch
// die Beschreibung im Schema und in `CLAUDE.md` anpassen.

import roh from '../content/kennzahlen.json';

export const gapStats = [...roh]
  .sort((a, b) => (a.reihenfolge ?? 0) - (b.reihenfolge ?? 0))
  .map((k) => ({
    id: k.kennung,
    value: k.wert,
    unit: k.einheit,
    label: k.label,
    note: k.hinweis,
    source: k.quelle,
  }));

const rente = gapStats.find((k) => k.id === 'pension');

// Rückfallwert 36,0: Der Rechner darf nicht auf NaN laufen, falls die Kennzahl
// einmal fehlt. Entspricht dem Gender Pension Gap 2025 ohne Hinterbliebenen-
// renten (Statistisches Bundesamt). Beim Aktualisieren der Kennzahl diesen
// Wert mitziehen, damit die beiden nicht auseinanderlaufen.
export const HERO_GAP_VALUE = rente?.value ?? 36.0;

// Die Quellenangabe gehört zur Zahl. Sie wird im Kopfbereich derzeit nicht
// angezeigt, steht aber im Redaktionssystem als Pflichtfeld daneben und in
// `Kunden\Womensurance (DVM)\Zahlen und Quellen.md`.
export const HERO_GAP_SOURCE = rente?.source ?? '';
