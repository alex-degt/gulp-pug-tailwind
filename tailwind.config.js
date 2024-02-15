import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: JSON.parse(process.env.TAILWIND_CONTENT_PATH),
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
