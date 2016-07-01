'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var inject = require('gulp-inject');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var cleanCss = require('gulp-clean-css');
var templateCache = require('gulp-angular-templatecache');
var angularFilesort = require('gulp-angular-filesort');
var ngAnnotate = require('gulp-ng-annotate');
var filter = require('gulp-filter');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var browserSync = require('browser-sync');
var proxy = require('http-proxy-middleware');
var os = require('os');

gulp.task('client:lint', function() {
  return gulp.src(['client/app/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('client:lint-dev', function() {
  return gulp.src(['client/app/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
});

gulp.task('client:template', function() {
  return gulp.src(['client/app/**/*.html'])
    .pipe(templateCache('app.tpl.js', {
      root: 'app',
      module: 'appTemplates',
      standalone: true
    }))
    .pipe(gulp.dest('.tmp/'));
});

gulp.task('client:inject', function() {
  return gulp.src('client/index.html')
    .pipe(inject(gulp.src(['client/**/*.js', '.tmp/*.tpl.js']).pipe(angularFilesort()), {
      ignorePath: ['client', '.tmp'],
      addRootSlash: false
    }))
    .pipe(gulp.dest('.tmp/'));
});

gulp.task('client:copy-i18n', function() {
  return gulp.src('bower_components/angular-i18n/*.js')
    .pipe(gulp.dest('.tmp/i18n/angular'));
});

gulp.task('client:serve', function(cb) {

  // Proxy Middleware to Express app
  var proxyServer = proxy('/api', {
    target: 'http://localhost:3002'
  });

  browserSync.instance = browserSync.init({
    startPath: '/',
    server: {
      baseDir: ['.tmp/', 'client'],
      middleware: [proxyServer],
      routes: {
        '/bower_components': 'bower_components'
      }
    },
    //browser: ['google chrome', 'firefox', 'internet explorer'],
    browser: (os.platform() === 'linux' ? ['google-chrome'] : ['google chrome'])
  }, cb);
});

// Properly reload the browser
function reload(done) {
  browserSync.reload();
  done();
}

gulp.task('client:watch', function() {
  gulp.watch('client/*.html', gulp.series(['client:inject'], reload));
  gulp.watch('client/app/**/*.html', gulp.series(['client:template', 'client:inject'], reload));
  gulp.watch('client/app/**/*.js', gulp.series(['client:lint-dev', 'client:inject'], reload));
  gulp.watch('client/**/*.css', reload);
  gulp.watch('client/i18n/*.json', reload);
});

gulp.task('client:build', function() {
  var jsFilter = filter('**/*.js', {
    restore: true
  });
  var cssFilter = filter('**/*.css', {
    restore: true
  });
  return gulp.src('.tmp/index.html')
    .pipe(useref())
    .pipe(jsFilter)
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(rev())
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(cleanCss())
    .pipe(rev())
    .pipe(cssFilter.restore)
    .pipe(revReplace())
    .pipe(gulp.dest('dist/public'));
});

gulp.task('client:copy-i18n-dist', gulp.parallel([
  function copyAngulari18n() {
    return gulp.src('bower_components/angular-i18n/*.js')
      .pipe(gulp.dest('dist/public/i18n/angular'));
  },
  function copyAppi18n() {
    return gulp.src('client/i18n/*.json')
      .pipe(gulp.dest('dist/public/i18n'));
  }
]));

gulp.task('client:copy-fonts-dist', gulp.parallel([
  function copyBootstrapFonts() {
    return gulp.src('bower_components/bootstrap/dist/fonts/*')
      .pipe(gulp.dest('dist/public/fonts'));
  }
]));

/* Main Tasks for client */
gulp.task('client:default', gulp.series(['client:lint-dev', 'client:template', 'client:inject', 'client:copy-i18n', 'client:serve', 'client:watch']));
gulp.task('client:dist', gulp.series(['client:lint', 'client:template', 'client:inject', 'client:copy-i18n-dist', 'client:copy-fonts-dist', 'client:build']));
