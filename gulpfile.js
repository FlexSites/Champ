var gulp = require('gulp')
  , hogan = require('../auto/gulp/gulp-hogan')
  , concat = require('gulp-concat')
  , uglify = require('gulp-uglify')
  , header = require('gulp-header')
  , footer = require('gulp-footer');

var path = require('path')
  , glob = require('glob')
  , Flex = require('../auto/gulp/gulp-resource');

  var buildFiles = [
    'module.js',
    'controllers/*.js',
    'directives/*.js',
    'services/*.js'
  ];
  var allResources = ['user','page','post','site','contactMessage','testimonial','subscriber','showtime','medium','order','event','entertainer','ticket','section','venue'];

gulp.task('build', function(){
  var env = Flex.getEnv();
  if(env === 'prod') env = '';

  glob.sync('resources/*.js').map(function(resource){
    var idx = allResources.indexOf(path.basename(resource,'.js').toLowerCase());
    if(~idx){
      console.log('removed', resource);
      allResources.splice(idx,1);
    }
    buildFiles.push(resource);
  });
  gulp.src(buildFiles)
    .pipe(concat('sdk.js'))
    .pipe(hogan({
      delimiters: '<< >>',
      data: {
        env: env,
        resources: JSON.stringify(allResources)
      }
    }))
    // .pipe(header('(function(window, angular, undefined) {"use strict";'))
    // .pipe(footer('})(window, window.angular);'))
    // .pipe(uglify())
    .pipe(gulp.dest('../sites/flexsites.io/public/ng'));
});

gulp.task('default', function(){
  gulp.watch(['**/*.js','!build/*.js','!gulpfile.js'], ['build']);
});
