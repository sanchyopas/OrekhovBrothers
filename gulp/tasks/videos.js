import fs from 'node:fs';
import * as nodePath from 'node:path';

import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from 'ffmpeg-static';

ffmpeg.setFfmpegPath(ffmpegInstaller);

export const videos = () => {
  const { plugins, gulp, path } = app;

  return gulp
    .src(`${path.srcFolder}/video/**/*.*`)
    .pipe(
      plugins.plumber(
        plugins.notify.onError({
          title: 'VIDEOS',
          message: 'Error: <%= error.message %>',
        })
      )
    )
    .pipe(
      plugins.through2.obj(function (file, _, cb) {
        const relative = nodePath.relative(path.srcFolder, file.path);
        const output = nodePath.join(path.buildFolder, relative).replace(/\.[^/.]+$/, '.mp4');

        const outputDir = nodePath.dirname(output);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        ffmpeg(file.path)
          .videoCodec('libx264')
          .outputOptions('-preset', 'slow')
          .outputOptions('-crf', '28')
          .size('?x1080')
          .save(output)
          .on('end', () => cb())
          .on('error', (err) => cb(err));
      })
    );
};