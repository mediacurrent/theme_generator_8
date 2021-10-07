'use strict';

// Include gulp
const { src } = require('gulp');

// Include Our Plugins
const gulpStylelint = require('gulp-stylelint');
const eslint = require('gulp-eslint');

// Export our tasks.
module.exports = {
  // Lint Sass based on .stylelintrc.yml config.
  lintSass: function () {
    return src([
      './src/patterns/{global,layout,components}/**/*.scss',
      './src/styleguide/*.scss',
      '!./src/patterns/global/utils/*'
    ])
      .pipe(
        gulpStylelint({
          reporters: [
            {
              formatter: 'string',
              console: true
            }
          ]
        })
      );
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
