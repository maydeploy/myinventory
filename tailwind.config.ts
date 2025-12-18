import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Minimal ASCII aesthetic
        'paper': {
          DEFAULT: '#F5F5F0',       // Cream paper
          dark: '#E8E8E0',          // Slightly darker
        },
        'ink': {
          DEFAULT: '#2B2B2B',       // Dark gray ink
          light: '#5A5A5A',         // Medium gray
          lighter: '#8B8B8B',       // Light gray
        },
        'accent': {
          DEFAULT: '#4A5568',       // Muted blue-gray
          light: '#718096',         // Lighter blue-gray
          dark: '#2D3748',          // Darker blue-gray
        },
        'border': {
          DEFAULT: '#CBD5E0',       // Subtle border
          dark: '#A0AEC0',          // Darker border
        },
      },
      fontFamily: {
        mono: ['Space Mono', 'Courier New', 'monospace'],
        // Uses `next/font/local` variable from `app/layout.tsx`
        // This resolves at runtime to the generated family (e.g. `__ppNeueBit_Fallback_...`)
        display: ['var(--font-pp-neue-bit)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
      animation: {
        'glitch': 'glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite',
        'scanline': 'scanline 8s linear infinite',
        'flicker': 'flicker 2s linear infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}

export default config
