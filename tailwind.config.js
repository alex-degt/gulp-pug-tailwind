/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["src/js/**/*.js", "src/pug/**/*.pug"],
	theme: {
		// screens: {
		// 	sm: "640px",
		// 	md: "768px",
		// 	lg: "1024px",
		// 	xl: "1280px",
		// 	"2xl": "1536px",
		// },
		// extend: {
		//   colors: {
		//     "primary-100": "#fbcece",
		//   },
		// },
	},
	corePlugins: {
		aspectRatio: false,
	},
	plugins: [require("@tailwindcss/aspect-ratio"), require("@tailwindcss/typography")],
};
