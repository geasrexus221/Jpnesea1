/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans JP"', 'system-ui', 'sans-serif'],
        japanese: ['"Klee One"', '"Noto Sans JP"', 'sans-serif'],
      },
      colors: {
        japan: {
          crimson: '#C9171E',
          vermilion: '#E83929',
          sakura: '#FEDFE1',
          indigo: '#1E2B37',
          paper: '#FDFBF7',
          card: '#FFFFFF',
          ink: '#181B1F',
          gold: '#D49E24',
          subtle: '#8C939D'
        }
      }
    },
  },
  plugins: [],
}
