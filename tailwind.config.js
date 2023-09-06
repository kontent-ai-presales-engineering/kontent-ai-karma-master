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
        'sandbox-bgcolor': '#3dcca8',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

