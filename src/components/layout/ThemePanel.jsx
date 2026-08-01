import { useEffect, useState } from 'react';
import {
  PRESETS,
  DEFAULT_PRESET,
  presetTokens,
  deriveTokens,
  applyTokens,
  loadStoredTheme,
  storeTheme,
  clearStoredTheme,
} from '../../theme/themes';

const PICKERS = [
  { key: 'ink', label: 'Dunkler Grund' },
  { key: 'paper', label: 'Heller Grund / Text' },
  { key: 'pink', label: 'Akzent Pink' },
  { key: 'clay', label: 'Braun' },
  { key: 'green', label: 'Grün' },
];

/**
 * Ausklappbares Farb-Panel für die Design-Phase mit Julia.
 * Ändert die CSS-Variablen live, speichert lokal (localStorage) —
 * nur auf dem jeweiligen Gerät sichtbar, nie für andere Besucher.
 *
 * ⚠️ NUR ein Abstimmungswerkzeug, kein Feature für Besucherinnen.
 * Sichtbar, solange `VITE_THEME_PANEL=true` gesetzt ist (siehe .env).
 * Zum Go-Live in den Vercel-Environment-Variablen auf `false` setzen
 * bzw. die Variable entfernen — dann rendert die Komponente nichts,
 * inklusive des Toggle-Tabs am rechten Rand.
 */
export default function ThemePanel() {
  const [open, setOpen] = useState(false);
  const [presetId, setPresetId] = useState(DEFAULT_PRESET.id);
  const [base, setBase] = useState(DEFAULT_PRESET.base);

  // Gespeichertes Theme beim Laden anwenden
  useEffect(() => {
    const stored = loadStoredTheme();
    if (stored?.base) {
      setBase(stored.base);
      setPresetId(stored.presetId || 'custom');
      applyTokens(stored.presetId && stored.presetId !== 'custom'
        ? presetTokens(PRESETS.find((p) => p.id === stored.presetId) || DEFAULT_PRESET)
        : deriveTokens(stored.base));
    }
  }, []);

  const selectPreset = (preset) => {
    setPresetId(preset.id);
    setBase(preset.base);
    applyTokens(presetTokens(preset));
    storeTheme({ presetId: preset.id, base: preset.base });
  };

  const changeColor = (key, hex) => {
    const next = { ...base, [key]: hex };
    setBase(next);
    setPresetId('custom');
    applyTokens(deriveTokens(next));
    storeTheme({ presetId: 'custom', base: next });
  };

  const reset = () => {
    clearStoredTheme();
    selectPreset(DEFAULT_PRESET);
  };

  // Nach den Hooks, damit die Hook-Reihenfolge stabil bleibt
  if (import.meta.env.VITE_THEME_PANEL !== 'true') return null;

  return (
    <>
      {/* Toggle-Tab am rechten Rand */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Farben anpassen"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[400] bg-ink text-paper border border-paper/20 border-r-0 rounded-l-md px-2 py-4 flex flex-col items-center gap-2 hover:text-pink transition-colors"
      >
        <span className="flex flex-col gap-1">
          <span className="h-2 w-2 rounded-full bg-pink" />
          <span className="h-2 w-2 rounded-full bg-clay-mid" />
          <span className="h-2 w-2 rounded-full bg-green" />
        </span>
        <span
          className="font-mono text-[9px] uppercase tracking-[0.2em]"
          style={{ writingMode: 'vertical-rl' }}
        >
          Farben
        </span>
      </button>

      {/* Panel */}
      <div
        inert={open ? undefined : ''}
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-[401] w-72 max-h-[85vh] overflow-y-auto bg-ink text-paper border border-paper/15 rounded-l-lg shadow-2xl transition-transform duration-500 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="eyebrow text-paper/60">Farben testen</div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Panel schließen"
              className="text-paper/55 hover:text-pink text-lg leading-none"
            >
              ×
            </button>
          </div>

          {/* Presets */}
          <div className="space-y-2 mb-6">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => selectPreset(p)}
                className={`w-full flex items-center justify-between rounded-md border px-3 py-2.5 text-left text-xs transition-colors ${
                  presetId === p.id
                    ? 'border-pink text-paper'
                    : 'border-paper/15 text-paper/60 hover:border-paper/40'
                }`}
              >
                <span>{p.label}</span>
                <span className="flex gap-1">
                  {['ink', 'paper', 'pink', 'clay', 'green'].map((k) => (
                    <span
                      key={k}
                      className="h-3.5 w-3.5 rounded-full border border-white/20"
                      style={{ background: p.base[k] }}
                    />
                  ))}
                </span>
              </button>
            ))}
          </div>

          {/* Einzelfarben */}
          <div className="eyebrow text-paper/55 mb-3">Feintuning</div>
          <div className="space-y-3 mb-6">
            {PICKERS.map(({ key, label }) => (
              <label key={key} className="flex items-center justify-between gap-3 text-xs text-paper/70">
                <span>{label}</span>
                <span className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-paper/55">{base[key]}</span>
                  <input
                    type="color"
                    value={base[key]}
                    onChange={(e) => changeColor(key, e.target.value)}
                    className="h-7 w-9 cursor-pointer rounded border border-paper/20 bg-transparent p-0"
                  />
                </span>
              </label>
            ))}
          </div>

          <button
            onClick={reset}
            className="w-full eyebrow text-paper/55 border border-paper/15 rounded-md py-2.5 hover:border-pink hover:text-pink transition-colors"
          >
            Zurücksetzen
          </button>

          <p className="mt-4 text-[10px] leading-relaxed text-paper/55">
            Die Auswahl wird nur auf diesem Gerät gespeichert — Besucher sehen
            immer die Standard-Farben.
          </p>
        </div>
      </div>
    </>
  );
}
