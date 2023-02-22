// npm run dev
// npm run prod

const { src, dest, task, watch, series, parallel } = require("gulp");

// Загальні модулі
const del = require("del"); 
const browserSync = require("browser-sync").create();
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");

// HTML
const pug = require("gulp-pug");

// CSS
const sass = require("gulp-sass")(require("sass"));
const sassGlob = require("gulp-sass-glob");
const autoprefixerstyles = require("gulp-autoprefixer");
const cleancss = require("gulp-clean-css");

//////////////////////////////////////////////////////////////////////////////////////////

// Default

function clean() {
  console.log("\n\t", "Cleaning docs folder (docs/) for fresh start.\n");
  return del("./docs/");
}

function copyJs() {
	return src("./src/js/**/*").pipe(dest("./docs/js/"));
}

function copyImg() {
	return src("./src/img/**/*").pipe(dest("./docs/img/"));
}

function copyLibs() {
	return src("./src/libs/**/*").pipe(dest("./docs/libs/"));
}

function copyFonts() {
	return src("./src/fonts/**/*").pipe(dest("./docs/fonts/"));
}

//////////////////////////////////////////////////////////////////////////////////////////

// DEVELOPMENT

function devStyles() {
	return src("./src/sass/*.sass")
		.pipe(
			plumber({
				errorHandler: notify.onError(function (err) {
					return {
						title: " SASS ",
						sound: false,
						message: "\n" + err.message,
					};
				}),
			})
		)
		.pipe(sassGlob())
		.pipe(sass())
		.pipe(dest("./docs/css/"))
		.pipe(browserSync.stream());
}

function jade() {
	return src("./src/pug/gulp-pages/*.pug")
		.pipe(
			plumber({
				errorHandler: notify.onError(function (err) {
					return {
						title: " JADE ",
						sound: false,
						message: "\n" + err.message,
					};
				}),
			})
		)
		.pipe(pug())
		.pipe(dest("./docs/"));
}

function livePreview(done) {
	browserSync.init({
		server: {
			baseDir: "./docs/",
		},
		port: 9050 || 5000,
	});
	done();
}

function watchFiles() {
	watch("./src/img/**/*", series(copyImg, previewReload));
	watch("./src/js/**/*", series(copyJs, previewReload));
	watch("./src/libs/**/*", series(copyLibs, previewReload));
	watch("./src/sass/**/*.sass", devStyles);
	watch("./src/**/*.pug", series(jade, previewReload));

	console.log("\n\t", "Watching for Changes..\n");
}

function previewReload(done) {
	console.log("\n\t", "Reloading Browser Preview.\n");
	browserSync.reload();
	done();
}

//////////////////////////////////////////////////////////////////////////////////////////

// PRODUCTION-таски

function prodStyles() {
	return src("./src/sass/*.sass")
		.pipe(
			plumber({
				errorHandler: notify.onError(function (err) {
					return {
						title: "Styles",
						sound: false,
						message: err.message,
					};
				}),
			})
		)
		.pipe(sassGlob())
		.pipe(sass())
		.pipe(
			autoprefixerstyles({
				cascade: false,
			})
		)
		.pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
		.pipe(dest("./docs/css/"));
}

function jadeProd() {
	return src("./src/pug/gulp-pages/*.pug")
		.pipe(
			plumber({
				errorHandler: notify.onError(function (err) {
					return {
						title: " JADE ",
						sound: false,
						message: "\n" + err.message,
					};
				}),
			})
		)
		.pipe(pug({ pretty: true }))
		.pipe(dest("./docs/"));
}

//////////////////////////////////////////////////////////////////////////////////////////

exports.default = series(
	clean,
	copyJs,
	copyImg,
	copyLibs,
	copyFonts,
	parallel(devStyles, jade), //
	livePreview,
	watchFiles
);

exports.prod = series(
	clean,
	copyJs,
	copyImg,
	copyFonts,
	copyLibs,
	parallel(jadeProd, prodStyles) //
);
