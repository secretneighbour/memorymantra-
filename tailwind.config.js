/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ner: {
          offwhite: '#F4F4F0',
          black: '#111111',
          charcoal: '#1E1E1E',
          surface: '#242424',
          subtle: '#DADADA',
          border: '#E2E2DC',
          darkborder: '#2C2C2C',
          terracotta: '#DE4A30',
          terracottaDark: '#C43B23',
          warmAmber: '#E67E22',
          sage: '#10B981',
          calmBlue: '#3B82F6'
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        widest: '0.15em',
      }
    },
  },
  plugins: [],
}
