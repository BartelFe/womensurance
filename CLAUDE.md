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
- **✅ Der Bild-Proxy steht** (`api/image.js`, URLs erzeugt `lib/sanityImage.js`). Bewusst ohne `@sanity/image-url`, weil die Bibliothek `cdn.sanity.io`-URLs baut. **Diese Eigenschaft ist rechtlich tragend, nicht kosmetisch:** sobald irgendwo wieder eine direkte `cdn.sanity.io`-URL entsteht, sieht der DSB sie im Netzwerk-Tab und die geprüfte AVV stimmt nicht mehr mit der Realität überein. Bei jeder Änderung an der Bildausgabe gegenprüfen.

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
- [x] **Sanity-AVV liegt vor (03.08.2026).** Es gibt dafür tatsächlich keinen Klick: `sanity.io/legal/dpa` ist 404, weder Terms of Service noch Privacy Policy binden eine DPA per Verweis ein, und in `manage.sanity.io` gibt es keinen Haken. Der Weg war die schriftliche Anfrage bei `legal@sanity.io`. **Antwort von Dennis P. (Senior Support Engineer, Kopie an legal@) mit dem „Data Processing Addendum", Fassung Mai 2025, als PDF.** Es lässt sich weder unterschreiben noch verhandeln (das ist Enterprise-Kunden mit Account Executive vorbehalten), sondern gilt automatisch: es „forms part of the Subscription Agreement", und in Schedule A steht „The signature in the Agreement shall satisfy this signature requirement." Also derselbe Mechanismus wie bei Vercel. ⚠️ **Damit ist die Mail samt Anhang der einzige Nachweis** — beides zu den Verträgen ablegen, ohne sie ist der AVV nicht belegbar. Inhaltlich deckt es Art. 28 Abs. 3 lit. a bis h ab (Ziffer 2.1 Weisungsbindung, 2.4 Vertraulichkeit, 4 Sicherheit, 6 Unterauftragnehmer mit 14-Tage-Widerspruch, 7 Meldung binnen 72 h, 3.1/3.2 Mitwirkung, 8 Audit, 9 Löschung) und bindet in Ziffer 10.1 die EU-Standardvertragsklauseln 2021/914 Modul 2 ein. **Damit trägt Anlage 3 der unterzeichneten AVV rückwirkend**, die genau diese Klauseln als Grundlage nennt. Weich: Ziffer 8 ist eine Dokumentenprüfung ohne Vor-Ort-Inspektion, Ziffer 9 verweist für die Löschfrist auf das Hauptvertragswerk. Beides SaaS-üblich, liegt zur Bewertung bei Maisel.
- [x] **Vertragspartner ist Sanity US Inc.** (geklärt 04.08.2026). Das DPA nennt in Schedule A „Sanity AS **oder** Sanity US Inc.", maßgeblich ist das Agreement. Die Terms of Service (`sanity.io/legal/tos`) beginnen mit „between Sanity US Inc. („Sanity") and the Subscriber", nennen 351 California St, Suite 650, San Francisco und unterstellen den Vertrag in Ziffer 9.3 kalifornischem Recht mit Gerichtsstand San Francisco. Sanity AS wird dort nirgends genannt. **Anlage 3 Nr. 2 und die Datenschutzerklärung stimmen also**, die Drittlandübermittlung ist real und über die Standardvertragsklauseln gedeckt. Der frühere Vorschlag, in der Rechnungsansicht nachzusehen, ging ins Leere: auf dem Free Plan gibt es keine Rechnungen.
- [x] **`/barrierefreiheit` ist die abnahmefaehige Endfassung (04.08.2026).** Aus dem Zwischenstand vom 01.08. (an Thomas Gessert/DVM-IT verlinkt) wurde eine Fassung, die Klotzenbuecher/Maisel lesen und abzeichnen kann. `stand=` steht auf „4. August 2026".

  **Alle acht Zusicherungen einzeln nachgemessen**, nicht uebernommen: Umschalter mit `aria-pressed` (4) und Regler mit `aria-valuetext` (3) im DOM bestaetigt · Sprunglink bestaetigt · `lang="de"` bestaetigt · 3 Inhaltsbilder, 0 mit leerem `alt` · `aria-live="polite"` in beiden Rechnern · axe/Lighthouse **A11y 100 auf allen vier Seiten**, „color-contrast" ohne Beanstandung · reduzierte Bewegung **mit emulierter Systemeinstellung gemessen**: bei `reduce` kein `window.__lenis` und 0 statt 1 `<canvas>`.

  **Inhaltlich korrigiert, weil falsch:** Der Satz, man koenne zum „eingesetzten Cookie-Einwilligungswerkzeug" keine Aussage treffen, ist raus. Der Banner ist unsere eigene Komponente, kein Fremdtool. Der Satz las sich wie ein Haftungsausschluss fuer eigenen Code. Ebenfalls raus: die Behauptung, spaeter eingepflegte Bilder koennten ohne Alternativtext vorliegen (das Studio laesst nicht veroeffentlichen, `alt` ist `Rule.required()`), und der Verweis auf fehlende Untertitel (die Website hat kein `<video>`, `<audio>` oder `<iframe>`).

  **Neu, weil Anlage 3 Nr. 1 BFSG es verlangt und beides fehlte:** die allgemeine Beschreibung der Dienstleistung samt Erlaeuterung der Funktionsweise (Buchstaben a und b) und die **zustaendige Marktueberwachungsbehoerde** (MLBF AoeR, Carl-Miller-Str. 6, 39112 Magdeburg). ⚠️ Die Telefonnummer aus der Websuche (0391 5676970) war **falsch**, das Impressum der Behoerde nennt **+49 391 289 230 23**. Ausserdem neu: der Absatz „Pruefverfahren", der offenlegt, dass es eine Selbstbewertung ohne externes Audit ist. Ohne ihn waere „weitgehend konform" ungedeckt.

