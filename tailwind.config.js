/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["src/**/*.{pug, js}"],
  theme: {
    screens: {
      // tab: "768px",
      // lap: "1024px",
      // desk: "1280px",
    },
    extend: {
      colors: {
        // "primary-100": "#fbcece",
        // "primary-200": "#f79e9e",
        // "primary-300": "#f26d6d",
        // "primary-400": "#ee3d3d",
        // "primary-500": "#ea0c0c",
        // "primary-600": "#bb0a0a",
      },
    },
  },
  corePlugins: {
    container: false,
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
