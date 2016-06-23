'use strict';

//=======================================================
// Include gulp
//=======================================================
var gulp = require('gulp');

//=======================================================
// Include Our Plugins
//=======================================================
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var sourcemaps  = require('gulp-sourcemaps');
var sync        = require('browser-sync');
var sassLint    = require('gulp-sass-lint');
var eslint      = require('gulp-eslint');
var babel       = require('gulp-babel');
var rename      = require('gulp-rename');
var imagemin    = require('gulp-imagemin');
var path        = require('path');
var del         = require('del');
var runSequence = require('run-sequence');
<% if (kssNode) { %>var kss         = require('kss');<% } %>

//=======================================================
// Compile Our Sass and JS
//=======================================================
gulp.task('compile', ['compile:sass', 'compile:js']);

// Compile Sass
gulp.task('compile:sass', function() {
  return gulp.src('./{global,layout,components}/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'nested' })
      .on('error', sass.logError))
    .pipe(prefix({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(rename(function (path) {
      path.dirname = '';
      return path;
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(sync.stream());
});

// Compile JavaScript ES2015 to ES5.
gulp.task('compile:js', function() {
  return gulp.src([
    './{global,layout,components}/**/*.js'
  ], { base: './' })
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(rename(function (path) {
      // Get the directory name and rename the file to match.
      var pathArray = path.dirname.split('/');
      var parentName = pathArray.slice(-1);
      path.dirname = '';
      path.basename = parentName[0] + '.bundle';
      return path;
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js'));
});

//=======================================================
// Lint Sass and JavaScript
//=======================================================
gulp.task('lint', ['lint:sass', 'lint:js']);

// Lint Sass based on .sass-lint.yml config.
gulp.task('lint:sass', function () {
  return gulp.src([
    './{global,layout,components}/**/*.scss',
    '!./global/utils/*'
  ])
    .pipe(sassLint())
    .pipe(sassLint.format());
});

// Lint JavaScript based on .eslintrc config.
gulp.task('lint:js', function () {
  return gulp.src([
    './{global,layout,components}/**/*.js'
  ])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('compress', function() {
  return gulp.src([
    './{global,layout,components}/**/*{.png,.svg}'
  ])
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }]
    }))
    .pipe(rename(function (path) {
      path.dirname = '';
      return path;
    }))
    .pipe(gulp.dest('./dist/assets'));
});
<% if (kssNode) { %>
//=======================================================
// Generate style guide
//=======================================================
gulp.task('styleguide', function() {
  return kss({
    source: [
      'global',
      'components'
    ],
    destination: './dist/style-guide',
    builder: 'style-guide/builder',
    namespace: '<%= themeNameMachine %>:' + __dirname + '/components/',
    'extend-drupal8': true,
    // The css and js paths are URLs, like '/misc/jquery.js'.
    // The following paths are relative to the generated style guide.
    css: [
      path.relative(
        __dirname + '/style-guide/',
        __dirname + '/css/global.css'
      )
    ],
    js: [
    ],
    homepage: 'style-guide.md',
    title: 'Style Guide'
  });
});
<% } %>
//=======================================================
// Clean all directories.
//=======================================================
<% if (kssNode) { -%>
gulp.task('clean', ['clean:css', 'clean:js', 'clean:styleguide']);

// Clean style guide files.
gulp.task('clean:styleguide', function () {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del([
    './dist/style-guide/*'
  ], {force: true});
});
<% } else { %>
gulp.task('clean', ['clean:css', 'clean:js']);
<% } -%>

// Clean CSS files.
gulp.task('clean:css', function () {
  return del([
    './dist/css/*'
  ], {force: true});
});

// Clean JS files.
gulp.task('clean:js', function () {
  return del([
    './dist/js/*'
  ], {force: true});
});

//=======================================================
// Watch and recompile sass.
//=======================================================
gulp.task('watch', function() {

  // BrowserSync proxy setup
  // Uncomment this and swap proxy with your local env url.
  // NOTE: for this to work in Drupal, you must install and enable
  // https://www.drupal.org/project/link_css. This module should
  // NOT be committed to the repo OR enabled on production.
  //
  // sync.init({
  //   open: false,
  //   proxy: 'http://test.mcdev'
  // });

  // Watch all my sass files and compile sass if a file changes.
  gulp.watch(
    './{global,layout,components}/**/*.scss',
    ['lint:sass', 'compile:sass']
  );

  // Watch all my JS files and compile if a file changes.
  gulp.watch([
    './{global,layout,components}/**/*.js'
  ], ['lint:js', 'compile:js']);
});
<% if (kssNode) { %>
//=======================================================
// Default Task
//
// runSequence runs 'clean' first, and when that finishes
// 'lint', 'compile', 'compress', 'styleguide' run
// at the same time.
//=======================================================
gulp.task('default', function(callback) {
  runSequence(
    'clean',
    ['lint', 'compile', 'compress', 'styleguide'],
    callback
  );
});
<% } else { %>
//=======================================================
// Default Task
//
// runSequence runs 'clean' first, and when that finishes
// 'lint', 'compile' and 'compress' run at the same time.
//=======================================================
gulp.task('default', function(callback) {
  runSequence(
    'clean',
    ['lint', 'compile', 'compress'],
    callback
  );
});
<% } -%>
