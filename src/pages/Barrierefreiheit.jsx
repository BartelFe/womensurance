import LegalLayout, { H2, H3, P, UL, Block, A, AIntern } from '../components/legal/LegalLayout';

/**
 * Informationen zur Barrierefreiheit nach § 14 Abs. 1 Nr. 2 BFSG i. V. m. Anlage 3.
 *
 * ⚠️ Das ist NICHT die „Erklärung zur Barrierefreiheit" nach BITV 2.0 /
 * § 12b BGG. Die gilt nur für öffentliche Stellen. Für die DVM als Unternehmen
 * greift das BFSG mit anderem Pflichtinhalt (Anlage 3).
 *
 * ── Stand 04.08.2026: ABNAHMEFÄHIGE ENDFASSUNG ──────────────────────────
 *
 * Alle acht Zusicherungen unter „Stand der Umsetzung" wurden am 04.08.2026
 * einzeln nachgemessen, nicht nur aus der Zwischenfassung übernommen:
 *   1. Tastatur      → echte <button>-Elemente (Umschalter mit aria-pressed),
 *                       <input type="range"> für die Regler. Im laufenden
 *                       Build geprüft: 4 Umschalter mit aria-pressed, 3 Regler
 *                       mit aria-valuetext („25 Std.", „10 Jahre", „4.200 €")
 *   2. Fokus         → globals.css: :focus-visible mit Doppelring, plus eigene
 *                       Regel für helle Flächen (.bg-paper/.bg-bone/.bg-pink)
 *   3. Sprunglink    → App.jsx Zeile 66, im DOM bestätigt
 *   4. Kontrast      → axe (über Lighthouse) auf /, /rentenluecke, /scheidung
 *                       und /barrierefreiheit: Prüfung „color-contrast" ohne
 *                       Beanstandung, A11y-Wert 100 auf allen vier Seiten.
 *                       ⚠️ axe misst nicht auf Verläufen und Hintergrundbildern,
 *                       daher der Vorbehalt im Absatz „Prüfverfahren"
 *   5. Alt-Texte     → im DOM: 3 Inhaltsbilder, 0 davon mit leerem alt.
 *                       `alt` ist im Sanity-Schema Pflichtfeld, zusätzlich
 *                       prüft `pruefeAltTexte` in fetch-content.mjs bei jedem
 *                       Build (meldet aktuell nichts)
 *   6. Rechner       → aria-live="polite" in ParttimeCalculator und TheNotice,
 *                       im DOM bestätigt
 *   7. Bewegung      → mit emulierter Systemeinstellung gemessen, nicht nur
 *                       im Code gelesen. Bei `prefers-reduced-motion: reduce`
 *                       ist window.__lenis nicht vorhanden (kein weiches
 *                       Scrollen) und es liegt 0 statt 1 <canvas> im DOM (das
 *                       Hintergrundfeld wird gar nicht geladen). Der eigene
 *                       Cursor entfällt über `if (reduced) return null`
 *   8. Sprache       → index.html: <html lang="de">, im DOM bestätigt
 *
 * ⚠️ Werkzeug-Warnung für die nächste Prüfung: Der Barrierefreiheits-Baum im
 * Vorschau-Browser zeigt Namen unzuverlässig an. Er ließ mehrere Links ohne
 * Namen aussehen, die in Wahrheit Text tragen. Wer hier etwas belegen will,
 * fragt Chrome direkt über `Accessibility.getFullAXTree` (DevTools Protocol).
 * Auch axe taugt dafür nur bedingt: es meldete beide Fassungen der
 * Consent-Schalter als in Ordnung, obwohl die alte einen unbrauchbaren Namen
 * ergab (siehe Kommentar in CookieConsent.jsx).
 *
 * Gegenüber der Zwischenfassung vom 01.08.2026 (an Thomas Gessert/DVM-IT
 * verlinkt) wurde inhaltlich korrigiert:
 *   · Der Satz, wir könnten zum „eingesetzten Cookie-Einwilligungswerkzeug"
 *     keine Aussage treffen, ist ersatzlos raus. Der Banner ist unsere eigene
 *     Komponente (CookieConsent.jsx), kein Fremdtool. Der Satz war falsch und
 *     las sich wie ein Haftungsausschluss für eigenen Code.
 *   · „Redaktionelle Inhalte" behauptete, nachgepflegte Bilder könnten ohne
 *     Alternativtext vorliegen. Das kann nicht passieren, das Studio lässt
 *     nicht veröffentlichen. Der Absatz nennt jetzt die echte Restunsicherheit:
 *     die inhaltliche Güte des Textes, nicht sein Vorhandensein.
 *   · Der Verweis auf fehlende Untertitel ist raus. Die Website enthält kein
 *     <video>, <audio> oder <iframe> (geprüft 04.08.2026).
 *   · Neu, weil Anlage 3 Nr. 1 es ausdrücklich verlangt und beides fehlte:
 *     die allgemeine Beschreibung der Dienstleistung (Buchstabe a) samt
 *     Erläuterung der Funktionsweise (Buchstabe b), und die Angabe der
 *     zuständigen Marktüberwachungsbehörde (MLBF AöR, Magdeburg).
 *   · Neu: der Absatz „Prüfverfahren". Er sagt offen, dass die Bewertung auf
 *     eigener Prüfung beruht und kein externes Audit stattgefunden hat.
 *     Ohne ihn wäre „weitgehend konform" eine ungedeckte Zusicherung.
 *
 * Am Code geändert, weil die Seite es sonst falsch zugesichert hätte:
 *   · ParttimeCalculator zeigte „Rentenwert 42,52 € (Stand 07/2025)". Der
 *     Wert war aktuell, das Datum daneben stammte noch vom Vorjahr. Beides
 *     kommt jetzt aus data/rentenwert.js und kann nicht mehr auseinanderlaufen.
 *   · Die drei Schalter im Cookie-Banner hatten einen unbrauchbaren Namen
 *     (Bezeichnung und ganze Erläuterung in einem Stück). Sie heißen jetzt
 *     „Essenziell", „Statistik", „Marketing", die Erläuterung liegt in der
 *     Beschreibung. Details in CookieConsent.jsx.
 *   · fetch-content.mjs warnt neu bei Bildern ohne Alternativtext, damit die
 *     Zusicherung oben nachprüfbar bleibt statt nur behauptet.
 *
 * ⚠️ OFFEN FÜR DIE RECHTLICHE PRÜFUNG (Werkvertrag § 2 Abs. 6) — eine Frage,
 * die der Auftragnehmer nicht entscheiden kann und darf:
 *
 *   Ist die DVM überhaupt verpflichtet? § 3 Abs. 3 BFSG nimmt Kleinstunternehmen
 *   ausdrücklich aus, die Dienstleistungen anbieten. Kleinstunternehmen ist nach
 *   § 2 Nr. 17 BFSG, wer weniger als zehn Personen beschäftigt und höchstens
 *   2 Mio. € Jahresumsatz oder Jahresbilanzsumme hat. Die Mitarbeiterzahl der
 *   DVM ist dem Auftragnehmer nicht bekannt.
 *
 *   Zweitens greift der sachliche Anwendungsbereich nur, wenn eine
 *   „Dienstleistung im elektronischen Geschäftsverkehr" vorliegt. § 2 Nr. 26
 *   BFSG verlangt dafür, dass sie „im Hinblick auf den Abschluss eines
 *   Verbrauchervertrags" erbracht wird. Diese Website informiert und führt zu
 *   einem Beratungstermin; ein Vertrag wird auf ihr nicht geschlossen.
 *   Versicherungsvermittlung ist in § 1 Abs. 3 BFSG auch nicht eigens genannt
 *   (anders als Bankdienstleistungen für Verbraucher).
 *
 *   Fällt die Antwort auf beides negativ aus, ist diese Seite eine freiwillige
 *   Zusicherung statt einer Pflichtangabe. Sie kann dann trotzdem stehen
 *   bleiben, aber der Abschnitt „Rechtsgrundlage" müsste umformuliert werden,
 *   weil er sonst eine Pflicht behauptet, die nicht besteht. Freiwillig oder
 *   nicht: Was hier zugesichert wird, gilt und ist nachgemessen.
 *
 * ✏️ Keine Gedankenstriche in diesem Projekt (Wunsch Felix, 01.08.2026).
 */
