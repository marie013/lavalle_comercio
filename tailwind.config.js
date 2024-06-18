/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './**/*.{html, js, hbs}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
}

