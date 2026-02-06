/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        facebook: {
          blue: '#1877F2',
          darkBlue: '#166FE5',
          green: '#42B72A',
          gray: '#E4E6EB',
          darkGray: '#65676B',
        }
      },
    },
  },
  plugins: [],
}
