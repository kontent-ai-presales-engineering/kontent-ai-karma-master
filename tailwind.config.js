/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sandbox': '#3dcca8',
        'elysium': '#D7C796',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

