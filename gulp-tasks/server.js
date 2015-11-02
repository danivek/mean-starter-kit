var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var stylish = require('gulp-jscs-stylish');
var nodemon = require('gulp-nodemon');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');

gulp.task('server:lint', function() {
  return gulp.src(['server/app.js', 'server/src/**/*.js'])
    .pipe(jshint()) // jshint
    .pipe(jscs()) // enforce style guide
    .pipe(stylish.combineWithHintResults())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('server:lint-dev', function() {
  return gulp.src(['server/app.js', 'server/src/**/*.js'])
    .pipe(jshint()) // jshint
    .pipe(jscs()) // enforce style guide
    .pipe(stylish.combineWithHintResults())
    .pipe(jshint.reporter('jshint-stylish'))
});

gulp.task('server:build', function() {
  return gulp.src(['server/**/*', '!.jshintrc'], {
      base: './'
    })
    .pipe(gulp.dest('dist'));
});

gulp.task('server:serve', function(cb) {
  var called = false;
  return nodemon({
      script: 'server/app.js',
      nodeArgs: ['--debug'],
      watch: ['server/'],
      ext: 'js'
    })
    //.on('restart', ['server:lint-dev'])
    .on('start', function() {
      if (!called) {
        called = true;
        cb();
      }
    });
});

gulp.task('server:watch', function() {
  gulp.watch('server/**/*.js', gulp.series(['server:lint-dev']));
});

gulp.task('server:test', function(cb) {
  gulp.src(['server/app.js', 'server/src/**/*.js'])
    .pipe(istanbul()) // Covering files
    .pipe(istanbul.hookRequire()) // Force `require` to return covered files
    .on('finish', function() {
      gulp.src(['test/server/*.js'])
        .pipe(mocha())
        .pipe(istanbul.writeReports()) // Creating the reports after tests ran
        .pipe(istanbul.enforceThresholds({
          thresholds: {
            global: 50
          }
        })) // Enforce a coverage of at least 50%
        .on('end', function() {
          cb();
          process.exit();
        });
    });
});

/* Main Tasks for server */
gulp.task('server:default', gulp.series(['server:lint-dev', 'server:serve', 'server:watch']));
gulp.task('server:dist', gulp.series(['server:lint', 'server:test', 'server:build']));
