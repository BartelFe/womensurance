import LegalLayout, { H2, H3, P, UL, Block, A } from '../components/legal/LegalLayout';

/**
 * Informationen zur Barrierefreiheit — § 14 Abs. 1 Nr. 2 BFSG i. V. m. Anlage 3.
 *
 * ⚠️ WICHTIG: Das ist NICHT die „Erklärung zur Barrierefreiheit" nach BITV 2.0 /
 * § 12b BGG — die gilt nur für öffentliche Stellen. Für die DVM als Unternehmen
 * greift das BFSG mit anderem Pflichtinhalt (Anlage 3).
 *
 * ⚠️ ENTWURF: Die technischen Angaben unten stammen vom Auftragnehmer und sind
 * belastbar (gemessen, siehe Abschlussbericht Barrierefreiheit). Die rechtliche
 * Endfassung des Textes macht DVM / Maisel Consult — genau wie bei Impressum
 * und Datenschutzerklärung (Werkvertrag § 2 Abs. 6).
 *
 * Vor Go-Live noch einzusetzen: E-Mail-Adresse für Barriere-Meldungen.
 */
export default function Barrierefreiheit() {
  return (
    <LegalLayout
      title="Barrierefreiheit"
      subtitle="Wie zugänglich diese Website ist — und wo sie es noch nicht ist."
      stand="Juli 2026"
    >
      <P>
        Wir möchten, dass diese Website von möglichst vielen Menschen genutzt
        werden kann — unabhängig davon, ob jemand eine Maus benutzt, gut sieht
        oder auf Hilfsmittel angewiesen ist. Diese Seite beschreibt, welchen
        Stand wir erreicht haben und wo es noch Einschränkungen gibt.
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
          'Vollständige Bedienbarkeit mit der Tastatur, einschließlich aller Menüs, Regler und Schaltflächen',
          'Deutlich sichtbare Fokus-Markierung auf hellen wie dunklen Flächen',
          'Ein Sprunglink „Zum Inhalt springen" am Seitenanfang',
          'Farbkontraste von mindestens 4,5:1 für Fließtext und 3:1 für große Schrift, geprüft auf allen Seiten',
          'Textalternativen für Bilder; rein dekorative Grafiken und Animationen werden von Screenreadern übersprungen',
          'Ergebnisse der interaktiven Rechner werden Screenreadern angesagt',
          'Reduzierte Bewegung: Wer im Betriebssystem „Animationen reduzieren" aktiviert hat, bekommt die Seite ohne weiches Scrollen, ohne Bewegungseffekte und mit dem gewohnten Systemcursor',
          'Durchgehende Auszeichnung der Seitensprache (Deutsch)',
        ]}
      />

      <H2>Nicht barrierefreie Inhalte</H2>

      <H3>Externe Systeme</H3>
      <P>
        Die Terminbuchung für ein Erstgespräch läuft über ein separates
        Buchungssystem der Deutschen Versicherungsmakler GmbH &amp; Co. KG.
        Für dessen Barrierefreiheit können wir keine Aussage treffen, da es
        nicht Teil dieser Website ist. Gleiches gilt für das eingesetzte
        Cookie-Einwilligungswerkzeug.
      </P>

      <H3>Grafische Darstellungen</H3>
      <P>
        Die Datengrafiken und der animierte Hintergrund sind Illustrationen.
        Alle darin enthaltenen Aussagen stehen zusätzlich als Text auf der Seite,
        die Grafiken selbst werden von Screenreadern übersprungen.
      </P>

      <H3>Redaktionelle Inhalte</H3>
      <P>
        Inhalte, die nach der Veröffentlichung über das Redaktionssystem
        eingepflegt werden, können vereinzelt noch ohne Alternativtext oder
        Untertitel vorliegen. Wir arbeiten daran, das durchgehend sicherzustellen.
      </P>

      <H2>Barriere melden</H2>
      <P>
        Ist Ihnen etwas aufgefallen, das Sie nicht nutzen können? Schreiben Sie
        uns — wir kümmern uns darum und melden uns zurück.
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

      <H2>Rechtsgrundlage</H2>
      <P>
        Diese Informationen werden gemäß § 14 Absatz 1 Nummer 2 des
        Barrierefreiheitsstärkungsgesetzes (BFSG) in Verbindung mit Anlage 3
        BFSG bereitgestellt.
      </P>
    </LegalLayout>
  );
}
