import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import concatLib from 'gulp-concat';
import header from 'gulp-header';
import footer from 'gulp-footer';
import { sync as del } from 'rimraf';
import uglify from 'gulp-uglify';

let src = ['module.js', '**/*.js'];
let cwd = 'src';
let dest = 'lib';
let es6 = babel({
  presets: ['babel-preset-es2015']
});
let concat = concatLib('sdk.js')


gulp.task('default', ['watch']);

gulp.task('watch', ['build:dev'], () => {
  return gulp.watch(src, ['build:dev']);
});

gulp.task('build:dev', () => {
  return gulp.src(src, { cwd })
    .pipe(es6)
    .pipe(concat)
    .pipe(gulp.dest(dest));
})
;
gulp.task('build', ['clean'], () => {
  return gulp.src(src, { cwd })
    .pipe(sourcemaps.init())
    .pipe(concat)
    .pipe(es6)
    .pipe(header('(function(angular){\n'))
    .pipe(footer('\n}(window.angular));'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dest));
});

gulp.task('clean', () => {
  return del(dest);
});
