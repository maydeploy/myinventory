import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          DEFAULT: '#F5F5DC',
          light: '#FAFAF0',
        },
        orange: {
          DEFAULT: '#FF8C42',
          light: 'rgba(255, 140, 66, 0.2)',
        },
        gray: {
          dark: '#2C2C2C',
          medium: '#6B6B6B',
          light: '#E8E8E8',
        },
        tan: '#D4A574',
      },
      fontFamily: {
        mono: ['Space Mono', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
