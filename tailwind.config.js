export default {
  content: [
    "./index.html",
    "./devtools.html",
    "./panel.html",
    "./popup.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        devtools: {
          bg: '#1e1e1e',
          panel: '#252526',
          border: '#3e3e42',
          text: '#cccccc',
          accent: '#007acc',
        }
      }
    },
  },
  plugins: [],
}