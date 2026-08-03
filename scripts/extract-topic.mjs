/**
 * Einmal-Werkzeug: loest den Inhalt der beiden Themenseiten aus dem JSX heraus
 * und schreibt ihn als reines Datenmodul nach `src/data/`.
 *
 * Warum ein Skript und nicht von Hand: es geht um rund 8 KB Text von Julia.
 * Jedes Abtippen waere eine Gelegenheit fuer stille Tippfehler in Kundentexten.
 * Diese Textchirurgie kopiert die Zeichen unveraendert.
 *
 * Aufruf:  node scripts/extract-topic.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** Findet die Grenzen des `<TopicPage …/>`-Aufrufs. */
function propsRegion(quelle) {
  const start = quelle.indexOf('<TopicPage');
  if (start === -1) throw new Error('<TopicPage> nicht gefunden');
  const ende = quelle.indexOf('\n    />', start);
  if (ende === -1) throw new Error('Ende des <TopicPage>-Aufrufs nicht gefunden');
  return quelle.slice(quelle.indexOf('\n', start) + 1, ende);
}

/**
 * Zerlegt den Prop-Block in einzelne Props. Zeichenweise statt per regulaerem
 * Ausdruck, weil in den Werten selbst geschweifte Klammern und
 * Anfuehrungszeichen vorkommen.
 */
function splitProps(block) {
  const props = [];
  let i = 0;
  while (i < block.length) {
    // Whitespace ueberspringen
    while (i < block.length && /\s/.test(block[i])) i++;
    if (i >= block.length) break;

    const nameStart = i;
    while (i < block.length && /[\w]/.test(block[i])) i++;
    const name = block.slice(nameStart, i);
    if (!name) break;

    while (i < block.length && /\s/.test(block[i])) i++;
    if (block[i] !== '=') throw new Error(`Prop ${name} ohne Wert bei Position ${i}`);
    i++;

    let wert;
    if (block[i] === '"') {
      const ende = block.indexOf('"', i + 1);
      wert = block.slice(i, ende + 1);
      i = ende + 1;
    } else if (block[i] === '{') {
      const start = i;
      let tiefe = 0;
      let inString = null;
      for (; i < block.length; i++) {
        const c = block[i];
        if (inString) {
          if (c === '\\') i++;
          else if (c === inString) inString = null;
          continue;
        }
        if (c === '"' || c === "'" || c === '`') inString = c;
        else if (c === '{') tiefe++;
        else if (c === '}') {
          tiefe--;
          if (tiefe === 0) { i++; break; }
        }
      }
      wert = block.slice(start + 1, i - 1).trim(); // aeussere {} entfernen
    } else {
      throw new Error(`Unerwarteter Wert bei Prop ${name}`);
    }

    props.push({ name, wert });
  }
  return props;
}

/** Props, die JSX enthalten und deshalb nicht als Daten uebernommen werden koennen. */
const JSX_PROPS = new Set(['afterHero', 'afterQuote', 'faq', 'ctaHeadline', 'actionsHeadline']);

function extrahiere(datei, ziel) {
  // `${CALL_MINUTES}` wird zum Platzhalter `{minuten}`: die Gespraechsdauer
  // kommt kuenftig aus dem Redaktionssystem und wird beim Rendern eingesetzt.
  const quelle = readFileSync(resolve(WURZEL, datei), 'utf8').split('${CALL_MINUTES}').join('{minuten}');
  const props = splitProps(propsRegion(quelle));

  const uebernommen = props.filter((p) => !JSX_PROPS.has(p.name));
  const ausgelassen = props.filter((p) => JSX_PROPS.has(p.name)).map((p) => p.name);

  // Der FAQ-Block steht als eigene Konstante ueber der Komponente.
  // Der `title` darin ist JSX und wird uebersprungen: der Block beginnt
  // deshalb erst bei `items:`.
  const faqStart = quelle.indexOf('const FAQ = {');
  const faqEnde = quelle.indexOf('\n};', faqStart);
  const faqBlock =
    faqStart === -1
      ? null
      : `export const faqRoh = {\n  ${quelle.slice(quelle.indexOf('items:', faqStart), faqEnde)}\n};`;

  const kopf = `// Automatisch aus ${datei} geloest (scripts/extract-topic.mjs).\n`
    + `// Reine Daten, kein JSX — damit derselbe Inhalt aus Sanity kommen kann.\n`
    + `// Nicht uebernommen (enthielt Auszeichnung): ${ausgelassen.join(', ') || 'nichts'}\n\n`;

  const koerper = `export const inhalt = {\n`
    + uebernommen.map((p) => `  ${p.name}: ${p.wert},`).join('\n')
    + `\n};\n`;

  writeFileSync(resolve(WURZEL, ziel), kopf + koerper + (faqBlock ? `\n${faqBlock}\n` : ''), 'utf8');
  console.log(`${ziel}: ${uebernommen.length} Props uebernommen, ausgelassen: ${ausgelassen.join(', ')}`);
}

extrahiere('src/pages/Rentenluecke.jsx', 'scripts/roh/rentenluecke.js');
extrahiere('src/pages/Scheidung.jsx', 'scripts/roh/scheidung.js');
