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
      './src/patterns/{00-global,layout,01-components}/**/*.scss',
      '!./src/patterns/00-global/utils/*'
    ])
      .pipe(sassLint())
      .pipe(sassLint.format());
  },

  // Lint JavaScript based on .eslintrc config.
  lintJS: function() {
    return src([
      './src/patterns/{00-global,layout,01-components}/**/*.js',
      '!./src/patterns/01-components/**/vendors/*'
    ])
      .pipe(eslint())
      .pipe(eslint.format());
  }
};
