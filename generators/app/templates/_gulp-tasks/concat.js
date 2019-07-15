/*eslint strict: ["error", "global"]*/
'use strict';

// Include gulp
const { src, dest } = require('gulp');

//=======================================================
// Include Our Plugins
//=======================================================
var concat = require('gulp-concat');
var order = require('gulp-order');

// Export our tasks.
module.exports = {
  // Concat all CSS into a master bundle.
  concatCSS: function() {
    return (
      src(['./dist/css/*.css'])
        // Reorder the files so global is first.
        // If you need to get fancier with the order here's an example:
        // .pipe(order([
        //   'dist/css/global.css',
        //   'src/components/**/*.css',
        //   'dist/css/btn.css',
        //   'dist/css/form-item.css',
        //   'dist/css/form-float-label.css',
        //   'dist/css/*.css'
        // ], { base: './' }))
        .pipe(order(['dist/css/global.css', 'dist/css/*.css'], { base: './' }))
        .pipe(concat('all.css'))
        .pipe(dest('./dist/css'))
    );
  }
};
