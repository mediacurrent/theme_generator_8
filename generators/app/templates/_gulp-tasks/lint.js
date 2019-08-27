/*eslint strict: ["error", "global"]*/
'use strict';

// Include gulp
const { src } = require('gulp');

// Include Our Plugins
const sassLint = require('gulp-sass-lint');
const eslint = require('gulp-eslint');

// Export our tasks.
module.exports = {
  // Lint Sass based on .sass-lint.yml config.
  lintSass: function() {
    return src([
      './src/patterns/{global,layout,components}/**/*.scss',
      '!./src/patterns/global/utils/*'
    ])
      .pipe(sassLint())
      .pipe(sassLint.format());
  },

  // Lint JavaScript based on .eslintrc config.
  lintJS: function() {
    return src([
      './src/patterns/{global,layout,components}/**/*.js',
      '!./src/patterns/components/**/vendors/*'
    ])
      .pipe(eslint())
      .pipe(eslint.format());
  }
};
