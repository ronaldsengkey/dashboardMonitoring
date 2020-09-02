const gulp = require('gulp');
const postcss = require('gulp-postcss');
const precss = require('precss');
const postcssAutomath = require('postcss-automath');
const cssNano = require('cssnano');
const mqpacker = require('css-mqpacker'); // untuk group media query
const sortCSSmq = require('sort-css-media-queries'); // untuk sort media query
const autoprefixer = require('autoprefixer');
const notify = require('gulp-notify');
const livereload = require('gulp-livereload');
const sass = require('gulp-sass');
const hexrgba = require('postcss-hexrgba');

gulp.task('styles', function () {
    const processors = [
        precss(),
        postcssAutomath(),
        hexrgba(),
        autoprefixer({
            grid: true
        }),
        mqpacker({
            sort: sortCSSmq.desktopFirst
        }),
        cssNano()
    ];
   
    return gulp.src('lib/postcss/custom/custom.css')
    .pipe(postcss(processors))
    .pipe(notify('success'))
    .pipe(gulp.dest('client/css'))
    .pipe(livereload());
});

gulp.task('bootstrap', function () {
    return gulp.src('lib/postcss/bootstrap/bootstrap.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(notify('success'))
    .pipe(gulp.dest('client/css'))
    .pipe(livereload());
});

gulp.task('watch:styles', function () {
    livereload.listen();
    gulp.watch(['lib/postcss/custom/custom.css', 'lib/postcss/bootstrap/bootstrap.scss'], gulp.series(['styles', 'bootstrap']));
});