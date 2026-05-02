/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark:   '#0a0e1a',
        panel:  '#111827',
        navy:   '#1a2235',
        gold:   '#ffd700',
        teal:   '#00e5a0',
        danger: '#ff6b6b',
        dim:    '#2d3748',
      },
      fontFamily: {
        quest: ['"Cinzel Decorative"', 'cursive'],
        body:  ['Nunito', 'sans-serif'],
      },
      animation: {
        twinkle:  'twinkle 2s ease-in-out infinite alternate',
        float:    'float 3s ease-in-out infinite',
        fadeInUp: 'fadeInUp 0.5s ease forwards',
        scaleIn:  'scaleIn 0.4s ease forwards',
      },
      keyframes: {
        twinkle: {
          '0%':   { opacity: '0.15', transform: 'scale(0.8)' },
          '100%': { opacity: '1',    transform: 'scale(1.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.85)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}