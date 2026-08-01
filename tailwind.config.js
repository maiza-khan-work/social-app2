/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dbe8ff',
          200: '#b8d1ff',
          300: '#8bb3ff',
          400: '#5b8def',
          500: '#3866d4', // primary Facebook-esque blue
          600: '#2a52b8',
          700: '#213f90',
          800: '#1c3372',
          900: '#182b5e',
        },
        accent: {
          500: '#42b72a', // FB-style green for publish/success
          600: '#36a420',
        },
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};
