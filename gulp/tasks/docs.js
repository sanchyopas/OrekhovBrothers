export const docs = () => {
  return app.gulp
    .src(app.path.src.docs)
    .pipe(app.gulp.src(app.path.src.docs))
    .pipe(app.gulp.dest(app.path.build.docs));
};