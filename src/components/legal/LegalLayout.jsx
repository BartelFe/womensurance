import { useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * Gemeinsames Layout für Rechtsseiten (Impressum, Datenschutz).
 * Bewusst ruhig & gut lesbar — Editorial-Look der Site, aber ohne Effekte.
 */

export function H2({ children }) {
  return (
    <h2 className="display-lg text-ink mt-12 mb-4" style={{ fontSize: 'clamp(1.35rem, 2vw, 1.9rem)' }}>
      {children}
    </h2>
  );
}

export function H3({ children }) {
  return (
    <h3 className="text-ink font-bold mt-8 mb-3" style={{ fontSize: 'clamp(1.05rem, 1.4vw, 1.25rem)' }}>
      {children}
    </h3>
  );
}

export function P({ children }) {
  return <p className="text-ink/70 leading-relaxed mb-4 text-[15px] md:text-base">{children}</p>;
}

export function UL({ items }) {
  return (
    <ul className="list-disc pl-5 mb-4 space-y-1.5 text-ink/70 text-[15px] md:text-base leading-relaxed">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
}

export function A({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-pink-deep underline decoration-pink/40 underline-offset-2 hover:text-pink transition-colors break-words"
    >
      {children ?? href}
    </a>
  );
}

/** Adress-/Kontaktblock ohne Aufzählungspunkte */
export function Block({ lines }) {
  return (
    <p className="text-ink/70 leading-relaxed mb-4 text-[15px] md:text-base">
      {lines.map((l, i) => (
        <span key={i}>
          {l}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </p>
  );
}

export default function LegalLayout({ title, subtitle, stand, children }) {
  useEffect(() => {
    document.title = `${title} | Womensurance`;
  }, [title]);

  return (
    <main id="main" tabIndex={-1} className="relative">
      {/* Kopf im Site-Look */}
      <section className="bg-ink text-paper px-6 md:px-12 pt-36 md:pt-44 pb-14 md:pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="eyebrow text-pink mb-6">Rechtliches</div>
          <h1 className="display-xl text-paper" style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)' }}>
            {title}
          </h1>
          {subtitle && <p className="mt-6 body-lead text-paper/55 max-w-xl">{subtitle}</p>}
        </div>
      </section>

      {/* Inhalt */}
      <section className="bg-paper text-ink px-6 md:px-12 py-14 md:py-20">
        <div className="max-w-3xl mx-auto">
          {children}

          <div className="mt-16 pt-8 border-t border-ink/10 flex flex-wrap items-center justify-between gap-4">
            {stand && <div className="text-[12px] text-ink/60">Stand: {stand}</div>}
            <Link to="/" className="eyebrow text-ink/60 hover:text-pink transition-colors">
              ← Zurück zur Startseite
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