- [x] **Zwei Code-Fehler, die die Seite sonst falsch zugesichert haette (04.08.2026).**
  - `ParttimeCalculator` zeigte „Rentenwert 42,52 € (Stand 07/2025)": neuer Wert, altes Datum. Das Datum war getrennt hartcodiert und blieb beim Wechsel stehen. Steht jetzt als `RENTENWERT_STAND` neben der Zahl in `data/rentenwert.js`, beide koennen nicht mehr auseinanderlaufen.
  - Die drei Schalter im Cookie-Banner hiessen fuer Screenreader „StatistikHilft uns zu verstehen, wie die Website genutzt wird (z. B. ...)" — Bezeichnung und ganze Erlaeuterung in einem Stueck, bei jedem Fokuswechsel vorgelesen. Das umschliessende `<label>` leitete ausserdem keine Klicks weiter, war also auch fuer die Bedienung wirkungslos. Jetzt `aria-labelledby` + `aria-describedby`: Name „Statistik", Beschreibung getrennt.

  ⚠️⚠️ **Werkzeug-Falle, die bei der naechsten Pruefung Zeit spart.** Fuer Namen im Barrierefreiheits-Baum taugt weder der Vorschau-Browser noch axe:
  - `read_page` im Vorschau-Browser zeigte mehrere Links als namenlos an, die in Wahrheit Text tragen (verschachtelte `<span>`). Es zeigte auch die reparierten Schalter weiter ohne Namen. **Fuehrte hier zu einer Fehldiagnose:** erst als „fehlender Name, WCAG 4.1.2 Stufe A" eingestuft, tatsaechlich war der Name nur unbrauchbar.
  - **axe meldete beide Fassungen als in Ordnung**, die alte wie die neue. Es rechnet nach Spezifikation (`<button>` ist labelable), Chrome tut es anders.
  - Verlaesslich ist nur Chrome direkt: `Accessibility.getFullAXTree` ueber das DevTools Protocol. Node 24 bringt `WebSocket` global mit, es braucht also keine Abhaengigkeit.

- [x] **Die acht Zusicherungen sind wiederholbar messbar: `node scripts/a11y-messen.mjs`** (neu 04.08.2026, Vorschau muss laufen). Prueft Sprache, Sprunglink, Alt-Texte, `aria-pressed`, `aria-valuetext`, Live-Regionen, die Namen der Consent-Schalter im echten Barrierefreiheits-Baum und die reduzierte Bewegung mit emulierter Systemeinstellung samt Gegenprobe. Endet mit Exit-Code 1, wenn etwas nicht mehr stimmt. **Vor der Abnahme und nach groesseren Aenderungen laufen lassen**, zusammen mit `npx lighthouse <url> --only-categories=accessibility` (das deckt den Kontrast ab, den dieses Skript nicht misst). Aktueller Stand: alles gruen.

- [x] **Barrierefreiheit ist aus Entwicklersicht durch (04.08.2026, Entscheidung Felix).** Der Text steht als Endfassung, alle acht Zusicherungen sind gemessen, `node scripts/a11y-messen.mjs` laeuft gruen. Die rechtliche Freigabe laeuft ab jetzt ueber den Sammelpunkt **Abnahme Rechtstexte durch Klotzenbuecher/Maisel** (Werkvertrag § 2 Abs. 6), nicht mehr als eigener Entwicklungspunkt.

  **Zur Frage, ob die DVM verpflichtet ist — Stand des Wissens, damit es niemand neu aufrollt:**
  - **§ 3 Abs. 3 BFSG (Kleinstunternehmen) greift NICHT.** Felix hat am 04.08.2026 bestaetigt: die DVM hat **mehr als 10 Mitarbeiter und mehr als 2 Mio. € Umsatz**. Damit ist sie kein Kleinstunternehmen nach § 2 Nr. 17. ⚠️ Dieser Punkt **entlastet nicht**, er nimmt die einzige groessenbedingte Ausnahme weg. (Felix hatte das zunaechst andersherum gelesen, im Termin ggf. klarstellen.)
  - **Damit haengt alles an § 2 Nr. 26**, also daran, ob eine „Dienstleistung im elektronischen Geschaeftsverkehr" vorliegt: erbracht „im Hinblick auf den Abschluss eines Verbrauchervertrags". Dagegen spricht, dass auf der Website kein Vertrag geschlossen wird und Versicherungsvermittlung in § 1 Abs. 3 BFSG nicht eigens genannt ist (anders als Bankdienstleistungen fuer Verbraucher). **Dafuer spricht der Buchungslink zum Erstgespraech**: reine Visitenkarten-Seiten sind unstreitig draussen, Seiten mit Anbahnungsfunktion sind umstritten. **Das ist eine Rechtsfrage, keine Entwicklerfrage.**
  - **Praktisch aendert die Antwort fast nichts.** Der Text ist entweder Pflichtangabe oder freiwillige Zusicherung. Nur der Abschnitt „Rechtsgrundlage" haengt daran; faellt die Pflicht weg, wird er umformuliert, der Rest bleibt. Was zugesichert wird, ist so oder so gemessen und trifft zu.
