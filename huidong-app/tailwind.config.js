/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef9ff',
          100: '#d8f0ff',
          200: '#b9e4ff',
          300: '#8cd3ff',
          400: '#57bcff',
          500: '#2ea3ff',
          600: '#1185ea',
          700: '#0b69c0',
          800: '#0e589b',
          900: '#104a80'
        }
      }
    }
  },
  plugins: []
}

