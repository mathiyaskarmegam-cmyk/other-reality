/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sanctuary: {
          50: '#FAF8F5',
          100: '#F5F2EB',
          200: '#EBE7DE',
          300: '#DDD8CD',
          400: '#B8B2A4',
          500: '#8C8577',
          600: '#686256',
          700: '#4D483F',
          800: '#2E2B25',
          900: '#1A1815',
          card: '#FFFFFF',
          border: '#E8E5DF',
          muted: '#7A756D',
          dark: '#181716',
        }
      },
      fontFamily: {
        serif: ['Newsreader', 'Playfair Display', 'Merriweather', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.02), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 4px 20px -2px rgba(28, 25, 23, 0.03), 0 2px 6px -1px rgba(28, 25, 23, 0.02)',
        'float': '0 10px 30px -4px rgba(28, 25, 23, 0.06), 0 4px 10px -2px rgba(28, 25, 23, 0.03)',
      }
    },
  },
  plugins: [],
}

