var gulp = require('gulp');
var eslint = require('gulp-eslint');
var nodemon = require('gulp-nodemon');
var mocha = require('gulp-spawn-mocha');

gulp.task('server:lint', function() {
  return gulp.src(['server/app.js', 'server/src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('server:lint-dev', function() {
  return gulp.src(['server/app.js', 'server/src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
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

gulp.task('server:test', function() {
  return gulp.src(['test/server/*.js'], {
      read: false
    })
    .pipe(mocha({
      R: 'spec',
      istanbul: {
        print: 'both'
      }
    }));
});

/* Main Tasks for server */
gulp.task('server:default', gulp.series(['server:lint-dev', 'server:serve', 'server:watch']));
gulp.task('server:dist', gulp.series(['server:lint', 'server:build']));
