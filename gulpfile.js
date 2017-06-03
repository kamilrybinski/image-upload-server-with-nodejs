var gulp = require('gulp');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minify = require('gulp-minify-css');
var runSequence = require('run-sequence');

/****************************************************
 * CONFIG
 ****************************************************/
var config = require('./gulp/config.json');


/****************************************************
 * LIVE CONNTECT AND RELOAD
 ****************************************************/
gulp.task('connect', function() {
    connect.server({
        root: ['.'],
        port: 9000,
        livereload: true
    });
});

gulp.task('reload', function() {
    return gulp.src(config.all.reload_all)
        .pipe(connect.reload());
});


/****************************************************
 * SCSS, CSS
 ****************************************************/

// compile sass
gulp.task('compile-sass', function () {
    return gulp.src(config.css.app.sassMainFile)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(config.css.app.cssDest));
});

// autoprefixer
gulp.task('autoprefixer', function () {
    return gulp.src(config.css.app.cssMainFile)
        .pipe(sourcemaps.init())
        .pipe(postcss([
            autoprefixer(config.css.app.autoprefixerOptions)
        ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.css.app.cssDest));
});

// concat and minify css vendors files
gulp.task('compile-css-vendors', function() {
    return gulp.src(config.css.vendors.files)
        .pipe(concat(config.css.vendors.minifiedFilename))
        .pipe(minify(config.css.vendors.minifyOptions))
        .pipe(gulp.dest(config.css.vendors.cssDestBuild));
});

// concat and minify css app files
gulp.task('compile-css-app', function() {
    return gulp.src(config.css.app.files)
        .pipe(concat(config.css.app.minifiedFilename))
        .pipe(minify(config.css.app.minifyOptions))
        .pipe(gulp.dest(config.css.app.cssDestBuild))
        .pipe(connect.reload());
});

// build css
gulp.task('build-css-no-vendors', function() {
    runSequence(['compile-sass'], ['autoprefixer'], ['compile-css-app']);
});

gulp.task('build-css', function() {
    runSequence(['compile-sass'], ['autoprefixer'], ['compile-css-app'], ['compile-css-vendors']);
});


/****************************************************
 * SCRIPTS
 ****************************************************/

// vendors
gulp.task('compile-js-vendors', function(){
    return gulp.src(config.js.vendors.files)
        .pipe(concat(config.js.vendors.minifiedFilename))
        .pipe(uglify())
        .pipe(gulp.dest(config.js.vendors.destBuild));
});

// app
gulp.task('compile-js-app', function(){
    return gulp.src(config.js.app.files)
        .pipe(concat(config.js.app.minifiedFilename))
        .pipe(uglify())
        .pipe(gulp.dest(config.js.app.destBuild))
        .pipe(connect.reload());
});

// build js
gulp.task('build-js', function() {
    runSequence(['compile-js-vendors'], ['compile-js-app']);
});


/****************************************************
 * BUILD APP
 ****************************************************/
gulp.task('build-app', function() {
    runSequence(['build-css'], ['build-js']);
});


/****************************************************
 * WATCH
 ****************************************************/
gulp.task('watch', function() {
    gulp.watch(config.html.watchFiles, ['reload']);
    gulp.watch(config.css.app.watchFiles, ['build-css-no-vendors']);
    gulp.watch(config.js.app.watchFiles, ['compile-js-app']);
});


/****************************************************
 * TASKS
 ****************************************************/
gulp.task('default', ['watch', 'connect']);

// build css and js files
gulp.task('build', ['build-app']);