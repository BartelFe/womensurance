/**
 * Erzeugt aus dem heutigen Stand der Website die Inhaltsdateien unter
 * `src/content/`. Diese Dateien sind der Vertrag zwischen Website und
 * Redaktionssystem:
 *
 *   heute:  dieses Skript  →  src/content/*.json  →  Website
 *   spaeter: Sanity        →  src/content/*.json  →  Website
 *
 * Beide Wege erzeugen dieselbe Struktur mit denselben Feldnamen. Dadurch
 * laesst sich die Anbindung testen, ohne dass Sanity ueberhaupt erreichbar
 * sein muss, und ein Ausfall von Sanity kann die Website nicht leeren.
 *
 * Einmal-Werkzeug. Nach der Uebernahme der Inhalte nach Sanity wird es nur
 * noch als Nachschlagewerk gebraucht.
 *
 * Aufruf:  node scripts/build-content.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { inhalt as rente, faqRoh as renteFaq } from './roh/rentenluecke.js';
import { inhalt as scheidung, faqRoh as scheidungFaq } from './roh/scheidung.js';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ZIEL = resolve(WURZEL, 'src/content');

/** Text oder Textliste → immer Textliste. */
const alsAbsaetze = (wert) => (Array.isArray(wert) ? wert : [wert]).filter(Boolean);

/** Kurzform fuer eine Ueberschriftszeile. `stil`: normal | betont | kursiv. */
const z = (text, stil = 'normal') => ({ text, stil });

/**
 * Beim ersten Lauf kamen diese Listen aus `src/data/*.js` und aus dem
 * `MISTAKES`-Literal in `MistakesStack.jsx`. Beide Quellen sind seither
 * umgestellt: die Komponenten lesen inzwischen aus den JSON-Dateien, ein
 * erneutes Ableiten waere ein Kreis. Sie werden deshalb nur noch unveraendert
 * durchgereicht, damit ein zweiter Lauf nichts kaputt macht.
 */
const bestehend = (name) => JSON.parse(readFileSync(resolve(ZIEL, name), 'utf8'));

const lebensphasen = bestehend('lebensphasen.json');
const schritte = bestehend('schritte.json');
const kennzahlen = bestehend('kennzahlen.json');
const fehler = bestehend('themenseiten.json')
  .find((s) => s.kennung === 'scheidung')
  .fehler.map((f) => ({ title: f.titel, cost: f.merksatz, body: f.body }));

