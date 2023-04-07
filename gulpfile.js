import gulp from "gulp";
import { deleteAsync } from "del";
import browserSync from "browser-sync";
import notify from "gulp-notify";
import plumber from "gulp-plumber";
import pug from "gulp-pug";
import dartSass from "sass";
import gulpSass from "gulp-sass";
const sass = gulpSass(dartSass);
import sassGlob from "gulp-sass-glob";
import autoprefixerstyles from "gulp-autoprefixer";
import cleancss from "gulp-clean-css";

// Default tasks

function clean() {
	console.log("\n\t", "Cleaning docs folder (docs/) for fresh start.\n");
	return deleteAsync("./docs/");
}

function copyJs() {
	return gulp.src("./src/js/**/*").pipe(gulp.dest("./docs/js/"));
}

function copyImg() {
	return gulp.src("./src/img/**/*").pipe(gulp.dest("./docs/img/"));
}

function copyLibs() {
	return gulp.src("./src/libs/**/*").pipe(gulp.dest("./docs/libs/"));
}

function copyFonts() {
	return gulp.src("./src/fonts/**/*").pipe(gulp.dest("./docs/fonts/"));
}

//////////////////////////////////////////////////////////////////////////////////////////

// DEVELOPMENT tasks

function devStyles() {
	return gulp
		.src("./src/sass/*.sass")
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
		.pipe(gulp.dest("./docs/css/"))
		.pipe(browserSync.stream());
}

function jade() {
	return gulp
		.src("./src/pug/gulp-pages/*.pug")
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
		.pipe(gulp.dest("./docs/"));
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
	gulp.watch("./src/img/**/*", gulp.series(copyImg, previewReload));
	gulp.watch("./src/js/**/*", gulp.series(copyJs, previewReload));
	gulp.watch("./src/libs/**/*", gulp.series(copyLibs, previewReload));
	gulp.watch("./src/sass/**/*.sass", devStyles);
	gulp.watch("./src/sass/tailwind/*.scss", previewReload);
	gulp.watch("./src/**/*.pug", gulp.series(jade, previewReload));

	console.log("\n\t", "Watching for Changes..\n");
}

function previewReload(done) {
	console.log("\n\t", "Reloading Browser Preview.\n");
	browserSync.reload();
	done();
}

// PRODUCTION tasks

function prodStyles() {
	return gulp
		.src("./src/sass/*.sass")
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
		.pipe(gulp.dest("./docs/css/"));
}

function jadeProd() {
	return gulp
		.src("./src/pug/gulp-pages/*.pug")
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
		.pipe(gulp.dest("./docs/"));
}

export const dev = gulp.series(
	copyJs,
	copyImg,
	copyLibs,
	copyFonts,
	gulp.parallel(devStyles, jade), //
	livePreview,
	watchFiles
);

export const prod = gulp.series(
	clean,
	copyJs,
	copyImg,
	copyFonts,
	copyLibs,
	gulp.parallel(jadeProd, prodStyles) //
);
