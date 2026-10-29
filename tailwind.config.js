/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        insta: {
          gradient1: '#833ab4',
          gradient2: '#fd1d1d',
          gradient3: '#fcb045',
          bg: '#FAFAFA',
          darkBg: '#0A0A0A',
          cardDark: '#141414',
          borderDark: '#262626'
        },
        sheets: {
          header: '#5f6368',
          rowHover: '#f8f9fa',
          cellHighlight: '#e8f0fe',
          income: '#137333',
          expense: '#c5221f'
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace']
      }
    },
  },
  plugins: [],
}
