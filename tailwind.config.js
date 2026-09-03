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
          950: '#0a0e1a',
          900: '#0f1220',
          800: '#15192a',
          700: '#1e2341',
          600: '#2a2f42',
          500: '#3a4156',
        },
        'text-secondary': '#9da3af',
        'text-tertiary': '#6b7280',
      },
      spacing: {
        'feed-gap': '2rem',
      },
      maxWidth: {
        'article': '55ch',
      },
      fontSize: {
        'display': ['2.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'heading-lg': ['1.875rem', { lineHeight: '1.2', fontWeight: '600' }],
        'heading-md': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-sm': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'article-title': ['1.75rem', { lineHeight: '1.3', fontWeight: '700' }],
      },
      borderColor: {
        'cti': '#2a2f42',
      }
    }
  },
  plugins: []
};
