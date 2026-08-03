import LegalLayout, { H2, H3, P, UL, Block, A } from '../components/legal/LegalLayout';

/**
 * Datenschutzerklärung — Struktur & Standardtexte auf Basis der
 * Datenschutzerklärung von dvm.de (eRecht24-Rechtstext der DVM, Stand 06/2026),
 * angepasst auf den tatsächlichen Stack von womensurance.de:
 *   Hosting Vercel (statt IONOS) · eigenes Consent-Banner (statt Usercentrics) ·
 *   Sanity als CMS (kein Besucher-Kontakt, Bild-Proxy) · lokale Webfonts ·
 *   Microsoft Bookings (wie DVM) · GTM, GA4, Meta-Pixel und LinkedIn Insight Tag
 *   nur nach Einwilligung · Vercel Web Analytics + Speed Insights einwilligungsfrei.
 *
 * ⚠️ ENTWURF: Die juristischen Texte verantwortet die DVM über Maisel Consult
 * (Hr. Klotzenbücher) — diese Fassung ist die technische Zuarbeit + Vorlage
 * und MUSS vor Go-Live geprüft werden.
 *
 * ⚠️ DREI PUNKTE FÜR DIE PRÜFUNG DURCH MAISEL (Stand 03.08.2026):
 *  1. Abschnitt 2, Sanity: Der Satz „Wir haben einen Vertrag über
 *     Auftragsverarbeitung (AVV) mit Sanity geschlossen." ist zum jetzigen
 *     Zeitpunkt NOCH NICHT zutreffend. Sanity bietet keine Selbstbedienungs-DPA
 *     an (geprüft: sanity.io/legal/dpa = 404, die Terms of Service enthalten
 *     keinerlei Art.-28-Regelungen). Der AVV ist bei legal@sanity.io angefragt.
 *     Kommt keiner zustande, muss dieser Satz weg und die Rechtsgrundlage neu
 *     bewertet werden.
 *  2. Abschnitt 5, LinkedIn Insight Tag: bewusst NUR Standardvertragsklauseln
 *     genannt. Ob LinkedIn unter der DPF-Zertifizierung von Microsoft geführt
 *     wird, konnte ich nicht belastbar verifizieren. Falls Maisel es bestätigt,
 *     gehört der DPF-Hinweis analog zu Google/Meta ergänzt.
 *  3. GA4, Meta-Pixel und LinkedIn sind beschrieben, aber noch nicht scharf
 *     geschaltet. Die IDs liefert die DVM. Erst danach live nehmen.
 */
