"use strict";

const {src, dest} = require('gulp');
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cssbeautify = require('gulp-cssbeautify');
const cssnano = require('gulp-cssnano');
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const rigger = require('gulp-rigger');
const sass = require('gulp-sass');
const removeComments = require('gulp-strip-css-comments');
const uglify = require('gulp-uglify');
const del = require('del');
const panini = require('panini');
const browsersync = require('browser-sync').create();

var path = {
  build: {
    html: 'dist/',
    js: 'dist/assets/js/',
    css: 'dist/assets/css/',
    images: 'dist/assets/img/'
  },
  src: {
    html: 'src/*.html',
    js: 'src/assets/js/*.js',
    css: 'src/assets/sass/main.sass',
    images: 'src/assets/img/**/*.{jpg,png,svg,gif,ico}'
  },
  watch: {
    html: 'src/**/*.html',
    js: 'src/assets/js/**/*.js',
    css: 'src/assets/sass/**/*.sass',
    images: 'src/assets/img/**/*.{jpg,png,svg,gif,ico}'
  },
  clean: './dist'
}

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: './dist/'
    },
    port: 3000
  });
}

function browserSyncReload(done) {
  browsersync.reload();
}

function html() {
  panini.refresh();
  return src(path.src.html, { base: 'src/' })
    .pipe(plumber())
    .pipe(panini({
      root: 'src/',
      layouts: 'src/templates/layouts/',
      partials: 'src/templates/partials/',
      helpers: 'src/templates/helpers/',
      data: 'src/templates/data/'
    }))
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
}

function css() {
  return src(path.src.css, { base: 'src/assets/sass/' })
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
      cascade: true,
      Browserslist: ['last 8 versions']
    }))
    .pipe(cssbeautify())
    .pipe(dest(path.build.css))
    .pipe(cssnano({
      zidnex: false,
      discardComments: {
        removeAll: true
      }
    }))
    .pipe(removeComments())
    .pipe(rename({
      suffix: ".min",
      extname: ".css"
    }))
    .pipe(dest(path.build.css));
}

function js() {
  return src(path.src.js, { base: 'src/assets/js/' })
    .pipe(plumber())
    .pipe(rigger())
    .pipe(gulp.dest(path.build.js))
    .pipe(uglify())
    .pipe(rename({
      suffix: ".min",
      extname: ".js"
    }))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
}

function images() {
  return src(path.src.images)
    .pipe(imagemin())
    .pipe(dest(path.build.images));
}

function clean() {
  return del(path.clean);
}

function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.images], images);
}

const build = gulp.series(clean, gulp.parallel(html, css, js, images));
const watch = gulp.parallel(build, watchFiles, browserSync);

exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;