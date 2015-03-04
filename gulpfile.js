var gulp = require('gulp')
  , hogan = require('../auto/gulp-hogan')
  , concat = require('gulp-concat')
  , uglify = require('gulp-uglify')
  , header = require('gulp-header')
  , footer = require('gulp-footer');

var path = require('path');

var glob = require('glob');


gulp.task('build', function(){
  var buildFiles = [
    'module.js',
    'controllers/*.js', 
    'directives/*.js',
    'services/*.js' 
  ];


  var allResources = ['user','page','site','subscriber','order','event','entertainer','ticket','section','venue'];

  var customResources = glob.sync('resources/*.js').map(function(resource){
    var idx = allResources.indexOf(path.basename(resource,'.js').toLowerCase());
    if(~idx){
      console.log('removed', resource);
      allResources.splice(idx,1);
    }
    buildFiles.push(resource);
  });
    console.log('build files', buildFiles, allResources);
  gulp.src(buildFiles)
    .pipe(concat('sdk.js')) 
    .pipe(hogan({ 
      delimiters: '<< >>',
      data: {
        env: 'local',
        resources: JSON.stringify(allResources)
      }
    }))
    // .pipe(header('(function(window, angular, undefined) {"use strict";'))
    // .pipe(footer('})(window, window.angular);'))
    // .pipe(uglify())
    .pipe(gulp.dest('../global/ng/'));
});

gulp.task('default', function(){
  gulp.watch(['**/*.js','!build/*.js','!gulpfile.js'], ['build']);
})