export default function Barrierefreiheit() {
  return (
    <LegalLayout
      title="Barrierefreiheit"
      subtitle="Wie zugänglich diese Website ist, und wo sie es noch nicht ist."
      stand="4. August 2026"
    >
      <P>
        Wir möchten, dass diese Website von möglichst vielen Menschen genutzt
        werden kann, unabhängig davon, ob jemand eine Maus benutzt, gut sieht
        oder auf Hilfsmittel angewiesen ist. Diese Seite beschreibt unser
        Angebot, erklärt, wie es funktioniert, und legt offen, welchen Stand
        wir erreicht haben und wo es noch Einschränkungen gibt.
      </P>

      <H2>Was wir anbieten</H2>
      <P>
        Womensurance ist ein Angebot der Deutschen Versicherungsmakler GmbH
        &amp; Co. KG in Ingolstadt. Es richtet sich an Frauen, die ihre
        Altersvorsorge und ihren Versicherungsschutz ordnen möchten.
      </P>
      <P>
        Diese Website erklärt, warum Frauen im Alter im Durchschnitt deutlich
        weniger Rente erhalten als Männer, welche Lebensereignisse dazu
        beitragen und was sich dagegen tun lässt. Sie enthält dafür
        Informationstexte, Grafiken, interaktive Rechner zum Ausprobieren und
        Antworten auf häufige Fragen. Über die Website können Sie ein
        kostenloses und unverbindliches Erstgespräch vereinbaren. Die
        eigentliche Beratung findet danach persönlich statt, nicht auf dieser
        Website.
      </P>

      <H2>Wie Sie die Website nutzen</H2>
      <P>
        Sie erreichen alle Inhalte, indem Sie die Seite von oben nach unten
        lesen oder über das Menü am oberen Rand zu einem Thema springen. Mit
        der Tastatur gelangen Sie mit der Tabulatortaste von Element zu
        Element, mit der Eingabe- oder Leertaste lösen Sie aus. Ganz am Anfang
        jeder Seite steht ein Sprunglink, der die Navigation überspringt.
      </P>
      <P>
        Die Rechner sind ein freiwilliges Angebot. Sie stellen Schalter
        und Schieberegler ein, das Ergebnis erscheint sofort daneben und wird
        von Screenreadern angesagt. Es handelt sich um vereinfachte
        Beispielrechnungen zur Veranschaulichung, nicht um eine verbindliche
        Auskunft über Ihre Rente. Sie müssen dafür nichts eingeben, was Sie
        persönlich identifiziert, und es werden dabei keine Daten an uns
        übertragen.
      </P>
      <P>
        Für ein Erstgespräch führt ein Link zu einem Buchungssystem, das nicht
        Teil dieser Website ist. Wenn Sie das nicht nutzen möchten oder dort
        auf eine Hürde stoßen, erreichen Sie uns genauso per E-Mail oder
        Telefon. Die Kontaktdaten stehen im{' '}
        <AIntern to="/impressum">Impressum</AIntern> und unten auf dieser Seite. Beide
        Wege sind uns gleich recht.
      </P>

      <H2>Angewandter Standard</H2>
      <P>
        Diese Website wurde nach den <strong>Web Content Accessibility Guidelines
        (WCAG) 2.1, Konformitätsstufe AA</strong> gestaltet. Dieser Standard ist
        die technische Grundlage der europäischen Norm EN 301 549.
      </P>

      <H2>Stand der Umsetzung</H2>
      <P>
        Die Website ist nach unserer Einschätzung <strong>weitgehend
        konform</strong> mit WCAG 2.1 Stufe AA. Umgesetzt sind insbesondere:
      </P>
      <UL
        items={[
          'Vollständige Bedienbarkeit mit der Tastatur, einschließlich aller Menüs, Schieberegler und Schaltflächen',
          'Deutlich sichtbare Fokus-Markierung auf hellen wie dunklen Flächen',
          'Ein Sprunglink „Zum Inhalt springen" am Seitenanfang',
          'Farbkontraste von mindestens 4,5:1 für Fließtext und 3:1 für große Schrift, geprüft auf allen Seiten',
          'Textalternativen für alle Inhaltsbilder; rein dekorative Grafiken und Animationen werden von Screenreadern übersprungen',
          'Ergebnisse der Rechner werden Screenreadern angesagt; die Schieberegler nennen ihren Wert mit Einheit, also „25 Stunden" statt nur „25"',
          'Reduzierte Bewegung: Wer im Betriebssystem „Animationen reduzieren" aktiviert hat, bekommt die Seite ohne weiches Scrollen, ohne Bewegungseffekte, ohne den animierten Hintergrund und mit dem gewohnten Systemcursor',
          'Durchgehende Auszeichnung der Seitensprache (Deutsch)',
        ]}
      />

      <H3>Prüfverfahren</H3>
      <P>
        Diese Einschätzung beruht auf einer Selbstbewertung durch den
        Ersteller der Website: Bedienung ausschließlich mit der Tastatur,
        Prüfung der Farbkontraste, automatisierte Tests und eine Kontrolle der
        Auszeichnung für Screenreader. Ein externes Audit oder ein Test mit
        Nutzerinnen und Nutzern, die auf Hilfsmittel angewiesen sind, hat{' '}
        <strong>nicht</strong> stattgefunden. Deshalb steht oben „weitgehend
        konform" und nicht „vollständig konform".
      </P>

      <H2>Nicht barrierefreie Inhalte</H2>

      <H3>Externe Systeme</H3>
      <P>
        Die Terminbuchung für ein Erstgespräch läuft über Microsoft Bookings,
        ein Buchungssystem, das die Deutsche Versicherungsmakler GmbH &amp;
        Co. KG getrennt von dieser Website betreibt. Für dessen Barrierefreiheit
        können wir keine Aussage treffen, weil wir es nicht gestaltet haben.
        Falls Sie dort nicht weiterkommen, vereinbaren wir den Termin gerne per
        E-Mail oder Telefon.
      </P>

      <H3>Grafische Darstellungen</H3>
      <P>
        Die Datengrafiken und der animierte Hintergrund sind Illustrationen.
        Alle darin enthaltenen Aussagen stehen zusätzlich als Text auf der Seite,
        die Grafiken selbst werden von Screenreadern übersprungen.
      </P>

      <H3>Redaktionelle Inhalte</H3>
      <P>
        Bilder, die wir später über unser Redaktionssystem ergänzen, können
        technisch nicht ohne Alternativtext veröffentlicht werden. Wir können
        aber nicht garantieren, dass jeder dieser Texte ein Bild so treffend
        beschreibt, wie es wünschenswert wäre. Wenn Ihnen eine unpassende oder
        nichtssagende Bildbeschreibung auffällt, sagen Sie uns bitte Bescheid.
      </P>

      <H2>Barriere melden</H2>
      <P>
        Ist Ihnen etwas aufgefallen, das Sie nicht nutzen können? Schreiben Sie
        uns. Wir kümmern uns darum und melden uns zurück. Sagen Sie uns gerne
        dazu, auf welcher Seite es war und womit Sie die Website bedienen, dann
        finden wir es schneller.
      </P>
      <Block
        lines={[
          'Deutsche Versicherungsmakler GmbH & Co. KG',
          'Gemmingerstr. 14',
          '85051 Ingolstadt',
        ]}
      />
      <P>
        E-Mail: <A href="mailto:info@dvm.de">info@dvm.de</A>
      </P>

      <H2>Zuständige Marktüberwachungsbehörde</H2>
      <P>
        Sind Sie mit unserer Antwort nicht zufrieden oder erhalten Sie keine,
        können Sie sich an die Marktüberwachungsbehörde wenden. Sie überwacht
        bundesweit die Einhaltung des Barrierefreiheitsstärkungsgesetzes.
      </P>
      <Block
        lines={[
          'Marktüberwachungsstelle der Länder für die Barrierefreiheit von Produkten und Dienstleistungen, Anstalt öffentlichen Rechts (MLBF AöR)',
          'Carl-Miller-Straße 6',
          '39112 Magdeburg',
        ]}
      />
      <P>
        Telefon: +49 391 289 230 23
        <br />
        E-Mail:{' '}
        <A href="mailto:kontakt@mlbf-barrierefrei.de">kontakt@mlbf-barrierefrei.de</A>
        <br />
        Internet: <A href="https://www.mlbf-barrierefrei.de">www.mlbf-barrierefrei.de</A>
      </P>

      <H2>Rechtsgrundlage</H2>
      <P>
        Diese Informationen werden gemäß § 14 Absatz 1 Nummer 2 des
        Barrierefreiheitsstärkungsgesetzes (BFSG) in Verbindung mit Anlage 3
        Nummer 1 BFSG bereitgestellt.
      </P>
    </LegalLayout>
  );
}
