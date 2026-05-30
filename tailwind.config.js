/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: '#FAF5FF',
        ink: '#312244',
        primary: '#A78BFA',
        accent: '#7DD3FC',
        highlight: '#FBCFE8',
        mist: '#C4F1D9',
        cream: '#FFF8E7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
