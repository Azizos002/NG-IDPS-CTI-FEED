/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{ts,tsx,js,jsx,mdx}',
    './app/**/*.{ts,tsx,js,jsx,mdx}',
    './src/app/**/*.{ts,tsx,js,jsx,mdx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cti: {
          900: '#071024',
          800: '#0b1320',
          700: '#0f1724'
        }
      }
    }
  },
  plugins: []
};
