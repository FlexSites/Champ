var gulp = require('gulp')
  , hogan = require('../auto/gulp-hogan')
  , concat = require('gulp-concat')
  , uglify = require('gulp-uglify')
  , header = require('gulp-header')
  , footer = require('gulp-footer');


gulp.task('build', function(){
  gulp.src([
    'module.js',
    'resources/*.js',
    'controllers/*.js',
    'directives/*.js'
  ])
    .pipe(concat('sdk.js'))
    .pipe(hogan({
      delimiters: '<< >>',
      data: {
        resources: "['page','site','subscriber','order','event','entertainer','ticket','section','venue']"
      }
    }))
    .pipe(header('(function(window, angular, undefined) {"use strict";'))
    .pipe(footer('})(window, window.angular);'))
    .pipe(uglify())
    .pipe(gulp.dest('../global/public/ng/'));
});

gulp.task('default', function(){
  gulp.watch(['**/*.js','!build/*.js'], ['build']);
})