// Theme-System für das Farb-Panel.
// Ein Theme = 5 Basisfarben, alle abgeleiteten Töne werden daraus berechnet.
// Presets enthalten bewusst ALLE Tokens (handverlesen), damit "Original" pixelidentisch bleibt.

// ── Farb-Helfer ────────────────────────────────────────────────
export function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex([r, g, b]) {
  return '#' + [r, g, b].map((c) => Math.round(Math.max(0, Math.min(255, c))).toString(16).padStart(2, '0')).join('');
}

/** Mischt a Richtung b: t=0 → a, t=1 → b */
export function mix(a, b, t) {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  return rgbToHex(ca.map((v, i) => v + (cb[i] - v) * t));
}

/** Relative Leuchtdichte nach WCAG 2.1 */
export function luminanz(hex) {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Kontrastverhältnis zweier Farben (1–21) */
export function kontrast(a, b) {
  const la = luminanz(a);
  const lb = luminanz(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/**
 * Dunkelt (bzw. auf dunklem Grund: hellt) `farbe` nur so weit auf, bis das
 * geforderte Kontrastverhältnis zu `grund` erreicht ist — und gibt sie
 * andernfalls UNVERÄNDERT zurück.
 *
 * Damit bleibt die Markenfarbe überall dort exakt erhalten, wo sie ohnehin
 * schon reicht; nur Paletten, die WCAG 1.4.3 reißen, werden minimal
 * korrigiert. Schrittweite 2 % — feiner als das Auge auf Fließtext trennt.
 */
export function mitKontrast(farbe, grund, ziel) {
  if (kontrast(farbe, grund) >= ziel) return farbe;
  const richtung = luminanz(grund) > 0.18 ? '#000000' : '#ffffff';
  for (let t = 0.02; t <= 1.0001; t += 0.02) {
    const kandidat = mix(farbe, richtung, t);
    if (kontrast(kandidat, grund) >= ziel) return kandidat;
  }
  return richtung;
}

/** Leitet aus 5 Basisfarben das volle Token-Set ab */
export function deriveTokens({ ink, paper, pink, clay, green }) {
  return {
    ink,
    paper,
    pink,
    clay,
    green,
    bone: mix(paper, '#ffffff', 0.55),
    'pink-soft': mix(pink, '#ffffff', 0.72),
    // Kontrast-geführt statt fester Mischung: `paper` ist der dunkelste helle
    // Grund (bone ist heller), also der ungünstigste Fall.
    'pink-deep': mitKontrast(pink, paper, 4.5), // kleiner Text auf hellem Grund
    'pink-display': mitKontrast(pink, paper, 3), // großer Text (>=24px) auf hellem Grund
    'clay-deep': mitKontrast(clay, paper, 4.5),
    'clay-mid': mix(clay, '#ffffff', 0.3),
    'clay-light': mix(clay, paper, 0.78),
    muted: mix(clay, paper, 0.25),
  };
}

// ── Presets ────────────────────────────────────────────────────
export const PRESETS = [
  {
    id: 'original',
    label: 'Original (Dunkel)',
    base: { ink: '#0a0807', paper: '#f4ede4', pink: '#ff2e88', clay: '#7a4a3a', green: '#a7a376' },
    tokens: {
      ink: '#0a0807',
      paper: '#f4ede4',
      bone: '#fffaf3',
      pink: '#ff2e88',
      'pink-soft': '#ffd0e2',
      'pink-deep': '#c91068',
      // Original-Pink schafft auf `paper` 3,02:1 — reicht für großen Text,
      // bleibt deshalb bewusst unverändert.
      'pink-display': '#ff2e88',
      clay: '#7a4a3a',
      'clay-deep': '#623b2e',
      'clay-mid': '#a87864',
      'clay-light': '#e8d5ce',
      muted: '#7a5f58',
      green: '#a7a376',
    },
  },
  {
    id: 'julia-braun',
    label: 'Julia — Dunkelbraun',
    // ✅ FINALE PALETTE (Freigabe Julia via Felix, 01.08.2026) — siehe DEFAULT_PRESET.
    // "Schwarz zu hart" → tiefes Warmbraun als dunkler Grund. Als Akzent bewusst
    // das Marken-Pink #ff2e88, nicht Julias weicheres #f35991.
    base: { ink: '#2a211b', paper: '#e8e3e1', pink: '#ff2e88', clay: '#835f49', green: '#a7a376' },
    tokens: null, // null = aus base ableiten
  },
  {
    id: 'julia-hell',
    label: 'Julia — Hell',
    // Invertiert: heller Grund #e8e3e1, dunkles Braun übernimmt die Text-/Kontrastrolle
    base: { ink: '#e8e3e1', paper: '#3d2f25', pink: '#f35991', clay: '#835f49', green: '#a7a376' },
    tokens: null,
  },
];

// Ausgelieferte Palette. Muss mit den :root-Fallbacks in `styles/globals.css`
// übereinstimmen — die greifen, bevor React läuft (kein Farbsprung beim Laden).
export const DEFAULT_PRESET = PRESETS.find((p) => p.id === 'julia-braun');
export const STORAGE_KEY = 'wmns-theme-v1';

/** Liefert das volle Token-Set eines Presets */
export function presetTokens(preset) {
  return preset.tokens || deriveTokens(preset.base);
}

/** Schreibt Tokens als CSS-Variablen auf :root und benachrichtigt Canvas-Komponenten */
export function applyTokens(tokens) {
  const root = document.documentElement;
  Object.entries(tokens).forEach(([name, hex]) => {
    root.style.setProperty(`--color-${name}`, hex);
    root.style.setProperty(`--${name}-rgb`, hexToRgb(hex).join(' '));
  });
  window.dispatchEvent(new CustomEvent('wmns-theme', { detail: tokens }));
}

export function loadStoredTheme() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function storeTheme(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* private mode etc. */
  }
}

export function clearStoredTheme() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}
