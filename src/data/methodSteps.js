// Die vier Schritte der Beratung (Section "TheMethod").
// Inhalt aus dem Redaktionssystem, Mechanik siehe src/data/lifePhases.js.

import roh from '../content/schritte.json';

export const methodSteps = [...roh]
  .sort((a, b) => (a.reihenfolge ?? 0) - (b.reihenfolge ?? 0))
  .map((s) => ({
    n: String(s.reihenfolge).padStart(2, '0'),
    title: s.titel,
    body: s.body,
  }));
