/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark:    '#0a0e1a',
        panel:   '#111827',
        navy:    '#1a2235',
        gold:    '#ffd700',
        teal:    '#00e5a0',
        danger:  '#ff6b6b',
        dim:     '#2d3748',
        accent:  '#7c3aed',
        cyber:   '#00f0ff',
        ember:   '#ff6b35',
        frost:   '#38bdf8',
      },
      fontFamily: {
        quest:   ['"Cinzel Decorative"', 'cursive'],
        body:    ['Nunito', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
      },
      animation: {
        twinkle:   'twinkle 2s ease-in-out infinite alternate',
        float:     'float 3s ease-in-out infinite',
        fadeInUp:  'fadeInUp 0.5s ease forwards',
        scaleIn:   'scaleIn 0.4s ease forwards',
        slideDown: 'slideDown 0.3s ease forwards',
        glow:      'glow 2s ease-in-out infinite alternate',
        spin3d:    'spin3d 1s ease forwards',
        wiggle:    'wiggle 0.3s ease-in-out',
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
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%':   { boxShadow: '0 0 5px rgba(255,215,0,0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(255,215,0,0.4), 0 0 40px rgba(255,215,0,0.1)' },
        },
        spin3d: {
          '0%':   { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%':      { transform: 'rotate(-3deg)' },
          '75%':      { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: [],
}