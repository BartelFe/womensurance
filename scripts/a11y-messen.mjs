/**
 * Misst die Zusicherungen nach, die auf /barrierefreiheit stehen.
 *
 * Aufruf (Vorschau muss laufen, `npm run build && npm run preview`):
 *   node scripts/a11y-messen.mjs
 *   node scripts/a11y-messen.mjs http://localhost:4173
 *
 * ── Warum es dieses Skript gibt ──────────────────────────────────────────
 * Auf /barrierefreiheit stehen acht Zusicherungen. Eine Zusicherung, die
 * niemand nachprueft, ist keine. Vor jeder Abnahme und nach groesseren
 * Aenderungen also einmal laufen lassen.
 *
 * ⚠️ Es ersetzt Lighthouse nicht, sondern ergaenzt es. Lighthouse/axe deckt
 * Kontrast und die ueblichen Regeln ab (`npx lighthouse <url>
 * --only-categories=accessibility`). Was es NICHT zuverlaessig kann, steht
 * hier drin:
 *
 *   1. Namen im Barrierefreiheits-Baum. axe rechnet nach Spezifikation,
 *      Chrome tut es teils anders. Am 04.08.2026 meldete axe die
 *      Consent-Schalter als in Ordnung, obwohl sie fuer Screenreader
 *      „StatistikHilft uns zu verstehen, wie die Website genutzt wird
 *      (z. B. ...)" hiessen, also Bezeichnung und ganze Erlaeuterung am
 *      Stueck. Deshalb wird hier Chrome direkt gefragt
 *      (Accessibility.getFullAXTree ueber das DevTools Protocol).
 *
 *   2. Reduzierte Bewegung. Laesst sich nur mit emulierter
 *      Systemeinstellung pruefen, nicht durch Lesen des Codes.
 *
 * Node 24 bringt `WebSocket` global mit, deshalb ohne Abhaengigkeiten.
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BASIS = process.argv[2] || 'http://localhost:4173';
const PORT = 9335;
const CHROME = process.env.CHROME_PATH
  || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const warte = (ms) => new Promise((r) => setTimeout(r, ms));
let fehler = 0;

const gut = (t) => console.log(`  \u2713 ${t}`);
const schlecht = (t) => { fehler += 1; console.log(`  \u2717 ${t}`); };

const profil = mkdtempSync(join(tmpdir(), 'wmns-a11y-'));
const chrome = spawn(CHROME, [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${profil}`,
  '--no-first-run',
  '--no-default-browser-check',
  'about:blank',
], { stdio: 'ignore' });

async function holeZiele() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const a = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      if (a.ok) return a.json();
    } catch { /* Chrome startet noch */ }
    await warte(250);
  }
  throw new Error(`Chrome antwortet nicht auf Port ${PORT}. Ist ${CHROME} vorhanden?`);
}

const seite = (await holeZiele()).find((t) => t.type === 'page');
const ws = new WebSocket(seite.webSocketDebuggerUrl);
await new Promise((r, x) => { ws.onopen = r; ws.onerror = x; });

let lfd = 0;
const offen = new Map();
ws.onmessage = (e) => {
  const n = JSON.parse(e.data);
  if (offen.has(n.id)) { offen.get(n.id)(n.result); offen.delete(n.id); }
};
const cdp = (method, params = {}) => new Promise((r) => {
  lfd += 1;
  offen.set(lfd, r);
  ws.send(JSON.stringify({ id: lfd, method, params }));
});

await cdp('Runtime.enable');
await cdp('Page.enable');

/** Laedt eine Seite und wartet, bis React gerendert hat. */
async function oeffne(pfad) {
  await cdp('Page.navigate', { url: `${BASIS}${pfad}` });
  await warte(3500);
}

/** Wertet einen Ausdruck in der Seite aus und gibt das Ergebnis zurueck. */
async function imBrowser(ausdruck) {
  const { result } = await cdp('Runtime.evaluate', {
    expression: `JSON.stringify((() => { ${ausdruck} })())`,
    returnByValue: true,
    awaitPromise: true,
  });
  return JSON.parse(result.value);
}

// ── 1. Auszeichnung auf Start- und Themenseite ──────────────────────────
console.log('\nAuszeichnung (Startseite)');
await oeffne('/');
const start = await imBrowser(`
  return {
    sprache: document.documentElement.lang,
    sprunglink: !!document.querySelector('.skip-link'),
    bilder: document.querySelectorAll('img').length,
    ohneAlt: [...document.querySelectorAll('img')].filter((i) => !i.alt.trim()).length,
    umschalter: document.querySelectorAll('[aria-pressed]').length,
    liveRegionen: document.querySelectorAll('[aria-live]').length,
  };
`);
start.sprache === 'de' ? gut('Seitensprache ist "de"') : schlecht(`Seitensprache ist "${start.sprache}"`);
start.sprunglink ? gut('Sprunglink vorhanden') : schlecht('Sprunglink fehlt');
start.ohneAlt === 0
  ? gut(`${start.bilder} Bilder, alle mit Alternativtext`)
  : schlecht(`${start.ohneAlt} von ${start.bilder} Bildern ohne Alternativtext`);
