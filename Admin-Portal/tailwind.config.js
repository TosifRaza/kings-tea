/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tea-green': '#1F4D3A',
        'warm-ivory': '#F8F3E9',
        'royal-terracotta': '#A65A3A',
        'imperial-gold': '#C9A86A',
        'deep-walnut': '#3A281C',
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'inter': ['Inter', 'sans-serif'],
        'cormorant': ['Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [],
}