- [x] `VITE_THEME_PANEL` steht in Vercel auf `false` (bestätigt 03.08.2026), lokal in `.env` weiter `true`. Die Palette ist seit 01.08.2026 freigegeben, das Panel hat seinen Zweck erfüllt. **Zum Go-Live auf `false` lassen.** Damit ist auch die frühere Frage beantwortet, ob das ThemePanel live mitgeht: nein.
- [x] ~~Vercel-DPA im Account akzeptieren~~ — **erledigt sich von selbst** (geprüft 03.08.2026). Das Vercel DPA (Fassung 17.03.2026, wirksam 31.03.2026) sagt selbst: „This Addendum shall become legally binding upon Customer entering into the Agreement". Es gilt also mit den Nutzungsbedingungen, ohne Klick und ohne Unterschrift. Für die Akte reicht der Ausdruck von `vercel.com/legal/dpa`. Es gibt **nichts** im Dashboard zu suchen.
- [ ] ⚠️ **Vercel-Plan: Hobby reicht rechtlich nicht.** Vercels Fair Use Guidelines definieren als kommerziell ausdrücklich „Receiving payment to create, update, or host the site" und beschränken Hobby auf „non-commercial personal use only". Werkvertrag 4.500 € plus 30 €/Monat Hosting sind genau das. **Vor Go-Live auf Pro (20 $/Monat) wechseln.** Betrifft auch `empire-dom`. Nebeneffekt: Pro hebt die Speed-Insights-Beschränkung auf (Hobby: genau **ein** Projekt, 10.000 Ereignisse/Monat, 7 Tage Rückschau).
- [ ] **womensurance.de** ist **registriert und geparkt** (geprüft 03.08.2026): Nameserver `ns10xx.ui-dns.{org,biz,de,com}` = **IONOS**, A-Record `217.160.0.99`, kein gültiges Zertifikat. Zu klären: wer hält den IONOS-Vertrag (muss DVM sein, s. A.2). Umstellung auf Vercel per A-/CNAME-Record, **nicht** per Nameserver-Delegation, damit DVM die DNS-Hoheit behält. ⚠️ Die konkreten Werte **aus dem Vercel-Dashboard** übernehmen: Vercel vergibt inzwischen **projekt-eigene** CNAME-Ziele (Form `<hash>.vercel-dns-0xx.com`), das früher überall zitierte `cname.vercel-dns.com` ist überholt.
- [ ] Sanity-Projekt-Region in Sanity Manage gegenprüfen; Sanity-DPF-Status auf dataprivacyframework.gov checken (nur falls DPF statt nur SCC behauptet werden soll — aktuell bewusst SCC).
- [ ] **Von Julia offen: nur noch Testimonials samt Einverständnissen.** Die Stimmen-Sektion bleibt ausgeblendet, solange keine da sind (der Build meldet das). Erledigt: Der About-Text („Geschichte von Womensurance") ist die finale Fassung, und alle drei Inhaltsbilder tragen Alt-Texte (geprüft 04.08.2026). Bilder, die Julia später über Sanity nachpflegt, betextet sie selbst; das fällt hinter das Vertragsende.
- [ ] Wartungsrechnung-Datum (s. A.4) ggf. angleichen.
- [x] `Verträge/_backup_pre_dsb/` und `_backup_pre_bfsg/` gelöscht (Felix, 04.08.2026).
- [x] E-Mail-Adresse für Barriere-Meldungen: `info@dvm.de` ist **kein Platzhalter, sondern die richtige Adresse** (bestätigt Felix, 04.08.2026).
- [x] **Kennzahlen: alle Zahlen belegt, zwei veraltete Werte ersetzt (04.08.2026).** Vollständige Übersicht mit Fundstellen und direkten Links: `Kunden\Womensurance (DVM)\Zahlen und Quellen.md` plus `.pdf` daneben (für Julia, trennt amtliche Statistik von eigener Beispielrechnung).

  | Kennzahl | vorher | jetzt | Fundstelle |
  |---|---|---|---|
  | Gender Pension Gap | 39,4 % | **36,0 %** (2025, ohne Hinterbliebenenrenten) | Destatis, Tabelle „Alterseinkünfte nach Geschlecht" |
  | Gender Pay Gap | 18 % | **16 %** (2025, unbereinigt) | Destatis PM Nr. 453 vom 16.12.2025 |
  | Frauen in Teilzeit | 49 % | unverändert, jetzt belegt | Destatis PM Nr. 175 vom 19.05.2025 |
  | Gender Care Gap | 44 % | unverändert, jetzt belegt (exakt 44,3 %) | Destatis PM Nr. 073 vom 28.03.2024 |
  | „35 % der Ehen werden geschieden" | 35 % | **ersetzt durch 130.100 Scheidungen 2025** | Destatis PM Nr. 220 vom 26.06.2026 |

  **Warum 39,4 nicht durch eine Jahresangabe zu retten war:** Die Zahl stand so in Destatis PM Nr. N016 vom 24.04.2024 für das Berichtsjahr 2023. Destatis hat den Wert seither **selbst revidiert**, dasselbe Jahr 2023 steht heute mit 37,7 % in der laufenden Tabelle. Reihe ohne Hinterbliebenenrenten: 2021 41,0 · 2022 38,3 · 2023 37,7 · 2024 36,9 · 2025 36,0. Einschließlich Hinterbliebenenrenten 2025: 24,2 %. Die Lesart **ohne** ist für diese Website die richtige, weil es um selbst erworbene Ansprüche geht.

  **Die 35 % waren gar nicht belegbar.** Destatis veröffentlicht die absolute Zahl der Scheidungen und die zusammengefasste Scheidungsziffer, aber keine simple Prozentquote; je nach Rechenweg kursiert alles zwischen 28 % und 37 %. Die Pressemitteilung sagt das indirekt selbst, indem sie gar keine Quote ausweist.

  Mitgezogen wurden auch die Seed-Skripte (`scripts/roh/rentenluecke.js`, `scripts/roh/scheidung.js`), damit ein erneutes Befüllen die alten Werte nicht zurückholt.

- [x] **Auch die letzte Zahl ist belegt (04.08.2026).** „50 % aller Scheidungsanträge erfolgen durch die Frau" war nicht belegbar und ist ersetzt durch **51,7 % der Scheidungen 2025 betrafen Paare mit minderjährigen Kindern** (rund 67.200 Scheidungen, rund 113.400 Kinder), Destatis PM Nr. 220 vom 26.06.2026, also dieselbe Quelle wie die 130.100 daneben. **Inhaltlich der bessere Wert:** Er schlägt die Brücke von der Scheidungsseite zum Kernthema, weil Kinder zu Elternzeit und Teilzeit führen und genau daraus die Rentenlücke entsteht. Der Quellen-Wächter meldet seitdem nichts mehr.

- [x] ⚠️ **Die Falle „Julia ändert eine Zahl, nichts passiert" ist behoben (04.08.2026).** Vorher war `src/data/gapStats.js` toter Code: Nichts importierte es, `content/kennzahlen.json` landete nicht im Bundle, und die sichtbaren Zahlen standen hartcodiert in `useGapState.jsx` und `Loader.jsx`. Ausgerechnet der Kommentarkopf der Datei und die Schema-Beschreibung behaupteten das Gegenteil. **Gelöst in der Richtung, die das Schema immer beschrieben hat:** `BASE_GAP` (useGapState) und der Zähler im Ladebildschirm lesen jetzt beide `HERO_GAP_VALUE` aus der Kennzahl `pension`. Julias Änderung im Studio schlägt damit auf Ladebildschirm, Rechner, Quittung und den Platzhalter `{basiswert}` im Lückentext durch. **Nicht gewählt:** das Kennzahlen-Band neu einbauen (wäre eine ungefragte Layout-Änderung) oder die Dokumente löschen (hätte den belegten Datensatz vernichtet).

- [x] **Quellen-Wächter im Build** (`scripts/fetch-content.mjs`, Funktion `pruefeQuellen`). Meldet jede Kennzahl, deren Quelle fehlt, „noch zu belegen" enthält, auf ein Sternchen endet (es gab mehrere „Quelle: Destatis*" ohne zugehörige Fußnote) oder kürzer als 20 Zeichen ist. ⚠️ **Bewusst nur Warnung, kein Abbruch**, weil Builds auch laufen, wenn Julia veröffentlicht. Gleiche Begründung wie beim CSS-Plugin: eine Qualitätsprüfung darf ihr keinen Deploy zerschießen.

