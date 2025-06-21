/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7f7',
          100: '#cceeee',
          200: '#99dede',
          300: '#66cdcd',
          400: '#33bbbb',
          500: '#009999',
          600: '#007a7a',
          700: '#005c5c',
          800: '#003d3d',
          900: '#001f1f',
        },
        accent: {
          50: '#e6f2f2',
          100: '#cce6e6',
          200: '#99cccc',
          300: '#66b3b3',
          400: '#339999',
          500: '#006666',
          600: '#005252',
          700: '#003d3d',
          800: '#002929',
          900: '#001414',
        },
        background: '#FFFFFF',
        secondary: '#F0F0F0',
      },
      fontFamily: {
        'sans': ['ui-sans-serif', 'system-ui', 'sans-serif', 'Hiragino Sans', 'Yu Gothic', 'Meiryo', 'Takao', 'IPAexfont', 'IPAPGothic', 'VL PGothic', 'Noto Sans CJK JP'],
      },
    },
  },
  plugins: [],
};