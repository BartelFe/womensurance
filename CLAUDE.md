# WOMENSURANCE — CLAUDE.md

**Permanenter Kontext für jede Claude-Code-Session in diesem Repo. Vor Arbeit komplett lesen.**
Globaler Kontext (Felix, Firmen, Stack-Defaults) steht in `Business/CLAUDE.md`. Diese Datei = das Projekt-spezifische Wissen.

> ⚠️ **Zwei Zeitschichten in dieser Datei.** Abschnitt **A (AKTUELLER STAND, Juli 2026)** ist maßgeblich und beschreibt den echten Ist-Zustand: Deal geschlossen, Verträge unterschriftsreif, Umsetzung läuft. Die Abschnitte **§0–§9 darunter** sind der ursprüngliche Projekt-/Design-/Story-Kontext (Stand ~Mai 2026, *vor* Deal-Abschluss). Bei Konflikt über Status/Preis/Auftrag **gewinnt immer Abschnitt A**. Design-, Story- und Tech-Inhalte in §0–§9 bleiben gültig.

---

# A · AKTUELLER STAND (Stand 25.07.2026) — maßgeblich

## A.0 · Kurzfassung
**Deal ist geschlossen.** DVM hat die Website womensurance.de fest beauftragt: Werkvertrag **4.500 €** + Wartung/Hosting **30 €/Monat**. Verträge sind nach externer Datenschutz-Prüfung **unterschriftsreif** (Julia schickt sie unterschrieben zurück). Erste Rechnungen sind gestellt. **Projektstart war Mo 20.07.2026, Ziel-Go-Live 10.08.2026.** Jetzt beginnt der eigentliche Website-Umbau.

## A.1 · Kunde, Vertragspartner & Kontakte
- **Marke:** Womensurance — Untermarke der **DVM (Deutsche Versicherungsmakler GmbH & Co. KG)**, Gemmingerstr. 14, 85051 Ingolstadt.
- **Vertragspartner / Verantwortlicher i.S.d. DSGVO = die DVM** (nicht Julia persönlich).
- **Ansprechpartnerin:** **Julia Pashchenko** (Beraterin bei DVM, „Gesicht" der Marke). Sie zeigt die Site final ihren Kundinnen.
- **Doris Hampe** — Referentin der Geschäftsleitung DVM (d.hampe@dvm.de), koordiniert die Dienstleisterprüfung. DVM legt Felix samt AVV + Applikation im internen **„MaiselPortal"** als Dienstleister an.
- **Externer Datenschutzbeauftragter der DVM:** **Ronny Klotzenbücher, Maisel Consult, Bayreuth** (ronny.klotzenbuecher@maisel.co). Hat die AVV geprüft (s. A.5).
- **Auftragnehmer / Rechnungs- & Vertragsidentität = Felix:** Einzelunternehmen **„Felix Bartel Webdesign"**, Inhaber Felix Bartel, Schlüterstr. 31, 85057 Ingolstadt. **Kleinunternehmer § 19 UStG → keine Umsatzsteuer** (Rechnungen/Verträge: „gem. § 19 UStG wird keine USt berechnet"). Steuer-Nr. 163/202/62082 · USt-IdNr. DE360017787.

## A.2 · Deal / kommerzielle Eckdaten
- **Werkvertrag: 4.500 € Festpreis**, Zahlung **50 / 50** (50 % bei Auftrag, 50 % bei Live-Schaltung). CMS (Sanity) ist im Festpreis **inkludiert**, kein Aufpreis.
- **Wartung & Hosting: 30 €/Monat = 360 €/Jahr im Voraus.** 12 Monate Mindestlaufzeit, 3 Monate Kündigungsfrist, 2 Std./Monat kleine Updates inklusive. Beginnt mit Live-Schaltung.
- **Ziel-Go-Live: 10.08.2026.** Projektstart war Mo 20.07.2026.
- **Domain:** DVM = Inhaber/Registrant, Felix nur Admin-C/Tech-C. Von dvm.de wird auf womensurance.de verlinkt.

