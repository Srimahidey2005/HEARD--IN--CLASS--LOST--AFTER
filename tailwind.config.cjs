/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#0B1020',
        deep: '#171F35',
        'deep-dark': '#0f1629',
        'deep-card': '#131b31',
        violet: {
          electric: '#8B5CF6',
          glow: '#A78BFA',
          deep: '#6D28D9'
        },
        lime: {
          cyber: '#C6FF4D',
          glow: '#D9FF73'
        },
        cyan: {
          neon: '#22D3EE',
          glow: '#67E8F9'
        },
        cloud: '#F4F5FA',
        muted: '#94A3B8'
      },
      fontFamily: {
        heading: ['var(--font-space-grotesk)', 'Space Grotesk', 'sans-serif'],
        sans: ['var(--font-inter)', 'Inter', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(139, 92, 246, 0.4)',
        'glow-cyan': '0 0 25px -5px rgba(34, 211, 238, 0.4)',
        'glow-lime': '0 0 25px -5px rgba(198, 255, 77, 0.35)',
        card: '0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.05)'
      }
    }
  },
  plugins: []
};