// ── Startseite ──────────────────────────────────────────────────
const startseite = {
  heroZeilen: [z('Über deine'), z('Zukunft wird'), z('im Stillen', 'betont'), z('entschieden.')],
  heroUntertitel: 'Deine Versicherungsschwester: ehrlich, verständlich und an deiner Seite.',
  heroZusatz: 'Spezialisiert auf Altersvorsorge, Arbeitskraft- und Sachversicherungen für Frauen.',
  heroChipsHinweis: 'Und bei dir? Tippe an, was zutrifft',

  bescheidUeberschrift: [z('Was die Prozente in '), z('Euro', 'betont'), z(' bedeuten')],
  bescheidAbsaetze: [
    '{gap} % sind mehr als nur eine Statistik. Für viele Frauen bedeuten sie jeden Monat mehrere hundert Euro weniger Rente. Hier siehst du, was diese Zahl ganz konkret für deine persönliche Situation bedeutet und warum es sich lohnt, früh gegenzusteuern.',
    'Tipp: Wähl oben im Diagramm an, was auf dich zutrifft, der Bescheid rechnet live mit.',
  ],

  lueckeZeile1: 'Deine Rentenlücke:',
  lueckeVorZahl: 'durchschnittlich',
  lueckeZeile3: 'Aber sie ist kein Schicksal.',
  lueckeText:
    'Die {basiswert} % sind ein Durchschnittswert. Wie groß deine persönliche Rentenlücke tatsächlich ist, hängt von deiner individuellen Lebenssituation ab. Gemeinsam finden wir heraus, was diese Zahl für dich bedeutet und welche Möglichkeiten du hast, schon heute gegenzusteuern.',

  methodeUeberschrift: [z('4 Schritte. '), z('Ein Konzept.', 'betont')],

  stimmenUeberschrift: [z('{anzahl} Frauen. {anzahl} '), z('Geschichten.', 'betont')],

  abschlussZeilen: [z('{minuten} Minuten.'), z('Kostenlos.'), z('Auf Augenhöhe.', 'betont')],
  abschlussText:
    'Vielleicht stellst du nach unserem Gespräch fest, dass wir nicht die Richtigen füreinander sind. Auch das ist völlig okay. Mir ist wichtig, dass du unser Gespräch mit mehr Klarheit verlässt, als du hineingegangen bist.',
  abschlussButton: 'Erstgespräch buchen',
  abschlussSocialHinweis: 'Oder folge mir',

  gespraechsdauer: 60,
  buchungsUrl: 'https://outlook.office.com/book/Womensurance@dvm.de/?ismsaljsauthenabled',
  socialProfile: [
    { netzwerk: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/womensurance/' },
    { netzwerk: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/julia-pashchenko/' },
  ],
};

// ── Vorstellung (Julia) ─────────────────────────────────────────
const julia = {
  vorname: 'Julia',
  rolle: 'Fachwirtin für Versicherungen und Finanzen · DVM Ingolstadt',
  zitat: [
    z('Ich will nicht, dass meine Kundinnen '),
    z('abgesichert', 'betont'),
    z(' sind. Ich will, dass sie '),
    // Im Original nur kursiv, ohne Pink: zwei Pink-Woerter in einem Satz
    // nehmen sich gegenseitig die Wirkung.
    z('frei', 'kursiv'),
    z(' sind.'),
  ],
  zitatQuelle: 'Julia Pashchenko, Gründerin',
  portraet: {
    datei: 'julia-portrait.jpeg',
    alt: 'Julia Pashchenko im pinken Blazer an ihrem Schreibtisch',
    breite: 704,
    hoehe: 939,
  },
  zweitbild: {
    datei: 'julia-desk.jpeg',
    alt: 'Julia Pashchenko am Besprechungstisch mit ihrem Tablet',
    breite: 704,
    hoehe: 934,
  },
  infokarteTitel: 'Womensurance',
  infokarteText: 'Julia, deine Versicherungsschwester. Sie redet Klartext, hört zu und bleibt an deiner Seite.',

  geschichteUeberschrift: [z('Die Geschichte hinter '), z('womensurance', 'betont')],
  geschichteBild: {
    datei: 'julia-geschichte.jpeg',
    alt: 'Julia Pashchenko im Womensurance-Poloshirt vor dem Büro',
    breite: 1058,
    hoehe: 1476,
  },
  geschichteAbsaetze: [
    'Womensurance ist entstanden, weil ich gesehen habe, wie schnell sich das Leben verändern kann und wie unvorbereitet viele Frauen dann sind.',
    'Kurz nach meiner Ausbildung saß eine Kundin vor mir. Sie hatte einen guten Job, eine glückliche Familie und eigentlich das Gefühl, alles richtig gemacht zu haben.',
    'Doch durch Elternzeit, reduzierte Arbeitszeit und eine Scheidung veränderte sich ihre Situation schlagartig. Plötzlich entstanden Versorgungslücken, über die vorher niemand gesprochen hatte.',
    'In diesem Moment wurde mir klar: Frauen brauchen keine komplizierten Versicherungen. Sie brauchen jemanden, der ihnen verständlich erklärt, welche Entscheidungen heute ihre finanzielle Zukunft sichern.',
    'Deshalb habe ich womensurance gegründet. Ich begleite Frauen dabei, ihre Versicherungs- und Vorsorgethemen zu verstehen und selbstbestimmte Entscheidungen zu treffen. Abgestimmt auf ihre Lebensphase, ihre Ziele und ihre Zukunft.',
  ],
  anspruchTitel: 'Mein Anspruch:',
  anspruchText:
    'Jede Frau soll wissen, wofür sie abgesichert ist und sich in jeder Lebenslage finanziell sicher fühlen.',

  kurzprofil: [
    { wert: '5+', label: 'Jahre Erfahrung' },
    { wert: '100%', label: 'Unabhängig' },
    { wert: '∅ {minuten}', label: 'Min. Erstgespräch' },
    { wert: 'IHK', label: 'Zertifiziert' },
  ],
};

// ── Unterseiten ─────────────────────────────────────────────────
const alsFaq = (roh) => ({
  faqEintraege: roh.items.map((f) => ({ frage: f.q, antwort: alsAbsaetze(f.a) })),
  faqHinweis: roh.note,
});

const alsKennzahlen = (stats) =>
  stats.map((s) => ({
    wert: s.value,
    nachkommastellen: s.decimals ?? 0,
    einheit: s.unit,
    label: s.label,
    quelle: s.source,
  }));

const alsKapitel = (chapters) =>
  chapters.map((c) => ({ kicker: c.kicker, titel: c.title, absaetze: alsAbsaetze(c.paragraphs) }));

const alsHandlungen = (actions) =>
  actions.map((a) => ({ titel: a.title, lead: a.lead || '', body: a.body }));

const themenseiten = [
  {
    kennung: 'rentenluecke',
    eyebrow: rente.eyebrow,
    titelZeilen: rente.titleLines.map((l) => z(l.text, l.italic ? 'betont' : 'normal')),
    lead: rente.lead,
    kennzahlen: alsKennzahlen(rente.stats),
    kapitel: alsKapitel(rente.chapters),
    zitat: { text: rente.quote.text, autor: rente.quote.author },
    handlungenUeberschrift: [],
    handlungen: alsHandlungen(rente.actions),
    fehlerUeberschrift: [],
    fehler: [],
    ...alsFaq(renteFaq),
    faqUeberschrift: [z('Häufige Fragen zur '), z('Rentenlücke.', 'betont')],
    ctaUeberschrift: [z('Wie groß ist '), z('deine Lücke?', 'betont')],
    // Die feste 60 im Originaltext wird zum Platzhalter, damit die
    // Gespraechsdauer nur an einer Stelle gepflegt werden muss.
    ctaText: rente.ctaBody.replace('In 60 Minuten', 'In {minuten} Minuten'),
    metaTitel: 'Die Rentenlücke — Teilzeit & Care-Arbeit | Womensurance',
    metaBeschreibung:
      'Warum Teilzeit und Care-Arbeit die Rentenlücke von Frauen vergrößern und was du dagegen tun kannst. Rentenlücke verstehen, berechnen, schließen.',
  },
  {
    kennung: 'scheidung',
    eyebrow: scheidung.eyebrow,
    titelZeilen: scheidung.titleLines.map((l) => z(l.text, l.italic ? 'betont' : 'normal')),
    lead: scheidung.lead,
    kennzahlen: alsKennzahlen(scheidung.stats),
    kapitel: alsKapitel(scheidung.chapters),
    zitat: { text: scheidung.quote.text, autor: scheidung.quote.author },
    handlungenUeberschrift: [z('Was du jetzt '), z('konkret', 'betont'), z(' tun kannst')],
    handlungen: alsHandlungen(scheidung.actions),
    fehlerUeberschrift: [
      z('5 Fehler, die viele Frauen nach einer Scheidung '),
      z('erst zu spät bemerken.', 'betont'),
    ],
    fehler: fehler.map((f) => ({ titel: f.title, merksatz: f.cost, body: f.body })),
    ...alsFaq(scheidungFaq),
    faqUeberschrift: [z('Häufige Fragen zum '), z('Versorgungsausgleich', 'betont')],
    ctaUeberschrift: [z('Bevor der Scheidungsantrag gestellt wird, '), z('lass uns sprechen.', 'betont')],
    ctaText: scheidung.ctaBody,
    metaTitel: 'Scheidung & Versorgungsausgleich — deine Rente | Womensurance',
    metaBeschreibung:
      'Was der Versorgungsausgleich mit deiner Rente macht und welche Versorgungslücken nach einer Scheidung entstehen. Verständlich erklärt.',
  },
];

// ── Schreiben ───────────────────────────────────────────────────
mkdirSync(ZIEL, { recursive: true });

const dateien = {
  'startseite.json': startseite,
  'julia.json': julia,
  'lebensphasen.json': lebensphasen,
  'schritte.json': schritte,
  'kennzahlen.json': kennzahlen,
  'themenseiten.json': themenseiten,
  // Bewusst leer: erfundene Kundenstimmen duerfen nicht online gehen
  // (§ 5b Abs. 3 UWG). Die Sektion blendet sich aus, bis Julia echte Stimmen
  // mit Einverstaendnis der genannten Personen eingepflegt hat.
  'stimmen.json': [],
};

for (const [name, wert] of Object.entries(dateien)) {
  writeFileSync(resolve(ZIEL, name), `${JSON.stringify(wert, null, 2)}\n`, 'utf8');
  const anzahl = Array.isArray(wert) ? `${wert.length} Eintraege` : `${Object.keys(wert).length} Felder`;
  console.log(`src/content/${name}  (${anzahl})`);
}
