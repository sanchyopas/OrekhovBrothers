export const htaccess = () => {
  return app.gulp
    .src(app.path.src.htaccess)
    .pipe(app.gulp.src(app.path.src.htaccess))
    .pipe(app.gulp.dest(app.path.build.htaccess));
};