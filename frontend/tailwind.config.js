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
        f1: {
          dark: '#070709',
          card: 'rgba(18, 18, 24, 0.75)',
          red: '#E10600',
          cyan: '#00F0FF',
          gold: '#FFB800',
          green: '#00E676',
          purple: '#9D00FF',
          border: 'rgba(255, 255, 255, 0.08)',
          accent: '#FF1E27',
          carbon: '#0c0d12',
          titanium: '#1a1b23'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Rajdhani', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(225, 6, 0, 0.4)' },
          '100%': { boxShadow: '0 0 20px rgba(225, 6, 0, 0.9), 0 0 30px rgba(0, 240, 255, 0.4)' }
        }
      }
    },
  },
  plugins: [],
}
