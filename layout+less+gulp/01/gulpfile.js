const gulp = require('gulp')
const del = require('del')
const browserSync = require('browser-sync').create() //обнов. страницу, при измен.
const less = require('gulp-less');
const gulpIf = require('gulp-if')
const cleanCSS = require('gulp-clean-css') // убирает лишние пробелы, табы и т.д.
const autoprefixer = require('gulp-autoprefixer')
const gcmq = require('gulp-group-css-media-queries'); // объединяет медиа запросы
const sourcemaps = require('gulp-sourcemaps') // карта по css

// можно в package.json прописать в scripts укороч. запуск
let isMinify = process.argv.includes('--mini') // forRelizBuild
let isMapForCss = process.argv.includes('--map') // forDevelop

function clean() {
	return del('./build/*')
}

function html() {
	return gulp.src('./src/**/*.html') // из
		.pipe(gulp.dest('./build')) // в (dest - destination - назначение)
		.pipe(browserSync.stream())
}

function styles() {
	return gulp.src('./src/css/main.less')
		.pipe(gulpIf(isMapForCss, sourcemaps.init()))
		.pipe(less())
		.pipe(gulpIf(isMinify, gcmq()))
		.pipe(gulpIf(isMinify, autoprefixer({})))
		.pipe(gulpIf(isMinify, cleanCSS({ level: 1 })))
		.pipe(gulpIf(isMapForCss, sourcemaps.write()))
		.pipe(gulp.dest('./build/css'))
		.pipe(browserSync.stream())
}

function images() {
	return gulp.src('./src/img/**/*')
		.pipe(gulp.dest('./build/img'))
}

function watch() {
	browserSync.init({
		server: {
			baseDir: './build/'
		}
	})
	gulp.watch('./src/css/**/*.less', styles)
	gulp.watch('./src/**/*.html', html)
}


// gulp.series - выполняет таски по очереди (завершится один, перейдет к другому)
// gulp.parallel - выполняет одновременно (нач. и заверш. в любой последовательности)
let build = gulp.parallel(html, styles, images)
let buildWithClean = gulp.series(clean, build)

let watchDev = gulp.series(buildWithClean, watch)

gulp.task('build', buildWithClean)
gulp.task('dev', watchDev)
