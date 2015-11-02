'use strict';

var gulp = require('gulp');
var fs = require('fs');

/**
 *  This will load all js files in the gulp-tasks directory
 */
fs.readdirSync('gulp-tasks').forEach(function(file) {
  require('./gulp-tasks/' + file);
});

gulp.task('default', gulp.parallel(['server:default', 'client:default']));
gulp.task('test', gulp.parallel(['server:test']));
gulp.task('dist', gulp.parallel(['server:dist', 'client:dist']));
