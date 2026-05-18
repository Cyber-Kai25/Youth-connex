import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: 'var(--font-inter)',
        heading: 'var(--font-montserrat)',
      },
      colors: {
        'youth-green': '#1B5E5E',
        'youth-gold': '#F0D861',
        'youth-light': '#F5F5F5',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
