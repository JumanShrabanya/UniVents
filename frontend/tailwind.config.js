/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        indigo: "#00335E",
        lightBlue: "#BDE0FE",
        lightBlueHover: "#A5D5FF",
        indigoHover: "#002646",
      },
      fontFamily: {
        mainFont: ["Nunito", "sans-serif"],
      },
    },
  },
  plugins: [],
};
