/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F4F9',
          100: '#E1E8F2',
          200: '#B8C9E2',
          300: '#8FAACD',
          400: '#4E73A6',
          500: '#1E40AF',
          600: '#0F2C59',
          700: '#0B192C',
          800: '#07101E',
          900: '#030810',
        },
        crimson: {
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        neutral: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Source Sans 3', 'Noto Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(11, 25, 44, 0.05), 0 1px 2px 0 rgba(11, 25, 44, 0.03)',
        'card': '0 2px 4px -1px rgba(11, 25, 44, 0.06), 0 4px 6px -1px rgba(11, 25, 44, 0.04)',
      }
    },
  },
  plugins: [],
}