export default function Datenschutz() {
  return (
    <LegalLayout
      title="Datenschutzerklärung"
      subtitle="Transparent, wie wir es auch bei deinen Finanzen halten: Was mit deinen Daten auf dieser Website passiert."
      stand="August 2026"
    >
      {/* ── 1 ─────────────────────────────────────────────── */}
      <H2>1. Datenschutz auf einen Blick</H2>

      <H3>Allgemeine Hinweise</H3>
      <P>
        Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
        personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene
        Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
        Ausführliche Informationen zum Thema Datenschutz entnehmen Sie der unter diesem Text
        aufgeführten Datenschutzerklärung.
      </P>

      <H3>Datenerfassung auf dieser Website</H3>
      <P>
        <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong>
        <br />
        Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen
        Kontaktdaten können Sie dem Abschnitt „Hinweis zur verantwortlichen Stelle" in dieser
        Datenschutzerklärung entnehmen.
      </P>
      <P>
        <strong>Wie erfassen wir Ihre Daten?</strong>
        <br />
        Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen — z. B. bei
        einer Terminbuchung oder einer Anfrage per E-Mail. Andere Daten werden automatisch
        oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst.
        Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder
        Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald
        Sie diese Website betreten.
      </P>
      <P>
        <strong>Wofür nutzen wir Ihre Daten?</strong>
        <br />
        Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu
        gewährleisten. Andere Daten können — nur mit Ihrer Einwilligung — zur Analyse Ihres
        Nutzerverhaltens verwendet werden.
      </P>
      <P>
        <strong>Welche Rechte haben Sie bezüglich Ihrer Daten?</strong>
        <br />
        Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und
        Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein
        Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine
        Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung
        jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, unter bestimmten
        Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu
        verlangen. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen
        Aufsichtsbehörde zu. Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie
        sich jederzeit an uns wenden.
      </P>

      {/* ── 2 ─────────────────────────────────────────────── */}
      <H2>2. Hosting und Content-Management</H2>

      <H3>Vercel</H3>
      <P>
        Wir hosten die Inhalte unserer Website bei Vercel. Anbieter ist die Vercel Inc.,
        440 N Barranca Ave #4133, Covina, CA 91723, USA (nachfolgend „Vercel"). Wenn Sie
        unsere Website besuchen, erfasst Vercel verschiedene Logfiles inklusive Ihrer
        IP-Adressen. Details entnehmen Sie der Datenschutzerklärung von Vercel:{' '}
        <A href="https://vercel.com/legal/privacy-policy">vercel.com/legal/privacy-policy</A>.
      </P>
      <P>
        Die serverseitige Verarbeitung erfolgt in der Region Frankfurt am Main (EU); die
        Auslieferung statischer Inhalte erfolgt über das weltweite Content-Delivery-Network
        von Vercel. Die Verwendung von Vercel erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f
        DSGVO. Wir haben ein berechtigtes Interesse an einer möglichst zuverlässigen
        Darstellung unserer Website. Sofern eine entsprechende Einwilligung abgefragt wurde,
        erfolgt die Verarbeitung ausschließlich auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO
        und § 25 Abs. 1 TDDDG; die Einwilligung ist jederzeit widerrufbar.
      </P>
      <P>
        Die Datenübertragung in die USA wird auf die Standardvertragsklauseln der
        EU-Kommission gestützt. Das Unternehmen verfügt zudem über eine Zertifizierung nach
        dem „EU-US Data Privacy Framework" (DPF). Der DPF ist ein Übereinkommen zwischen der
        Europäischen Union und den USA, das die Einhaltung europäischer Datenschutzstandards
        bei Datenverarbeitungen in den USA gewährleisten soll. Weitere Informationen erhalten
        Sie unter:{' '}
        <A href="https://www.dataprivacyframework.gov">www.dataprivacyframework.gov</A>.
      </P>
      <P>
        <strong>Auftragsverarbeitung:</strong> Wir haben einen Vertrag über
        Auftragsverarbeitung (AVV) zur Nutzung des oben genannten Dienstes geschlossen.
        Hierbei handelt es sich um einen datenschutzrechtlich vorgeschriebenen Vertrag, der
        gewährleistet, dass dieser die personenbezogenen Daten unserer Websitebesucher nur
        nach unseren Weisungen und unter Einhaltung der DSGVO verarbeitet.
      </P>

      <H3>Vercel Web Analytics und Vercel Speed Insights</H3>
      <P>
        Zusätzlich zum Hosting setzen wir zwei Auswertungsfunktionen unseres Hosting-Anbieters
        Vercel ein: <strong>Web Analytics</strong> zählt die Seitenaufrufe,{' '}
        <strong>Speed Insights</strong> misst die Ladegeschwindigkeit der Seiten auf
        tatsächlich genutzten Endgeräten. Beide Funktionen dienen ausschließlich dem Betrieb
        und der technischen Verbesserung dieser Website.
      </P>
      <P>
        Beide Funktionen setzen <strong>keine Cookies</strong> und speichern oder lesen keine
        Informationen auf Ihrem Endgerät. Eine Einwilligung nach § 25 Abs. 1 TDDDG ist daher
        nicht erforderlich. Besucherinnen und Besucher werden nicht mit einer dauerhaften
        Kennung versehen, sondern anhand eines aus der Anfrage berechneten Prüfwerts
        unterschieden, der spätestens nach 24 Stunden verworfen wird. Eine Wiedererkennung
        über mehrere Websites hinweg oder eine Zusammenführung zu Nutzerprofilen findet nicht
        statt.
      </P>
      <P>
        Erfasst werden dabei: Zeitpunkt des Aufrufs, aufgerufene Adresse, verweisende Seite,
        ungefährer Standort auf Ebene von Land, Region und Stadt, Betriebssystem, Browser und
        Gerätetyp sowie die gemessenen Ladezeitwerte. IP-Adressen werden nicht gespeichert.
        Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; wir haben ein berechtigtes Interesse
        daran, zu erkennen, welche Inhalte genutzt werden und ob die Website technisch
        einwandfrei ausgeliefert wird. Die Verarbeitung ist von dem oben genannten Vertrag
        über Auftragsverarbeitung mit Vercel umfasst.
      </P>

      <H3>Sanity (Content-Management-System)</H3>
      <P>
        Die redaktionellen Inhalte dieser Website werden mit dem Content-Management-System
        Sanity verwaltet. Anbieter ist die Sanity US Inc., 351 California St, Suite 650,
        San Francisco, CA 94104, USA. Die Inhalte werden auf Servern in Belgien (EU)
        gespeichert. Beim Besuch dieser Website wird von Ihrem Endgerät keine Verbindung zu
        Sanity aufgebaut; sämtliche Inhalte und Bilder werden über unsere eigene Domain
        ausgeliefert. Sanity verarbeitet daher keine Daten von Websitebesuchern, sondern
        ausschließlich redaktionelle Daten (Zugangsdaten der Redaktion sowie Inhalte, z. B.
        in Erfahrungsberichten genannte Personen).
      </P>
      <P>
        Soweit dabei personenbezogene Daten verarbeitet werden, erfolgt dies auf Grundlage
        von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer effizienten Pflege
        der Website-Inhalte). Für etwaige Übermittlungen in die USA stützen wir uns auf die
        Standardvertragsklauseln der EU-Kommission. Wir haben einen Vertrag über
        Auftragsverarbeitung (AVV) mit Sanity geschlossen.
      </P>

      {/* ── 3 ─────────────────────────────────────────────── */}
      <H2>3. Allgemeine Hinweise und Pflichtinformationen</H2>

      <H3>Datenschutz</H3>
      <P>
        Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst.
        Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den
        gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
      </P>
      <P>
        Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben.
        Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden
        können. Die vorliegende Datenschutzerklärung erläutert, welche Daten wir erheben und
        wofür wir sie nutzen. Sie erläutert auch, wie und zu welchem Zweck das geschieht. Wir
        weisen darauf hin, dass die Datenübertragung im Internet (z. B. bei der Kommunikation
        per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor
        dem Zugriff durch Dritte ist nicht möglich.
      </P>

      <H3>Hinweis zur verantwortlichen Stelle</H3>
      <P>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</P>
      <Block
        lines={[
          'Deutsche Versicherungsmakler GmbH & Co. KG',
          'Gemmingerstr. 14',
          '85051 Ingolstadt',
          'Telefon: +49 841 97479-0',
          'E-Mail: info@dvm.de',
        ]}
      />
      <P>
        Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder
        gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von
        personenbezogenen Daten (z. B. Namen, E-Mail-Adressen o. Ä.) entscheidet.
        „Womensurance" ist eine Marke der Deutschen Versicherungsmakler GmbH &amp; Co. KG.
      </P>

      <H3>Datenschutzbeauftragter</H3>
      <P>Wir haben einen Datenschutzbeauftragten benannt:</P>
      <Block
        lines={[
          'Maisel Consult',
          'Ronny Klotzenbücher',
          'Kämmereigasse 2',
          '95444 Bayreuth',
          'Telefon: +49 921 7930707',
          'E-Mail: datenschutz@maisel.co',
        ]}
      />

      <H3>Speicherdauer</H3>
      <P>
        Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt
        wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die
        Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen
        oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht,
        sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer
        personenbezogenen Daten haben (z. B. steuer- oder handelsrechtliche
        Aufbewahrungsfristen); im letztgenannten Fall erfolgt die Löschung nach Fortfall
        dieser Gründe.
      </P>

      <H3>Allgemeine Hinweise zu den Rechtsgrundlagen der Datenverarbeitung auf dieser Website</H3>
      <P>
        Sofern Sie in die Datenverarbeitung eingewilligt haben, verarbeiten wir Ihre
        personenbezogenen Daten auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO bzw. Art. 9
        Abs. 2 lit. a DSGVO, sofern besondere Datenkategorien nach Art. 9 Abs. 1 DSGVO
        verarbeitet werden. Im Falle einer ausdrücklichen Einwilligung in die Übertragung
        personenbezogener Daten in Drittstaaten erfolgt die Datenverarbeitung außerdem auf
        Grundlage von Art. 49 Abs. 1 lit. a DSGVO. Sofern Sie in die Speicherung von Cookies
        oder in den Zugriff auf Informationen in Ihr Endgerät (z. B. via
        Device-Fingerprinting) eingewilligt haben, erfolgt die Datenverarbeitung zusätzlich
        auf Grundlage von § 25 Abs. 1 TDDDG. Die Einwilligung ist jederzeit widerrufbar. Sind
        Ihre Daten zur Vertragserfüllung oder zur Durchführung vorvertraglicher Maßnahmen
        erforderlich, verarbeiten wir Ihre Daten auf Grundlage des Art. 6 Abs. 1 lit. b
        DSGVO. Des Weiteren verarbeiten wir Ihre Daten, sofern diese zur Erfüllung einer
        rechtlichen Verpflichtung erforderlich sind, auf Grundlage von Art. 6 Abs. 1 lit. c
        DSGVO. Die Datenverarbeitung kann ferner auf Grundlage unseres berechtigten
        Interesses nach Art. 6 Abs. 1 lit. f DSGVO erfolgen. Über die jeweils im Einzelfall
        einschlägigen Rechtsgrundlagen wird in den folgenden Absätzen dieser
        Datenschutzerklärung informiert.
      </P>

      <H3>Empfänger von personenbezogenen Daten</H3>
      <P>
        Im Rahmen unserer Geschäftstätigkeit arbeiten wir mit verschiedenen externen Stellen
        zusammen. Dabei ist teilweise auch eine Übermittlung von personenbezogenen Daten an
        diese externen Stellen erforderlich. Wir geben personenbezogene Daten nur dann an
        externe Stellen weiter, wenn dies im Rahmen einer Vertragserfüllung erforderlich ist,
        wenn wir gesetzlich hierzu verpflichtet sind (z. B. Weitergabe von Daten an
        Steuerbehörden), wenn wir ein berechtigtes Interesse nach Art. 6 Abs. 1 lit. f DSGVO
        an der Weitergabe haben oder wenn eine sonstige Rechtsgrundlage die Datenweitergabe
        erlaubt. Beim Einsatz von Auftragsverarbeitern geben wir personenbezogene Daten
        unserer Kunden nur auf Grundlage eines gültigen Vertrags über Auftragsverarbeitung
        weiter.
      </P>

      <H3>Widerruf Ihrer Einwilligung zur Datenverarbeitung</H3>
      <P>
        Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung
        möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die
        Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf
        unberührt.
      </P>

      <H3>
        Widerspruchsrecht gegen die Datenerhebung in besonderen Fällen sowie gegen
        Direktwerbung (Art. 21 DSGVO)
      </H3>
      <P>
        WENN DIE DATENVERARBEITUNG AUF GRUNDLAGE VON ART. 6 ABS. 1 LIT. E ODER F DSGVO
        ERFOLGT, HABEN SIE JEDERZEIT DAS RECHT, AUS GRÜNDEN, DIE SICH AUS IHRER BESONDEREN
        SITUATION ERGEBEN, GEGEN DIE VERARBEITUNG IHRER PERSONENBEZOGENEN DATEN WIDERSPRUCH
        EINZULEGEN; DIES GILT AUCH FÜR EIN AUF DIESE BESTIMMUNGEN GESTÜTZTES PROFILING. DIE
        JEWEILIGE RECHTSGRUNDLAGE, AUF DENEN EINE VERARBEITUNG BERUHT, ENTNEHMEN SIE DIESER
        DATENSCHUTZERKLÄRUNG. WENN SIE WIDERSPRUCH EINLEGEN, WERDEN WIR IHRE BETROFFENEN
        PERSONENBEZOGENEN DATEN NICHT MEHR VERARBEITEN, ES SEI DENN, WIR KÖNNEN ZWINGENDE
        SCHUTZWÜRDIGE GRÜNDE FÜR DIE VERARBEITUNG NACHWEISEN, DIE IHRE INTERESSEN, RECHTE UND
        FREIHEITEN ÜBERWIEGEN ODER DIE VERARBEITUNG DIENT DER GELTENDMACHUNG, AUSÜBUNG ODER
        VERTEIDIGUNG VON RECHTSANSPRÜCHEN (WIDERSPRUCH NACH ART. 21 ABS. 1 DSGVO).
      </P>
      <P>
        WERDEN IHRE PERSONENBEZOGENEN DATEN VERARBEITET, UM DIREKTWERBUNG ZU BETREIBEN, SO
        HABEN SIE DAS RECHT, JEDERZEIT WIDERSPRUCH GEGEN DIE VERARBEITUNG SIE BETREFFENDER
        PERSONENBEZOGENER DATEN ZUM ZWECKE DERARTIGER WERBUNG EINZULEGEN; DIES GILT AUCH FÜR
        DAS PROFILING, SOWEIT ES MIT SOLCHER DIREKTWERBUNG IN VERBINDUNG STEHT. WENN SIE
        WIDERSPRECHEN, WERDEN IHRE PERSONENBEZOGENEN DATEN ANSCHLIESSEND NICHT MEHR ZUM
        ZWECKE DER DIREKTWERBUNG VERWENDET (WIDERSPRUCH NACH ART. 21 ABS. 2 DSGVO).
      </P>

      <H3>Beschwerderecht bei der zuständigen Aufsichtsbehörde</H3>
      <P>
        Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei
        einer Aufsichtsbehörde, insbesondere in dem Mitgliedstaat ihres gewöhnlichen
        Aufenthalts, ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes zu. Das
        Beschwerderecht besteht unbeschadet anderweitiger verwaltungsrechtlicher oder
        gerichtlicher Rechtsbehelfe.
      </P>

      <H3>Recht auf Datenübertragbarkeit</H3>
      <P>
        Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in
        Erfüllung eines Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in
        einem gängigen, maschinenlesbaren Format aushändigen zu lassen. Sofern Sie die
        direkte Übertragung der Daten an einen anderen Verantwortlichen verlangen, erfolgt
        dies nur, soweit es technisch machbar ist.
      </P>

      <H3>Auskunft, Berichtigung und Löschung</H3>
      <P>
        Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf
        unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren
        Herkunft und Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht auf
        Berichtigung oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema
        personenbezogene Daten können Sie sich jederzeit an uns wenden.
      </P>

      <H3>Recht auf Einschränkung der Verarbeitung</H3>
      <P>
        Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten
        zu verlangen. Hierzu können Sie sich jederzeit an uns wenden. Das Recht auf
        Einschränkung der Verarbeitung besteht in folgenden Fällen:
      </P>
      <UL
        items={[
          'Wenn Sie die Richtigkeit Ihrer bei uns gespeicherten personenbezogenen Daten bestreiten, benötigen wir in der Regel Zeit, um dies zu überprüfen. Für die Dauer der Prüfung haben Sie das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.',
          'Wenn die Verarbeitung Ihrer personenbezogenen Daten unrechtmäßig geschah/geschieht, können Sie statt der Löschung die Einschränkung der Datenverarbeitung verlangen.',
          'Wenn wir Ihre personenbezogenen Daten nicht mehr benötigen, Sie sie jedoch zur Ausübung, Verteidigung oder Geltendmachung von Rechtsansprüchen benötigen, haben Sie das Recht, statt der Löschung die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.',
          'Wenn Sie einen Widerspruch nach Art. 21 Abs. 1 DSGVO eingelegt haben, muss eine Abwägung zwischen Ihren und unseren Interessen vorgenommen werden. Solange noch nicht feststeht, wessen Interessen überwiegen, haben Sie das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.',
        ]}
      />
      <P>
        Wenn Sie die Verarbeitung Ihrer personenbezogenen Daten eingeschränkt haben, dürfen
        diese Daten — von ihrer Speicherung abgesehen — nur mit Ihrer Einwilligung oder zur
        Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen oder zum Schutz der
        Rechte einer anderen natürlichen oder juristischen Person oder aus Gründen eines
        wichtigen öffentlichen Interesses der Europäischen Union oder eines Mitgliedstaats
        verarbeitet werden.
      </P>

      <H3>SSL- bzw. TLS-Verschlüsselung</H3>
      <P>
        Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher
        Inhalte, wie zum Beispiel Anfragen, die Sie an uns als Seitenbetreiber senden, eine
        SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran,
        dass die Adresszeile des Browsers von „http://" auf „https://" wechselt und an dem
        Schloss-Symbol in Ihrer Browserzeile. Wenn die SSL- bzw. TLS-Verschlüsselung
        aktiviert ist, können die Daten, die Sie an uns übermitteln, nicht von Dritten
        mitgelesen werden.
      </P>

      <H3>Widerspruch gegen Werbe-E-Mails</H3>
      <P>
        Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten zur
        Übersendung von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien
        wird hiermit widersprochen. Die Betreiber der Seiten behalten sich ausdrücklich
        rechtliche Schritte im Falle der unverlangten Zusendung von Werbeinformationen, etwa
        durch Spam-E-Mails, vor.
      </P>

      {/* ── 4 ─────────────────────────────────────────────── */}
      <H2>4. Datenerfassung auf dieser Website</H2>

      <H3>Cookies und Einwilligungsverwaltung</H3>
      <P>
        Unsere Internetseiten verwenden so genannte „Cookies" bzw. vergleichbare
        Speichertechnologien (z. B. Local Storage). Diese richten auf Ihrem Endgerät keinen
        Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung
        (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert.
      </P>
      <P>
        Technisch notwendige Speichervorgänge (z. B. die Speicherung Ihrer
        Cookie-Einstellungen) erfolgen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO, sofern
        keine andere Rechtsgrundlage angegeben wird. Der Websitebetreiber hat ein
        berechtigtes Interesse an der technisch fehlerfreien und optimierten Bereitstellung
        seiner Dienste. Sofern eine Einwilligung zur Speicherung von Cookies und
        vergleichbaren Wiedererkennungstechnologien abgefragt wurde, erfolgt die Verarbeitung
        ausschließlich auf Grundlage dieser Einwilligung (Art. 6 Abs. 1 lit. a DSGVO und
        § 25 Abs. 1 TDDDG); die Einwilligung ist jederzeit widerrufbar.
      </P>
      <P>
        Zur Einholung und Dokumentation Ihrer Einwilligung setzen wir ein eigenes, lokal auf
        dieser Website betriebenes Einwilligungs-Banner ein. Dabei werden keine Daten an
        Drittanbieter übermittelt; Ihre Auswahl wird ausschließlich in Ihrem Browser
        gespeichert. Analyse- und Marketing-Dienste (siehe Abschnitt 5) werden erst geladen,
        nachdem Sie eingewilligt haben. Sie können Ihre Auswahl jederzeit über den Link
        „Cookie-Einstellungen" im Footer dieser Website ändern oder widerrufen.
      </P>
      <P>
        Im Einzelnen setzen wir folgende technisch notwendigen Speichervorgänge ein. Beide
        haben keinen Personenbezug und werden nicht an Dritte übertragen:
      </P>
      <UL
        items={[
          <>
            <strong>wmns-consent-v1</strong> (Local Storage, dauerhaft): speichert Ihre
            Auswahl im Einwilligungs-Banner, damit Sie nicht bei jedem Besuch erneut gefragt
            werden.
          </>,
          <>
            <strong>wmns-intro-seen</strong> (Session Storage, endet mit dem Schließen des
            Browser-Tabs): merkt sich, dass die einleitende Animation dieser Website bereits
            gezeigt wurde, damit sie beim Wechsel zwischen Unterseiten nicht erneut startet.
          </>,
        ]}
      />

      <H3>Server-Log-Dateien</H3>
      <P>
        Der Provider der Seiten erhebt und speichert automatisch Informationen in so
        genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies
        sind:
      </P>
      <UL
        items={[
          'Browsertyp und Browserversion',
          'verwendetes Betriebssystem',
          'Referrer URL',
          'Hostname des zugreifenden Rechners',
          'Uhrzeit der Serveranfrage',
          'IP-Adresse',
        ]}
      />
      <P>
        Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.
        Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der
        Websitebetreiber hat ein berechtigtes Interesse an der technisch fehlerfreien
        Darstellung und der Optimierung seiner Website — hierzu müssen die Server-Log-Files
        erfasst werden.
      </P>

      <H3>Anfrage per E-Mail oder Telefon</H3>
      <P>
        Wenn Sie uns per E-Mail oder Telefon kontaktieren, wird Ihre Anfrage inklusive aller
        daraus hervorgehenden personenbezogenen Daten (Name, Anfrage) zum Zwecke der
        Bearbeitung Ihres Anliegens bei uns gespeichert und verarbeitet. Diese Daten geben
        wir nicht ohne Ihre Einwilligung weiter.
      </P>
      <P>
        Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO,
        sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur
        Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen
        beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven
        Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf
        Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), sofern diese abgefragt wurde; die
        Einwilligung ist jederzeit widerrufbar.
      </P>
      <P>
        Die von Ihnen an uns per Kontaktanfragen übersandten Daten verbleiben bei uns, bis
        Sie uns zur Löschung auffordern, Ihre Einwilligung zur Speicherung widerrufen oder
        der Zweck für die Datenspeicherung entfällt (z. B. nach abgeschlossener Bearbeitung
        Ihres Anliegens). Zwingende gesetzliche Bestimmungen — insbesondere gesetzliche
        Aufbewahrungsfristen — bleiben unberührt.
      </P>

      <H3>Rechner auf dieser Website</H3>
      <P>
        Auf dieser Website stellen wir Ihnen Rechner zur Verfügung, mit denen Sie die
        Auswirkungen von Teilzeit und Erwerbspausen auf Ihre spätere Rente abschätzen
        können. Die Angaben, die Sie dort machen (etwa Arbeitszeit, Einkommen oder Anzahl
        der Jahre), werden <strong>ausschließlich in Ihrem eigenen Browser verarbeitet</strong>.
      </P>
      <P>
        Diese Eingaben werden nicht an uns und nicht an Dritte übertragen, nicht gespeichert
        und nicht ausgewertet. Sie verlassen Ihr Endgerät zu keinem Zeitpunkt und sind
        gelöscht, sobald Sie die Seite schließen. Eine Rechtsgrundlage nach Art. 6 DSGVO ist
        insoweit nicht erforderlich, da keine personenbezogenen Daten durch uns verarbeitet
        werden. Die Ergebnisse sind unverbindliche Beispielrechnungen auf Basis von
        Durchschnittswerten und ersetzen keine individuelle Beratung.
      </P>

      <H3>Microsoft Bookings (Terminbuchung)</H3>
      <P>
        Für die Terminbuchung nutzen wir Microsoft Bookings. Anbieter ist die Microsoft
        Ireland Operations Limited, One Microsoft Place, South County Business Park,
        Leopardstown, Dublin 18, Irland.
      </P>
      <P>
        Die Buchungsseite ist <strong>nicht in diese Website eingebettet</strong>. Wir
        verlinken lediglich darauf. Beim bloßen Besuch dieser Website werden daher keine
        Daten an Microsoft übermittelt. Erst wenn Sie den Buchungslink aktiv anklicken,
        verlassen Sie diese Website und es wird eine Verbindung zu den Servern von Microsoft
        aufgebaut, wobei Ihre IP-Adresse an Microsoft übertragen wird.
      </P>
      <P>
        Zum Zweck der Terminbuchung geben Sie die abgefragten Daten und den Wunschtermin auf
        der Buchungsseite von Microsoft ein. Die eingegebenen Daten werden für die Planung,
        Durchführung und ggf. für die Nachbereitung des Termins verwendet. Die Termindaten
        werden für uns auf den Servern von Microsoft Bookings gespeichert, dessen
        Datenschutzerklärung Sie hier einsehen können:{' '}
        <A href="https://privacy.microsoft.com/de-de/privacystatement">
          privacy.microsoft.com/de-de/privacystatement
        </A>
        .
      </P>
      <P>
        Die von Ihnen eingegebenen Daten verbleiben bei uns, bis Sie uns zur Löschung
        auffordern, Ihre Einwilligung zur Speicherung widerrufen oder der Zweck für die
        Datenspeicherung entfällt. Zwingende gesetzliche Bestimmungen — insbesondere
        Aufbewahrungsfristen — bleiben unberührt. Rechtsgrundlage für die Datenverarbeitung
        ist Art. 6 Abs. 1 lit. f DSGVO. Der Websitebetreiber hat ein berechtigtes Interesse
        an einer möglichst unkomplizierten Terminvereinbarung mit Interessenten und Kunden.
        Sofern eine entsprechende Einwilligung abgefragt wurde, erfolgt die Verarbeitung
        ausschließlich auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG;
        die Einwilligung ist jederzeit widerrufbar.
      </P>
      <P>
        Die Datenübertragung in die USA wird auf die Standardvertragsklauseln der
        EU-Kommission gestützt. Das Unternehmen verfügt über eine Zertifizierung nach dem
        „EU-US Data Privacy Framework" (DPF). Weitere Informationen erhalten Sie unter:{' '}
        <A href="https://www.dataprivacyframework.gov/participant/6474">
          dataprivacyframework.gov/participant/6474
        </A>
        .
      </P>

      {/* ── 5 ─────────────────────────────────────────────── */}
      <H2>5. Analyse-Tools und Werbung</H2>
      <P>
        Die folgenden Dienste werden ausschließlich geladen, wenn Sie über unser
        Einwilligungs-Banner aktiv eingewilligt haben (Art. 6 Abs. 1 lit. a DSGVO, § 25
        Abs. 1 TDDDG). Ohne Ihre Einwilligung findet keine Analyse und kein Tracking statt.
      </P>

      <H3>Google Tag Manager</H3>
      <P>
        Wir setzen den Google Tag Manager ein. Anbieter ist die Google Ireland Limited,
        Gordon House, Barrow Street, Dublin 4, Irland. Der Google Tag Manager ist ein Tool,
        mit dessen Hilfe wir Tracking- oder Statistik-Tools und andere Technologien auf
        unserer Website einbinden können. Der Google Tag Manager selbst erstellt keine
        Nutzerprofile, speichert keine Cookies und nimmt keine eigenständigen Analysen vor.
        Er dient lediglich der Verwaltung und Ausspielung der über ihn eingebundenen Tools.
        Der Google Tag Manager erfasst jedoch Ihre IP-Adresse, die auch an das
        Mutterunternehmen von Google in die Vereinigten Staaten übertragen werden kann.
      </P>
      <P>
        Der Einsatz des Google Tag Managers erfolgt auf Grundlage Ihrer Einwilligung (Art. 6
        Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG); die Einwilligung ist jederzeit
        widerrufbar. Das Unternehmen verfügt über eine Zertifizierung nach dem „EU-US Data
        Privacy Framework" (DPF). Weitere Informationen:{' '}
        <A href="https://www.dataprivacyframework.gov/participant/5780">
          dataprivacyframework.gov/participant/5780
        </A>
        .
      </P>

      <H3>Google Analytics 4</H3>
      <P>
        Diese Website nutzt Funktionen des Webanalysedienstes Google Analytics 4. Anbieter ist
        die Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Google
        Analytics ermöglicht es uns, das Verhalten der Besucherinnen und Besucher dieser
        Website zu analysieren, etwa welche Seiten aufgerufen werden, wie lange sie betrachtet
        werden und über welchen Weg jemand auf die Website gelangt ist. Diese Auswertungen
        fassen wir zu Statistiken zusammen, um unsere Inhalte zu verbessern.
      </P>
      <P>
        Google Analytics verwendet Cookies und vergleichbare Wiedererkennungstechnologien.
        Die dadurch erzeugten Informationen über Ihre Benutzung dieser Website werden in der
        Regel an einen Server von Google übertragen und dort gespeichert.
      </P>
      <P>
        Die Nutzung erfolgt ausschließlich auf Grundlage Ihrer Einwilligung nach Art. 6 Abs. 1
        lit. a DSGVO und § 25 Abs. 1 TDDDG; die Einwilligung ist jederzeit widerrufbar. Vor
        Ihrer Einwilligung wird Google Analytics nicht geladen. Wir haben folgende
        datenschutzfreundlichen Einstellungen gewählt:
      </P>
      <UL
        items={[
          'IP-Adressen werden von Google Analytics 4 gekürzt, bevor sie gespeichert werden; eine Zuordnung zu Ihrer Person ist uns dadurch nicht möglich.',
          'Die Funktion „Google-Signale" ist deaktiviert. Es findet daher keine geräteübergreifende Zusammenführung mit Ihrem Google-Konto und keine Auswertung demografischer Merkmale statt.',
          'Die Speicherdauer der Nutzungsdaten ist auf 14 Monate begrenzt; danach werden die Daten automatisch gelöscht.',
        ]}
      />
      <P>
        Die Datenübertragung in die USA wird auf die Standardvertragsklauseln der
        EU-Kommission gestützt. Das Unternehmen verfügt zudem über eine Zertifizierung nach
        dem „EU-US Data Privacy Framework" (DPF). Weitere Informationen:{' '}
        <A href="https://www.dataprivacyframework.gov/participant/5780">
          dataprivacyframework.gov/participant/5780
        </A>
        .
      </P>
      <P>
        Sie können die Erfassung durch Google Analytics zusätzlich verhindern, indem Sie das
        unter dem folgenden Link verfügbare Browser-Add-on installieren:{' '}
        <A href="https://tools.google.com/dlpage/gaoptout">tools.google.com/dlpage/gaoptout</A>
        . Mehr zum Umgang mit Nutzerdaten bei Google Analytics finden Sie in der
        Datenschutzerklärung von Google:{' '}
        <A href="https://support.google.com/analytics/answer/6004245">
          support.google.com/analytics/answer/6004245
        </A>
        .
      </P>
      <P>
        <strong>Auftragsverarbeitung:</strong> Wir haben mit Google einen Vertrag über
        Auftragsverarbeitung geschlossen und setzen die Vorgaben der deutschen
        Datenschutzbehörden bei der Nutzung von Google Analytics vollständig um.
      </P>

      <H3>Meta-Pixel (ehemals Facebook-Pixel)</H3>
      <P>
        Diese Website nutzt zur Konversionsmessung den Besucheraktions-Pixel von
        Facebook/Meta. Anbieter dieses Dienstes ist die Meta Platforms Ireland
        Limited, Merrion Road, Dublin 4, D04 X2K5, Irland. Die erfassten Daten werden nach
        Aussage von Meta jedoch auch in die USA und in andere Drittländer übertragen.
      </P>
      <P>
        So kann das Verhalten der Seitenbesucher nachverfolgt werden, nachdem diese durch
        Klick auf eine Facebook- oder Instagram-Werbeanzeige auf die Website des Anbieters
        weitergeleitet wurden. Dadurch können die Wirksamkeit der Werbeanzeigen für
        statistische und Marktforschungszwecke ausgewertet und zukünftige Werbemaßnahmen
        optimiert werden. Die erhobenen Daten sind für uns als Betreiber dieser Website
        anonym; wir können keine Rückschlüsse auf die Identität der Nutzer ziehen. Die Daten
        werden aber von Meta gespeichert und verarbeitet, sodass eine Verbindung zum
        jeweiligen Nutzerprofil möglich ist und Meta die Daten für eigene Werbezwecke,
        entsprechend der{' '}
        <A href="https://de-de.facebook.com/about/privacy/">Meta-Datenverwendungsrichtlinie</A>{' '}
        verwenden kann.
      </P>
      <P>
        Die Nutzung dieses Dienstes erfolgt ausschließlich auf Grundlage Ihrer Einwilligung
        nach Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG; die Einwilligung ist
        jederzeit widerrufbar. Soweit mit Hilfe des hier beschriebenen Tools
        personenbezogene Daten auf unserer Website erfasst und an Meta weitergeleitet
        werden, sind wir und die Meta Platforms Ireland Limited gemeinsam für diese
        Datenverarbeitung verantwortlich (Art. 26 DSGVO). Die gemeinsame Verantwortlichkeit
        beschränkt sich dabei ausschließlich auf die Erfassung der Daten und deren
        Weitergabe an Meta. Die nach der Weiterleitung erfolgende Verarbeitung durch Meta
        ist nicht Teil der gemeinsamen Verantwortung. Den Wortlaut der Vereinbarung über
        gemeinsame Verarbeitung finden Sie unter:{' '}
        <A href="https://www.facebook.com/legal/controller_addendum">
          facebook.com/legal/controller_addendum
        </A>
        .
      </P>
      <P>
        Die Datenübertragung in die USA wird auf die Standardvertragsklauseln der
        EU-Kommission gestützt. Das Unternehmen verfügt über eine Zertifizierung nach dem
        „EU-US Data Privacy Framework" (DPF). Weitere Informationen:{' '}
        <A href="https://www.dataprivacyframework.gov/participant/4452">
          dataprivacyframework.gov/participant/4452
        </A>
        .
      </P>

      <H3>LinkedIn Insight Tag</H3>
      <P>
        Diese Website nutzt das Insight Tag von LinkedIn. Anbieter ist die LinkedIn Ireland
        Unlimited Company, Wilton Place, Dublin 2, Irland.
      </P>
      <P>
        Das LinkedIn Insight Tag ermöglicht es uns auszuwerten, ob Besucherinnen und Besucher
        über eine Anzeige auf LinkedIn zu uns gefunden haben und ob sie anschließend eine für
        uns relevante Handlung vorgenommen haben, etwa eine Terminbuchung aufgerufen haben.
        Außerdem können wir Personen, die diese Website besucht haben, auf LinkedIn erneut
        Anzeigen ausspielen (Retargeting) und erhalten anonyme Auswertungen über die
        Zusammensetzung unserer Besucherschaft. Dabei werden ein Cookie gesetzt sowie
        technische Informationen wie die IP-Adresse, Zeitstempel, aufgerufene Seiten,
        Geräte- und Browserangaben und eine verschlüsselte LinkedIn-Mitgliedskennung
        übertragen. LinkedIn kürzt oder entfernt diese Kennung nach Angaben des Anbieters
        innerhalb von sieben Tagen und löscht die verbleibenden Daten innerhalb von 180 Tagen.
      </P>
      <P>
        Die Nutzung erfolgt ausschließlich auf Grundlage Ihrer Einwilligung nach Art. 6 Abs. 1
        lit. a DSGVO und § 25 Abs. 1 TDDDG; die Einwilligung ist jederzeit widerrufbar. Vor
        Ihrer Einwilligung wird das Insight Tag nicht geladen. Die Datenübertragung in die USA
        wird auf die Standardvertragsklauseln der EU-Kommission gestützt.
      </P>
      <P>
        Wenn Sie ein LinkedIn-Konto besitzen, können Sie der Analyse Ihres Nutzungsverhaltens
        und der Ausspielung personalisierter Anzeigen unabhängig von unserem
        Einwilligungs-Banner direkt bei LinkedIn widersprechen:{' '}
        <A href="https://www.linkedin.com/psettings/guest-controls/retargeting-opt-out">
          linkedin.com/psettings/guest-controls/retargeting-opt-out
        </A>
        . Weitere Informationen zum Datenschutz bei LinkedIn finden Sie unter:{' '}
        <A href="https://www.linkedin.com/legal/privacy-policy">
          linkedin.com/legal/privacy-policy
        </A>
        .
      </P>

      {/* ── 6 ─────────────────────────────────────────────── */}
      <H2>6. Soziale Medien</H2>
      <P>
        Auf dieser Website verlinken wir auf unsere Profile in sozialen Netzwerken
        (Instagram, LinkedIn). Es handelt sich dabei um einfache Verlinkungen —
        es sind keine Social-Media-Plugins eingebunden. Beim Besuch dieser Website werden
        daher keine Daten an die Betreiber der sozialen Netzwerke übertragen. Erst wenn Sie
        einem Link folgen, gelten die Datenschutzbestimmungen des jeweiligen Anbieters.
      </P>

      {/* ── 7 ─────────────────────────────────────────────── */}
      <H2>7. Schriftarten (lokales Hosting)</H2>
      <P>
        Diese Website nutzt zur einheitlichen Darstellung Schriftarten, die lokal auf
        unserem Server gehostet werden. Eine Verbindung zu Servern von Drittanbietern (z. B.
        Google Fonts) findet dabei nicht statt.
      </P>
    </LegalLayout>
  );
}
