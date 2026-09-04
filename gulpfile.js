import { readFile, writeFile } from "node:fs/promises";
import gulp from "gulp";
import { deleteAsync } from "del";
import browserSync from "browser-sync";
import notify from "gulp-notify";
import plumber from "gulp-plumber";
import pug from "gulp-pug";
import dartSass from "sass";
import gulpSass from "gulp-sass";
import sassGlob from "gulp-sass-glob";
import postcss from "gulp-postcss";
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import prettier from "prettier";
import htmlhint from "htmlhint";
import "dotenv/config";

const sass = gulpSass(dartSass);
const { HTMLHint } = htmlhint;

const SRC = process.env.INPUT_FOLDER;
const SRC_SASS = process.env.INPUT_SASS_FOLDER;
const SRC_TAILWIND = process.env.INPUT_TAILWIND_FILE;
const DIST = process.env.OUTPUT_FOLDER;
const DIST_CSS = process.env.OUTPUT_CSS_FOLDER;

// `true` під час `gulp prod`: вмикає мініфікацію і вимикає sourcemaps
let isProd = false;

// Однаковий обробник помилок для всіх задач:
// показує системне сповіщення і не дає watch впасти
const onError = (title) =>
	plumber({
		errorHandler: notify.onError((err) => ({
			title,
			sound: false,
			message: "\n" + err.message,
		})),
	});

// Копіювання файлів "як є" (encoding: false — щоб не зіпсувати бінарники)
const copy = (folder) => {
	const task = () => gulp.src(`${SRC}${folder}/**/*`, { encoding: false }).pipe(gulp.dest(`${DIST}${folder}/`));
	task.displayName = `copy:${folder}`;
	return task;
};

const copyAssets = gulp.parallel(copy("js"), copy("img"), copy("libs"), copy("fonts"));

function clean() {
	console.log("\n\t", `Cleaning output folder (${DIST}) for fresh start.\n`);
	return deleteAsync(DIST);
}

// Sass -> CSS (по файлу на сторінку: all-pages.css, home.css, ...)
function styles() {
	return gulp
		.src(`${SRC_SASS}*.sass`, { sourcemaps: !isProd })
		.pipe(onError(" SASS "))
		.pipe(sassGlob())
		.pipe(sass())
		.pipe(postcss(isProd ? [autoprefixer(), cssnano()] : [autoprefixer()]))
		.pipe(gulp.dest(DIST_CSS, { sourcemaps: isProd ? false : "." }))
		.pipe(browserSync.stream());
}

// Tailwind: сканує src/pug + src/js (див. @source у tailwind.css)
function tailwind() {
	return gulp
		.src(SRC_TAILWIND)
		.pipe(onError(" TAILWIND "))
		.pipe(postcss(isProd ? [tailwindcss(), autoprefixer(), cssnano()] : [tailwindcss()]))
		.pipe(gulp.dest(DIST_CSS))
		.pipe(browserSync.stream());
}

// Pug -> HTML (у dev залишаємо pretty, у prod форматує prettier)
function html() {
	return gulp
		.src(`${SRC}pug/gulp-pages/*.pug`)
		.pipe(onError(" PUG "))
		.pipe(pug({ pretty: !isProd }))
		.pipe(gulp.dest(DIST));
}

// Форматування зібраного HTML за правилами з .prettierrc
async function formatHtml() {
	const files = await Array.fromAsync(gulp.src(`${DIST}**/*.html`, { read: false }));
	const config = await prettier.resolveConfig(`${DIST}index.html`);

	for (const file of files) {
		const source = await readFile(file.path, "utf8");
		await writeFile(file.path, await prettier.format(source, { ...config, filepath: file.path }));
	}

	console.log("\n\t", `Formatted ${files.length} html file(s).\n`);
}

// Перевірка зібраного HTML
async function lintHtml() {
	const files = await Array.fromAsync(gulp.src(`${DIST}**/*.html`, { read: false }));
	let errors = 0;

	for (const file of files) {
		const messages = HTMLHint.verify(await readFile(file.path, "utf8"), HTMLHint.defaultRuleset);
		for (const { line, col, message } of messages) {
			console.log(`\t${file.path}:${line}:${col}  ${message}`);
			errors++;
		}
	}

	console.log("\n\t", `Scanned ${files.length} html file(s), ${errors} error(s) found.\n`);
	if (errors) throw new Error(`htmlhint: ${errors} error(s)`);
}

function livePreview(done) {
	browserSync.init({
		server: { baseDir: DIST },
		port: Number(process.env.PORT) || 9050,
		notify: false,
	});
	done();
}

function previewReload(done) {
	browserSync.reload();
	done();
}

function watchFiles() {
	gulp.watch(`${SRC}img/**/*`, gulp.series(copy("img"), previewReload));
	gulp.watch(`${SRC}js/**/*`, gulp.series(copy("js"), previewReload));
	gulp.watch(`${SRC}libs/**/*`, gulp.series(copy("libs"), previewReload));
	gulp.watch(`${SRC}fonts/**/*`, gulp.series(copy("fonts"), previewReload));
	gulp.watch(`${SRC_SASS}**/*.sass`, styles);
	gulp.watch(SRC_TAILWIND, tailwind);
	// Нові tailwind-класи у розмітці/скриптах теж мають потрапити у tailwind.css
	gulp.watch(`${SRC}pug/**/*.pug`, gulp.series(html, tailwind, previewReload));
	gulp.watch(`${SRC}js/**/*.js`, tailwind);

	console.log("\n\t", "Watching for Changes..\n");
}

function setProd(done) {
	isProd = true;
	done();
}

export const dev = gulp.series(copyAssets, gulp.parallel(styles, html), tailwind, livePreview, watchFiles);

export const prod = gulp.series(setProd, clean, copyAssets, gulp.parallel(styles, html), tailwind, formatHtml, lintHtml);

export default dev;
