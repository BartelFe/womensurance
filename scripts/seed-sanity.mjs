/**
 * Erzeugt aus `src/content/*.json` eine Importdatei fuer Sanity
 * (`studio/seed/inhalte.ndjson`) und laedt dabei auch Julias Fotos hoch.
 *
 * Einmal-Werkzeug fuer die Erstbefuellung. Danach ist Sanity die Quelle und
 * die Richtung dreht sich um (siehe scripts/fetch-content.mjs).
 *
 * Ablauf:
 *   1. node scripts/seed-sanity.mjs          erzeugt die Importdatei
 *   2. cd studio && npx sanity login         einmalig, oeffnet den Browser
 *   3. npm run seed                          spielt sie ein
 *
 * Der Import laeuft mit `--missing`: bereits vorhandene Dokumente bleiben
 * unangetastet. Ein zweiter Lauf kann also nichts ueberschreiben, was die
 * Redaktion inzwischen geaendert hat.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const QUELLE = resolve(WURZEL, 'src/content');
const ZIEL = resolve(WURZEL, 'studio/seed');
const BILDER = resolve(WURZEL, 'public/images');

const lies = (name) => JSON.parse(readFileSync(resolve(QUELLE, name), 'utf8'));

/**
 * Jedes Element eines Sanity-Arrays braucht einen stabilen Schluessel, sonst
 * verliert die Redaktionsoberflaeche beim Sortieren den Bezug.
 */
let zaehler = 0;
const schluessel = () => `k${(zaehler += 1).toString(36)}`;

const mitKeys = (liste, typ) =>
  (liste || []).map((eintrag) => ({ _key: schluessel(), ...(typ ? { _type: typ } : {}), ...eintrag }));

/** Textliste → Absatz-Objekte, wie sie das Schema erwartet. */
const absaetze = (texte) => (texte || []).map((text) => ({ _key: schluessel(), _type: 'absatz', text }));

/** Ueberschriftsteile bekommen ihren Typ und einen Schluessel. */
const teile = (liste) =>
  (liste || []).map((t) => ({ _key: schluessel(), _type: 'satzteil', text: t.text, stil: t.stil || 'normal' }));

/**
 * Bildverweis fuer den Import. `_sanityAsset` weist den Import an, die Datei
 * hochzuladen und die Referenz selbst einzusetzen. Absoluter file://-URI,
 * weil Windows einen relativen `file://../` URI als UNC-Host `..` fehlinterpretiert
 * (ENOENT auf `\\..\...`).
 */
const bild = (quelle) => ({
  _type: 'bild',
  _sanityAsset: `image@${pathToFileURL(resolve(BILDER, quelle.datei)).href}`,
  alt: quelle.alt,
});

const startseite = lies('startseite.json');
const julia = lies('julia.json');

