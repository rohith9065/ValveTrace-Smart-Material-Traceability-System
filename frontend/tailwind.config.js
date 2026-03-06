/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#000000',
          card: '#ffffff',
          sidebar: '#000000',
          border: '#e5e5e5',
        },
        accent: {
          yellow: '#facc15',
          green: '#22c55e',
          grey: '#737373',
          dark: '#171717',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
