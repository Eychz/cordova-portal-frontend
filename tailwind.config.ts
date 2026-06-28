import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class', // Enable dark mode with class strategy
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        red: {
          50: '#EFF3FF',
          100: '#DDE6FF',
          200: '#BCCBFF',
          300: '#8CA6FF',
          400: '#5277FF',
          500: '#1A43FF',
          600: '#0036C5',
          700: '#002BB0',
          800: '#002087',
          900: '#001353',
          950: '#00092B',
        },
        crimson: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        primary: {
          red: '#0036C5',
          black: '#000000',
          white: '#FFFFFF',
        },
        accent: {
          gray: '#F5F5F5',
        },
      },
    },
  },
  plugins: [],
}
export default config