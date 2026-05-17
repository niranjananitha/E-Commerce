/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5",    // Modern Indigo
        secondary: "#10b981",  // Fresh Emerald
        accent: "#f59e0b",     // Vibrant Amber
        background: "#f8fafc", // Slate 50
        surface: "#ffffff",    // White
        freshtext: "#0f172a", // Slate 900
        freshmuted: "#64748b", // Slate 500
      },
      fontFamily: {
        sans: ['"Outfit"', '"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
