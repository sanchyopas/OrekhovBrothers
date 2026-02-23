import webp from 'gulp-webp';
import imagemin, { gifsicle, optipng, svgo } from 'gulp-imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
// import imagemin from "gulp-imagemin";

export const images = () => {
  return app.gulp
    .src(app.path.src.images)
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: 'IMAGES',
          message: 'Error: <%= error.message %>',
        })
      )
    )
    .pipe(app.plugins.newer(app.path.build.images))
    .pipe(webp())
    .pipe(app.gulp.dest(app.path.build.images))
    .pipe(app.gulp.src(app.path.src.images))
    .pipe(app.plugins.newer(app.path.build.images))
    .pipe(
      imagemin([
        gifsicle({ interlaced: true }),
        imageminMozjpeg({ quality: 80, progressive: true }),
        optipng({ optimizationLevel: 1 }),
        svgo({
          plugins: [
            {
              name: 'removeViewBox',
              active: false,
            },
          ],
        }),
      ])
    )
    .pipe(app.gulp.dest(app.path.build.images))
    .pipe(app.gulp.src(app.path.src.svg))
    .pipe(app.gulp.dest(app.path.build.images))
    .pipe(app.plugins.browsersync.stream());
};
