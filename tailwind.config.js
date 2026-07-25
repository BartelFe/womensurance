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
        },
        clay: {
          DEFAULT: v('clay'),
          mid: v('clay-mid'),
          light: v('clay-light'),
        },
        muted: v('muted'),
        green: v('green'),
      },
      fontFamily: {
        display: ['Lato', 'system-ui', 'sans-serif'],
        body: ['Lato', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        editorial: '-0.025em',
      },
    },
  },
  plugins: [],
};
