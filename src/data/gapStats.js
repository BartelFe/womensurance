// Kennzahlen-Band. Inhalt aus dem Redaktionssystem, Mechanik siehe
// src/data/lifePhases.js.
//
// ⚠️ `HERO_GAP_VALUE` ist nicht nur eine Anzeige, sondern der Ausgangswert
// des Rechners im Kopfbereich. Er kommt aus der Kennzahl mit der Kennung
// `pension`. Ändert die Redaktion diese Zahl, ändert sich also auch die Zahl,
// mit der der Rechner startet. Genau so ist es gewollt (eine Quelle statt
// zwei), es ist aber der Grund, warum bei der Kennzahl die Quellenangabe
// Pflichtfeld ist.

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

// Rückfallwert 39,4: Der Rechner darf nicht auf NaN laufen, falls die Kennzahl
// einmal fehlt. Der Wert entspricht dem Gender Pension Gap zum Projektstart.
export const HERO_GAP_VALUE = rente?.value ?? 39.4;
