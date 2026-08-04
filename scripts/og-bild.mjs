/**
 * Rendert das Vorschaubild fuer Linkvorschauen (`public/og-image.png`).
 *
 * Aufruf:  node scripts/og-bild.mjs
 *
 * Warum es dieses Skript gibt: Auf dem Bild steht der Gender Pension Gap in
 * Grossformat. Am 04.08.2026 zeigte es noch 39,4 % und die alte
 * vercel.app-Adresse, waehrend die Website laengst 36,0 % sagte. Ein Bild,
 * das per Hand aus den Entwicklerwerkzeugen geschnitten wird, veraltet
 * genau so. Deshalb: Zahl in `scripts/og-vorlage.html` aendern, Skript
 * laufen lassen, fertig.
 *
 * ⚠️ Die Vorlage liegt bewusst NICHT in `public/`. Dort waere sie eine
 * oeffentlich erreichbare Seite, die Schriften vom Google-CDN nachlaedt.
 * Genau das vermeidet die Website an jeder anderen Stelle (DSGVO, siehe
 * Datenschutzerklaerung). Als Werkzeug im Repository ist das unkritisch,
 * ausgeliefert waere es ein Widerspruch.
 *
 * Das Bild wird mit 1500 x 788 geschossen (1200 x 630 mal 1,25), passend zu
 * den Angaben in `index.html`. Seitenverhaeltnis 1,905, wie von den
 * Plattformen erwartet.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HIER = dirname(fileURLToPath(import.meta.url));
const VORLAGE = resolve(HIER, 'og-vorlage.html');
const ZIEL = resolve(HIER, '..', 'public', 'og-image.png');

const CHROME = process.env.CHROME_PATH
  || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

if (!existsSync(VORLAGE)) {
  console.error(`Vorlage fehlt: ${VORLAGE}`);
  process.exit(1);
}
if (!existsSync(CHROME)) {
  console.error(`Chrome nicht gefunden: ${CHROME}\nPfad ueber CHROME_PATH setzen.`);
  process.exit(1);
}

execFileSync(CHROME, [
  '--headless',
  '--disable-gpu',
  '--no-sandbox',
  '--hide-scrollbars',
  `--screenshot=${ZIEL}`,
  '--window-size=1200,630',
  '--force-device-scale-factor=1.25',
  // Zeit fuer die Webfonts vom CDN. Ohne das rendert Chrome in Georgia
  // und das Bild sieht anders aus als die Freigabe von 05/2026.
  '--virtual-time-budget=5000',
  `file:///${VORLAGE.replace(/\\/g, '/')}`,
], { stdio: ['ignore', 'ignore', 'pipe'] });

if (!existsSync(ZIEL)) {
  console.error('Kein Bild entstanden.');
  process.exit(1);
}
console.log(`  ✔ ${ZIEL} geschrieben (${Math.round(statSync(ZIEL).size / 1024)} kB)`);
