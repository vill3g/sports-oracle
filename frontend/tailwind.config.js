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
        dk: {
          bg: '#0a0d14',
          card: '#131824',
          cardHover: '#1a2234',
          border: '#20293d',
          green: '#00e700',
          greenHover: '#00c700',
          greenMuted: 'rgba(0, 231, 0, 0.12)',
          accent: '#10b981',
          gold: '#f59e0b',
          goldMuted: 'rgba(245, 158, 11, 0.15)',
          blue: '#3b82f6',
          purple: '#8b5cf6',
          red: '#ef4444'
        }
      }
    },
  },
  plugins: [],
}
