/**
 * Holt die redaktionellen Inhalte aus Sanity und schreibt sie nach
 * `src/content/*.json`. Laeuft automatisch vor jedem `npm run build`.
 *
 * Warum beim Bauen und nicht im Browser der Besucherin:
 *
 *   1. Werkvertrag § 6 Abs. 4 und die geprüfte AVV sagen zu, dass beim Besuch
 *      der Website keine personenbezogenen Daten an das CMS gehen. Wenn die
 *      Inhalte schon fertig im Bundle liegen, kann das gar nicht passieren.
 *   2. Der kostenlose Sanity-Plan hat harte Obergrenzen fuer API-Anfragen.
 *      Besucherverkehr laeuft hier gar nicht erst dagegen, nur Builds.
 *   3. Faellt Sanity aus, bleibt die zuletzt gebaute Fassung online.
 *
 * Faellt der Abruf aus, bricht der Build NICHT ab: die im Repository
 * liegenden Inhaltsdateien bleiben stehen und die Website geht mit dem
 * letzten bekannten Stand live. Das ist Absicht.
 *
 * Aufruf:  node scripts/fetch-content.mjs
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJEKT = '10o1bkel';
const DATASET = 'production';
const API_VERSION = 'v2024-10-01';
const ZEITLIMIT_MS = 20000;

const ZIEL = resolve(dirname(fileURLToPath(import.meta.url)), '../src/content');

// `_originalId` ausschliessen und nur veroeffentlichte Dokumente lesen:
// Entwuerfe tragen in Sanity das Praefix `drafts.` in der ID.
const NUR_VEROEFFENTLICHT = '!(_id in path("drafts.**"))';

const BILD = `{ "ref": asset._ref, alt, "breite": asset->metadata.dimensions.width, "hoehe": asset->metadata.dimensions.height }`;

const ABFRAGE = `{
  "startseite": *[_type == "startseite" && ${NUR_VEROEFFENTLICHT}][0]{
    heroZeilen[]{text, stil}, heroUntertitel, heroZusatz, heroChipsHinweis,
    bescheidUeberschrift[]{text, stil}, "bescheidAbsaetze": bescheidAbsaetze[].text,
    lueckeZeile1, lueckeVorZahl, lueckeZeile3, lueckeText,
    methodeUeberschrift[]{text, stil},
    stimmenUeberschrift[]{text, stil},
    abschlussZeilen[]{text, stil}, abschlussText, abschlussButton, abschlussSocialHinweis,
    gespraechsdauer, buchungsUrl, socialProfile[]{netzwerk, label, url}
  },
  "julia": *[_type == "juliaSektion" && ${NUR_VEROEFFENTLICHT}][0]{
    vorname, rolle, zitat[]{text, stil}, zitatQuelle,
    "portraet": portraet${BILD},
    "zweitbild": zweitbild${BILD},
    infokarteTitel, infokarteText,
    geschichteUeberschrift[]{text, stil},
    "geschichteBild": geschichteBild${BILD},
    "geschichteAbsaetze": geschichteAbsaetze[].text,
    anspruchTitel, anspruchText,
    kurzprofil[]{wert, label}
  },
  "lebensphasen": *[_type == "lebensphase" && ${NUR_VEROEFFENTLICHT}] | order(reihenfolge asc){
    kennung, reihenfolge, titel, alter, "body": body[].text, versicherungen,
    "details": details[].text, unterseite, unterseiteLabel, unterseiteKurz
  },
  "schritte": *[_type == "methodenschritt" && ${NUR_VEROEFFENTLICHT}] | order(reihenfolge asc){
    reihenfolge, titel, body
  },
  "kennzahlen": *[_type == "kennzahl" && ${NUR_VEROEFFENTLICHT}] | order(reihenfolge asc){
    kennung, reihenfolge, wert, einheit, label, hinweis, quelle
  },
  "stimmen": *[_type == "stimme" && ${NUR_VEROEFFENTLICHT} && einverstaendnis == true] | order(reihenfolge asc){
    "kennung": _id, reihenfolge, zitat, name, rolle, alter, ort, kontext
  },
  "themenseiten": *[_type == "themenseite" && ${NUR_VEROEFFENTLICHT}]{
    kennung, eyebrow, titelZeilen[]{text, stil}, lead,
    kennzahlen[]{wert, nachkommastellen, einheit, label, quelle},
    kapitel[]{kicker, titel, "absaetze": absaetze[].text},
    zitat{text, autor},
    handlungenUeberschrift[]{text, stil}, handlungen[]{titel, lead, body},
    fehlerUeberschrift[]{text, stil}, fehler[]{titel, merksatz, body},
    faqUeberschrift[]{text, stil},
    faqEintraege[]{frage, "antwort": antwort[].text}, faqHinweis,
    ctaUeberschrift[]{text, stil}, ctaText,
    metaTitel, metaBeschreibung
  }
}`;

/** Leere Felder aus GROQ kommen als null zurueck. Listen sollen aber Listen bleiben. */
const liste = (wert) => (Array.isArray(wert) ? wert.filter(Boolean) : []);

const DATEIEN = {
  'startseite.json': (d) => d.startseite,
  'julia.json': (d) => d.julia,
  'lebensphasen.json': (d) => liste(d.lebensphasen),
  'schritte.json': (d) => liste(d.schritte),
  'kennzahlen.json': (d) => liste(d.kennzahlen),
  'stimmen.json': (d) => liste(d.stimmen),
  'themenseiten.json': (d) => liste(d.themenseiten),
};

