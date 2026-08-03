import { Link } from 'react-router-dom';
import { SOCIALS } from '../../config/site';

export default function Footer() {
  return (
    <footer className="bg-ink text-paper/60 border-t border-paper/10">
      {/* Footer grid */}
      <div className="px-6 md:px-12 py-16 md:py-20 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="display-italic text-paper text-2xl">womensurance</div>
          <div className="mt-3 text-sm text-paper/55 max-w-sm">
            Eine Marke der Deutschen Versicherungsmakler GmbH &amp; Co. KG. Versicherungsberatung für Frauen — auf Augenhöhe, entlang deines Lebens.
          </div>
          <div className="mt-6 flex gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="w-10 h-10 rounded-full border border-paper/20 hover:border-pink hover:text-pink transition-colors flex items-center justify-center text-xs font-medium"
              >
                {s.short}
              </a>
            ))}
          </div>
        </div>

        <div>
          <div className="eyebrow text-paper/55 mb-4">Themen</div>
          <ul className="space-y-2 text-sm">
            <li><a href="/#gap" className="hover:text-pink">Die Lücke</a></li>
            <li><a href="/#life" className="hover:text-pink">Dein Leben</a></li>
            <li><Link to="/rentenluecke" className="hover:text-pink">Teilzeit &amp; Care-Arbeit</Link></li>
            <li><Link to="/scheidung" className="hover:text-pink">Scheidung</Link></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow text-paper/55 mb-4">Kontakt</div>
          <ul className="space-y-2 text-sm">
            <li><a href="mailto:julia@womensurance.de" className="hover:text-pink">julia@womensurance.de</a></li>
            <li><a href="https://outlook.office.com/book/Womensurance@dvm.de/?ismsaljsauthenabled" target="_blank" rel="noreferrer" className="hover:text-pink">Termin buchen</a></li>
          </ul>
        </div>
      </div>

      {/* Legal bar */}
      <div className="border-t border-paper/10 bg-ink/80 px-6 md:px-12 py-8">
        {/* Mobil untereinander: die vier Links passten in einer Zeile nicht
            nebeneinander (`flex gap-6` ohne Umbruch), „Cookie-Einstellungen"
            lief dadurch aus dem Bild. Ab md wieder zweispaltig. */}
        <div className="flex flex-col gap-5 md:flex-row md:flex-wrap md:items-center md:justify-between text-xs text-paper/55">
          <span className="leading-relaxed">© 2026 Womensurance — Eine Marke der Deutschen Versicherungsmakler GmbH &amp; Co. KG</span>
          {/* Mobil 2×2: oben Impressum + Datenschutz, darunter
              Cookie-Einstellungen + Barrierefreiheit (Wunsch Felix 08/2026).
              `order-last` schiebt Barrierefreiheit nur mobil ans Ende,
              ab md gilt wieder die DOM-Reihenfolge. */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 md:flex md:flex-wrap">
            <Link to="/impressum" className="hover:text-pink">Impressum</Link>
            <Link to="/datenschutz" className="hover:text-pink">Datenschutz</Link>
            <Link to="/barrierefreiheit" className="order-last hover:text-pink md:order-none">Barrierefreiheit</Link>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('wmns-open-consent'))}
              className="text-left hover:text-pink"
            >
              Cookie-Einstellungen
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
