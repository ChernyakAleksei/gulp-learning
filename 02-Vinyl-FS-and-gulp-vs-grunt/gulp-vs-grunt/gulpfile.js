gulp.task('sass', () => {
  gulp.src('dev/*.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest('css/styles'));
});
gulp.task('default', () => {
  gulp.run('sass');
  gulp.watch('dev/*.scss', () => gulp.run('sass'));
});
