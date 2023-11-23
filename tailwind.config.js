/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        manufacturing: {
          light: '#E93728',
          DEFAULT: '#E51616',
          dark: '#B90000',
        },
        kontentai: '#3dcca8',
        elitebuild: '#0078d2',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
