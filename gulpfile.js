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
import "dotenv/config";

// Default tasks
function clean() {
	console.log("\n\t", "Cleaning docs folder (docs/) for fresh start.\n");
	return deleteAsync(`${process.env.OUTPUT_FOLDER}`);
}

function copyJs() {
	return gulp.src(`${process.env.INPUT_FOLDER}js/**/*`, { encoding: false }).pipe(gulp.dest(`${process.env.OUTPUT_FOLDER}js/`));
}

function copyImg() {
	return gulp.src(`${process.env.INPUT_FOLDER}img/**/*`, { encoding: false }).pipe(gulp.dest(`${process.env.OUTPUT_FOLDER}img/`));
}

function copyLibs() {
	return gulp.src(`${process.env.INPUT_FOLDER}libs/**/*`, { encoding: false }).pipe(gulp.dest(`${process.env.OUTPUT_FOLDER}libs/`));
}

function copyFonts() {
	return gulp.src(`${process.env.INPUT_FOLDER}fonts/**/*`, { encoding: false }).pipe(gulp.dest(`${process.env.OUTPUT_FOLDER}fonts/`));
}

//////////////////////////////////////////////////////////////////////////////////////////

// DEVELOPMENT tasks

function devStyles() {
	return gulp
		.src(`${process.env.INPUT_SASS_FOLDER}/*.sass`, { encoding: false })
		.pipe(
			plumber({
				errorHandler: notify.onError(function (err) {
					return {
						title: " SASS ",
						sound: false,
						message: "\n" + err.message,
					};
				}),
			}),
		)
		.pipe(sassGlob())
		.pipe(sass())
		.pipe(gulp.dest(`${process.env.OUTPUT_CSS_FOLDER}`))
		.pipe(browserSync.stream());
}

function jade() {
	return gulp
		.src(`${process.env.INPUT_FOLDER}pug/gulp-pages/*.pug`, { encoding: false })
		.pipe(
			plumber({
				errorHandler: notify.onError(function (err) {
					return {
						title: " JADE ",
						sound: false,
						message: "\n" + err.message,
					};
				}),
			}),
		)
		.pipe(pug())
		.pipe(gulp.dest(`${process.env.OUTPUT_FOLDER}`));
}

function livePreview(done) {
	browserSync.init({
		server: {
			baseDir: `${process.env.OUTPUT_FOLDER}`,
		},
		port: 9050 || 5000,
	});
	done();
}

function watchFiles() {
	gulp.watch(`${process.env.INPUT_FOLDER}img/**/*`, gulp.series(copyImg, previewReload));
	gulp.watch(`${process.env.INPUT_FOLDER}js/**/*`, gulp.series(copyJs, previewReload));
	gulp.watch(`${process.env.INPUT_FOLDER}libs/**/*`, gulp.series(copyLibs, previewReload));
	gulp.watch(`${process.env.INPUT_SASS_FOLDER}**/*.sass`, devStyles);
	gulp.watch(`${process.env.INPUT_TAILWIND_FILE}`, previewReload);
	gulp.watch(`${process.env.INPUT_FOLDER}**/*.pug`, gulp.series(jade, previewReload));

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
		.src(`${process.env.INPUT_SASS_FOLDER}*.sass`, { encoding: false })
		.pipe(
			plumber({
				errorHandler: notify.onError(function (err) {
					return {
						title: "Styles",
						sound: false,
						message: err.message,
					};
				}),
			}),
		)
		.pipe(sassGlob())
		.pipe(sass())
		.pipe(gulp.dest(`${process.env.OUTPUT_CSS_FOLDER}`));
}

function jadeProd() {
	return gulp
		.src(`${process.env.INPUT_FOLDER}pug/gulp-pages/*.pug`, { encoding: false })
		.pipe(
			plumber({
				errorHandler: notify.onError(function (err) {
					return {
						title: " JADE ",
						sound: false,
						message: "\n" + err.message,
					};
				}),
			}),
		)
		.pipe(pug({ pretty: true }))
		.pipe(gulp.dest(`${process.env.OUTPUT_FOLDER}`));
}

export const dev = gulp.series(
	copyJs,
	copyImg,
	copyLibs,
	copyFonts,
	gulp.parallel(devStyles, jade), //
	livePreview,
	watchFiles,
);

export const prod = gulp.series(
	clean,
	copyJs,
	copyImg,
	copyFonts,
	copyLibs,
	gulp.parallel(jadeProd, prodStyles), //
);
