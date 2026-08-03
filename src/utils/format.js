// Deutsche Zahlenschreibweise: Komma statt Punkt, Punkt als Tausendertrenner.
// Also 36,0 % und 130.100, nicht 36.0 % und 130100.

/** Eine Nachkommastelle, z. B. 36 → "36,0". */
export const de1 = (n) => Number(n).toFixed(1).replace('.', ',');

/**
 * Beliebig viele Nachkommastellen, mit Tausendertrenner.
 *
 * Wird von den animierten Zaehlern benutzt. Vorher stand dort ein blankes
 * `toFixed()`, das eine deutsche Seite sichtbar "36.4 %" schreiben liess,
 * waehrend die Vorlesefassung daneben korrekt "36,4 %" sagte.
 */
export const deNum = (n, nachkommastellen = 0) =>
  Number(n).toLocaleString('de-DE', {
    minimumFractionDigits: nachkommastellen,
    maximumFractionDigits: nachkommastellen,
  });
