/** @type {import('tailwindcss').Config} */
// Alle Farben laufen über CSS-Variablen (siehe globals.css), damit das
// Farb-Panel (ThemePanel) die komplette Site live umfärben kann.
const v = (name) => `rgb(var(--${name}-rgb) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: v('ink'),
        paper: v('paper'),
        bone: v('bone'),
        pink: {
          DEFAULT: v('pink'),
          soft: v('pink-soft'),
          deep: v('pink-deep'),
          display: v('pink-display'),
        },
        clay: {
          DEFAULT: v('clay'),
          deep: v('clay-deep'),
          mid: v('clay-mid'),
          light: v('clay-light'),
        },
        muted: v('muted'),
        green: v('green'),
      },
      fontFamily: {
        // Eine Schriftfamilie für alles (Wunsch Julia 07/2026: keine "Computerschrift"
        // mehr für Zahlen/Datenfakten) — Hierarchie entsteht über Font-Weights.
        // `mono` bleibt als Alias gemappt, damit keine Restklasse Segoe UI rendert.
        sans: ['Lato', 'system-ui', 'sans-serif'],
        display: ['Lato', 'system-ui', 'sans-serif'],
        body: ['Lato', 'system-ui', 'sans-serif'],
        mono: ['Lato', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        editorial: '-0.025em',
      },
    },
  },
  plugins: [],
};
