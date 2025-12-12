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
        primary: {
          red: '#D1001F',
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