- [x] **Nebenfund: der sichtbare Zähler rechnete deutsch falsch.** `DataNumber` schrieb `toFixed()`, also „39.4 %" mit Punkt, während die Vorlesefassung daneben korrekt „39,4 %" sagte. Betraf genau die Rentenlücken-Zahl, weil nur die eine Nachkommastelle hat. Jetzt über `deNum()` aus `utils/format.js`, mit Tausendertrenner, was nebenbei erst die 130.100 auf der Scheidungsseite möglich machte (gemessen: 202 px in 357 px Spalte am Desktop, 146 px in 327 px mobil, kein Querscrollen).

- [x] **Chart-Geometrie bewusst NICHT nachkalibriert.** Der Kommentar in `OpeningStatement.jsx` nannte „39,4 % ≙ 150 px". Die Proportionalität war aber immer nur ein grober Nebeneffekt (auch die Toggle-Summe passte vorher nicht exakt), und die Kurve ist von Hand auf den Floor bei 425 abgestimmt. Sichtbar ist die Zahl, nicht die Pixelhöhe. Steht so als Warnung im Code.

- [x] **Die vier Euro-Beträge werden jetzt berechnet statt eingetragen (04.08.2026).** Sie standen hartcodiert mit 90/180/310/120 € da, hergeleitet mit dem Rentenwert 40,79 €. Als der zum 01.07.2026 auf 42,52 € stieg, lagen sie rund 4 % zu niedrig und niemand merkte es. `TOGGLE_META` trägt jetzt **Entgeltpunkte** (2,2 · 4,4 · 7,5 · 3,0), der Euro-Betrag entsteht daraus mal `AKTUELLER_RENTENWERT`, auf 5 € gerundet ⇒ **95 / 185 / 320 / 130 €** (Summe 730 statt 700 €). Runden auf 5 € ist Absicht: 318,90 € täuschte eine Genauigkeit vor, die das Modell nicht hat.

