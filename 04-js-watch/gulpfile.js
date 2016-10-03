const gulp = require('gulp');
const less = require('gulp-less');
const concat = require('gulp-concat');
const sourcemap = require('gulp-sourcemaps');
const minifyCss = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
const gulpIf = require('gulp-if');
const del = require('del');
const sequence = require('gulp-sequence');

const development = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

gulp.task('style', () => {
  gulp.src('src/less/index.less')
    .pipe(gulpIf(development, sourcemap.init()))
    .pipe(less())
    .pipe(autoprefixer({ browsers: 'last 5 versions' }))
    .pipe(gulpIf(development, concat('style.css'), concat('style.min.css')))
    .pipe(gulpIf(!development, minifyCss()))
    .pipe(gulpIf(development, sourcemap.write()))
    .pipe(gulp.dest('public/css'))
});

gulp.task('images', () => {
  gulp.src('src/images/*.*')
    .pipe(gulp.dest('public/images'))
});

gulp.task('clean', () => {
  return del(['public/css', 'public/images']);
});

gulp.task('build', sequence('clean', ['style', 'images']));
