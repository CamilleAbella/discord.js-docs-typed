const gulp = require("gulp")
const tsc = require("gulp-typescript")

function build() {
  return gulp
    .src("src/**/*.ts")
    .pipe(tsc("tsconfig.json"))
    .pipe(gulp.dest("dist"))
}

function watch() {
  return gulp.watch("src/**/*.ts", build)
}

exports.build = build
exports.watch = gulp.series(build, watch)
