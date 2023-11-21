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
        manufacturing: {
          light: '#007ABA',
          DEFAULT: '#007ABA',
          dark: '#007ABA',
        },
        kontentai: '#3dcca8',
        elitebuild: '#0078d2',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
