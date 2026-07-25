export default function Footer() {
  return (
    <footer className="bg-ink text-paper/60 border-t border-paper/10">
      {/* Top: Big brand statement */}
      <div className="px-6 md:px-12 py-24">
        <div className="display-italic text-paper text-balance" style={{ fontSize: 'clamp(2.4rem, 7vw, 6.5rem)', lineHeight: 0.95 }}>
          Sicherheit ist <em className="text-pink not-italic font-display font-black">Freiheit.</em>
        </div>
      </div>

      {/* Footer grid */}
      <div className="border-t border-paper/10 px-6 md:px-12 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="display-italic text-paper text-2xl">womensurance</div>
          <div className="mt-3 text-sm text-paper/40 max-w-sm">
            Eine Marke der Deutschen Versicherungsmakler GmbH &amp; Co. KG. Versicherungsberatung für Frauen — auf Augenhöhe, entlang deines Lebens.
          </div>
          <div className="mt-6 flex gap-2">
            {[
              ['IG', 'https://www.instagram.com/womensurance/'],
              ['TT', 'https://www.tiktok.com/@womensurance'],
              ['in', 'https://www.linkedin.com/in/julia-pashchenko/'],
            ].map(([label, url]) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-paper/20 hover:border-pink hover:text-pink transition-colors flex items-center justify-center text-xs font-medium"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <div className="eyebrow text-paper/50 mb-4">Themen</div>
          <ul className="space-y-2 text-sm">
            <li><a href="#gap" className="hover:text-pink">Die Lücke</a></li>
            <li><a href="#life" className="hover:text-pink">Dein Leben</a></li>
            <li><a href="#method" className="hover:text-pink">Mein Weg</a></li>
            <li><a href="#voices" className="hover:text-pink">Stimmen</a></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow text-paper/50 mb-4">Kontakt</div>
          <ul className="space-y-2 text-sm">
            <li><a href="mailto:julia@womensurance.de" className="hover:text-pink">julia@womensurance.de</a></li>
            <li><a href="https://outlook.office.com/book/Womensurance@dvm.de/?ismsaljsauthenabled" target="_blank" rel="noreferrer" className="hover:text-pink">Termin buchen</a></li>
            <li><a href="#impressum" className="hover:text-pink">Impressum</a></li>
          </ul>
        </div>
      </div>

      {/* Impressum */}
      <div id="impressum" className="border-t border-paper/10 bg-ink/80 px-6 md:px-12 py-12">
        <div className="eyebrow text-paper/40 mb-6">Impressum &middot; Platzhalter</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-xs text-paper/40 leading-relaxed">
          <div>
            <div className="text-paper/60 font-medium mb-2">Angaben gemäß § 5 TMG</div>
            Deutsche Versicherungsmakler GmbH &amp; Co. KG<br />
            Markenname: Womensurance<br />
            Ansprechpartnerin: Julia Pashchenko<br />
            [Straße + Nr.]<br />
            85049 Ingolstadt
          </div>
          <div>
            <div className="text-paper/60 font-medium mb-2">Aufsichtsbehörde</div>
            IHK München und Oberbayern<br />
            Erlaubnis gemäß § 34d GewO<br />
            Vermittlerregister-Nr.: [einfügen]
          </div>
          <div>
            <div className="text-paper/60 font-medium mb-2">Haftung</div>
            Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für externe Links. Verantwortlich sind ausschließlich deren Betreiber.
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-xs text-paper/30">
          <span>© 2026 Womensurance — Eine Marke der DVM</span>
          <div className="flex gap-6">
            <a href="#impressum" className="hover:text-pink">Datenschutz</a>
            <a href="#impressum" className="hover:text-pink">Impressum</a>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('wmns-open-consent'))}
              className="hover:text-pink"
            >
              Cookie-Einstellungen
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