start.umschalter > 0 ? gut(`${start.umschalter} Umschalter mit aria-pressed`) : schlecht('keine Umschalter mit aria-pressed');
start.liveRegionen > 0 ? gut(`${start.liveRegionen} Live-Region(en) fuer Rechner-Ergebnisse`) : schlecht('keine Live-Region');

console.log('\nRechner (/rentenluecke)');
await oeffne('/rentenluecke');
const rechner = await imBrowser(`
  const r = [...document.querySelectorAll('input[type=range]')];
  return {
    regler: r.length,
    ohneValuetext: r.filter((i) => !i.getAttribute('aria-valuetext')).length,
    liveRegionen: document.querySelectorAll('[aria-live]').length,
  };
`);
rechner.ohneValuetext === 0
  ? gut(`${rechner.regler} Regler, alle mit aria-valuetext`)
  : schlecht(`${rechner.ohneValuetext} von ${rechner.regler} Reglern ohne aria-valuetext`);
rechner.liveRegionen > 0 ? gut('Ergebnis liegt in einer Live-Region') : schlecht('keine Live-Region im Rechner');

// ── 2. Namen im Barrierefreiheits-Baum ──────────────────────────────────
console.log('\nNamen im Barrierefreiheits-Baum (Consent-Schalter)');
await imBrowser(`
  localStorage.removeItem('wmns-consent');
  return true;
`);
await oeffne('/rentenluecke');
await imBrowser(`
  const b = [...document.querySelectorAll('[role=dialog] button')]
    .find((x) => x.textContent.includes('Einstellungen anpassen'));
  if (b) b.click();
  return true;
`);
await warte(600);
await cdp('Accessibility.enable');
await warte(800);
const { nodes } = await cdp('Accessibility.getFullAXTree');
const schalter = nodes.filter((n) => n.role?.value === 'switch');

if (!schalter.length) {
  schlecht('keine Schalter im Baum gefunden (Banner nicht geoeffnet?)');
} else {
  for (const n of schalter) {
    const name = n.name?.value ?? '';
    const beschreibung = n.description?.value ?? '';
    if (!name.trim()) schlecht('Schalter ohne Namen');
    else if (name.length > 40) schlecht(`Schaltername zu lang, Erlaeuterung steckt vermutlich drin: "${name.slice(0, 55)}..."`);
    else gut(`Schalter "${name}"${beschreibung ? ' mit eigener Beschreibung' : ' \u2014 ohne Beschreibung'}`);
  }
}

// ── 3. Reduzierte Bewegung ──────────────────────────────────────────────
console.log('\nReduzierte Bewegung');
for (const modus of ['no-preference', 'reduce']) {
  await cdp('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: modus }],
  });
  await oeffne('/');
  const m = await imBrowser(`
    return {
      attribut: document.documentElement.dataset.reducedMotion,
      lenis: !!window.__lenis,
      canvas: document.querySelectorAll('canvas').length,
    };
  `);
  if (modus === 'reduce') {
    m.attribut === 'true' ? gut('data-reduced-motion="true" gesetzt') : schlecht(`data-reduced-motion ist "${m.attribut}"`);
    m.lenis === false ? gut('kein weiches Scrollen (Lenis nicht geladen)') : schlecht('Lenis laeuft trotz reduce');
    m.canvas === 0 ? gut('animierter Hintergrund wird nicht geladen') : schlecht(`${m.canvas} <canvas> trotz reduce`);
  } else {
    m.lenis === true && m.canvas > 0
      ? gut('ohne die Einstellung laufen Scrollen und Hintergrund normal (Gegenprobe)')
      : schlecht('Gegenprobe fehlgeschlagen: ohne reduce fehlen Lenis oder Hintergrund');
  }
}

ws.close();
chrome.kill();
try { rmSync(profil, { recursive: true, force: true }); } catch { /* Windows haelt die Datei noch */ }

console.log(
  fehler === 0
    ? '\n\u2713 Alle geprueften Zusicherungen von /barrierefreiheit treffen zu.\n'
    : `\n\u2717 ${fehler} Abweichung(en). /barrierefreiheit sichert etwas zu, das nicht mehr stimmt.\n`
);
process.exit(fehler === 0 ? 0 : 1);
