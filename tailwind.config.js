/** @type {import('tailwindcss').Config} */
const safelist = ['ml-2', 'ml-4', 'ml-6', 'ml-8', 'text-amber-600']
module.exports = {
  safelist,
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}