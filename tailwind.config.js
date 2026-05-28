/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        bedzy: {
          navy: '#202a44',
          dark: '#1e1e1e',
          light: '#f8f8f8',
          green: '#25D366',
        }
      }
    },
  },
  plugins: [],
}
