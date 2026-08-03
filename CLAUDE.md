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
- [x] ~~**Beim Sanity-Anschluss:** ausnahmslos `urlFor()` verwenden~~ — **erledigt 03.08.2026** (s. A.14). Bilder laufen über `Bild` aus `src/lib/inhalt.jsx`, Inhalte werden beim Bauen geholt, kein Laufzeit-Kontakt zu Sanity.
- [x] ~~**Sanity: Felix' Handgriffe**~~ — **erledigt 03.08.2026.** Anmeldung, Seed, Deploy, Julia als **Editor** eingeladen, beide Webhooks verdrahtet. Felix hat gegengeprüft: Änderung im Studio + Veröffentlichen löst den Build aus, nach 1 bis 2 Minuten ist sie live.
- [ ] **Sanity-AVV besorgen — es gibt KEINEN Klick dafür** (geprüft 03.08.2026). `sanity.io/legal/dpa` ist 404, weder Terms of Service noch Privacy Policy binden eine DPA per Verweis ein, und in `manage.sanity.io` gibt es keinen Haken. Sanity nennt eine DPA nur in Marketing-/Antworttexten. Route: schriftlich bei `legal@sanity.io` (Kopie `privacy@sanity.io`, DSB `dpo@sanity.io`) anfordern, unter Nennung von Projekt `10o1bkel`. ⚠️ Auf dem **Gratis-Plan** kann Sanity die Unterzeichnung verweigern oder auf einen bezahlten Plan verweisen. **Das ist ein echtes Risiko:** AVV Anlage 3 führt Sanity als Unterauftragsverarbeiter und die Datenschutzerklärung behauptet einen AVV. Kommt keiner zustande, muss entweder ein bezahlter Sanity-Plan her oder Maisel muss die Aussage anpassen.
- [ ] **`/barrierefreiheit` vor Abnahme final gegenprüfen.** Die Seite ist bewusst ein Zwischenstand (am 01.08. an Thomas Gessert/DVM-IT verlinkt), **nicht** die Endfassung. Zur Abnahme: (a) alle 8 Punkte unter „Stand der Umsetzung" gegen den dann aktuellen Code neu messen (Julias Fotos sind seit 02.08. mit Alt-Texten drin; offen bleiben später über Sanity eingepflegte Bilder); (b) rechtliche Endfassung von Maisel Consult einholen (Werkvertrag § 2 Abs. 6); (c) `stand=` auf das Abnahmedatum setzen.
- [ ] `VITE_THEME_PANEL` in den Vercel-Env-Variablen setzen (jetzt `true` für Julia, zum Go-Live entfernen/`false`).
- [x] ~~Vercel-DPA im Account akzeptieren~~ — **erledigt sich von selbst** (geprüft 03.08.2026). Das Vercel DPA (Fassung 17.03.2026, wirksam 31.03.2026) sagt selbst: „This Addendum shall become legally binding upon Customer entering into the Agreement". Es gilt also mit den Nutzungsbedingungen, ohne Klick und ohne Unterschrift. Für die Akte reicht der Ausdruck von `vercel.com/legal/dpa`. Es gibt **nichts** im Dashboard zu suchen.
- [ ] ⚠️ **Vercel-Plan: Hobby reicht rechtlich nicht.** Vercels Fair Use Guidelines definieren als kommerziell ausdrücklich „Receiving payment to create, update, or host the site" und beschränken Hobby auf „non-commercial personal use only". Werkvertrag 4.500 € plus 30 €/Monat Hosting sind genau das. **Vor Go-Live auf Pro (20 $/Monat) wechseln.** Betrifft auch `empire-dom`. Nebeneffekt: Pro hebt die Speed-Insights-Beschränkung auf (Hobby: genau **ein** Projekt, 10.000 Ereignisse/Monat, 7 Tage Rückschau).
- [ ] **womensurance.de** ist **registriert und geparkt** (geprüft 03.08.2026): Nameserver `ns10xx.ui-dns.{org,biz,de,com}` = **IONOS**, A-Record `217.160.0.99`, kein gültiges Zertifikat. Zu klären: wer hält den IONOS-Vertrag (muss DVM sein, s. A.2). Umstellung auf Vercel per A-/CNAME-Record, **nicht** per Nameserver-Delegation, damit DVM die DNS-Hoheit behält. ⚠️ Die konkreten Werte **aus dem Vercel-Dashboard** übernehmen: Vercel vergibt inzwischen **projekt-eigene** CNAME-Ziele (Form `<hash>.vercel-dns-0xx.com`), das früher überall zitierte `cname.vercel-dns.com` ist überholt.
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
  | **kleiner** Text auf paper/bone | `text-clay-deep` (Braun) — **nicht** `text-pink-deep`, s. A.11 |
  | Eyebrow in Braun auf paper/bone | `text-clay-deep`, nie `text-clay` |
