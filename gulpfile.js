const gulp = require('gulp');
const minify = require('gulp-minify');
const sass = require('gulp-sass');
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const cssmin = require('gulp-cssmin');

gulp.task("directories", () => {
  gulp.src("*.*", {
      read: false
    })
    .pipe(gulp.dest("./dist"))
    .pipe(gulp.dest("./dist/css"))
    .pipe(gulp.dest("./dist/img"))
    .pipe(gulp.dest("./dist/js"));
});

gulp.task("fonts", () => {
  gulp.src("./src/font/roboto/*")
    .pipe(gulp.dest("./dist/framework/font/roboto"));
});

gulp.task("html", () => {
  gulp.src("./src/index.html")
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest("./dist/"))
    .pipe(browserSync.stream());
});

gulp.task("sass", () => {
  gulp.src("./src/sass/*.sass")
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 10 versions'],
      cascade: false
    }))
    .pipe(cssmin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream());
});

gulp.task("js", () => {
  gulp.src("./src/js/*.js")
    .pipe(minify())
    .pipe(gulp.dest("./dist/js"))
    .pipe(browserSync.stream());
});

gulp.task("image", () => {
  gulp.src("./src/img/*")
    .pipe(imagemin())
    .pipe(gulp.dest("./dist/img"));
});

gulp.task("deploy", ['html', 'sass', 'js', 'fonts', 'image'], () => {
  console.log('Successfully!');
});

gulp.task("watch", () => {
  gulp.watch("./src/index.html", ["html"])
  gulp.watch("./src/sass/*.sass", ["sass"])
  gulp.watch("./src/js/*.js", ["js"])
});

gulp.task("default", ["watch"], () => {
  browserSync.init({
    server: {
      baseDir: "./dist"
    },
    notify: false
  })
});