- [x] **Der Rentenwert steht nur noch an einer Stelle:** `src/data/rentenwert.js`. Vorher hatte `ParttimeCalculator.jsx` seine eigene Konstante und die Euro-Beträge ihre eigene Herleitung. ⚠️ **Jährliche Pflegeaufgabe zum 1. Juli**, danach ziehen Teilzeit-Rechner und Lebensereignisse automatisch mit.

- [x] **Aktueller Rentenwert auf 42,52 € gezogen** (04.08.2026, `ParttimeCalculator.jsx`). Er stand auf 40,79 € (Stand 07/2025) und wird **sichtbar unter dem Rechner ausgewiesen**; zum 01.07.2026 hat die DRV um 4,24 % angehoben. ⚠️ **Jährliche Pflegeaufgabe zum 1. Juli.** Nicht mitgezogen: Die vier Euro-Beträge in `TOGGLE_META` (90/180/310/120 €) wurden seinerzeit mit 40,79 € hergeleitet und liegen damit rund 4 % zu niedrig. Bewusst offen gelassen, weil sie zusammen mit der 39,4-Frage in einem Rutsch mit Julia geschärft werden sollten.
- [x] Manuell gegengeprüft: `prefers-reduced-motion` (Felix, 03.08.2026). Der Preview-Browser kann die Media Query nicht emulieren, das musste von Hand passieren.
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

**Zwei rechtliche Sachstände geprüft und korrigiert** (Details in der Checkliste A.8): das Vercel-DPA gilt automatisch mit den Nutzungsbedingungen, es gibt nichts zu klicken; einen Sanity-AVV gibt es **nicht** per Selbstbedienung, der muss bei `legal@sanity.io` angefordert werden (ist am 03.08.2026 gekommen, siehe A.8). Dazu die Hobby-Plan-Frage: Hobby ist laut Vercels Fair Use Guidelines auf nicht-kommerzielle Privatnutzung beschränkt, bezahltes Hosting fällt ausdrücklich darunter.

## A.16 · Lighthouse-Runde 03.08.2026

