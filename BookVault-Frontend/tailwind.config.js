/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        slate: {
          850: "#151F32",
        },
        emerald: {
          950: "#022c22",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "-apple-system", "sans-serif"],
        heading: ["Outfit", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
