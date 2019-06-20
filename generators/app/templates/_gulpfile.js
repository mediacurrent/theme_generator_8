/*eslint strict: ["error", "global"]*/
'use strict';

// Include gulp helpers.
const { series, parallel, watch } = require('gulp');

// Include Our tasks.
//
// Each task is broken apart to it's own node module.
// Check out the ./gulp-tasks directory for more.
const { compileSass, compileJS } = require('./gulp-tasks/compile.js');
const { lintJS, lintSass } = require('./gulp-tasks/lint.js');
const { compressAssets } = require('./gulp-tasks/compress.js');
const { cleanCSS, cleanJS } = require('./gulp-tasks/clean.js');
const { concatCSS } = require('./gulp-tasks/concat.js');
const { moveFonts, movePatternCSS } = require('./gulp-tasks/move.js');

// Compile Our Sass and JS
exports.compile = parallel(compileSass, compileJS, moveFonts, movePatternCSS);

// Lint Sass and JavaScript
exports.lint = parallel(lintSass, lintJS);

// Compress Files
exports.compress = compressAssets;

// Concat all CSS files into a master bundle.
exports.concat = concatCSS;

// Clean all directories.
exports.clean = parallel(cleanCSS, cleanJS);

/**
 * Watch Sass and JS files.
 * @returns {undefined}
 */
function watchFiles() {
  // Watch all my sass files and compile sass if a file changes.
  watch(
    './src/patterns/**/**/*.scss',
    series(parallel(lintSass, compileSass), concatCSS)
  );

  // Watch all my JS files and compile if a file changes.
  watch('./src/patterns/**/**/*.js', parallel(lintJS, compileJS));
}

exports.watch = watchFiles;

// Default Task
exports.default = series(
  parallel(cleanCSS, cleanJS),
  parallel(
    lintSass,
    compileSass,
    lintJS,
    compileJS,
    compressAssets,
    moveFonts,
    movePatternCSS
  ),
  concatCSS
);
