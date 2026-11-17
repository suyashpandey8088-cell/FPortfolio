/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* ── maximalist palette ──────────────────────────────────────────────
           Named for use, not for hue, so a section can own one without the
           markup reading like a paint chart. */
        ink: '#0A0908',
        paper: '#F7F1E4',
        cream: '#FBF4E2',
        chalk: '#FFFDF7',

        flash: '#FF4D0D', // electric orange
        punch: '#FF2E93', // hot pink
        acid: '#C8FF3D', // acid lime
        cobalt: '#1D4BFF', // cobalt blue
        grape: '#3B1270', // deep purple
        lilac: '#CBB8FF', // lavender
        blood: '#C1121F', // blood red
        neon: '#F5FF3D', // neon yellow
        forest: '#0C3B2E', // forest green
        clay: '#B8845A',
        smoke: '#8D8A82',

        /* legacy aliases — older components still reference these */
        bone: '#F4EFE6',
        gold: '#D9AE62',
        signal: '#FF3A21',
        steel: '#8E939B',
      },
      fontFamily: {
        sherif: ['"Instrument Serif"', 'Georgia', 'serif'],
        display: ['"Clash Display"', '"Syne"', 'Inter', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        cond: ['"Bebas Neue"', '"Space Grotesk"', 'Impact', 'sans-serif'],
        mono: ['"DM Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
        /* legacy aliases */
        sans: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      /* Tailwind has no /12 /15 /35 /45 /85 steps by default and, worse, it
         emits *nothing* for an unsupported step rather than erroring — so
         every step the source actually uses is declared explicitly here. */
      opacity: {
        6: '0.06',
        8: '0.08',
        12: '0.12',
        15: '0.15',
        16: '0.16',
        18: '0.18',
        35: '0.35',
        38: '0.38',
        45: '0.45',
        55: '0.55',
        58: '0.58',
        62: '0.62',
        65: '0.65',
        85: '0.85',
        88: '0.88',
      },
      letterSpacing: {
        tightest: '-0.06em',
        tighter2: '-0.04em',
        wider2: '0.22em',
        wider3: '0.38em',
      },
      transitionTimingFunction: { swift: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      keyframes: {
        'marquee-x': {
          '0%': { transform: 'translate3d(0,0,0)' },
          '100%': { transform: 'translate3d(-50%,0,0)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        bobble: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        flare: {
          '0%,100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.06)' },
        },
      },
      animation: {
        'marquee-x': 'marquee-x 28s linear infinite',
        'marquee-x-fast': 'marquee-x 14s linear infinite',
        'spin-slow': 'spinSlow 26s linear infinite',
        bobble: 'bobble 5s ease-in-out infinite',
        flare: 'flare 4.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
