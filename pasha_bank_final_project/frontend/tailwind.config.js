/** @type {import("tailwindcss").Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pasha: {
          red: "#E21937",
          green: "#008165",
          // Add other potential brand colors or neutrals if needed
          // Example:
          // gold: "#F7A800", // Example secondary color
          // gray: {
          //   light: "#f8f9fa",
          //   DEFAULT: "#6c757d",
          //   dark: "#343a40",
          // }
        }
      },
      fontFamily: {
        // Define custom fonts if needed, align with PashaBank branding if possible
        // sans: ["YourFontName", "sans-serif"],
      }
    },
  },
  plugins: [],
}
