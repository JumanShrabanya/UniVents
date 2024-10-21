/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        indigo: "#00335E",
        lightBlue: "#BDE0FE",
      },
      fontFamily: {
        mainFont: ["Nunito", "sans-serif"],
      },
    },
  },
  plugins: [],
};
