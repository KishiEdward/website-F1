/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        surface2: 'var(--surface-2)',
        line: 'var(--line)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        team: 'var(--team-color)',
        soft: '#FF3333',
        medium: '#FFD12E',
        hard: '#F0F0F0',
        inter: '#39B54A',
        wet: '#0067DB',
        sc: '#FFB020',
        red: '#FF2D2D',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 8px 32px rgba(0,0,0,0.45)',
        glow: '0 0 40px rgba(225,6,0,0.35)',
      },
    },
  },
  plugins: [],
};
