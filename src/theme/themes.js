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
    'pink-deep': mix(pink, '#000000', 0.25),
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
      clay: '#7a4a3a',
      'clay-mid': '#a87864',
      'clay-light': '#e8d5ce',
      muted: '#7a5f58',
      green: '#a7a376',
    },
  },
  {
    id: 'julia-braun',
    label: 'Julia — Dunkelbraun',
    // "Schwarz zu hart" → tiefes Warmbraun als dunkler Grund, Julias Töne als Akzente
    base: { ink: '#2a211b', paper: '#e8e3e1', pink: '#f35991', clay: '#835f49', green: '#a7a376' },
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

export const DEFAULT_PRESET = PRESETS[0];
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
