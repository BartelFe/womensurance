import { useEffect, useState } from 'react';
import {
  CATEGORIES,
  getStoredConsent,
  storeConsent,
  initConsentDefaults,
  applyConsent,
} from '../../lib/consent';

/**
 * DSGVO-konformer Cookie-Banner:
 * - Kein Tracking vor aktiver Einwilligung (GTM lädt erst nach Opt-in)
 * - "Alle akzeptieren" und "Nur essenzielle" gleichwertig prominent (kein Nudging)
 * - Granulare Auswahl pro Kategorie
 * - Jederzeit wieder öffenbar (Footer-Link feuert das Event 'wmns-open-consent')
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [choices, setChoices] = useState({ essential: true, analytics: false, marketing: false });

  useEffect(() => {
    initConsentDefaults();
    const stored = getStoredConsent();
    if (stored) {
      setChoices(stored.choices);
      applyConsent(stored.choices);
    } else {
      setVisible(true);
    }

    const reopen = () => {
      const s = getStoredConsent();
      if (s) setChoices(s.choices);
      setShowDetails(true);
      setVisible(true);
    };
    window.addEventListener('wmns-open-consent', reopen);
    return () => window.removeEventListener('wmns-open-consent', reopen);
  }, []);

  if (!visible) return null;

  const close = (finalChoices) => {
    storeConsent(finalChoices);
    setVisible(false);
    setShowDetails(false);
  };

  const acceptAll = () => close({ essential: true, analytics: true, marketing: true });
  const essentialOnly = () => close({ essential: true, analytics: false, marketing: false });
  const saveSelection = () => close(choices);

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie-Einstellungen"
      className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-md z-[500] bg-ink text-paper border border-paper/15 rounded-lg shadow-2xl"
    >
      <div className="p-6">
        <div className="eyebrow text-pink mb-3">Deine Daten, deine Wahl</div>
        <p className="text-sm text-paper/70 leading-relaxed">
          Wir verwenden Cookies und ähnliche Technologien — einige sind technisch
          notwendig, andere helfen uns, die Website zu verbessern und Inhalte zu
          zeigen, die zu dir passen. Statistik und Marketing laden{' '}
          <strong className="text-paper font-medium">erst nach deiner Einwilligung</strong>.
          Details in der{' '}
          <a href="/datenschutz" className="underline hover:text-pink transition-colors">
            Datenschutzerklärung
          </a>
          .
        </p>

        {/* Granulare Auswahl */}
        {showDetails && (
          <div className="mt-5 space-y-3 border-t border-paper/10 pt-5">
            {CATEGORIES.map((cat) => {
              const on = choices[cat.id];
              return (
                <label
                  key={cat.id}
                  className={`flex items-start gap-3 ${cat.required ? 'opacity-60' : 'cursor-pointer'}`}
                >
                  <button
                    role="switch"
                    aria-checked={on}
                    disabled={cat.required}
                    onClick={() =>
                      !cat.required && setChoices((c) => ({ ...c, [cat.id]: !c[cat.id] }))
                    }
                    className={`relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors ${
                      on ? 'bg-pink' : 'bg-paper/20'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-paper transition-all ${
                        on ? 'left-[18px]' : 'left-0.5'
                      }`}
                    />
                  </button>
                  <span>
                    <span className="block text-sm font-medium text-paper">
                      {cat.label}
                      {cat.required && (
                        <span className="ml-2 text-[10px] uppercase tracking-widest text-paper/55">
                          immer aktiv
                        </span>
                      )}
                    </span>
                    <span className="block text-xs text-paper/55 leading-relaxed mt-0.5">
                      {cat.description}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        )}

        {/* Buttons — Akzeptieren & Ablehnen gleichwertig (DSGVO: kein Dark Pattern) */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={acceptAll}
            className="rounded-full bg-pink text-ink px-4 py-3 text-sm font-medium hover:bg-pink-deep transition-colors"
          >
            Alle akzeptieren
          </button>
          <button
            onClick={essentialOnly}
            className="rounded-full border border-paper/30 text-paper px-4 py-3 text-sm font-medium hover:border-pink hover:text-pink transition-colors"
          >
            Nur essenzielle
          </button>
        </div>
        <div className="mt-3 text-center">
          {showDetails ? (
            <button
              onClick={saveSelection}
              className="eyebrow text-paper/60 hover:text-pink transition-colors py-1"
            >
              Auswahl speichern
            </button>
          ) : (
            <button
              onClick={() => setShowDetails(true)}
              className="eyebrow text-paper/60 hover:text-pink transition-colors py-1"
            >
              Einstellungen anpassen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
