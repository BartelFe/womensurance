import LegalLayout, { H2, H3, P, Block, A } from '../components/legal/LegalLayout';

/**
 * Impressum — auf Basis des Impressums von dvm.de (eRecht24-Rechtstext der DVM,
 * Stand 06/2026), angepasst auf womensurance.de als Marken-Website.
 *
 * ⚠️ ENTWURF: Vor Go-Live durch DVM / Maisel Consult (Hr. Klotzenbücher) prüfen lassen.
 * Prüfpunkte siehe Abschlussbericht (u. a. Registernummer der Verwaltungs GmbH,
 * Fürst-Fugger-Hinweis, E-Mail-Adresse der Marke).
 */
export default function Impressum() {
  return (
    <LegalLayout
      title="Impressum"
      subtitle="Womensurance ist eine Marke der Deutschen Versicherungsmakler GmbH & Co. KG."
      stand="Juli 2026"
    >
      <H2>Angaben gemäß § 5 DDG</H2>
      <Block
        lines={[
          'Deutsche Versicherungsmakler GmbH & Co. KG',
          'Gemmingerstr. 14',
          '85051 Ingolstadt',
        ]}
      />
      <Block lines={['Handelsregister: HRA 3415', 'Registergericht: Amtsgericht Ingolstadt']} />
      <P>
        <strong>Vertreten durch:</strong>
      </P>
      <Block
        lines={[
          'Deutsche Versicherungsmakler Verwaltungs GmbH',
          'Gemmingerstr. 14',
          '85051 Ingolstadt',
        ]}
      />
      <P>
        <strong>Diese vertreten durch:</strong>
      </P>
      <Block
        lines={[
          'Herr Lars Falkowski',
          'Herr Uwe Hartmann',
          'Herr Mario Kozuch',
          'Handelsregister: HRB 8920',
          'Registergericht: Amtsgericht Ingolstadt',
        ]}
      />
      <P>
        „Womensurance" ist eine Marke der Deutschen Versicherungsmakler GmbH &amp; Co. KG.
        Ansprechpartnerin für die Angebote dieser Website ist Julia Pashchenko.
      </P>

      <H2>Kontakt</H2>
      <Block
        lines={[
          'Telefon: +49 841 97479-0',
          'Telefax: +49 841 97479-79',
          'E-Mail: info@dvm.de',
        ]}
      />

      <H2>Umsatzsteuer-ID</H2>
      <P>
        Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
        <br />
        DE-322410699
      </P>

      <H2>Vermittlerregister</H2>
      <P>
        Registrierungs-Nr.: D-PT5S-EW0E3-25
        <br />
        Register einsehbar unter: <A href="https://www.vermittlerregister.info">www.vermittlerregister.info</A>
      </P>

      <H2>Aufsichtsbehörde</H2>
      <Block
        lines={[
          'IHK für München und Oberbayern',
          'Max-Joseph-Str. 2',
          '80333 München',
          'Telefon: +49 89 5116-0',
          'Telefax: +49 89 5116-306',
        ]}
      />
      <P>
        <A href="https://www.ihk-muenchen.de/">https://www.ihk-muenchen.de/</A>
      </P>

      <H2>Berufsbezeichnung und berufsrechtliche Regelungen</H2>
      <P>
        Berufsbezeichnung: Versicherungsmakler
        <br />
        Verliehen in: Deutschland
      </P>
      <P>
        <strong>Zuständige Kammer:</strong>
      </P>
      <Block
        lines={[
          'IHK für München und Oberbayern',
          'Max-Joseph-Str. 2',
          '80333 München',
          'E-Mail: info@muenchen.ihk.de',
        ]}
      />
      <P>
        <strong>Es gelten folgende berufsrechtliche Regelungen:</strong>
      </P>
      <P>
        § 34 d Gewerbeordnung für Versicherungsvermittler (GewO), einsehbar unter{' '}
        <A href="https://www.gesetze-im-internet.de/gewo/__34d.html">gesetze-im-internet.de/gewo/__34d.html</A>
      </P>
      <P>
        § 34 f Gewerbeordnung für Finanzanlagenvermittler (GewO), einsehbar unter{' '}
        <A href="https://www.gesetze-im-internet.de/gewo/__34f.html">gesetze-im-internet.de/gewo/__34f.html</A>
      </P>
      <P>
        §§ 59–68 Gesetz über den Versicherungsvertrag (VVG), einsehbar unter{' '}
        <A href="https://www.gesetze-im-internet.de/vvg_2008/BJNR263110007.html">gesetze-im-internet.de/vvg_2008</A>
      </P>
      <P>
        Versicherungsvermittlungsverordnung (VersVermV), einsehbar unter{' '}
        <A href="https://www.gesetze-im-internet.de/versvermv_2018/">gesetze-im-internet.de/versvermv_2018</A>
      </P>

      <H2>Angaben zur Berufshaftpflichtversicherung</H2>
      <P>
        <strong>Name und Sitz des Versicherers:</strong>
      </P>
      <Block lines={['ERGO Versicherung AG', 'ERGO-Platz 1', '40477 Düsseldorf']} />
      <P>
        <strong>Geltungsraum der Versicherung:</strong> Weltweit
      </P>

      <H2>Schlichtungsstellen</H2>
      <P>
        Information zur Teilnahme am Streitbeilegungsverfahren gemäß § 36
        Verbraucherstreitbeilegungsgesetz: Wir sind gemäß § 17 Abs. 4 der
        Versicherungsvermittlungsverordnung (VersVermV) verpflichtet, an
        Streitbeilegungsverfahren vor den nachfolgend genannten
        Verbraucherschlichtungsstellen teilzunehmen.
      </P>
      <P>
        <strong>Zuständige Verbraucherschlichtungsstellen:</strong>
      </P>
      <Block
        lines={[
          'Versicherungsombudsmann e. V.',
          'Postfach 08 06 32, 10006 Berlin',
          'Tel: 0800 3696000',
        ]}
      />
      <P>
        <A href="https://www.versicherungsombudsmann.de">www.versicherungsombudsmann.de</A>
      </P>
      <Block
        lines={[
          'Ombudsmann Private Kranken- und Pflegeversicherung',
          'Postfach 06 02 22, 10052 Berlin',
          'Tel: 0800 2550444',
        ]}
      />
      <P>
        <A href="https://www.pkv-ombudsmann.de">www.pkv-ombudsmann.de</A>
      </P>

      <H2>Rechtlicher Hinweis zur Anlageberatung</H2>
      <P>
        Die Anlageberatung und die Anlagevermittlung im Sinne des Kreditwesengesetzes (KWG)
        bieten wir Ihnen als vertraglich gebundener Vermittler im Sinne des KWG im Auftrag,
        im Namen und für Rechnung der Fürst Fugger Privatbank Aktiengesellschaft,
        Maximilianstr. 38, 86150 Augsburg an. Sie erreichen die Fürst Fugger Privatbank
        Aktiengesellschaft telefonisch unter (0821) 3201111, per E-Mail unter
        vertriebsbetreuung@fuggerbank.de. Weitere Informationen finden Sie im Impressum der
        Fürst Fugger Privatbank Aktiengesellschaft:{' '}
        <A href="https://www.fuggerbank.de/impressum">www.fuggerbank.de/impressum</A>
      </P>
      <P>
        Die Bundesanstalt für Finanzdienstleistungsaufsicht (BaFin) führt ein öffentliches
        Register von vertraglich gebundenen Vermittlern der Fürst Fugger Privatbank
        Aktiengesellschaft. Das öffentliche Register können Sie einsehen auf{' '}
        <A href="https://www.bafin.de">www.bafin.de</A>.
      </P>

      <H2>Gestaltung &amp; Programmierung</H2>
      <Block
        lines={[
          'Felix Bartel Webdesign',
          'Inhaber: Felix Bartel',
          'Schlüterstr. 31',
          '85057 Ingolstadt',
        ]}
      />

      <H2>Bildnachweise</H2>
      <P>Fotografien: Julia Pashchenko / privat. Alle Rechte vorbehalten.</P>
    </LegalLayout>
  );
}
