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
          light: '#FF4636',
          DEFAULT: '#E93728',
          dark: '#C41506',
        },
        kontentai: '#3dcca8',
        elitebuild: '#0078d2',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
