# Redaktionsoberfläche (Sanity Studio)

Pflegeoberfläche für die Inhalte von womensurance.de. Eigenständiges Projekt
mit eigener `package.json`, damit die Website davon nichts mitschleppt.

* Sanity-Projekt: **DVM - womensurance**, ID `10o1bkel`, Dataset `production`
* Content Lake: GCP `europe-west1` (St. Ghislain, Belgien)
* Adresse der veröffentlichten Oberfläche: siehe `studioHost` in `sanity.cli.js`

## Einrichtung

```bash
cd studio
npm install
npx sanity login      # einmalig, öffnet den Browser
npm run dev           # lokal unter http://localhost:3333
```

## Erstbefüllung

Die Inhalte der Website liegen als JSON unter `../src/content/`. Daraus wird
die Importdatei erzeugt und eingespielt:

```bash
node ../scripts/seed-sanity.mjs
npm run seed
```

`npm run seed` läuft mit `--missing`: vorhandene Dokumente bleiben unangetastet,
ein zweiter Lauf kann also nichts überschreiben, was die Redaktion geändert hat.
Julias Fotos aus `public/images/` werden dabei mit hochgeladen.

## Veröffentlichen

```bash
npm run deploy
```

## Wie die Inhalte auf die Website kommen

```
Sanity  →  npm run build (Website)  →  scripts/fetch-content.mjs  →  src/content/*.json  →  Bundle
```

Die Website fragt Sanity **nur beim Bauen** ab, nie im Browser der Besucherin.
Das ist keine Optimierung, sondern Vertragsinhalt: Werkvertrag § 6 Abs. 4 und
die geprüfte AVV sagen zu, dass beim Besuch der Website keine Daten an das CMS
gehen. Liegt der Inhalt fertig im Bundle, kann das gar nicht passieren.

Nebeneffekte, die man kennen sollte:

* Änderungen sind erst nach dem nächsten Build sichtbar (rund eine bis zwei
  Minuten, ausgelöst über den Deploy Hook, siehe unten).
* Ist Sanity nicht erreichbar oder die Antwort unvollständig, bricht der Build
  **nicht** ab. Es bleiben die Inhalte aus dem Repository stehen und die
  Website geht mit dem zuletzt gebauten Stand live.
* Der Besucherverkehr läuft nicht gegen die Kontingente des kostenlosen
  Sanity-Plans, nur Builds tun das.

## Automatischer Neubau einrichten

1. Vercel → Projekt → Settings → Git → **Deploy Hooks** → neuen Hook anlegen
   (Branch `main`), URL kopieren.
2. [manage.sanity.io](https://manage.sanity.io) → Projekt `10o1bkel` → API →
   **Webhooks** → *Create webhook*:
   * URL: die kopierte Deploy-Hook-URL
   * Dataset: `production`
   * Trigger on: `Create`, `Update`, `Delete`
   * Filter: `_type in ["startseite","juliaSektion","lebensphase","stimme","methodenschritt","kennzahl","themenseite"]`
   * HTTP-Methode: `POST`
3. Im Studio eine Kleinigkeit veröffentlichen und in Vercel prüfen, ob ein
   Deployment startet.

## Grenzen des Schemas (bewusst)

Nicht redaktionell pflegbar, weil eine Änderung dort das Layout oder die
Rechnung bricht:

* der nachgebaute Rentenbescheid (auf ein em-Raster kalibriert)
* die Rechenlogik der Rentenlücke (`src/hooks/useGapState.jsx`), inklusive der
  Euro-Beträge hinter den Lebensereignis-Knöpfen
* Impressum, Datenschutzerklärung und Barrierefreiheitserklärung: juristische
  Texte von Maisel Consult, laut Werkvertrag § 2 Abs. 6 ausdrücklich nicht
  Leistungsgegenstand
* der Haftungshinweis unter der Fehlerliste auf der Scheidungsseite
* Farben, Schriften, Animationen

Die Zeichengrenzen in den Feldern sind gemessen, nicht geschätzt. Wer sie
ändert, sollte die betroffene Stelle im Browser nachmessen: mehrere
Überschriften laufen in einer `line-mask`, ein Umbruch darin zerlegt die
zeilenweise Einblendung.