const dokumente = [
  {
    _id: 'startseite',
    _type: 'startseite',
    heroZeilen: teile(startseite.heroZeilen),
    heroUntertitel: startseite.heroUntertitel,
    heroZusatz: startseite.heroZusatz,
    heroChipsHinweis: startseite.heroChipsHinweis,
    bescheidUeberschrift: teile(startseite.bescheidUeberschrift),
    bescheidAbsaetze: absaetze(startseite.bescheidAbsaetze),
    lueckeZeile1: startseite.lueckeZeile1,
    lueckeVorZahl: startseite.lueckeVorZahl,
    lueckeZeile3: startseite.lueckeZeile3,
    lueckeText: startseite.lueckeText,
    methodeUeberschrift: teile(startseite.methodeUeberschrift),
    stimmenUeberschrift: teile(startseite.stimmenUeberschrift),
    abschlussZeilen: teile(startseite.abschlussZeilen),
    abschlussText: startseite.abschlussText,
    abschlussButton: startseite.abschlussButton,
    abschlussSocialHinweis: startseite.abschlussSocialHinweis,
    gespraechsdauer: startseite.gespraechsdauer,
    buchungsUrl: startseite.buchungsUrl,
    socialProfile: mitKeys(startseite.socialProfile, 'profil'),
  },
  {
    _id: 'juliaSektion',
    _type: 'juliaSektion',
    vorname: julia.vorname,
    rolle: julia.rolle,
    zitat: teile(julia.zitat),
    zitatQuelle: julia.zitatQuelle,
    portraet: bild(julia.portraet),
    zweitbild: bild(julia.zweitbild),
    infokarteTitel: julia.infokarteTitel,
    infokarteText: julia.infokarteText,
    geschichteUeberschrift: teile(julia.geschichteUeberschrift),
    geschichteBild: bild(julia.geschichteBild),
    geschichteAbsaetze: absaetze(julia.geschichteAbsaetze),
    anspruchTitel: julia.anspruchTitel,
    anspruchText: julia.anspruchText,
    kurzprofil: mitKeys(julia.kurzprofil, 'profilwert'),
  },
  ...lies('lebensphasen.json').map((p) => ({
    _id: `lebensphase-${p.kennung}`,
    _type: 'lebensphase',
    kennung: p.kennung,
    reihenfolge: p.reihenfolge,
    titel: p.titel,
    alter: p.alter,
    body: absaetze(p.body),
    versicherungen: p.versicherungen,
    details: absaetze(p.details),
    unterseite: p.unterseite,
    unterseiteLabel: p.unterseiteLabel,
    unterseiteKurz: p.unterseiteKurz,
  })),
  ...lies('schritte.json').map((s) => ({
    _id: `methodenschritt-${s.reihenfolge}`,
    _type: 'methodenschritt',
    reihenfolge: s.reihenfolge,
    titel: s.titel,
    body: s.body,
  })),
  ...lies('kennzahlen.json').map((k) => ({
    _id: `kennzahl-${k.kennung}`,
    _type: 'kennzahl',
    kennung: k.kennung,
    reihenfolge: k.reihenfolge,
    wert: k.wert,
    einheit: k.einheit,
    label: k.label,
    hinweis: k.hinweis,
    quelle: k.quelle,
  })),
  ...lies('themenseiten.json').map((s) => ({
    _id: `themenseite-${s.kennung}`,
    _type: 'themenseite',
    kennung: s.kennung,
    eyebrow: s.eyebrow,
    titelZeilen: teile(s.titelZeilen),
    lead: s.lead,
    kennzahlen: mitKeys(s.kennzahlen, 'seitenkennzahl'),
    kapitel: (s.kapitel || []).map((k) => ({
      _key: schluessel(),
      _type: 'kapiteleintrag',
      kicker: k.kicker,
      titel: k.titel,
      absaetze: absaetze(k.absaetze),
    })),
    zitat: s.zitat,
    handlungenUeberschrift: teile(s.handlungenUeberschrift),
    handlungen: mitKeys(s.handlungen, 'handlung'),
    fehlerUeberschrift: teile(s.fehlerUeberschrift),
    fehler: mitKeys(s.fehler, 'fehlereintrag'),
    faqUeberschrift: teile(s.faqUeberschrift),
    faqEintraege: (s.faqEintraege || []).map((f) => ({
      _key: schluessel(),
      _type: 'faqEintrag',
      frage: f.frage,
      antwort: absaetze(f.antwort),
    })),
    faqHinweis: s.faqHinweis,
    ctaUeberschrift: teile(s.ctaUeberschrift),
    ctaText: s.ctaText,
    metaTitel: s.metaTitel,
    metaBeschreibung: s.metaBeschreibung,
  })),
];

mkdirSync(ZIEL, { recursive: true });
const datei = resolve(ZIEL, 'inhalte.ndjson');
writeFileSync(datei, `${dokumente.map((d) => JSON.stringify(d)).join('\n')}\n`, 'utf8');

const nachTyp = dokumente.reduce((summe, d) => ({ ...summe, [d._type]: (summe[d._type] || 0) + 1 }), {});
console.log(`studio/seed/inhalte.ndjson geschrieben: ${dokumente.length} Dokumente`);
for (const [typ, anzahl] of Object.entries(nachTyp)) console.log(`  ${typ}: ${anzahl}`);
console.log('\nEinspielen:  cd studio  →  npx sanity login  →  npm run seed');