**Messaufbau.** `npm run build` → `npm run preview` (Port 4173, in `launch.json` als `womensurance-prod`) → `npx lighthouse` über das Skript im Scratchpad. **Nie am Dev-Server messen.** Lokale Zahlen sind gegenüber Vercel gedrückt (kein Brotli, kein HTTP/2, kein CDN, und auf Felix' Rechner laufen zwei Server parallel), also **nur lokal gegen lokal vergleichen**, nie lokal gegen deployed. Einzelläufe schwanken beim TBT um ±50 %: **immer mindestens zwei Läufe**, sonst zieht man aus Rauschen falsche Schlüsse (genau das ist in dieser Runde einmal passiert).

**Ausgangswert deployed (mobil):** Performance 51 · A11y 96 · Best Practices 100 · SEO 92.
**Ergebnis lokal, gleicher Aufbau vorher/nachher:** Performance 50 → **~60** · A11y 96 → **100** · SEO 92 → **100** · Desktop **96 bis 99**. FCP 3,4 s → **2,0 s**, Speed Index 3,4 s → **2,0 s**, TBT ~1.700 ms → ~900 ms.

**Behoben:**
- **three.js/R3F aus dem Haupt-Bundle gelöst.** `BackgroundField` kommt per `lazy()` nach. Haupt-Bundle **383 kB → 163 kB gzip**. Der Abruf startet beim Mounten und fällt hinter den vierseitigen Ladebildschirm, ist also nicht sichtbar. Bei `prefers-reduced-motion` wird der Brocken **gar nicht** geladen: ein dauernd driftendes Partikelfeld ist genau die Bewegung, die dann unerwünscht ist. Einblenden per CSS-Animation, **nicht** per `requestAnimationFrame`: im Hintergrund-Tab feuert kein Frame, das Feld bliebe sonst auf Deckkraft 0 stehen.
- **`public/robots.txt` fehlte.** Der SPA-Rewrite aus `vercel.json` lieferte für `/robots.txt` die `index.html` aus, Suchmaschinen bekamen HTML statt Regeln. Dazu `public/sitemap.xml` mit allen sechs Routen. Statische Dateien gewinnen bei Vercel vor den Rewrites.
- **`rel=canonical` je Route** (in `ScrollManager`, nicht im HTML: eine SPA hat nur eine `index.html`, ein festes Canonical im Kopf würde alle Unterseiten auf die Startseite zeigen lassen). Zeigt auf `SITE_URL` = `womensurance.de`, damit die Vorschau-Adresse als Kopie gilt und nach dem Umzug nicht zwei identische Seiten konkurrieren.
- **WCAG 2.5.3 im Footer.** Sichtbar stand „IG", der zugängliche Name war „Instagram". Sprachsteuerung findet den Link so nicht. Jetzt „IG, Instagram".
- **WCAG 2.5.8 in der Navigation.** Das Aufklapp-Pfeilchen hatte eine 16×16-Klickfläche, gefordert sind 24×24. `p-1 -m-1` → `p-2 -m-2`, das negative Margin hält das Satzbild.
- **Deko-Wasserzeichen „Lücke"** (in `TheTruth` und `TopicPage`) steht jetzt als `content: attr(data-deko)` in CSS statt als Textknoten im DOM. Grund: bei 2,5 % Deckkraft misst axe 1,06:1 und meldet einen Verstoß. **`aria-hidden` hilft dagegen nicht**, weil Kontrast eine visuelle Anforderung ist und axe deshalb auch für Screenreader unsichtbare Elemente prüft. WCAG 1.4.3 nimmt rein dekorativen Text ausdrücklich aus, generierter Inhalt ist per Definition präsentational. Wer den Text zurück ins JSX holt, holt den Fehlalarm mit.
- `lato-300` vorgeladen; der Ladebildschirm setzt in genau diesem Schnitt, war aber nicht in der Preload-Liste.

**Drei Hypothesen geprüft und widerlegt.** Nicht wiederholen:
1. *Der 4-Sekunden-Ladebildschirm drückt die Werte.* Falsch. Mit abgeschaltetem Ladebildschirm gemessen: LCP bleibt bei 4,3 s und **FCP wird schlechter** (2,0 s → 2,8 s), weil dann der volle Kopfbereich statt einer einfachen Textzeile den ersten Paint tragen muss. Der Ladebildschirm **hilft** FCP und Speed Index.
2. *Die wachsende Textkontur im Ladebildschirm hält LCP auf.* Falsch, die Arithmetik passte verführerisch (2,0 s FCP + 2,4 s Animation ≈ 4,4 s LCP). Mit 0,3 s statt 2,4 s gemessen: LCP unverändert 4,4 bis 4,6 s.
3. *Die Bundle-Aufteilung hat es verschlechtert.* Der erste Nachher-Lauf zeigte 40 gegen 52 vorher. Zwei weitere Läufe: 60 und 63. Ein Ausreißer.

### A.16b · Zweite Runde, nach Felix' Messung auf der deployten Seite

**Deployed mobil vorher 51 → 76.** Aufschlüsselung: FCP 3,2 s · LCP 4,0 s · **TBT 0 ms** · **CLS 0** · SI 6,7 s. TBT und CLS also bereits voll ausgereizt, die verbleibenden 24 Punkte lagen komplett bei LCP (12), FCP (6) und Speed Index (6).

Der deployte Bericht nannte zwei Dinge, die lokal nicht sichtbar waren:
- **Das LCP-Element ist der Cookie-Banner** (`<p class="text-sm text-paper/70 …">`), mit 2.550 ms „Verzögerung beim Rendering des Elements". Er ist auf Mobilgeräten der grösste gezeichnete Textblock, weil die Kopfbereichs-Überschrift bei `opacity: 0` startet und damit für LCP nicht zählt. **Das erklärt, warum die drei Experimente aus A.16 nichts bewegt haben: sie zielten alle auf den Ladebildschirm.**
- **FCP 3,2 s bei TTFB 0,4 s.** Der Bildschirm bleibt fast drei Sekunden leer, weil die Seite vollständig im Browser gerendert wird und erst React etwas malt.

**Gebaut: Vorab-Anstrich in `index.html`.** Ein statischer Block malt exakt den Ausgangszustand des Ladebildschirms direkt aus dem HTML; `App` entfernt ihn, sobald React zeichnet. Gegengeprüft mit berechneten Stilen und Bounding-Rects: **alle fünf Elemente pixel- und stilgleich**, das Ablösen ist unsichtbar. Ein Inline-Skript setzt `html.intro-gesehen`, damit der Block bei einer Rückkehr innerhalb der Tab-Sitzung nicht aufblitzt.
- ⚠️ **`index.html` und `Loader.jsx` müssen synchron bleiben.** Weichen sie ab, sieht man beim Übernehmen ein Zucken. Die Zeilenhöhen mussten ausgeschrieben werden, weil Tailwinds `text-xs` und `text-3xl` eigene mitbringen; ohne sie sass der Fussblock 3 px höher.
- ⚠️ **Ein früherer FCP verlängert das TBT-Messfenster.** TBT zählt von FCP bis TTI. Arbeit, die vorher davor lag und deshalb nicht zählte, fällt jetzt hinein. Deployed war TBT 0 ms, das kann dadurch steigen. **Vor/nach auf der deployten Seite gegenprüfen**, lokal ist der Effekt nicht sichtbar, weil ohne Netzlatenz auch React sofort malt.

**`public/llms.txt` ergänzt** für die neue Lighthouse-Prüfung zum agentischen Browsen: H1 plus sechs Links, dazu Nutzungshinweise (keine Beratung, Zahlen nur mit Quelle zitieren).

**Wieder ein vorbestehender Kontrastfehler, denselben Mechanismus wie in A.14.** Die Euro-Beträge auf den Lebensereignis-Knöpfen im Kopfbereich: `text-paper/70` mal `opacity-60` ergibt effektiv **42 %**, gemessen **3,34:1** bei 12 px fett, gefordert 4,5:1. Verletzt auch die projekteigene Untergrenze `paper/55` aus A.9. Jetzt `opacity-80` (0,70 × 0,80 = 0,56 ≈ 4,6:1). **Er taucht nur sporadisch in Berichten auf, weil die Chips bei `opacity: 0` starten und je nach Messzeitpunkt übersprungen werden.** Lehre, zum dritten Mal: Deckkräfte multiplizieren sich, und was animiert eingeblendet wird, entgeht der Prüfung.

⚠️ **Messhygiene, zweimal reingefallen:** Auf diesem Rechner schwankt mobiles TBT zwischen 620 und 3.680 ms **für denselben Build**, wenn Dev-Server und Preview-Server parallel laufen. Der Dev-Server muss zum Messen aus. Danach reproduzierbar 64/64/67. Desktop ist stabil (99/99); ein Ausreisser auf 78 war ebenfalls Last. Auch die 19 offenen `chrome.exe` sind **nicht** von Lighthouse, sondern Felix' eigener Browser: vor dem Aufräumen die Kommandozeile prüfen, nicht blind `Stop-Process`.

**Stand lokal nach dieser Runde:** mobil **64 bis 67**, Desktop **99**, A11y **100**, SEO **100**.

**Offen: LCP mobil ~4,4 s.** Hält sich hartnäckig durch alle drei Experimente. Lighthouse endet die Messung, während der Ladebildschirm noch das Bild füllt (im Endbild des Berichts nachprüfbar), die eigentliche Seite sieht es also nie. Nächster Hebel wäre die Hauptthread-Arbeit der Startseite selbst: `splitChars` erzeugt pro Buchstabe ein Span, dazu `getTotalLength()` auf den SVG-Pfaden und die ScrollTrigger-Einrichtung aller acht Sektionen beim Mounten. Gegenprobe, die das belegt: **`/rentenluecke` erreicht mit demselben Bundle 75 bei TBT 320 ms**, die Startseite 50 bei TBT 1.700 ms.

**Nicht behoben, mit Absicht:**
- *„Browser errors were logged to the console"* lokal: `/_vercel/insights/script.js` und `/_vercel/speed-insights/script.js` gibt es nur auf Vercel. Deployed war Best Practices **100**. Kein Defekt.
- *„Missing source maps for large first-party JavaScript"*: Sourcemaps auszuliefern hieße, den Quellcode der Kundenseite offenzulegen. Der Punkt ist diagnostisch und kostet keine Wertung.

✅ **`og:url`, `twitter:url`, `og:image` und `twitter:image` stehen seit 04.08.2026 auf `womensurance.de`.** Die Linkvorschau ist damit bis zur DNS-Umstellung kurz kaputt, das war Felix’ bewusste Entscheidung, weil die Umstellung unmittelbar bevorsteht. `SITE_URL` in `config/site.js` stand ohnehin schon auf der echten Domain, damit `rel=canonical` von Anfang an aufs Ziel zeigt.

⚠️⚠️ **Das Vorschaubild selbst wurde dabei fast vergessen** (Hinweis von Felix, 04.08.2026). `public/og-image.png` zeigte in Riesenlettern **„−39,4%"** und im Fuß **„WOMENSURANCE.VERCEL.APP"**, gerendert im Mai und seitdem nie wieder angefasst. Das ist das Bild, das in jedem WhatsApp-, LinkedIn- und Slack-Link erscheint. **Lehre: Ein Zahlenwechsel endet nicht im Code.** Bei der nächsten Änderung des Gender Pension Gap ebenfalls neu erzeugen.

  Neu erzeugt mit `node scripts/og-bild.mjs`. Das Skript schießt mit Chrome im Kopflos-Modus einen Screenshot von `scripts/og-vorlage.html` (1200×630 bei Skalierung 1,25 ⇒ 1500×788). Zwei Dinge dabei mitgelöst:
  - Die Vorlage lag in `public/` und war damit **eine öffentlich erreichbare Seite, die Schriften vom Google-CDN nachlädt** — genau das, was die Website an jeder anderen Stelle vermeidet (siehe Datenschutzerklärung). Jetzt liegt sie in `scripts/` und wird nicht mehr ausgeliefert.
  - `og:image:width`/`height` sagten 1200×630, die Datei war aber 1500×788. Jetzt auf 1500×788 korrigiert.

### A.16c · Dritte Runde: die letzten zwei Netz-Hebel

⚠️ **PSI und die lokale Messung widersprechen sich beim selben Build.** Felix' PageSpeed-Bericht vom 03.08. und mein eigener Lauf gegen dieselbe deployte Seite (Hash `index-C52q0Mx8.js` in **beiden** Läufen, also nachweislich derselbe Build):

| | PSI | lokal gemessen |
|---|---|---|
| FCP | 3,3 s | 1,7 s |
| Speed Index | 6,2 s | 2,0 s |
| TBT | 140 ms | 1.140 ms |

Der Filmstreifen des lokalen Laufs zeigt **ab 439 ms Inhalt auf dem Bildschirm**, der Vorab-Anstrich aus A.16b arbeitet also. PSI meldet trotzdem FCP 3,3 s und nennt als LCP-Element weiterhin den **React**-Ladebildschirm, nicht den statischen Block. **Ungeklärt.** Beim nächsten PSI-Lauf gezielt nachsehen, ob FCP fällt; die lokale Zahl ist für FCP/SI nicht belastbar, weil localhost keine Netzlatenz hat.

**Gebaut, beides ohne sichtbare Änderung:**

1. **Stylesheet wird in die `index.html` eingebettet** (Vite-Plugin `cssEinbetten` in `vite.config.js`). Es war die einzige render-blockierende Ressource; PSI bezifferte sie mit **450 ms**. 41 kB roh, rund 9 kB komprimiert, alle `url()` darin absolut (`/fonts/...`), das Verschieben ändert also keine Pfade. Beleg: im Nachher-Lauf **fehlt die CSS-Anfrage komplett**, und der CSS-Hash ist in beiden Builds identisch (`index-D_Zr65hy.css`), die Stilregeln sind also byteweise unverändert, nur der Transportweg. Die Vorab-Anstrich-Regeln gewinnen über ID-Selektoren unabhängig von der Reihenfolge im `head`.
   - ⚠️ Das Plugin **warnt nur**, wenn der Austausch nicht greift, statt abzubrechen. Grund: Builds laufen auch per Sanity-Webhook, wenn Julia veröffentlicht. Ein Tempo-Kniff darf ihr keinen Deploy zerschiessen. Preis dafür: eine stille Regression ist möglich, deshalb bei Vite-Updates einmal `grep -c 'rel="stylesheet"' dist/index.html` (soll 0 sein).

2. **Das Partikelfeld wird erst bei Leerlauf geladen** (`requestIdleCallback`, Timeout 1.500 ms, Timer als Ersatz für ältere Safari-Versionen). Der Brocken ist 220 kB und war der längste Strang im Abhängigkeitsbaum (973 ms mobil): er teilte sich die Leitung mit Stylesheet und Schriften, die sichtbar gebraucht werden, während er selbst hinter dem Ladebildschirm liegt. 1,5 s liegen komfortabel vor dem Ende des Ladebildschirms. Beleg: Startzeit der Anfrage 323 ms → 444 ms lokal; auf einem langsamen Gerät kommt das Leerlauf-Fenster deutlich später, dort ist die Verschiebung grösser.

**Lokal ist der Gewinn nicht messbar:** vorher 75/65, nachher 71/76, FCP 1,8 → 1,7 s, SI 1,8 → 1,7 s. Die Streuung kommt komplett aus der TBT und überdeckt alles. **Das ist erwartbar und kein Gegenbeweis:** beide Hebel sparen Netz-Rundreise und Bandbreitenkonkurrenz, und genau die gibt es auf localhost nicht. Der Nachweis kann nur über PSI nach dem Deploy kommen.

**Keine sichtbare Änderung, belegt:** die Endbilder beider Lighthouse-Läufe (echtes Chrome) sind identisch.

**Nicht angefasst, mit Begründung:**
- **Erzwungener dynamischer Umbruch, 249 ms** (`index-*.js:26:1876`, dazu 210 ms bei `65:2710`). Ohne Sourcemaps nicht zuzuordnen, und PSI meldet TBT mit 140 ms ohnehin im grünen Bereich. Aufwand steht nicht zum Nutzen.
- **Schrift-Preloads** (300/900/regular) decken sich nicht ganz mit dem, was zuerst gemalt wird (der Ladebildschirm braucht auch 700). Bei `font-display: swap` blockieren Schriften aber weder FCP noch LCP, der Effekt wäre reine Bandbreitenverschiebung mit unklarem Vorzeichen.
- **DOM 573 Elemente** und **4 nicht zusammengesetzte Animationen**: beides ohne Eingriff in die Choreografie nicht zu ändern, also nicht ohne sichtbare Folgen.

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
