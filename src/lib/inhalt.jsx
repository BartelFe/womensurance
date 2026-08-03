/**
 * Bruecke zwischen den Inhaltsdateien (`src/content/*.json`) und den
 * Komponenten.
 *
 * Die JSON-Dateien kommen entweder aus dem Redaktionssystem (beim Bauen der
 * Seite, siehe `scripts/fetch-content.mjs`) oder, falls Sanity nicht
 * erreichbar ist, aus dem Repository. Fuer die Komponenten macht das keinen
 * Unterschied: sie sehen immer dieselbe Struktur.
 *
 * Hier liegen die drei Dinge, die alle Komponenten davon brauchen:
 *   1. `Satz`:      Ueberschriften aus mehreren Teilen, einer hervorgehoben
 *   2. `fuellen`:   Platzhalter wie {minuten} durch echte Werte ersetzen
 *   3. `Bild`:      Bilder, egal ob aus Sanity oder noch aus `public/images`
 */
import { urlFor, srcSetFor } from './sanityImage';

/** Zahlwoerter fuer den Platzhalter {anzahl} in der Stimmen-Ueberschrift. */
const ZAHLWORT = ['keine', 'Eine', 'Zwei', 'Drei', 'Vier', 'Fünf', 'Sechs', 'Sieben', 'Acht', 'Neun', 'Zehn'];

export const zahlwort = (n) => ZAHLWORT[n] ?? String(n);

/**
 * Ersetzt Platzhalter der Form {name} in einem Text.
 * Unbekannte Platzhalter bleiben unveraendert stehen, damit ein Tippfehler
 * in der Redaktion sichtbar wird statt still zu verschwinden.
 */
export function fuellen(vorlage, werte = {}) {
  if (typeof vorlage !== 'string') return vorlage;
  return vorlage.replace(/\{(\w+)\}/g, (treffer, name) =>
    Object.prototype.hasOwnProperty.call(werte, name) ? String(werte[name]) : treffer
  );
}

/**
 * Eine Ueberschrift aus Teilen. Hervorgehobene Teile werden kursiv gesetzt.
 *
 * `grund` steuert die Pink-Variante: Auf dunklem Grund traegt das Marken-Pink
 * genug Kontrast, auf hellem Grund ist es fuer kleine Schrift zu schwach und
 * wird durch die kontrastgefuehrte Variante ersetzt (siehe CLAUDE.md A.9).
 */
export function klasseFuerStil(stil, grund = 'dunkel') {
  if (stil === 'kursiv') return 'display-italic';
  if (stil !== 'betont') return undefined;
  return grund === 'hell' ? 'display-italic text-pink-display' : 'display-italic text-pink';
}

export function Satz({ teile, werte, grund = 'dunkel', betontKlasse }) {
  if (!Array.isArray(teile)) return null;
  return teile.map((teil, i) => (
    <span key={i} className={teil.stil === 'betont' && betontKlasse ? betontKlasse : klasseFuerStil(teil.stil, grund)}>
      {fuellen(teil.text, werte)}
    </span>
  ));
}

/**
 * Dieselben Teile als reiner Text, etwa fuer `aria-label` oder JSON-LD.
 *
 * `trenner` ist normalerweise leer, weil die Teile einer fortlaufenden
 * Ueberschrift ihre Leerzeichen schon mitbringen. Stehen die Teile dagegen auf
 * eigenen Zeilen (Kopfbereich, Abschluss), gehoert ein Leerzeichen dazwischen,
 * sonst liest ein Screenreader "Ueber deineZukunft wird".
 */
export const satzText = (teile, werte, trenner = '') =>
  Array.isArray(teile) ? teile.map((t) => fuellen(t.text, werte)).join(trenner) : '';

/**
 * Bild aus dem Redaktionssystem.
 *
 * Solange die Fotos noch nicht nach Sanity hochgeladen sind, tragen die
 * Inhaltsdateien einen Dateinamen aus `public/images`. Danach steht dort eine
 * Sanity-Referenz, und die Auslieferung laeuft ueber den eigenen Bild-Proxy
 * (`/api/image`), niemals ueber cdn.sanity.io.
 */
export function Bild({ quelle, breiten, className, style, sizes, ...rest }) {
  if (!quelle) return null;

  const gemeinsam = {
    alt: quelle.alt || '',
    width: quelle.breite || undefined,
    height: quelle.hoehe || undefined,
    className,
    style,
    ...rest,
  };

  if (quelle.ref) {
    return (
      <img
        {...gemeinsam}
        src={urlFor(quelle.ref, { w: breiten?.[breiten.length - 1] ?? 1200 })}
        srcSet={breiten ? srcSetFor(quelle.ref, breiten) : srcSetFor(quelle.ref)}
        sizes={sizes}
      />
    );
  }

  return <img {...gemeinsam} src={`/images/${quelle.datei}`} />;
}