- **Kontrast-geführte Token (`mitKontrast()` in `theme/themes.js`, 01.08.):** `pink-deep`, `pink-display` und `clay-deep` werden nicht mehr mit fester Mischung berechnet, sondern nur so weit Richtung Schwarz (auf dunklem Grund: Weiß) verschoben, **bis das WCAG-Ziel gegen `paper` erreicht ist** — `paper` ist der dunkelste helle Grund, also der ungünstigste Fall. Folge: Reicht die Markenfarbe schon, bleibt sie **exakt unverändert**. Beim Original-Preset ist `pink-display` deshalb identisch mit `pink` (`#ff2e88`, 3,01:1); bei julia-braun wird daraus `#db5083` (10 % dunkler). Neue Presets brauchen keine Handarbeit mehr.
- **Muster für animierte Zahlen:** GSAP schreibt per `textContent` — der animierte Knoten bekommt `aria-hidden`, daneben steht der Endwert als `.sr-only` (statisch) bzw. bei Nutzereingaben eine entprellte `aria-live="polite"`-Region. Betrifft `DataNumber`, `PensionGapChart`, `ParttimeCalculator`, `TheNotice`.
- **`splitChars()`** zerlegt Headlines in Buchstaben-Spans → der animierte Block ist `aria-hidden`, der Satz steht einmal als `.sr-only` daneben (siehe `OpeningStatement`).
- **Reduced Motion:** `useReducedMotion` hängt jetzt an App, Lenis und Cursor; `gsap.globalTimeline.timeScale(100)` + CSS-Block in `globals.css`. Die **gepinnten Sektionen bleiben** — sie sind Layout, keine Deko.
- **Neue Seite** `/barrierefreiheit` (`pages/Barrierefreiheit.jsx`, im Footer verlinkt). Technische Angaben sind belastbar, die rechtliche Endfassung macht Maisel.
- **Kontrast-Auditor** `contrast-audit.js` (Projektwurzel): misst jedes gerenderte Textelement gegen WCAG 1.4.3, inklusive Alpha-Blending durch die Ancestor-Kette. Inhalt in die Browser-Konsole einfügen → Liste der Verstöße. Bei Design-Änderungen erneut laufen lassen.
- **✅ FINALE PALETTE (01.08.2026): „Julia — Dunkelbraun" mit Marken-Pink.** `ink #2a211b · paper #e8e3e1 · pink #ff2e88 · clay #835f49 · green #a7a376`. Gesetzt als `DEFAULT_PRESET` **und** als `:root`-Fallback in `globals.css` — **beide Stellen müssen synchron bleiben**, sonst springt die Farbe beim Laden. Messstand: **0 Verstöße auf allen 6 Routen, bei 1440×900 und 375×812.**
- **Harte Grenze von #ff2e88:** Luminanz 0,25 → selbst auf **Reinweiß nur 3,5:1**. Für **kleinen Text (4,5:1) auf hellem Grund ist das Marken-Pink physikalisch unmöglich** — kein Hintergrund kann das lösen. Dort geht nur eine Ersatzfarbe oder das Label auf ≥18,66 px fett vergrößern, dann greift die 3:1-Schwelle. Betrifft „Was zählt jetzt", „Mehr erfahren" (`YourLife`), `MistakesStack` und die Monatszahl in `TheNotice`. **Seit 02.08. ist die Ersatzfarbe dort Braun (`clay-deep`), nicht mehr abgedunkeltes Pink (`pink-deep`)** — s. A.11.
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

