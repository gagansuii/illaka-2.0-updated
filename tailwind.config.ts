import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0b0c10',
        pearl: '#f5f7fb',
        glass: 'rgba(255,255,255,0.08)',
        neon: '#7ef9ff',
        ember: '#ff6b35'
      },
      boxShadow: {
        glow: '0 0 30px rgba(126,249,255,0.25)'
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};

export default config;
