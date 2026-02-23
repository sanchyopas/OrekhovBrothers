import replace from "gulp-replace";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import browsersync from "browser-sync";
import modRewrite from "connect-modrewrite";
import newer from "gulp-newer";
import through2 from 'through2';


export const plugins = {
  replace: replace,
  plumber: plumber,
  notify: notify,
  browsersync: browsersync,
  modRewrite: modRewrite,
  newer: newer,
  through2
}