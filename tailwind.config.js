/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#080807',
        bone: '#F4EFE6',
        gold: { DEFAULT: '#D9AE62', soft: '#EFD7A6', deep: '#8A6A2F' },
        signal: '#FF3A21',
        steel: '#8E939B',
      },
      fontFamily: {
        sans: ['"Inter Tight"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        cond: ['"Bebas Neue"', '"Inter Tight"', 'Impact', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      opacity: {
        6: "0.06",
        8: "0.08",
        12: "0.12",
        16: "0.16",
        18: "0.18",
        38: "0.38",
        58: "0.58",
        62: "0.62",
        65: "0.65",
        85: "0.85",
        88: "0.88",
      },
      letterSpacing: { tightest: '-0.055em', wider2: '0.22em', wider3: '0.38em' },
      transitionTimingFunction: { swift: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    },
  },
  plugins: [],
}