/** Prueft, ob die Antwort brauchbar ist, bevor sie bestehende Inhalte ersetzt. */
function istVollstaendig(daten) {
  const fehlt = [];
  if (!daten.startseite?.heroZeilen?.length) fehlt.push('Startseite');
  if (!daten.julia?.vorname) fehlt.push('Vorstellung');
  if (liste(daten.lebensphasen).length === 0) fehlt.push('Lebensphasen');
  if (liste(daten.schritte).length === 0) fehlt.push('Schritte');
  if (liste(daten.kennzahlen).length === 0) fehlt.push('Kennzahlen');
  if (liste(daten.themenseiten).length < 2) fehlt.push('Unterseiten');
  return fehlt;
}

async function hole() {
  const url = `https://${PROJEKT}.api.sanity.io/${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(ABFRAGE)}`;
  // Eigener Timer statt AbortSignal.timeout: dessen Handle bleibt sonst offen
  // und Node quittiert das Skriptende unter Windows mit einer Assertion.
  const abbruch = new AbortController();
  const wecker = setTimeout(() => abbruch.abort(), ZEITLIMIT_MS);
  try {
    const antwort = await fetch(url, { signal: abbruch.signal, headers: { Accept: 'application/json' } });
    if (!antwort.ok) throw new Error(`Sanity antwortete mit ${antwort.status} ${antwort.statusText}`);
    const { result } = await antwort.json();
    if (!result) throw new Error('Antwort ohne Ergebnis');
    return result;
  } finally {
    clearTimeout(wecker);
  }
}

/**
 * Warnt bei Zahlen ohne belastbare Quelle.
 *
 * Hintergrund: Am 04.08.2026 stellte sich heraus, dass zwei von vier
 * Kennzahlen jahrelang veraltete Werte trugen und mehrere Quellenangaben nur
 * aus "Quelle: Destatis*" bestanden, mit einem Sternchen, das auf keine
 * Fussnote verwies. Auf einer Website, die mit Zahlen argumentiert, ist das
 * ein Glaubwuerdigkeitsrisiko.
 *
 * Bewusst nur eine Warnung, kein Abbruch: Builds laufen auch automatisch,
 * wenn Julia im Studio veroeffentlicht. Eine Qualitaetspruefung darf ihr
 * keinen Deploy zerschiessen. Die Warnung landet aber im Vercel-Log.
 */
function pruefeQuellen(daten) {
  const schwach = (q) => !q || /noch zu belegen/i.test(q) || /\*\s*$/.test(q) || q.trim().length < 20;
  const treffer = [];

  for (const k of liste(daten.kennzahlen)) {
    if (schwach(k.quelle)) treffer.push(`Kennzahl „${k.label}“: ${k.quelle || '(leer)'}`);
  }
  for (const s of liste(daten.themenseiten)) {
    for (const k of liste(s.kennzahlen)) {
      if (schwach(k.quelle)) treffer.push(`Unterseite, Zahl „${k.wert}${k.einheit || ''}“: ${k.quelle || '(leer)'}`);
    }
  }

  if (treffer.length) {
    console.warn('\n  ⚠ Zahlen ohne belastbare Quellenangabe:');
    treffer.forEach((t) => console.warn(`     · ${t}`));
    console.warn('  → Siehe „Kunden\\Womensurance (DVM)\\Zahlen und Quellen.md“.\n');
  }
}

/** Meldet, dass die Inhalte aus dem Repository stehen bleiben. */
function behalteBestand(grund) {
  const vorhanden = Object.keys(DATEIEN).every((name) => existsSync(resolve(ZIEL, name)));
  console.warn(`\n  ⚠ Inhalte konnten nicht aus Sanity geladen werden: ${grund}`);
  if (!vorhanden) {
    console.error('  → Es liegen auch keine Inhalte im Repository. Build abgebrochen.\n');
    process.exitCode = 1;
    return;
  }
  const stand = JSON.parse(readFileSync(resolve(ZIEL, 'lebensphasen.json'), 'utf8'));
  console.warn(`  → Der Build läuft mit den Inhalten aus dem Repository weiter (${stand.length} Lebensphasen).`);
  console.warn('  → Die Website geht damit mit dem zuletzt gebauten Stand live.\n');
}

try {
  const daten = await hole();
  const fehlt = istVollstaendig(daten);

  if (fehlt.length) {
    behalteBestand(`unvollständige Antwort, es fehlen: ${fehlt.join(', ')}`);
  } else {
    for (const [name, waehle] of Object.entries(DATEIEN)) {
      writeFileSync(resolve(ZIEL, name), `${JSON.stringify(waehle(daten), null, 2)}\n`, 'utf8');
    }

    const anzahlStimmen = liste(daten.stimmen).length;
    console.log(
      `  ✔ Inhalte aus Sanity geladen: ${liste(daten.lebensphasen).length} Lebensphasen, `
      + `${liste(daten.schritte).length} Schritte, ${liste(daten.kennzahlen).length} Kennzahlen, `
      + `${liste(daten.themenseiten).length} Unterseiten, ${anzahlStimmen} Stimmen`
      + `${anzahlStimmen === 0 ? ' (Stimmen-Sektion bleibt ausgeblendet)' : ''}`
    );

    pruefeQuellen(daten);
  }
} catch (fehler) {
  behalteBestand(fehler.message);
}
