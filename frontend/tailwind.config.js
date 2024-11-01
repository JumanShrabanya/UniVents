/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        superLightBlue: "#EBF5F7",
        indigo: "#00335E",
        yellow: "#FFE4BF",
        lightBlue: "#BDE0FE",
        lightBlueHover: "#A5D5FF",
        indigoHover: "#002646",
        footer: "#EBF5F7",
      },
      fontFamily: {
        mainFont: ["Nunito", "sans-serif"],
      },
    },
  },
  plugins: [],
};