## A.3 · Wo alles persistent liegt (Zeiger — der VS-Code-Claude muss diese Pfade NICHT auswendig kennen, hier stehen sie)
- **Website-Code (dieses Repo):** `Business/Projects/womensurance/` — Content getrennt in `src/data/*.js` (`gapStats.js`, `lifePhases.js`, `methodSteps.js`, `voices.js`) + `MeetJulia.jsx`.
- **Verträge (3 × .docx + .pdf):** `Business/Kunden/Womensurance (DVM)/Verträge/` — `Werkvertrag_womensurance`, `AVV_womensurance`, `Wartungsvertrag_womensurance`. Rollback-Backup `Verträge/_backup_pre_dsb/` (nach Unterschrift löschbar).
- **Rechnungen:** `Business/Kunden/Womensurance (DVM)/Rechnungen/` — Generator `build-invoices.js` (Node `docx`, Empire-Dom-Vorlage; Bankdaten Banking Circle IBAN DE61 2022 0800 0056 1254 06 / BIC SXPYDEHHXXX).
- **Verträge werden via Word-COM (PowerShell) bearbeitet** — kein pandoc/LibreOffice auf dem Rechner. Hilfsskripte lagen im Scratchpad (`apply_edits.ps1`, `dump.ps1`, `fixstyle.ps1`, `topdf.ps1`; Scratchpad ist flüchtig, ggf. neu anlegen). Fallstrick: ein Find/Replace, der den **ganzen** Absatztext trifft, setzt die Absatzformatvorlage auf „Standard" zurück → nur Teil-Strings ersetzen oder Stil danach wiederherstellen.

## A.4 · Rechnungen (gestellt)
- **Teilrechnung `2026_07_01`** = **2.250 €** (50 % Werk-Anzahlung), datiert **23.07.2026**, § 19-Hinweis, Zahlungsziel 14 Tage. Hinweis auf Schlussrechnung über die restlichen 2.250 € bei Live-Schaltung steht drauf. **Sendebereit** (Felix verschickt selbst).
- **Wartung `2026_07_02`** = **360 €** (12 Mon. im Voraus, Leistungszeitraum 10.08.2026–09.08.2027), datiert 17.07.2026. ⚠️ Offen: Datum ggf. auf 23.07. ziehen, damit Nr. _02 nicht älter datiert ist als _01 (Einzeiler in `build-invoices.js`).
- **Schlussrechnung** über die verbleibenden 2.250 € folgt mit Go-Live.