## A.11 · Content-/Layout-Runde 02.08.2026 (Julias Zulieferung)

- **Kein Deep-Pink mehr im Frontend.** Überall, wo `text-pink-deep` nur deshalb stand, weil das Marken-Pink für kleinen Text auf hellem Grund physikalisch zu schwach ist, steht jetzt **`text-clay-deep` (#805d48)** — das Braun aus der Palette. Betroffen: `YourLife` („Was zählt jetzt", „Mehr erfahren"), `MistakesStack` (Kostenzeile), `TheNotice` (Monatliche Minderung). **Nicht** angefasst: `pink-deep` als *Hintergrund* im Hover von `MagneticButton`/`CookieConsent` und die Links in `LegalLayout` (dort ist Pink das Klick-Signal). Der Token `pink-deep` bleibt in `themes.js` bestehen.
- **`RETIREMENT_YEARS` 20 → 15** (`hooks/useGapState.jsx`). Wirkt automatisch auf Rentenbescheid (`TheNotice`) und Teilzeit-Rechner (`ParttimeCalculator`), inkl. der `.sr-only`-Ansagen. Der einzige hartkodierte Satz („zwanzig Rentenjahre lang") ist jetzt interpoliert.
- **`YourLife`: Horizontal-Scroll ist raus.** Die Kacheln stehen auf allen Breiten untereinander; ab `md` stapeln sie sich per `position: sticky` mit 12 px Versatz je Karte (`STICK_BASE`/`STICK_STEP`). Der Prozent-Zähler sitzt in einer eigenen Grid-Spalte rechts und ist ebenfalls sticky, bleibt also die ganze Sektion über sichtbar.
  - ⚠️ **Kein `overflow: hidden` auf einem Vorfahren** dieser Sektion — das schaltet jedes `sticky` darin still ab.
  - ⚠️ `__scrollToPhase` darf **nicht** `offsetTop`/`getBoundingClientRect()` der Karte benutzen (bei geklebten Karten liefern beide die verschobene Position). Es summiert stattdessen die `offsetHeight` der Vorgängerinnen.
  - Ab `md` läuft **kein ScrollTrigger** auf den Karten: ein Trigger auf einem klebenden Element vermisst sich selbst. Der Fade existiert nur noch mobil.
  - `focus-within:z-50` auf der Karte, damit eine bereits gestapelte Karte kein per Tastatur fokussiertes Element verdeckt (WCAG 2.4.7).
- **`SplitAccounts`:** Ab `md` hängt die Liste der geteilten Anrechte jetzt **zwischen den beiden Rentenkonten direkt unter der Raute** (absolut positioniert, `top: calc(42% + 30px)`, Breite 24 % = genau die Lücke zwischen den zwei 38-%-Konten), untereinander und in 15 px statt 12. Mobil unverändert als Chip-Wolke unter der Bühne. Die Bühnenhöhe hat deshalb ab `md` eine Untergrenze von 410 px (`clamp(410px,52vh,470px)`) — darunter passt die ~200 px hohe Liste nicht mehr darunter.
- **Bilder final.** Die vier Platzhalter (`julia-desk/laptop/portrait/window.jpg`) sind gelöscht. Neu: `julia-portrait.jpeg` (704×939) und `julia-desk.jpeg` (704×934) in der Vorstellungssektion, `julia-geschichte.jpeg` (1058×1476) als einzelnes großes Bild in „Die Geschichte". Alle drei haben beschreibende Alt-Texte und `width`/`height` gegen Layout-Shift.
  - ⚠️ **Auflösungsgrenze:** `julia-geschichte` verträgt maximal rund 530 CSS-px Anzeigebreite (2× auf Retina). Die Spalte bleibt deshalb bei `col-span-5`. Wer sie verbreitert, braucht eine höher aufgelöste Datei von Julia.
- **Scheidungs-Statistik #3** ersetzt: der Platzhalter „50 % deiner Ansprüche stehen auf dem Spiel" ist jetzt „50 % aller Scheidungsanträge erfolgen durch die Frau", Quelle Destatis (Zahl von Felix, nicht gegengeprüft).
- **Messstand nach dieser Runde:** `npm run build` grün · 0 Kontrastverstöße und `ungeprueft: 0` auf `/`, `/scheidung`, `/rentenluecke` bei 1440×900 und 375×812 · `document.scrollWidth === innerWidth` überall · keine Konsolenfehler.

## A.12 · Julias Texte eingepflegt — 02.08.2026

Alle redaktionellen Platzhalter auf Startseite, `/rentenluecke` und `/scheidung` sind durch Julias Fassungen ersetzt. Betroffen: `data/lifePhases.js`, `data/methodSteps.js`, `TheNotice`, `TheTruth`, `TheStep`, `OpeningStatement`, `MeetJulia`, `PensionGapChart`, `ParttimeCalculator`, `MistakesStack`, `pages/Rentenluecke.jsx`, `pages/Scheidung.jsx`.

**Strukturelle Folgen (die Texte sind 3 bis 5 mal so lang wie die Platzhalter):**
- `lifePhases.body` und `.details` dürfen jetzt **String oder Array von Absätzen** sein, `FaqSection`-Antworten (`a`) ebenfalls. Das JSON-LD joint das Array wieder zu einem Fließtext, sonst frisst Google die Absatzliste nicht.
- `TopicPage`-Actions haben ein optionales `lead` (Merksatz über dem Fließtext) und die Sektion eine optionale `actionsHeadline`.
- **`YourLife`-Aufklapptext hat jetzt zwei Verhalten:** ab `md` weiterhin Overlay über der Kachel (kein Layout-Shift im Sticky-Stapel, Text scrollt innen). **Mobil klappt er in der Kachel auf und lässt sie wachsen** — als Overlay blieben auf einem 375er Display nur ~305 px Sichtfenster für bis zu 939 px Text. Beim Auf-/Zuklappen läuft ein `ScrollTrigger.refresh()`.
- **Schriftgrade heruntergesetzt, weil die Überschriften länger wurden:**
  `TheTruth` von `10rem` auf `6.5rem` (ab ~104 px bricht „Aber sie ist kein Schicksal." in der 1152 px breiten Spalte um, und ein Umbruch innerhalb einer `line-mask` zerlegt die zeilenweise Einblendung) · `MistakesStack`-H2 von `4.2rem` auf `3.2rem` · `MeetJulia`-H2 von `4rem` auf `3.2rem`.
- `MistakesStack.cost` ist jetzt ein ganzer Merksatz und steht deshalb **nicht mehr als `eyebrow` in Versalien**, sondern in normaler Schreibweise (`font-medium text-clay-deep`).

**Dynamische Zahlen bleiben dynamisch.** `TheNotice`-Lead und `TheTruth`-Headline zeigen weiter den Wert aus `useGap()`, nicht die feste 39,4. In `TheTruth` erscheint das Wort „durchschnittlich" deshalb **nur, solange kein Lebensereignis angeklickt ist** (`activeMeta.length === 0`) — sonst stünde „durchschnittlich 51,4 %" da.

**An Julias Fassung geändert (Felix informiert, jederzeit rückgängig):** drei Gedankenstriche zu Komma/Punkt (Regel A.8b) · Tippfehler „Ttrotzdem", „Rechtschutz" → „Rechtsschutz" · Grammatik „und einer Scheidung" → „und eine Scheidung" · fehlende Satzzeichen ergänzt.

**Offen / von Felix zu bestätigen:** ob die Tipp-Zeile im Rentenbescheid bleibt (aktuell drin) · wo genau „Womensurance / Unabhängige Beratung." stand (der Text existiert im Repo nicht, geändert wurde die Hero-Unterzeile) · **30 oder 60 Minuten Erstgespräch** (`CALL_MINUTES` steht auf 60, Julias Startseiten-Text nennt 30, ihr Scheidungs-Text 60).

**Messstand:** `npm run build` grün · 0 Kontrastverstöße und `ungeprueft: 0` auf `/`, `/rentenluecke`, `/scheidung`, `/impressum` bei 1440×900 und 375×812 · kein Pin-Überlauf, `document.scrollWidth === innerWidth` überall · keine Konsolenfehler bei frischem Laden.

> ⚠️ Teile von A.11 und A.12 sind durch **A.13** überholt (Sticky-Stapel in `YourLife`, Overlay-Aufklapptext, „durchschnittlich"-Bedingung, `MeetJulia`-H2).

## A.13 · Layout-Korrekturrunde 02.08.2026 (Felix, nach Sichtung)

- **`YourLife`: der Sticky-Stapel ist wieder raus.** Das Stapeln sah nicht gut aus. Die Kacheln stehen jetzt auf allen Breiten schlicht untereinander und blenden sich beim Scrollen ein — dieselbe `fromTo`-Mechanik wie `TheMethod` („4 Schritte. Ein Konzept."). Damit sind auch die drei Sticky-Warnungen aus A.11 hinfällig: kein `top`-Versatz, kein `focus-within:z-50`, ScrollTrigger läuft wieder auf allen Breiten.
  - Der **Scrub aus `TheMethod`** (Vorgängerkarten schrumpfen und rutschen hoch) wurde bewusst **nicht** übernommen: dort sind die Karten ~250 px hoch, hier 420–1600 px. Derselbe `yPercent`-Wert zöge die Vorgängerinnen sichtbar über die nachfolgenden — genau der Stapel-Look, der raus sollte.
  - `__scrollToPhase` behält die Vorgänger-Summe (`offsetHeight`), jetzt aber wegen der `translateY(80px)`-Einblendung statt wegen `sticky`. Fester Offset 96 px.
  - **Aufklapptext liegt jetzt auf allen Breiten im Fluss** (`hidden`-Attribut), die Kachel wächst. Ohne Stapel gibt es keinen Grund mehr, Julias langen Text in ein Scrollfenster zu sperren. Der Button toggelt („Mehr erfahren" / „Weniger anzeigen", `aria-expanded`).
- **Prozentzahl mobil fixiert.** Der Zähler klebt jetzt auch mobil (`sticky top-20`), ab `md` wie gehabt bei `top-28`.
  - ⚠️ `sticky` sitzt auf dem **Grid-Element selbst**, nicht auf einem Kind: mobil ist der Container nur so hoch wie sein Inhalt, ein sticky Kind hätte darin keinen Laufweg. Ab `md` braucht es dafür `md:self-start`, sonst streckt das Grid die Zelle auf die volle Zeilenhöhe und `sticky` greift wieder nicht.
  - Mobil ist es ein **deckendes Band über die volle Breite** (`-mx-6`, `bg-paper`, Hairline unten), kein schwebendes Kästchen: ein Kästchen legte sich beim Scrollen gemessen über je eine Textzeile jeder Kachel. Ab `md` transparent und ohne Rahmen.
- **`.notice-doc` (Rentenbescheid) ist jetzt auch an die BREITE gekoppelt.** Vorher hing die Schriftgröße ab `md` allein an der Viewport-Höhe. Der Bescheid hat wegen mehrerer `whitespace-nowrap`-Zeilen eine harte Mindestbreite von **28,8em** — auf 768×1024 ragte er dadurch 56 px aus seiner Spalte, auf 1920×1080 rund 40 px, beides vom `overflow-hidden` der Pin-Sektion gekappt (WCAG 1.4.10). Zwei Media-Queries, Divisor = Spaltenanteil / 29,5em.
  - Dazu bekommt der Bescheid zwischen `md` und `lg` mehr Spaltenbreite (`md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:grid-cols-2`); bei 50/50 wäre seine Schrift auf einem 768er Tablet auf 10,7 px geschrumpft, so sind es 12,9 px. Die beiden Fließtext-Absätze in der linken Spalte sind dort `hidden lg:block`. **Ab 1024 px ist der Bescheid unverändert.** Wer die Spaltenanteile ändert, muss die Divisoren in `globals.css` mitziehen.
- **`TheTruth`:** „durchschnittlich" steht jetzt **immer** und in voller Schriftgröße da, auch wenn Lebensereignisse angeklickt sind (Wunsch Felix, ersetzt die `activeMeta`-Bedingung aus A.12). Gemessen: „durchschnittlich 59,4 %." braucht 1016 px in der 1152 px breiten `line-mask`, bricht also nicht um.
- **`MeetJulia`-H2** hat jetzt das Satzbild von „4 Schritte. Ein Konzept.": `display-lg` in Paper, „womensurance" kursiv in Pink, `clamp(2.1rem, 3.8vw, 3.8rem)`. Mobil mehr Luft (`py-24`, `gap-12`, `space-y-7`).
- **Footer-Rechtsleiste** bricht mobil um (`flex-col` + `flex-wrap gap-y-3`); vorher standen die vier Links in einem `flex gap-6` ohne Umbruch, „Cookie-Einstellungen" lief aus dem Bild.
- **`LegalLayout`-H1:** `hyphens-auto` + `lang="de"` + `break-words`. „Datenschutzerklärung" ist ein 20-Zeichen-Wort und war mobil rund 60 px breiter als die Spalte; es wird jetzt getrennt statt verkleinert, die Schriftgröße bleibt bei `clamp(2.4rem, 6vw, 5rem)`.

**Messstand:** `npm run build` grün (8,87 s) · 0 Kontrastverstöße und `ungeprueft: 0` auf `/`, `/rentenluecke`, `/scheidung`, `/datenschutz`, `/impressum`, `/barrierefreiheit` · `document.scrollWidth === innerWidth` bei **320 · 375 · 768 · 1024 · 1280 · 1440 · 1920** · nichts vom `overflow-hidden` gekappt außer den drei bewusst überstehenden Deko-Elementen (Stempel „VERMEIDBAR", Wasserzeichen „Lücke", Radial-Gradient).

## A.14 · Sanity-Anbindung 03.08.2026

**Entscheidungen (Felix, vor Baubeginn):** redaktionell ist alles Inhaltliche, Rechtstexte und Rechenlogik bleiben im Code · Aktualisierung über automatischen Neubau, nicht zur Laufzeit · Studio auf eigener Adresse, nicht eingebettet.

**Architektur.** `Sanity → npm run build → scripts/fetch-content.mjs → src/content/*.json → Bundle`. Die Website fragt Sanity **nur beim Bauen** ab. Das ist kein Performance-Trick, sondern Werkvertrag § 6 Abs. 4 und AVV: beim Besuch geht nichts an das CMS. Nebeneffekt: der Besucherverkehr läuft nicht gegen die harten Kontingente des Gratis-Plans (die laut Sanity-Doku sonst dazu führen, dass Inhalte schlicht nicht mehr laden).
- **`src/content/*.json` ist der Vertrag.** Dieselbe Struktur, egal ob aus Sanity geholt oder aus dem Repo. Die Dateien sind eingecheckt und dienen als Rückfall: schlägt der Abruf fehl oder ist die Antwort unvollständig, **bricht der Build nicht ab**, sondern baut mit dem letzten Stand. Bewusst so.
- `src/data/*.js` sind nur noch Übersetzer von den Sanity-Feldnamen auf die Namen, die die Komponenten schon benutzten. Dadurch blieb das Rendering unangetastet.
- `src/lib/inhalt.jsx`: `Satz` (Überschriften aus Teilen, `stil`: normal/betont/kursiv), `fuellen` (Platzhalter `{minuten}`, `{basiswert}`, `{gap}`, `{anzahl}`), `Bild` (Sanity-Referenz **oder** noch Datei aus `public/images`, immer über `urlFor()`).
- ⚠️ **Der Platzhalter `{minuten}`** ersetzt die früher an drei Stellen kopierte Gesprächsdauer. `CALL_MINUTES` kommt jetzt aus `startseite.gespraechsdauer`. Damit ist die offene Frage „30 oder 60 Minuten" aus A.12 einmal zentral entscheidbar (steht auf 60).

**Studio** liegt als eigenes Projekt in `studio/` (eigene `package.json`, eigene `postcss.config.js`; ohne die zieht der Studio-Build die Tailwind-Basis der Website samt `cursor: none` ein). Bewusst **kein** MCP-verwaltetes Schema: Werkvertrag § 9 schuldet ein Übergabe-Paket mit Quellcode, eine Nachfolge-Agentur soll Standard-Werkzeug vorfinden. Menüstruktur in `studio/structure.js` nach der Reihenfolge der Website, Einzelstücke ohne Duplizieren/Löschen.

**Erfundene Testimonials sind raus.** `voices.js` liefert eine leere Liste, `Voices` rendert dann `null`, die Überschrift zählt über `{anzahl}` mit. Grund: § 5b Abs. 3 UWG (Echtheitsprüfung bei Bewertungen) und die AVV, die „in Testimonials genannte Personen" als betroffene Gruppe führt. Im Schema ist `einverstaendnis` ein Pflichthaken, ohne den sich eine Stimme nicht veröffentlichen lässt.

**Inhalte wurden nicht abgetippt.** `scripts/extract-topic.mjs` hat die rund 8 KB Text der beiden Themenseiten per Textchirurgie aus dem JSX gelöst (Zwischenstand in `scripts/roh/`), `scripts/build-content.mjs` hat daraus die JSON-Dateien gebaut. Beide sind Einmal-Werkzeuge und laufen inzwischen aus den JSON-Dateien, damit ein zweiter Lauf nichts zerstört. `scripts/seed-sanity.mjs` erzeugt daraus `studio/seed/inhalte.ndjson` inklusive Bild-Upload.

**Offen, braucht Felix' Hand** (interaktive Anmeldung, kann ich nicht): `cd studio && npx sanity login`, dann `npm run seed`, `npm run deploy`, Julia einladen, Deploy Hook + Sanity-Webhook verdrahten (Anleitung in `studio/README.md`).

**Nebenbefund, behoben:** Die sieben Rasterbeschriftungen im Hero-Diagramm (`AUSBILDUNG`, `ERSTER JOB`, …) standen mit 9px auf `paper/0.4` = **3,18:1** gegen die geforderten 4,5:1. Jetzt `paper/0.55` = 4,75:1. Vorbestehend seit dem Hero-Umbau. Der Auditor hatte sie übersehen, weil sie im Vorschau-Browser auf dem GSAP-Startwert `opacity: 0` festhängen und als `ungeprueft` durchliefen. Die frühere Meldung „0 Verstöße bei ungeprueft 0" war an dieser Stelle also unvollständig. **Lehre: erst force-visible, dann messen, und Deko-Ausnahme nur für wirklich dekorativen Text.**

**Messstand:** `npm run build` grün · Abruf-Rückfall getestet (leeres Dataset → Build läuft mit Repo-Inhalten weiter, Exit 0) · 0 Kontrastverstöße mit `ungeprueft: 0` auf `/`, `/rentenluecke`, `/scheidung` bei 375, 768 und 1280 · kein ungeklippter Überlauf (die drei bewusst überstehenden Deko-Elemente bleiben) · Startseite, beide Unterseiten und alle Zählwerte inhaltlich gegengeprüft.

⚠️ **Messfalle Vorschau-Browser (neu):** `resize_window` ändert `clientWidth`, aber **nicht** `innerWidth`, und `position: fixed`-Elemente behalten die alte Breite. Überlauf deshalb gegen `clientWidth` prüfen und fixierte Elemente ausnehmen. Außerdem baut GSAP den `pin-spacer` bei einem Resize ohne echtes Resize-Ereignis nicht neu. Nach Größenänderung die Seite **neu laden**, sonst misst man einen 1280er Spacer in einem 375er Fenster.

## A.15 · Tracking, Verträge, Plattform-Compliance — 03.08.2026

**Verträge sind unterschrieben zurück** und liegen als PDF unter `Business/Kunden/Womensurance (DVM)/Verträge/signed/`: `Werkvertrag FBartels_030826 final.pdf`, `Vertrag über AVV_FBartels 0726.pdf`, `Wartungs-und Hostingvertrag_FBartels_0726.pdf`. Damit sind die beiden `_backup_pre_dsb/` und `_backup_pre_bfsg/` löschbar.

**GTM-Container steht:** `GTM-WHJ254XW`, Konto **DVM**, Container `womensurance.de`. Gehört damit richtigerweise DVM, nicht Felix. Muss noch als `VITE_GTM_ID` in die Vercel-Env-Variablen.

**dvm.de gemessen (03.08.2026), nicht geraten.** Kein GA4, kein GTM, kein Meta Pixel, kein LinkedIn Insight Tag. Geladen werden nur Usercentrics (Settings-ID `wwTZDc-Nrnugk4`) und Framer-eigene Skripte. Keine `G-`, `GTM-` oder `UA-`-Kennung im Dokument, `window.gtag` nicht definiert. Deckt sich mit dem Banner, das nur *Proven Expert* und *kununu* führt.
⚠️ **Das beweist nur, dass die Website kein GA4 einbindet, nicht dass DVM kein GA4-Konto hat.** Die belastbare Gegenprobe macht Felix in `analytics.google.com` mit demselben Google-Konto, mit dem er auf das GTM-Konto DVM zugreift.

**Consent-Verdrahtung, der klassische Fehler:** `src/lib/consent.js` lädt GTM, sobald **Statistik ODER Marketing** eingewilligt ist. Google-Tags respektieren danach den Consent Mode v2 von selbst, **Meta Pixel und LinkedIn Insight Tag nicht** — die feuern, sobald der Container läuft. Für beide muss in GTM unter *Tag → Erweiterte Einstellungen → Einwilligungseinstellungen* eine **zusätzliche Einwilligungsprüfung** auf `ad_storage`, `ad_user_data`, `ad_personalization` gesetzt werden, für GA4 auf `analytics_storage`. Ohne das wäre die Marketing-Kategorie im Banner wirkungslos.

**`@vercel/analytics` und `@vercel/speed-insights` hängen ungegated in `App.jsx`.** Beide sind cookiefrei, Vercel ist über die AVV ohnehin Auftragsverarbeiter, insofern vertretbar. Sie müssen aber **in der Datenschutzerklärung stehen** — Maisel weiß bisher nichts davon. Zur Liste der technischen Angaben nachreichen.

**Zwei rechtliche Sachstände geprüft und korrigiert** (Details in der Checkliste A.8): das Vercel-DPA gilt automatisch mit den Nutzungsbedingungen, es gibt nichts zu klicken; einen Sanity-AVV gibt es **nicht** per Selbstbedienung, der muss bei `legal@sanity.io` angefordert werden. Dazu die Hobby-Plan-Frage: Hobby ist laut Vercels Fair Use Guidelines auf nicht-kommerzielle Privatnutzung beschränkt, bezahltes Hosting fällt ausdrücklich darunter.

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
