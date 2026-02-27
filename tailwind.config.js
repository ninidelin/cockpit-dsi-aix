/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        aix: {
          rouge: '#E22019',
          or: '#CBA930',
          bleu: '#3D87E5',
          noir: '#1A1A1A',
        }
      }
    }
  },
  plugins: []
}
