export default {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': 'postcss-nesting', // Add this line
    tailwindcss: {},
    autoprefixer: {},
  },
}