## A.5 · Architektur-Entscheidung Sanity + Vercel — WICHTIG für die Umsetzung
Das CMS-Thema kam vor Finalisierung hoch (DVMs Personalerin fragte „welches CMS + Hosting-Ablauf"; Hintergrund: DVMs Agentur **Forst & Forst GbR** baut dvm.de in **Framer**, DVM wollte Wartbarkeit). **Gelöst OHNE Framer-Wechsel** (die custom R3F/GSAP-Site geht nicht in Framer): **Sanity (Headless-CMS) wird integriert**, im Festpreis inkludiert. Julia kann Inhalte selbst pflegen, Design bleibt gesperrt.

- **Sanity-Fakten:** Vertragsentität **Sanity US Inc.**, 351 California St, Suite 650, San Francisco, CA 94104 (kalif. Recht → echte Drittlandübermittlung, Grundlage **SCC**; DPF für Sanity **nicht** bestätigt — bewusst nur SCC genannt). Content Lake fix auf **GCP europe-west1 (St. Ghislain, Belgien)**, keine Regionswahl im **Free-Plan** (0 € laufend). Projekt „DVM - womensurance", Org „Felix Bartel", **Projekt-ID `10o1bkel`**. Es gibt einen offiziellen **Sanity-MCP-Connector** (mcp.sanity.io).
- **Vercel-Fakten:** DPF-zertifiziert; Functions-Region auf **fra1 (Frankfurt)** pinbar, Auslieferung/Edge global anycast (DPF deckt Drittland). Vercel-DPA im Account noch akzeptieren.
- **★ Architektur = Option A (Bild-Proxy):** Bilder werden **nicht** direkt vom Sanity-CDN geladen, sondern über eine Vercel-Route **`api/image` proxied** (+ Anpassung von `urlFor()`, ~40 Zeilen). Dadurch kontaktieren **Besucher nur womensurance.de/Vercel**; Sanity fällt aus dem **Besucher**-Datenpfad. Sanity bleibt trotzdem Unterauftragsverarbeiter (enger Scope: nur CMS/Content Lake, Redaktionsdaten + in Testimonials genannte Personen) — steht so in AVV Anlage 3 Nr. 2.
- **⚠️⚠️ Der Bild-Proxy ist NOCH NICHT gebaut.** Er MUSS stehen, **bevor der Vorschaulink an den DSB geht** (nicht erst zum Go-Live!) — sonst sieht der DSB im Netzwerk-Tab direkte `cdn.sanity.io`-Requests und die gerade geprüfte AVV stimmt nicht mehr mit der Realität überein. **Das ist die wichtigste offene Dev-Aufgabe.**

## A.6 · Datenschutz / AVV / DSB-Prüfung
- **Rollenteilung:** technische Umsetzung durch Felix (Auftragsverarbeiter); rechtliche Verantwortung + die **juristischen Texte (Datenschutzerklärung/Impressum) macht DVM über Maisel Consult** — nicht aus den Framer-Texten recyceln. → Felix liefert nur die **technischen Angaben zu** (eingesetzte Dienste, Datenarten, Empfänger), Maisel textet. Buchungen laufen über DVMs eigenes Microsoft-Bookings → keine personenbezogenen Daten bei Felix außer Hosting-Logs.
- **✅ DSB-Prüfung erledigt (Mail 20.07.2026):** Ronny Klotzenbücher (Maisel Consult) hat die AVV nach Art. 28 DSGVO + BDSG geprüft. Urteil: **„sehr guter Eindruck", keine wesentlichen Bedenken, auch ohne Änderungen unterzeichnungsfähig.** Lobte die transparente Darstellung von Vercel + Sanity inkl. Drittland-Rechtsgrundlagen.
- **5 Präzisierungswünsche am 23.07. umgesetzt (v4, nur AVV):** (1) E-Mail+Web des AV im Vertragskopf; (2) neue **§ 3 (5)** — kein DSB benannt, keine Benennungspflicht Art. 37 DSGVO/§ 38 BDSG, Felix als Ansprechpartner; (3) Fristen: Breach-Meldung **24 h nach Kenntnis** (§ 8), Unterstützung Betroffenenanfragen **5 Werktage** (§ 4 Abs. 3); (4) Audits **1×/Jahr + anlassbezogen, 14 Tage Vorankündigung** (§ 10 Abs. 2); (5) **Gerichtsstand Ingolstadt** (§ 13 Abs. 4).
- **Vertrags-Historie der AVV (zur Nachvollziehbarkeit):** v2 (14.07.) Sanity als Unterauftragsverarbeiter präzise eingearbeitet (Sanity US Inc., SCC, GCP Belgien); v3 (17.07.) nach Gegen-Review Kategorien betroffener Personen (redakt. Nutzer + Testimonial-Personen) + Anlage-2/§7-Angleichung; v4 (23.07.) die 5 DSB-Punkte. Werkvertrag § 2(2) „Hosting-Region EU" → „Server-Region EU". Wartungsvertrag war bereits konsistent.
- Ein eigener Anwalt auf Felix' Seite bleibt optional (DSB-Check war positiv).

## A.7 · Reihenfolge der Umsetzung (Roadmap — so an Julia kommuniziert)
0. **Kickoff / Content-Sichtung** (ab 20.07): Fathom-Recap des Julia-Gesprächs; **erhalten:** Bilder + Fonts ✓. **Offen:** Texte/About-me, Testimonials (inkl. **Einverständnis der genannten Personen!**), Kennzahlen + Quellen für den Finanzlücken-Rechner.
1. **Impressum/Datenschutz parallel mit DVM** — DVM/Maisel textet, Felix liefert die technischen Angaben zu. Cookie-Banner/Dienste ergänzen.
2. **Iterativer Bau** mit Julia-Feedback-Terminen.
3. **Sanity-Anbindung erst wenn Struktur/Content stehen** (Ende Phase 2): Schema + `src/data/*.js` anbinden + **Vercel-Bild-Proxy (Option A, muss vor Go-Live bzw. DSB-Vorschaulink!)** + Redaktionszugang für Julia.
4. **SEO + GTM/Meta-Pixel/Cookie-Banner** (consent-gated) zum Schluss.
5. **QA / Abnahme / Go-Live ~10.08.** → Wartung startet, Schlussrechnung raus.

## A.8 · Offene Aktionspunkte (Checkliste)
- [x] ~~**Vercel-Bild-Proxy `api/image` bauen**~~ — **erledigt 01.08.2026** (s. A.10).
- [ ] **Beim Sanity-Anschluss:** ausnahmslos `urlFor()` aus `src/lib/sanityImage.js` verwenden. Ein einziges direktes `cdn.sanity.io` im Frontend macht die Aussage in der Datenschutzerklärung („keine Verbindung zu Sanity") unwahr.
- [ ] **Sanity-DPA im Sanity-Account akzeptieren** — die Datenschutzerklärung behauptet einen AVV mit Sanity. Muss vor Go-Live stimmen.
- [ ] **`/barrierefreiheit` vor Abnahme final gegenprüfen.** Die Seite ist bewusst ein Zwischenstand (am 01.08. an Thomas Gessert/DVM-IT verlinkt), **nicht** die Endfassung. Zur Abnahme: (a) alle 8 Punkte unter „Stand der Umsetzung" gegen den dann aktuellen Code neu messen, insbesondere „Textalternativen für Bilder", sobald Julias Fotos drin sind; (b) rechtliche Endfassung von Maisel Consult einholen (Werkvertrag § 2 Abs. 6); (c) `stand=` auf das Abnahmedatum setzen.
- [ ] `VITE_THEME_PANEL` in den Vercel-Env-Variablen setzen (jetzt `true` für Julia, zum Go-Live entfernen/`false`).
- [ ] Vercel-DPA im Account akzeptieren; womensurance.de auf DVM registrieren.
- [ ] Sanity-Projekt-Region in Sanity Manage gegenprüfen; Sanity-DPF-Status auf dataprivacyframework.gov checken (nur falls DPF statt nur SCC behauptet werden soll — aktuell bewusst SCC).
- [ ] Von Julia: About-me-Text, Testimonials + Einverständnisse, Kennzahlen + Quellen.
- [ ] Wartungsrechnung-Datum (s. A.4) ggf. angleichen.
- [ ] Nach Unterschrift: `Verträge/_backup_pre_dsb/` löschen (und `_backup_pre_bfsg/`).
- [ ] E-Mail-Adresse für Barriere-Meldungen in `pages/Barrierefreiheit.jsx` einsetzen (aktuell Platzhalter `info@dvm.de`).
- [ ] Klären: geht das `ThemePanel` („Farben testen") live mit oder wird es vor Go-Live per Env-Flag entfernt?
- [ ] Manuell gegenprüfen: `prefers-reduced-motion` (Windows → Barrierefreiheit → Visuelle Effekte → Animationseffekte aus). Der Preview-Browser kann die Media Query nicht emulieren.
- **🚫 Außenkommunikation (Mails/Rechnungen an DVM) verschickt IMMER Felix selbst — nie eigenständig senden.** (Regel aus `Business/CLAUDE.md`.)

## A.8b · Schreibregel: keine Gedankenstriche (01.08.2026)
Felix will in diesem Projekt **keine Gedankenstriche** („Spiegelstriche", — oder –) als Satzzeichen. Gilt für alle Texte, die ich schreibe: Website-Inhalte, Rechtstexte, Code-Kommentare, Commit-Messages, Dokumente. Stattdessen Komma, Punkt, Doppelpunkt oder Klammern. Nicht betroffen: Bindestriche in Wörtern, Zahlenspannen wie „§§ 59–68", sowie fremde Texte, die nur übernommen werden (eRecht24-Standardklauseln in `Datenschutz.jsx`, Zitate). Julias eigene Seitentexte pflegt sie selbst, die sind nicht meine Baustelle.

## A.9 · Barrierefreiheit (BFSG) — umgesetzt 31.07.2026
DVMs IT-Prüfer (Thomas Gessert) hat am 30.07. Barrierefreiheit angemahnt; Doris Hampe wollte einen Zusatz im Werkvertrag. **Maßstab: WCAG 2.1 Level AA** (technische Grundlage der EN 301 549). Rechtsrahmen ist das **BFSG** (seit 28.06.2025), *nicht* die BITV 2.0 — die gilt nur für öffentliche Stellen. Ob womensurance.de überhaupt in den Anwendungsbereich fällt, ist ein Grenzfall (§ 2 Nr. 26 BFSG verlangt Ausrichtung auf einen Verbrauchervertragsschluss; die Buchung läuft aber auf DVMs eigenem System) — umgesetzt wurde es trotzdem, als Kundenwunsch.

- **Werkvertrag v5 (31.07.):** neuer **§ 2 Abs. 7** (WCAG 2.1 AA, Stichtag Abnahme, Ausnahmen a–c: externe Systeme / später eingepflegte Inhalte / dekorative Elemente, keine dauerhafte Vollkonformität geschuldet); **§ 2 Abs. 6** um die Informationen nach § 14 BFSG erweitert (Text macht Maisel, Felix liefert technische Angaben zu); **§ 3** um Mitwirkungspflicht des AG (Alt-Texte, Untertitel, barrierefreie PDFs). Backup: `Verträge/_backup_pre_bfsg/`.
- **Farb-Regel (wichtig für neue Komponenten):** Untergrenze **`text-paper/55`** auf dunklem, **`text-ink/75`** auf hellem Grund (**seit 01.08. von /60 angehoben** — /60 hält nur mit dem Original-Ink `#0a0807`, nicht mit Julias wärmerem `#2a211b`).
  **Pink nach Grund und Schriftgröße wählen:**
  | Situation | Klasse |
  |---|---|
  | beliebiger Text auf **ink** | `text-pink` (unverändert, 5,0–5,7:1) |
  | **großer** Display-Text (≥24px) auf paper/bone | `text-pink-display` |
  | **kleiner** Text auf paper/bone | `text-pink-deep` |
  | Eyebrow in Braun auf paper/bone | `text-clay-deep`, nie `text-clay` |
- **Kontrast-geführte Token (`mitKontrast()` in `theme/themes.js`, 01.08.):** `pink-deep`, `pink-display` und `clay-deep` werden nicht mehr mit fester Mischung berechnet, sondern nur so weit Richtung Schwarz (auf dunklem Grund: Weiß) verschoben, **bis das WCAG-Ziel gegen `paper` erreicht ist** — `paper` ist der dunkelste helle Grund, also der ungünstigste Fall. Folge: Reicht die Markenfarbe schon, bleibt sie **exakt unverändert**. Beim Original-Preset ist `pink-display` deshalb identisch mit `pink` (`#ff2e88`, 3,01:1); bei julia-braun wird daraus `#db5083` (10 % dunkler). Neue Presets brauchen keine Handarbeit mehr.
- **Muster für animierte Zahlen:** GSAP schreibt per `textContent` — der animierte Knoten bekommt `aria-hidden`, daneben steht der Endwert als `.sr-only` (statisch) bzw. bei Nutzereingaben eine entprellte `aria-live="polite"`-Region. Betrifft `DataNumber`, `PensionGapChart`, `ParttimeCalculator`, `TheNotice`.
- **`splitChars()`** zerlegt Headlines in Buchstaben-Spans → der animierte Block ist `aria-hidden`, der Satz steht einmal als `.sr-only` daneben (siehe `OpeningStatement`).
- **Reduced Motion:** `useReducedMotion` hängt jetzt an App, Lenis und Cursor; `gsap.globalTimeline.timeScale(100)` + CSS-Block in `globals.css`. Die **gepinnten Sektionen bleiben** — sie sind Layout, keine Deko.
- **Neue Seite** `/barrierefreiheit` (`pages/Barrierefreiheit.jsx`, im Footer verlinkt). Technische Angaben sind belastbar, die rechtliche Endfassung macht Maisel.
- **Kontrast-Auditor** `contrast-audit.js` (Projektwurzel): misst jedes gerenderte Textelement gegen WCAG 1.4.3, inklusive Alpha-Blending durch die Ancestor-Kette. Inhalt in die Browser-Konsole einfügen → Liste der Verstöße. Bei Design-Änderungen erneut laufen lassen.
- **✅ FINALE PALETTE (01.08.2026): „Julia — Dunkelbraun" mit Marken-Pink.** `ink #2a211b · paper #e8e3e1 · pink #ff2e88 · clay #835f49 · green #a7a376`. Gesetzt als `DEFAULT_PRESET` **und** als `:root`-Fallback in `globals.css` — **beide Stellen müssen synchron bleiben**, sonst springt die Farbe beim Laden. Messstand: **0 Verstöße auf allen 6 Routen, bei 1440×900 und 375×812.**
- **Harte Grenze von #ff2e88:** Luminanz 0,25 → selbst auf **Reinweiß nur 3,5:1**. Für **kleinen Text (4,5:1) auf hellem Grund ist das Marken-Pink physikalisch unmöglich** — kein Hintergrund kann das lösen. Dort zwingend `text-pink-deep` (#bd2265) oder das Label auf ≥18,66 px fett vergrößern, dann greift die 3:1-Schwelle. Betrifft „Was zählt jetzt", „Mehr erfahren" (`YourLife`) und `MistakesStack`.
- **„Julia — Hell" bleibt mit 59 Verstößen unbenutzbar** — invertiert ink/paper, heller Text auf hellem Grund. Müsste neu gebaut werden.
- **⚠️ Nach Änderungen an `tailwind.config.js` den Dev-Server neu starten.** Tailwind liest die Config nur beim Start. Eine neu registrierte Farbe existiert sonst nicht als Klasse, das Element **erbt die Elternfarbe** (meist dunkles Ink) und **besteht die Kontrastprüfung fälschlich**. Genau das ist am 01.08. passiert. Gegenprobe: `getComputedStyle(document.querySelector('.text-pink-display')).color` muss den Token-Wert liefern, nicht die Ink-Farbe.
- **Fallstrick beim Messen (kostete am 01.08. eine Fehldiagnose):** Der Auditor überspringt Elemente mit `opacity < 0.1`. Im Vorschau-Browser steht `document.timeline.currentTime` auf 0, deshalb bleiben ~58 GSAP-animierte Textelemente auf ihrem Startwert und werden **stumm nicht geprüft** — „0 Treffer" war schlicht eine unvollständige Messung. Der Auditor gibt jetzt `ungeprueft` und `theme` mit aus; beide kontrollieren, bevor man ein Ergebnis glaubt.
- **Messstand 31.07.:** 0 Kontrastfehler auf allen 5 Routen · 40 tabbare Elemente, alle mit Fokusring und Accessible Name · keine Überschriften-Sprünge, keine doppelten IDs, keine Bilder ohne alt.

## A.10 · Bild-Proxy, Env-Flags & Reflow — 01.08.2026

**Bild-Proxy `api/image.js` steht** (Vercel Node-Function, Region in `vercel.json` auf `fra1` gepinnt — so wie es in der AVV steht). Dataset per MCP verifiziert: **`production`**, ACL public.
- Kein offener Proxy: Dateiname muss `<sha1>-<b>x<h>.<ext>` matchen, nur eine Whitelist an Transformationsparametern (`w h q fit auto fm dpr rect crop blur sharp flip or bg`) wird durchgereicht, Werte gegen `/^[\w.,-]{1,40}$/` geprüft. Content-Type muss `image/*` sein. SVG bekommt eine sperrende CSP. Cache: `immutable` (der sha1 im Namen macht die URL inhaltsstabil).
- **Frontend nutzt `urlFor()` / `srcSetFor()` aus `src/lib/sanityImage.js`** — bewusst ohne `@sanity/image-url`, weil die Bibliothek cdn.sanity.io-URLs erzeugt.
- `vercel.json`: Rewrite ist jetzt `/((?!api/).*)`, sonst hätte der SPA-Fallback `/api/*` verschluckt.
- Getestet: POST→405, fehlende/fremde/traversierende `id`→400, gültige aber unbekannte `id`→404 (echter Round-Trip zu Sanity), Whitelist verwirft unbekannte Parameter und ungültige Werte.

**Env-Flags** (`.env` ist gitignored, `.env.example` liegt im Repo):
- `VITE_THEME_PANEL` — `true` rendert das Farb-Panel. Bei `false` **entfernt Vite die Komponente komplett aus dem Bundle** (statisch ersetzte `import.meta.env` + früher Return).
- `VITE_GTM_ID` — GTM-Container. Leer = kein Tracking. `src/config/site.js` liest jetzt daraus statt aus einer hartkodierten Konstante.

**Reflow (WCAG 1.4.10) — zwei echte Layoutfehler gefunden und behoben:**
1. `TheNotice`: Der Wrapper des Rentenbescheids brauchte `min-w-0`. Grid-Items haben `min-width: auto`, dadurch setzte sich `max-w-[360px]` gegen das `px-6` durch und der rechte Rand wurde vom `overflow-hidden` gekappt.
2. `.notice-doc`: Die Basis-Schriftgröße hing nur an der Viewport-**Höhe**. Der Bescheid braucht ~26 em Breite; bei 375 px ragten **52 px** Inhalt aus der Karte. Jetzt zusätzlich `min(…, calc((100vw - 48px) / 27.2))` — kann die Schrift nur verkleinern, die Höhen-Kalibrierung bleibt gültig. Kosten: auf schmalen Handys ist der Bescheid ~18 % kleiner als vorher.
- Ergebnis: `document.scrollWidth === innerWidth` auf allen 6 Routen, kein horizontales Scrollen, kein abgeschnittener Inhalt.

⚠️ **Messfalle im Preview-Browser:** Dessen Dokument-Zeitachse steht auf 0, deshalb hängen alle GSAP-`fromTo`-Startzustände (z. B. `scale: 1.15`, `scale: 2.6` beim Stempel) im DOM fest und verfälschen jede Breitenmessung. Vor dem Messen die Inline-Transforms neutralisieren, sonst jagt man Phantome. Gleiches gilt für CSS-Transitions — die frieren auf dem Startwert ein.

---

# B · Projekt-, Design- & Story-Kontext (ursprünglich, ~Mai 2026)
*Status-/Preis-Angaben hier sind historisch — es gilt Abschnitt A. Design/Story/Tech bleiben gültig.*

## 0 · Was ist das
Awwwards-2026-Pitch-Site für **Womensurance** — eine Frauen-Finanz-/Versicherungsmarke. Editorial Data-Story „**Die Lücke**": eine scroll-getriebene Reportage über den **Gender Pension Gap**, die in **Julia** als persönliche Antwort aufgelöst wird. Bewusst Magazin-Stil (NYT/Bloomberg-Longread) statt Luxus-Feminin. **(Update 27.05.: im Kundengespräch Richtung breiteres „Lebensphasen"-Modell besprochen — vorbehaltlich Preis-Zusage, s. §2/§9.)**

## 1 · Kunde & Kontext
- **Marke:** Womensurance — Sub-Brand der **DVM Ingolstadt** (Deutsche Versicherungsmakler, GmbH & Co. KG).
- **Gesicht/Inhaberin der Marke:** **Julia Pashchenko** (Beraterin bei DVM). Sie zeigt die Site final ihren Kundinnen → darf editorial-aggressiv sein, aber nicht abschreckend.
- **DVM-Größe:** ~40 MA, 2 Standorte, 15.000+ Kunden, 30+ Jahre, ISO 9001:2015, VEMA-Mitglied, sponsert lokale DEL-Eishockeyclubs. Bilanzsumme 0,75 Mio (2022) → **1,9 Mio € (2024)**, starkes Wachstum. Umsatz grob geschätzt **5–8 Mio €** (KG-Bilanz zeigt nicht alles). → solider, wachsender Mittelstand mit Marketing-Budget.
- **Julias Kern-USP:** häufigster Beratungs-Trigger ist **Scheidung** → **Versorgungsausgleich** ist ihr Spezialthema (Frauen verlieren dort oft Rentenansprüche). Das ist der inhaltliche Anker für SEO + Phase 2.
- **Markt-/Wettbewerbs-Benchmark:** u.a. **BüchnerBarella** (Gießen, gegr. 1922, ~500 MA, ~40 Mio € Umsatz, ~350 Mio € verwaltetes Prämienvolumen, Top-3 Industrieversicherungsmakler) — anderes Segment, dient als Größen-/Positionierungs-Vergleich. *(Chat „Büchner Barella" 28.05.2026)*

## 2 · Status (Stand: ~Mai 2026)
- ✅ **Demo gebaut** (8 Akte „Die Lücke", Platzhalter) — Julia „absolut begeistert".
- 🟡 **Initiales GO** (im Prinzip) von Julias Chef, eine **eigenständige `womensurance.de`** zu verfolgen statt des seit ~9 Monaten stockenden internen Projekts — die dynamische Demo überzeugte mehr als die geplante statische Seite. **ABER: der Preis ist noch NICHT zugesagt — *das* ist das entscheidende offene Gate.** Stand: **Fuß in der Tür, kein fixer Auftrag.**
- 💬 **Besprochene Richtung** (vorbehaltlich Zusage): Umbau von der „Pension-Gap"-Story auf ein **„Lebensphasen"-Modell** (s. §9). Der 8-Akt-Build ist Basis, Struktur ändert sich deutlich.
- 💶 **Festpreis-Angebot** geht an Julia → DVM entscheidet. **Kein utopischer Preis, sonst springen sie ab** (s. §3). Einmal-Build + optional Retainer.
- 🌐 Domain `womensurance.de` geplant · **dvm.de-Verknüpfung steht noch aus** (bisher nur „Fuß in der Tür"). Noch **nicht deployed**.

## 3 · Pricing (offen — wichtig)
- Felix' Tendenz: **2.000 € Festpreis** (ohne SEO).
- Claudes Gegenargument: zu niedrig → Selbst-Unterverkauf + falscher Anker bei DVM als potenziellem Mehrjahres-Kunden. Empfehlung **4.500–6.500 €, Vorschlag 5.500 € fix**.
- **Entscheidung noch nicht final.** Option-Pricing zum Nachschieben: Versorgungsausgleich-Landingpage +1.500 €, Maintenance 250 €/Monat, SEO-Paket Phase 2 separat 3.000–5.000 €.
- **Update 27.05.:** Julias Chef gab das **prinzipielle GO**, aber **der Preis ist das Make-or-Break-Gate.** DVM würde es (im Prinzip) finanzieren, ist aber budgetbewusst → fair bewerten, **aber nicht utopisch**, sonst platzt es trotz GO. Einmal-Build + optional Retainer.
- **Entscheidung Felix (~31.05.): 4.500 € Festpreis** ins Angebot — bewusst landefähig (foot in the door), Felix sehr zufrieden. **Phase 2 / SEO bleiben separat** (schützt den Anker für später).
- **Angebots-Struktur final:** 4.500 € einmalig (Build) + **30 €/Monat „Hosting & Betreuung"** (Hosting auf Vercel Pro / Uptime / kleine Updates). Felix ist **Kleinunternehmer (§19 UStG) → keine USt** ausgewiesen, 4.500 € = Endbetrag (§19-Hinweis nur auf der Rechnung). Zahlung **50/50** (Auftrag/Live). Domain `womensurance.de` am besten **DVM-eigen**.

## 4 · Story-Architektur (8 Akte)
| # | Komponente | Mechanik |
|---|---|---|
| 00 | `Loader` | Counter 0 → 39.4 (= Gender Pension Gap %), Variable-Font-Weight-Tween |
| 01 | `OpeningStatement` | Char-Reveal, R3F-Partikel-Hintergrund |
| 02 | `TheGap` | Pinned scrub: SVG-Linien divergieren, Big-Number zählt hoch |
| 03 | `YourLife` | Pinned horizontal, 7 Lebensphasen, **interaktive Toggles → Live-Lücke** (Calculator!) |
| 04 | `TheTruth` | Bridge, übernimmt personalisierte Lücke aus 02/03 |
| 05 | `MeetJulia` | Editorial-Portrait, Pull-Quote, clip-path Reveals |
| 06 | `TheMethod` | Sticky-Stack Cards |
| 07 | `Voices` | Editorial-Testimonials, vertikal gestapelt (kein Slider) |
| 08 | `TheStep` | Magnetic-Button CTA |
+ Cross-cutting: `Cursor` (kontextbewusst), `GrainOverlay`, `Lenis`, `GapProvider` (shared state für Lücken-Berechnung).

## 5 · Tech-Stack & Design
- Vite · React 18 · Tailwind 3 · GSAP+ScrollTrigger · Lenis (GSAP-Ticker) · R3F + drei (Partikel-Hero).
- **Fonts:** Fraunces (variable Display, Italic+SOFT) · Geist (Body) · JetBrains Mono (Daten/Captions). Bewusst **nicht** Cormorant/Inter.
- **Farben:** `#ff2e88` (Pink) · `#0a0807` (Ink) · `#f4ede4` (Paper) — als CSS-Vars + Tailwind-Tokens.
- ScrollTriggers in `gsap.context()` (sauberes Cleanup). `useReducedMotion` vorhanden, noch nicht überall verkabelt.

## 6 · Offene Punkte / Platzhalter (vor Live-Schaltung)
- **Julia-Portraits** (3, professionelles Shooting: Office / Outdoor Ingolstadt / Detail) → `MeetJulia.jsx`
- **Echte Stats + Quellen** (Stat. Bundesamt) → `data/gapStats.js`
- **Echte Testimonials** → `data/voices.js` · **Impressum** → `Footer.jsx`
- **Lebensphasen-Mathe mit Julia abgleichen** → `hooks/useGapState.jsx`
- **Logo-SVG** statt Type-Wordmark · **OG-Image + Meta** fehlt
- **R3F code-splitten** (Three-Bundle = ~70 % initial load) · **Booking-Embed** (CTA verlinkt aktuell zu Outlook)

## 7 · SEO (separat, später — nicht im Erst-Angebot)
- Riesen-Chance um **Versorgungsausgleich** (~23.500 Suchen/Monat, viele KD < 30) — passt exakt zu Julias USP. „rentenlücke berechnen" (4.400 Vol, KD 32) → **Site hat den Calculator schon = Ranking-Hebel.** „altersvorsorge frauen ab 40" KD 12.
- „Frauen"-Suffix bringt meist **kein** Extra-Volumen → Frauen-Fokus über Content, nicht über Keyword.
- Neue Domain, 0 Backlinks → realistisch **6–12 Monate**. Strategie: womensurance.de als Hauptmarke + dedizierte Seite auf **dvm.de als Backlink** (nicht Redirect; ein starker Authority-Link schlägt 100 schwache). Female-Finance-Szene (Madame Moneypenny, herMoney) als Backlink-Quelle.

## 8 · Phase 2 (in der Schublade)
Dedizierte **Versorgungsausgleich-Landingpage** (eigenes Awwwards-Treatment), erst bauen wenn DVM grünes Licht für Phase 2/SEO gibt.

## 9 · Besprochene Richtung — „Lebensphasen"-Modell (Quali-Call Julia, 27.05.2026, *vorbehaltlich Preis-Zusage*)
**Pivot:** Von der einen „Pension-Gap"-Erzählung → breiteres **„Lebensphasen"-Modell** mit mehreren Lücken (Health-/Pay-/Insurance-Gap).
- **Hero:** statische Grafik, die den **kumulierten finanziellen Effekt** von Lebensereignissen zeigt (Karrierepause, Teilzeit …) → teasert den Calculator darunter.
- **Interaktiver Calculator** direkt unter Hero: Nutzerin klickt Lebensereignisse (`Kind`, `Teilzeit` …) → sieht ihre **individuelle Lücke** live.
- **Lebensphasen-Kacheln** als zentraler Navi-Hub:
  - **Volle Unterseiten:** `Teilzeit/Care-Arbeit` **und** `Scheidung` (komplexe Themen in Tiefe).
  - **Pop-ups:** für leichtere Phasen (Ausbildung, Erster Job …).
  - **Jede** Kachel/Pop-up: prominenter **„Erstgespräch buchen"-CTA.**
- **Sticky-Header** spiegelt Sektionen: `Die Lücke · Dein Leben · Vorstellung · Ablauf`; „Dein Leben" mit Dropdown zu den Kacheln.
- **Marketing/Tech:** **Meta Pixel** einbauen (Retargeting TikTok/IG) · sichtbare Social-Icons (TikTok/IG/LinkedIn, Footer) · SEO-Nischen-Keywords recherchieren.
- **Farbe:** Julia findet das aktuelle **Schwarz zu hart** → Alternativen testen: **Dunkelbraun** oder **DVM-Schema** (Blau/Schwarz/Weiß).
- **Content:** Julia liefert alle Texte/Grafiken/Fotos.

---
*Quellen: Projekt-README + claude.ai-Chat „womansurance.com" (02.05.2026) + Fathom-Meeting „Julia [ ] Felix" (27.05.2026). Bei Konflikt gewinnt der aktuelle Code/README.*
