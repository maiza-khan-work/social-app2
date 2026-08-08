/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563EB', // Modern Blue — primary
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#1e3270',
        },
        accent: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#7C3AED', // Vibrant Purple — accent
          600: '#6d28d9',
          700: '#5b21b6',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          400: '#fbbf24',
          500: '#F59E0B', // Warm Amber — highlight
          600: '#d97706',
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10B981', // Emerald — success
          600: '#059669',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.05)',
        'card-hover': '0 4px 12px rgba(15,23,42,0.08), 0 16px 40px rgba(37,99,235,0.12)',
        elevated: '0 2px 8px rgba(15,23,42,0.06), 0 24px 48px -12px rgba(15,23,42,0.14)',
        popover: '0 8px 24px rgba(15,23,42,0.10), 0 2px 6px rgba(15,23,42,0.06)',
        glow: '0 0 0 3px rgba(37,99,235,0.18)',
        'glow-violet': '0 0 0 3px rgba(124,58,237,0.18)',
        'inner-line': 'inset 0 0 0 1px rgba(15,23,42,0.06)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
        'amber-gradient': 'linear-gradient(135deg, #F59E0B 0%, #ef4444 100%)',
        'surface-gradient': 'linear-gradient(180deg, #F0F4FF 0%, #F8FAFC 100%)',
        'mesh-gradient':
          'radial-gradient(at 15% 0%, rgba(37,99,235,0.16) 0px, transparent 55%), radial-gradient(at 85% 0%, rgba(124,58,237,0.14) 0px, transparent 55%), radial-gradient(at 50% 100%, rgba(245,158,11,0.10) 0px, transparent 55%)',
        shimmer: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16,1,0.3,1)',
        'scale-in': 'scaleIn 0.18s cubic-bezier(0.16,1,0.3,1)',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        shimmer: 'shimmer 1.8s ease-in-out infinite',
        float: 'float 5s ease-in-out infinite',
        'pop-in': 'popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        popIn: {
          from: { opacity: '0', transform: 'scale(0.85)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};