/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Rubik', 'sans-serif'],
        rubik: ['Rubik', 'sans-serif'],
      },
      colors: {
        primary: '#e96020',
        tielo: {
          navy: '#0b2027',
          orange: '#e96020',
          steel: '#40798c',
          teal: '#70a9a1',
          cream: '#f6f1d1',
          offwhite: '#f7f7f7',
          sage: '#cfd7c7',
          black: '#000000',
        },
        green: {
          dark: '#40798C',
          light: '#70a9a1',
          tan: '#cfd7c7',
        },
        yellow: '#f6f1d1',
        offWhite: '#f7f7f7',
      },
      boxShadow: {
        sharp: '4px 4px 0px 0px rgba(11, 32, 39, 0.08)',
        'sharp-hover': '6px 6px 0px 0px rgba(233, 96, 32, 0.20)',
        'inner-sharp': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        td: '6px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};