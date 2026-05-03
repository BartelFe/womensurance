/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0807',
        paper: '#f4ede4',
        bone: '#fffaf3',
        pink: {
          DEFAULT: '#ff2e88',
          soft: '#ffd0e2',
          deep: '#c91068',
        },
        clay: {
          DEFAULT: '#7a4a3a',
          mid: '#a87864',
          light: '#e8d5ce',
        },
        muted: '#7a5f58',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Geist', 'system-ui', 'sans-serif'],
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
